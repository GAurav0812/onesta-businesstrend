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
