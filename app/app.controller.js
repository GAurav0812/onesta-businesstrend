ableApp.controller('globalController', function ($scope, $timeout, $state) {
    $scope.$state = $state;
    $scope.windowWidth = $(window);
    $scope.init = function () {

        angular.element('.loader-bar').animate({width: $scope.windowWidth.width()}, 2000);
        $timeout(function () {
            while (angular.element('.loader-bar').width() == $scope.windowWidth.width()) {
                removeloader();
                break;
            }
        }, 2500);
        angular.element('.loader-bg').fadeOut('slow');
    };

    /*chatbar js start*/
    /*chat box scroll*/
    var a = $scope.windowWidth.height() - 50;
    $scope.friendListScroll = {
        height: a,
        allowPageScroll: false,
        wheelStep: 1,
        color: '#1b8bf9'
    };

    // search
    angular.element("#search-friends").on("keyup", function () {
        $scope.g = $(this).val().toLowerCase();
        angular.element(".friendlist-box .media-body .friend-header").each(function () {

            $scope.s = $(this).text().toLowerCase();
            $(this).closest('.friendlist-box')[$scope.s.indexOf($scope.g) !== -1 ? 'show' : 'hide']();
        });
    });

    // open chat box
    $scope.displayChatBox = function () {
        $scope.options = {
            direction: 'right'
        };
        angular.element('.showChat').toggle('slide', $scope.options, 500);
    };
    //open friend chat
    $scope.friendListBox = function () {
        $scope.options = {
            direction: 'right'
        };
        angular.element('.showChat_inner').toggle('slide', $scope.options, 500);
    };
    //back to main chatbar
    $scope.backChatBox = function () {
        $scope.options = {
            direction: 'right'
        };
        angular.element('.showChat_inner').toggle('slide', $scope.options, 500);
        angular.element('.showChat').css('display', 'block');
    };
    /*chatbar js ends*/

    //sidebar dropdown open
    $scope.designation = function () {
        angular.element(".extra-profile-list").slideToggle();
    };

    // toggle full screen
    $scope.toggleFullScreen = function () {
        if (!document.fullscreenElement && // alternative standard method
            !document.mozFullScreenElement && !document.webkitFullscreenElement) { // current working methods
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }
    /*
    // chat-sidebar
    var ost = 0;
    $(window).scroll(function() {
        var windowHeight = $scope.windowWidth.innerHeight();
        if ($scope.windowWidth.width() <= 767) {
            var cOst = $(this).scrollTop();
            if (cOst == 0) {
                angular.element('.showChat').removeClass('top-showChat').addClass('fix-showChat');
            } else if (cOst > ost) {
                angular.element('.showChat').removeClass('fix-showChat').addClass('top-showChat');
            }
            ost = cOst;
        }
    });

    // Start [ Menu-bottom ]
        angular.element(".dropup-mega, .dropup").hover(function() {
            var dropdownMenu = $(this).children(".dropdown-menu");
            $(this).toggleClass("open");
        });
    // End [ Menu ]*/

    //element js 
    angular.element(".md-form-control").each(function () {
        $(this).parent().append('<span class="md-line"></span>');
    });
    angular.element(".md-form-control").change(function () {
        if ($(this).val() == "") {
            $(this).removeClass("md-valid");
        } else {
            $(this).addClass("md-valid");
        }
    });
});


ableApp.controller('menuController', function ($scope, $location, $window, $document) {
    /*    //$controller('globalController', { $scope: $scope, $log: $log, $timeout: $timeout, $state: $state });*/
    /*chat box scroll*/
    angular.element('aside.main-sidebar').height($('body').height() - 50);

    $scope.abc = function () {

        debugger;
        var $window = $(window);
        if ($window.width() < 767) {
            $scope.setMenu();
        } else {
            if (angular.element("body").hasClass("sidebar-collapse") == true) {

                $scope.sidebar = {
                    destroy: true
                };

                if (angular.element("body").hasClass("box-layout") == true) {
                    angular.element("body").removeClass("fixed");
                } else {
                    angular.element("body").addClass("fixed");
                    angular.element("body").addClass("header-fixed");
                }
                angular.element(".sidebar").css('overflow', 'visible');
                angular.element(".sidebar-menu").css('overflow', 'visible');
                angular.element(".sidebar-menu").css('height', 'auto');
            } else {
                var a = $(window).height() - 70;
                angular.element('#sidebar-scroll').height($(window).height() - 70);
                $scope.sidebar = {
                    height: a,
                    allowPageScroll: false,
                    wheelStep: 5,
                    color: '#000'
                };

                angular.element("body").removeClass("header-fixed");
                if (angular.element("body").hasClass("box-layout") == true) {
                    angular.element("body").removeClass("fixed");
                } else {
                    angular.element("body").addClass("fixed");
                }
                angular.element("#sidebar-scroll").css('width', '100%');
                angular.element(".sidebar").css('overflow', 'inherit');
                angular.element(".sidebar-menu").css('overflow', 'inherit');
            }
        }
    };

    //for menu
    var w = angular.element($window);

    w.bind('resize', function () {
        $scope.setMenu();
    });
    $scope.setMenu = function () {

        var $window = $(window);
        if ($window.width() < 1024 && $window.width() >= 767) {
            if (angular.element("body").hasClass("container") == true) {
                angular.element("body").addClass("container");
            }
            $scope.sidebar = {destroy: true};
            angular.element("body").removeClass("fixed");
            angular.element("body").addClass("sidebar-collapse");
            angular.element(".sidebar").css('overflow', 'visible');
            angular.element(".sidebar-menu").css('overflow', 'visible');
            angular.element(".sidebar-menu").css('height', 'auto');
        } else if ($window.width() < 540 && $window.width() < 767) {
            if (angular.element("body").hasClass("box-layout") == true) {
                angular.element("body").removeClass("container");
            }
            angular.element(".main-header").css('margin-top', '50px');
            $scope.sidebar = {destroy: true};
            angular.element("body").removeClass("fixed");
            angular.element("body").addClass("sidebar-collapse");
            angular.element(".sidebar").css('overflow', 'visible');
            angular.element(".sidebar-menu").css('overflow', 'visible');
            angular.element(".sidebar-menu").css('height', 'auto');
        } else if ($window.width() > 540 && $window.width() < 767) {
            if (angular.element("body").hasClass("box-layout") == true) {
                angular.element("body").removeClass("container");
            }
            angular.element(".main-header").css('margin-top', '0px');
            $scope.sidebar = {destroy: true};
            angular.element("body").removeClass("fixed");
            angular.element("body").addClass("sidebar-collapse");
            angular.element(".sidebar").css('overflow', 'visible');
            angular.element(".sidebar-menu").css('overflow', 'visible');
            angular.element(".sidebar-menu").css('height', 'auto');
        } else if ($window.width() >= 1024) {
            var a = $(window).height() - 70;
            $('#sidebar-scroll').height($(window).height() - 70);
            $scope.sidebar = {
                height: a,
                allowPageScroll: false,
                wheelStep: 5,
                color: '#000'
            };
            angular.element(".main-header").css('margin-top', '0px');
            if (angular.element("body").hasClass("box-layout") == true) {
                angular.element("body").removeClass("fixed");
                angular.element("body").addClass("container");
            } else {
                angular.element("body").addClass("fixed");
            }
            angular.element("body").removeClass("sidebar-collapse");
            angular.element("#sidebar-scroll").css('width', '100%');
            angular.element(".sidebar").css('overflow', 'inherit');
            angular.element(".sidebar-menu").css('overflow', 'inherit');
        } else {

            angular.element("body").removeClass("sidebar-collapse");
            if (angular.element("body").hasClass("box-layout") == true) {
                angular.element("body").removeClass("fixed");
                angular.element("body").addClass("container");
            } else {
                angular.element("body").addClass("fixed");
            }
        }
    };
    $scope.tree = function (menu) {

        var _this = this;
        var animationSpeed = 200;
        $scope.openTree = function (event) {

            //Get the clicked link and the next element
            var $this = $(event.currentTarget);
            var checkElement = $(event.currentTarget).children()[1];

            //Check if the next element is a menu and is visible
            if ((checkElement.className == "treeview-menu") && (checkElement.className == ":visible")) {
                //Close the menu
                $(checkElement).slideUp(animationSpeed, function () {
                    checkElement.removeClass('menu-open');
                    //Fix the layout in case the sidebar stretches over the height of the window
                    //_this.layout.fix();
                });
                checkElement.parent("li").removeClass("active-tree");
            }
            //If the menu is not visible
            else if ((checkElement.className == "treeview-menu") && (checkElement.className != ":visible")) {
                //Get the parent menu
                var parent = $this.parents('ul').first();
                //Close all open menus within the parent
                var ul = parent.find('ul:visible').slideUp(animationSpeed);
                //Remove the menu-open class from the parent
                ul.removeClass('menu-open');
                //Get the parent li
                var parent_li = $this.parent("li");

                //Open the target menu and add the menu-open class
                $(checkElement).slideDown(animationSpeed, function () {
                    //Add the class active to the parent li
                    $(checkElement).addClass('menu-open');
                    parent.find('li.active-tree').removeClass('active-tree');
                    parent_li.addClass('active-tree');
                });
            }
            //if this isn't a link, prevent the page from being redirected
            if (checkElement.className == "treeview-menu") {

            }
        };
    };
    // Activate sidenav treemenu
    /* $.tree('.sidebar');*/
    $scope.tree('.sidebar');
});

ableApp.controller('megaMenuController', function ($scope, $location, $window) {
    //$controller('globalController', { $scope: $scope, $log: $log, $timeout: $timeout, $state: $state });
    /*chat box scroll*/
    angular.element('aside.main-sidebar').height($('body').height() - 50);

    angular.element('.sidebar-toggle').on('click', function () {
        var $window = $(window);
        if ($window.width() < 767) {
            $scope.setMenu();
        } else {
            if (angular.element("body").hasClass("sidebar-collapse") == true) {

                angular.element("#sidebar-scroll").slimScroll({destroy: true});

                if (angular.element("body").hasClass("box-layout") == true) {
                    angular.element("body").removeClass("fixed");
                } else {
                    angular.element("body").addClass("fixed");
                    angular.element("body").addClass("header-fixed");
                }
                angular.element(".sidebar").css('overflow', 'visible');
                angular.element(".sidebar-menu").css('overflow', 'visible');
                angular.element(".sidebar-menu").css('height', 'auto');
            } else {
                var a = $(window).height() - 70;
                angular.element('#sidebar-scroll').height($(window).height() - 70);
                $scope.sidebar = {
                    height: a,
                    allowPageScroll: false,
                    wheelStep: 5,
                    color: '#000'
                };

                angular.element("body").removeClass("header-fixed");
                if (angular.element("body").hasClass("box-layout") == true) {
                    angular.element("body").removeClass("fixed");
                } else {
                    angular.element("body").addClass("fixed");
                }
                angular.element("#sidebar-scroll").css('width', '100%');
                angular.element(".sidebar").css('overflow', 'inherit');
                angular.element(".sidebar-menu").css('overflow', 'inherit');
            }
        }
    });

    //for menu
    var w = angular.element($window);

    w.bind('resize', function () {
        $scope.setMenu();
    });
    $scope.setMenu = function () {

        var $window = $(window);
        if ($(window).width() > 767) {

            angular.element("body").addClass('fixed');
        } else if ($window.width() < 540 && $window.width() < 767) {
            angular.element(".main-header").css('margin-top', '50px');
            angular.element("body").removeClass("fixed");
        } else if ($window.width() > 540 && $window.width() < 767) {
            angular.element(".main-header").css('margin-top', '0px');
            angular.element("body").removeClass("fixed");
        }
    };

});

ableApp.controller('menuFooterFixedController', function ($scope, $location, $window) {
    //$controller('globalController', { $scope: $scope, $log: $log, $timeout: $timeout, $state: $state });
    /*chat box scroll*/
    angular.element('aside.main-sidebar').height($('body').height() - 50);

    angular.element('.sidebar-toggle').on('click', function () {
        var $window = $(window);
        if ($window.width() < 767) {
            $scope.setMenu();
        } else {
            if (angular.element("body").hasClass("sidebar-collapse") == true) {

                $scope.sidebar = {destroy: true};

                if (angular.element("body").hasClass("box-layout") == true) {
                    angular.element("body").removeClass("fixed");
                } else {
                    angular.element("body").addClass("fixed");
                    angular.element("body").addClass("header-fixed");
                }
                angular.element(".sidebar").css('overflow', 'visible');
                angular.element(".sidebar-menu").css('overflow', 'visible');
                angular.element(".sidebar-menu").css('height', 'auto');
            } else {
                var a = $(window).height() - 70;
                angular.element('#sidebar-scroll').height($(window).height() - 70);
                $scope.sidebar = {
                    height: a,
                    allowPageScroll: false,
                    wheelStep: 5,
                    color: '#000'
                };

                angular.element("body").removeClass("header-fixed");
                if (angular.element("body").hasClass("box-layout") == true) {
                    angular.element("body").removeClass("fixed");
                } else {
                    angular.element("body").addClass("fixed");
                }
                angular.element("#sidebar-scroll").css('width', '100%');
                angular.element(".sidebar").css('overflow', 'inherit');
                angular.element(".sidebar-menu").css('overflow', 'inherit');
            }
        }
    });

    var w = angular.element($window);
    w.bind('resize', function () {
        $scope.setMenu();
    });
    $scope.setMenu = function () {

        if ($(window).height() > $('body').height())
            angular.element('.footer-bg').css('position', 'fixed');
        else
            angular.element('.footer-bg').css('position', 'absolute');
    };

});

ableApp.controller('menuHeaderFixedController', function ($scope, $location, $window) {
    //$controller('globalController', { $scope: $scope, $log: $log, $timeout: $timeout, $state: $state });
    /*chat box scroll*/
    angular.element('aside.main-sidebar').height($('body').height() - 50);

    angular.element('.sidebar-toggle').on('click', function () {
        var $window = $(window);
        if ($window.width() < 767) {
            $scope.setMenu();
        } else {
            if (angular.element("body").hasClass("sidebar-collapse") == true) {

                $scope.sidebar = {destroy: true};

                if (angular.element("body").hasClass("box-layout") == true) {
                    angular.element("body").removeClass("fixed");
                } else {
                    angular.element("body").addClass("fixed");
                    angular.element("body").addClass("header-fixed");
                }
                angular.element(".sidebar").css('overflow', 'visible');
                angular.element(".sidebar-menu").css('overflow', 'visible');
                angular.element(".sidebar-menu").css('height', 'auto');
            } else {
                var a = $(window).height() - 70;
                angular.element('#sidebar-scroll').height($(window).height() - 70);
                $scope.sidebar = {
                    height: a,
                    allowPageScroll: false,
                    wheelStep: 5,
                    color: '#000'
                };

                angular.element("body").removeClass("header-fixed");
                if (angular.element("body").hasClass("box-layout") == true) {
                    angular.element("body").removeClass("fixed");
                } else {
                    angular.element("body").addClass("fixed");
                }
                angular.element("#sidebar-scroll").css('width', '100%');
                angular.element(".sidebar").css('overflow', 'inherit');
                angular.element(".sidebar-menu").css('overflow', 'inherit');
            }
        }
    });

    var w = angular.element($window);
    w.bind('resize', function () {
        $scope.setMenu();
    });
    $scope.setMenu = function () {

        var $window = $(window);
        if ($window.width() < 1024 && $window.width() >= 767) {
            angular.element("body").addClass("sidebar-collapse");
            angular.element("body").removeClass("fixed");
            angular.element("#sidebar-scroll").css('width', '100%');
            $scope.sidebar = {
                destroy: true
            };
            angular.element(".sidebar").css('overflow', 'visible');
            angular.element(".sidebar-menu").css('overflow', 'visible');
        } else if ($window.width() >= 1024) {
            angular.element("#sidebar-scroll").css('width', '100%');
            $scope.sidebar = {
                destroy: true
            };
            angular.element(".sidebar").css('overflow', 'visible');
            angular.element(".sidebar-menu").css('overflow', 'visible');
            angular.element("body").removeClass("fixed");
        } else if ($window.width() < 767) {

            angular.element("body").addClass("sidebar-collapse");
            angular.element("body").removeClass("fixed");
            angular.element("#sidebar-scroll").css('width', '100%');
            $scope.sidebar = {
                destroy: true
            };
            angular.element(".sidebar").css('overflow', 'visible');
            angular.element(".sidebar-menu").css('overflow', 'visible');
        } else {
            angular.element("body").removeClass("sidebar-collapse");
            angular.element("body").addClass("fixed");
            var a = $(window).height() - 70;
            angular.element('#sidebar-scroll').height($(window).height() - 70);
            $scope.sidebar = {
                height: a,
                allowPageScroll: false,
                wheelStep: 5,
                color: '#000'
            };
            angular.element("#sidebar-scroll").css('width', '100%');
            angular.element(".sidebar").css('overflow', 'inherit');
            angular.element(".sidebar-menu").css('overflow', 'inherit');
        }
    };

});

ableApp.controller('menuHorizontalController', function ($scope, $location, $window) {


    angular.element("body").addClass("horizontal-fixed");
    angular.element('.sidebar-toggle').on('click', function () {
        var $window = $(window);
        if ($window.width() < 767) {
            if (angular.element("body").hasClass("sidebar-open") == true) {
                angular.element("body").removeClass("sidebar-open");
            } else {
                angular.element("body").addClass("sidebar-open");
            }
        }
    });
    angular.element('.sidebar-menu ').on('click', function () {
        var $window = $(window);
        if ($window.width() < 767) {
            if (angular.element("body").hasClass("sidebar-open") == true) {
                angular.element("body").removeClass("sidebar-open");
            }
        }
    });


});

ableApp.controller('menuHorizontalIconFixedController', function ($scope, $location, $window) {
    $(window).scroll(function () {
        if ($(window).width() > 767) {
            var sidbar_top = 50 - $(window).scrollTop();
            if ($(window).scrollTop() > 50) {
                angular.element('.main-sidebar').css('position', 'fixed');
                angular.element('.main-sidebar').css('top', '0');
                angular.element('.main-sidebar').css('padding-top', '0');
            }
            else {
                angular.element('.main-sidebar').css('position', 'absolute');
                angular.element('.main-sidebar').css('padding-top', '50px');
            }
        }
        else {
            angular.element('.main-sidebar').css('position', 'absolute');
            angular.element('.main-sidebar').css('padding-top', '100px');
        }
    });
});

ableApp.controller('menuSidebarStickyController', function ($scope, $location, $window) {
    //$controller('globalController', { $scope: $scope, $log: $log, $timeout: $timeout, $state: $state });
    /*chat box scroll*/
    angular.element('aside.main-sidebar').height($('body').height() - 50);

    angular.element('.sidebar-toggle').on('click', function () {
        var $window = $(window);
        if ($window.width() < 767) {
            $scope.setMenu();
        } else {
            if (angular.element("body").hasClass("sidebar-collapse") == true) {

                $scope.sidebar = {destroy: true};

                if (angular.element("body").hasClass("box-layout") == true) {
                    angular.element("body").removeClass("fixed");
                } else {
                    angular.element("body").addClass("fixed");
                    angular.element("body").addClass("header-fixed");
                }
                angular.element(".sidebar").css('overflow', 'visible');
                angular.element(".sidebar-menu").css('overflow', 'visible');
                angular.element(".sidebar-menu").css('height', 'auto');
            } else {
                var a = $(window).height() - 70;
                angular.element('#sidebar-scroll').height($(window).height() - 70);
                $scope.sidebar = {
                    height: a,
                    allowPageScroll: false,
                    wheelStep: 5,
                    color: '#000'
                };

                angular.element("body").removeClass("header-fixed");
                if (angular.element("body").hasClass("box-layout") == true) {
                    angular.element("body").removeClass("fixed");
                } else {
                    angular.element("body").addClass("fixed");
                }
                angular.element("#sidebar-scroll").css('width', '100%');
                angular.element(".sidebar").css('overflow', 'inherit');
                angular.element(".sidebar-menu").css('overflow', 'inherit');
            }
        }
    });

    $(window).scroll(function () {
        if ($("body").hasClass("sidebar-collapse") == false) {
            if ($(window).width() < 767)
                var sidbar_top = 100 - $(window).scrollTop();
            else
                var sidbar_top = 50 - $(window).scrollTop();
            setMenuscroll(sidbar_top);
        } else {
            $('.main-sidebar').css('position', 'absolute');
        }
    });

    function setMenuscroll(sidbar_top) {
        if (sidbar_top > 0) {
            $('.main-sidebar').css('padding-top', sidbar_top);
            $('.main-sidebar').css('top', '0');
            $('.main-sidebar').css('position', 'fixed');
        } else {
            $('.main-sidebar').css('padding-top', '0');
            $('.main-sidebar').css('top', '0');
            $('.main-sidebar').css('position', 'fixed');
        }
    }

    $('.sidebar-toggle').on('click', function () {
        var $window = $(window);
        if ($window.width() < 767) {
            setMenu();
        } else {
            if ($("body").hasClass("sidebar-collapse") == true) {
                $("#sidebar-scroll").slimScroll({destroy: true});
                $("body").removeClass("fixed");
                $("body").addClass("header-fixed");
                $(".sidebar").css('overflow', 'visible');
                $(".sidebar-menu").css('overflow', 'visible');
                $(".sidebar-menu").css('height', 'auto');
            } else {
                var a = $(window).height() - 70;
                $('#sidebar-scroll').height($(window).height() - 70);
                $("#sidebar-scroll").slimScroll({
                    height: a,
                    allowPageScroll: false,
                    wheelStep: 5,
                    color: '#fff'
                });
                $("body").removeClass("header-fixed");
                $("body").addClass("fixed");
                $("#sidebar-scroll").css('width', '100%');
                $(".sidebar").css('overflow', 'inherit');
                $(".sidebar-menu").css('overflow', 'inherit');
            }
        }
    });

    var w = angular.element($window);
    w.bind('resize', function () {
        $scope.setMenu();
    });
    $scope.setMenu = function () {

        var $window = $(window);
        if ($window.width() < 1024 && $window.width() >= 767) {
            $scope.sidebar = {destroy: true};
            $("body").removeClass("fixed");
            $("body").addClass("sidebar-collapse");
            $(".sidebar").css('overflow', 'visible');
            $(".sidebar-menu").css('overflow', 'visible');
            $(".sidebar-menu").css('height', 'auto');
            var sidbar_top = 50 - $(window).scrollTop();
            setMenuscroll(sidbar_top);
        } else if ($window.width() < 767) {

            $scope.sidebar = {destroy: true};
            $("body").removeClass("fixed");
            $("body").addClass("sidebar-collapse");
            $(".sidebar").css('overflow', 'visible');
            $(".sidebar-menu").css('overflow', 'visible');
            $(".sidebar-menu").css('height', 'auto');

        } else if ($window.width() >= 1024) {

            var a = $(window).height() - 70;
            $('#sidebar-scroll').height($(window).height() - 70);
            $scope.sidebar = {
                height: a,
                allowPageScroll: false,
                wheelStep: 5,
                color: '#000'
            };
            $("body").addClass("fixed");
            $("body").removeClass("sidebar-collapse");
            $("#sidebar-scroll").css('width', '100%');
            $(".sidebar").css('overflow', 'inherit');
            $(".sidebar-menu").css('overflow', 'inherit');
            var sidbar_top = 50 - $(window).scrollTop();
            setMenuscroll(sidbar_top);
        } else {
            $("body").removeClass("sidebar-collapse");
            $("body").addClass("fixed");
            var sidbar_top = 100 - $(window).scrollTop();
            setMenuscroll(sidbar_top);
        }
    };

});

ableApp.controller('menuStaticController', function ($scope, $location, $window) {
    //$controller('globalController', { $scope: $scope, $log: $log, $timeout: $timeout, $state: $state });
    /*chat box scroll*/
    angular.element('aside.main-sidebar').height($('body').height() - 50);

    angular.element('.sidebar-toggle').on('click', function () {
        var $window = $(window);
        if ($window.width() < 767) {
            $scope.setMenu();
        } else {

            if (angular.element("body").hasClass("sidebar-collapse") == true) {

                $scope.sidebar = {destroy: true};

                if (angular.element("body").hasClass("box-layout") == true) {
                    angular.element("body").removeClass("fixed");
                } else {
                    angular.element("body").addClass("fixed");
                    angular.element("body").addClass("header-fixed");
                }
                angular.element(".sidebar").css('overflow', 'visible');
                angular.element(".sidebar-menu").css('overflow', 'visible');
                angular.element(".sidebar-menu").css('height', 'auto');
            } else {

                var a = $(window).height() - 70;
                angular.element('#sidebar-scroll').height($(window).height() - 70);
                $scope.sidebar = {
                    height: a,
                    allowPageScroll: false,
                    wheelStep: 5,
                    color: '#000'
                };

                angular.element("body").removeClass("header-fixed");
                if (angular.element("body").hasClass("box-layout") == true) {
                    angular.element("body").removeClass("fixed");
                } else {
                    angular.element("body").addClass("fixed");
                }
                angular.element("#sidebar-scroll").css('width', '100%');
                angular.element(".sidebar").css('overflow', 'inherit');
                angular.element(".sidebar-menu").css('overflow', 'inherit');
            }
        }
    });

    //for menu
    var w = angular.element($window);

    w.bind('resize', function () {
        $scope.setMenu();
    });
    $scope.setMenu = function () {
        debugger;
        var $window = $(window);
        if ($window.width() < 1024 && $window.width() >= 767) {
            $("body").addClass("sidebar-collapse");
            $("body").removeClass("fixed");
        } else if ($window.width() >= 1024) {
            $("#sidebar-scroll").css('width', '100%');
            $scope.sidebar = {destroy: true};
            $(".sidebar").css('overflow', 'visible');
            $(".sidebar-menu").css('overflow', 'visible');
            $("body").removeClass("fixed");
        } else if ($window.width() < 767) {
            $("body").addClass("sidebar-collapse");
            $("body").removeClass("fixed");
        } else {
            debugger;
            $("body").removeClass("sidebar-collapse");
            $("body").addClass("fixed");
            var a = $(window).height() - 70;
            $('#sidebar-scroll').height($(window).height() - 70);
            $("#sidebar-scroll").slimScroll({
                height: a,
                allowPageScroll: false,
                wheelStep: 5,
                color: '#000'
            });
            $("#sidebar-scroll").css('width', '100%');
            $(".sidebar").css('overflow', 'inherit');
            $(".sidebar-menu").css('overflow', 'inherit');
        }
    };

});


ableApp.controller("accordionController", function ($scope) {
    //$controller('globalController', { $scope: $scope, $timeout: $timeout, $state: $state });

    // Accordion 
    $scope.oneAtATime = false;
    $scope.status = {
        multiple1Open: true,
        multiplelclose: false,
        multiple2close: false,
        single1Open: true,
        singlelclose: false,
        single2close: false,
        scale1Open: true,
        scalelclose: false,
        scale2close: false,
        color1Open: true,
        colorlclose: false,
        color2close: false
    };
});

ableApp.controller('commonController', function ($scope) {


    angular.element(".md-form-control").each(function () {
        $(this).parent().append('<span class="md-line"></span>');
    });
    angular.element(".md-form-control").change(function () {
        if ($(this).val() == "") {
            $(this).removeClass("md-valid");
        } else {
            $(this).addClass("md-valid");
        }
    });
});

ableApp.controller('aceEditorController', function ($scope) {
    //$controller('globalController', { $scope: $scope, $timeout: $timeout, $state: $state });
    $scope.editor = ace.edit("editor");
    $scope.editor.setTheme("ace/theme/xcode");
    $scope.editor.session.setMode("ace/mode/javascript");
    $scope.editor.getSession().on('change', function (e) {
        $scope.update(a);
    });
    $scope.update = function (a) {
        $scope.editor.session.setMode(a);
    };
    angular.element("#mode").on('change', function (event) {
        $scope.currentMode = this.value;
        var a = "ace/mode/" + $scope.currentMode;
        $scope.editor.session.setMode(a);
        $scope.update(a);
    });
});

ableApp.controller('animationController', function ($scope) {
    //$controller('globalController', { $scope: $scope, $timeout: $timeout, $state: $state });
    $scope.transitions = "bounce";
    $scope.init = function () {
        $scope.a = $scope.transitions;
        $scope.name = angular.element(".item").addClass("animated " + $scope.a);
        $(".item").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            angular.element(".item").removeClass("animated " + $scope.a);
        });
    }

    $scope.animate = function (t) {

        $scope.a = $scope.transitions;
        $scope.name = angular.element(".item").addClass("animated " + $scope.a);
        $(".item").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            angular.element(".item").removeClass("animated " + $scope.a);
        });
    };
    $scope.Clickanimate = function () {

        $scope.a = $scope.transitions;
        $scope.name = angular.element(".item").addClass("animated " + $scope.a);
        $(".item").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            angular.element(".item").removeClass("animated " + $scope.a);
        });
    };
});

