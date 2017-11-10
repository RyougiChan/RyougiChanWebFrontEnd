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
    // Main container scroll control
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
    styleControl();
    navGo('#header');
})();