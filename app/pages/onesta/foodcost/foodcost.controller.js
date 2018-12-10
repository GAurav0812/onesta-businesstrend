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