ableApp.controller('buttonFabController', function ($scope) {
    //$controller('globalController', { $scope: $scope, $timeout: $timeout, $state: $state });
    // toolbar button
    angular.element(".fab-icon").click(function () {
        angular.element(".fab-icon i").toggleClass("toolbar-active");
    });

    // SPEED DIAL button
    angular.element(".jfab_main_btn").click(function () {
        angular.element(".jfab_btns_wrapper").removeClass("speed-btn");
        angular.element(".jfab_btns_wrapper").toggleClass("speed-dial-btn");

    });

    // Radial button
    angular.element('.fab').click(function () {
        angular.element('.radial').toggleClass('open');
    });

    /*floating action button*/
    angular.element(".popout .btn").click(function () {

        angular.element(this).toggleClass("active");
        angular.element(this).closest(".popout").find(".panel").toggleClass("active");
    });
    angular.element(document).click(function () {
        angular.element(".popout .panel").removeClass("active");
        angular.element(".popout .btn").removeClass("active");
    });
    angular.element(".popout .panel").click(function (event) {

        event.stopPropagation();
    });
    angular.element(".popout .btn").click(function (event) {
        event.stopPropagation();
    });

    // FAB-EXPAND-ANIMATION
    $scope.fab = $('#fab-expand');
    $scope.isExpanded = false;

    $scope.fab.on('click', function () {

        if (!$scope.isExpanded) {
            $scope.fab.addClass('is-expanding');

            setTimeout(function () {
                $scope.fab.find('.icofont').removeClass('icofont-plus').addClass('icofont-ui-close expand-close');
                $scope.fab.removeClass('is-expanding').addClass('expanded');
                $scope.isExpanded = true;
                $scope.fab.trigger('expanded');
            }, 500);
        }
    });

    $scope.fab.on('click', '.expand-close', function (e) {

        $scope.close = $(this);
        e.stopPropagation();
        $scope.fab.find('.inner-content').remove();
        $scope.fab.removeClass('expanded').addClass('is-closing');

        setTimeout(function () {
            $scope.close.removeClass('icofont-ui-close pull-right expand-close').addClass('icofont-plus');
            $scope.fab.removeClass('is-closing');
            $scope.isExpanded = false;
        }, 500);
    });

    $scope.fab.on('expanded', function () {
        $scope.fab.append('<h1 class="inner-content">Content<h1/>');
    });
});


