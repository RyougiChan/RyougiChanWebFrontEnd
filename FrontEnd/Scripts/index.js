(function () {
    'use strict';

    $.fn.animateRotate = function (rotateType, startAngle, endAngle, duration, easing, complete) {
        var args = $.speed(duration, easing, complete);
        var step = args.step;
        return this.each(function (i, e) {
            args.complete = $.proxy(args.complete, e);
            args.step = function (now) {
                $.style(e, 'transform', rotateType + '(' + now + 'deg)');
                if (step) return step.apply(e, arguments);
            };

            $({ deg: startAngle }).animate({ deg: endAngle }, args);
        });
    };

    /**
     * PC | Mobile layout switcher control
     * 
     */
    function styleControl() {
        if (window.innerWidth <= 1024) {
            $('#main-container_m').css('display', 'block');
            $('#main-container').css('display', 'none');
        } else {
            $('#main-container_m').css('display', 'none');
            $('#main-container').css('display', 'block');
        }
    }

    /**
     * Animation of navigation bar
     * 
     * @param {string} navSelector Selector of navigation bar
     */
    function navGo(navSelector) {
        var nav = document.querySelector(navSelector);
        var navLevel1 = nav.querySelector('ul');
        var navLevel1Items = navLevel1.children;
        var hoverIn = function () {
            var $this = $(this);
            var show = function (speed) {
                $this.children().css('display', 'block');
                $this.children().css('opacity', 1);
                $this.children().animate({
                    top: '90px',
                }, speed);
            };
            $this.addClass('nav-hover_in');
            $(navLevel1Items).children().css('display', 'none');
            if ($this.children().css('top') == '120px') {
                show(300);
            }
            setTimeout(function () {
                if ($this.children().css('top') != '90px') {
                    show(0);
                }
            }, 300);
        };
        var hoverOut = function () {
            var $this = $(this);
            var hide = function (speed) {
                $this.children().animate({
                    top: '120px',
                    opacity: '0'
                }, speed, function () {
                    $this.children().css('display', 'none');
                });
            };
            $this.removeClass('nav-hover_in');
            if ($this.children().css('top') == '90px') {
                hide(300);
            }
            setTimeout(function () {
                if ($this.children().css('top') != '120px') {
                    hide(0);
                }
            }, 300);
        };
        $(navLevel1Items).hover(hoverIn, hoverOut);
    }

    // window resize control
    $(window).on('resize', function () {
        styleControl();
    });
    //Main container scroll control
    var sign = 10;
    $('#main').on('scroll', function () {
        var scrollTop = $('#main').scrollTop();
        if (scrollTop > 120) {
            $('#main .main-to_top').fadeIn();
        }
        if (scrollTop <= 120) {
            $('#main .main-to_top').fadeOut();
        }
        for (var i = 0; i < $('.main-content').length; i++) {
            var temp = scrollTop - $('.main-content')[i].offsetTop + window.outerHeight;
            if (temp >= 0 && temp <= 200 && scrollTop > sign) {
                $($('.main-content')[i]).animateRotate('rotateX', -100, 0, 400, 'swing');
                sign = scrollTop;
            }
            if (temp >= 0 && temp <= 50 && scrollTop < sign) {
                $($('.main-content')[i]).animateRotate('rotateX', 0, -100, 400, 'swing');
                sign = scrollTop;
            }
        }
    });
    // Main to_top control
    $('#main .main-to_top').on('click', function () {
        $('#main').animate({
            scrollTop: 0
        }, 300, function () {
            $('#main .main-to_top').css('display', 'none');
            $('#main .main-to_top').css('top', 'auto');
        });
        $('#main .main-to_top').animate({
            top: -100
        }, 250);
    });
    // Hide header control
    $(
        function t() {
            var mainResetHeight,
                tabMainResetHeight,
                scrollTop = 0,
                isForward = true,
                animInPprogress = false,
                $header = $('#main-container_m #yuko-header'),
                $main = $('#main-container_m > #yuko-main-container > .yuko-main-content.yuko-page-container'),
                $tabMain = $('.yuko-tab_container > .yuko-main-content.yuko-page-container');
            $('#main-container_m .yuko-content.yuko-page').on('scroll', function () {
                isForward = $(this).scrollTop() > scrollTop ? true : false;
                if ($(this).scrollTop() > 56 && isForward && !animInPprogress) {
                    if (!mainResetHeight) mainResetHeight = (this.offsetHeight + 56);
                    if ($header.css('top') === '0px') {
                        console.log('A');
                        animInPprogress = true;
                        $header.animate({
                            top: '-56px'
                        }, function () {
                            animInPprogress = false;
                        });
                    }
                    if (($main.css('margin-top') === '56px' || $main.css('height') === (mainResetHeight - 56) + 'px')) {
                        if (this.parentNode.parentNode.className.indexOf('yuko-tab_container') > -1) {
                            if (!tabMainResetHeight) tabMainResetHeight = (this.offsetHeight);
                            console.log('B1 >> ' + tabMainResetHeight);
                        animInPprogress = true;
                        $main.animate({
                                marginTop: '0',
                                height: (mainResetHeight + 40) + 'px'
                            }, function () {
                                animInPprogress = false;
                            });
                            console.log($tabMain.css('height'));
                            if (($tabMain.css('height') === (tabMainResetHeight) + 'px')) {
                                console.log('B2 >> ' + tabMainResetHeight);
                                // $tabMain.css('height', (tabMainResetHeight + 56) + 'px');
                        animInPprogress = true;
                        $tabMain.animate({
                                    height: (tabMainResetHeight + 56) + 'px'
                                }, function () {
                                    animInPprogress = false;
                                });
                            }
                        } else {
                            console.log('B3');
                            animInPprogress = true;
                            $main.animate({
                                marginTop: '0',
                                height: mainResetHeight + 'px'
                            }, function () {
                                animInPprogress = false;
                            });
                        }
                    }
                }
                if (!isForward && !animInPprogress) {
                    if ($header.css('top') === '-56px') {
                        console.log('C');
                        animInPprogress = true;
                        $header.animate({
                            top: '0'
                        }, function () {
                            animInPprogress = false;
                        });
                    }
                    if (($main.css('margin-top') === '0px' || $main.css('height') === (mainResetHeight) + 'px')) {
                        if (this.parentNode.parentNode.className.indexOf('yuko-tab_container') > -1) {
                            console.log('D1');
                        animInPprogress = true;
                        $main.animate({
                                marginTop: '56px',
                                height: (mainResetHeight) + 'px'
                            }, function () {
                                animInPprogress = false;
                            });
                            if (($tabMain.css('height') === (tabMainResetHeight + 56) + 'px')) {
                                console.log('D2');
                                // $tabMain.parent().parent().css('height', tabMainResetHeight);
                        animInPprogress = true;
                        $tabMain.animate({
                                    height: (tabMainResetHeight) + 'px'
                                }, function () {
                                    animInPprogress = false;
                                });
                            }
                        } else {
                            console.log('D3');
                            animInPprogress = true;
                            $main.animate({
                                marginTop: '56px',
                                height: (mainResetHeight - 56) + 'px'
                            }, function () {
                                animInPprogress = false;
                            });
                        }
                    }
                }
                scrollTop = $(this).scrollTop();
            });
        }
    );

    styleControl();
    navGo('#header');
})();