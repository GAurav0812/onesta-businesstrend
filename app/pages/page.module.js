(function () {
    'use strict';
    angular.module('able.pages', [
        'able.pages.onesta',
        'able.pages.common',
        'able.pages.constant'
    ]).config(routeConfig).run(['$templateCache','CommonService', 'AuthenticationService', '$filter', '$injector', '$rootScope', '$state', '$location', '$cookies', '$base64', 'mdToast', 'HttpService',
        function ($templateCache,CommonService, AuthenticationService, $filter, $injector, $rootScope, $state, $location, $cookies, $base64, mdToast, HttpService) {
            AuthenticationService.init();
            if (AuthenticationService.authenticate()) {
                let credentials = JSON.parse($base64.decode($rootScope.globals.auth));
                let userid = $rootScope.globals.currentUser.Userinfo.UserId;
                let company = $rootScope.globals.selectedCompany;
                let userPreference = $rootScope.userPreference;
                AuthenticationService.login(credentials.un, credentials.pw).then(function (response) {
                    if (response.Validate === "TRUE") {
                        setMenu(company.CompanyId, userid, response);
                        /*     if(Object.keys(userPreference).length === 0){*/
                        AuthenticationService.fetchUserPreference(userid, company.CompanyId).then(function (response) {
                            AuthenticationService.setUserPreference(response);
                        });
                        /*
                                        }*/
                        setPageLocation(company);
                    } else {
                        AuthenticationService.logout();
                    }
                }, function (response) {
                    if (response.Validate === "FALSE") {
                        AuthenticationService.logout();
                    }
                });
            } else {
                AuthenticationService.logout();
            }

            function setMenu(company, userId, loginresponse) {
                AuthenticationService.fetchMenu(userId, company).then(function (response) {
                    if (response.Validate === "TRUE") {
                        $rootScope.globals.currentUser.Userinfo = loginresponse.Userinfo;
                        $rootScope.MenuList = response.MenuList[0].ChildMenuList;
                        AuthenticationService.setUserMenu(response.MenuList[0].ChildMenuList);
                        $rootScope.globals.currentUser.CompanyList = loginresponse.CompanyList;
                        for (let r = 0; r < $rootScope.globals.currentUser.CompanyList.length; r++) {
                            if ($rootScope.globals.currentUser.CompanyList[r].CompanyId === company) {
                                $rootScope.globals.selectedCompany = $rootScope.globals.currentUser.CompanyList[r];
                                $rootScope.globals.currentUser.CompanyList[r].selected = true;
                            } else {
                                $rootScope.globals.currentUser.CompanyList[r].selected = false;
                            }
                        }
                    }
                }, function () {

                });
            }

            $rootScope.$on('$stateChangeStart', function (event, toState) {
                let state = $injector.get('$state');
                let menu = toState.name;
                if (!AuthenticationService.userHasMenuAccess(menu)) {
                    $location.path("/");
                }
            });

            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                setPageLocation();
            });

            function setPageLocation() {
                let pageUrl = "";
                if (AuthenticationService.authenticate()) {
                    let company = $rootScope.globals.selectedCompany;
                    if (company.CompanyId === "12") {
                        pageUrl = "/onesta";
                    } else if (company.CompanyId === "8") {
                        pageUrl = "/bbqIndia";
                    } else if (company.CompanyId === "15") {
                        pageUrl = "/bbqDubai";
                    }
                    if ($location.path() === '/login' || $location.path() === "" || $location.path() === '/') {
                        $location.path(pageUrl + '/dashboard');
                        /* $location.url($rootScope.MenuList[0].Test_Col);*/
                    } else if ($location.path() === '/changePassword') {
                        $location.path('/changePassword');
                    } else if ($location.path() === '/settings') {
                        $location.path('/settings');
                    } else {
                        let url = $location.url().split('/');
                        $location.path(pageUrl + '/' + url[2]);
                    }
                } else {
                    AuthenticationService.logout();
                }
            }

            if (AuthenticationService.authenticate()) {
                if (Object.keys($rootScope.userPreference).length !== 0) {
                    getUserDetails();
                } else {
                    let userid = $rootScope.globals.currentUser.Userinfo.UserId;
                    let company = $rootScope.globals.selectedCompany;
                    AuthenticationService.fetchUserPreference(userid, company.CompanyId).then(function (response) {
                        AuthenticationService.setUserPreference(response);
                        getUserDetails();
                    });
                }
            }
            if (AuthenticationService.authenticate()) {
                getDaySale();
            }

            function getDaySale() {
                if (!CommonService.isTodaySaleLoaded()) {
                    let userid = $rootScope.globals.currentUser.Userinfo.UserId;
                    let apiKey = CommonService.getCompanyApikey();
                    CommonService.TodaySale(userid, apiKey).then(function (response) {
                        $rootScope.todaySaleData = response;
                    });
                }
            }

            function getUserDetails() {
                let optionMenuArr = $filter('filter')($rootScope.userPreference, {MenuDesc: 'Option'})[0];
                let optionCurrencyArr = $filter('filter')(optionMenuArr.ReportList, {Report: 'Currency In'})[0];
                let optionSalesArr = $filter('filter')(optionMenuArr.ReportList, {Report: 'Sales In'})[0];
                let optionCoversArr = $filter('filter')(optionMenuArr.ReportList, {Report: 'Covers In'})[0];
                $rootScope.userSelectedCurrency = $filter('filter')(optionCurrencyArr.Boxes, {Value: true})[0].BoxDesc;
                $rootScope.userSelectedSales = $filter('filter')(optionSalesArr.Boxes, {Value: true})[0].BoxDesc;
                $rootScope.userSelectedCovers = $filter('filter')(optionCoversArr.Boxes, {Value: true})[0].BoxDesc;
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

    function routeConfig($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    }
})();
