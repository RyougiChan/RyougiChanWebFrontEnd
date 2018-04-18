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
        // Button
        'initButton': function initSnackbar() {
            var rippleBtns = document.querySelectorAll('.yuko-button_ripple');
            if (rippleBtns && rippleBtns.length > 0) {
                for (var i = 0; i < rippleBtns.length; i++) {
                    Yuko.utility.addEvent(rippleBtns[i], fingerdown, Yuko.effect.rippleEffect);
                }
            }
        },
        // TextField
        'initTextFields': function initTextField() {
            var textfiled = document.querySelectorAll('.yuko-js-textfield .yuko-textfield_input');
            var focusinCall = function (e) {
                if (!this.parentNode.classList.contains('is-focus')) {
                    this.parentNode.classList.add('is-focused');
                }
                if (!this.parentNode.classList.contains('is-dirty')) {
                    this.parentNode.classList.add('is-dirty');
                }
            }
            var focusoutCall = function (e) {
                if (this.parentNode.classList.contains('is-focused')) {
                    this.parentNode.classList.remove('is-focused');
                }
                if (this.parentNode.classList.contains('is-dirty') && this.value == '') {
                    this.parentNode.classList.remove('is-dirty');
                }
            }
            for (var i = 0; i < textfiled.length; i++) {
                var pattern = textfiled[i].getAttribute('pattern');
                if (pattern) {
                    Yuko.utility.addEvent(textfiled[i], 'input', function (i) {
                        var re = new RegExp(pattern);
                        if (this.value.trim() != '' && !(re.test(this.value))) {
                            if (!this.parentNode.classList.contains('is-invalid')) {
                                this.parentNode.classList.add('is-invalid');
                            }
                        } else {
                            if (this.parentNode.classList.contains('is-invalid')) {
                                this.parentNode.classList.remove('is-invalid');
                            }
                        }
                    });
                }
                Yuko.utility.addEvent(textfiled[i], 'focusin', focusinCall);
                Yuko.utility.addEvent(textfiled[i], 'focusout', focusoutCall);
            }

            var textfiledBtn = document.querySelectorAll('.yuko-textfield  .yuko-button-icon');
            var btnClickCall = function (e) {
                this.nextElementSibling.focus();
                if (!this.parentNode.classList.contains('is-focus')) {
                    this.parentNode.classList.add('is-focused');
                }
                if (!this.parentNode.classList.contains('is-dirty')) {
                    this.parentNode.classList.add('is-dirty');
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

            for (var i = 0; i < checkboxs.length; i++) {
                var box = checkboxs[i],
                    inputs = box.getElementsByTagName('input');
                if (inputs.length < 1) continue;
                var input = inputs[0],
                    checked = input.getAttribute('checked') == null ? false : true;
                if (checked) {
                    box.classList.add('is-checked');
                }
            }

            Yuko.utility.addEvent(document.body, fingerdown, function (evt) {
                var _target = event.target;
                if (_target.className.indexOf('yuko-checkbox') >= 0) {
                    // _this: yuko-checkbox
                    var _this, _last, _input;
                    if (_target.classList.contains('yuko-checkbox_ripple')) {
                        // There is a ripple container
                        _this = _target.parentElement;
                        _last = _this.lastElementChild;
                        // Set ripple container visible
                        var _rc = _last.firstElementChild;
                        if (!_rc.classList.contains('is-visible')) {
                            _rc.classList.add('is-visible');
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
                    if (_this.classList.contains('yuko-checkbox-all')) {
                        var checkall = _this.firstElementChild; // Check all input
                        // If is a check-all checkbox
                        for (var cbi = 0; cbi < checkboxs.length; cbi++) {
                            var cb = checkboxs[cbi],
                                cbInput = cb.firstElementChild;
                            if (cbInput.name == _input.name && cb != _this) {
                                // Same-named input
                                if (!checkall.hasAttribute('checked')) {
                                    cb.classList.add('is-checked');
                                    cbInput.setAttribute('checked', '');
                                } else {
                                    cb.classList.remove('is-checked');
                                    cbInput.removeAttribute('checked');
                                }
                            }
                        }
                    }

                    // Set checked
                    if (!_this.classList.contains('is-checked')) {
                        _this.classList.add('is-checked');
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
                    if (_target.classList.contains('yuko-checkbox_ripple')) {
                        // Set ripple container visible
                        _this = _target.parentElement;
                        _last = _this.lastElementChild;
                        var _rc = _last.firstElementChild;
                        if (_rc.classList.contains('is-visible')) {
                            _rc.classList.remove('is-visible');
                        }
                    } else if (_target.classList.contains('yuko-checkbox_tick-outline')) {
                        // There is not a ripple container
                        _this = _target.parentElement.parentElement;
                    } else {
                        // yuko-checkbox itself
                        _this = _target;
                    }
                    _last = _this.lastElementChild;
                    _input = _this.firstElementChild;
                    if (isCancel) {
                        _this.classList.remove('is-checked');
                        if (_input.type == 'checkbox') {
                            _input.removeAttribute('checked');
                        }
                    }
                }
            });
        },
        // Radio
        'initRadio': function initRadio() {
            var radios = document.querySelectorAll('.yuko-radio');

            Yuko.utility.addEvent(document.body, fingerdown, function (evt) {
                var _target = event.target;
                if (_target.className.indexOf('yuko-radio') >= 0) {
                    // _this: yuko-radio
                    var _this, _last, _input;
                    _this = _target.parentElement;
                    _last = _this.lastElementChild;
                    _input = _this.firstElementChild;
                    if (_target.classList.contains('yuko-radio_ripple')) {
                        // There is a ripple container
                        // Set ripple container visible
                        var _rc = _last.firstElementChild;
                        if (!_rc.classList.contains('is-visible')) {
                            _rc.className += ' is-visible';
                        }
                    }
                    // Set checked
                    if (!_this.classList.contains('is-checked')) {
                        var inputName = _this.firstElementChild.name;
                        for (var rdi = 0; rdi < radios.length; rdi++) {
                            var _thisInput = radios[rdi].firstElementChild;
                            if (_thisInput.name == inputName) {
                                _thisInput.removeAttribute('checked');
                                _thisInput.parentElement.className = _thisInput.parentElement.className.replace(/\s*is-checked/ig, '');
                            }
                        }
                        _this.className += ' is-checked';
                        _input.setAttribute('checked', '');
                    }
                }
            });

            Yuko.utility.addEvent(document.body, fingerup, function (evt) {
                var _target = event.target;
                if (_target.className.indexOf('yuko-radio') >= 0) {
                    var _this, _last, _input;
                    _this = _target.parentElement;
                    _last = _this.lastElementChild;
                    _input = _this.firstElementChild;
                    if (_target.classList.contains('yuko-radio_ripple')) {
                        // Set ripple container visible
                        var _rc = _last.firstElementChild;
                        if (_rc.classList.contains('is-visible')) {
                            _rc.className = _rc.className.replace(' is-visible', '');
                        }
                    }
                }
            });
        },
        // Switcher
        'initSwitcher': function initSwitcher() {
            var switchs = document.querySelectorAll('.yuko-switch'),
                isCancel;

            Yuko.utility.addEvent(document.body, fingerdown, function (evt) {
                var _target = event.target;
                if (_target.className.indexOf('yuko-switch') >= 0) {
                    // _this: yuko-switch
                    var _this;
                    if (_target.classList.contains('yuko-switch_ripple') || _target.classList.contains('yuko-switch_slider')) {
                        // is a children click
                        _this = _target.parentElement;
                    } else {
                        // yuko-switch itself
                        _this = _target;
                    }

                    // Set checked
                    if (!_this.classList.contains('is-checked')) {
                        _this.className += ' is-checked';
                        isCancel = false;
                    } else {
                        isCancel = true;
                    }

                }
            });

            Yuko.utility.addEvent(document.body, fingerup, function (evt) {
                var _target = event.target;
                if (_target.className.indexOf('yuko-switch') >= 0) {
                    var _this;
                    if (_target.classList.contains('yuko-switch_ripple') || _target.classList.contains('yuko-switch_slider')) {
                        // is a children click
                        _this = _target.parentElement;
                    } else {
                        // yuko-switch itself
                        _this = _target;
                    }
                    _last = _this.lastElementChild;
                    if (isCancel) {
                        _this.classList.remove('is-checked');
                    }
                }
            });
        },
        // Select
        'initSelectBox': function initSelectBox() {
            var closeAllSelect = function (except) {
                var x,
                    y,
                    i;
                x = document.querySelectorAll(".yuko-select_items");
                y = document.querySelectorAll(".yuko-select_selected");
                except = typeof (except) == 'number' ? x[except] : except;

                for (i = 0; i < x.length; i++) {
                    if (x[i] != except) {
                        x[i].classList.add("yuko-select_hide");
                        y[i].classList.remove("yuko-select_arrow-active");
                    }
                }
            }

            var toggleSelect = function (selected) {
                var items_list = selected.nextElementSibling;
                closeAllSelect(items_list);
                if (items_list.classList.contains('yuko-select_hide')) {
                    selected.classList.add('yuko-select_arrow-active');
                    items_list.classList.remove('yuko-select_hide')
                } else {
                    selected.classList.remove('yuko-select_arrow-active');
                    items_list.classList.add('yuko-select_hide');
                }
            }

            Yuko.utility.addEvent(document, fingerdown, function (evt) {
                // _this: yuko-selectbox
                var _this,
                    _selected,
                    _items,
                    _target = evt.target;
                if (_target != document.documentElement) {
                    if (_target.classList.contains('yuko-select_selected')) {
                        _selected = _target;
                        _this = _selected.parentElement;
                    } else if (_target.parentElement.classList.contains('yuko-select_items')) {
                        _items = _target.parentElement;
                        _selected = _items.previousElementSibling;
                        _this = _selected.parentElement;
                    }
                }

                if (_items != undefined) {
                    var selected_val = _target.innerHTML.trim();
                    // Add ripple effect
                    Yuko.utility.addEvent(_target, fingerdown, Yuko.effect.rippleEffect);
                }

                // Press down selected box
                if (_items == undefined && _this) {
                    // Add ripple effect
                    Yuko.utility.addEvent(_selected, fingerdown, Yuko.effect.rippleEffect);
                }

            });

            Yuko.utility.addEvent(document, fingerup, function (evt) {
                var _this,
                    _selected,
                    _items,
                    _target = evt.target;
                if (_target != document.documentElement) {
                    if (_target.classList.contains('yuko-select_selected')) {
                        _selected = _target;
                        _this = _selected.parentElement;
                    } else if (_target.parentElement.classList.contains('yuko-select_items')) {
                        _items = _target.parentElement;
                        _selected = _items.previousElementSibling;
                        _this = _selected.parentElement;
                    }
                }
                if (_this == undefined) {
                    // press down out of yuko-selectbox
                    closeAllSelect();
                }

                if (_items != undefined) {
                    var selected_val = _target.innerHTML.trim();
                    // Add ripple effect
                    Yuko.utility.addEvent(_target, fingerdown, Yuko.effect.rippleEffect);
                    // Set selected value
                    _selected.innerHTML = selected_val;
                    closeAllSelect();
                }

                // Press down selected box
                if (_items == undefined && _this) {
                    // Add ripple effect
                    // Yuko.utility.addEvent(_selected, fingerdown, Yuko.effect.rippleEffect);
                    toggleSelect(_selected);
                }
            });
        },
        // Tab
        'initTab': function initTab() {
            // Add ripple effect
            var tabItems = document.querySelectorAll('.yuko-tab .yuko-tab_item');
            for (var i = 0; i < tabItems.length; i++) {
                Yuko.utility.addEvent(tabItems[i], 'click', Yuko.effect.rippleEffect);
                Yuko.utility.addEvent(tabItems[i], 'click', function () {
                    var tabItemBar = this.parentNode.lastElementChild;
                    Yuko.utility.animate(tabItemBar, {
                        properties: {
                            left: this.offsetLeft + 'px'
                        },
                        easing: 'ease-in-out',
                        duration: 200
                    });
                });
            }
        },
        // Snackbar
        'initSnackbar': function initSnackbar() {
            var snackbarHandler = function (evt) {
                // snackbar: snackbar
                var _target = evt.target,
                    snackbar,
                    snackbarBound;

                if (_target == document.documentElement || !_target.parentElement) {
                    // If press on a blank area.
                    return;
                }

                if (_target.classList.contains('yuko-snackbar_trigger')) {
                    snackbar = _target.nextElementSibling;
                }
                if (_target.parentElement.classList.contains('yuko-snackbar_trigger')) {
                    snackbar = _target.parentElement.nextElementSibling;
                }
                if (snackbar != undefined) {
                    snackbarBound = snackbar.getBoundingClientRect();
                    if (!snackbar.classList.contains('is-active')) {
                        snackbar.classList.add('is-active');
                    }
                    setTimeout(function () {
                        if (snackbar.classList.contains('is-active')) {
                            snackbar.classList.remove('is-active');
                        }
                    }, 4000);
                }

            }
            Yuko.utility.addEvent(document, fingerdown, snackbarHandler);
        },
        // File Upload
        'initFileUpload': function initFileUpload() {
            var hasChangeEvent = false,
                fileUploadChangeHandler = function (e) {
                    var _input = e.target,
                        _parent = _input.parentElement,
                        files = _input.files,
                        imgs = [],
                        isClearAllOldImg;
                    for (var i = 0; i < files.length; i++) {
                        var type = files[i].type;
                        if (/^image\/[\w\W]*$/g.test(type)) {
                            // files[i] is a image
                            imgs.push(files[i]);
                        }
                    }
                    for (var k = 0; k < imgs.length; k++) {
                        var img_width = (100 / imgs.length) + '%',
                            noImg = _parent.querySelector('.no-img'),
                            imgBox = _parent.querySelector('.img-box');
                        if (imgBox) {
                            var newImg = document.createElement('img'),
                                oldImgs = imgBox.querySelectorAll('.img-item'),
                                imgCroppr = document.getElementById('yuko-image_cropper--container'),
                                imgCropprImage = document.getElementById('yuko-image_cropper--img'),
                                // FileReader compatibility
                                // Feature	Firefox (Gecko)	Chrome	Edge	Internet Explorer	Opera	    Safari
                                // Support	3.6 (1.9.2)[1]	7	    (Yes)	10	                12.02[2]	6.0
                                reader = new FileReader();
                            reader.onload = function (readerEvent) {
                                if (!isClearAllOldImg) {
                                    // Clear old
                                    for (var o = 0; o < oldImgs.length; o++) {
                                        imgBox.removeChild(oldImgs[o]);
                                    }
                                    isClearAllOldImg = true;
                                }
                                if (imgCroppr && imgCropprImage) {
                                    imgCroppr.style.zIndex = '7020';
                                    imgCroppr.style.opacity = 1;
                                    imgCropprImage.src = readerEvent.target.result;
                                } else {
                                    imgBox.style.display = 'block';
                                    if (noImg) noImg.style.display = 'none';
                                }
                                // Add new
                                newImg.classList.add('img-item');
                                newImg.src = readerEvent.target.result;
                                imgBox.appendChild(newImg);
                            };
                            reader.readAsDataURL(files[k]);
                        }
                    }
                },
                fileUploadHandler = function (evt) {
                    // _this : fileUpload Container
                    var _this,
                        _input,
                        _target = evt.target;

                    if (_target == document.documentElement) return;
                    _this = Yuko.utility.hasAncestor(_target, { className: 'yuko-upload' });
                    if (!_this) return;
                    _input = _this.getElementsByTagName('input')[0];
                    if (!_input) return;
                    // open file selector
                    _input.click();

                    // bind `_input` change event
                    if (!hasChangeEvent) {
                        Yuko.utility.addEvent(_input, 'change', fileUploadChangeHandler);
                        hasChangeEvent = true;
                    }
                };
            // In our test, touchstart event can not trigger `_input.click()` on mobile device. 
            Yuko.utility.addEvent(document, 'click', fileUploadHandler);
        }
    };

    for (var key in initYukoComponent) {
        if (initYukoComponent.hasOwnProperty(key)) {
            var func = initYukoComponent[key];
            func();
        }
    }
})();