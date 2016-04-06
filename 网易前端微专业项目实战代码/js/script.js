var $id = function (id) {
	return document.getElementById(id);
}
var $class = function (className) {
	var classArr = [];
	var tags = document.getElementsByTagName('*');
	for (var item in tags) {
		if (tags[item].nodeType == 1) {
			if (tags[item].getAttribute('class') == className) {
				classArr.push(tags[item]);
			}
		}
	}
	return classArr;
}

// 设置cookie的有效时间
function setCookietime (days) {
	var date = new Date();
	date.setTime(date.getTime() + days * 24 * 3600 * 1000);
	return date;
}
// 设置cookie
function setCookie (name, value, expires, path, domain, secure) {
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires)
        cookie += '; expires=' + expires.toGMTString();
    if (path)
        cookie += '; path=' + path;
    if (domain)
        cookie += '; domain=' + domain;
    if (secure)
        cookie += '; secure=' + secure;
    document.cookie = cookie;
}
// 获取cookie
function getCookie () {
    var cookie = {};
    var all = document.cookie;
    if (all === '')
        return cookie;
    var list = all.split('; ');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}
// 移除cookie
function removeCookie (name, path, domain) {
    setCookie(name, '', 0, path, domain);
}

// 设置透明度
function setOpacity (elem, level) {
	if (elem.filters) {
		elem.style.filter = 'alpha(opacity=' + level + ')';
	} else {
		elem.style.opacity = level / 100;
	}
}
// 淡入处理函数
function fadeIn (elem) {
	setOpacity(elem, 0); // 初始全透明
	for (var i = 0; i <= 20; i++) { // 透明度改变 20 * 5 = 100
		(function () {
			var level = i * 5;  // 透明度每次变化值
			setTimeout(function() {
				setOpacity(elem, level)
			},i*25); // i * 25 即为每次改变透明度的时间间隔，自行设定
		})(i);     // 每次循环变化一次
	}
}
// 淡出处理函数
function fadeOut (elem) {
	for(var i = 0;i<=20;i++) { // 透明度改变 20 * 5 = 100
		(function () {
			var level = 100 - i * 5; // 透明度每次变化值
			setTimeout(function () {
				setOpacity(elem, level)
			},i*25); // i * 25 即为每次改变透明度的时间间隔，自行设定
		})(i);     // 每次循环变化一次
	}
}
// 判断obj是否有此class
function hasClass (obj, cls) {  // class位于单词边界
	return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
// 给obj添加class
function addClass (obj, cls) {
	if (!this.hasClass(obj, cls)) {
		obj.className += cls;
	}
}
// 移除obj对应的class
function removeClass (obj, cls) {
	if (hasClass(obj, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		obj.className = obj.className.replace(reg, '');
	}
}

// 封装ajax
function ajax (obj) {
    var xhr = (function () {
        if (typeof XMLHttpRequest != 'undefined') {
            return new XMLHttpRequest();
        } else if (typeof ActiveXObject != 'undefined') {
            var version = [
                'MSXML2.XMLHttp.6.0',
                'MSXML2.XMLHttp.3.0',
                'MSXML2.XMLHttp'
            ];
            for (var i = 0; version.length; i++) {
                try {
                    return new ActiveXObject(version[i]);
                } catch (e) {
                    // 跳过
                }
            }
        } else {
            throw new Error('您的系统或浏览器不支持XHR对象！');
        }
    })();
    obj.url = obj.url + '?rand=' + Math.random();
    obj.data = (function (data) {
        var arr = [];
        for (var i in data) {
            arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
        }
        return arr.join('&');
    })(obj.data);
    if (obj.method === 'get') obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data;
    if (obj.async === true) {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                callback();
            }
        };
    }
    xhr.open(obj.method, obj.url, obj.async);
    if (obj.method === 'post') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(obj.data);
    } else {
        xhr.send(null);
    }
    if (obj.async === false) {
        callback();
    }

    function callback() {
        if (xhr.status == 200) {
            obj.success(xhr.responseText); // 回调传递参数
        } else {
            alert('获取数据错误!错误代号:' + xhr.status + ',错误信息:' + xhr.statusText);
        }
    }
}

