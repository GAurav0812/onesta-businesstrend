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
