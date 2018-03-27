(function () {
    'use strict';

    function isMobile() {
        if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS)/i))) {
            return true;
        }
        return false;
    }

    // Event type distinction.
    var fingerdown, fingermove, fingerup;
    if (isMobile()) {
        fingerdown = 'touchstart';
        fingermove = 'touchmove';
        fingerup = 'touchend';
    } else {
        fingerdown = 'mousedown';
        fingermove = 'mousemove';
        fingerup = 'mouseup';
    }

    var initYukoComponent = {
        // TextField
        'initTextFields': function initTextField() {
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
        },
        // CheckBox
        'initCheckBoxs': function initCheckBox() {

            var checkboxs = document.querySelectorAll('.yuko-checkbox'),
                isCancel;

                // Using delegate
            Yuko.utility.addEvent(document.body, fingerdown, function (evt) {
                var _target = event.target;
                if (_target.className.indexOf('yuko-checkbox') >= 0) {
                    // _this: yuko-checkbox
                    var _this, _last, _input;
                    if (_target.className.indexOf('yuko-checkbox_ripple') >= 0) {
                        // There is a ripple container
                        _this = _target.parentElement;
                        _last = _this.lastElementChild;
                        // Set ripple container visible
                        var _rc = _last.firstElementChild;
                        if (_rc.className.indexOf('is-visible') < 0) {
                            _rc.className += ' is-visible';
                        }
                    } else if (_target.className.indexOf('yuko-checkbox_tick-outline') >= 0) {
                        // There is not a ripple container
                        _this = _target.parentElement.parentElement;
                    } else {
                        // yuko-checkbox itself
                        _this = _target;
                    }
                    _last = _this.lastElementChild;
                    _input = _this.firstElementChild;

                    // If is a check-all checkbox
                    if (_this.className.indexOf('yuko-checkbox-all') >= 0) {
                        var checkall = _this.firstElementChild; // Check all input
                        // If is a check-all checkbox
                        for (var cbi = 0; cbi < checkboxs.length; cbi++) {
                            var cb = checkboxs[cbi],
                                cbInput = cb.firstElementChild;
                            if (cbInput.name == _input.name && cb != _this) {
                                // Same-named input
                                if (!checkall.hasAttribute('checked')) {
                                    cb.className += ' is-checked';
                                    cbInput.setAttribute('check', '');
                                } else {
                                    cb.className = cb.className.replace(/ is-checked/ig, '');
                                    cbInput.removeAttribute('check');
                                }
                            }
                        }
                    }

                    // Set checked
                    if (_this.className.indexOf('is-checked') < 0) {
                        _this.className += ' is-checked';
                        _input.setAttribute('checked', '');
                        isCancel = false;
                    } else {
                        isCancel = true;
                    }

                }
            });

            Yuko.utility.addEvent(document.body, fingerup, function (evt) {
                var _target = event.target;
                if (_target.className.indexOf('yuko-checkbox') >= 0) {
                    var _this, _last, _input;
                    if (_target.className.indexOf('yuko-checkbox_ripple') >= 0) {
                        // Set ripple container visible
                        _this = _target.parentElement;
                        _last = _this.lastElementChild;
                        var _rc = _last.firstElementChild;
                        if (_rc.className.indexOf('is-visible') >= 0) {
                            _rc.className = _rc.className.replace(' is-visible', '');
                        }
                    } else if (_target.className.indexOf('yuko-checkbox_tick-outline') >= 0) {
                        // There is not a ripple container
                        _this = _target.parentElement.parentElement;
                    } else {
                        // yuko-checkbox itself
                        _this = _target;
                    }
                    _last = _this.lastElementChild;
                    _input = _this.firstElementChild;
                    if (isCancel) {
                        _this.className = _this.className.replace(' is-checked', '');
                        if (_input.type == 'checkbox') {
                            _input.removeAttribute('checked');
                        }
                    }
                }
            });
        }
    };

    for (var key in initYukoComponent) {
        if (initYukoComponent.hasOwnProperty(key)) {
            var func = initYukoComponent[key];
            func();
        }
    }
})();