ableApp.controller('ckEditorController', function ($scope) {
    //$controller('globalController', { $scope: $scope, $timeout: $timeout, $state: $state });
    // setup editor options
    $scope.editorOptions = {
        language: 'en',
        uiColor: '#ffffff'
    };
    $scope.modelName = '<figure class="image image-illustration" style="float:left"> <img alt="" height="266" src="http://c.cksource.com/a/1/img/demo/brownie.jpg" width="400" /> <figcaption>Bon App&eacute;tit!</figcaption> </figure> <h2>Brownies</h2> <h3>Ingredients:</h3> <ul> <li>½ cup flour</li> <li>1 cup sugar</li> <li>½ cup butter, melted</li> <li>2 eggs</li> <li>1/3 cup cocoa powder</li> </ul> <p>Preheat the oven to <strong>350°F</strong> and grease the baking pan. Combine the flour, sugar and cocoa powder in a medium bowl. In another small bowl, whisk together the butter and eggs. Stir the two mixtures until just combined. Bake the brownies for 25 to 35 minutes. Remove from the oven and let it cool for 5 minutes. </p>';
    $scope.modelName1 = '<h1 style="text-align:center"><span style="font-family:Georgia,serif"><span style="color:#006699">Recognition of Achievement</span></span></h1> <p style="text-align:justify"><span style="font-family:Georgia,serif">This letter acknowledges the invaluable input <strong>you</strong>, as a member of our <em>Innovation Team</em>,&nbsp;have provided in the &ldquo;Implement Rich Text Editor&rdquo;&nbsp;project. The Management would like to hereby thank you for this great accomplishment that was delivered in a timely fashion, up to the highest company standards, and with great results:</span></p> <table border="1" bordercolor="#ccc" cellpadding="5" cellspacing="0" style="border-collapse:collapse;width:100%" summary="Project Schedule"> <thead> <tr> <th scope="col" style="background-color:#cccccc"><span style="font-family:Georgia,serif">Project Phase</span></th> <th scope="col" style="background-color:#cccccc"><span style="font-family:Georgia,serif">Deadline</span></th> <th scope="col" style="background-color:#cccccc"><span style="font-family:Georgia,serif">Status</span></th> </tr> </thead> <tbody> <tr> <td><span style="font-family:Georgia,serif">Phase 1: Market research</span></td> <td style="text-align:center"><span style="font-family:Georgia,serif">2016-10-15</span></td> <td style="text-align:center"><span style="font-family:Georgia,serif"><span style="color:#19b159">✓</span></span></td> </tr> <tr> <td style="background-color:#eeeeee"><span style="font-family:Georgia,serif">Phase 2: Editor implementation</span></td> <td style="background-color:#eeeeee; text-align:center"><span style="font-family:Georgia,serif">2016-10-20</span></td> <td style="background-color:#eeeeee; text-align:center"><span style="font-family:Georgia,serif"><span style="color:#19b159">✓</span></span></td> </tr> <tr> <td><span style="font-family:Georgia,serif">Phase 3: Rollout to Production</span></td> <td style="text-align:center"><span style="font-family:Georgia,serif">2016-10-22</span></td> <td style="text-align:center"><span style="font-family:Georgia,serif"><span style="color:#19b159">✓</span></span></td> </tr> </tbody> </table> <p style="text-align:justify"><span style="font-family:Georgia,serif">The project that you participated in is of utmost importance to the future success of our platform. &nbsp;We are very proud to share that&nbsp;the&nbsp;CKEditor implementation was a huge success and brought congratulations from both the key Stakeholders and the Customers:</span></p> <blockquote> <p style="text-align:center">This new editor has totally changed our content creation experience!</p> <p style="text-align:center">&mdash; John F. Smith, CEO, The New Web</p> </blockquote> <p style="text-align:justify"><span style="font-family:Georgia,serif">This letter recognizes that much of our success is directly attributable to your efforts.&nbsp;You deserve to be proud of your achievement. May your future efforts be equally successful and rewarding.</span></p> <p style="text-align:justify"><span style="font-family:Georgia,serif">I am sure we will be seeing and hearing a great deal more about your accomplishments in the future. Keep up the good work!</span></p> <p>&nbsp;</p> <p><span style="font-family:Georgia,serif">Best regards,</span></p> <p><span style="font-family:Georgia,serif"><em>The Management</em></span></p>';
});

