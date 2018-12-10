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

(function () {
    'use strict';
    angular.module('able.pages.common', [])
        .factory('CommonService', CommonService);

    function CommonService($filter, mdToast, sessionOptions, monthMasterArr, HttpService, $rootScope, $state) {
        CommonService.formatDate = function (strDate, formatStr) {
            let dt = new Date();
            if (strDate.indexOf("-") >= 0) {
                dt = new Date(strDate.split("-")[0] + "/" + strDate.split("-")[1] + "/" + strDate.split("-")[2]);
            } else {
                dt = new Date(strDate);
            }
            return $filter('date')(dt, formatStr);
        };

        CommonService.filterPercent = function (num, total) {
            return $filter('number')(((num / total) * 100), 2) + "%";
        };
        CommonService.filteredText = function (selectedFilter, type, outlets) {
            if (!selectedFilter[type]) {
                return "All " + type;
            } else {
                if (type === "Session") {
                    return $filter('filter')(sessionOptions, {value: selectedFilter.Session})[0].label;
                } else if (type === "Outlet") {
                    return $filter('filter')(outlets, {OutletCode: selectedFilter.Outlet})[0].OutletName;
                }
                return selectedFilter[type] + " " + type;
            }
        };

        CommonService.getDateNow = function (dayOffset) {
            let dateMod = (24 * 60 * 60 * 1000) * (dayOffset ? dayOffset : 0); //5 days
            let myDate = new Date();
            myDate.setTime(myDate.getTime() + dateMod);
            return myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
        };
        CommonService.getCurrentMenu = function (menuList) {
            let menu;
            menu = $filter('filter')(menuList, {Test_Col: $state.current.name})[0];
            return menu;
        };
        CommonService.Hierarchy = function (currentDate, currentDate2, userId, menuDesc) {
            let hierarchyData = new HttpService("Hierarchy");
            return hierarchyData.post('', {
                "CurrentDate": currentDate,
                "CurrentDate2": currentDate2,
                "UserId": userId,
                "Menu": menuDesc
            });
        };
        CommonService.TodaySale = function (userId, apiKey) {
            let todaySale = new HttpService("TodaySale");
            return todaySale.post('', {
                "UserId": userId,
            });
        };
        CommonService.isTodaySaleLoaded = function () {
            return angular.isDefined($rootScope.todaySaleData);
        };
        CommonService.getCompanyApikey = function () {
            let company = $rootScope.globals.selectedCompany.CompanyId;
            let apiKey = "";
            if (company === "12") {
                apiKey = "onesta";
            } else if (company === "8") {
                apiKey = "bbq";
            } else if (company === "15") {
                apiKey = "dubai";
            }
            return apiKey;
        };
        CommonService.getLastFiveYear = function () {
            let yearArr = [];
            for (let d = 0; d < 5; d++) {
                let yrArrObj = {};
                let dt = new Date();
                let currYr = dt.getFullYear();
                yrArrObj.value = dt.getFullYear() - d;
                yrArrObj.text = dt.getFullYear() - d;
                yrArrObj.number = (dt.getFullYear() - d).toString().substr(-2);
                yearArr.push(yrArrObj);
            }
            return yearArr;
        };
        CommonService.getPastYearsByNumber = function (num) {
            let yearArr = [];
            for (let d = 0; d < num; d++) {
                let yrArrObj = {};
                let dt = new Date();
                let currYr = dt.getFullYear();
                yrArrObj.value = dt.getFullYear() - d;
                yrArrObj.text = dt.getFullYear() - d;
                yrArrObj.number = (dt.getFullYear() - d).toString().substr(-2);
                yearArr.push(yrArrObj);
            }
            return yearArr;
        };
        CommonService.isCurrentFinancialYear = function (year) {
            let dt = new Date();
            let curMonth = dt.getMonth();
            let fiscalYr;
            if (curMonth > 3) { //
                let nextYr1 = (dt.getFullYear() + 1).toString();
                fiscalYr = dt.getFullYear().toString() + "-" + nextYr1;
            } else {
                let nextYr2 = dt.getFullYear().toString();
                fiscalYr = (dt.getFullYear() - 1).toString() + "-" + nextYr2;
            }
            return fiscalYr === year;
        };
        CommonService.getPastFinancialList = function (num) {
            let yearArr = [];
            let dt = new Date();
            let curMonth = dt.getMonth();
            for (let d = 0; d < num; d++) {
                let value;
                let label;
                if (curMonth > 3) {
                    let nextYr1 = (dt.getFullYear() - d + 1).toString();
                    label = "FY " + (dt.getFullYear() - d).toString() + "-" + nextYr1.charAt(2) + nextYr1.charAt(3);
                    value = (dt.getFullYear() - d).toString() + "-" + nextYr1;
                } else {
                    let nextYr2 = dt.getFullYear() - d.toString();
                    label = "FY " + (dt.getFullYear() - d - 1).toString() + "-" + nextYr2.charAt(2) + nextYr2.charAt(3);
                    value = (dt.getFullYear() - d - 1).toString() + "-" + nextYr2;
                }
                let yrArrObj = {};
                yrArrObj.value = value;
                yrArrObj.label = label;
                yearArr.push(yrArrObj);
            }
            return yearArr;
        };
        CommonService.getLastFiveYearWithLabel = function () {
            let yearArr = [];
            for (let d = 0; d < 5; d++) {
                let yrArrObj = {value: ''};
                let dt = new Date();
                let currYr = dt.getFullYear();
                let val = dt.getFullYear() - d;
                yrArrObj.value = val.toString();
                yrArrObj.label = "FY " + yrArrObj.value.toString();
                yearArr.push(yrArrObj);
            }
            return yearArr;
        };
        CommonService.getMonthNameByNumber = function (monthCode) {
            return moment(monthCode, 'MM').format('MMM');
        };
        CommonService.getLastDayOfMonth = function (year, month) {
            let lastDay;
            let date = new Date();
            lastDay = new Date(year, month + 1, 0);
            return lastDay.getFullYear() + "-" + (lastDay.getMonth() + 1) + "-" + lastDay.getDate();
        };
        CommonService.getFirstDayOfMonth = function (year, month) {
            let firstDay;
            let date = new Date();
            firstDay = new Date(year, month, 1);
            return firstDay.getFullYear() + "-" + (firstDay.getMonth() + 1) + "-" + firstDay.getDate();
        };
        CommonService.getRowExpandedStatus = function (item, arr) {
            var parentRow;
            for (var i = 0; i < arr.length; i++) {
                if (item.ParentRow === arr[i].RowNo) {
                    parentRow = arr[i];
                    break;
                }
            }
            if (parentRow && item.RowNo && item.RowNo.indexOf('.') >= 0) {
                return parentRow.isExpanded;
            }
            return true;
        };
        CommonService.getRowHasChild = function (item, arr) {
            var hasChild = false;
            for (var i = 0; i < arr.length; i++) {
                if (item.RowNo === arr[i].ParentRow && item.ParentRow === '0') {
                    return true;
                }
            }
            return hasChild;
        };
        CommonService.decimalAndCommaFilter = function (value, decimal) {
            if (value !== 0 && value !== '' && value !== null) {
                let valueStr = value.toString();
                let val = parseFloat(valueStr);
                let vl = val.toFixed(decimal);
                return vl.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else {
                return "-";
            }
        };
        CommonService.numberDecimalAndCommaFilter = function (value, decimal) {
            if (value !== 0 && value !== '' && value !== null) {
                let valueStr = value.toString();
                let val = parseFloat(valueStr);
                let vl = val.toFixed(decimal);
                return vl.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            return "-";
        };
        CommonService.numberToPerc = function (num, dim) {
            if (dim !== 0 && angular.isDefined(dim)) {
                return ((num / dim) * 100).toFixed(2);
            }else{
                return "-"
            }
        };
        CommonService.onYearChange = function (year, lastClosedMonth) {
            let dd = new Date();
            let yy = dd.getFullYear();
            let cm = dd.getMonth();
            let mm = lastClosedMonth;
            let newMonthArr = [];
            let result = {
                year: '',
                month: '',
                monthArr: null
            };
            if (yy === year) {
                for (let i = 0; i < mm; i++) {
                    newMonthArr.push(monthMasterArr[i]);
                }
                result.monthArr = newMonthArr;
                result.month = newMonthArr[mm - 1];
                result.year = year;
                return result;
            } else {
                newMonthArr = monthMasterArr;
                result.monthArr = newMonthArr;
                result.month = newMonthArr[cm];
                result.year = year;
                return result;
            }
        };
        return CommonService;
    }
})();

(function () {
    'use strict';
    angular.module('able.pages.onesta', [
        'able.pages.onesta.dashboard',
        'able.pages.onesta.correlation',
        'able.pages.onesta.dsr',
        'able.pages.onesta.foodCost',
        'able.pages.onesta.hrms',
        'able.pages.onesta.crm',
        'able.pages.onesta.gsi'
    ]);
})();

(function () {
    'use strict';
    angular.module('able.pages.constant', [])
        .constant("monthMasterArr", [
            {text: "Jan", value: 1, ticked: false},
            {text: "Feb", value: 2, ticked: false},
            {text: "Mar", value: 3, ticked: false},
            {text: "Apr", value: 4, ticked: false},
            {text: "May", value: 5, ticked: false},
            {text: "Jun", value: 6, ticked: false},
            {text: "Jul", value: 7, ticked: false},
            {text: "Aug", value: 8, ticked: false},
            {text: "Sep", value: 9, ticked: false},
            {text: "Oct", value: 10, ticked: false},
            {text: "Nov", value: 11, ticked: false},
            {text: "Dec", value: 12, ticked: false}
        ])
        .constant("monthTempArr", [
            {label: "Jan", value: '01'},
            {label: "Feb", value: '02'},
            {label: "Mar", value: '03'},
            {label: "Apr", value: '04'},
            {label: "May", value: '05'},
            {label: "Jun", value: '06'},
            {label: "Jul", value: '07'},
            {label: "Aug", value: '08'},
            {label: "Sep", value: '09'},
            {label: "Oct", value: '10'},
            {label: "Nov", value: '11'},
            {label: "Dec", value: '12'}
        ])
        .constant("criteriaOptions", [
            {value: 'RG', label: 'Region'},
            {value: 'CL', label: 'Cluster'},
            {value: 'ST', label: 'Store'},
            {value: 'CT', label: 'Financial Year'}
        ])

        .constant("typeOptions", [
            {value: 'CM', label: 'Company'},
            {value: 'RG', label: 'Region'},
            {value: 'ST', label: 'Store'},
            {value: 'CT', label: 'CITY'}
        ])

        .constant("basicCriteriaOptions", [
            {value: 'RG', label: 'Region'},
            {value: 'CL', label: 'Cluster'},
            {value: 'CT', label: 'City'},
            {value: 'ST', label: 'Store'}
        ])
        .constant("mtdYtdOptions", [
            {value: 'M', label: 'MTD'},
            {value: 'Y', label: 'YTD'}
        ])
        .constant("sessionOptions", [
            {label: "Lunch", value: "L"},
            {label: "Dinner", value: "D"}
        ])
        .constant("criteriaOption2", [
            {value: 'RR', label: 'Region'},
            {value: 'CT', label: 'City'},
            {value: 'ST', label: 'Store'},
            {value: 'TR', label: 'Tier'},
            {value: 'BL', label: 'Building'},
            {value: 'CL', label: 'Cluster'},
            {value: 'ML', label: 'Model'},
            {value: 'BL', label: 'Trade Area'},
            {value: 'VT', label: 'Vintage'},
            {value: 'LQ', label: 'Liquor'},
        ])
        .constant("basicCriteriaOptions2", [
            {value: 'RG', label: 'Region'},
            {value: 'CL', label: 'Cluster'},
            {value: 'ST', label: 'Store'}
        ])
        .constant("divideOptions", [
            {value: '1000', label: 'Thousand'},
            {value: '100000', label: 'Lakh'},
            {value: '1000000', label: 'Million'},
            {value: '10000000', label: 'Crore'},
            {value: '1', label: 'Actual'}
        ])
        .constant("sessionOptions", [
                {label: "Lunch", value: "L"},
                {label: "Dinner", value: "D"}
        ])
        .constant('layoutPaths', {
            images: {
                amMap: 'bower_components/amcharts/dist/amcharts/images/',
                amChart: 'bower_components/amcharts/dist/amcharts/images/'
            }
        })
        .constant('basic', {
            default: '#ffffff',
            defaultText: '#666666',
            border: '#dddddd',
            borderDark: '#aaaaaa',
        })
        .constant('colorScheme', {
            primary: '#434348',
            info: '#2959f7',
            success: '#58d051',
            warning: '#ffab0d',
            voilet: '#df12b8',
            danger: '#fd2020',
            zomatoRating: "#7cb5ec"
        });
})();

(function () {
    'use strict';
    angular.module('able.pages.onesta.correlation', [])
        .config(routeConfig)
        .controller('CorrelationOCtrl', CorrelationOCtrl);

    function CorrelationOCtrl($scope, CommonService, sessionOptions, mdToast, $filter, $rootScope, HttpService) {

        $scope.discretebaroptions = {
            chart: {
                type: 'multiBarChart',
                height: 450,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value + (1e-10);
                },
                color: (['#3f51b5', '#79d3fe']),
                showValues: true,
                duration: 500,
                stacked: false,
                showControls: false,
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
                            '<tr><td class="legend-color-guide"><strong>' + d.data.type + " " + d.data.label2 + '</strong> : ' + d.data.value + '</td></tr>' +
                            '<tr><td class="legend-color-guide">Outlets: <strong>' + d.data.outlets + '</strong></td></tr>' +
                            '</thead>';

                        str = str + '</table>';
                        return str;
                    }
                }
            }
        };
        $scope.discreteXSbaroptions = {
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
                    return d.value + (1e-10);
                },
                color: (['#3f51b5', '#79d3fe']),
                showValues: true,
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
                            '<tr><td class="legend-color-guide"><strong>' + d.data.type + " " + d.data.label2 + '</strong> : ' + d.data.value + '</td></tr>' +
                            '<tr><td class="legend-color-guide">Outlets: <strong>' + d.data.outlets + '</strong></td></tr>' +
                            '</thead>';

                        str = str + '</table>';
                        return str;
                    }
                }
            }
        };
        $scope.formatDate = function (strDate, formatStr) {
            return CommonService.formatDate(strDate, formatStr);
        };
        $scope.filterPercent = function (num, total) {
            return CommonService.formatDate(num, total);
        };

        function getDateNow(dayOffset) {
            return CommonService.getDateNow(dayOffset);
        }

        $scope.getCurDate = function (dayOffset) {
            return getDateNow(dayOffset);
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

        $scope.gridView = {
            show: false,
        };
        $scope.sessionOptions = sessionOptions;
        $scope.gridToggle = function () {
            $scope.gridView.show = !$scope.gridView.show;
        };
        $scope.filteredText = function (type) {
            if (!$scope.selectedFilter[type]) {
                return "All " + type;
            } else {
                if (type === "Session") {
                    return $filter('filter')($scope.sessionOptions, {value: $scope.selectedFilter.Session})[0].label;
                } else if (type === "Outlet") {
                    return $filter('filter')($scope.hierarchyMaster.Outlet, {OutletCode: $scope.selectedFilter.Outlet})[0].OutletName;
                }
                return $scope.selectedFilter[type] + " " + type;
            }
        };
        $scope.selectedFilter = {
            "City": null,
            "Cluster": null,
            "Outlet": null,
            "Region": null,
            "Session": null
        };

        $scope.selection = {
            type: "DATE",
        };
        $scope.businessTypeFilter = {
            value: 'Sale'
        };
        $scope.selectedFilter.curDate = getDateNow(-1);
        var fromdt = new Date();
        $scope.selectedFilter.fromDate = fromdt.getFullYear() + "-" + (fromdt.getMonth() + 1) + "-01";

        function filterReports() {
            var reportsData = new HttpService("BusinessSummary");
            var sessionType = $scope.selectedFilter.Session ? ($scope.selectedFilter.Session === "D" ? "DINNER" : "LUNCH") : "TOTAL";
            var postData = {
                "FromDate": $scope.selectedFilter.fromDate,
                "ToDate": $scope.selectedFilter.curDate,
                "Outlets": getOutletArr(),
                "RType": sessionType,
                "Range": 'Y',
                "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId),
                "SelectionType": $scope.selection.type
            };
            reportsData.post("", postData).then(function (data) {
                data.BusinessSummary = data.BusinessSummary.sort(compare);
                $scope.businessReportsDataObj = data.BusinessSummary;
                $scope.filterBusinessType();

            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });
        }

        let menu = CommonService.getCurrentMenu($rootScope.MenuList);
        $scope.itHasSingleRegion = false;
        $scope.onFilterChange = function (filterControl) {
            switch (filterControl) {
                case 'Region':
                    if ($scope.selectedFilter.Cluster) {
                        $scope.selectedFilter.Cluster = null;
                    }
                    if ($scope.selectedFilter.City) {
                        $scope.selectedFilter.City = null;
                    }
                    $scope.selectedFilter.Outlet = null;
                    break;
                case 'Cluster':
                    if ($scope.selectedFilter.Cluster) {
                        $scope.selectedFilter.City = null;
                    }
                    $scope.selectedFilter.Outlet = null;
                    break;
                case 'City':
                    if ($scope.selectedFilter.City) {
                        $scope.selectedFilter.Cluster = null;
                    }
                    $scope.selectedFilter.Outlet = null;
                    break;
                case 'tillDate':
                    onDateHierarchy();
                    break;
                case 'fromDate':
                    onDateHierarchy();
                    break;
            }
            $scope.filteredOutlets = $filter('filter')($scope.hierarchyMaster.Outlet, {
                RegionName: ($scope.selectedFilter.Region !== null ? $scope.selectedFilter.Region : undefined),
                CityName: ($scope.selectedFilter.City !== null ? $scope.selectedFilter.City : undefined),
                ClusterName: $scope.selectedFilter.Cluster !== null ? $scope.selectedFilter.Cluster : undefined
            }, true);
            if (angular.isDefined($scope.selectedFilter.Outlet) && $scope.selectedFilter.Outlet !== "" && $scope.selectedFilter.Outlet != null) {
                $scope.hasSelectedSingleOutlet = $scope.selectedFilter.Outlet.indexOf(',') === -1;
            } else {
                $scope.hasSelectedSingleOutlet = false;
            }
            filterReports();
        };
        Hierarchy();

        function Hierarchy() {
            $scope.hierarchyMaster = [];
            $scope.filteredOutlets = [];
            let currentDate2 = $scope.selectedFilter.fromDate;
            let currentDate = $scope.selectedFilter.curDate;
            CommonService.Hierarchy(currentDate, currentDate2, parseInt($rootScope.globals.currentUser.Userinfo.UserId), menu.MenuDesc).then(function (data) {
                $scope.hierarchyMaster = data;
                $scope.filteredOutlets = $filter('filter')($scope.hierarchyMaster.Outlet, {
                    RegionName: ($scope.selectedFilter.Region !== null ? $scope.selectedFilter.Region : undefined),
                    CityName: ($scope.selectedFilter.City !== null ? $scope.selectedFilter.City : undefined),
                    ClusterName: $scope.selectedFilter.Cluster !== null ? $scope.selectedFilter.Cluster : undefined
                }, true);
                $scope.onFilterChange();
            });
        }

        function onDateHierarchy() {
            let currentDate2 = $scope.selectedFilter.curDate;
            let currentDate = $scope.selectedFilter.curDate;
            CommonService.Hierarchy(currentDate, currentDate2, parseInt($rootScope.globals.currentUser.Userinfo.UserId), menu.MenuDesc).then(function (data) {
                $scope.hierarchyMaster = data;
                $scope.filteredOutlets = $filter('filter')($scope.hierarchyMaster.Outlet, {
                    RegionName: ($scope.selectedFilter.Region !== null ? $scope.selectedFilter.Region : undefined),
                    CityName: ($scope.selectedFilter.City !== null ? $scope.selectedFilter.City : undefined),
                    ClusterName: $scope.selectedFilter.Cluster !== null ? $scope.selectedFilter.Cluster : undefined
                }, true);
            });
        }

        function compare(a, b) {
            if (a.Years < b.Years)
                return -1;
            if (a.Years > b.Years)
                return 1;
            return 0;
        }

        $scope.filterBusinessType = function () {
            $scope.filteredbusinessReports = [];
            var typeFt = $scope.businessTypeFilter.value;
            var fdata = {
                key: "Business Data",
                values: []
            };
            for (var i = 0; i < $scope.businessReportsDataObj.length; i++) {
                if ($scope.businessReportsDataObj[i].RType === "Actual") {
                    if (typeFt === "APC") {
                        typeFt = "FoodAPC";
                    }
                    if (typeFt === "Turn") {
                        typeFt = "LunchTurn";
                    }
                    fdata.key = typeFt;
                    var yr = '';
                    if (typeFt === "TotalCover") {
                        yr = $scope.businessReportsDataObj[i].Years + "(in K )";
                    } else {
                        yr = $scope.businessReportsDataObj[i].Years;
                    }
                    fdata.values.push({
                        label: $scope.businessReportsDataObj[i].Years,
                        label2: yr,
                        value: $scope.businessReportsDataObj[i][typeFt],
                        type: typeFt,
                        outlets: $scope.businessReportsDataObj[i].Outlets
                    });
                }
            }
            $scope.discretebaroptions.chart.stacked = false;
            $scope.discretebaroptions.chart.showControls = false;
            $scope.discreteXSbaroptions.chart.stacked = false;
            $scope.discreteXSbaroptions.chart.showControls = false;
            $scope.filteredbusinessReports.push(fdata);
            typeFt = $scope.businessTypeFilter.value;
            if (typeFt === "APC" || typeFt === "Turn") {
                var sdata = {
                    key: "Business Data",
                    values: []
                };
                for (var i = 0; i < $scope.businessReportsDataObj.length; i++) {
                    if ($scope.businessReportsDataObj[i].RType === "Actual") {
                        if (typeFt === "APC") {
                            typeFt = "BevAPC";
                        }
                        if (typeFt === "Turn") {
                            typeFt = "DinnerTurn";
                        }
                        sdata.key = typeFt;
                        sdata.values.push({
                            label: $scope.businessReportsDataObj[i].Years,
                            label2: $scope.businessReportsDataObj[i].Years,
                            value: $scope.businessReportsDataObj[i][typeFt],
                            type: typeFt,
                            outlets: $scope.businessReportsDataObj[i].Outlets
                        });
                    }
                }
                $scope.filteredbusinessReports.push(sdata);
                $scope.discretebaroptions.chart.stacked = true;
                $scope.discretebaroptions.chart.showControls = true;
                $scope.discreteXSbaroptions.chart.stacked = true;
                $scope.discreteXSbaroptions.chart.showControls = true;
            }
            $scope.discretebaroptions.chart.xAxis.axisLabel = "Years";
            $scope.discreteXSbaroptions.chart.xAxis.axisLabel = "Years";
            $scope.discretebaroptions.chart.yAxis.axisLabel = $scope.businessTypeFilter.value;
            $scope.discreteXSbaroptions.chart.yAxis.axisLabel = $scope.businessTypeFilter.value;
        };
        let td = new Date();
        angular.element('#date1,#date2').bootstrapMaterialDatePicker({
            time: false,
            format: "YYYY-MM-DD",
            clearButton: false,
            maxDate: td
        });
    }

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('onestaBusinessReports', {
                url: "/onesta/reports",
                templateUrl: 'pages/onesta/correlation/correlation.html',
                controller: 'CorrelationOCtrl',
                resolve: {
                    deps: ['$$animateJs', '$ocLazyLoad', function ($$animateJs, $ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_form_elements_advance',
                            'lazy_nvd3_chart'

                        ], {serie: true});
                    }]
                }
            });
    }
})();

