(function() {
    'use strict';

    function styleControll() {
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
        var hoverIn = function() {
            var $this = $(this);
            var show = function(speed) {
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
            setTimeout(function() {
                if ($this.children().css('top') != '90px') {
                    show(0);
                }
            }, 300);
        };
        var hoverOut = function() {
            var $this = $(this);
            var hide = function(speed) {
                $this.children().animate({
                    top: '120px',
                    opacity: '0'
                }, speed, function() {
                    $this.children().css('display', 'none');
                });
            };
            $this.removeClass('nav-hover_in');
            if ($this.children().css('top') == '90px') {
                hide(300);
            }
            setTimeout(function() {
                if ($this.children().css('top') != '120px') {
                    hide(0);
                }
            }, 300);
        };
        $(navLevel1Items).hover(hoverIn, hoverOut);
    }

    // window resize control
    $(window).on('resize', function(){
        styleControll();    
    });
    styleControll();
    navGo('#header');
})();