ableApp.controller('dataTableController', function ($scope, DTOptionsBuilder) {
    //$controller('globalController', { $scope: $scope, $timeout: $timeout, $state: $state });
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('full_numbers')
        .withBootstrap()
        .withOption('bLengthChange', false)
        .withButtons([
            'copy', 'excel', 'csv', 'pdf', 'print'
        ]);
});


ableApp.filter('checkIsEmptyData', function () {
    return function (obj) {
        if (obj.Category !== "" && angular.isDefined(obj.Category)) {
            return obj.Value;
        }
        {
            return null
        }
    }
});
ableApp.filter('checkIsEmptyCat', function () {
    return function (value) {
        if (value !== "" && angular.isDefined(value)) {
            return value;
        }
        {
            return ""
        }
    }
});

ableApp.filter('negativeGrowthCheck', function () {
    return function (value) {
        if (value != null && angular.isDefined(value) && value < 0) {
            return Math.abs(value);
        } else {
            return value
        }
    }
});

ableApp.filter('numberToThousand', function () {
    return function (value) {
        var val = Math.round(value);
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});

ableApp.controller('dashboardController', function ($scope, $uibModal, HttpService, $location, $rootScope, $filter, CriteriaFilter, $state) {

    $scope.countFrom = 0;
    $scope.summaryDataObj = {
        "MTDCovers": 0,
        "MTDSale": 0,
        "TotalOutlet": 0,
        "YTDCovers": 0,
        "YTDSale": 0,
        "DayCovers": 0,
        "DaySale": 0
    };
    $scope.todaySaleData = {"Sale": 0, "Cover": 0, "Outlets": 0, "LastUpdatedOn": "-"}
    $scope.hierarchyMaster = {"City": [], "Cluster": [], "Outlet": [], "Region": []};
    $scope.selectedFilter = {
        "City": "",
        "Cluster": "",
        "Outlet": "",
        "Region": "",
        "Session": ""
    };
    $scope.corelationFilter = 'D';
    $scope.subCriteriaFilter = 'MTD_Sale';
    $scope.monthlySummaryOptions = {
        chart: {
            type: 'multiBarChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 50,
                left: 80
            },
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.value + (1e-10);
            },
            showValues: true,
            duration: 500,
            stacked: false,
            showControls: true,
            valueFormat: function (d) {
                return d3.format('.2f')(d);
            },
            xAxis: {
                axisLabel: 'X Axis'
            },
            yAxis: {
                axisLabel: 'Count'
            },
            tooltip: {
                contentGenerator: function (d) {
                    var str = '<table>' +
                        '<thead>' +
                        '<tr><td class="legend-color-guide">' + d.data.key + '<strong> : ' + d.data.value + '</strong></td></tr>' +
                        '</thead>';

                    str = str + '</table>';
                    return str;
                }
            }
        }
    };

    $scope.baroptions = {
        chart: {
            type: 'linePlusBarChart',
            height: 500,
            margin: {
                top: 30,
                right: 10,
                bottom: 50,
                left: 55
            },
            color: ['#19ce71'],
            showLegend: false,
            showValues: true,
            x: function (d, i) {
                return i
            },
            xAxis: {
                axisLabel: 'X Axis',
                tickFormat: function (d) {
                    var dx = $scope.criteriaFilteredData[0].values[d] && $scope.criteriaFilteredData[0].values[d].x || 0;
                    return dx;
                },
                showMaxMin: false
            },
            x2Axis: {
                tickFormat: function (d) {
                    return null;
                },
                showMaxMin: false
            },
            y1Axis: {
                axisLabel: 'Sales (millions)',
                tickFormat: function (d) {
                    return d;
                },
                axisLabelDistance: 12
            },
            y3Axis: {
                tickFormat: function (d) {
                    return d;
                }
            },
            tooltip: {

                contentGenerator: function (d) {
                    var str = '<table>' +
                        '<thead>' +
                        '<tr><td class="legend-color-guide"><strong>' + d.data.x + '</strong> ' + d.data.y + '</td></tr>' +
                        '<tr><td class="legend-color-guide">Outlets: <strong>' + d.data.z + '</strong></td></tr>' +
                        '</thead>';

                    str = str + '</table>';
                    return str;
                }
            },
            callback: function (chart) { //remove 'Line' from the chart and legend
                d3.selectAll('.nv-y2 .nv-axis').style('display', 'none');
                d3.selectAll('g.nv-legend g.nv-series').style('display', function (d) {
                    return d.remove ? 'none' : 'true';
                });

            }

        }
    };

    $scope.barXSoptions = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 500,
            margin: {
                top: 30,
                right: 20,
                bottom: 70,
                left: 70
            },
            color: ['#19ce71'],
            showLegend: true,
            showValues: true,
            stacked: false,
            showControls: false,
            x: function (d, i) {
                return i
            },
            xAxis: {
                axisLabel: '',
                tickFormat: function (d) {
                    var dx = $scope.criteriaFilteredData[0].values[d] && $scope.criteriaFilteredData[0].values[d].x || 0;
                    return dx;
                },
                showMaxMin: false
            },
            x2Axis: {
                tickFormat: function (d) {
                    return null;
                },
                showMaxMin: false
            },
            y1Axis: {
                axisLabel: 'Sales (millions)',
                tickFormat: function (d) {
                    return d;
                },
                axisLabelDistance: 12
            },
            y3Axis: {
                tickFormat: function (d) {
                    return d;
                }
            },
            tooltip: {

                contentGenerator: function (d) {
                    var str = '<table>' +
                        '<thead>' +
                        '<tr><td class="legend-color-guide"><strong>' + d.data.x + '</strong> ' + d.data.y + '</td></tr>' +
                        '<tr><td class="legend-color-guide">Outlets: <strong>' + d.data.z + '</strong></td></tr>' +
                        '</thead>';

                    str = str + '</table>';
                    return str;
                }
            },
            callback: function (chart) { //remove 'Line' from the chart and legend
                d3.selectAll('.nv-y2 .nv-axis').style('display', 'none');
                d3.selectAll('g.nv-legend g.nv-series').style('display', function (d) {
                    return d.remove ? 'none' : 'true';
                });

            }

        }
    };
    $scope.oneMonthSummaryBaroptions = {
        chart: {
            type: 'multiBarChart',
            height: 250,
            margin: {
                top: 20,
                right: 20,
                bottom: 60,
                left: 35
            },
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.value + (1e-10);
            },
            showValues: true,
            duration: 500,
            showLegend: true,
            stacked: false,
            showControls: false,
            valueFormat: function (d) {
                return d3.format(',.2f')(d);
            },
            transitionDuration: 500,
            xAxis: {
                axisLabel: 'X Axis'
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: -10
            },
            legend: false,
            tooltip: {

                contentGenerator: function (d) {
                    var str = '<table>' +
                        '<thead>' +
                        '<tr><td class="legend-color-guide">' + d.data.label2 + ':' + '<strong>' + d.data.value + '</strong></td></tr>' +
                        '</thead>';

                    str = str + '</table>';
                    return str;
                }
            }
        }
    };
    $scope.foodcostoptions = {
        chart: {
            type: 'discreteBarChart',
            height: 250,
            margin: {
                top: 20,
                right: 20,
                bottom: 60,
                left: 35
            },
            x: function (d) {
                return d.FYName;
            },
            y: function (d) {
                return d.Cost;
            },
            showValues: true,
            valueFormat: function (d) {
                return d3.format(',.2f')(d);
            },
            transitionDuration: 500,
            xAxis: {
                axisLabel: ''
            },
            yAxis: {
                axisLabel: 'Perc',
                axisLabelDistance: 30
            },
            tooltip: {

                contentGenerator: function (d) {
                    var str = '<table>' +
                        '<thead>' +
                        '<tr><td class="legend-color-guide"><strong>' + d.data.FYName + '</strong></td></tr>' +
                        '<tr><td class="legend-color-guide">Perc: <strong>' + d.data.Perc + '</strong></td></tr>' +
                        '<tr><td class="legend-color-guide">Cost: <strong>' + d.data.Cost + '</strong></td></tr>' +
                        '<tr><td class="legend-color-guide">Sale: <strong>' + d.data.Sale + '</strong></td></tr>' +
                        '</thead>';

                    str = str + '</table>';
                    return str;
                }
            }
        }
    };
    $scope.foodcostMonthlyoptions = {
        chart: {
            type: 'discreteBarChart',
            height: 250,
            margin: {
                top: 20,
                right: 20,
                bottom: 60,
                left: 35
            },
            color: (['#e07a21', '#e07a21']),
            x: function (d) {
                return d.FYName;
            },
            y: function (d) {
                return d.Cost;
            },
            showValues: true,
            valueFormat: function (d) {
                return d3.format(',.2f')(d);
            },
            transitionDuration: 500,
            xAxis: {
                axisLabel: 'Months'
            },
            yAxis: {
                axisLabel: 'Perc',
                axisLabelDistance: 30
            },
            tooltip: {
                contentGenerator: function (d) {
                    var str = '<table>' +
                        '<thead>' +
                        '<tr><td class="legend-color-guide"><strong>' + d.data.FYName + '</strong></td></tr>' +
                        '<tr><td class="legend-color-guide">Perc: <strong>' + d.data.Perc + '</strong></td></tr>' +
                        '<tr><td class="legend-color-guide">Cost: <strong>' + d.data.Cost + '</strong></td></tr>' +
                        '<tr><td class="legend-color-guide">Sale: <strong>' + d.data.Sale + '</strong></td></tr>' +
                        '</thead>';

                    str = str + '</table>';
                    return str;
                }
            }
        }
    };
    $scope.foodcostXSMonthlyoptions = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 650,
            margin: {
                top: 20,
                right: 20,
                bottom: 70,
                left: 50
            },
            color: (['#e07a21', '#e07a21']),
            x: function (d) {
                return d.FYName;
            },
            y: function (d) {
                return d.Cost;
            },
            showValues: true,
            valueFormat: function (d) {
                return d3.format(',.2f')(d);
            },
            transitionDuration: 500,
            xAxis: {
                axisLabel: ''
            },
            yAxis: {
                axisLabel: 'Perc',
                axisLabelDistance: 0
            },
            tooltip: {
                contentGenerator: function (d) {
                    var str = '<table>' +
                        '<thead>' +
                        '<tr><td class="legend-color-guide"><strong>' + d.data.FYName + '</strong></td></tr>' +
                        '<tr><td class="legend-color-guide">Perc: <strong>' + d.data.Perc + '</strong></td></tr>' +
                        '<tr><td class="legend-color-guide">Cost: <strong>' + d.data.Cost + '</strong></td></tr>' +
                        '<tr><td class="legend-color-guide">Sale: <strong>' + d.data.Sale + '</strong></td></tr>' +
                        '</thead>';

                    str = str + '</table>';
                    return str;
                }
            }/*,
            callback : function (chart) {
                d3.selectAll('.nv-y .nv-axis').style('display', 'none')
            }*/
        }
    };
    var hrmsBarGrpahOptions = {
        chart: {
            type: 'discreteBarChart',
            height: 400,
            margin: {
                top: 20,
                right: 0,
                bottom: 60,
                left: 60
            },
            color: (['#e04941', '#35a4e0', '#2ae01c', '#bb13b1', '#f67a1b']),
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.value;
            },
            showValues: true,
            valueFormat: function (d) {
                return d3.format('.2d')(d);
            },
            xAxis: {
                axisLabel: ''
            },
            yAxis: {
                axisLabel: 'Count'
            },
            showLabels: true,
            duration: 500,
            legend: {
                margin: {
                    top: 5,
                    right: 100,
                    bottom: 5,
                    left: 0
                }
            },
            tooltip: {
                contentGenerator: function (d) {
                    var str = '<table>' +
                        '<thead>' +
                        '<tr><td class="legend-color-guide">' + d.data.label + '<strong> : ' + d.data.value + ' Employees' + '<strong></td></tr>' +
                        '</thead>';

                    str = str + '</table>';
                    return str;
                }
            }
        },
        title: {
            enable: true,
            className: 'h4',
            css: {
                width: null,
                textAlign: 'center'
            }
        }/*,
        subtitle: {
            enable: true,
            css: {
                width: null,
                textAlign: 'center'
            }
        }*/
    };
    var hrmsPieOptions = {
        chart: {
            type: 'pieChart',
            height: 400,
            donut: false,
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.value;
            },
            showLabels: true,
            labelType: 'percent',
            valueFormat: function (d) {
                return d3.format(',f%')(d);
            },
            tooltip: {
                contentGenerator: function (d) {
                    var str = '<table>' +
                        '<thead>' +
                        '<tr><td class="legend-color-guide">' + d.data.label + '<strong> : ' + d.data.value + ' Employees' + '</strong></td></tr>' +
                        '</thead>';

                    str = str + '</table>';
                    return str;
                }
            },
            duration: 500,
            legend: {
                margin: {
                    top: 5,
                    right: 150,
                    bottom: 5,
                    left: 0
                }
            }
        },
        title: {
            enable: true,
            className: 'h4',
            css: {
                width: null,
                textAlign: 'center'
            }
        }
    };   //For Nvd3 Design

    var mutliBarHorizontalOpions = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 50,
                left: 65
            },
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.value;
            },
            showValues: true,
            valueFormat: function (d) {
                return d3.format('.2d')(d);
            },
            stacked: false,
            showControls: false,
            duration: 500,
            xAxis: {
                axisLabel: 'X Axis'
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: -10
            },
            tooltip: {

                contentGenerator: function (d) {
                    var str = '<table>' +
                        '<thead>' +
                        '<tr><td class="legend-color-guide">' + d.data.label + '<strong> : ' + d.data.value + ' Employees' + '</strong></td></tr>' +
                        '</thead>';

                    str = str + '</table>';
                    return str;
                }
            }
        },
        title: {
            enable: true,
            className: 'h4',
            css: {
                width: null,
                textAlign: 'center'
            }
        }
    };

    $scope.leftJoindGraphOptions = {
        chart: {
            type: 'multiBarChart',
            height: 450,
            margin: {
                top: 50,
                right: 10,
                bottom: 50,
                left: 100
            },
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.value + (1e-10);
            },
            showValues: true,
            duration: 500,
            stacked: false,
            showControls: false,
            xAxis: {
                axisLabel: 'X Axis'
            },
            yAxis: {
                axisLabel: 'Count'
            },
            tooltip: {
                contentGenerator: function (d) {
                    var str = '<table>' +
                        '<thead>' +
                        '<tr><td class="legend-color-guide">' + d.data.key + '<strong> : ' + d.data.value + ' Employees' + '</strong></td></tr>' +
                        '</thead>';

                    str = str + '</table>';
                    return str;
                }
            }
        },
        title: {
            enable: true,
            className: 'h4',
            css: {
                width: null,
                textAlign: 'center'
            }
        }
    };
    $scope.sessionOptions = [
        {label: "Lunch", value: "L"},
        {label: "Dinner", value: "D"}
    ];


    $scope.selectedFilter.curDate = getDateNow(-1);
    var fromdt = new Date();
    $scope.selectedFilter.fromDate = fromdt.getFullYear() + "-" + (fromdt.getMonth() + 1) + "-01";
    $scope.selectedDSRFilter = {
        curDate: getDateNow(-1),
        dsrCriteria: "RR"
    };
    $scope.selectedFCFilter = {
        Type: "CM",
        RType: "OA"
    };
    $scope.selectedHrmsFilter = {
        curDate: getDateNow(-1),
        Type: 'RG',
        HRMSType: true,
        Day_MTD: true,
        StoreMasterTypes: true,
        EmployeeType: 'A'
    };
    var td = new Date();
    var yt = new Date(td);
    var dby = new Date(td);
    yt.setDate(td.getDate() - 1);
    dby.setDate(td.getDate() - 2);

    angular.element('#date, #date2, #dsrdate1, #dsrdate2').bootstrapMaterialDatePicker({
        time: false,
        format: "YYYY-MM-DD",
        clearButton: false,
        maxDate: yt
    });
    $scope.selectedHeaderFilter = {
        RType: 'Region'
    };
    $scope.criteriaFilter=[];
    angular.element('#dateBeforeYes, #dateBeforeYes2').bootstrapMaterialDatePicker({
        time: false,
        format: "YYYY-MM-DD",
        clearButton: false,
        maxDate: dby
    });


    var hierarchyData = new HttpService("Hierarchy");
    var postData = {
        "CurrentDate": getDateNow(),
        "UserId": $rootScope.globals.currentUser.Userinfo.UserId
    };
    hierarchyData.post("", postData).then(function (data) {
        $scope.hierarchyMaster = data;
        if (data.Region.length == 1) {
            $scope.itHasSingleRegion = true;
            if (data.Cluster.length == 1) {
                $scope.criteriaOptions = [
                    {name: CriteriaFilter.STORE, ticked: true},
                    {name: CriteriaFilter.BUILDING, ticked: false},
                    {name: CriteriaFilter.CITY, ticked: false},
                    {name: CriteriaFilter.CLUSTER, ticked: false},
                    {name: CriteriaFilter.REGION, ticked: true},
                    {name: CriteriaFilter.MODEL, ticked: false},
                    {name: CriteriaFilter.TIER, ticked: false},
                    {name: CriteriaFilter.TRADEAREA, ticked: false},
                    {name: CriteriaFilter.VINTAGE, ticked: false},
                    {name: CriteriaFilter.LIQUOR, ticked: false}
                ];
                $scope.criteriaFilter.push($scope.criteriaOptions[0]);
                $scope.selectedDSRFilter.value = "ST";
                $scope.selectedHeaderFilter.RType = "Store";
            } else {
                $scope.criteriaOptions = [
                    {name: CriteriaFilter.STORE, ticked: false},
                    {name: CriteriaFilter.BUILDING, ticked: false},
                    {name: CriteriaFilter.CITY, ticked: false},
                    {name: CriteriaFilter.CLUSTER, ticked: true},
                    {name: CriteriaFilter.REGION, ticked: true},
                    {name: CriteriaFilter.MODEL, ticked: false},
                    {name: CriteriaFilter.TIER, ticked: false},
                    {name: CriteriaFilter.TRADEAREA, ticked: false},
                    {name: CriteriaFilter.VINTAGE, ticked: false},
                    {name: CriteriaFilter.LIQUOR, ticked: false}
                ];
                $scope.criteriaFilter.push($scope.criteriaOptions[3]);
                $scope.selectedDSRFilter.value = "CL";
                $scope.selectedHeaderFilter.RType = "Cluster";
            }
        } else {
            $scope.itHasSingleRegion = false;
            $scope.criteriaOptions = [
                {name: CriteriaFilter.STORE, ticked: false},
                {name: CriteriaFilter.BUILDING, ticked: false},
                {name: CriteriaFilter.CITY, ticked: false},
                {name: CriteriaFilter.CLUSTER, ticked: false},
                {name: CriteriaFilter.MODEL, ticked: false},
                {name: CriteriaFilter.REGION, ticked: true},
                {name: CriteriaFilter.TIER, ticked: false},
                {name: CriteriaFilter.TRADEAREA, ticked: false},
                {name: CriteriaFilter.VINTAGE, ticked: false},
                {name: CriteriaFilter.LIQUOR, ticked: false}
            ];
            $scope.criteriaFilter.push($scope.criteriaOptions[5]);
            $scope.selectedDSRFilter.value = "RR";
            $scope.selectedHeaderFilter.RType = "Region";
        }
        $scope.onFilterChange();
    }, function (e) {
        console.info("Error fetching hierarchy data...", e);
    });

    getDaySale();

    function getDaySale() {
        var todayData = new HttpService("TodaySale");
        var postData = {
            "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
        };
        todayData.post("", postData).then(function (data) {
            $scope.todaySaleData = data;
        }, function (e) {
            console.info("Error fetching day sale...", e);
        });
    };

    /* if ($state.current.name == "dashboard") {
         getDSRSummary();
     }


     function getDSRSummary() {
         var dsrSummary = new HttpService("DailySaleReportSummary");
         var postData = {
             "CurrentDate": getDateNow(-1),
             "RType": "HH",
             "Outlets": getOutletArr(),
             "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
         };
         dsrSummary.post("", postData).then(function (data) {
             $scope.dsrSummaryData = data;
         }, function (e) {
             console.info("Error fetching day sale...", e);
         });
     }*/

    var setRegionDaySale;
    $scope.getRegionDaySale = function () {
        $scope.getRegionDaySaleData();
        setRegionDaySale = $uibModal.open({
            animation: true,
            templateUrl: 'shared/headerModal.html',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            scope: $scope
        });
    };

    $scope.closeHeaderModal = function () {
        setRegionDaySale.close();
    };

    $scope.getRegionDaySaleData = function () {
        $scope.todayRegionSaleData = undefined;
        var RType = undefined;
        if ($scope.selectedHeaderFilter.RType == "Region") {
            RType = 'R'
        } else if ($scope.selectedHeaderFilter.RType == "Cluster") {
            RType = 'C'
        } else {
            RType = 'S'
        }
        var todayData = new HttpService("TodayRegionSale");
        var postData = {
            "Outlets": getOutletArr(true),
            "Session": "",
            "RType": RType,
            "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
        };
        todayData.post("", postData).then(function (data) {
            $scope.todayRegionSaleData = data;
        }, function (e) {
            console.info("Error fetching day sale...", e);
        });
    };

    $scope.getRegionSummarySale=function(filterBy) {
        $scope.summaryRegionSaleData = undefined;
        var todayData = new HttpService("SummaryRegionSale");
        var postData = {
            "CurrentDate": $scope.selectedFilter.curDate,
            "Outlets": getOutletArr(true),
            "Range": "S",
            "Session": "",
            "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
        };
        if (filterBy == 'Sales')
            postData.Range = 'S';
        if (filterBy == 'Covers')
            postData.Range = 'C';
        if (filterBy == 'APC')
            postData.Range = 'A';

        todayData.post("", postData).then(function (data) {
            if (filterBy == 'Sales')
                $scope.summaryRegionSaleData = data.SaleList;
            if (filterBy == 'Covers')
                $scope.summaryRegionSaleData = data.CoverList;
            if (filterBy == 'APC')
                $scope.summaryRegionSaleData = data.APCList;
        }, function (e) {
            console.info("Error fetching day sale...", e);
        });
    };

    $scope.onFilterChange = function (filterControl) {
        switch (filterControl) {
            case 'Cluster':
                if ($scope.selectedFilter.Cluster) {
                    $scope.selectedFilter.City = "";
                }
                $scope.selectedFilter.Outlet = "";
                break;
            case 'City':
                if ($scope.selectedFilter.City) {
                    $scope.selectedFilter.Cluster = "";
                }
                $scope.selectedFilter.Outlet = "";
                break;
        }
        $scope.filteredOutlets = $filter('filter')($scope.hierarchyMaster.Outlet, {
            RegionName: ($scope.selectedFilter.Region ? $scope.selectedFilter.Region : ''),
            CityName: ($scope.selectedFilter.City ? $scope.selectedFilter.City : ''),
            ClusterName: $scope.selectedFilter.Cluster ? $scope.selectedFilter.Cluster : ''
        });
        if ($state.current.name == "dashboard") {
            filterSalesSummary();
            filterActualvsTarget();
            //$scope.filterCommonPie();
            $scope.filterSalesByCriteria();
        } else if ($state.current.name == "dsrReports") {
            $scope.filterDSRReports();
        } else if ($state.current.name == "foodCost") {
            $scope.getFoodSummary(filterControl);
        } else if ($state.current.name == "hrms") {
            $scope.getHrmsReport();
        }
    };

    $scope.filteredText = function (type) {

        if (!$scope.selectedFilter[type]) {
            return "All " + type;
        } else {
            if (type == "Session") {
                return $filter('filter')($scope.sessionOptions, {value: $scope.selectedFilter.Session})[0].label;
            } else if (type == "Outlet") {
                return $filter('filter')($scope.hierarchyMaster.Outlet, {OutletCode: $scope.selectedFilter.Outlet})[0].OutletName;
            }
            return $scope.selectedFilter[type] + " " + type;
        }

    };


    $scope.itsCriteriaGridView = false;

    $scope.setCriteriaGridView = function () {
        if ($scope.itsCriteriaGridView) {
            $scope.itsCriteriaGridView = false;
        } else {
            $scope.itsCriteriaGridView = true;
        }
    };


    $scope.selection = {
        type: "DAY",
        type2: "DATE",
        type3: "DAY"
    };


    $scope.monthMasterArr = [
        {text: "Jan", value: 01, ticked: false},
        {text: "Feb", value: 02, ticked: false},
        {text: "Mar", value: 03, ticked: false},
        {text: "Apr", value: 04, ticked: false},
        {text: "May", value: 05, ticked: false},
        {text: "Jun", value: 06, ticked: false},
        {text: "Jul", value: 07, ticked: false},
        {text: "Aug", value: 08, ticked: false},
        {text: "Sep", value: 09, ticked: false},
        {text: "Oct", value: 10, ticked: false},
        {text: "Nov", value: 11, ticked: false},
        {text: "Dec", value: 12, ticked: false}
    ];

    var tempMonths = [].concat($scope.monthMasterArr);
    $scope.yearArr = [];

    for (var d = 0; d < 5; d++) {
        var yrArrObj = {};
        var dt = new Date();
        var currYr = dt.getFullYear();
        var yr = dt.getFullYear() - d;
        yrArrObj.text = yr;
        if (yr == currYr) {
            yrArrObj.ticked = true;
        } else {
            yrArrObj.ticked = false;
        }
        $scope.yearArr.push(yrArrObj)
    }

    $scope.selectedMonthObj = [];
    $scope.selectedYearObj = [];
    $scope.selectedYearObj.push($scope.yearArr[0]);
    $scope.GsiReportHeading = "MTD Comparison";
    onYearChange($scope.selectedYearObj[0].text);

    function onYearChange(year) {
        var dd = new Date();
        var yy = dd.getFullYear();
        var mm = dd.getMonth();
        var newMonthArr = [];
        if (yy == year) {
            var tempMonthArr = $scope.monthMasterArr;
            for (var i = 0; i <= mm; i++) {
                if (tempMonthArr[i].value - 1 == mm) {
                    tempMonthArr[i].ticked = true;
                    $scope.selectedMonthObj.push(tempMonthArr[i]);
                }
                newMonthArr.push(tempMonthArr[i]);
            }
            $scope.monthArr = newMonthArr;
        } else {
            for (var i = 0; i < $scope.monthMasterArr.length; i++) {
                $scope.monthMasterArr[i].ticked = false;
            }
            $scope.monthMasterArr[mm].ticked = true;
            $scope.monthArr = $scope.monthMasterArr;
            $scope.selectedMonthObj.push($scope.monthArr[mm]);
        }
    }


    function ifLastDate(selectedDate) {
        $scope.ifItsLastDate = false;
        var dateArr = selectedDate.split("-");
        var dateStr = dateArr[0] + "-" + dateArr[1] + "-" + dateArr[1];
        var date = new Date(dateStr);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        var mm = (lastDay.getMonth() + 1) < 10 ? '0' + (lastDay.getMonth() + 1) : (lastDay.getMonth() + 1);
        var lastDayWithSlashes = lastDay.getFullYear() + '-' + mm + '-' + (lastDay.getDate());
        if (selectedDate == lastDayWithSlashes) {
            $scope.ifItsLastDate = true;
            $scope.selection.type = "DATE";
        }
    };

    $scope.filterDSRReports = function () {
        ifLastDate($scope.selectedDSRFilter.curDate);
        $scope.dsrData = null;
        var reportsData = new HttpService("DailySaleReport");
        var postData = {
            "CurrentDate": $scope.selectedDSRFilter.curDate,
            "Outlets": getOutletArr(),
            "RType": $scope.selectedDSRFilter.dsrCriteria,
            "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId),
            "SelectionType": $scope.selection.type
        };
        reportsData.post("", postData).then(function (data) {
            $scope.dsrData = data;

        }, function (e) {
            console.info("Error fetching filtered data...", e);
        });
    };

    function filterSalesSummary() {

        var paramType = 'CM';
        if ($scope.selectedFilter.Region != "" && $scope.selectedFilter.Outlet == "") {
            paramType = 'RG';
            if ($scope.selectedFilter.Cluster != "" || $scope.selectedFilter.City != "") {
                paramType = 'CL';
                if ($scope.selectedFilter.Outlet != "" || $scope.selectedFilter.Session != "") {
                    paramType = 'ST';
                }
            }
        } else if ($scope.selectedFilter.Outlet != "") {
            paramType = 'ST';
        } else {
            paramType = 'CM';
        }

        var summaryData = new HttpService("SummaryReport");
        var dailySaleSummaryData = new HttpService("DailySaleReportSummary");
        var filterSession = "";
        if ($scope.selectedFilter.Session == 'L') {
            filterSession = 1;
        } else if ($scope.selectedFilter.Session == 'D') {
            filterSession = 2;
        }

        var postData = {
            "CurrentDate": $scope.selectedFilter.curDate,
            "Outlets": getOutletArr(),
            "Session": filterSession,
            "ParamType": paramType,
            "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
        };
        var dsrPostData = {
            "CurrentDate": getDateNow(-1),
            "RType": "HH",
            "Outlets": getOutletArr(),
            "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
        };
        dailySaleSummaryData.post("", dsrPostData).then(function (data) {
            $scope.dsrSummaryData = data;
        }, function (e) {
            console.info("Error fetching day sale...", e);
        });

        summaryData.post("", postData).then(function (data) {
            $scope.summaryDataObj = data;
        }, function (e) {
            console.info("Error fetching filtered data...", e);
        });

    };

    function filterActualvsTarget() {
        var monthlySummary = new HttpService("MonthlySummary");
        var postData = {
            "CurrentDate": $scope.selectedFilter.curDate,
            "Outlets": getOutletArr(),
            "Session": $scope.selectedFilter.Session,
            "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
        };
        monthlySummary.post("", postData).then(function (data) {
            $scope.monthlySummaryData = [];
            let targetSale = {
                key: "Target Sales",
                values: []
            };
            let actualSale = {
                key: "Actual Sales",
                values: []
            };
            for (let i = 0; i < data.MonthList.length; i++) {

                targetSale.key = "Target Sales";
                targetSale.color = '#5bd7aa';
                targetSale.values.push({
                    label: data.MonthList[i].MTD_Name,
                    value: data.MonthList[i].MTD_Target
                });

            }
            $scope.monthlySummaryData.push(targetSale);

            for (let j = 0; j < data.MonthList.length; j++) {

                actualSale.key = "Actual Sales";
                actualSale.color = '#e39b16';
                actualSale.values.push({
                    label: data.MonthList[j].MTD_Name,
                    value: data.MonthList[j].MTD_Sale
                });

            }
            $scope.monthlySummaryData.push(actualSale);
            $scope.monthlySummaryXsOptions = angular.copy(mutliBarHorizontalOpions);
            $scope.monthlySummaryOptions.chart.stacked = false;
            $scope.monthlySummaryXsOptions.chart.stacked = false;
            $scope.monthlySummaryXsOptions.title.enable = false;
            $scope.monthlySummaryXsOptions.chart.margin.left = 60;
            $scope.monthlySummaryXsOptions.chart.yAxis.axisLabelDistance = -10;
            $scope.monthlySummaryXsOptions.chart.xAxis.axisLabelDistance = -10;
            $scope.monthlySummaryOptions.chart.showControls = false;
            $scope.monthlySummaryXsOptions.chart.showControls = false;
            $scope.monthlySummaryOptions.chart.xAxis.axisLabel = "Months";
            $scope.monthlySummaryOptions.chart.reduceXTick = true;
            $scope.monthlySummaryXsOptions.chart.xAxis.axisLabel = "Months";
            $scope.monthlySummaryXsOptions.chart.yAxis.axisLabel = "Values";
            $scope.monthlySummaryXsOptions.chart.reduceXTicks = true;

        }, function (e) {
            console.info("Error fetching filtered data...", e);
        });
    };


    $scope.filterSalesByCriteria = function () {
        $scope.selectedCriteria = $scope.criteriaFilter[0].name;
        $scope.criteriaSalesData = undefined;
        $scope.criteriaFilteredData = undefined;
        var salesCriteria = new HttpService("SaleDashboard");
        var postData = {
            "CurrentDate": $scope.selectedFilter.curDate,
            "Outlets": getOutletArr(),
            "RType": $scope.criteriaFilter[0].name,
            "Session": $scope.selectedFilter.Session,
            "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
        };
        salesCriteria.post("", postData).then(function (data) {
            $scope.criteriaSalesData = data.SaleList;
            $scope.filterSubCriteria();
        }, function (e) {
            console.info("Error fetching filtered data...", e);
        });
    };
    $scope.filterSubCriteria = function () {
        if ($scope.criteriaFilter[0].name == 'CITY' || $scope.criteriaFilter[0].name == 'CLUSTER') {
            $scope.barXSoptions.chart.height = 2500;
            $scope.barXSoptions.chart.margin.left = 100;
        } else if ($scope.criteriaFilter[0].name == 'STORE') {
            $scope.barXSoptions.chart.height = 4500;
            $scope.barXSoptions.chart.margin.left = 180;
        } else {
            $scope.barXSoptions.chart.height = 500;
            $scope.barXSoptions.chart.margin.left = 100;
        }
        $scope.baroptions.chart.xAxis.axisLabel = $scope.criteriaFilter[0].name;
        //bar chart
        var firstBarData = {
            key: $scope.criteriaFilter[0].name,
            "bar": true,
            values: []
        };
        var lineData = {
            "key": "Line",
            "values": [],
            "remove": true
        };
        var criteriaFilteredData = [];
        criteriaFilteredData = $scope.criteriaSalesData;
        for (var i = 0; i < criteriaFilteredData.length; i++) {
            if (criteriaFilteredData[i].RType != 'Total') {
                firstBarData.values[i] = {};
                firstBarData.values[i].label = criteriaFilteredData[i].RType;
                firstBarData.values[i].value = criteriaFilteredData[i][$scope.subCriteriaFilter];
                firstBarData.values[i].outlets = criteriaFilteredData[i].NoOfStores;
            }
        }

        $scope.criteriaFilteredData = [firstBarData, lineData].map(function (series) {
            series.values = series.values.map(function (d) {
                return {x: d.label, y: d.value, z: d.outlets}
            });
            return series;
        });

    };

    $scope.foodCostData = "";
    $scope.getFoodSummary = function (filterOption) {
        switch (filterOption) {
            case 'Year':
                $scope.selectedMonthObj = [];
                onYearChange($scope.selectedYearObj[0].text);
                break;
        }
        if ($scope.selectedFCFilter.Type == "CM") {
            $scope.selectedCriteria = "Company"
        } else if ($scope.selectedFCFilter.Type == "RG") {
            $scope.selectedCriteria = "Region"
        } else if ($scope.selectedFCFilter.Type == "CT") {
            $scope.selectedCriteria = "City"
        } else if ($scope.selectedFCFilter.Type == "ST") {
            $scope.selectedCriteria = "Store"
        }
        $scope.foodCostData = "";
        $scope.selectedYear = $scope.selectedYearObj[0].text;
        $scope.selectedMonth = $scope.selectedMonthObj[0].text;

        var foodCostSummary = new HttpService("FoodCost");
        $scope.gsiReportTypeFilter = 'YTD';
        var postData = {
            "Year": $scope.selectedYearObj[0].text,
            "Month": $scope.selectedMonthObj[0].value,
            "Type": $scope.selectedFCFilter.Type,
            "RType": $scope.selectedFCFilter.RType,
            "Outlets": getOutletArr(),
            "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
        };
        foodCostSummary.post("", postData).then(function (data) {
            $scope.foodCostData = data;
            /*      var mdataObj = {
                      key: "MTD",
                      values: data.MTD.map(function (d) {
                          return {
                              FYName: $scope.selectedMonthObj[0].text + " " + d.FYName,
                              Perc: d.Perc,
                              Cost: d.FoodCostAPC,
                              Sale: d.FoodSaleAPC
                          }
                      })
                  };
                  $scope.filteredFoodCostMTD = [mdataObj];*/


            /*  var ydataObj = {
                  key: "YTD",
                  values: data.YTD.map(function (d) {
                      return {
                          FYName: "FY " + d.FYName,
                          Perc: d.Perc,
                          Cost: d.FoodCostAPC,
                          Sale: d.FoodSaleAPC
                      }
                  })
              };
              $scope.filteredFoodCostYTD = [ydataObj];*/

            /*    var mndataObj = {
                    key: "Months of " + $scope.selectedYear,
                    values: data.Monthly.map(function (d) {
                        return {
                            FYName: d.MonthName,
                            Perc: d.Perc,
                            Cost: d.FoodCostAPC,
                            Sale: d.FoodSaleAPC
                        }
                    })
                };
                $scope.filteredFoodCostMonthly = [mndataObj];*/


        }, function (e) {
            console.info("Error fetching food sale...", e);
        });
        $scope.foodcostXSMonthlyoptions.chart.stacked = false;
        $scope.foodcostXSMonthlyoptions.chart.showControls = false;
        $scope.foodcostMonthlyoptions.chart.xAxis.axisLabel = "Months of " + $scope.selectedYear;
    };
    $scope.selectedHRMSType = "Count";

    $scope.hrmsGraph = {
        Pie: "MF",
        Bar: "AA"
    };

    $scope.setHrmsPieView = function (value) {
        $scope.hrmsGraph.Pie = value;
    };
    $scope.setHrmsBarView = function (value) {
        $scope.hrmsGraph.Bar = value;
    };

    $scope.getHrmsReport = function () {
        $scope.pieDataObj = {
            Male: undefined,
            FeMale: undefined,
            FOH: undefined,
            BOH: undefined
        };
        var hrmsType = "";
        var dayMtd = "";
        var storeMasterType = "";
        if ($scope.selectedHrmsFilter.HRMSType == true) {
            $scope.selectedHRMSType = "Count";
            $scope.hrmsTypeToolTip = "Salary";
            hrmsType = "C";
        } else {
            $scope.selectedHRMSType = "Salary";
            $scope.hrmsTypeToolTip = "Count";
            hrmsType = "S";
        }
        if ($scope.selectedHrmsFilter.Day_MTD == true) {
            dayMtd = "D";
            $scope.dayMtdToolTip = "Month";
        } else {
            dayMtd = "M";
            $scope.dayMtdToolTip = "Day";
        }
        if ($scope.selectedHrmsFilter.StoreMasterTypes == true) {
            storeMasterType = "A";
            $scope.storetypeToolTip = "Store";
        } else {
            storeMasterType = "S";
            $scope.storetypeToolTip = "All";
        }
        $scope.hrmsData = null;
        var hrmsSummary = new HttpService("HRMS");
        var postData = {
            "CurrentDate": $scope.selectedHrmsFilter.curDate,
            "Outlets": getOutletArr(),
            "Type": $scope.selectedHrmsFilter.Type,
            "HRMS_Type": hrmsType,
            "Day_MTD": dayMtd,
            "StoreMasterTypes": storeMasterType,
            "EmployeeType": $scope.selectedHrmsFilter.EmployeeType,
            "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
        };
        hrmsSummary.post("", postData).then(function (data) {
            $scope.hrmsData = data;
            drawHrmsPieChart(data.HRMS_2, data.HRMS_3);
            drawHrmsBarChart(data.HRMS_4, data.HRMS_5, data.HRMS_6)
        }, function (e) {
            console.info("Error fetching filtered data...", e);
        });
    };

    function drawHrmsPieChart(maleFemaleArr, fohBohArr) {
        /*  $scope.pieDataObj.Male= maleFemaleArr[0].Male;
          $scope.pieDataObj.Female= maleFemaleArr[0].Female;
          $scope.pieDataObj.FOH= fohBohArr[0].FOH;
          $scope.pieDataObj.BOH= fohBohArr[0].BOH;*/
        $scope.maleFemalePieData = [];
        $scope.fbPieData = [];
        var mData = {};
        var fData = {};
        var fohData = {};
        var bohdata = {};
        for (var j = 0; j < maleFemaleArr.length; j++) {
            mData.label = "Male";
            mData.value = maleFemaleArr[j].Male;
            mData.color = '#ff7f0e';
            $scope.maleFemalePieData.push(mData);
        }
        for (var i = 0; i < fohBohArr.length; i++) {
            fohData.label = "Front Office";
            fohData.value = fohBohArr[i].FOH;
            fohData.color = '#0dcb22';
            $scope.fbPieData.push(fohData);
        }
        for (var k = 0; k < maleFemaleArr.length; k++) {
            fData.label = "Female";
            fData.color = '#1f77b4';
            fData.value = maleFemaleArr[k].Female;
            $scope.maleFemalePieData.push(fData);
        }
        for (var m = 0; m < fohBohArr.length; m++) {
            bohdata.label = "Back Office";
            bohdata.color = '#ee34b3';
            bohdata.value = fohBohArr[m].BOH;
            $scope.fbPieData.push(bohdata);
        }

        $scope.malefemalePieOptions = angular.copy(hrmsPieOptions);
        $scope.fbPieOption = angular.copy(hrmsPieOptions);
        $scope.malefemalePieOptions.title.text = "Male-Female Ratio";
        $scope.malefemalePieOptions.chart.donut = false;
        $scope.fbPieOption.title.text = "Front-Back Office Ratio";
        $scope.fbPieOption.chart.donut = false;
        $scope.fbPieOption.chart.legend.margin.right = 120;
        $scope.fbPieOption.chart.legend.margin.left = 0;  //Nvd3 Design Implementation
    }

    $scope.itsLeftJoindGridView = false;
    $scope.setLeftJoinedGridView = function () {
        if ($scope.itsLeftJoindGridView) {
            $scope.itsLeftJoindGridView = false;
        } else {
            $scope.itsLeftJoindGridView = true;
        }
    };

    function drawHrmsBarChart(avgAgeArr, yearOfServiceArr, leftJoinedArr) {
        $scope.avgAgeGraphData = [];
        var avgAgeObj = {
            key: "Avg Age Group",
            values: avgAgeArr.map(function (d) {
                return {
                    label: d.AgeGroup,
                    value: d.Count
                }
            })
        };
        $scope.avgAgeGraphData = [avgAgeObj];
        $scope.yearOfSerGraphData = [];
        var yearofServedObj = {
            key: "Served Years",
            values: yearOfServiceArr.map(function (d) {
                return {
                    label: d.YearServed,
                    value: d.Count
                }
            })
        };


        $scope.yearOfSerGraphData = [yearofServedObj];
        $scope.aveAgeGraphOptions = angular.copy(hrmsBarGrpahOptions);
        $scope.aveAgeXsGraphOptions = angular.copy(mutliBarHorizontalOpions);
        $scope.aveAgeXsGraphOptions.chart.showLegend = false;
        $scope.aveAgeGraphOptions.title.text = "Average Age Group";
        $scope.aveAgeXsGraphOptions.title.text = "Average Age Group";
        $scope.aveAgeXsGraphOptions.chart.barColor = ['#e04941', '#35a4e0', '#2ae01c', '#bb13b1', '#f67a1b'];
        $scope.aveAgeGraphOptions.chart.xAxis.axisLabel = "Age Group";
        $scope.aveAgeXsGraphOptions.chart.xAxis.axisLabel = "Age Group";
        $scope.aveAgeXsGraphOptions.chart.yAxis.axisLabel = "Count";
        $scope.yearOfSerGraphOptions = angular.copy(hrmsBarGrpahOptions);
        $scope.yearOfSerXsGraphOptions = angular.copy(mutliBarHorizontalOpions);
        $scope.yearOfSerXsGraphOptions.chart.showLegend = false;
        $scope.yearOfSerGraphOptions.title.text = "Year Of Service";
        $scope.yearOfSerXsGraphOptions.title.text = "Year Of Service";
        $scope.yearOfSerXsGraphOptions.chart.barColor = ['#e04941', '#35a4e0', '#2ae01c', '#bb13b1', '#f67a1b'];
        $scope.yearOfSerGraphOptions.chart.xAxis.axisLabel = "Years";
        $scope.yearOfSerXsGraphOptions.chart.xAxis.axisLabel = "Years";
        $scope.yearOfSerXsGraphOptions.chart.yAxis.axisLabel = "Count";
        $scope.leftJoinedGraphData = [];
        var joinedCount = {
            key: "",
            values: []
        };
        var leftCount = {
            key: "",
            values: []
        };
        for (var i = 0; i < leftJoinedArr.length; i++) {
            if (leftJoinedArr[i].Months != 'Total') {
                joinedCount.key = "Joined Counts",
                    joinedCount.color = '#2dd320';
                joinedCount.values.push({
                    label: leftJoinedArr[i].Months,
                    value: leftJoinedArr[i].JoinedCount
                });
            }
        }
        $scope.leftJoinedGraphData.push(joinedCount);

        for (var j = 0; j < leftJoinedArr.length; j++) {
            if (leftJoinedArr[j].Months != 'Total') {
                leftCount.key = "Left Counts";
                leftCount.color = '#fe3133';
                leftCount.values.push({
                    label: leftJoinedArr[j].Months,
                    value: leftJoinedArr[j].LeftCount
                });
            }
        }
        $scope.leftJoinedGraphData.push(leftCount);
        $scope.leftJoindXsGraphOptions = angular.copy(mutliBarHorizontalOpions);
        $scope.leftJoindGraphOptions.chart.stacked = true;
        $scope.leftJoindXsGraphOptions.chart.stacked = true;
        $scope.leftJoindGraphOptions.chart.showControls = true;
        $scope.leftJoindXsGraphOptions.chart.showControls = true;
        $scope.leftJoindGraphOptions.chart.xAxis.axisLabel = "Months";
        $scope.leftJoindXsGraphOptions.chart.xAxis.axisLabel = "Months";
        $scope.leftJoindXsGraphOptions.chart.yAxis.axisLabel = "Count";
        $scope.leftJoindGraphOptions.chart.reduceXTicks = false;
        $scope.leftJoindGraphOptions.title.text = "Left & Joined Employee Count";
        $scope.leftJoindXsGraphOptions.title.text = "Left & Joined Employee Count";
    }

    function getLineChart(arr1, arr2) {
        //Line chart data should be sent as an array of series objects.
        return [{
            values: arr1, //values - represents the array of {x,y} data points
            key: 'Actual Sales', //key  - the name of the series.
            color: '#d78157', //color - optional: choose your own line color.
            area: true
        }, {
            values: arr2,
            key: 'Target Sales',
            color: '#edd57a',
            area: true //area - set to true if you want this line to turn into a filled area chart.
        }];
    }

    $scope.formatDate = function (strDate, formatStr) {
        var dt = new Date();
        if (strDate.indexOf("-") >= 0) {
            dt = new Date(strDate.split("-")[0] + "/" + strDate.split("-")[1] + "/" + strDate.split("-")[2])
        } else {
            dt = new Date(strDate)
        }
        return $filter('date')(dt, formatStr);
    };
    $scope.filterPercent = function (num, total) {
        return $filter('number')(((num / total) * 100), 2) + "%";
    };

    function getOutletArr(allOutlets) {
        var arr = [];
        var filteredArr = [];


        if ($scope.selectedFilter.Outlet) {
            return $scope.selectedFilter.Outlet;
        }
        filteredArr = $scope.selectedFilter.Region ? $scope.filteredOutlets : [];


        for (var i = 0; i < filteredArr.length; i++) {
            arr.push(filteredArr[i].OutletCode);
        }
        return arr.toString();
    }

    function getDateNow(dayOffset) {
        var dateMod = (24 * 60 * 60 * 1000) * (dayOffset ? dayOffset : 0); //5 days
        var myDate = new Date();
        myDate.setTime(myDate.getTime() + dateMod);
        return myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
    }

    $scope.getCurDate = function (dayOffset) {
        return getDateNow(dayOffset)
    };

});


