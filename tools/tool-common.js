/* 工具页共用脚本：复刻全站主题(蓝/浅/深)与语言(中/英)切换逻辑，可离线运行。
   与 static/script.js 保持一致的 CSS 变量，保证视觉统一。 */
(function () {
  function setCookie(name, value, days) {
    try {
      var expires = "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + value + expires + "; path=/";
    } catch (e) {}
  }
  function getCookie(name) {
    try {
      var nameEQ = name + "=";
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') cookie = cookie.substring(1);
        if (cookie.indexOf(nameEQ) == 0) return cookie.substring(nameEQ.length);
      }
    } catch (e) {}
    return null;
  }

  var body = document.body;
  var themeState = getCookie("themeState") || "Blue";

  function changeSvg(color) {
    var svgs = document.getElementsByTagName("svg");
    for (var i = 0; i < svgs.length; i++) {
      var paths = svgs[i].getElementsByTagName("path");
      for (var j = 0; j < paths.length; j++) paths[j].setAttribute("fill", color);
    }
  }

  function changeTheme(theme) {
    themeState = theme;
    if (theme == "Light") {
      changeSvg("#000000");
      var s = {
        '--main-bg-color': '#ffffff', '--main-text-color': '#000000',
        '--gradient-start': '#607df1', '--gradient-middle': '#e0321b', '--gradient-end': '#000000',
        '--purple-text-color': '#2b3ce2', '--text-bg-color': '#f4f4f4',
        '--icon-bg-color': 'rgb(246 246 246)', '--icon-1-hover-color': 'rgb(68, 120, 241)',
        '--icon-2-hover-color': 'rgb(232, 68, 241)', '--icon-3-hover-color': 'rgb(179, 206, 0)',
        '--icon-4-hover-color': 'rgb(201, 13, 0)', '--icon-5-hover-color': 'rgb(111, 44, 20)',
        '--project-item-bg-color': 'rgb(246 246 246)', '--project-item-hover-color': '#eeeeee',
        '--project-item-left-title-color': '#000000', '--project-item-left-text-color': '#7e7e7e'
      };
    } else if (theme == "Dark") {
      changeSvg("#ffffff");
      var s = {
        '--main-bg-color': 'rgb(0, 0, 0)', '--main-text-color': '#ffffff',
        '--gradient-start': 'rgb(133, 62, 255)', '--gradient-middle': '#f76cc6 30%', '--gradient-end': 'rgb(255, 255, 255) 60%',
        '--purple-text-color': 'rgb(115, 19, 206)', '--text-bg-color': 'rgb(26, 4, 48)',
        '--icon-bg-color': 'rgb(19 20 24)', '--icon-1-hover-color': 'rgb(68, 120, 241)',
        '--icon-2-hover-color': 'rgb(232, 68, 241)', '--icon-3-hover-color': 'rgb(179, 206, 0)',
        '--icon-4-hover-color': 'rgb(201, 13, 0)', '--icon-5-hover-color': 'rgb(111, 44, 20)',
        '--project-item-bg-color': 'rgb(19 20 24)', '--project-item-hover-color': 'rgb(19, 23, 27)',
        '--project-item-left-title-color': 'rgb(255, 255, 255)', '--project-item-left-text-color': 'rgb(142, 142, 142)',
        '--footer-text-color': '#646464'
      };
    } else {
      changeSvg("#000000");
      var s = {
        '--main-bg-color': ' linear-gradient(45deg, #7fb2e5, white)', '--main-text-color': '#000000',
        '--gradient-start': '#607df1', '--gradient-middle': '#e0321b', '--gradient-end': '#000000',
        '--purple-text-color': '#2b3ce2', '--text-bg-color': '#f4f4f4',
        '--icon-bg-color': 'rgba(249, 250, 251, 0.6)', '--icon-1-hover-color': 'rgb(68, 120, 241)',
        '--icon-2-hover-color': 'rgb(232, 68, 241)', '--icon-3-hover-color': 'rgb(179, 206, 0)',
        '--icon-4-hover-color': 'rgb(201, 13, 0)', '--icon-5-hover-color': 'rgb(111, 44, 20)',
        '--project-item-bg-color': 'rgba(249, 250, 251, 0.6)', '--project-item-hover-color': 'rgba(240, 241, 241, 0.6)',
        '--project-item-left-title-color': '#000000', '--project-item-left-text-color': '#7e7e7e'
      };
    }
    for (var p in s) body.style.setProperty(p, s[p]);
    setCookie("themeState", theme, 365);
  }

  function applyLanguage(lang) {
    document.documentElement.lang = (lang === 'en') ? 'en' : 'zh-CN';
    var nodes = document.querySelectorAll('[data-zh]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      el.textContent = (lang === 'en') ? el.getAttribute('data-en') : el.getAttribute('data-zh');
    }
    var tips = document.querySelectorAll('[data-zh-tip]');
    for (var j = 0; j < tips.length; j++) {
      var t = tips[j];
      t.setAttribute('data-tip', (lang === 'en') ? t.getAttribute('data-en-tip') : t.getAttribute('data-zh-tip'));
    }
    var htmls = document.querySelectorAll('[data-zh-html]');
    for (var k = 0; k < htmls.length; k++) {
      var h = htmls[k];
      h.innerHTML = (lang === 'en') ? h.getAttribute('data-en-html') : h.getAttribute('data-zh-html');
    }
    setCookie('lang', lang, 365);
  }

  changeTheme(themeState);
  applyLanguage(getCookie('lang') || 'zh');

  document.addEventListener('DOMContentLoaded', function () {
    var themeCb = document.getElementById('myonoffswitch');
    if (themeCb) {
      themeCb.checked = (themeState !== 'Blue');
      themeCb.addEventListener('change', function () {
        if (themeState == "Light") changeTheme("Blue");
        else if (themeState == "Dark") changeTheme("Light");
        else changeTheme("Dark");
        this.checked = (themeState !== 'Blue');
      });
    }
    var langCb = document.getElementById('langswitch');
    if (langCb) {
      langCb.checked = (getCookie('lang') !== 'en');
      langCb.addEventListener('change', function () {
        applyLanguage(this.checked ? 'zh' : 'en');
      });
    }
  });
})();
