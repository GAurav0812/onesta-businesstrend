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