ableApp.controller('flagController', function ($scope) {
    //$controller('globalController', { $scope: $scope, $timeout: $timeout, $state: $state });
    angular.element('.f-item').click(function () {
        $scope.font_class = $(this).children().attr('class');
        $scope.country_name = $(this).parent().children('.content-flag').children(0).html();
        angular.element('#myModal').modal('show');
        angular.element('#icon').removeClass();
        angular.element('#icon').addClass($scope.font_class);
        angular.element('#icon').addClass('fa-lg');
        angular.element('#name').val($scope.country_name);
        angular.element('#code').val('<i class="' + $scope.font_class + '"></i>');
    });
});


ableApp.controller('fontAwesomeController', function ($scope) {
    //$controller('globalController', { $scope: $scope, $timeout: $timeout, $state: $state });
    angular.element('.icon-list-demo div').click(function () {
        $scope.font_class = ($(this).children('.fa').attr('class'));
        angular.element('#myModal').modal('show');
        angular.element('#icon').removeClass();
        angular.element('#icon').addClass($scope.font_class);
        angular.element('#icon').addClass('fa-lg');
        angular.element('#name').val($scope.font_class);
        angular.element('#code').val('<i class="' + $scope.font_class + '"></i>');
    });
});

ableApp.controller('fooTableController', function ($scope) {
    //$controller('globalController', { $scope: $scope, $timeout: $timeout, $state: $state });
    $scope.clearFilter = function () {
        $('.filter-status').val('');
        $('.footable').trigger('footable_clear_filter');
    };

    $scope.filteringEventHandler = function (e) {
        var selected = $('.filter-status').find(':selected').text();
        if (selected && selected.length > 0) {
            e.filter += (e.filter && e.filter.length > 0) ? ' ' + selected : selected;
            e.clear = !e.filter;
        }
    };

    $scope.filterByStatus = function () {
        $('.footable').trigger('footable_filter', {
            filter: $('#filter').val()
        });
    };

    $scope.filter = {
        status: null
    };
});

