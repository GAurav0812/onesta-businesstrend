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
