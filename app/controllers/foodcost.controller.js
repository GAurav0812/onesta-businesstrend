ableApp.controller('foodCostController', function ($scope, $uibModal, HttpService, $location, $rootScope, $filter, CriteriaFilter, $state) {

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
    $scope.getFoodSummary = function (filterOption) {
        switch (filterOption) {
            case 'Year':
                $scope.selectedMonthObj = [];
                onYearChange($scope.selectedYearObj[0].text);
                break;
        }
        $scope.selectedYear = $scope.selectedYearObj[0].text;
        $scope.selectedMonth = $scope.selectedMonthObj[0].text;

        var foodCostSummary = new HttpService("bbq/FoodCost");
        $scope.gsiReportTypeFilter = 'YTD';
        var postData = {
            "Year": $scope.selectedYearObj[0].text,
            "Month": $scope.selectedMonthObj[0].value,
            "Outlets": getOutletArr(),
            "UserId": parseInt($rootScope.globals.currentUser.Userinfo.UserId)
        };
        foodCostSummary.post("", postData).then(function (data) {
            let color;
            var mdataObj = {
                key: "MTD",
                values: data.MTD.map(function (d) {
                    if (d.FoodCostAPC >= 225) {
                        color = '#ef1c06';
                    } else if (d.FoodCostAPC < 225 && d.FoodCostAPC > 215) {
                        color = '#f97409';
                    } else {
                        color = '#03d20a';
                    }
                    return {
                        FYName: $scope.selectedMonthObj[0].text + " " + d.Year,
                        Perc: d.Perc,
                        Cost: d.FoodCostAPC,
                        Sale: d.FoodSaleAPC,
                        color: color
                    }
                })
            };
            $scope.filteredFoodCostMTD = [mdataObj];
            var ydataObj = {
                key: "YTD",
                values: data.YTD.map(function (d) {
                    if (d.FoodCostAPC >= 225) {
                        color = '#ef1c06';
                    } else if (d.FoodCostAPC < 225 && d.FoodCostAPC > 215) {
                        color = '#f97409';
                    } else {
                        color = '#03d20a';
                    }
                    return {
                        FYName: "FY " + d.FYName,
                        Perc: d.Perc,
                        Cost: d.FoodCostAPC,
                        Sale: d.FoodSaleAPC,
                        color: color
                    }
                })
            };
            $scope.filteredFoodCostYTD = [ydataObj];

            var mndataObj = {
                key: "Months of " + $scope.selectedYear,
                values: data.Monthly.map(function (d) {
                    if (d.FoodCostAPC >= 225) {
                        color = '#ef1c06';
                    } else if (d.FoodCostAPC < 225 && d.FoodCostAPC > 215) {
                        color = '#f97409';
                    } else {
                        color = '#03d20a';
                    }
                    return {
                        FYName: d.MonthName,
                        Perc: d.Perc,
                        Cost: d.FoodCostAPC,
                        Sale: d.FoodSaleAPC,
                        color: color,
                    }
                }),
                barColor: data.Monthly.map(function (d) {
                    if (d.FoodCostAPC >= 225) {
                        color = '#ef1c06';
                    } else if (d.FoodCostAPC < 225 && d.FoodCostAPC > 215) {
                        color = '#f97409';
                    } else {
                        color = '#03d20a';
                    }
                    return color;
                })
            };
            $scope.filteredFoodCostMonthly = [mndataObj];
            $scope.foodcostXSMonthlyoptions.chart.barColor = $scope.filteredFoodCostMonthly[0].barColor;
        }, function (e) {
            console.info("Error fetching food sale...", e);
        });
        $scope.foodcostXSMonthlyoptions.chart.stacked = false;
        $scope.foodcostXSMonthlyoptions.chart.showControls = false;
        $scope.foodcostMonthlyoptions.chart.xAxis.axisLabel = "Months of " + $scope.selectedYear;
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

    $scope.filterPercent = function (num, total) {
        return $filter('number')(((num / total) * 100), 2) + "%";
    };

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