ableApp.controller('footerController', function ($scope, $window) {
    //$controller('globalController', { $scope: $scope, $timeout: $timeout, $state: $state });
    var appWindow = angular.element($window);

    appWindow.bind('resize', function () {
        $scope.setSize();
    });
    appWindow.bind('load', function () {
        $scope.setSize();
    });


    $scope.setSize = function () {
        if (appWindow.height() > $('body').height()) {
            $('.footer-bg').css('position', 'fixed');
        } else {
            $('.footer-bg').css('position', 'absolute');
        }

    };
});


ableApp.controller('otherController', function ($scope) {
    //$controller('globalController', { $scope: $scope, $timeout: $timeout, $state: $state });
    //other pagination
    $scope.currentPage = 0;
    $scope.startPage = 0;
});


ableApp.controller('tooltipsController', function ($scope, $sce) {
    //$controller('globalController', { $scope: $scope, $timeout: $timeout, $state: $state });
    //html tooltips
    $scope.htmlTooltip = $sce.trustAsHtml('<em>Tooltip</em> <u>with</u> <b>HTML</b>');

    //html popover tooltip
    $scope.htmlPopover = $sce.trustAsHtml('<em>Tooltip</em> <u>with</u> <b>HTML</b>');
});

ableApp.controller('typIconsController', function ($scope) {
    //$controller('globalController', { $scope: $scope, $timeout: $timeout, $state: $state });
    angular.element('.icon-list-demo div').click(function () {
        $scope.font_class = ($(this).children('.typcn').attr('class'));
        angular.element('#myModal').modal('show');
        angular.element('#icon').removeClass();
        angular.element('#icon').addClass($scope.font_class);
        angular.element('#icon').addClass('fa-lg');
        angular.element('#name').val($scope.font_class);
        angular.element('#code').val('<i class="' + $scope.font_class + '"></i>');
    });
});

