var ableApp = angular.module('able', ['ngCookies', 'base64', 'ui.router', 'oc.lazyLoad', 'ui.bootstrap', 'ui.slimscroll', 'angularRipple', 'ngMessages']); //'ui.bootstrap', 'ui.slimscroll', 'angularRipple'
ableApp.config(function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider,$locationProvider) { //$locationProvider

    $stateProvider
    //dashboard layouts
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard.html?v=346545734",
            controller: 'dashboardController',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'lazy_form_elements_advance',
                        'lazy_counter',
                        'lazy_c3_chart',
                        'lazy_nvd3_chart'

                    ], {serie: true});
                }]
            }
        })
      /*  .state('reports', {
            url: "/reports",
            templateUrl: "views/reports.html?v=5489754",
            controller: 'dashboardController',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'lazy_form_elements_advance',
                        'lazy_nvd3_chart'

                    ], {serie: true});
                }]
            }
        })*/
        .state('dsrReports', {
            url: "/dsr",
            templateUrl: "views/dsr.html?v=687651354",
            controller: 'dashboardController',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'lazy_form_elements_advance',
                        'lazy_nvd3_chart'

                    ], {serie: true});
                }]
            }
        })
        /*.state('pullers', {
            url: "/pullers",
            templateUrl: "views/pullers_draggers.html?v=354615",
            controller: 'dashboardController',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'lazy_form_elements_advance',
                        'lazy_nvd3_chart'

                    ], {serie: true});
                }]
            }
        })
        .state('pnl', {
            url: "/pnl",
            templateUrl: "views/pnl.html?v=1245885",
            controller: 'dashboardController',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'lazy_form_elements_advance',
                        'lazy_nvd3_chart'

                    ], {serie: true});
                }]
            }
        })*/
        .state('foodCost', {
            url: "/foodCost",
            templateUrl: "views/food_cost.html?v=378634544",
            controller: 'dashboardController',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'lazy_form_elements_advance',
                        'lazy_nvd3_chart'

                    ], {serie: true});
                }]
            }
        })
        .state('hrms', {
            url: "/hrms",
            templateUrl: "views/hrms.html?v=234645634",
            controller: 'dashboardController',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'lazy_form_elements_advance',
                        'lazy_nvd3_chart'

                    ], {serie: true});
                }]
            }
        })
       /* .state('gsiReports', {
            url: "/gsi",
            templateUrl: "views/gsi.html?v=54658451",
            controller: 'dashboardController',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'lazy_form_elements_advance',
                        'lazy_nvd3_chart'

                    ], {serie: true});
                }]
            }
        })*/
        //pages
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html?v=6",
            controller: 'LoginController'
        })
        .state('changePassword', {
            url: "/changePassword",
            templateUrl: "views/change_password.html?v=6.1.1",
            controller: 'ChangePassController'
        })
        .state('register', {
            url: "/register",
            templateUrl: "views/register.html",
            controller: 'commonController'
        });
    $urlRouterProvider.otherwise('/dashboard');
   /* $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });*/
});

/*Directive for owl carousel*/
ableApp.directive('wrapOwlcarousel', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var options = scope.$eval($(element).attr('data-options'));
            $(element).owlCarousel(options);
        }
    };
});

ableApp.directive('countdown', [
    'Util',
    '$interval',
    function (Util, $interval) {
        return {
            restrict: 'A',
            scope: {date: '@'},
            link: function (scope, element) {

                var future;
                future = new Date(scope.date);
                var a = '<div class="row"><div class="col-xs-3"><h2 class="f-90 f-w-400 counter-text1"></h2><p class="f-24 f-w-400"> Days </p></div><div class="col-xs-3"><h2 class="f-90 f-w-400 counter-text2"></h2><p class="f-24 f-w-400">Hours</p></div><div class="col-xs-3"><h2 class="f-90 f-w-400 counter-text3"></h2><p class="f-24 f-w-400">Minutes</p></div><div class="col-xs-3"><h2 class="f-90 f-w-400 counter-text4"></h2><p class="f-24 f-w-400">Seconds</p></div></div>';
                var b = element.append(a);
                $interval(function () {
                    var diff;
                    diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
                    return b.find("h2.counter-text1").text(Util.dhms(diff).d),
                        b.find("h2.counter-text2").text(Util.dhms(diff).h),
                        b.find("h2.counter-text3").text(Util.dhms(diff).m),
                        b.find("h2.counter-text4").text(Util.dhms(diff).s);
                }, 1000);
            }
        };
    }
]);