(function () {
    'use strict';
    angular.module('able.pages.onesta.crm', [])
        .config(routeConfig)
        .controller('CrmCtrl', CrmCtrl);

    function CrmCtrl($scope, $timeout, $interval, criteriaOptions, CommonService, mdToast, HttpService, $uibModal, $rootScope, $filter) {


    }

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('onestaCrm', {
                url: "/onesta/crm",
                controller: CrmCtrl,
                templateUrl: 'pages/onesta/crm/crm.html',
                resolve: {
                    deps: ['$$animateJs', '$ocLazyLoad', function ($$animateJs, $ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_form_elements_advance',
                            'lazy_nvd3_chart'

                        ], {serie: true});
                    }]
                }
            });
    }
})();

(function () {
    'use strict';
    angular.module('able.pages.onesta.dashboard', [])
        .config(routeConfig)
        .controller('DashboardOCtrl', DashboardOCtrl);

    function DashboardOCtrl($scope, $timeout, $interval, CommonService, AuthenticationService, mdToast, HttpService, $uibModal, $rootScope, $filter) {
        getDaySale();
        function getDaySale() {
            let userid = $rootScope.globals.currentUser.Userinfo.UserId;
            let apiKey = CommonService.getCompanyApikey();
            CommonService.TodaySale(userid, apiKey).then(function (response) {
                $rootScope.todaySaleData = response;
            });
        }
        $scope.hasSubMenuAccess = function (Menu, SubMenu, item) {
            let menuArr = $filter('filter')($rootScope.userPreference, {MenuDesc: Menu})[0];
            let subMenuArr = $filter('filter')(menuArr.ReportList, {Report: SubMenu})[0];
            let ReportObj = $filter('filter')(subMenuArr.Boxes, {BoxDesc: item})[0];
            return ReportObj.Value === true;
        };
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

        function getUserDetails() {
            let optionMenuArr = $filter('filter')($rootScope.userPreference, {MenuDesc: 'Option'})[0];
            let optionCurrencyArr = $filter('filter')(optionMenuArr.ReportList, {Report: 'Currency In'})[0];
            let optionSalesArr = $filter('filter')(optionMenuArr.ReportList, {Report: 'Sales In'})[0];
            let optionCoversArr = $filter('filter')(optionMenuArr.ReportList, {Report: 'Covers In'})[0];
            $rootScope.userSelectedCurrency = $filter('filter')(optionCurrencyArr.Boxes, {Value: true})[0].BoxDesc;
            $rootScope.userSelectedSales = $filter('filter')(optionSalesArr.Boxes, {Value: true})[0].BoxDesc;
            $rootScope.userSelectedCovers = $filter('filter')(optionCoversArr.Boxes, {Value: true})[0].BoxDesc;
        }

        let summaryRegionSaleModal;
        $scope.getRegionSummarySale = function (value) {
            $scope.detailedModalTitle = value;
            getRegionSummarySale(value);
            summaryRegionSaleModal = $uibModal.open({
                animation: true,
                templateUrl: 'views/popup/summary-sale-modal.html',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                scope: $scope
            });
        };

        function getRegionSummarySale(filterBy) {
            $scope.summaryRegionSaleData = undefined;
            let todayData = new HttpService("SummaryRegionSale");
            let postData = {
                "CurrentDate": $scope.selectedFilter.curDate,
                "Outlets": getOutletArr(true),
                "Range": "S",
                "Session": "",
                "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
            };
            if (filterBy === 'Sales')
                postData.Range = 'S';
            if (filterBy === 'Covers')
                postData.Range = 'C';
            if (filterBy === 'APC')
                postData.Range = 'A';

            todayData.post("", postData).then(function (data) {
                if (filterBy === 'Sales')
                    $scope.summaryRegionSaleData = data.SaleList;
                if (filterBy === 'Covers')
                    $scope.summaryRegionSaleData = data.CoverList;
                if (filterBy === 'APC')
                    $scope.summaryRegionSaleData = data.APCList;
            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });
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
                color: ['#2ca02c'],
                showLegend: false,
                showValues: true,
                x: function (d, i) {
                    return i
                },
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function (d) {
                        let dx = $scope.criteriaFilteredData[0].values[d] && $scope.criteriaFilteredData[0].values[d].x || 0;
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
                        let str = '<table>' +
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
                color: ['#2ca02c'],
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
                        let dx = $scope.criteriaFilteredData[0].values[d] && $scope.criteriaFilteredData[0].values[d].x || 0;
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
                        let str = '<table>' +
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
                        let str = '<table>' +
                            '<thead>' +
                            '<tr><td class="legend-color-guide">' + d.data.key + '<strong> : ' + d.data.value + '</strong></td></tr>' +
                            '</thead>';

                        str = str + '</table>';
                        return str;
                    }
                }
            }
        };
        let mutliBarHorizontalOpions = {
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
                    return d3.format('.2f')(d);
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
                        let str = '<table>' +
                            '<thead>' +
                            '<tr><td class="legend-color-guide">' + d.data.key + '<strong> : ' + d.data.value + '</strong></td></tr>' +
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

        function setFilterAccess(data) {
            if (data.Region.length === 1) {
                $scope.itHasSingleRegion = true;
                if (data.Cluster.length === 1) {
                    $scope.criteriaFilter.value = "STORE";
                    $scope.itHasSingleCluster = true;
                } else {
                    $scope.criteriaFilter.value = "CLUSTER";
                    $scope.itHasSingleCluster = false;
                }
            } else {
                $scope.criteriaFilter.value = "REGION";
                $scope.itHasSingleRegion = false;
            }
        }

        function getDateNow(dayOffset) {
            return CommonService.getDateNow(dayOffset);
        }

        $scope.getCurDate = function (dayOffset) {
            return getDateNow(dayOffset);
        };
        $scope.subCriteriaFilterOptions = [
            {value: 'MTD_Sale', label: 'MTD Sale'},
            {value: 'YTD_Sale', label: 'YTD Sale'},
            {value: 'MTD_Cover', label: 'MTD Cover'},
            {value: 'YTD_Cover', label: 'YTD Cover'}
        ];
        $scope.sessionOptions = [
            {label: "Lunch", value: "L"},
            {label: "Dinner", value: "D"}
        ];
        $scope.hierarchyMaster = [];
        $scope.subCriteriaFilter = {
            value: 'MTD_Sale'
        };
        $scope.selectedFilter = {
            "City": null,
            "Cluster": null,
            "Outlet": null,
            "Region": null,
            "Session": null
        };
        $scope.criteriaOptions = [
            {value: 'STORE', label: 'Store'},
            {value: 'BUILDING', label: 'Buidling'},
            {value: 'CITY', label: 'City'},
            {value: 'CLUSTER', label: 'Cluster'},
            {value: 'MODEL', label: 'Modal'},
            {value: 'REGION', label: 'Region'},
            {value: 'TIER', label: 'Tier'},
            {value: 'TRADEAREA', label: 'Trade Area'},
            {value: 'VINTAGE', label: 'Vintage'},
            {value: 'LIQUOR', label: 'Liquor'}
        ];
        $scope.criteriaFilter = {
            value: ""
        };
        $scope.corelationFilter = {
            value: 'D'
        };
        $scope.criteriaFilter = {
            value: ""
        };
        $scope.selection = {
            type: "DAY"
        };
        $scope.gridView = {
            show: true,
        };
        $scope.gridToggle = function () {
            $scope.gridView.show = !$scope.gridView.show;
        };
        $scope.selectedFilter.curDate = getDateNow(-1);
        $scope.formatDate = function (strDate, formatStr) {
            return CommonService.formatDate(strDate, formatStr);
        };
        $scope.filterPercent = function (num, total) {
            return CommonService.formatDate(num, total);
        };
        $scope.filteredText = function (type) {
            if (!$scope.selectedFilter[type]) {
                return "All " + type;
            } else {
                if (type === "Session") {
                    return $filter('filter')($scope.sessionOptions, {value: $scope.selectedFilter.Session})[0].label;
                } else if (type === "Outlet") {
                    return $filter('filter')($scope.hierarchyMaster.Outlet, {OutletCode: $scope.selectedFilter.Outlet})[0].OutletName;
                }
                return $scope.selectedFilter[type] + " " + type;
            }
        };
        $scope.corelationOptions = [
            {value: 'D', label: $scope.formatDate($scope.selectedFilter.curDate, 'dd MMM yyyy')},
            {value: 'W', label: 'Last 7 Days'},
            {value: 'M', label: 'Month Till Date'},
            {value: 'Y', label: 'Year Till Date'}
        ];


        $scope.itHasSingleRegion = false;
        $scope.onFilterChange = function (filterControl) {
            switch (filterControl) {
                case 'Region':
                    if ($scope.selectedFilter.Cluster) {
                        $scope.selectedFilter.Cluster = null;
                    }
                    if ($scope.selectedFilter.City) {
                        $scope.selectedFilter.City = null;
                    }
                    $scope.selectedFilter.Outlet = null;
                    break;
                case 'Cluster':
                    if ($scope.selectedFilter.Cluster) {
                        $scope.selectedFilter.City = null;
                    }
                    $scope.selectedFilter.Outlet = null;
                    break;
                case 'City':
                    if ($scope.selectedFilter.City) {
                        $scope.selectedFilter.Cluster = null;
                    }
                    $scope.selectedFilter.Outlet = null;
                    break;
                case 'tillDate':
                    onDateHierarchy();
                    break;
                case 'fromDate':
                    onDateHierarchy();
                    break;
            }
            $scope.filteredOutlets = $filter('filter')($scope.hierarchyMaster.Outlet, {
                RegionName: ($scope.selectedFilter.Region !== null ? $scope.selectedFilter.Region : undefined),
                CityName: ($scope.selectedFilter.City !== null ? $scope.selectedFilter.City : undefined),
                ClusterName: $scope.selectedFilter.Cluster !== null ? $scope.selectedFilter.Cluster : undefined
            }, true);
            if (angular.isDefined($scope.selectedFilter.Outlet) && $scope.selectedFilter.Outlet !== "" && $scope.selectedFilter.Outlet != null) {
                $scope.hasSelectedSingleOutlet = $scope.selectedFilter.Outlet.indexOf(',') === -1;
            } else {
                $scope.hasSelectedSingleOutlet = false;
            }
            filterSalesSummary();
            filterActualVsTarget();
            $scope.filterCommonPie();
            $scope.filterSalesByCriteria();
        };
        Hierarchy();

        function Hierarchy() {
            $scope.hierarchyMaster = [];
            $scope.filteredOutlets = [];
            let currentDate2 = $scope.selectedFilter.curDate;
            let currentDate = $scope.selectedFilter.curDate;
            let userid = $rootScope.globals.currentUser.Userinfo.UserId;
            let company = $rootScope.globals.selectedCompany;
            AuthenticationService.fetchMenu(userid, company.CompanyId).then(function (response) {
                $scope.menu = CommonService.getCurrentMenu($rootScope.MenuList);
                CommonService.Hierarchy(currentDate, currentDate2, parseInt($rootScope.globals.currentUser.Userinfo.UserId), $scope.menu.MenuDesc).then(function (data) {
                    $scope.hierarchyMaster = data;
                    $scope.filteredOutlets = $filter('filter')($scope.hierarchyMaster.Outlet, {
                        RegionName: ($scope.selectedFilter.Region !== null ? $scope.selectedFilter.Region : undefined),
                        CityName: ($scope.selectedFilter.City !== null ? $scope.selectedFilter.City : undefined),
                        ClusterName: $scope.selectedFilter.Cluster !== null ? $scope.selectedFilter.Cluster : undefined
                    }, true);
                    setFilterAccess(data);
                    $scope.onFilterChange();
                });
            });
        }

        function onDateHierarchy() {
            let currentDate2 = $scope.selectedFilter.curDate;
            let currentDate = $scope.selectedFilter.curDate;
            CommonService.Hierarchy(currentDate, currentDate2, parseInt($rootScope.globals.currentUser.Userinfo.UserId), $scope.menu.MenuDesc).then(function (data) {
                $scope.hierarchyMaster = data;
                $scope.filteredOutlets = $filter('filter')($scope.hierarchyMaster.Outlet, {
                    RegionName: ($scope.selectedFilter.Region !== null ? $scope.selectedFilter.Region : undefined),
                    CityName: ($scope.selectedFilter.City !== null ? $scope.selectedFilter.City : undefined),
                    ClusterName: $scope.selectedFilter.Cluster !== null ? $scope.selectedFilter.Cluster : undefined
                }, true);
                setFilterAccess(data);
            });
        }

        $scope.filterCommonPie = function () {
            $scope.pieDataObj = undefined;
            $scope.pieTenderData = undefined;
            let pieSummary = new HttpService("SummaryPieChart");
            let postData = {
                "CurrentDate": $scope.selectedFilter.curDate,
                "Outlets": getOutletArr(),
                "Range": $scope.corelationFilter.value,
                "Session": $scope.selectedFilter.Session,
                "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
            };
            pieSummary.post("", postData).then(function (data) {
                $scope.pieDataObj = data;
                $scope.pieTenderData = data.TenderList.slice(0, 5);
            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });
        };
        $scope.filterSubCriteria = function () {
            if ($scope.criteriaFilter.value === 'CITY' || $scope.criteriaFilter.value === 'CLUSTER') {
                $scope.barXSoptions.chart.height = 2500;
                $scope.barXSoptions.chart.margin.left = 100;
            } else if ($scope.criteriaFilter.value === 'STORE') {
                $scope.barXSoptions.chart.height = 4500;
                $scope.barXSoptions.chart.margin.left = 180;
            } else {
                $scope.barXSoptions.chart.height = 500;
                $scope.barXSoptions.chart.margin.left = 100;
            }
            $scope.baroptions.chart.xAxis.axisLabel = $scope.criteriaFilter.value;
            //bar chart
            let firstBarData = {
                key: $scope.criteriaFilter.value,
                "bar": true,
                values: []
            };
            let lineData = {
                "key": "Line",
                "values": [],
                "remove": true
            };
            let criteriaFilteredData = [];
            criteriaFilteredData = $scope.criteriaSalesData;
            for (let i = 0; i < criteriaFilteredData.length; i++) {
                if (criteriaFilteredData[i].RType !== 'Total') {
                    firstBarData.values[i] = {};
                    firstBarData.values[i].label = criteriaFilteredData[i].RType;
                    firstBarData.values[i].value = criteriaFilteredData[i][$scope.subCriteriaFilter.value];
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
        $scope.filterSalesByCriteria = function () {
            $scope.selectedCriteria = $scope.criteriaFilter.value;
            $scope.criteriaSalesData = undefined;
            $scope.criteriaFilteredData = undefined;
            let salesCriteria = new HttpService("SaleDashboard");
            let postData = {
                "CurrentDate": $scope.selectedFilter.curDate,
                "Outlets": getOutletArr(),
                "RType": $scope.criteriaFilter.value,
                "Session": $scope.selectedFilter.Session,
                "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
            };
            salesCriteria.post("", postData).then(function (data) {
                $scope.criteriaSalesData = data.SaleList;
                $scope.filterSubCriteria();
            }, function (e) {
                displayToast("error", 'Error fetching filtered data!.Try Again!')
            });
        };

        function getOutletArr(allOutlets) {
            let arr = [];
            let filteredArr = [];
            if ($scope.selectedFilter.Outlet) {
                return $scope.selectedFilter.Outlet;
            }
            filteredArr = $scope.selectedFilter.Region ? $scope.filteredOutlets : [];

            for (let i = 0; i < filteredArr.length; i++) {
                arr.push(filteredArr[i].OutletCode);
            }
            return arr.toString();
        }

        if (angular.isDefined($scope.selectedFilter.Outlet) && $scope.selectedFilter.Outlet !== "" && $scope.selectedFilter.Outlet != null) {
            $scope.hasSelectedSingleOutlet = $scope.selectedFilter.Outlet.indexOf(',') === -1;
        } else {
            $scope.hasSelectedSingleOutlet = false;
        }

        function filterSalesSummary() {
            let paramType = 'CM';
            if ($scope.selectedFilter.Region !== "" && $scope.selectedFilter.Outlet === "") {
                paramType = 'RG';
                if ($scope.selectedFilter.Cluster !== "" || $scope.selectedFilter.City !== "") {
                    paramType = 'CL';
                    if ($scope.selectedFilter.Outlet !== "" || $scope.selectedFilter.Session !== "") {
                        paramType = 'ST';
                    }
                }
            } else if ($scope.selectedFilter.Outlet !== "") {
                paramType = 'ST';
            } else {
                paramType = 'CM';
            }

            let summaryData = new HttpService("SummaryReport");
            let dailySaleSummaryData = new HttpService("DailySaleReportSummary");
            let filterSession = "";
            if ($scope.selectedFilter.Session === 'L') {
                filterSession = 1;
            } else if ($scope.selectedFilter.Session === 'D') {
                filterSession = 2;
            }

            let postData = {
                "CurrentDate": $scope.selectedFilter.curDate,
                "Outlets": getOutletArr(),
                "Session": filterSession,
                "ParamType": paramType,
                "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
            };
            let dsrPostData = {
                "CurrentDate": $scope.selectedFilter.curDate,
                "RType": "HH",
                "Outlets": getOutletArr(),
                "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
            };
            dailySaleSummaryData.post("", dsrPostData).then(function (data) {
                $scope.dsrSummaryData = data;
            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });

            summaryData.post("", postData).then(function (data) {
                $scope.summaryDataObj = data;
            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });
        }

        function filterActualVsTarget() {
            let monthlySummary = new HttpService("MonthlySummary");
            let postData = {
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
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });
        }

        let td = new Date();
        td.setDate(td.getDate() - 1);
        angular.element('#date').bootstrapMaterialDatePicker({
            time: false,
            format: "YYYY-MM-DD",
            clearButton: false,
            maxDate: td
        });
    }

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('onestaDashboard', {
                url: '/onesta/dashboard',
                controller: DashboardOCtrl,
                templateUrl: 'pages/onesta/dashboard/dashboard.html',
                resolve: {
                    deps: ['$$animateJs', '$ocLazyLoad', function ($$animateJs, $ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_form_elements_advance',
                            'lazy_counter',
                            'lazy_c3_chart',
                            'lazy_nvd3_chart'

                        ], {serie: true});
                    }]
                }
            });
    }
})();