ableApp.controller('wallController', function ($scope) {
    //$controller('globalController', { $scope: $scope, $timeout: $timeout, $state: $state });
    angular.element('#post-new').hide();
    angular.element('#post-message').keyup(function () {
        if (($(this).val() != "")) {
            angular.element('#post-new').show();
        } else
            angular.element('#post-new').hide();
    });
});


ableApp.controller('weatherIconController', function ($scope) {
    //$controller('globalController', { $scope: $scope, $timeout: $timeout, $state: $state });
    angular.element('.icon-list-demo div').on('click', function () {
        $scope.font_class = ($(this).children('.wi').attr('class'));
        if (!$(this).hasClass('svg-icon')) {
            angular.element('#myModal').modal('show');
            angular.element('#icon').removeClass();
            angular.element('#icon').addClass($scope.font_class);
            angular.element('#icon').addClass('fa-lg');
            angular.element('#name').val($scope.font_class);
            angular.element('#code').val('<i class="' + $scope.font_class + '"></i>');
        }
    });
});


ableApp.controller('LoginController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
        function ($scope, $rootScope, $location, AuthenticationService) {

            $scope.userLoginInfo = {
                //userName: "admin",
                //userPassword: "Sayaji*Barbeque"
                userName: "",
                userPassword: ""
            };
            $scope.loginForm = {};
            $scope.loginErrorMsg = "";

            $scope.rememberMe = false;

            $scope.loginProcessing = false;

            // reset login status
            AuthenticationService.clearSession();

            $scope.login = function () {
                $scope.loginErrorMsg = "";
                AuthenticationService.login($scope.userLoginInfo.userName, $scope.userLoginInfo.userPassword).then(function (response) {
                    $scope.loginProcessing = true;
                    if (response.Validate === "TRUE") {
                        $location.path('/dashboard');
                        AuthenticationService.setSession($scope.userLoginInfo.userName, $scope.userLoginInfo.userPassword, response, $scope.rememberMe);

                    } else {
                        $scope.loginProcessing = false;
                        $scope.loginErrorMsg = response.Message
                    }

                }, function (error) {
                    $scope.loginProcessing = false;

                });

            };

        }]);

ableApp.controller('ChangePassController',
    ['$scope', '$location', 'HttpService', '$rootScope', 'AuthenticationService',
        function ($scope, $location, HttpService, $rootScope, AuthenticationService) {
            $scope.changePass = {
                form: {},
                info: {}
            };
            $scope.changePassSuccessMessage = "";
            $scope.changePassErrorMsg = "";
            $scope.changePassword = function () {
                $scope.changePassProcessing = true;
                var changePassData = new HttpService("ChangePassword");
                var postData = {
                        "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId),
                        "NewPassword": $scope.changePass.info.newPassword,
                        "OldPassword": $scope.changePass.info.oldPassword
                    }
                ;
                changePassData.post("", postData).then(function (response) {
                    if (response.Validate === "TRUE") {
                        $scope.changePassErrorMsg = false;
                        $scope.changePassSuccessMessage = true;
                        $scope.changePassSuccessMessage = response.Message;
                        $location.path('/login');
                        //AuthenticationService.clearSession();

                    } else {
                        $scope.changePassProcessing = false;
                        $scope.changePassErrorMsg = response.Message
                    }
                }, function (e) {
                    $scope.changePassProcessing = false;
                });
            };

        }]);