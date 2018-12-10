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