ableApp.directive('lightgallery', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.parent().lightGallery();
        }
    };
});

ableApp.directive('countdown1', [
    'Util',
    '$interval',
    function (Util, $interval) {
        return {
            restrict: 'A',
            scope: {date: '@'},
            link: function (scope, element) {

                var future;
                future = new Date(scope.date);
                var a = '<div class="row"><div class="col-xs-3"><h2 class="f-15 f-w-400 counter-text1"></h2><p class="f-18 "> Days </p></div><div class="col-xs-3"><h2 class="f-15 f-w-400 counter-text2"></h2><p class="f-18 ">Hours</p></div><div class="col-xs-3"><h2 class="f-15 f-w-400 counter-text3"></h2><p class="f-18">Minutes</p></div><div class="col-xs-3"><h2 class="f-15 f-w-400 counter-text4"></h2><p class="f-18 ">Seconds</p></div></div>';
                var b = element.append(a);
                $interval(function () {
                    var diff;
                    diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
                    return b.find("h2.counter-text1").text(Util.dhms(diff).d),
                        b.find("h2.counter-text2").text(Util.dhms(diff).h),
                        b.find("h2.counter-text3").text(Util.dhms(diff).m),
                        b.find("h2.counter-text4").text(Util.dhms(diff).s);
                }, 1000);
            }
        };
    }
]);

ableApp.factory('Util', [function () {
    return {
        dhms: function (t) {

            var days, hours, minutes, seconds;
            days = Math.floor(t / 86400);
            t -= days * 86400;
            hours = Math.floor(t / 3600) % 24;
            t -= hours * 3600;
            minutes = Math.floor(t / 60) % 60;
            t -= minutes * 60;
            seconds = t % 60;

            return {
                d: days,
                h: hours,
                m: minutes,
                s: seconds
            };
        }
    };
}]);

