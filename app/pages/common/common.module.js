(function () {
    'use strict';
    angular.module('able.pages.common', [])
        .factory('CommonService', CommonService);

    function CommonService($filter, mdToast, sessionOptions, monthMasterArr, HttpService, $rootScope, $state) {
        CommonService.formatDate = function (strDate, formatStr) {
            let dt = new Date();
            if (strDate.indexOf("-") >= 0) {
                dt = new Date(strDate.split("-")[0] + "/" + strDate.split("-")[1] + "/" + strDate.split("-")[2]);
            } else {
                dt = new Date(strDate);
            }
            return $filter('date')(dt, formatStr);
        };

        CommonService.filterPercent = function (num, total) {
            return $filter('number')(((num / total) * 100), 2) + "%";
        };
        CommonService.filteredText = function (selectedFilter, type, outlets) {
            if (!selectedFilter[type]) {
                return "All " + type;
            } else {
                if (type === "Session") {
                    return $filter('filter')(sessionOptions, {value: selectedFilter.Session})[0].label;
                } else if (type === "Outlet") {
                    return $filter('filter')(outlets, {OutletCode: selectedFilter.Outlet})[0].OutletName;
                }
                return selectedFilter[type] + " " + type;
            }
        };

        CommonService.getDateNow = function (dayOffset) {
            let dateMod = (24 * 60 * 60 * 1000) * (dayOffset ? dayOffset : 0); //5 days
            let myDate = new Date();
            myDate.setTime(myDate.getTime() + dateMod);
            return myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
        };
        CommonService.getCurrentMenu = function (menuList) {
            let menu;
            menu = $filter('filter')(menuList, {Test_Col: $state.current.name})[0];
            return menu;
        };
        CommonService.Hierarchy = function (currentDate, currentDate2, userId, menuDesc) {
            let hierarchyData = new HttpService("Hierarchy");
            return hierarchyData.post('', {
                "CurrentDate": currentDate,
                "CurrentDate2": currentDate2,
                "UserId": userId,
                "Menu": menuDesc
            });
        };
        CommonService.TodaySale = function (userId, apiKey) {
            let todaySale = new HttpService("TodaySale");
            return todaySale.post('', {
                "UserId": userId,
            });
        };
        CommonService.isTodaySaleLoaded = function () {
            return angular.isDefined($rootScope.todaySaleData);
        };
        CommonService.getCompanyApikey = function () {
            let company = $rootScope.globals.selectedCompany.CompanyId;
            let apiKey = "";
            if (company === "12") {
                apiKey = "onesta";
            } else if (company === "8") {
                apiKey = "bbq";
            } else if (company === "15") {
                apiKey = "dubai";
            }
            return apiKey;
        };
        CommonService.getLastFiveYear = function () {
            let yearArr = [];
            for (let d = 0; d < 5; d++) {
                let yrArrObj = {};
                let dt = new Date();
                let currYr = dt.getFullYear();
                yrArrObj.value = dt.getFullYear() - d;
                yrArrObj.text = dt.getFullYear() - d;
                yrArrObj.number = (dt.getFullYear() - d).toString().substr(-2);
                yearArr.push(yrArrObj);
            }
            return yearArr;
        };
        CommonService.getPastYearsByNumber = function (num) {
            let yearArr = [];
            for (let d = 0; d < num; d++) {
                let yrArrObj = {};
                let dt = new Date();
                let currYr = dt.getFullYear();
                yrArrObj.value = dt.getFullYear() - d;
                yrArrObj.text = dt.getFullYear() - d;
                yrArrObj.number = (dt.getFullYear() - d).toString().substr(-2);
                yearArr.push(yrArrObj);
            }
            return yearArr;
        };
        CommonService.isCurrentFinancialYear = function (year) {
            let dt = new Date();
            let curMonth = dt.getMonth();
            let fiscalYr;
            if (curMonth > 3) { //
                let nextYr1 = (dt.getFullYear() + 1).toString();
                fiscalYr = dt.getFullYear().toString() + "-" + nextYr1;
            } else {
                let nextYr2 = dt.getFullYear().toString();
                fiscalYr = (dt.getFullYear() - 1).toString() + "-" + nextYr2;
            }
            return fiscalYr === year;
        };
        CommonService.getPastFinancialList = function (num) {
            let yearArr = [];
            let dt = new Date();
            let curMonth = dt.getMonth();
            for (let d = 0; d < num; d++) {
                let value;
                let label;
                if (curMonth > 3) {
                    let nextYr1 = (dt.getFullYear() - d + 1).toString();
                    label = "FY " + (dt.getFullYear() - d).toString() + "-" + nextYr1.charAt(2) + nextYr1.charAt(3);
                    value = (dt.getFullYear() - d).toString() + "-" + nextYr1;
                } else {
                    let nextYr2 = dt.getFullYear() - d.toString();
                    label = "FY " + (dt.getFullYear() - d - 1).toString() + "-" + nextYr2.charAt(2) + nextYr2.charAt(3);
                    value = (dt.getFullYear() - d - 1).toString() + "-" + nextYr2;
                }
                let yrArrObj = {};
                yrArrObj.value = value;
                yrArrObj.label = label;
                yearArr.push(yrArrObj);
            }
            return yearArr;
        };
        CommonService.getLastFiveYearWithLabel = function () {
            let yearArr = [];
            for (let d = 0; d < 5; d++) {
                let yrArrObj = {value: ''};
                let dt = new Date();
                let currYr = dt.getFullYear();
                let val = dt.getFullYear() - d;
                yrArrObj.value = val.toString();
                yrArrObj.label = "FY " + yrArrObj.value.toString();
                yearArr.push(yrArrObj);
            }
            return yearArr;
        };
        CommonService.getMonthNameByNumber = function (monthCode) {
            return moment(monthCode, 'MM').format('MMM');
        };
        CommonService.getLastDayOfMonth = function (year, month) {
            let lastDay;
            let date = new Date();
            lastDay = new Date(year, month + 1, 0);
            return lastDay.getFullYear() + "-" + (lastDay.getMonth() + 1) + "-" + lastDay.getDate();
        };
        CommonService.getFirstDayOfMonth = function (year, month) {
            let firstDay;
            let date = new Date();
            firstDay = new Date(year, month, 1);
            return firstDay.getFullYear() + "-" + (firstDay.getMonth() + 1) + "-" + firstDay.getDate();
        };
        CommonService.getRowExpandedStatus = function (item, arr) {
            var parentRow;
            for (var i = 0; i < arr.length; i++) {
                if (item.ParentRow === arr[i].RowNo) {
                    parentRow = arr[i];
                    break;
                }
            }
            if (parentRow && item.RowNo && item.RowNo.indexOf('.') >= 0) {
                return parentRow.isExpanded;
            }
            return true;
        };
        CommonService.getRowHasChild = function (item, arr) {
            var hasChild = false;
            for (var i = 0; i < arr.length; i++) {
                if (item.RowNo === arr[i].ParentRow && item.ParentRow === '0') {
                    return true;
                }
            }
            return hasChild;
        };
        CommonService.decimalAndCommaFilter = function (value, decimal) {
            if (value !== 0 && value !== '' && value !== null) {
                let valueStr = value.toString();
                let val = parseFloat(valueStr);
                let vl = val.toFixed(decimal);
                return vl.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else {
                return "-";
            }
        };
        CommonService.numberDecimalAndCommaFilter = function (value, decimal) {
            if (value !== 0 && value !== '' && value !== null) {
                let valueStr = value.toString();
                let val = parseFloat(valueStr);
                let vl = val.toFixed(decimal);
                return vl.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            return "-";
        };
        CommonService.numberToPerc = function (num, dim) {
            if (dim !== 0 && angular.isDefined(dim)) {
                return ((num / dim) * 100).toFixed(2);
            }else{
                return "-"
            }
        };
        CommonService.onYearChange = function (year, lastClosedMonth) {
            let dd = new Date();
            let yy = dd.getFullYear();
            let cm = dd.getMonth();
            let mm = lastClosedMonth;
            let newMonthArr = [];
            let result = {
                year: '',
                month: '',
                monthArr: null
            };
            if (yy === year) {
                for (let i = 0; i < mm; i++) {
                    newMonthArr.push(monthMasterArr[i]);
                }
                result.monthArr = newMonthArr;
                result.month = newMonthArr[mm - 1];
                result.year = year;
                return result;
            } else {
                newMonthArr = monthMasterArr;
                result.monthArr = newMonthArr;
                result.month = newMonthArr[cm];
                result.year = year;
                return result;
            }
        };
        return CommonService;
    }
})();
