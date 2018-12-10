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