(function () {
    'use strict';
    angular.module('able.pages.onesta.dsr', [])
        .config(routeConfig)
        .controller('DsrCtrl', DsrCtrl);

    function DsrCtrl($scope, $timeout, $interval, basic, colorScheme, layoutPaths, sessionOptions, CommonService, mdToast, HttpService, $uibModal, $rootScope, $filter) {
        function getDateNow(dayOffset) {
            return CommonService.getDateNow(dayOffset);
        }

        var layoutColors = {
            default: basic.default,
            defaultText: basic.defaultText,
            border: basic.border,
            borderDark: basic.borderDark,
            primary: colorScheme.primary,
            info: colorScheme.info,
            voilet: colorScheme.voilet,
            success: colorScheme.success,
            warning: colorScheme.warning,
            danger: colorScheme.danger
        };
        $scope.trendGraphOptions = {
            data: [],
            type: "serial",
            theme: 'black',
            categoryField: "Label",
            rotate: false,
            titles: [],
            startDuration: 0,
            startEffect: 'easeInSine',
            startRadius: 0,
            startAlpha: 0,
            precision: -1,
            color: layoutColors.defaultText,
            pathToImages: layoutPaths.images.amChart,
            valueAxes: [{
                color: layoutColors.defaultText,
                axisColor: layoutColors.defaultText,
                gridColor: layoutColors.defaultText,
                id: "v1",
                title: "",
                inside: false,
                position: "left",
                autoGridCount: false,
                axisAlpha: 0.5
            }, {
                color: layoutColors.defaultText,
                axisColor: layoutColors.defaultText,
                gridColor: layoutColors.defaultText,
                id: "v2",
                title: "Budget",
                position: "right",
                autoGridCount: false
            }],
            graphs: [{
                id: "g2",
                valueAxis: "v1",
                bullet: "square",
                bulletBorderAlpha: 1,
                bulletColor: '#f4d03f',
                dashLengthField: "dashLength",
                labelText: "[[Value]]",
                legendPeriodValueText: "",
                legendValueText: "[[Value]]",
                labelFunction: function (item, label) {
                    return label === "0" ? "" : label;
                },
                color: '#373a3c',
                bulletSize: 7,
                bulletOffset: 2,
                bulletSizeField: "",
                hideBulletsCount: 50,
                lineThickness: 2,
                lineColor: '#f4d03f',
                type: "smoothedLine",
                title: "",
                useLineColorForBulletBorder: true,
                valueField: "Value",
                lineAlpha: 1,
                fillAlphas: 0,
                xField: "x",
                yField: "y",
                balloonText: "<strong><i class='far fa-calendar-alt fa-lg'></i> [[Label]]</strong><br/><span>[[title]] : </span><b>[[Value]]</b>",
            }, {
                title: "Budget",
                valueField: "SaleTarget",
                id: "g1",
                legendPeriodValueText: "Value",
                color: layoutColors.defaultText,
                valueAxis: "v1",
                lineColor: '#01c0c8',
                fillColors: '#01c0c8',
                fillAlphas: 0.8,
                lineAlpha: 0.8,
                type: "column",
                clustered: false,
                columnWidth: 0.5,
                lineColorField: layoutColors.defaultText,
                legendValueText: "[[SaleTarget]]",
                balloonText: "<strong><i class='far fa-calendar-alt fa-lg'></i> [[Label]]</strong><br/><span>[[title]] : </span><b>[[SaleTarget]]</b>"
            }],
            chartCursor: {
                pan: true,
                cursorColor: "#e21307",
                valueLineEnabled: true,
                valueLineBalloonEnabled: false,
                cursorAlpha: 0.1,
                valueLineAlpha: 0.1,
                zoomable: false,
                categoryBalloonDateFormat: "DD",
                fullWidth: false,
                valueBalloonsEnabled: false
            },
            legend: {
                enabled: true,
                useGraphSettings: true,
                position: "top",
                color: layoutColors.defaultText,
                equalWidths: false,
                valueAlign: "left",
                valueWidth: 120
            },
            balloon: {
                borderThickness: 0.5,
                shadowAlpha: 0
            },
            categoryAxis: {
                gridPosition: "start",
                parseDates: false,
                axisColor: layoutColors.defaultText,
                color: layoutColors.defaultText,
                gridColor: layoutColors.defaultText,
                parselabels: false,
                dashLength: 0.5,
                minorGridEnabled: true
            }
        };
        $scope.gridView = {
            show: true,
        };

        $scope.viewType = 'D';
        $scope.gridToggle = function () {
            $scope.gridView.show = !$scope.gridView.show;
        };
        $scope.getCurDate = function (dayOffset) {
            return getDateNow(dayOffset);
        };
        $scope.filterPercent = function (num, total) {
            return CommonService.filterPercent(num, total);
        };
        $scope.destroyDatePicker = function () {
            // $('#fromDate').bootstrapMaterialDatePicker('destroy');
            // $('#toDate').bootstrapMaterialDatePicker('destroy');
        };
        $scope.initializeDatePicker = function (fyYear) {
            $('#fromDate ,#toDate').bootstrapMaterialDatePicker({
                time: false,
                format: "YYYY-MM-DD",
                clearButton: false
            });
            let dateArr = fyYear.split('-');
            let dt = new Date();
            let fd, fd2, td, td2;
            if (CommonService.isCurrentFinancialYear($scope.selectedFilter.FYear.value)) {
                fd = new Date(dateArr[0] + "-" + "04" + "-" + '01');
                fd2 = new Date(dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + (dt.getDate()));
                td = new Date(dateArr[0] + "-" + "04" + "-" + '01');
                td2 = new Date(dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + (dt.getDate()));
                $('#fromDate').bootstrapMaterialDatePicker('setMinDate', fd);
                $('#fromDate').bootstrapMaterialDatePicker('setMaxDate', fd2);
                $('#toDate').bootstrapMaterialDatePicker('setMinDate', td);
                $('#toDate').bootstrapMaterialDatePicker('setMaxDate', td2);

            } else {
                fd = new Date(dateArr[0] + "-" + "04" + "-" + '01');
                fd2 = new Date(dateArr[1] + "-" + "04" + "-" + "30");
                td = new Date(dateArr[0] + "-" + "04" + "-" + '01');
                td2 = new Date(dateArr[1] + "-" + "04" + "-" + "30");
                $('#fromDate').bootstrapMaterialDatePicker('setMinDate', fd);
                $('#fromDate').bootstrapMaterialDatePicker('setMaxDate', fd2);
                $('#toDate').bootstrapMaterialDatePicker('setMinDate', td);
                $('#toDate').bootstrapMaterialDatePicker('setMaxDate', td2);
            }
        };
        $scope.filteredText = function (type) {
            if (!$scope.selectedFilter[type]) {
                return "All " + type;
            } else {
                if (type === "Session") {
                    return $filter('filter')($scope.sessionOptions, {value: $scope.selectedFilter.Session})[0].label;
                } else if (type === "Outlet") {
                    return $filter('filter')($scope.hierarchyMaster.Outlet, {OutletCode: $scope.selectedFilter.Outlet})[0].OutletName;
                }
                return $scope.selectedFilter[type] + " " + type;
            }
        };
        $scope.hierarchyMaster = [];
        $scope.selectedFilter = {
            "fromDate": '',
            "curDate": '',
            "City": null,
            "Cluster": null,
            "Outlet": null,
            "Region": null,
            "Session": null,
            "FYear": {value: ''},
            "RType": {value: ''},
            "SType": {value: 'D'},
            "Category": {value: 'FS'}
        };

        $scope.selectedFilterOptions = [
            {value: 'RG', label: 'Region'},
            {value: 'CT', label: 'City'},
            {value: 'ST', label: 'Store'},
            {value: 'TR', label: 'Tier'},
            {value: 'BL', label: 'Building'},
            {value: 'CL', label: 'Cluster'},
            {value: 'ML', label: 'Model'},
            {value: 'TA', label: 'Trade Area'},
            {value: 'VT', label: 'Vintage'},
            {value: 'LQ', label: 'Liquor'}
        ];

        function setFilterAccess(data) {
            if (data.Region.length === 1) {
                $scope.itHasSingleRegion = true;
                if (data.Cluster.length === 1) {
                    $scope.selectedFilter.RType.value = "ST";
                    $scope.itHasSingleCluster = true;
                } else {
                    $scope.selectedFilter.RType.value = "CL";
                    $scope.itHasSingleCluster = false;
                }
            } else {
                $scope.selectedFilter.RType.value = "RG";
                $scope.itHasSingleRegion = false;
            }
        }

        function getOutletArr(allOutlets) {
            let arr = [];
            let filteredArr = [];
            if ($scope.selectedFilter.Outlet) {
                return $scope.selectedFilter.Outlet;
            }
            filteredArr = $scope.selectedFilter.Region ? $scope.filteredOutlets : [];

            for (let i = 0; i < filteredArr.length; i++) {
                arr.push(filteredArr[i].OutletCode);
            }
            return arr.toString();
        }

        $scope.sessionOptions = [{label: 'DATE', value: 'DATE'}, {label: 'DAY', value: 'DAY'}];
        $scope.dayMtdOptions = [{label: 'Daily', value: 'D'}, {label: 'MTD', value: 'M'}];
        $scope.categoryOption = [
            {label: 'Food Sale', value: 'FS'},
            {label: 'Beverage Sale', value: 'BS'},
            {label: 'Cover', value: 'C'},
            {label: 'APC', value: 'A'},
            {label: 'Total Sale', value: 'TS'}];
        $scope.selectedCriteria = 'Food Sale';
        $scope.selection = {
            type: {value: 'DAY'}
        };
        $scope.showSSCG = {
            checked: true
        };
        $scope.showSSCG.checked = $rootScope.globals.currentUser.Userinfo.UserId === '504' ? true : true;
        $scope.fYearOption = CommonService.getPastFinancialList(3);
        $scope.selectedFilter.FYear.value = $scope.fYearOption[0].value;
        let dateArr = $scope.selectedFilter.FYear.value.split('-');
        let dt = new Date();
        $scope.selectedFilter.fromDate = dateArr[0] + "-" + (dt.getMonth() + 1) + "-" + '01';
        $scope.selectedFilter.curDate = getDateNow(-1);
        $scope.initializeDatePicker($scope.selectedFilter.FYear.value);
        $scope.formatDate = function (strDate, formatStr) {
            return CommonService.formatDate(strDate, formatStr);
        };
        let menu = CommonService.getCurrentMenu($rootScope.MenuList);
        $scope.itHasSingleRegion = false;
        $scope.onFilterChange = function (filterControl) {
            if (filterControl === 'Region') {
                if ($scope.selectedFilter.Cluster) {
                    $scope.selectedFilter.Cluster = null;
                }
                if ($scope.selectedFilter.City) {
                    $scope.selectedFilter.City = null;
                }
                $scope.selectedFilter.Outlet = null;
            } else if (filterControl === 'Cluster') {
                if ($scope.selectedFilter.Cluster) {
                    $scope.selectedFilter.City = null;
                }
                $scope.selectedFilter.Outlet = null;
            } else if (filterControl === 'City') {
                if ($scope.selectedFilter.City) {
                    $scope.selectedFilter.Cluster = null;
                }
                $scope.selectedFilter.Outlet = null;
            } else if (filterControl === 'tillDate') {
                onDateHierarchy();
            }
            $scope.filteredOutlets = $filter('filter')($scope.hierarchyMaster.Outlet, {
                RegionName: ($scope.selectedFilter.Region !== null ? $scope.selectedFilter.Region : undefined),
                CityName: ($scope.selectedFilter.City !== null ? $scope.selectedFilter.City : undefined),
                ClusterName: $scope.selectedFilter.Cluster !== null ? $scope.selectedFilter.Cluster : undefined
            }, true);
            if (angular.isDefined($scope.selectedFilter.Outlet) && $scope.selectedFilter.Outlet !== "" && $scope.selectedFilter.Outlet != null) {
                $scope.hasSelectedSingleOutlet = $scope.selectedFilter.Outlet.indexOf(',') === -1;
            } else {
                $scope.hasSelectedSingleOutlet = false;
            }
            $scope.dsrReport(filterControl);
        };

        function ifLastDate(selectedDate) {
            $scope.ifItsLastDate = false;
            let dateArr = selectedDate.split("-");
            let dateStr = dateArr[0] + "-" + dateArr[1] + "-" + dateArr[1];
            let date = new Date(dateStr);
            let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            let mm = (lastDay.getMonth() + 1) < 10 ? '0' + (lastDay.getMonth() + 1) : (lastDay.getMonth() + 1);
            let lastDayWithSlashes = lastDay.getFullYear() + '-' + mm + '-' + (lastDay.getDate());
            if (selectedDate === lastDayWithSlashes) {
                $scope.ifItsLastDate = true;
                $scope.selection.type.value = "DATE";
            }
        };

        $scope.dsrReport = function (filterControl) {
            switch ($scope.viewType) {
                case 'DD':
                    $scope.filterDsrDetailedData(filterControl);
                    break;
                default:
                    $scope.filterDSRReports(filterControl);
                    break;
            }
        };

        $scope.filterDSRReports = function (filterControl) {
            if (filterControl === 'FYear') {
                let dateArr = $scope.selectedFilter.FYear.value.split('-');
                let myDate = new Date();
                if (CommonService.isCurrentFinancialYear($scope.selectedFilter.FYear.value)) {
                    $scope.selectedFilter.fromDate = dateArr[0] + "-" + myDate.getMonth() + "-" + '01';
                    $scope.selectedFilter.curDate = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + (myDate.getDate() - 1);
                } else {
                    $scope.selectedFilter.fromDate = dateArr[0] + "-" + "04" + "-" + '01';
                    $scope.selectedFilter.curDate = dateArr[0] + "-" + "04" + "-" + '30';
                }
                $scope.initializeDatePicker($scope.selectedFilter.FYear.value);
            }
            ifLastDate($scope.selectedFilter.curDate);
            $scope.dsrData = null;
            let reportsData = new HttpService("DailySaleReport");
            let postData = {
                // "FromDT": $scope.selectedFilter.fromDate,
                "CurrentDate": $scope.selectedFilter.curDate,
                "Outlets": getOutletArr(),
                "RType": $scope.selectedFilter.RType.value,
                "SumRType": "",
                "Criteria": "",
                "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId),
                "SelectionType": $scope.selection.type.value
            };
            reportsData.post("", postData).then(function (data) {
                $scope.dsrData = data;
            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });
        };
        $scope.detailedDsrData = null;
        let tableFloat, tableFloatXs;
        $scope.filterDsrDetailedData = function () {
            $scope.detailedDsrData = null;
            $scope.dsrStoreWiseModalData = null;
            let reportsData = new HttpService("APC");
            let postData = {
                "FromDate": $scope.selectedFilter.fromDate,
                "ToDate": $scope.selectedFilter.curDate,
                "Outlet": getOutletArr(),
                "RType": $scope.selectedFilter.RType.value,
                "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
            };
            reportsData.post("", postData).then(function (data) {
                $scope.detailedDsrData = data;
                $timeout(function () {
                    tableFloat = $('#TheadFloat').floatThead({
                        top: 88,
                        position: 'absolute',
                        floatContainerCss: {"overflow-x": "visible"}
                    });

                    tableFloat.floatThead({
                        scrollContainer: function (table) {
                            return table.closest('.wrapper');
                        }
                    });
                }, 500);
                $scope.setFilterDsrData();
            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });
        };
        $scope.resetFloatHead = function (justDestroy) {
            if (tableFloat) {
                tableFloat.floatThead('destroy');
            }
            $timeout(function () {
                if (!justDestroy) {
                    tableFloat = $('#PnlTheadFloat').floatThead({top: 88, position: 'absolute'});
                    tableFloat.floatThead({
                        scrollContainer: function (table) {
                            return table.closest('.wrapper');
                        }
                    });
                }
            }, 500);
        };
        $scope.setFilterDsrData = function () {
            $scope.dsrFilteredData = null;
            switch ($scope.selectedFilter.Category.value) {
                case 'BS':
                    $scope.selectedCriteria = 'Beverage Sale';
                    $scope.dsrFilteredData = $scope.selectedFilter.SType.value === 'D' ? $scope.detailedDsrData.Beverage.Day : $scope.detailedDsrData.Beverage.MTD;
                    break;
                case 'FS':
                    $scope.selectedCriteria = 'Food Sale';
                    $scope.dsrFilteredData = $scope.selectedFilter.SType.value === 'D' ? $scope.detailedDsrData.Food.Day : $scope.detailedDsrData.Food.MTD;
                    break;
                case 'C':
                    $scope.selectedCriteria = 'Cover';
                    $scope.dsrFilteredData = $scope.selectedFilter.SType.value === 'D' ? $scope.detailedDsrData.Cover.Day : $scope.detailedDsrData.Cover.MTD;
                    break;
                case 'TS':
                    $scope.selectedCriteria = 'Total Sale';
                    $scope.dsrFilteredData = $scope.selectedFilter.SType.value === 'D' ? $scope.detailedDsrData.TotalSale.Day : $scope.detailedDsrData.TotalSale.MTD;
                    break;
                case 'A':
                    $scope.selectedCriteria = 'APC';
                    $scope.dsrFilteredData = $scope.selectedFilter.SType.value === 'D' ? $scope.detailedDsrData.APC.Day : $scope.detailedDsrData.APC.MTD;
                    break;
            }
            $scope.resetFloatHead();
        };

        function getCriteriaStoreWise(value) {
            ifLastDate($scope.selectedFilter.curDate);
            let RType = 'ST';
            $scope.dsrStoreWiseModalData = null;
            let reportsData = new HttpService("DailySaleReport");
            let postData = {
                "FromDT": $scope.selectedFilter.fromDate,
                "CurrentDate": $scope.selectedFilter.curDate,
                "Outlets": getOutletArr(),
                "RType": RType,
                "SumRType": $scope.selectedFilter.RType.value,
                "Criteria": value,
                "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId),
                "SelectionType": $scope.selection.type.value
            };
            reportsData.post("", postData).then(function (data) {
                $scope.dsrStoreWiseModalData = data;
            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });
        }

        let dsrTableModal;
        $scope.tableToShow = '';
        $scope.dsrStoreWiseModal = function (item, tableNo) {
            $scope.tableToShow = tableNo;
            if (item.Value !== 'TOTAL') {
                let valueArr = item.Value.split("(");
                $scope.selectedCriteria = valueArr[0].replace(/\,/g, "");
                getCriteriaStoreWise(valueArr[0].replace(/\,/g, ""));
                dsrTableModal = $uibModal.open({
                    animation: true,
                    templateUrl: 'pages/india/dsr/dsr-table-modal.html',
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    scope: $scope
                });
            }
        };
        let dsrTrendModal;
        $scope.dsrTrendData = null;
        let $window = $(window);

        function resetTableWidth() {
            $scope.minIndex = 0;
            if ($window.width() > 768) $scope.maxIndex = 12; else if ($window.width() < 768) {
                $scope.maxIndex = 6;
            }
        }

        $scope.dsrDetailedValuesIn = '';
        resetTableWidth();
        $scope.dsrTrendModal = function (item, column) {
            resetTableWidth();
            $scope.dsrTrendData = item;
            let criteriaArr = item.Period.Value.split(' (');
            $scope.figureWiseTrendData = null;
            let dsrTrend = new HttpService("DSR_Trend");
            let postData = {
                "CurrentDate": $scope.selectedFilter.curDate,
                "Outlets": getOutletArr(),
                "RType": $scope.selectedFilter.RType.value,
                "Criteria": criteriaArr[0],
                "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId),
                "SelectionType": $scope.selection.type.value,
                "ColName": column
            };
            dsrTrend.post("", postData).then(function (data) {
                $scope.figureWiseTrendData = data;
                if (data.Data !== null) {
                    let title = {};
                    switch ($scope.figureWiseTrendData.ValueType) {
                        case "":
                            break;
                        case 'Sale':
                            title = {
                                'text': $scope.figureWiseTrendData.ColumnType + ' Trend ( In ' + $scope.figureWiseTrendData.SalesIn + ' )',
                                'size': 15,
                                'align': "center",
                                'bold': true,
                                'y': 10
                            };
                            $scope.dsrDetailedValuesIn = $scope.figureWiseTrendData.SalesIn;
                            break;
                        case 'Cover':
                        case 'APC':
                            title = {
                                'text': $scope.figureWiseTrendData.ColumnType + ' Trend ( In ' + $scope.figureWiseTrendData.CoversIn + ' )',
                                'size': 15,
                                'align': "center",
                                'bold': true,
                                'y': 10
                            };
                            $scope.dsrDetailedValuesIn = $scope.figureWiseTrendData.CoversIn;
                            break;
                    }
                    $scope.trendGraphOptions.titles[0] = title;
                    $scope.trendGraphOptions.graphs[0].legendPeriodValueText = $scope.figureWiseTrendData.ColumnType;
                    $scope.trendGraphOptions.valueAxes[0].title , $scope.trendGraphOptions.graphs[0].title = $scope.figureWiseTrendData.ValueType;
                    if ($scope.figureWiseTrendData.ValueType !== 'Sale') {
                        $scope.trendGraphOptions.graphs[1].hidden = true;
                    }
                    $scope.trendGraphOptions.categoryAxis.labelRotation = $scope.figureWiseTrendData.Data.length <= 10 ? 0 : $scope.trendGraphOptions.categoryAxis.labelRotation = $scope.figureWiseTrendData.Data.length > 10 && $scope.figureWiseTrendData.Data.length <= 20 ? 40 : 60;
                    /*if ($scope.figureWiseTrendData.OutputType === 'D') {
                        for (let i = 0; i < $scope.figureWiseTrendData.Data.length; i++) {
                            let day = $scope.figureWiseTrendData.Data[i].Label;
                            $scope.figureWiseTrendData.Data[i].Label2 = $scope.formatDate($scope.selectedFilter.curDate, 'MMM') + " " + day;
                        }
                        let temp = $scope.figureWiseTrendData.Data[0].Label;
                        $scope.figureWiseTrendData.Data[0].Label = $scope.formatDate($scope.selectedFilter.curDate, 'MMM') + " " + temp;
                    } else {
                        for (let i = 0; i < $scope.figureWiseTrendData.Data.length; i++) {
                            $scope.figureWiseTrendData.Data[i].Label2 = $scope.figureWiseTrendData.Data[i].Label;
                        }
                    }*/
                    $scope.trendGraphOptions.data = $scope.figureWiseTrendData.Data;
                }
                getDsrTrend(item, column);
            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });

        };
        $scope.figureWiseTrendData = null;

        function getDsrTrend(item, column) {
            let modalSize;
            if ($scope.figureWiseTrendData.Data !== null) {
                modalSize = $scope.figureWiseTrendData.Data.length <= 8 ? 'md' : 'lg';
            } else {
                modalSize = 'md';
            }
            dsrTrendModal = $uibModal.open({
                animation: true,
                templateUrl: 'pages/india/dsr/dsr-trend.html',
                size: modalSize,
                backdrop: 'static',
                keyboard: false,
                scope: $scope
            });

        }

        $scope.increasePageIndex = function () {
            if ($window.width() > 768) {
                $scope.minIndex += 12;
                $scope.maxIndex += 12;
            } else if ($window.width() < 768) {
                $scope.minIndex += 6;
                $scope.maxIndex += 6;
            }
        };
        $scope.decreasePageIndex = function () {
            if ($window.width() > 768) {
                $scope.minIndex -= 12;
                $scope.maxIndex -= 12;
            } else if ($window.width() < 768) {
                $scope.minIndex -= 6;
                $scope.maxIndex -= 6;
            }
        };
        $scope.checkDiff = function (actual, budgeted) {
            let a = parseFloat(actual);
            let b = parseFloat(budgeted)
            return a > b;
        };

        Hierarchy();

        function Hierarchy() {
            $scope.hierarchyMaster = [];
            $scope.filteredOutlets = [];
            let currentDate2 = $scope.selectedFilter.curDate;
            let currentDate = $scope.selectedFilter.curDate;
            CommonService.Hierarchy(currentDate, currentDate2, parseInt($rootScope.globals.currentUser.Userinfo.UserId), menu.MenuDesc).then(function (data) {
                $scope.hierarchyMaster = data;
                $scope.filteredOutlets = $filter('filter')($scope.hierarchyMaster.Outlet, {
                    RegionName: ($scope.selectedFilter.Region !== null ? $scope.selectedFilter.Region : undefined),
                    CityName: ($scope.selectedFilter.City !== null ? $scope.selectedFilter.City : undefined),
                    ClusterName: $scope.selectedFilter.Cluster !== null ? $scope.selectedFilter.Cluster : undefined
                }, true);
                setFilterAccess(data);
                $scope.onFilterChange();
            });
        }

        function onDateHierarchy() {
            let currentDate2 = $scope.selectedFilter.curDate;
            let currentDate = $scope.selectedFilter.curDate;
            CommonService.Hierarchy(currentDate, currentDate2, parseInt($rootScope.globals.currentUser.Userinfo.UserId), menu.MenuDesc).then(function (data) {
                $scope.hierarchyMaster = data;
                $scope.filteredOutlets = $filter('filter')($scope.hierarchyMaster.Outlet, {
                    RegionName: ($scope.selectedFilter.Region !== null ? $scope.selectedFilter.Region : undefined),
                    CityName: ($scope.selectedFilter.City !== null ? $scope.selectedFilter.City : undefined),
                    ClusterName: $scope.selectedFilter.Cluster !== null ? $scope.selectedFilter.Cluster : undefined
                }, true);
                setFilterAccess(data);
            });
        }

        $scope.hasSelectedSingleOutlet = angular.isDefined($scope.selectedFilter.Outlet) && $scope.selectedFilter.Outlet !== "" && $scope.selectedFilter.Outlet != null ? $scope.selectedFilter.Outlet.indexOf(',') === -1 : false;
    }

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('onestaDsrReports', {
                url: "/onesta/dsr",
                controller: DsrCtrl,
                templateUrl: 'pages/onesta/dsr/dsr.html',
                resolve: {
                    deps: ['$$animateJs', '$ocLazyLoad', function ($$animateJs, $ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_form_elements_advance',
                            'lazy_nvd3_chart'

                        ], {serie: true});
                    }]
                }
            });
    }
})();

