/* global define, JRoll */
(function (window, document, JRoll) {
  'use strict'

  function compile (text, root) {
    var t = text
    var s = "'use strict';\nvar __t='';__t+='"
    var i = 0
    var r = /\{\{=([^{]+)\}\}|\{\{(each [\w$._]+ as [\w$_]+ [\w$_]+)\}\}|\{\{if ([^{]+)\}\}|\{\{(else)\}\}|\{\{else if ([^{]+)\}\}|(\{\{\/each\}\}|\{\{\/if\}\})|\{\{([^{]+)\}\}/g
    // é¢„å¤„ç†ï¼ŒåŽ»é™¤å¤šä½™ç©ºæ ¼ã€å›žè½¦ã€è½¬æ¢å•å¼•å·
    t = t.replace(/(\n|\r)|(\{\{\s+)|(\s+\}\})|(\s{2,})|(')/g, function (match, enter, left, right, space, quote) {
      var temp
      if (enter) {
        temp = ''
      } else if (left) {
        temp = '{{'
      } else if (right) {
        temp = '}}'
      } else if (space) {
        temp = ' '
      } else if (quote) {
        temp = "\\'"
      }
      return temp
    })
    // æ›¿æ¢å­—ç¬¦ä¸²
    t.replace(r, function (match, _value, _each, _if, _else, _elseif, _close, _other, offset) {
      s += t.slice(i, offset)
      i = offset + match.length

      if (_value) {
        s += "'+(" + _value.replace(/\\'/g, "'") + ")+'"
      } else if (_each) {
        var p = _each.split(' ')
        s += "';\nfor(var " + p[4] + '=0,' + p[3] + ';' + p[4] + '<' + p[1] + '.length;' + p[4] + '++){\n' + p[3] + '=' + p[1] + '[' + p[4] + "];\n__t+='"
      } else if (_if) {
        s += "';\nif(" + _if.replace(/\\'/g, "'") + "){\n__t+='"
      } else if (_else) {
        s += "';\n}else{\n__t+='"
      } else if (_elseif) {
        s += "';\n}else if(" + _elseif.replace(/\\'/g, "'") + "){\n__t+='"
      } else if (_close) {
        s += "';\n};\n__t+='"
      } else if (_other) {
        s += "';\n" + _other.replace(/\\'/g, "'") + ";\n__t+='"
      }
      return match
    })
    s += t.slice(i) + "';return __t;"

    /* eslint-disable */
    return new Function(root, s)
    /* eslint-enable */
  }

  // è¿”å›žå­—ç¬¦ä¸²å½¢å¼çš„html
  function render (compiled, data) {
    return compiled(data)
  }

  JRoll.prototype.infinite = function (params) {
    var me = this
    var lock
    var compiled
    var keys = Object.keys(params || {})

    // é»˜è®¤é€‰é¡¹
    var options = {
      total: 99,
      getData: null,
      hideImg: false, // å¼€å¯ä¹‹åŽï¼Œä¸åœ¨å±å¹•ä¸Šçš„å›¾ç‰‡ä¼šdisplay:noneï¼Œå¯é™ä½Žå†…å­˜çš„ä½¿ç”¨
      blank: false, // å¼€å¯ä¹‹åŽï¼Œä¸åœ¨å±å¹•ä¸Šçš„é¡µé¢ä¼šdisplay:noneï¼Œå¯é™ä½Žå†…å­˜çš„ä½¿ç”¨
      template: '', // æ¯æ¡æ•°æ®æ¨¡æ¿
      loadingTip: '<div class="jroll-infinite-tip">æ­£åœ¨åŠ è½½...</div>', // æ­£åœ¨åŠ è½½æç¤ºä¿¡æ¯
      completeTip: '<div class="jroll-infinite-tip">å·²åŠ è½½å…¨éƒ¨å†…å®¹</div>', // åŠ è½½å®Œæˆæç¤ºä¿¡æ¯
      errorTip: '<div class="jroll-infinite-tip">åŠ è½½å¤±è´¥ï¼Œä¸Šæ‹‰é‡è¯•ï¼</div>', // åŠ è½½å¤±è´¥æç¤ºä¿¡æ¯
      root: '_obj', // ç»™å†…ç½®æ¨¡æ¿å¼•æ“ŽæŒ‡å®šæ ¹æ•°æ®å˜é‡
      compile: compile, // ç¼–è¯‘æ–¹æ³•
      render: render // æ¸²æŸ“æ–¹æ³•
    }

    for (var k in keys) {
      options[keys[k]] = params[keys[k]]
    }

    me.options.total = options.total
    me.options.page = 1
    me.infinite_callback = callback
    me.infinite_error_callback = errorCallback
    compiled = options.compile(options.template, options.root)

    // åˆ›å»ºjroll-infiniteçš„jroll-styleæ ·å¼
    var style = document.getElementById('jroll_style')
    var jstyle = '\n/* jroll-infinite */\n.jroll-infinite-hide>*{display:none}.jroll-infinite-hideimg img{display:none}\n'
    if (style) {
      if (!/jroll-infinite/.test(style.innerHTML)) {
        style.innerHTML += jstyle
      }
    } else {
      style = document.createElement('style')
      style.id = 'jroll_style'
      style.innerHTML = jstyle
      document.head.appendChild(style)
    }

    // å¦‚æžœæç¤ºè¯­å«å›¾ç‰‡ï¼Œé¢„åŠ è½½å¹¶ç¼“å­˜å›¾ç‰‡
    document.createElement('div').innerHTML = options.loadingTip + options.completeTip

    // é¦–æ¬¡åŠ è½½æ•°æ®
    if (typeof options.getData === 'function') {
      me.scroller.innerHTML = options.loadingTip
      options.getData(me.options.page, callback, errorCallback)
    }

    // æ»‘åŠ¨ç»“æŸï¼ŒåŠ è½½ä¸‹ä¸€é¡µ
    me.on('scrollEnd', function () {
      var tip = me.scroller.querySelector('.jroll-infinite-tip')
      if (me.y < me.maxScrollY + tip.offsetHeight && me.options.page !== me.options.total && !lock) {
        lock = true // é˜²æ­¢æ•°æ®åŠ è½½å®Œæˆå‰è§¦å‘åŠ è½½ä¸‹ä¸€é¡µ
        tip.innerHTML = options.loadingTip
        options.getData(++me.options.page, callback, errorCallback)
      }

      lightenPage()
    })

    function errorCallback () {
      var div = me.scroller.querySelector('.jroll-infinite-tip')
      div.innerHTML = options.errorTip
      --me.options.page
      lock = false
    }

    // æ¸²æŸ“è§†å›¾
    function callback (data) {
      var html

      lock = false

      if (!data) return

      html = "<section class='jroll-infinite-page'>"

      for (var i = 0, l = data.length; i < l; i++) {
        html += options.render(compiled, data[i], i)
      }
      html += '</section>'

      html += me.options.total === me.options.page ? options.completeTip : options.loadingTip

      /**
       * Fixed Issue: https://github.com/chjtx/JRoll/issues/21
       * ä¿®å¤åœ¨IOSä¸Šå¤§é‡å›¾ç‰‡æ—¶é—ªå±çš„é—®é¢˜
       */
      // me.scroller.innerHTML = me.scroller.innerHTML.replace(clearRegExp, '') + html
      if (me.scroller.lastElementChild) me.scroller.removeChild(me.scroller.lastElementChild)
      me.scroller.insertAdjacentHTML('beforeend', html)

      me.refresh()

      if (options.hideImg || options.blank) {
        setTimeout(function () {
          var pages = me.scroller.querySelectorAll('.jroll-infinite-page')
          var last = pages[pages.length - 1]
          if (last) {
            last.style.height = last.offsetHeight + 'px'
          }
          lightenPage(pages)
        }, 10)
      }
    }

    // å‡è½»é¡µé¢ï¼Œéšè—ä¸åœ¨å±å¹•çš„é¡µé¢
    function lightenPage (sections) {
      if (options.hideImg || options.blank) {
        var pages = sections || me.scroller.querySelectorAll('.jroll-infinite-page')
        var h = me.wrapper.clientHeight
        var p = me.y
        var className = options.blank ? 'jroll-infinite-hide' : 'jroll-infinite-hideimg'
        for (var i = 0, l = pages.length; i < l; i++) {
          // åœ¨å¯è§†åŒºåŸŸå¤–
          if (pages[i].offsetTop - h + p > 0 || pages[i].offsetTop + pages[i].offsetHeight + p < 0) {
            pages[i].classList.add(className)
          } else { // å†…
            pages[i].classList.remove(className)
          }
        }
      }
    }
  }

  JRoll.prototype.infinite.version = '{{version}}'

  // CommonJS/AMD/CMDè§„èŒƒå¯¼å‡ºJRoll
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = JRoll
  }
  if (typeof define === 'function') {
    define(function () {
      return JRoll
    })
  }
})(window, document, JRoll)