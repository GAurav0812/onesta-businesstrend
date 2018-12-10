/*
ableApp.directive('myElem',
    function () {
        return {
            restrict: 'E',
            replace:true,
            scope: {
                config: '='
            },
            template: '<div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
            link: function (scope, element, attrs) {

                var chart = false;

                var initChart = function() {
                    if (chart) chart.destroy();
                    var config = scope.config || {};
                    chart = new Highcharts.Chart(config);


                    if(config.loading) {
                        chart.showLoading();
                    }

                };
                initChart();

                scope.$watch('config.loading', function (loading) {
                    if(loading) {
                        chart.showLoading();
                    } else {
                        chart.hideLoading();
                    }
                });

                scope.$watch('config.series[0].type', function (type) {
                    chart.series[0].update({type: type});
                });

                scope.$watch('config.series[0].dataLabels.enabled', function (enableDataLabels) {
                    chart.series[0].update({dataLabels: {enabled: enableDataLabels}});
                });
            }//end watch
        }
    }) ;
*/
ableApp.directive('amChart',
    function () {
        return {
            restrict: 'E',
            replace:true,
            scope: {
                config: '='
            },
            template: '<div id="chartdiv"></div>',
            link: function (scope, element, attrs) {

                var chart = false;

                var initChart = function() {
                    if (chart) chart.destroy();
                    var config = scope.config || {};

                    chart = AmCharts.makeChart("chartdiv", config);


                };
                initChart();

            }//end watch
        }
    }) ;
