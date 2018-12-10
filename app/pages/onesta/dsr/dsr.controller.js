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