(function () {
    'use strict';
    angular.module('able.pages.onesta.foodCost', [])
        .config(routeConfig)
        .controller('FoodCostOCtrl', FoodCostOCtrl);

    function FoodCostOCtrl($scope, $timeout, monthMasterArr,monthTempArr, typeOptions, $interval, CommonService, mdToast, HttpService, $uibModal, $rootScope, $filter) {
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
                        let str = '<table>' +
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
                    left: 45
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
                    axisLabel: 'Months'
                },
                yAxis: {
                    axisLabel: 'Perc',
                    axisLabelDistance: 30
                },
                tooltip: {
                    contentGenerator: function (d) {
                        let str = '<table>' +
                            '<thead>' +
                            '<tr><td class="legend-color-guide"><strong>' + d.data.FYName + '</strong></td></tr>' +
                            '<tr><td class="legend-color-guide">Perc: <strong>' + d.data.Perc + '</strong></td></tr>' +
                            '<tr><td class="legend-color-guide">Cost: <strong>' + d.data.Cost + '</strong></td></tr>' +
                            '<tr><td class="legend-color-guide">Sale: <strong>' + d.data.Sale + '</strong></td></tr>' +
                            '</thead>';

                        str = str + '</table>';
                        return str;
                    }
                },
                callback: function (chart) {
                    d3.selectAll('.nvd3 text').style('font-size', '11px')
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
                        let str = '<table>' +
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

        function getDateNow(dayOffset) {
            return CommonService.getDateNow(dayOffset);
        }

        $scope.getCurDate = function (dayOffset) {
            return getDateNow(dayOffset);
        };
        $scope.filterPercent = function (num, total) {
            return CommonService.formatDate(num, total);
        };
        $scope.filteredText = function (type) {
            if (!$scope.selectedFilter[type]) {
                return "All " + type;
            } else {
                if (type === "Session") {
                    return $filter('filter')($scope.sessionOptions, {value: $scope.selectedFilter.Session})[0].label;
                } else if (type === "Outlet") {
                    return $filter('filter')($scope.hierarchyMaster.Outlet, {OutletCode: $scope.selectedFilter.Outlet})[0].OutletName;
                }
                return $scope.selectedFilter[type] + " " + type;
            }
        };
        $scope.hierarchyMaster = [];
        $scope.selectedFilter = {
            "City": null,
            "Cluster": null,
            "Outlet": null,
            "Region": null,
            "Session": null
        };
        $scope.foodCostView = {
            Type: 'Graphical'
        };
        $scope.selectedFCFilter = {
            Year: {},
            Month: {},
            Type: {value: ''},
            RType: {value: ''}
        };
        $scope.selectedConsumption = {
            curDate: "",
            filter: {},
            group: [],
            item: [],
            product: []
        };
        $scope.fcConsumptionGrpOption = [];
        $scope.fcConsumptionItemOption = [];
        $scope.fcConsumptionFilterOption = [
            {name: "REGION", value: "RG", ticked: true},
            {name: "CLUSTER", value: "CL", ticked: false},
            {name: "CITY", value: "CT", ticked: false},
            {name: "STORE", value: "ST", ticked: false},
        ];
        $scope.selectedFCMailOptions = [
            {value: 'D', label: 'Daily'},
            {value: 'M', label: 'MTD'}];

        $scope.selectedFCMail = {
            curDate: getDateNow(-2),
            Type: {
                value: "D"
            }
        };
        $scope.selectedTrend = {
            Options: [{value: 'D', label: 'Last 7 Days'},
                {value: 'W', label: 'Last 12 Weeks'},
                {value: 'M', label: 'Last 12 Months'}]
        };
        $scope.selectedTrendFilter = {
            curDate: getDateNow(-2),
            Filter: {
                value: "W"
            }
        };
        $scope.typeOptions = typeOptions;
        $scope.selectedFCFilter.Type.value = $scope.typeOptions[0].value;
        $scope.rTypeOptions = [
            {value: 'OA', label: 'Overall'},
            {value: 'AK', label: 'Alacarte'},
            {value: 'BU', label: 'Buffet Unlimited'},
            {value: 'PU', label: 'Pizza Unlimited'},
            {value: 'CB', label: 'Combo'}
        ];
        $scope.selectedFCFilter.RType.value = $scope.rTypeOptions[0].value;
        $scope.getMonthNameByNumber = function (monthCode) {
            return CommonService.getMonthNameByNumber(monthCode);
        };
        $scope.selectedConsumption.filter = $scope.fcConsumptionFilterOption[0];

        function setFilterAccess(data) {
            if (data.Region.length === 1) {
                $scope.itHasSingleRegion = true;
                if (data.Cluster.length === 1) {
                    $scope.selectedFilter.value = "ST";
                    $scope.itHasSingleCluster = true;
                } else {
                    $scope.selectedFilter.value = "CL";
                    $scope.itHasSingleCluster = false;
                }
            } else {
                $scope.selectedFilter.value = "RR";
                $scope.itHasSingleRegion = false;
            }
        }

        function getOutletArr(allOutlets) {
            let arr = [];
            let filteredArr = [];
            if ($scope.selectedFilter.Outlet) {
                return $scope.selectedFilter.Outlet;
            }
            filteredArr = $scope.selectedFilter.Region ? $scope.filteredOutlets : [];

            for (let i = 0; i < filteredArr.length; i++) {
                arr.push(filteredArr[i].OutletCode);
            }
            return arr.toString();
        }

        $scope.selection = {
            type: "DAY"
        };
        $scope.formatDate = function (strDate, formatStr) {
            return CommonService.formatDate(strDate, formatStr);
        };
        let menu = CommonService.getCurrentMenu($rootScope.MenuList);
        $scope.itHasSingleRegion = false;
        $scope.monthMasterArr = monthMasterArr;
        $scope.yearArr = CommonService.getLastFiveYear();
        $scope.selectedFCFilter.Year = $scope.yearArr[0];
        $scope.gsiReportTypeFilter = 'MTD';
        onYearChange($scope.selectedFCFilter.Year.text);
        function onYearChange(year) {
            var dd = new Date();
            dd.setDate(dd.getDate() - 2);
            var yy = dd.getFullYear(year);
            var mm = dd.getMonth();
            var newMonthArr = [];
            if (yy === year) {
                for (var i = 0; i < $scope.monthMasterArr.length; i++) {
                    $scope.monthMasterArr[i].ticked = false;
                }
                var tempMonthArr = $scope.monthMasterArr;
                for (let i = 0; i <= mm; i++) {
                    if (tempMonthArr[i].value - 1 === mm) {
                        tempMonthArr[i].ticked = true;
                        $scope.selectedFCFilter.Year.text = year;
                        $scope.selectedFCFilter.Month = tempMonthArr[mm];
                    }
                    newMonthArr.push(tempMonthArr[i]);
                }
                $scope.monthArr = newMonthArr;
            } else {
                for (let i = 0; i < $scope.monthMasterArr.length; i++) {
                    $scope.monthMasterArr[i].ticked = false;
                }
                $scope.monthMasterArr[mm].ticked = true;
                $scope.monthArr = $scope.monthMasterArr;
                $scope.selectedFCFilter.Year.text = year;
                $scope.selectedFCFilter.Month = $scope.monthArr[mm];
            }
        }
        $scope.onFilterChange = function (filterControl) {
            switch (filterControl) {
                case 'Region':
                    if ($scope.selectedFilter.Cluster) {
                        $scope.selectedFilter.Cluster = null;
                    }
                    if ($scope.selectedFilter.City) {
                        $scope.selectedFilter.City = null;
                    }
                    $scope.selectedFilter.Outlet = null;
                    break;
                case 'Cluster':
                    if ($scope.selectedFilter.Cluster) {
                        $scope.selectedFilter.City = null;
                    }
                    $scope.selectedFilter.Outlet = null;
                    break;
                case 'City':
                    if ($scope.selectedFilter.City) {
                        $scope.selectedFilter.Cluster = null;
                    }
                    $scope.selectedFilter.Outlet = null;
                    break;
                /* case 'tillDate':
                     onDateHierarchy();
                     break;*/
            }
            $scope.filteredOutlets = $filter('filter')($scope.hierarchyMaster.Outlet, {
                RegionName: ($scope.selectedFilter.Region !== null ? $scope.selectedFilter.Region : undefined),
                CityName: ($scope.selectedFilter.City !== null ? $scope.selectedFilter.City : undefined),
                ClusterName: $scope.selectedFilter.Cluster !== null ? $scope.selectedFilter.Cluster : undefined
            }, true);
            if (angular.isDefined($scope.selectedFilter.Outlet) && $scope.selectedFilter.Outlet !== "" && $scope.selectedFilter.Outlet != null) {
                $scope.hasSelectedSingleOutlet = $scope.selectedFilter.Outlet.indexOf(',') === -1;
            } else {
                $scope.hasSelectedSingleOutlet = false;
            }
            $scope.getFoodSummary(filterControl);
            // $scope.getFoodCostTrend(filterControl);
            // $scope.getFoodCostMailData();
            // getFoodCostConGroup();
        };
        $scope.foodCostData = null;
        $scope.getFoodSummary = function (filterOption) {
            $scope.foodCostData = null;
            switch (filterOption) {
                case 'Year':
                    onYearChange($scope.selectedFCFilter.Year.text);
                    break;
            }
            let foodCostSummary = new HttpService("FoodCost");
            let postData = {
                "Year": $scope.selectedFCFilter.Year.text,
                "Month": $scope.selectedFCFilter.Month.value,
                "Outlets": getOutletArr(),
                "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId),
                "Type": $scope.selectedFCFilter.Type.value,
                "RType": $scope.selectedFCFilter.RType.value
            };
            foodCostSummary.post("", postData).then(function (data) {
                $scope.foodCostData = data;
            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });
        };
        $scope.getFoodCostMailData = function () {
            $scope.foodCostMailData = null;
            let footCostMail = new HttpService("FoodCostMail");
            let postData = {
                "CurrentDate": $scope.selectedFCMail.curDate,
                "SelectionType": $scope.selectedFCMail.Type.value,
                "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
            };
            footCostMail.post("", postData).then(function (data) {
                $scope.foodCostMailData = data.FoodCostMail;
            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });
        };
        $scope.getFoodCostTrend = function () {
            $scope.foodCostTrend = null;
            let foodCostTrend = new HttpService("FoodCostAPC");
            let postData = {
                "CurrentDate": $scope.selectedTrendFilter.curDate,
                "Outlets": getOutletArr(),
                "SelectionType": $scope.selectedTrendFilter.Filter.value,
                "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
            };
            foodCostTrend.post("", postData).then(function (data) {
                let foodCostTempArr = [];
                for (let i = 0; i < data.FoodCostAPC.length; i++) {
                    let obj = {
                        Data: [],
                        Summary: {},
                        ServiceName: ""
                    };
                    let arr = $filter('orderBy')(data.FoodCostAPC[i].Data, 'Sort');
                    obj.Data = arr;
                    obj.Summary = data.FoodCostAPC[i].Summary;
                    obj.ServiceName = data.FoodCostAPC[i].ServiceName;
                    foodCostTempArr.push(obj);
                }
                let foodCostTrendData = foodCostTempArr;
                let foodCostTrend = [];
                let tempFcArr = [];
                for (let i = 0; i < foodCostTrendData.length; i++) {
                    let obj = {
                        ServiceName: null,
                        CostPercSummary: null,
                        CostPerc: null,
                        CostAPCSummary: null,
                        CoversSummary: null,
                        Data: [],
                        SalesAPCArr: [],
                        CostAPCArr: [],
                        NamesArr: [],

                    };
                    obj.ServiceName = foodCostTrendData[i].ServiceName;
                    obj.CostPercSummary = foodCostTrendData[i].Summary.CostPerc;
                    obj.CostAPCSummary = foodCostTrendData[i].Summary.CostAPC;
                    obj.CoversSummary = foodCostTrendData[i].Summary.Covers;
                    obj.SalesAPCSummary = foodCostTrendData[i].Summary.SalesAPC;
                    for (let j = 0; j < foodCostTrendData[i].Data.length; j++) {
                        let dObj = {
                            Covers: null,
                            SalesAPC: null,
                            CostAPC: null,
                            Name: null,
                            CostPerc: null
                        };
                        obj.CostAPCArr.push(parseFloat(foodCostTrendData[i].Data[j].CostAPC).toFixed(2));
                        obj.SalesAPCArr.push(parseFloat(foodCostTrendData[i].Data[j].SalesAPC).toFixed(2));
                        obj.NamesArr.push(foodCostTrendData[i].Data[j].Name);
                        dObj.CostPerc = foodCostTrendData[i].Data[j].CostPerc;
                        dObj.Covers = foodCostTrendData[i].Data[j].Covers;
                        dObj.SalesAPC = foodCostTrendData[i].Data[j].SalesAPC;
                        dObj.CostAPC = foodCostTrendData[i].Data[j].CostAPC;
                        dObj.Name = foodCostTrendData[i].Data[j].Name;
                        obj.Data.push(dObj)
                    }
                    obj.CostAPCStr = obj.CostAPCArr.toString();
                    obj.SaleAPCStr = obj.SalesAPCArr.toString();
                    obj.Labels = obj.NamesArr.toString();
                    foodCostTrend.push(obj);
                }
                $scope.foodCostTab = 0;
                $scope.foodCostTrend = foodCostTrend;
                $scope.foodCostDateRange = $scope.formatDate($scope.selectedTrendFilter.curDate, 'MMM dd yyyy') + " - " + $scope.formatDate(getDateNow(-7), 'MMM dd yyyy')
            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });
        };

        function getFoodCostConGroup() {
            $scope.fcConsumptionGrpOption = [];
            let foodCostConGroup = new HttpService("FetchCostItemsGroup");
            foodCostConGroup.post("").then(function (data) {
                $scope.foodCostConsumptionCostGroup = data;
                for (let i = 0; i < data.length; i++) {
                    let obj = {group: "", ticked: false};
                    obj.ticked = i === 0;
                    obj.group = data[i].ItemGroup;
                    $scope.fcConsumptionGrpOption.push(obj);
                }
                $scope.selectedConsumption.group[0] = $scope.fcConsumptionGrpOption[0];
                $scope.fetchProductByGroup(true);
            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });
        }

        $scope.fetchProductByGroup = function (isStartFunction) {
            $scope.fcConsumptionProductOption = [];
            let foodCostConItem = new HttpService("FetchCostItemsProduct");
            let postData = {
                "ItemsGroup": $scope.selectedConsumption.group[0].group,
            };
            foodCostConItem.post("", postData).then(function (data) {
                $scope.foodCostConsumptionProduct = data;
                for (let i = 0; i < data.length; i++) {
                    let obj = {product: "", ticked: false};
                    obj.product = data[i].ItemProduct;
                    $scope.fcConsumptionProductOption.push(obj);
                }
                if (isStartFunction) {
                    $scope.FetchCostItemsRpt();
                }
            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });
        };
        $scope.foodCostConsumptionCostItem = null;
        $scope.fetchItemByProduct = function () {
            $scope.fcConsumptionItemOption = [];
            let foodCostConItem = new HttpService("FetchCostItems");
            let postData = {
                "ItemsGroup": $scope.selectedConsumption.group[0].group,
                "ItemProduct": getConsumptionProducts(),
            };
            foodCostConItem.post("", postData).then(function (data) {
                $scope.foodCostConsumptionCostItem = data;
                for (let i = 0; i < data.length; i++) {
                    let obj = {item: "", itemCode: "", ticked: false};
                    obj.item = data[i].Name;
                    obj.itemCode = data[i].ItemCode;
                    $scope.fcConsumptionItemOption.push(obj);
                }
            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });
        };
        $scope.selectedConsumptionSelectedDate = getDateNow(-2);
        $scope.FetchCostItemsRpt = function () {
            $scope.foodCostConsumptionCostRptData = null;
            let serviceName = new HttpService("FetchCostItemsRpt");
            let postData = {
                "CurrentDate": $scope.selectedConsumptionSelectedDate,
                "Outlets": getOutletArr(),
                "RType": $scope.selectedConsumption.filter[0].value,
                "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId),
                "ItemsGroup": $scope.selectedConsumption.group[0].group,
                "ItemCode": getConsumptionItem(),
            };
            serviceName.post("", postData).then(function (data) {
                $scope.foodCostConsumptionCostRptData = data.ItemConsList;
                $scope.selectedConsumption.curDate = $scope.selectedConsumptionSelectedDate;
            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });
        };

        function getConsumptionItem() {
            let itemCodes = [];
            if (angular.isDefined($scope.selectedConsumption.item) && $scope.selectedConsumption.item.length !== 0) {
                for (let i = 0; i < $scope.selectedConsumption.item.length; i++) {
                    itemCodes.push($scope.selectedConsumption.item[i].itemCode);
                }
                return itemCodes.toString();
            } else {
                return "";
            }
        }

        function getConsumptionProducts() {
            let products = [];
            if (angular.isDefined($scope.selectedConsumption.product) && $scope.selectedConsumption.item.product !== 0) {
                for (let i = 0; i < $scope.selectedConsumption.product.length; i++) {
                    products.push($scope.selectedConsumption.product[i].product);
                }
                return products.toString();
            } else {
                return "";
            }

        }

        Hierarchy();

        function Hierarchy() {
            $scope.hierarchyMaster = [];
            $scope.filteredOutlets = [];
            let currentDate2 = $scope.selectedFilter.curDate;
            let currentDate = $scope.selectedFilter.curDate;
            CommonService.Hierarchy(currentDate, currentDate2, parseInt($rootScope.globals.currentUser.Userinfo.UserId), menu.MenuDesc).then(function (data) {
                $scope.hierarchyMaster = data;
                $scope.filteredOutlets = $filter('filter')($scope.hierarchyMaster.Outlet, {
                    RegionName: ($scope.selectedFilter.Region !== null ? $scope.selectedFilter.Region : undefined),
                    CityName: ($scope.selectedFilter.City !== null ? $scope.selectedFilter.City : undefined),
                    ClusterName: $scope.selectedFilter.Cluster !== null ? $scope.selectedFilter.Cluster : undefined
                }, true);
                setFilterAccess(data);
                $scope.onFilterChange();
            });
        }

        function onDateHierarchy() {
            let currentDate2 = $scope.selectedFilter.curDate;
            let currentDate = $scope.selectedFilter.curDate;
            CommonService.Hierarchy(currentDate, currentDate2, parseInt($rootScope.globals.currentUser.Userinfo.UserId), menu.MenuDesc).then(function (data) {
                $scope.hierarchyMaster = data;
                $scope.filteredOutlets = $filter('filter')($scope.hierarchyMaster.Outlet, {
                    RegionName: ($scope.selectedFilter.Region !== null ? $scope.selectedFilter.Region : undefined),
                    CityName: ($scope.selectedFilter.City !== null ? $scope.selectedFilter.City : undefined),
                    ClusterName: $scope.selectedFilter.Cluster !== null ? $scope.selectedFilter.Cluster : undefined
                }, true);
                setFilterAccess(data);
            });
        }

        if (angular.isDefined($scope.selectedFilter.Outlet) && $scope.selectedFilter.Outlet !== "" && $scope.selectedFilter.Outlet != null) {
            $scope.hasSelectedSingleOutlet = $scope.selectedFilter.Outlet.indexOf(',') === -1;
        } else {
            $scope.hasSelectedSingleOutlet = false;
        }

        let td = new Date();
        td.setDate(td.getDate() - 2);
        angular.element('#mailDate,#consDate,#apcDate').bootstrapMaterialDatePicker({
            time: false,
            format: "YYYY-MM-DD",
            clearButton: false,
            maxDate: td
        });
    }

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('onestaFoodcostReport', {
                url: "/onesta/foodCost",
                controller: FoodCostOCtrl,
                templateUrl: 'pages/onesta/foodcost/foodcost.html',
                resolve: {
                    deps: ['$$animateJs', '$ocLazyLoad', function ($$animateJs, $ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_form_elements_advance',
                            'lazy_nvd3_chart',
                            'lazy_c3_chart'
                        ], {serie: true});
                    }]
                }
            });
    }
})();

