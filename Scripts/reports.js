/// <reference path="../UserInterface/Reports/newTableReport.html" />
angular.module('ERMS').controller("reportsCtrl", function ($scope, $state, $modal, $log, $http) {
    var vm = this;
/*********************************************************************************************************/
//Initialization/Popualtion of default controls and enabling of controls for reports home page
/*********************************************************************************************************/
    vm.reportNo = '';
    vm.param1 = '';
    vm.param2 = '';
    vm.showLoadingPage = false;

    vm.getRadioValue = 'StatusRDM';
    vm.DateFrom = null;
    vm.DateTo = null;

    $scope.$watch('getValidData', function () {
        if ($scope.getValidData == true) {
            console.log("! = 1" + $scope.getValidData);
            vm.showLoadingPage = false;
        }
        else {
            console.log("! = 0" + $scope.getValidData);
            vm.showLoadingPage = true;
            $scope.getValidData = false;
        }
    });

    /*********************************************************************************************************/
    //Population of values in controls on page load
    /*********************************************************************************************************/
    $http({
        url: "Reports/GetReportsControl",
        method: 'POST',
    }).success(function (data) {
        if (data.ErrorBE) {
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess })
        }
        else {
            $scope.getValidData = true;
            vm.month = data.Month;
            vm.Year = data.Year;
            vm.PackTech = data.PackTech;
            vm.Roles = data.Roles;
            vm.PackTechStatus = data.PackTechStatus;
            vm.selectedPLSMonth = "1";
            vm.selectedPackTechStatus = "99";
            vm.selectedPLSYear = data.Year[0].Value;
            vm.selectedApprovalYear = data.Year[0].Value;
            //vm.selectedPackTechStatus = 'All in Progress';
            vm.selectedPackTech = 'All';
            vm.selectedRoles = 'All';
            vm.selectedApprovalMonth = "1";
            $('#sandbox-container-from input').datepicker({ autoclose: true, format: "yyyy-mm-dd", });
            $('#sandbox-container-to input').datepicker({ autoclose: true, format: "yyyy-mm-dd", });
        }
    }).error(function (data) {
        console.log("error" + data);
        $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in GetReportsControl method of Report-JS' })
    })

    /*********************************************************************************************************/
    //On click of view report
    /*********************************************************************************************************/
    vm.getReportParameters = function (r) {
        vm.param1 = '';
        vm.param2 = '';
        if (vm.getRadioValue == 'StatusRDM') {
            vm.reportNo = '1';
        }
        else if (vm.getRadioValue == 'viewSummary') {
            vm.reportNo = '2';
            vm.param1 = vm.selectedPackTech == 'All' ? 0 : vm.selectedPackTech;
        }
        else if (vm.getRadioValue == 'selectPackStatus') {
            vm.reportNo = '3';
            vm.param1 = vm.selectedRoles == 'All' ? 0 : vm.selectedRoles;
            vm.param2 = vm.selectedPackTechStatus;
        }
        else if (vm.getRadioValue == 'lineReport') {
            vm.reportNo = '10';
            vm.param1 = vm.selectedPLSMonth;
            vm.param2 = vm.selectedPLSYear;
        }
        else if (vm.getRadioValue == 'summaryProgress') {
            vm.reportNo = '4';
        }
        else if (vm.getRadioValue == 'rangeProgress') {
            vm.reportNo = '5';
        }
        else if (vm.getRadioValue == 'timeTakenStages') {
            vm.reportNo = '6';
            vm.param1 = vm.selectedApprovalMonth;
            vm.param2 = vm.selectedApprovalYear;
        }
        else if (vm.getRadioValue == 'viewKPI') {
            vm.reportNo = '7';
        }
        else if (vm.getRadioValue == 'addCoreRange') {
            vm.reportNo = '8';
        }
        else if (vm.getRadioValue == 'packReport') {
            vm.reportNo = '9';
            var dateM1 = JSON.stringify(vm.DateFrom);
            var dateN1 = new Date(vm.DateFrom);
            vm.param1 = dateN1.Format("yyyy-MM-dd");
            var dateM2 = JSON.stringify(vm.DateTo);
            var dateN2 = new Date(vm.DateTo);
            vm.param2 = dateN2.Format("yyyy-MM-dd");
        }
    }

    Date.prototype.Format = function (fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
/*********************************************************************************************************/
//Redirection to report view
/*********************************************************************************************************/
    vm.getReport = function (r) {
        vm.getReportParameters(r);
        $state.go("ReportView", { reportNo: vm.reportNo, param1: vm.param1, param2: vm.param2 });
    }

/*********************************************************************************************************/
//On click of export to excel
/*********************************************************************************************************/
    vm.getReportinExcel = function (r) {
        vm.getReportParameters(r);
        $http({
            url: 'Reports/ExportReport?reportNo=' + vm.reportNo + '&param1=' + vm.param1 + '&param2=' + vm.param2,
            method: 'POST',
        }).success(function (data, status, headers, config) {
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess })
            }
            else {
                //var fileInfo = data.split('&&');
                vm.fileName = data.FileName;
                var link = document.createElement("a");
                link.setAttribute("href", data.ExcelPath);
                link.setAttribute("download", vm.fileName);
                document.body.appendChild(link);
                link.click();
            }
        }).error(function (data) {
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in ExportReport method of Report-JS' })
        })
    }
})