ableApp.run(['$templateCache', 'AuthenticationService', '$rootScope', '$location', '$base64', function ($templateCache, AuthenticationService, $rootScope, $location,$base64) {

    AuthenticationService.init();
    if(AuthenticationService.authenticate()){
        var credentials = JSON.parse($base64.decode($rootScope.globals.auth));
        AuthenticationService.login(credentials.un, credentials.pw).then(function(response){
            if (response.Validate === "TRUE") {
                $rootScope.globals.currentUser = {};
                $rootScope.globals.currentUser.Userinfo = response.Userinfo;
                $rootScope.globals.currentUser.MenuList = response.MenuList[0].ChildMenuList;
                setPageLocation();
            } else {
                redirectLogin()
            }
        },function(){
            redirectLogin()
        });
    } else {
        redirectLogin();
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        setPageLocation();
    });

    function setPageLocation() {
        if (AuthenticationService.authenticate()) {
            if ($location.path() === '/login' || $location.path() === "") {
                $location.path('/dashboard');
            }
        } else {
            redirectLogin();
        }
    }
    function redirectLogin() {
        // redirect to login page if not logged in
        if ($location.path() !== '/login')
            $location.path('/login');
    }

    $templateCache.put('searchbox.tpl.html', '<input id="pac-input" class="pac-controls" type="text" placeholder="Search">');
    $templateCache.put('window.tpl.html', '<div  ng-init="showPlaceDetails(parameter)">{{place.name}}</div>');
    $templateCache.put("angular-ui-notification-fadeIn.html", "<div class=\"ui-notification animated fadeIn\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
    $templateCache.put("angular-ui-notification-fadeInLeft.html", "<div class=\"ui-notification animated fadeInLeft\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
    $templateCache.put("angular-ui-notification-fadeInRight.html", "<div class=\"ui-notification animated fadeInRight\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
    $templateCache.put("angular-ui-notification-fadeInUp.html", "<div class=\"ui-notification animated fadeInUp\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
    $templateCache.put("angular-ui-notification-fadeInDown.html", "<div class=\"ui-notification animated fadeInDown\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
    $templateCache.put("angular-ui-notification-bounceIn.html", "<div class=\"ui-notification animated bounceIn\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
    $templateCache.put("angular-ui-notification-bounceInLeft.html", "<div class=\"ui-notification animated bounceInLeft\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
    $templateCache.put("angular-ui-notification-bounceInRight.html", "<div class=\"ui-notification animated bounceInRight\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
    $templateCache.put("angular-ui-notification-bounceInUp.html", "<div class=\"ui-notification animated bounceInUp\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
    $templateCache.put("angular-ui-notification-rotateInDownRight.html", "<div class=\"ui-notification animated rotateInDownRight\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
    $templateCache.put("angular-ui-notification-rotateIn.html", "<div class=\"ui-notification animated rotateIn\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
    $templateCache.put("angular-ui-notification-flipInX.html", "<div class=\"ui-notification animated flipInX\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
    $templateCache.put("angular-ui-notification-flipInY.html", "<div class=\"ui-notification animated flipInY\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
    $templateCache.put("secondDialog.html", "<div class=\"ngdialog-message\"><h3 class=\"f-26\">Add Contact</h3><div><div class=\"md-group-add-on\"><span class=\"md-add-on\"><i class=\"icofont icofont-ui-user\"></i></span><div class=\"md-input-wrapper\"><input type=\"text\" class=\"md-form-control\" /><label>Name</label></div></div><div class=\"md-group-add-on\"><span class=\"md-add-on\"><i class=\"icofont icofont-ui-email\"></i></span><div class=\"md-input-wrapper\"><input type=\"Email\" class=\"md-form-control\" /><label>Email</label></div></div><div class=\"md-group-add-on\"><span class=\"md-add-on\"><i class=\"icofont icofont-opposite\"></i></span><div class=\"md-input-wrapper\"><input type=\"text\" class=\"md-form-control\" /><label>Position</label></div></div><div class=\"md-group-add-on\"><span class=\"md-add-on\"><i class=\"icofont icofont-ui-office\"></i></span><div class=\"md-input-wrapper\"><input type=\"text\" class=\"md-form-control\" /><label>Office</label></div></div><div class=\"md-group-add-on\"><span class=\"md-add-on\"><i class=\"icofont icofont-funky-man\"></i></span><div class=\"md-input-wrapper\"><input type=\"number\" class=\"md-form-control\" /><label>Age</label></div></div><div class=\"md-group-add-on\"><span class=\"md-add-on\"><i class=\"icofont icofont-ui-cell-phone\"></i></span><div class=\"md-input-wrapper\"><input type=\"number\" class=\"md-form-control\" /><label>Phone No</label></div></div><div class=\"md-group-add-on\"><span class=\"md-add-on\"><i class=\"icofont icofont-ui-calendar\"></i></span><div class=\"md-input-wrapper\"><input type=\"text\" id=\"date\" class=\"md-form-control md-static\"><label>Birthday Date</label></div></div><div class=\"text-center\"><button type=\"button\" class=\"btn btn-primary waves-effect m-r-20 f-w-600 d-inline-block\">Save</button><button type=\"button\" class=\"btn btn-primary waves-effect m-r-20 f-w-600 md-close d-inline-block\">Close</button></div></div></div>");


}]);


ableApp.directive('countrymap', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).width('auto'),
                $(element).height(300),
                scope.$watch("countryMap", function (newCountry, oldCountry) {
                    setTimeout(function () {
                        $(element).vectorMap({
                            map: newCountry,
                            normalizeFunction: "polynomial",
                            hoverOpacity: .7,
                            hoverColor: !1,
                            regionStyle: {
                                initial: {
                                    fill: "#EC407A"
                                }
                            },
                            markerStyle: {
                                initial: {
                                    r: 9,
                                    fill: "#2196F3",
                                    "fill-opacity": .9,
                                    stroke: "#fff",
                                    "stroke-width": 7,
                                    "stroke-opacity": .4
                                },
                                hover: {
                                    stroke: "#fff",
                                    "fill-opacity": 1,
                                    "stroke-width": 1.5
                                }
                            },
                            backgroundColor: "transparent",
                            markers: [{
                                latLng: [41.9, 12.45],
                                name: "Vatican City"
                            }, {
                                latLng: [43.73, 7.41],
                                name: "Monaco"
                            }, {
                                latLng: [-.52, 166.93],
                                name: "Nauru"
                            }, {
                                latLng: [-8.51, 179.21],
                                name: "Tuvalu"
                            }, {
                                latLng: [43.93, 12.46],
                                name: "San Marino"
                            }, {
                                latLng: [47.14, 9.52],
                                name: "Liechtenstein"
                            }, {
                                latLng: [7.11, 171.06],
                                name: "Marshall Islands"
                            }, {
                                latLng: [17.3, -62.73],
                                name: "Saint Kitts and Nevis"
                            }, {
                                latLng: [3.2, 73.22],
                                name: "Maldives"
                            }, {
                                latLng: [35.88, 14.5],
                                name: "Malta"
                            }, {
                                latLng: [12.05, -61.75],
                                name: "Grenada"
                            }, {
                                latLng: [13.16, -61.23],
                                name: "Saint Vincent and the Grenadines"
                            }, {
                                latLng: [13.16, -59.55],
                                name: "Barbados"
                            }, {
                                latLng: [17.11, -61.85],
                                name: "Antigua and Barbuda"
                            }, {
                                latLng: [-4.61, 55.45],
                                name: "Seychelles"
                            }, {
                                latLng: [7.35, 134.46],
                                name: "Palau"
                            }, {
                                latLng: [42.5, 1.51],
                                name: "Andorra"
                            }, {
                                latLng: [14.01, -60.98],
                                name: "Saint Lucia"
                            }, {
                                latLng: [6.91, 158.18],
                                name: "Federated States of Micronesia"
                            }, {
                                latLng: [1.3, 103.8],
                                name: "Singapore"
                            }, {
                                latLng: [1.46, 173.03],
                                name: "Kiribati"
                            }, {
                                latLng: [-21.13, -175.2],
                                name: "Tonga"
                            }, {
                                latLng: [15.3, -61.38],
                                name: "Dominica"
                            }, {
                                latLng: [-20.2, 57.5],
                                name: "Mauritius"
                            }, {
                                latLng: [26.02, 50.55],
                                name: "Bahrain"
                            }, {
                                latLng: [.33, 6.73],
                                name: "São Tomé and Príncipe"
                            }]
                        });
                    }, 20);
                })
        }
    };
}]);

ableApp.directive('indiamap', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).width('auto'),
                $(element).height(300),
                scope.$watch("indiamap", function (newCountry, oldCountry) {
                    setTimeout(function () {
                        $(element).vectorMap({
                            map: "in_mill",
                            backgroundColor: "transparent",
                            regionStyle: {
                                initial: {
                                    fill: "#1B8BF9"
                                }
                            }
                        });
                    }, 20);
                })
        }
    };
}]);

ableApp.directive('asiamap', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).width('auto'),
                $(element).height(300),
                scope.$watch("asiamap", function (newCountry, oldCountry) {
                    setTimeout(function () {
                        $(element).vectorMap({
                            map: "asia_mill",
                            backgroundColor: "transparent",
                            regionStyle: {
                                initial: {
                                    fill: "#4DB6AC"
                                }
                            }
                        });
                    }, 20);
                })
        }
    };
}]);

