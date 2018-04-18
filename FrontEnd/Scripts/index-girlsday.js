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
     * PC | Mobile layout switcher controllor
     * 
     */
    $(
        function styleControl() {
            if (window.innerWidth <= 1024) {
                $('#main-container_m').css('display', 'block');
                $('#main-container').css('display', 'none');
            } else {
                $('#main-container_m').css('display', 'none');
                $('#main-container').css('display', 'block');
            }
        }
    );

    /**
     * Animation for navigation bar
     * 
     * @param {string} navSelector Selector of navigation bar
     */
    function navHandler(navSelector) {
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

    // [PC] window resize controllor
    $(window).on('resize', function () {
        styleControl();
    });
    // [PC] Main container scroll controllor
    var anim = function (scrollNode) {
        var scrollTop = scrollNode.scrollTop();
        if (scrollTop > 120) {
            $('#main .main-to_top').fadeIn();
        }
        if (scrollTop <= 120) {
            $('#main .main-to_top').fadeOut();
        }
        for (var i = 0; i < $('#main .main-content').length; i++) {
            var $scrollNode = scrollNode,
                $item = $($('.main-content')[i]),
                width = $scrollNode.width(),
                height = $scrollNode.height(),
                // Length of element's top to the working area's top
                itemTop = $item.offset().top - document.documentElement.scrollTop,
                offset = '100%';

            if (offset.indexOf('%') > -1) {
                offset = parseInt(offset) / 100 * height;
            }
            if (itemTop < offset) {
                $item.css('opacity', '1').css('transform', 'perspective(2500px) rotateX(0)');
            } else {
                $item.css('opacity', '0').css('transform', 'perspective(2500px) rotateX(-100deg)');
            }
        }
    };
    anim($(window));

    var mainScrollTop = 0, isAnimating;
    $(window).on('scroll', function () {
        anim($(this));
        var isForword = $(this).scrollTop() > mainScrollTop ? true : false;
        var jsMethod = function () {
            if (isForword) {
                if (!isAnimating) {
                    if (parseInt($('header').css('top')) !== -90) {
                        isAnimating = true;
                        $('#header').animate({
                            top: -90
                        }, function () {
                            isAnimating = false;
                        });
                    }
                    var totalHeight = document.documentElement.offsetHeight,
                        scrollTop = document.documentElement.scrollTop;
                    if (scrollTop / totalHeight < 0.8) {
                        if (parseInt($('footer').css('bottom')) !== 0) {
                            isAnimating = true;
                            $('#footer').animate({
                                bottom: 0
                            }, function () {
                                isAnimating = false;
                            });
                        }
                    }
                }
            } else {
                if (!isAnimating) {
                    if (parseInt($('header').css('top')) !== 0) {
                        isAnimating = true;
                        $('#header').animate({
                            top: 0
                        }, function () {
                            isAnimating = false;
                        });
                    }
                    if (parseInt($('footer').css('bottom')) !== -56) {
                        isAnimating = true;
                        $('#footer').animate({
                            bottom: -56
                        }, function () {
                            isAnimating = false;
                        });
                    }
                }
            }
        };
        if (isForword) {
            $('#header').css('top', '-90px');
            var totalHeight = document.documentElement.offsetHeight,
                scrollTop = document.documentElement.scrollTop;
            // console.log(scrollTop);
            if (scrollTop / totalHeight > 0.8) {
                $('#footer').css('bottom', '0');
            }
        } else {
            $('#header').css('top', '0');
            $('#footer').css('bottom', '-56px');
        }
        mainScrollTop = $(this).scrollTop();
    });
    // [PC] Main to_top controllor
    $('#main .main-to_top').on('click', function () {
        $(document.documentElement).animate({
            scrollTop: 0
        }, 300, function () {
            $('#main .main-to_top').css('display', 'none');
            $('#main .main-to_top').css('top', 'auto');
        });
        $('#main .main-to_top').animate({
            top: -100
        }, 250);
    });
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
                if (isForward) {
                    if ($header.css('top') !== '-56px') {
                        $header.css('transition', 'top .3s ease-in').css('top', '-56px');
                    }
                    if (!$main[0].classList.contains('fullscreen')) {
                        $main.css('transition', 'top .3s ease-in, margin .3s ease-in').addClass('fullscreen');
                        $tabMain.css('transition', 'top .3s ease-in, margin .3s ease-in').addClass('fullscreen');
                    }
                } else {
                    if ($header.css('top') !== '0') {
                        $header.css('transition', 'top .3s ease-in').css('top', '0');
                    }
                    if ($main[0].classList.contains('fullscreen')) {
                        $main.css('transition', 'top .3s ease-in, margin .3s ease-in').removeClass('fullscreen');
                        $tabMain.css('transition', 'top .3s ease-in, margin .3s ease-in').removeClass('fullscreen');
                    }
                }
                scrollTop = $(this).scrollTop();
            });
        }
    );

   // navHandler('#header');
})();