(function () {
    'use strict';
    angular.module('able.pages.onesta.gsi', [])
        .config(routeConfig)
        .controller('GsiCtrl', GsiCtrl);

    function GsiCtrl($scope, $timeout, $interval, basic, mtdYtdOptions, criteriaOption2,colorScheme, layoutPaths, monthMasterArr, CommonService, mdToast, HttpService, $uibModal, $rootScope, $filter) {

    }

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('onestagsiReports', {
                url: "/onesta/gsi",
                controller: GsiCtrl,
                templateUrl: 'pages/onesta/gsi/gsi.html',
                resolve: {
                    deps: ['$$animateJs', '$ocLazyLoad', function ($$animateJs, $ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_form_elements_advance',
                            'lazy_nvd3_chart',
                            'lazy_c3_chart'

                        ], {serie: true});
                    }]
                }
            });
    }
})();

(function () {
    'use strict';
    angular.module('able.pages.onesta.hrms', [])
        .config(routeConfig)
        .controller('HrmsOCtrl', HrmsOCtrl);

    function HrmsOCtrl($scope, $timeout, $interval, basicCriteriaOptions, CommonService, mdToast, HttpService, $uibModal, $rootScope, $filter) {

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
                    return d3.format('.2f')(d);
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
                            '<tr><td class="legend-color-guide">' + d.data.key + '<strong> : ' + d.data.value + '</strong></td></tr>' +
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
                labelType: (function (d) {
                    return d.data.label + ': ' + d.data.value + ' Employees';
                }),
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
        };
        $scope.leftJoindGraphOptions = {
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
                            '<tr><th>Month : <strong>' + d.data.label + '</strong></th></tr>' +
                            '<tr><td class="legend-color-guide">' + d.data.key + '<strong> : ' + d.data.value + ' Employees' + '</strong></td></tr>' +
                            '<tr><td class="legend-color-guide"> Active Employee <strong> : ' + d.data.strength + ' Employees' + '</strong></td></tr>' +
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

        function getDateNow(dayOffset) {
            return CommonService.getDateNow(dayOffset);
        }

        $scope.getCurDate = function (dayOffset) {
            return getDateNow(dayOffset);
        };
        $scope.filterPercent = function (num, total) {
            return CommonService.formatDate(num, total);
        };
        $scope.filteredText = function (type) {
            if (!$scope.selectedFilter[type]) {
                return "All " + type;
            } else {
                if (type === "Session") {
                    return $filter('filter')($scope.sessionOptions, {value: $scope.selectedFilter.Session})[0].label;
                } else if (type === "Outlet") {
                    return $filter('filter')($scope.hierarchyMaster.Outlet, {OutletCode: $scope.selectedFilter.Outlet})[0].OutletName;
                }
                return $scope.selectedFilter[type] + " " + type;
            }
        };
        $scope.hierarchyMaster = [];
        $scope.selectedFilter = {
            City: null,
            Cluster: null,
            Outlet: null,
            Region: null,
            Session: null,
            curDate: getDateNow(-2),
            Type: {value: ''},
            HRMSType: true,
            Day_MTD: false,
            StoreMasterTypes: '',
            EmployeeType: ''
        };
        $scope.criteriaOptions = basicCriteriaOptions;
        $scope.empSelectionOptions = [{value: "A", text: "All"}, {value: "F", text: "FOH"}, {value: "B", text: "BOH"}];
        $scope.storeMasterOptions = [{value: "A", text: "All"}, {value: "S", text: "Outlet-wise"}];
        $scope.selectedFilter.EmployeeType = $scope.empSelectionOptions[0];
        $scope.selectedFilter.StoreMasterTypes = $scope.storeMasterOptions[1];
        $scope.selectedHRMSType = "Count";
        $scope.hrmsGraph = {
            Pie: "MF",
            Bar: "AA",
            Bar2: "LeftJoined"
        };

        $scope.setHrmsPieView = function (value) {
            $scope.hrmsGraph.Pie = value;
        };
        $scope.setHrmsBarView = function (value) {
            $scope.hrmsGraph.Bar = value;
        };
        $scope.setHrmsBar2View = function (value) {
            $scope.hrmsGraph.Bar2 = value;
        };

        function setFilterAccess(data) {
            if (data.Region.length === 1) {
                $scope.itHasSingleRegion = true;
                if (data.Cluster.length === 1) {
                    $scope.selectedFilter.Type.value = "ST";
                    $scope.itHasSingleCluster = true;
                } else {
                    $scope.selectedFilter.Type.value = "CL";
                    $scope.itHasSingleCluster = false;
                }
            } else {
                $scope.selectedFilter.Type.value = "RG";
                $scope.itHasSingleRegion = false;
            }
        }

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

        $scope.formatDate = function (strDate, formatStr) {
            return CommonService.formatDate(strDate, formatStr);
        };
        $scope.numberToPerc = function (num, dim) {
            return CommonService.numberToPerc(num, dim);
        };
        let menu = CommonService.getCurrentMenu($rootScope.MenuList);
        $scope.itHasSingleRegion = false;
        $scope.onFilterChange = function (filterControl) {
            switch (filterControl) {
                case 'Region':
                    if ($scope.selectedFilter.Cluster) {
                        $scope.selectedFilter.Cluster = null;
                    }
                    if ($scope.selectedFilter.City) {
                        $scope.selectedFilter.City = null;
                    }
                    $scope.selectedFilter.Outlet = null;
                    break;
                case 'Cluster':
                    if ($scope.selectedFilter.Cluster) {
                        $scope.selectedFilter.City = null;
                    }
                    $scope.selectedFilter.Outlet = null;
                    break;
                case 'City':
                    if ($scope.selectedFilter.City) {
                        $scope.selectedFilter.Cluster = null;
                    }
                    $scope.selectedFilter.Outlet = null;
                    break;
                case 'tillDate':
                    onDateHierarchy();
                    break;
            }
            $scope.filteredOutlets = $filter('filter')($scope.hierarchyMaster.Outlet, {
                RegionName: ($scope.selectedFilter.Region !== null ? $scope.selectedFilter.Region : undefined),
                CityName: ($scope.selectedFilter.City !== null ? $scope.selectedFilter.City : undefined),
                ClusterName: $scope.selectedFilter.Cluster !== null ? $scope.selectedFilter.Cluster : undefined
            }, true);
            if (angular.isDefined($scope.selectedFilter.Outlet) && $scope.selectedFilter.Outlet !== "" && $scope.selectedFilter.Outlet != null) {
                $scope.hasSelectedSingleOutlet = $scope.selectedFilter.Outlet.indexOf(',') === -1;
            } else {
                $scope.hasSelectedSingleOutlet = false;
            }
            $scope.getHrmsReport();
        };
        $scope.getHrmsReport = function () {
            $scope.pieDataObj = {
                Male: undefined,
                FeMale: undefined,
                FOH: undefined,
                BOH: undefined
            };
            let hrmsType = "";
            let dayMtd = "";
            var storeMasterType = "";
            if ($scope.selectedFilter.HRMSType === true) {
                $scope.selectedHRMSType = "Count";
                $scope.hrmsTypeToolTip = "Salary";
                hrmsType = "C";
            } else {
                $scope.selectedHRMSType = "Salary";
                $scope.hrmsTypeToolTip = "Count";
                hrmsType = "S";
            }
            if ($scope.selectedFilter.Day_MTD === true) {
                dayMtd = "D";
                $scope.dayMtdToolTip = "Month";
            } else {
                dayMtd = "M";
                $scope.dayMtdToolTip = "Day";
            }
            $scope.hrmsData = null;
            var hrmsSummary = new HttpService("HRMS");
            var postData = {
                "CurrentDate": $scope.selectedFilter.curDate,
                "Outlets": getOutletArr(),
                "Type": $scope.selectedFilter.Type.value,
                "HRMS_Type": hrmsType,
                "Day_MTD": dayMtd,
                "StoreMasterTypes": $scope.selectedFilter.StoreMasterTypes.value,
                "EmployeeType": $scope.selectedFilter.EmployeeType.value,
                "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
            };
            hrmsSummary.post("", postData).then(function (data) {
                $scope.hrmsData = data;
                drawHrmsPieChart(data.HRMS_2, data.HRMS_3);
                drawHrmsBarChart(data.HRMS_4, data.HRMS_5, data.HRMS_6);
                drawHrmsCriteriaBarChart(data.HRMS_8);
            }, function (e) {
                mdToast.display("error", 'Error fetching filtered data!.Try Again!');
            });
        };

        function drawHrmsCriteriaBarChart(criteriaWiseArr) {
            $scope.hrmsCriteriaBarData = [];
            let criteriaObj = {
                key: 'No.of Emplyees:',
                values: criteriaWiseArr.map(function (d) {
                    return {
                        label: d.Month_Name,
                        value: d.Strength
                    };
                })
            };
            $scope.hrmsCriteriaBarData = [criteriaObj];
            $scope.hrmsCriteriaBarOptions = angular.copy(hrmsBarGrpahOptions);
            $scope.hrmsCriteriaBarXsOptions = angular.copy(mutliBarHorizontalOpions);
            $scope.hrmsCriteriaBarOptions.title.text = "Employee Strength( Month-Wise )";
            $scope.hrmsCriteriaBarXsOptions.title.text = "Employee Strength( Month-Wise )";
            $scope.hrmsCriteriaBarXsOptions.chart.showLegend = false;
            $scope.hrmsCriteriaBarXsOptions.chart.barColor = ['#35A4E0'];
            $scope.hrmsCriteriaBarOptions.chart.color = ['#35A4E0'];
            $scope.hrmsCriteriaBarOptions.chart.xAxis.axisLabel = "Months";
            $scope.hrmsCriteriaBarXsOptions.chart.xAxis.axisLabel = "Months";
            $scope.hrmsCriteriaBarXsOptions.chart.yAxis.axisLabel = "Strength";
        }

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
                key: "Number of Employee:",
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
            $scope.aveAgeGraphOptions.title.text = "Average Age Group";
            $scope.aveAgeXsGraphOptions.title.text = "Average Age Group";
            $scope.aveAgeXsGraphOptions.chart.showLegend = false;
            $scope.aveAgeXsGraphOptions.chart.barColor = ['#e04941', '#35a4e0', '#2ae01c', '#bb13b1', '#f67a1b'];
            $scope.aveAgeGraphOptions.chart.xAxis.axisLabel = "Age Group";
            $scope.aveAgeXsGraphOptions.chart.xAxis.axisLabel = "Age Group";
            $scope.aveAgeXsGraphOptions.chart.yAxis.axisLabel = "Counts";
            $scope.yearOfSerGraphOptions = angular.copy(hrmsBarGrpahOptions);
            $scope.yearOfSerXsGraphOptions = angular.copy(mutliBarHorizontalOpions);
            $scope.yearOfSerGraphOptions.title.text = "Year Of Service";
            $scope.yearOfSerXsGraphOptions.title.text = "Year Of Service";
            $scope.yearOfSerXsGraphOptions.chart.showLegend = false;
            $scope.yearOfSerXsGraphOptions.chart.barColor = ['#e04941', '#35a4e0', '#2ae01c', '#bb13b1', '#f67a1b'];
            $scope.yearOfSerGraphOptions.chart.xAxis.axisLabel = "Years";
            $scope.yearOfSerXsGraphOptions.chart.xAxis.axisLabel = "Years";
            $scope.yearOfSerXsGraphOptions.chart.yAxis.axisLabel = "Counts";
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
                if (leftJoinedArr[i].Months !== 'Total') {
                    joinedCount.key = "Joined Counts";
                    joinedCount.color = "#2dd320";
                    joinedCount.values.push({
                        label: leftJoinedArr[i].Months,
                        value: leftJoinedArr[i].JoinedCount,
                        total: leftJoinedArr[i].LeftCount + leftJoinedArr[i].JoinedCount,
                        strength: leftJoinedArr[i].Strength
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
                        value: leftJoinedArr[j].LeftCount,
                        total: leftJoinedArr[j].LeftCount + leftJoinedArr[j].JoinedCount,
                        strength: leftJoinedArr[j].Strength
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
            $scope.leftJoindGraphOptions.chart.reduceXTick = true;
            $scope.leftJoindXsGraphOptions.chart.xAxis.axisLabel = "Months";
            $scope.leftJoindXsGraphOptions.chart.yAxis.axisLabel = "Counts";
            $scope.leftJoindGraphOptions.chart.reduceXTicks = false;
            $scope.leftJoindGraphOptions.title.text = "Left & Joined Employee Count";
            $scope.leftJoindXsGraphOptions.title.text = "Left & Joined Employee Count";
            $scope.leftJoindGraphOptions.chart.callback = function (chart) {
                chart.multibar.dispatch.on('elementClick', function (e) {
                    //console.log('elementClick in callback', e.data);
                    //$scope.getRegionDaySale();
                });
            };
        }

        Hierarchy();

        function Hierarchy() {
            $scope.hierarchyMaster = [];
            $scope.filteredOutlets = [];
            let currentDate2 = $scope.selectedFilter.curDate;
            let currentDate = $scope.selectedFilter.curDate;
            CommonService.Hierarchy(currentDate, currentDate2, parseInt($rootScope.globals.currentUser.Userinfo.UserId), menu.MenuDesc).then(function (data) {
                $scope.hierarchyMaster = data;
                $scope.filteredOutlets = $filter('filter')($scope.hierarchyMaster.Outlet, {
                    RegionName: ($scope.selectedFilter.Region !== null ? $scope.selectedFilter.Region : undefined),
                    CityName: ($scope.selectedFilter.City !== null ? $scope.selectedFilter.City : undefined),
                    ClusterName: $scope.selectedFilter.Cluster !== null ? $scope.selectedFilter.Cluster : undefined
                }, true);
                setFilterAccess(data);
                $scope.onFilterChange();
            });
        }

        function onDateHierarchy() {
            let currentDate2 = $scope.selectedFilter.curDate;
            let currentDate = $scope.selectedFilter.curDate;
            CommonService.Hierarchy(currentDate, currentDate2, parseInt($rootScope.globals.currentUser.Userinfo.UserId), menu.MenuDesc).then(function (data) {
                $scope.hierarchyMaster = data;
                $scope.filteredOutlets = $filter('filter')($scope.hierarchyMaster.Outlet, {
                    RegionName: ($scope.selectedFilter.Region !== null ? $scope.selectedFilter.Region : undefined),
                    CityName: ($scope.selectedFilter.City !== null ? $scope.selectedFilter.City : undefined),
                    ClusterName: $scope.selectedFilter.Cluster !== null ? $scope.selectedFilter.Cluster : undefined
                }, true);
                setFilterAccess(data);
            });
        }

        if (angular.isDefined($scope.selectedFilter.Outlet) && $scope.selectedFilter.Outlet !== "" && $scope.selectedFilter.Outlet != null) {
            $scope.hasSelectedSingleOutlet = $scope.selectedFilter.Outlet.indexOf(',') === -1;
        } else {
            $scope.hasSelectedSingleOutlet = false;
        }

        let td = new Date();
        td.setDate(td.getDate() - 2);
        angular.element('#date').bootstrapMaterialDatePicker({
            time: false,
            format: "YYYY-MM-DD",
            clearButton: false,
            maxDate: td
        });
    }

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('onestaHrms', {
                url: "/onesta/hrms",
                controller: HrmsOCtrl,
                templateUrl: 'pages/onesta/hrms/hrms.html',
                resolve: {
                    deps: ['$$animateJs', '$ocLazyLoad', function ($$animateJs, $ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_form_elements_advance',
                            'lazy_nvd3_chart'

                        ], {serie: true});
                    }]
                }
            });
    }
})();