ableApp.directive('usamap', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).width('auto'),
                $(element).height(300),
                scope.$watch("usamap", function (newCountry, oldCountry) {
                    setTimeout(function () {
                        $(element).vectorMap({
                            map: "us_aea_en",
                            backgroundColor: "transparent",
                            regionStyle: {
                                initial: {
                                    fill: "#CDDC39"
                                }
                            }
                        });
                    }, 20);
                })
        }
    };
}]);

ableApp.directive('canadamap', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).width('auto'),
                $(element).height(300),
                scope.$watch("canadamap", function (newCountry, oldCountry) {
                    setTimeout(function () {
                        $(element).vectorMap({
                            map: "uk_mill_en",
                            backgroundColor: "transparent",
                            regionStyle: {
                                initial: {
                                    fill: "#18FFFF"
                                }
                            }
                        });
                    }, 20);
                })
        }
    };
}]);

ableApp.directive('ukmap', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).width('auto'),
                $(element).height(300),
                scope.$watch("ukmap", function (newCountry, oldCountry) {
                    setTimeout(function () {
                        $(element).vectorMap({
                            map: "uk_mill_en",
                            backgroundColor: "transparent",
                            regionStyle: {
                                initial: {
                                    fill: "#81c868"
                                }
                            }
                        });
                    }, 20);
                })
        }
    };
}]);

