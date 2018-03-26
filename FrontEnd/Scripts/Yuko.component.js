(function () {
    'use strict';
    function initTextField() {
        var textfiled = document.querySelectorAll('.yuko-js-textfield .yuko-textfield_input');
        var focusinCall = function (e) {
            if (this.parentNode.className.indexOf('is-focus') == -1) {
                this.parentNode.className += ' is-focused';
            }
            if (this.parentNode.className.indexOf('is-dirty') == -1) {
                this.parentNode.className += ' is-dirty';
            }
        }
        var focusoutCall = function (e) {
            if (this.parentNode.className.indexOf('is-focused') > -1 && this.value == '') {
                this.parentNode.className = this.parentNode.className.replace(' is-focused', '');
            }
            if (this.parentNode.className.indexOf('is-dirty') > -1 && this.value == '') {
                this.parentNode.className = this.parentNode.className.replace(' is-dirty', '');
            }
        }
        for (var i = 0; i < textfiled.length; i++) {
            Yuko.utility.addEvent(textfiled[i], 'input', (function (i) {
                return function () {
                    var pattern = textfiled[i].getAttribute('pattern'),
                        re = new RegExp(pattern);
                    if (pattern) {
                        if (this.value.trim() != '' && !(re.test(this.value))) {
                            if (this.parentNode.className.indexOf('is-invalid') == -1) {
                                this.parentNode.className += ' is-invalid';
                            }
                        } else {
                            if (this.parentNode.className.indexOf('is-invalid') > -1) {
                                this.parentNode.className = this.parentNode.className.replace(' is-invalid', '');
                            }
                        }
                    }
                }
            })(i));
            Yuko.utility.addEvent(textfiled[i], 'focusin', focusinCall);
            Yuko.utility.addEvent(textfiled[i], 'focusout', focusoutCall);
        }

        var textfiledBtn = document.querySelectorAll('.yuko-textfield  .yuko-button-icon');
        var btnClickCall = function (e) {
            this.nextElementSibling.focus();
            if (this.parentNode.className.indexOf('is-focus') == -1) {
                this.parentNode.className += ' is-focused';
            }
            if (this.parentNode.className.indexOf('is-dirty') == -1) {
                this.parentNode.className += ' is-dirty';
            }
        }
        for (var i = 0; i < textfiledBtn.length; i++) {
            Yuko.utility.addEvent(textfiledBtn[i], 'click', btnClickCall);
        }
    }

    initTextField();
})();