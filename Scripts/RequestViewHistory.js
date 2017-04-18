angular.module('ERMS').controller("viewHistoryCtrl", function ($scope, $filter, $http, $state, $stateParams, $rootScope) {
    var vm = this;

    /*********************************************************************************************************/
    //Initialization/Popualtion of default controls and enabling of controls based on type of request
    /*********************************************************************************************************/
    vm.initData = function () {
        vm.SetRequestId = '';
        vm.SetRequestType = '';
        vm.SetStatus = '';
        vm.SetComments = '';
        vm.SetOriginator = '';
        vm.SetCreatedDate = '';
        vm.SetSubmittedDate = '';
        vm.SetFastTeamMgr = '';
        vm.SetFastTeamSignOff = '';
        vm.SetFastSignOffDays = '';
        vm.SetSCPMgr = '';
        vm.SetSCPSignOff = '';
        vm.SetSCPSignOffDays = '';
        vm.SetPackTechMgr = '';
        vm.SetPackTechSignOff = '';
        vm.SetPackTechSignOffDays = '';
        vm.SetPackTechCompleteMgr = '';
        vm.SetPackCompletSignOff = '';
        vm.SetPackTestCompleteTimeTaken = '';
        vm.SetRDMMgr = '';
        vm.SetRDMSignOff = '';
        vm.SetRDMSignOffDays = '';
        vm.SetSUCodeRaiseRDMMgr = '';
        vm.SetSUCodeRaiseSignOff = '';
        vm.SetSUCodeRaiseTimeTake = '';
        vm.SetEBMMgr = '';
        vm.SetEBMSignOff = '';
        vm.SetEBMSignOffDays = '';
        vm.SetEBM2ndManager = '';
        vm.SetEBM2ndSignOff = '';
        vm.SetEBM2ndTimeTaken = '';
        vm.SetSCTeamPackTechMgr = '';
        vm.SetSCTeamPackTechHead = '';
        vm.SetSCTeamPackPuchasingMgr = '';
        vm.SetSCTeamFastMgr = '';
        vm.SetSCTeamGSCMMgr = '';
        vm.SetSCTeamRDMMgr = '';
        vm.SetSCTeamGTPMgr = '';
        vm.SetSCTeamSignOff = '';
        vm.SetSCTeamSignOffDays = '';
        vm.SetGSCMMgr = '';
        vm.SetGSCMSignOff = '';
        vm.SetGSCMSignOffDays = '';
        vm.SetGSCM2ndManager = '';
        vm.SetGSCM2ndSignOff = '';
        vm.SetGSCM2ndTimeTaken = '';
        vm.trFastShow = true;
        vm.trFastMgrShow = true;
        vm.trFastSignOffShow = true;
        vm.trFastTimeTakenShow = true;
        vm.trSCPShow = true;
        vm.trSCPMgrShow = true;
        vm.trSCPSignOffShow = true;
        vm.trSCPTimeTakenShow = true;
        vm.trPackTechShow = true;
        vm.trPackTechMgrShow = true;
        vm.trPackTechSignOffShow = true;
        vm.trPackTechTimeTakenShow = true;
        vm.trPackCompleteMgrShow = true;
        vm.trPackCompleteSignOffShow = true;
        vm.trPackTestCompleteTimeTakenShow = true;
        vm.trRDMShow = true;
        vm.trRDMMgrShow = true;
        vm.trRDMSignOffShow = true;
        vm.trRDMTimeTakenShow = true;
        vm.trSUCodeRaiseRDMMgrShow = true;
        vm.trSUCodeRaiseSignOffShow = true;
        vm.trSUCodeRaiseTimeTakenShow = true;
        vm.trEBMShow = true;
        vm.trEBMMgrShow = true;
        vm.trEBMSignOffShow = true;
        vm.trEBMTimeTakenShow = true;
        vm.trEBM2ndManagerShow = true;
        vm.trEBM2ndSignOffShow = true;
        vm.trEBM2ndTimeTakenShow = true;
        vm.trSCTeamShow = true;
        vm.trSCTeamPackTechShow = true;
        vm.trSCTeamPackTechHeadShow = true;
        vm.trSCTeamPackPurchasingMgrShow = true;
        vm.trSCTeamFastMgrShow = true;
        vm.trSCTeamGSCMMgrShow = true;
        vm.trSCTeamRDMMgrShow = true;
        vm.trSCTeamGTPMgrShow = true;
        vm.trSCTeamSignOffShow = true;
        vm.trSCTeamTimeTakenShow = true;
        vm.trGSCMShow = true;
        vm.trGSCMMgrShow = true;
        vm.trGSCMSignOffShow = true;
        vm.trGSCMTimeTakenShow = true;
        vm.trGSCM2ndManagerShow = true;
        vm.trGSCM2ndSignOffShow = true;
        vm.trGSCM2ndTimeTakenShow = true;



    }
    vm.initData();

    var requestId = localStorage.getItem('name');
    var queryString = $stateParams.QueryString;

    if (queryString == '') {
        queryString = 'requestId=' + requestId;
    }

/*********************************************************************************************************/
//Method to get history for selected request ID
/*********************************************************************************************************/
    $http.get('ViewHistory/GetHistoryView?requestId=' + requestId)
        .success(function (data) {
            console.log(data);
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess })
            }
            else {
            vm.SetRequestId = data.SetRequestId;
            vm.SetRequestType = data.SetRequestType;
            vm.SetStatus = data.SetStatus;
            vm.SetComments = data.SetComments;
            vm.SetOriginator = data.SetOriginator;
            vm.SetCreatedDate = data.SetCreatedDate;
            vm.SetSubmittedDate = data.SetSubmittedDate;
            vm.SetFastTeamMgr = data.SetFastTeamMgr;
            vm.SetFastTeamSignOff = data.SetFastTeamSignOff;
            vm.SetFastSignOffDays = data.SetFastSignOffDays;
            vm.SetSCPMgr = data.SetSCPMgr;
            vm.SetSCPSignOff = data.SetSCPSignOff;
            vm.SetSCPSignOffDays = data.SetSCPSignOffDays;
            vm.SetPackTechMgr = data.SetPackTechMgr;
            vm.SetPackTechSignOff = data.SetPackTechSignOff;
            vm.SetPackTechSignOffDays = data.SetPackTechSignOffDays;
            vm.SetPackTechCompleteMgr = data.SetPackTechCompleteMgr;
            vm.SetPackCompletSignOff = data.SetPackCompletSignOff;
            vm.SetPackTestCompleteTimeTaken = data.SetPackTestCompleteTimeTaken;
            vm.SetRDMMgr = data.SetRDMMgr;
            vm.SetRDMSignOff = data.SetRDMSignOff;
            vm.SetRDMSignOffDays = data.SetRDMSignOffDays;
            vm.SetSUCodeRaiseRDMMgr = data.SetSUCodeRaiseRDMMgr;
            vm.SetSUCodeRaiseSignOff = data.SetSUCodeRaiseSignOff;
            vm.SetSUCodeRaiseTimeTake = data.SetSUCodeRaiseTimeTake;
            vm.SetEBMMgr = data.etEBMMgr;
            vm.SetEBMSignOff = data.SetEBMSignOff;
            vm.SetEBMSignOffDays = data.SetEBMSignOffDays;
            vm.SetEBM2ndManager = data.SetEBM2ndManager;
            vm.SetEBM2ndSignOff = data.SetEBM2ndSignOff;
            vm.SetEBM2ndTimeTaken = data.SetEBM2ndTimeTaken;
            vm.SetSCTeamPackTechMgr = data.SetSCTeamPackTechMgr;
            vm.SetSCTeamPackTechHead = data.SetSCTeamPackTechHead;
            vm.SetSCTeamPackPuchasingMgr = data.SetSCTeamPackPuchasingMgr;
            vm.SetSCTeamFastMgr = data.SetSCTeamFastMgr;
            vm.SetSCTeamGSCMMgr = data.SetSCTeamGSCMMgr;
            vm.SetSCTeamRDMMgr = data.SetSCTeamRDMMgr;
            vm.SetSCTeamGTPMgr = data.SetSCTeamGTPMgr;
            vm.SetSCTeamSignOff = data.SetSCTeamSignOff;
            vm.SetSCTeamSignOffDays = data.SetSCTeamSignOffDays;
            vm.SetGSCMMgr = data.SetGSCMMgr;
            vm.SetGSCMSignOff = data.SetGSCMSignOff;
            vm.SetGSCMSignOffDays = data.SetGSCMSignOffDays;
            vm.SetGSCM2ndManager = data.SetGSCM2ndManager;
            vm.SetGSCM2ndSignOff = data.SetGSCM2ndSignOff;
            vm.SetGSCM2ndTimeTaken = data.SetGSCM2ndTimeTaken;
            vm.trFastShow = data.trFastShow;
            vm.trFastMgrShow = data.trFastMgrShow;
            vm.trFastSignOffShow = data.trFastSignOffShow;
            vm.trFastTimeTakenShow = data.trFastTimeTakenShow;
            vm.trSCPShow = data.trSCPShow;
            vm.trSCPMgrShow = data.trSCPMgrShow;
            vm.trSCPSignOffShow = data.trSCPSignOffShow;
            vm.trSCPTimeTakenShow = data.trSCPTimeTakenShow;
            vm.trPackTechShow = data.trPackTechShow;
            vm.trPackTechMgrShow = data.trPackTechMgrShow;
            vm.trPackTechSignOffShow = data.trPackTechSignOffShow;
            vm.trPackTechTimeTakenShow = data.trPackTechTimeTakenShow;
            vm.trPackCompleteMgrShow = data.trPackCompleteMgrShow;
            vm.trPackCompleteSignOffShow = data.trPackCompleteSignOffShow;
            vm.trPackTestCompleteTimeTakenShow = data.trPackTestCompleteTimeTakenShow;
            vm.trRDMShow = data.trRDMShow;
            vm.trRDMMgrShow = data.trRDMMgrShow;
            vm.trRDMSignOffShow = data.trRDMSignOffShow;
            vm.trRDMTimeTakenShow = data.trRDMTimeTakenShow;
            vm.trSUCodeRaiseRDMMgrShow = data.trSUCodeRaiseRDMMgrShow;
            vm.trSUCodeRaiseSignOffShow = data.trSUCodeRaiseSignOffShow;
            vm.trSUCodeRaiseTimeTakenShow = data.trSUCodeRaiseTimeTakenShow;
            vm.trEBMShow = data.trEBMShow;
            vm.trEBMMgrShow = data.trEBMMgrShow;
            vm.trEBMSignOffShow = data.trEBMSignOffShow;
            vm.trEBMTimeTakenShow = data.trEBMTimeTakenShow;
            vm.trEBM2ndManagerShow = data.trEBM2ndManagerShow;
            vm.trEBM2ndSignOffShow = data.trEBM2ndSignOffShow;
            vm.trEBM2ndTimeTakenShow = data.trEBM2ndTimeTakenShow;
            vm.trSCTeamShow = data.trSCTeamShow;
            vm.trSCTeamPackTechShow = data.trSCTeamPackTechShow;
            vm.trSCTeamPackTechHeadShow = data.trSCTeamPackTechHeadShow;
            vm.trSCTeamPackPurchasingMgrShow = data.trSCTeamPackPurchasingMgrShow;
            vm.trSCTeamFastMgrShow = data.trSCTeamFastMgrShow;
            vm.trSCTeamGSCMMgrShow = data.trSCTeamGSCMMgrShow;
            vm.trSCTeamRDMMgrShow = data.trSCTeamRDMMgrShow;
            vm.trSCTeamGTPMgrShow = data.trSCTeamGTPMgrShow;
            vm.trSCTeamSignOffShow = data.trSCTeamSignOffShow;
            vm.trSCTeamTimeTakenShow = data.trSCTeamTimeTakenShow;
            vm.trGSCMShow = data.trGSCMShow;
            vm.trGSCMMgrShow = data.trGSCMMgrShow;
            vm.trGSCMSignOffShow = data.trGSCMSignOffShow;
            vm.trGSCMTimeTakenShow = data.trGSCMTimeTakenShow;
            vm.trGSCM2ndManagerShow = data.trGSCM2ndManagerShow;
            vm.trGSCM2ndSignOffShow = data.trGSCM2ndSignOffShow;
            vm.trGSCM2ndTimeTakenShow = data.trGSCM2ndTimeTakenShow;
            return;
            }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in GetHistoryView method of RequestViewHistory-JS' })
        })

});