/*Directive for comma counter*/
ableApp.directive("countToComma", ["$timeout", "$window", function (a) {

    return {
        replace: !1,
        scope: !0,
        link: function (b, c, d) {
            var counter = $('.CounterS');

            var e, f, g, h, i, j, k, l = c[0],
                num,
                m = function () {

                    num = d.countToComma.replace(/\,/g, ''),
                        d.countToComma = num,
                        f = 30,
                        i = 0,
                        b.timoutId = null,
                        j = parseInt(d.countToComma) || 0,
                        b.value = parseInt(d.value, 10) || 0,
                        g = 1e3 * parseFloat(d.duration) || 0,
                        h = Math.ceil(g / f),
                        k = (j - b.value) / h,
                        e = b.value

                },
                n = function () {

                    b.timoutId = a(function () {

                        e += k,
                            i++,
                            i >= h ? (a.cancel(b.timoutId),
                                e = j,
                                l.innerText = j.toLocaleString()) : (l.innerText = Math.round(e).toLocaleString(),
                                n())
                    }, f)
                },

                o = function () {

                    b.timoutId && a.cancel(b.timoutId), m(), n()
                };
            return d.$observe("countTo", function (a) {

                a && o()
            }),
                d.$observe("value", function () {

                    o()
                }), !0
        }
    }
}]);

/*Directive for point counter*/
ableApp.directive("countTo", ["$timeout", "$window", function (a) {

    return {
        replace: !1,
        scope: !0,

        link: function (b, c, d) {
            var counterS = $('.CounterS');

            var e, f, g, h, i, j, k, l = c[0],
                num,
                m = function () {

                    if (d.countTo % 1 == 0) {

                        f = 30,
                            i = 0,
                            b.timoutId = null,
                            j = parseInt(d.countTo) || 0,
                            b.value = parseInt(d.value, 10) || 0,
                            g = 1e3 * parseFloat(d.duration) || 0,
                            h = Math.ceil(g / f),
                            k = (j - b.value) / h,
                            e = b.value
                    } else if (d.countTo.match(",")) {

                        num = d.countTo.replace(/\,/g, ''),
                            d.countTo = num,
                            f = 30,
                            i = 0,
                            b.timoutId = null,
                            j = parseInt(d.countTo) || 0,
                            b.value = parseInt(d.value, 10) || 0,
                            g = 1e3 * parseFloat(d.duration) || 0,
                            h = Math.ceil(g / f),
                            k = (j - b.value) / h,
                            e = b.value
                    } else if (d.countTo % 1 !== 0) {

                        f = 30,
                            i = 0,
                            b.timoutId = null,
                            j = parseFloat(d.countTo) || 0,
                            b.value = parseInt(d.value, 10) || 0,
                            g = 1e3 * parseFloat(d.duration) || 0,
                            h = Math.ceil(g / f),
                            k = (j - b.value) / h,
                            e = b.value
                    }

                },
                n = function () {

                    b.timoutId = a(function () {

                        e += k,
                            i++,
                            i >= h ? (a.cancel(b.timoutId),
                                e = j,
                                l.innerText = j) : (l.innerText = Math.round(e),
                                n())
                    }, f)
                },

                o = function () {
                    b.timoutId && a.cancel(b.timoutId), m(), n()
                };
            return d.$observe("countTo", function (a) {

                a && o()
            }), d.$observe("value", function () {

                o()
            }), !0
        }
    }
}]);
ableApp.directive('mdFormControl', function ($timeout) {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {

            $(element).parent().append('<span class="md-line"></span>');

            $(element).change(function () {
                validateClass();
            });
            $timeout(function () {
                validateClass();
            }, 100);

            function validateClass() {
                if ($(element).val() == "") {
                    $(element).removeClass("md-valid");
                } else {
                    $(element).addClass("md-valid");
                }
            }
        }
    };
});