// 与DOM相关的操作要在页面加载完全之后执行
window.onload = function () {
	/**
	 * 顶部提示栏
	 */
	var topinfo = $id('topInfo');
	var rightinfo = $id('rightInfo');
	// 点击不再提醒,设置cookie,有效时间为30天
	rightInfo.addEventListener('click', function () {
		var expiresDays = 30;
		var date = setCookietime(expiresDays);
		setCookie('setInfo', 'noshow', date);
		topinfo.style.display = 'none';
	});
	// 判断cookie是否存在
	function judgeCookie () {
		var cookie = getCookie()['setInfo'];
		if (cookie == 'noshow') {
			topinfo.style.display = 'none';
		} else {
			topinfo.style.display = 'block';
		}
	}
	judgeCookie();
	
	/**
	 * 导航栏关注模块
	 */
	// 设置登录的cookie有效时间为7天
	var LOGINDAYS = 7;
	var LOGINTIME = setCookietime(LOGINDAYS);
	// 设置关注的cookie有效时间为365天
	var FOLLOWDAYS = 365;
	var FOLLOWTIME = setCookietime(FOLLOWDAYS);
	// 获取节点
	var navAtten = $id('navAtten');
	var navAttened = $id('navAttened');
	var modelLogin = $id('m-login');
	var formdata = $id('formdata');
	var username = $id('username');
	var password = $id('password');
	var submit = $id('submit');
	var fail = $id('fail');
	var navFans = $id('navFans');
	var fansNum = $id('fansNum');
	var exit = $id('exit');
	var cancel = $id('cancel');

	// 初始检测是否已登录已关注
	function initialCheck () {
		var followcookie = getCookie()['followSuc'];
		if (followcookie == 'yes') {
			navAtten.style.display = 'none';
			navAttened.style.display = 'block';
			navFans.style.left = '385px';
        	fansNum.innerHTML = parseInt(fansNum.innerHTML) + 1;
		}
	}
	initialCheck();
	// 点击关注按钮
	navAtten.addEventListener('click', function () {
		checkLogin();
	});
	// 检测登录的loginSuc的cookie是否存在
	function checkLogin () {
		var cookie = getCookie()['loginSuc'];
		if (cookie == 'yes') {
			checkFollow();	
		} else {
			modelLogin.style.display = 'block';
		}
	}
	// 检测followSuc的cookie是否存在
	function checkFollow () {
		var cookie = getCookie()['followSuc'];
		if (cookie == 'yes') {
			navAtten.style.display = 'none';
			navAttened.style.display = 'block';
			navFans.style.left = '385px';
	        fansNum.innerHTML = parseInt(fansNum.innerHTML) + 1;
		} else {
			ajaxAttention();
		}
	}
	// 点击登录按钮
	submit.addEventListener('click', function () {
		if (username.value == '' || password.value == '') {
			fail.innerText = '账号密码不能为空';
		} else {
			ajaxLogin();
		}
	});
	// 关注前未登录时，ajax登录
	function ajaxLogin () {
		ajax({
			method: 'get',
			url: 'http://study.163.com/webDev/login.htm',
			data: {
				'userName': hex_md5(username.value),
				'password': hex_md5(password.value)
			},

			success: function(data) {
				if (data == 1) {
					setCookie('loginSuc', 'yes', LOGINTIME);
					modelLogin.style.display = 'none';
					var followcookie = getCookie()['followSuc'];
					if (followcookie == 'yes') {
						cancelCheckFollow();
					} else {
						ajaxAttention();	
					}
				} else if (data == 0) {
					fail.innerText = '账号不存在或账号密码错误';
				}
			},
			async: true
		});
	}
	// ajax获取关注返回信息
	function ajaxAttention () {
		ajax({
			method: 'get',
			url: 'http://study.163.com/webDev/attention.htm',
			success: function(data) {
				if (data == 1) {
					setCookie('followSuc', 'yes', FOLLOWTIME);
				}
				checkFollow();
			},
			async: true
		});
	}
	// 关注成功后点击取消按钮取消关注
	cancel.addEventListener('click', function () {
		cancelCheckLogin();
	});
	// 取消关注时检查是否登录
	function cancelCheckLogin () {
		var logincookie = getCookie()['loginSuc'];
		if (logincookie == 'yes') {
			cancelCheckFollow();	
		} else {
			modelLogin.style.display = 'block';
		}
	}
	// 取消关注前检查followSuc的cookie
	function cancelCheckFollow () {
		var followcookie = getCookie()['followSuc'];
		if (followcookie == 'yes') {
			navAtten.style.display = 'block';
			navAttened.style.display = 'none';
			navFans.style.left = '333px';
			fansNum.innerHTML = parseInt(fansNum.innerHTML) - 1;
			removeCookie('followSuc');
		} else {
			navAtten.style.display = 'block';
			navAttened.style.display = 'none';
			navFans.style.left = '333px';
			fansNum.innerHTML = parseInt(fansNum.innerHTML) - 1;
		}

	}
	// 点出X按钮退出登录框
	exit.addEventListener('click', function () {
		fail.innerText = '';
		modelLogin.style.display = 'none';
	});

	/**
	 * 轮播头图
	 */
	var CURRENT = 0 // 当前图片索引
	var DURATION = 5000;// 单张图片停留时间

	var imgwrap = $id('imgWrap');
	var imgs = imgwrap.children;
	var imgLen = imgs.length;
	var pointerwrap = $id('pointerWrap');
	var pointers = pointerwrap.children;
	// 定时器自动变换5秒每次
	var autoChange = setInterval(function () {
		if(CURRENT < imgLen - 1){
			CURRENT ++;
		}else{
			CURRENT = 0;
		}
		// 调用变换处理函数
		changeTo(CURRENT);
	}, DURATION);
	// 变换处理函数
	function changeTo (num) { 
		// 设置image
		var curImg = $class('imgOn')[0];
		fadeOut(curImg); // 淡出当前 image
		removeClass(curImg, 'imgOn');
		addClass(imgs[num], 'imgOn');
		fadeIn(imgs[num]); // 淡入目标 image

		// 设置image的控制下标 pointer
		var _curIndex = $class('pointerOn')[0];
		removeClass(_curIndex, 'pointerOn');
		addClass(pointers[num], 'pointerOn');
	}
	// 给右下角的图片index添加事件处理
	function addEvent () {
		for (var i = 0; i < imgLen; i++) {
			// 闭包防止作用域内活动对象item的影响
			(function (_i) {
				// 鼠标滑到该页图上，清除定时器，停止播放
				imgs[_i].onmouseover = function () {
					clearTimeout(autoChange);
					CURRENT = _i;
				};
				// 鼠标滑出，则重置定时器，继续播放
				imgs[_i].onmouseout = function () {
					autoChange = setInterval(function () {
						if (CURRENT < imgLen - 1) {
							CURRENT++;
						} else {
							CURRENT = 0;
						}
						// 调用变换处理函数
						changeTo(CURRENT);
					}, DURATION);
				};
				// 鼠标点击则清除定时器，并作变换处理
				pointers[_i].onclick= function () {
					clearTimeout(autoChange);
					changeTo(_i);
					CURRENT = _i;
					autoChange = setInterval(function () {
						if (CURRENT < imgLen - 1) {
							CURRENT++;
						} else {
							CURRENT = 0;
						}
						// 调用变换处理函数
						changeTo(CURRENT);
					}, DURATION);
				};
			})(i);
		}
	}
	addEvent();

	/**
	 * 视频
	 */
	var videoShow = $id('videoShow');
	var videoPlayer = $id('videoPlayer');
	var videoexit = $id('videoexit');
	var videoImg = $id('videoImg');
	var videobtn = $id('videobtn');
	var playerVideo = $id('playerVideo');

	videoShow.addEventListener('click', function () {
		videoPlayer.style.display = 'block';
		videoImg.style.display = 'block';
		videobtn.style.display = 'block';
		playerVideo.style.display = 'none';
	});
	videoexit.addEventListener('click', function () {
		videoPlayer.style.display = 'none';
		playerVideo.pause();
	});
	videobtn.addEventListener('click', function () {
		videoImg.style.display = 'none';
		videobtn.style.display = 'none';
		playerVideo.style.display = 'block';
		playerVideo.load();
		playerVideo.play();
	});

	/**
	 * 获取课程(包括Tab模块 主课程模块 页码模块 热门课程模块)
	 */
	var TYPE = '10';  // Tab课程类型
	var PAGENO = '1'; // 页码

	/**
	 * Tab
	 */
	var leftTab = $id('leftTab');
	var rightTab = $id('rightTab');
	leftTab.addEventListener('click', function () {
		leftTab.style.backgroundColor = '#39a030';
		leftTab.style.color = '#fff';
		rightTab.style.backgroundColor = '#fff';
		rightTab.style.color = '#000';
		if (TYPE != '10') {
			TYPE = '10';
			PAGENO = '1';
			// 当Tab被点击，课程类型Type发生改变时，页码回到对应的课程类型的第一页
			var pageOn = $class('pageOn')[0];
			removeClass(pageOn, 'pageOn');
			addClass(page[0], 'pageOn');
			changeCourse();
		}
	});
	rightTab.addEventListener('click', function () {
		leftTab.style.backgroundColor = '#fff';
		leftTab.style.color = '#000';
		rightTab.style.backgroundColor = '#39a030';
		rightTab.style.color = '#fff';
		if (TYPE != '20') {
			TYPE = '20';
			PAGENO = '1';
			// 当Tab被点击，课程类型Type发生改变时，页码回到对应的课程类型的第一页
			var pageOn = $class('pageOn')[0];
			removeClass(pageOn, 'pageOn');
			addClass(page[0], 'pageOn');
			changeCourse();
		}
	});

	/**
	 * 主课程
	 */
	var mainCourse = $id('mainCourse');
	// ajax异步获取主课程
	function getCourse () {
		ajax({
			method: 'get',
			url: 'http://study.163.com/webDev/couresByCategory.htm',
			data: {
				'pageNo': '1',
				'psize': '20',
				'type': '10'
			},
			success: function(data) {
				var _data = JSON.parse(data);
				for (var i = 0; i < _data.list.length; i++) {
					// 主课程容器(包含主课程div和课程浮层介绍的div)
					var mainCourcontainer = document.createElement('div');
					if (i%4 == 0) {
						mainCourcontainer.setAttribute('class', 'mCourContainer theyHidden');
					} else {
						mainCourcontainer.setAttribute('class', 'mCourContainer');
					}
					mainCourse.appendChild(mainCourcontainer);

					// 获取主课程列表
					var mainCour = document.createElement('div');
					mainCour.setAttribute('class', 'mainCour');
					mainCourcontainer.appendChild(mainCour);

					var coursePhoto = document.createElement('img');
					var courseName = document.createElement('div');
					var courseProvider = document.createElement('div');
					var courseNum = document.createElement('div');
					var coursePrice = document.createElement('div');

					coursePhoto.setAttribute('class', 'coursePhoto');
					coursePhoto.setAttribute('src', _data.list[i].bigPhotoUrl);
					courseName.setAttribute('class', 'courseName');
					courseName.innerHTML = _data.list[i].name;
					courseProvider.setAttribute('class', 'courseProvider');
					courseProvider.innerHTML = _data.list[i].provider;
					courseNum.setAttribute('class', 'courseNum');
					courseNum.innerHTML = _data.list[i].learnerCount;
					coursePrice.setAttribute('class', 'coursePrice');
					coursePrice.innerHTML = '￥' + _data.list[i].price;

					mainCour.appendChild(coursePhoto);
					mainCour.appendChild(courseName);
					mainCour.appendChild(courseProvider);
					mainCour.appendChild(courseNum);
					mainCour.appendChild(coursePrice);

					// 课程浮层介绍
					var courseHover = document.createElement('div');
					courseHover.setAttribute('class', 'courseHover');
					mainCourcontainer.appendChild(courseHover);

					var hoverPhoto = document.createElement('img');
					var hoverName = document.createElement('div');
					var hoverNum = document.createElement('div');
					var hoverProvider = document.createElement('div');
					var hoverCategory = document.createElement('div');
					var hoverDescription = document.createElement('div');
					var desContent = document.createElement('div');
					hoverDescription.appendChild(desContent);

					hoverPhoto.setAttribute('class', 'hoverPhoto');
					hoverPhoto.setAttribute('src', _data.list[i].bigPhotoUrl);
					hoverName.setAttribute('class', 'hoverName');
					hoverName.innerHTML = _data.list[i].name;
					hoverName.title = _data.list[i].name;
					hoverNum.setAttribute('class', 'hoverNum');
					hoverNum.innerHTML = _data.list[i].learnerCount + '人在学';
					hoverProvider.setAttribute('class', 'hoverProvider');
					hoverProvider.innerHTML = '发布者&nbsp;:&nbsp;' + _data.list[i].provider;
					hoverCategory.setAttribute('class', 'hoverCategory');
					hoverCategory.innerHTML = '分类&nbsp;:&nbsp;&nbsp;' + _data.list[i].categoryName;
					hoverDescription.setAttribute('class', 'hoverDescription');
					desContent.setAttribute('class', 'desContent');
					desContent.innerHTML = _data.list[i].description;
					desContent.title = _data.list[i].description;

					courseHover.appendChild(hoverPhoto);
					courseHover.appendChild(hoverName);
					courseHover.appendChild(hoverNum);
					courseHover.appendChild(hoverProvider);
					courseHover.appendChild(hoverCategory);
					courseHover.appendChild(hoverDescription);
				}
				// 显示隐藏浮层的鼠标事件
				var maincourI = $class('mainCour');
				var coursehoverI = $class('courseHover');
				for (var i = 0; i < _data.list.length; i++) {
					(function (_i) {
						maincourI[_i].onmouseenter = function () {
							coursehoverI[_i].style.display = 'block';
							fadeIn(coursehoverI[_i]);
						}
						coursehoverI[_i].onmouseleave = function () {
							coursehoverI[_i].style.display = 'none';
						}
					})(i)
				}
			},
			async: true
		});
	}
	getCourse();

	// 改变课程列表
	function changeCourse () {
		ajax({
			method: 'get',
			url: 'http://study.163.com/webDev/couresByCategory.htm',
			data: {
				'pageNo': PAGENO,
				'psize': '20',
				'type': TYPE
			},
			success: function (data) {
				var _data = JSON.parse(data);
				for (var i = 0; i < _data.list.length; i++) {
					var coursePhoto = $class('coursePhoto')[i];
					var courseName = $class('courseName')[i];
					var courseProvider = $class('courseProvider')[i];
					var courseNum = $class('courseNum')[i];
					var coursePrice = $class('coursePrice')[i];

					coursePhoto.src = _data.list[i].bigPhotoUrl;
					courseName.innerHTML = _data.list[i].name;
					courseProvider.innerHTML = _data.list[i].provider;
					courseNum.innerHTML = _data.list[i].learnerCount;
					coursePrice.innerHTML = '￥' + _data.list[i].price;

					var hoverPhoto = $class('hoverPhoto')[i];
					var hoverName = $class('hoverName')[i];
					var hoverNum = $class('hoverNum')[i];
					var hoverProvider = $class('hoverProvider')[i];
					var hoverCategory = $class('hoverCategory')[i];
					var desContent = $class('desContent')[i];

					hoverPhoto.src = _data.list[i].bigPhotoUrl;
					hoverName.innerHTML = _data.list[i].name;
					hoverName.title = _data.list[i].name;
					hoverNum.innerHTML = _data.list[i].learnerCount + '人在学';
					hoverProvider.innerHTML = '发布者&nbsp;:&nbsp;' + _data.list[i].provider;
					hoverCategory.innerHTML = '分类&nbsp;:&nbsp;&nbsp;' + _data.list[i].categoryName;
					desContent.innerHTML = _data.list[i].description;
					desContent.title = _data.list[i].description;
				}
			},
			async: true
		});
	}

	/**
	 * 热门课程
	 */
	function getHotcourse () {
		ajax({
			method: 'get',
			url: 'http://study.163.com/webDev/hotcouresByCategory.htm',
			success: function (data) {
				var hotdata = JSON.parse(data);
				for (var i = 0; i < 10; i++) {
					var hotPic = $class('hotPic')[i];
					var hotInfo = $class('hotInfo')[i];
					var hotNumber = $class('hotNumber')[i];
					var firstTen = i;
					hotPic.src = hotdata[firstTen].smallPhotoUrl;
					hotInfo.innerHTML = hotdata[firstTen].name;
					hotInfo.title = hotdata[firstTen].name;
					hotNumber.innerHTML = hotdata[firstTen].learnerCount;
				}
				var tenImgs = 2;
				var step = function () {
					if (tenImgs == 1) {
						for (var i = 0; i < 10; i++) {
							var hotPic = $class('hotPic')[i];
							var hotInfo = $class('hotInfo')[i];
							var hotNumber = $class('hotNumber')[i];
							var firstTen = i;
							hotPic.src = hotdata[firstTen].smallPhotoUrl;
							hotInfo.innerHTML = hotdata[firstTen].name;
							hotInfo.title = hotdata[firstTen].name;
							hotNumber.innerHTML = hotdata[firstTen].learnerCount;
						}
						tenImgs++;
					} else if (tenImgs == 2) {
						for (var i = 0; i < 10; i++) {
							var hotPic = $class('hotPic')[i];
							var hotInfo = $class('hotInfo')[i];
							var hotNumber = $class('hotNumber')[i];
							var secondTen = i + 10;
							hotPic.src = hotdata[secondTen].smallPhotoUrl;
							hotInfo.innerHTML = hotdata[secondTen].name;
							hotInfo.title = hotdata[secondTen].name;
							hotNumber.innerHTML = hotdata[secondTen].learnerCount;
						}
						tenImgs--;
					}
				};
				setInterval(step, 5000);
			},
			async: true
		});
	}
	getHotcourse();

	/**
	 * 页码
	 */
	var pageNum = $id('pageNum');
	var page = pageNum.children;
	var pageLen = page.length;
	var pre = $id('pre');
	var next = $id('next');
	// 添加页码鼠标事件
	function addPagevent () {
		for(var i = 0; i < pageLen; i++){
			(function (_i) {
				page[_i].onclick = function () {
					var pageOn = $class('pageOn')[0];
					removeClass(pageOn, 'pageOn');
					addClass(page[_i], 'pageOn');
					PAGENO = (_i + 1).toString();
					changeCourse();
				};
			})(i);
		}
		pre.onclick = function () {
			var pageOn = $class('pageOn')[0];
			var pageNumber = parseInt(pageOn.innerText);
			if (pageNumber > 1) {
				removeClass(pageOn, 'pageOn');
				addClass(page[pageNumber - 2], 'pageOn');
				PAGENO = (pageNumber - 1).toString();
				changeCourse();
			}
		}
		next.onclick = function () {
			var pageOn = $class('pageOn')[0];
			var pageNumber = parseInt(pageOn.innerText);
			if (pageNumber < pageLen) {
				removeClass(pageOn, 'pageOn');
				addClass(page[pageNumber], 'pageOn');
				PAGENO = (pageNumber + 1).toString();
				changeCourse();
			}
		}
	}
	addPagevent();
}