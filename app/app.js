let ableApp = angular.module('able', ['ngCookies', 'base64', 'ui.router', 'oc.lazyLoad', 'ngAnimate', 'ngMaterial', 'ngSanitize', 'ui.bootstrap', 'ui.slimscroll', 'angularRipple', 'ngMessages', 'ui.toggle', 'toastr', 'googlechart', 'amChartsDirective', 'angularjs-gauge', 'dndLists', 'able.pages']); //'ui.bootstrap', 'ui.slimscroll', 'angularRipple'

ableApp.config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        closeButton: true,
        // extendedTimeOut: 0,
        timeout: 0,
        closeHtml: '<button>x</button>',
        tapToDismiss: true,
        positionClass: (window.screen.width >= 1024 || window.screen.height >= 1024) ? 'toast-top-right' : 'toast-top-full-width',
    });
});

ableApp.config(function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) { //$locationProvider
    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            controller: 'LoginController'
        })
        .state('changePassword', {
            url: "/changePassword",
            templateUrl: "views/change_password.html",
            controller: 'ChangePassController'
        })
        .state('settings', {
            url: "/settings",
            templateUrl: "views/settings.html",
            controller: 'SettingController'
        });
});
/*Directive for owl carousel*/
ableApp.directive('wrapOwlcarousel', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            let options = scope.$eval($(element).attr('data-options'));
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

                let future;
                future = new Date(scope.date);
                let a = '<div class="row"><div class="col-xs-3"><h2 class="f-90 f-w-400 counter-text1"></h2><p class="f-24 f-w-400"> Days </p></div><div class="col-xs-3"><h2 class="f-90 f-w-400 counter-text2"></h2><p class="f-24 f-w-400">Hours</p></div><div class="col-xs-3"><h2 class="f-90 f-w-400 counter-text3"></h2><p class="f-24 f-w-400">Minutes</p></div><div class="col-xs-3"><h2 class="f-90 f-w-400 counter-text4"></h2><p class="f-24 f-w-400">Seconds</p></div></div>';
                let b = element.append(a);
                $interval(function () {
                    let diff;
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

                let future;
                future = new Date(scope.date);
                let a = '<div class="row"><div class="col-xs-3"><h2 class="f-15 f-w-400 counter-text1"></h2><p class="f-18 "> Days </p></div><div class="col-xs-3"><h2 class="f-15 f-w-400 counter-text2"></h2><p class="f-18 ">Hours</p></div><div class="col-xs-3"><h2 class="f-15 f-w-400 counter-text3"></h2><p class="f-18">Minutes</p></div><div class="col-xs-3"><h2 class="f-15 f-w-400 counter-text4"></h2><p class="f-18 ">Seconds</p></div></div>';
                let b = element.append(a);
                $interval(function () {
                    let diff;
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

            let days, hours, minutes, seconds;
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

/*Directive for comma counter*/
ableApp.directive("countToComma", ["$timeout", "$window", function (a) {

    return {
        replace: !1,
        scope: !0,
        link: function (b, c, d) {
            let counter = $('.CounterS');

            let e, f, g, h, i, j, k, l = c[0],
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
            return d.$observe("countToComma", function (a) {

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
            let counterS = $('.CounterS');

            let e, f, g, h, i, j, k, l = c[0],
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

                let port = $(this).parents('.card');
                let card = $(port).children('.card-block');
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
            let lnk = angular.element('<a data-ng-click="tgl()">Toggle</a>');
            $compile(lnk)(scope);
            elem.wrap('<div class="password-toggle"/>').after(lnk);
        }
    }
});
ableApp.directive('btnDropdown', function () {
    return {
        restrict: 'E',

        scope: {
            options: "=",
            selectModel: "=",
            selectChange: "&"
        },
        template: '<div class="dropdown hidden-sm-down" >\n' +
            '               <button  class="btn btn-secondary shadow-none dropdown-toggle" type="button"\n' +
            '                       id="dropdownMenuButton" data-toggle="dropdown"\n' +
            '                       aria-haspopup="true" aria-expanded="false">\n' +
            '                   <span ng-repeat="item in options" ng-if="selectModel.value == item.value">{{item.label}}</span>' +
            '               </button>\n' +
            '               <div class="dropdown-menu dropdown-menu-right dropdown-menu-options"\n' +
            '                    aria-labelledby="dropdownMenuButton">\n' +
            '                   <div class="btn-group-vertical">' +
            '                       <label class="btn btn-primary" ng-repeat="item in options" ' +
            '                               ng-model="selectModel.value" ng-change="selectChange()" uib-btn-radio="\'{{item.value}}\'">' +
            '                               {{item.label}}' +
            '                       </label>\n' +
            '                   </div>\n' +
            '               </div>\n' +
            '           </div>' +
            '           <div class="dropdown hidden-md-up" >\n' +
            '               <button class="btn btn-secondary btn-mini shadow-none dropdown-toggle" type="button"\n' +
            '                       id="dropdownMenuButton" data-toggle="dropdown"\n' +
            '                       aria-haspopup="true" aria-expanded="false">\n' +
            '                   <span ng-repeat="item in options" ng-if="selectModel.value == item.value">{{item.label}}</span>' +
            '               </button>\n' +
            '               <div class="dropdown-menu dropdown-menu-right dropdown-menu-options"\n' +
            '                    aria-labelledby="dropdownMenuButton">\n' +
            '                   <div class="btn-group-vertical">' +
            '                       <label class="btn btn-primary btn-mini" ng-repeat="item in options" ' +
            '                               ng-model="selectModel.value" ng-change="selectChange()" uib-btn-radio="\'{{item.value}}\'">' +
            '                               {{item.label}}' +
            '                       </label>\n' +
            '                   </div>\n' +
            '               </div>\n' +
            '           </div>',
        link: function (scope, element, attributes) {
        }
    }
        ;
});
ableApp.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);
        for (let i = 0; i < total; i++)
            input.push(input[i]);
        return input;
    };
});
ableApp.directive('googleSignInButton', function (AuthenticationService) {
    return {
        scope: {
            buttonId: '@',
            options: '&',
            preLoading: '='
        },
        template: '<div></div>',
        link: function (scope, element, attrs) {
            let div = element.find('div')[0];
            div.id = attrs.buttonId;
            gapi.signin2.render(div.id, scope.options());//render a google button, first argument is an id, second options
            scope.preLoading = true;
            gapi.load('auth2', function () {
                scope.preLoading = false;
                gapi.auth2.init().then(function () {
                    if (!AuthenticationService.authenticate()) {
                        AuthenticationService.signOutGoogle();
                    }
                });

            });
        }
    };
});

ableApp.factory('HttpService', function ($http, $q) {
    let apiRoot = "/BusinessTrendAPI/Service1.svc/";

    let HttpService = function (apiModule) {
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
        let errMsg = "Some problem in server, try reloading the page. If the issue still persist contact admin.";
        return $q.reject("Error#" + response.status + ": " + errMsg);
    }

    HttpService.prototype.get = function (url) {
        let self = this;
        let endPoint = "/" + url;
        if (url === "")
            endPoint = "";
        return $http.get(apiRoot + self.apiModule + endPoint).then(makeRequestSuccess, makeRequestFailed);
    };
    HttpService.prototype.post = function (url, params) {
        let self = this;
        let endPoint = "/" + url;
        if (url === "")
            endPoint = "";
        return $http.post(apiRoot + self.apiModule + endPoint, params).then(makeRequestSuccess, makeRequestFailed);
    };
    HttpService.prototype.delete = function (url) {
        let self = this;
        let endPoint = "/" + url;
        if (url === "")
            endPoint = "";
        return $http.delete(apiRoot + self.apiModule + endPoint).then(makeRequestSuccess, makeRequestFailed);
    };
    return HttpService;
});
/*ableApp.factory('CountryService', function CountryService($http, $q, HttpService) {
    let getCountryService = new HttpService("https://ipinfo.io/json");
    CountryService.getCountry = function () {
        return getCountryService.get('', );
    };
    return CountryService;
});*/
ableApp.factory('mdToast', function mdToast($mdToast) {
    mdToast.display = function (type, msg,) {
        $mdToast.show({
            template: '<md-toast class="md-toast ' + type + '">' + msg + '</md-toast>',
            hideDelay: 3000,
            highlightClass: 'md-warn'
        });
    };
    return mdToast;
});

ableApp.factory('AuthenticationService', function AuthenticationService($base64, $http, $q, HttpService, $rootScope, $cookies, $location, $timeout) {
    let httpService = new HttpService("Authentication");
    let AuthenticationService = {};
    AuthenticationService.authenticate = function () {
        return angular.isDefined($rootScope.globals.currentUser && $rootScope.globals.auth);
    };

    AuthenticationService.init = function () {
        $rootScope.globals = $cookies.get('globals') || "{}";
        $rootScope.userPreference = $cookies.get('upf') || "{}";
        $rootScope.MenuList = $cookies.get('menus') || "{}";
        $rootScope.globals = JSON.parse($rootScope.globals);
        $rootScope.userPreference = JSON.parse($rootScope.userPreference);
        $rootScope.MenuList = JSON.parse($rootScope.MenuList);
    };
    AuthenticationService.getMenuList = function () {
        if (AuthenticationService.authenticate())
            return $rootScope.MenuList;
    };
    AuthenticationService.getCurrentCompany = function () {
        return $rootScope.globals.selectedCompany;
    };
    AuthenticationService.userHasMenuAccess = function (menu) {
        let userMenuIdsList = AuthenticationService.getMenuList();
        let flag = false;
        if (!AuthenticationService.authenticate())
            flag = false;
        else {
            for (let i = 0; i < userMenuIdsList.length; i++) {
                if (userMenuIdsList[i].Test_Col === menu) {
                    flag = true;
                    break;
                }
            }
            if (menu === 'settings' || menu === 'changePassword' || menu === 'login')
                flag = true;
        }
        return flag;
    };

    AuthenticationService.login = function (username, password) {
        let self = this;
        return httpService.post('', {
            "UserId": username,
            "PSW": password,
            "EmailId": "",
            "Token": ""
        });

        /*  //OFFLINE LOGIN
         let loginResponse = {
         message : "1280918200@1"
         }
         return $q.resolve(loginResponse);*/
    };

    AuthenticationService.fetchMenu = function (userId, company) {
        var apiKey = "";
        if (company === "12") {
            apiKey = "onesta";
        } else if (company === "8") {
            apiKey = "bbq";
        } else if (company === "15") {
            apiKey = "dubai";
        }
        var fetchMenuService = new HttpService("FetchMenu");
        return fetchMenuService.post('', {
            "UserId": userId,
            "CompId": parseInt(company)
        });
    };

    AuthenticationService.fetchUserPreference = function (userId, companyId) {
        let fetchUserPreference = new HttpService("FetchUserPreference");
        return fetchUserPreference.post('', {
            "UserId": userId,
            "CompId": companyId
        });
    };
    AuthenticationService.setUserPreference = function (userPreference) {
        $rootScope.userPreference = userPreference;
        $cookies.put('upf', JSON.stringify(userPreference));
    };
    AuthenticationService.setUserMenu = function (response) {
        $rootScope.MenuList = response;
        $cookies.put('menus', JSON.stringify(response));
    };
    AuthenticationService.loginWithGoogle = function (username, password) {
        let self = this;
        return httpService.post('', {
            "UserId": "",
            "PSW": "",
            "EmailId": username,
            "Token": password
        });
    };

    AuthenticationService.logout = function () {
        AuthenticationService.clearSession();
        AuthenticationService.signOutGoogle();
        $location.path("/login");

    };
    AuthenticationService.signOutGoogle = function () {
        let auth2 = gapi.auth2;
        if (auth2) {
            auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                $timeout(function () {
                    $location.path("/login");
                }, 10);
            });
        }
    };

    AuthenticationService.setSession = function (username, password, userSuccessResponse, remember, menuList, companyId) {
        let authData = $base64.encode(JSON.stringify({un: username, pw: password}));
        $rootScope.globals.auth = authData;
        $rootScope.globals.currentUser = {};
        $rootScope.globals.selectedCompany = {};
        $rootScope.globals.currentUser.Userinfo = userSuccessResponse.Userinfo;
        $rootScope.MenuList = menuList.MenuList[0].ChildMenuList;
        AuthenticationService.setUserMenu(menuList.MenuList[0].ChildMenuList);
        $http.defaults.headers.common['Auth'] = authData; // jshint ignore:line
        $rootScope.globals.currentUser.CompanyList = userSuccessResponse.CompanyList;
        for (let r = 0; r < userSuccessResponse.CompanyList.length; r++) {
            if ($rootScope.globals.currentUser.CompanyList[r].CompanyId === companyId) {
                $rootScope.globals.currentUser.CompanyList[r].selected = true;
                $rootScope.globals.selectedCompany = $rootScope.globals.currentUser.CompanyList[r];
            } else {
                $rootScope.globals.currentUser.CompanyList[r].selected = false;
            }
        }
        if (remember) {
            let expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 30);
            $cookies.put('globals', JSON.stringify($rootScope.globals), {'expires': expireDate});
        } else {
            $cookies.put('globals', JSON.stringify($rootScope.globals));
        }
    };

    AuthenticationService.clearSession = function () {
        $rootScope.globals = {};
        $cookies.remove('globals');
        $http.defaults.headers.common['Auth'] = '';
    };

    return AuthenticationService;

});

ableApp.directive('switch', function () {
    return {
        restrict: 'AE'
        , replace: true
        , transclude: true
        , template: function (element, attrs) {
            let html = '';
            html += '<span';
            html += ' class="switch' + (attrs.class ? ' ' + attrs.class : '') + '"';
            html += attrs.ngModel ? ' ng-click="' + attrs.disabled + ' ? ' + attrs.ngModel + ' : ' + attrs.ngModel + '=!' + attrs.ngModel + (attrs.ngChange ? '; ' + attrs.ngChange + '()"' : '"') : '';
            html += ' ng-class="{ checked:' + attrs.ngModel + ', disabled:' + attrs.disabled + ' }"';
            html += '>';
            html += '<small></small>';
            html += '<input type="checkbox"';
            html += attrs.id ? ' id="' + attrs.id + '"' : '';
            html += attrs.name ? ' name="' + attrs.name + '"' : '';
            html += attrs.ngModel ? ' ng-model="' + attrs.ngModel + '"' : '';
            html += ' style="display:none" />';
            html += '<span class="switch-text">';
            /*adding new container for switch text*/
            html += attrs.on ? '<span class="on">' + attrs.on + '</span>' : '';
            /*switch text on value set by user in directive html markup*/
            html += attrs.off ? '<span class="off">' + attrs.off + '</span>' : ' ';
            /*switch text off value set by user in directive html markup*/
            html += '</span>';
            return html;
        }
    }
});

/*ableApp.directive('hcChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            options: '='
        },
        link: function (scope, element) {
            Highcharts.chart(element[0], scope.options);
        }
    };
})
// Directive for pie charts, pass in title and data only
ableApp.directive('hcPieChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            title: '@',
            data: '=',
            options: '='
        },
        link: function (scope, element) {
            Highcharts.chart(element[0], {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: scope.title
                },
                plotOptions: scope.options,
                series: [{
                    data: scope.data
                }]
            });
        }
    };
})*/

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

