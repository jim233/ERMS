//'use strict';
//var IndexApp = angular.module('ERMSReport', ['ui.bootstrap']);

angular.module('ERMS').controller("reportCtrl", function ($scope, $location, $http, $stateParams, $state) {
  
/*********************************************************************************************************/
//Initialization/Popualtion of default controls and enabling of controls based on type of report selected
/*********************************************************************************************************/
    var vm = this;
    var reportNo = $stateParams.reportNo;
    var param1 = $stateParams.param1;
    var param2 = $stateParams.param2;


    debugger;
     if (reportNo == '1') {
         vm.showReport1 = true;
    }
    else if (reportNo == '2') {
        vm.showReport2 = true;
        //Report type 2 table show logic
        vm.EPM = false;
        vm.Fast = false;
        vm.SCP = false;
        vm.SCTeam = false;
        vm.GSCM = false;
        vm.PP = false;
        vm.FP = false;
        vm.Pack = false;
        vm.DM = false;
        vm.GTP = false;
    }
    else if (reportNo == '3') {
        vm.showReport3 = true;
    }
    else if (reportNo == '4') {
        vm.showReport4 = true;
    }
    else if (reportNo == '5') {
        vm.showReport5 = true;
    }
    else if (reportNo == '6') {
        vm.showReport6 = true;
    }
    else if (reportNo == '7') {
        vm.showReport7 = true;
    }
    else if (reportNo == '8') {
        vm.showReport8 = true;
    }
    else if (reportNo == '9') {
        vm.showReport9 = true;
    }
    else if (reportNo == '10') {
        vm.showReport10 = true;
    }
    
     var data = JSON.parse(sessionStorage.getItem('reportData'));

    //vm.Report1 = data.GetEDMRangeStatus ? data.GetEDMRangeStatus.Table : null;
    //    vm.Report2_EPM = data.GetAppStatusSummaryEPM != null ? data.GetAppStatusSummaryEPM : null;
    //    vm.Report2_FAST = data.GetAppStatusSummaryFAST != null ? data.GetAppStatusSummaryFAST : null;
    //    vm.Report2_SCP = data.GetAppStatusSummarySCP ? data.GetAppStatusSummarySCP : null;
    //    vm.Report2_SCTeam = data.GetAppStatusSummarySCTeam ? data.GetAppStatusSummarySCTeam : null;
    //    vm.Report2_GSCM = data.GetAppStatusSummaryGSCM ? data.GetAppStatusSummaryGSCM : null;
    //    vm.Report2_PP = data.GetAppStatusSummaryPP? data.GetAppStatusSummaryPP : null;
    //    vm.Report2_FP = data.GetAppStatusSummaryFP ? data.GetAppStatusSummaryFP : null;
    //    vm.Report2_Packaging = data.GetAppStatusSummaryPK ? data.GetAppStatusSummaryPK : null;
    //    vm.Report2_DM = data.GetAppStatusSummaryDM? data.GetAppStatusSummaryDM : null;
    //    vm.Report2_GTP = data.GetAppStatusSummaryGTP? data.GetAppStatusSummaryGTP : null;
    //    vm.Report3 = data.GetPackTech ? data.GetPackTech.Table : null;
    //    vm.Report4_Monthly = data.GetRequestSummary ? data.GetRequestSummary.Table : null;
    //    vm.Report5 = data.GetProgressRequests ? data.GetProgressRequests.Table : null;
    //    vm.Report6_EPT = data.GetTimeApprovalEPT ? data.GetTimeApprovalEPT : null;
    //    vm.Report6_Newpack = data.GetTimeApprovalNP ? data.GetTimeApprovalNP : null;
    //    vm.Report6_CountryAdd = data.GetTimeApprovalCA ? data.GetTimeApprovalCA : null;
    //    vm.Report6_SupplyChain = data.GetTimeApprovalSC ? data.GetTimeApprovalSC : null;
    //    vm.Report6_CombiPack = data.GetTimeApprovalCP ? data.GetTimeApprovalCP : null;
    //    vm.Report6_PFR = data.GetTimeApprovalPFR ? data.GetTimeApprovalPFR : null;
    //    vm.Report6_Other = data.GetTimeApprovalOTR ? data.GetTimeApprovalOTR : null;
    //    vm.Report6_EPTCopy = data.GetTimeApprovalEPTCopy ? data.GetTimeApprovalEPTCopy : null;
    //    vm.Report7_NPIKPI = data.GetNPIKPI ? data.GetNPIKPI.Table : null;
    //    vm.Report8_CoreRange = data.GetNPCP ? data.GetNPCP.Table : null;
    //    vm.Report9_PackagingApprover = data.GetPTSTPA ? data.GetPTSTPA : null;
    //    vm.Report9_PackTech = data.GetPTSTPT ? data.GetPTSTPT : null;
    //    vm.Report9_EstPackCompletion = data.GetPTEPCD ? data.GetPTEPCD : null;
    //    vm.Report10_PLS = data.GetPlantSellerLine ? data.GetPlantSellerLine.Table : null;

/*********************************************************************************************************/
//Getting report data to be displayed based on various parameter
/*********************************************************************************************************/
    $http({
        url: 'Reports/GetReport?reportNo=' + reportNo +'&param1=' + param1 + '&param2=' + param2,
        method: 'POST',
    }).success(function (data) {
        debugger;
        if (data.ErrorBE) {
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess })
        }
        else {
            vm.Report1 = data.GetEDMRangeStatus ? data.GetEDMRangeStatus.Table : null;
            vm.Report2_EPM = data.GetAppStatusSummaryEPM != null ? data.GetAppStatusSummaryEPM : null;
            if (vm.Report2_EPM) {vm.EPM = true;}
            vm.Report2_FAST = data.GetAppStatusSummaryFAST != null ? data.GetAppStatusSummaryFAST : null;
            if (vm.Report2_FAST) { vm.Fast = true; }
            vm.Report2_SCP = data.GetAppStatusSummarySCP ? data.GetAppStatusSummarySCP : null;
            if (vm.Report2_SCP) { vm.SCP = true; }
            vm.Report2_SCTeam = data.GetAppStatusSummarySCTeam ? data.GetAppStatusSummarySCTeam : null;
            if (vm.Report2_SCTeam) { vm.SCTeam = true; }
            vm.Report2_GSCM = data.GetAppStatusSummaryGSCM ? data.GetAppStatusSummaryGSCM : null;
            if (vm.Report2_GSCM) { vm.GSCM = true; }
            vm.Report2_PP = data.GetAppStatusSummaryPP ? data.GetAppStatusSummaryPP : null;
            if (vm.Report2_PP) { vm.PP = true; }
            vm.Report2_FP = data.GetAppStatusSummaryFP ? data.GetAppStatusSummaryFP : null;
            if (vm.Report2_FP) { vm.FP = true; }
            vm.Report2_Packaging = data.GetAppStatusSummaryPK ? data.GetAppStatusSummaryPK : null;
            if (vm.Report2_Packaging) { vm.Pack = true; }
            vm.Report2_DM = data.GetAppStatusSummaryDM ? data.GetAppStatusSummaryDM : null;
            if (vm.Report2_DM) { vm.DM = true; }
            vm.Report2_GTP = data.GetAppStatusSummaryGTP ? data.GetAppStatusSummaryGTP : null;
            if (vm.Report2_GTP) { vm.GTP = true; }
            vm.Report3 = data.GetPackTech ? data.GetPackTech.Table : null;
            vm.Report4_Monthly = data.GetRequestSummary ? data.GetRequestSummary.Table : null;
            vm.Report5 = data.GetProgressRequests ? data.GetProgressRequests.Table : null;
            vm.Report6_EPT = data.GetTimeApprovalEPT ? data.GetTimeApprovalEPT : null;
            vm.Report6_Newpack = data.GetTimeApprovalNP ? data.GetTimeApprovalNP : null;
            vm.Report6_CountryAdd = data.GetTimeApprovalCA ? data.GetTimeApprovalCA : null;
            vm.Report6_SupplyChain = data.GetTimeApprovalSC ? data.GetTimeApprovalSC : null;
            vm.Report6_CombiPack = data.GetTimeApprovalCP ? data.GetTimeApprovalCP : null;
            vm.Report6_PFR = data.GetTimeApprovalPFR ? data.GetTimeApprovalPFR : null;
            vm.Report6_Other = data.GetTimeApprovalOTR ? data.GetTimeApprovalOTR : null;
            vm.Report6_EPTCopy = data.GetTimeApprovalEPTCopy ? data.GetTimeApprovalEPTCopy : null;
            vm.Report7_NPIKPI = data.GetNPIKPI ? data.GetNPIKPI.Table : null;
            vm.Report8_CoreRange = data.GetNPCP ? data.GetNPCP.Table : null;
            vm.Report9_PackagingApprover = data.GetPTSTPA ? data.GetPTSTPA : null;
            vm.Report9_PackTech = data.GetPTSTPT ? data.GetPTSTPT : null;
            vm.Report9_EstPackCompletion = data.GetPTEPCD ? data.GetPTEPCD : null;
            vm.Report10_PLS = data.GetPlantSellerLine ? data.GetPlantSellerLine.Table : null;
        }
    }).error(function (data) {
        //debugger;
        console.log("error" + data);
        $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in GetReport method of newTableReport-JS' })
    })

/*********************************************************************************************************/
//Redirection to respective to requests page based on row clicked
/*********************************************************************************************************/
    vm.requestRedirection = function (row) {
        $state.go("SupplyChainRequest.request", { req: row.RequestId, rqType: row.Type, ifGetBoth: "FromReport" });
    }

/*********************************************************************************************************/
//Redirection to report page on back click
/*********************************************************************************************************/
    vm.goState1 = function () {
        $state.go("Reports");
    }
})