ableApp.directive('filterButton', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            element.unbind('click').click(function (e) {
                e.preventDefault();

                var port = $(this).parents('.card');
                var card = $(port).children('.card-block');
                $(card).children('.salesFilter').slideToggle()
            });
        }
    }
});
ableApp.directive('compareTo', function () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function (scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function (modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
});
ableApp.directive('passwordToggle', function () {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, elem, attrs) {
            scope.tgl = function () {
                elem.attr('type', (elem.attr('type') === 'text' ? 'password' : 'text'));
            };
            var lnk = angular.element('<a data-ng-click="tgl()">Toggle</a>');
            $compile(lnk)(scope);
            elem.wrap('<div class="password-toggle"/>').after(lnk);
        }
    }
});


ableApp.factory('HttpService', function ($http, $q) {
    var apiRoot = "/BusinessTrendAPI/Service1.svc/";

    var HttpService = function (apiModule) {
        this.apiModule = apiModule;
    };

    function makeRequestSuccess(response) {

        if (response.status === 200) {
            return response.data;
        } else {
            return $q.reject(response.data.message);
        }
    }

    function makeRequestFailed(response) {
        var errMsg = "Some problem in server, try reloading the page. If the issue still persist contact admin.";
        return $q.reject("Error#" + response.status + ": " + errMsg);
    }

    HttpService.prototype.get = function (url) {
        var self = this;
        var endPoint = "/" + url;
        if (url == "")
            endPoint = "";
        return $http.get(apiRoot + self.apiModule + endPoint).then(makeRequestSuccess, makeRequestFailed);
    };
    HttpService.prototype.post = function (url, params) {
        var self = this;
        var endPoint = "/" + url;
        if (url == "")
            endPoint = "";
        return $http.post(apiRoot + self.apiModule + endPoint, params).then(makeRequestSuccess, makeRequestFailed);
    };
    HttpService.prototype.delete = function (url) {
        var self = this;
        var endPoint = "/" + url;
        if (url == "")
            endPoint = "";
        return $http.delete(apiRoot + self.apiModule + endPoint).then(makeRequestSuccess, makeRequestFailed);
    };
    return HttpService;
});

ableApp.factory('AuthenticationService', function AuthenticationService($base64, $http, $q, HttpService, $rootScope, $cookies) {
    var httpService = new HttpService("Authentication");

    var AuthenticationService = {};

    AuthenticationService.authenticate = function () {
        return angular.isDefined($rootScope.globals.currentUser && $rootScope.globals.auth);
    };

    AuthenticationService.init = function () {
        $rootScope.globals = $cookies.get('globals') || "{}";
        $rootScope.globals = JSON.parse($rootScope.globals)
    };


    AuthenticationService.login = function (username, password) {
        var self = this;
        return httpService.post('', {
            "UserId": username,
            "PSW": password
        });

        /*  //OFFLINE LOGIN
         var loginResponse = {
         message : "1280918200@1"
         }
         return $q.resolve(loginResponse);*/
    };

    AuthenticationService.logout = function () {
        return httpService.post('logout', {
            "userId": AuthenticationService.getUserId()
        });
    };

    AuthenticationService.setSession = function (username, password, userSuccessResponse, remember) {
        var authData = $base64.encode(JSON.stringify({un:username,pw:password}));
        $rootScope.globals.auth = authData;
        $rootScope.globals.currentUser = {};
        $rootScope.globals.currentUser.Userinfo = userSuccessResponse.Userinfo;
        $http.defaults.headers.common['Auth'] = authData; // jshint ignore:line

        if(remember){
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 30);

            $cookies.put('globals', JSON.stringify($rootScope.globals), {'expires': expireDate});
        } else {
            $cookies.put('globals', JSON.stringify($rootScope.globals));
        }
        $rootScope.globals.currentUser.MenuList = userSuccessResponse.MenuList[0].ChildMenuList
    };

    AuthenticationService.clearSession = function () {
        $rootScope.globals = {};
        $cookies.remove('globals');
        $http.defaults.headers.common['Auth'] = '';
    };

    return AuthenticationService;

});

ableApp.constant('CriteriaFilter', {
    'STORE': 'STORE',
    'REGION': 'REGION',
    'CITY': 'CITY',
    'CLUSTER': 'CLUSTER',
    'TRADEAREA': 'TRADEAREA',
    'BUILDING': 'BUILDING',
    'TIER': 'TIER',
    'MODEL': 'MODEL',
    'VINTAGE': 'VINTAGE',
    'LIQUOR': 'LIQUOR'
});