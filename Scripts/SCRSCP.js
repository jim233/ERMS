angular.module('ERMS').controller("SCRSCP", function ($scope, $http, $state, $rootScope) {

    var vm = this;
    var requestType;
/*********************************************************************************************************/
//Initialization/Popualtion of default controls and enabling of controls based on type of request
/*********************************************************************************************************/
    vm.showLoadingPage = false;
    console.log("SCRSCP!!!");

    vm.showStateName = 'SCP';

    $scope.$watch('getValidData', function () {
        if ($scope.getValidData) {
            vm.showLoadingPage = false;
            console.log('Check' + $scope.getValidData);
        } else {
            vm.showLoadingPage = true;
            $scope.getValidData = false;
            console.log('Check from true' + $scope.getValidData);
        }
    });
    $rootScope.$broadcast('SCRNameto-parent', vm.showStateName);
    vm.initData = function () {
        vm.GetSystemCodeSetup = '',
        vm.GetSupplyPlant2 = '',
        vm.GetSupplyPlant1 = '',
        vm.GetSubmitedDate = '', //System.DateTime
        vm.GetSCPName = '',
        vm.GetSCPComments = '',
        vm.GetSAPCodeSourcePlant = '',
        vm.GetReleventAPO = '',
        vm.GetPurchaseNumber2 = '',
        vm.GetPurchaseNumber1 = '',
        vm.GetProcurementType = '',
        vm.GetHubMRPControllerName2 = '',
        vm.GetHubMRPControllerName1 = '',
        vm.GetHubMRPControllerCode2 = '',
        vm.GetHubMRPControllerCode1 = '',
        vm.GetGSAPHubPlantCode2 = '',
        vm.GetGSAPHubPlantCode1 = '',
        vm.GetLLProcurementType = '',
        vm.GetLateLabelingId = '',
        vm.GetLLMRPControllerName = '',
        vm.GetLLMRPControllerCode = '',
        vm.GetLLSupplyResponse = '',
        vm.GetLLSourcePlant = '',
        vm.GetLLReleventAPO = '',
        vm.GetFFPOutsideEAME = '',
        vm.GetFFPMRPControllerName = '',
        vm.GetFFPMRPControllerCode = '',
        vm.GetCompletedDate = '',   //System.DateTime
        //public System.Data.DataSet GetDropdowns  = '',
        vm.GetSupplyResponse = '',
        vm.GetSCPID = '',
        vm.GetOtherData = '',
        vm.GetSourcePlant = '',
        vm.GetIsSyngentaPack = '',
        vm.GetSelectedLLSAPCodeSourcePlant = 'SELECT',
        vm.GetSelectedSAPCodeSourcePlant = 'SELECT',
        vm.GetSelectedLLProcurementType = 'SELECT',
        vm.GetSelectedProcurementType = 'SELECT',
        vm.GetSelectedLLSupplyResponse = 'SELECT',
        vm.GetSelectedSupplyResponse = 'SELECT',
        vm.GetSelectedGSAPHubPlantCode1 = 'SELECT',
        vm.GetSelectedGSAPHubPlantCode2 = 'SELECT',
        vm.GetSelectedlateLabelingId = 'SELECT',
        vm.GetSelectedFFPOutsideEAME = 'SELECT',
	    vm.WarningMessage = 'The originator does not want a Syngenta branded pack, please discuss with FAST team if this causes any sourcing issues.'
        vm.showWarningMessage = false;
        vm.showBranding = false;
        vm.showFastRecmd = false;
        vm.GSAPSystemCodeSetupDisabled = false;
        vm.ERPSystemCodeSetupDisabled = false;
        vm.SAPCodeSourcePlantDisabled = false;
        vm.ProcurementTypeDisabled = false;
        vm.FFPMRPControllerNameDisabled = false;
        vm.FFPMRPControllerCodeDisabled = false;
        vm.ReleventAPODisabled = false;
        vm.SupplyResponseDisabled = false;
        vm.SaveDisabled = false;
        vm.SubmitDisabled = false;
        vm.FFPOutsideEAMEDisabled = false;
        vm.GSAPHubPlantCode1Disabled = false;
        vm.SupplyPlant1Disabled = false;
        vm.HubMRPControllerName1Disabled = false;
        vm.HubMRPControllerCode1Disabled = false;
        vm.PurchaseNumber1Disabled = false;
        vm.SCPCommentsDisabled = false;
        vm.GSAPHubPlantCode2Disabled = false;
        vm.SupplyPlant2Disabled = false;
        vm.HubMRPControllerName2Disabled = false;
        vm.HubMRPControllerCode2Disabled = false;
        vm.PurchaseNumber2Disabled = false;
        vm.CompletedDateDisabled = false;
    }
    vm.initData();

    vm.showOperationMsgPart = function (msg) {
        vm.showOperationMsg = true;
        vm.operationMsg = msg;
        }

    vm.hideOperationMsgPart = function () {
        vm.showOperationMsg = false;
        vm.operationMsg = '';
        }

    vm.hideOperationMsgPart();

    /*********************************************************************************************************/
    //Getting request no. and request type from local storage and assigning ID for request types
    /*********************************************************************************************************/
    var requestId = localStorage.getItem('name');
    var requestTypeName = localStorage.getItem('type');

    if (requestTypeName == 'EPT') {
        requestType = 1;
    } else if (requestTypeName == 'New Pack') {
        requestType = 2;
    } else if (requestTypeName == 'Country Add') {
        requestType = 3;
    } else if (requestTypeName == 'Supply Chain') {
        requestType = 4;
    } else if (requestTypeName == 'Combi Pack') {
        requestType = 5;
    } else if (requestTypeName == 'PFR') {
        requestType = 6;
    } else if (requestTypeName == 'Other') {
        requestType = 7;
    } else if (requestTypeName == 'EPT-Copy') {
        requestType = 8;
    }

    /*********************************************************************************************************/
    //Date format
    /*********************************************************************************************************/
    //for date format
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //mouth
            "d+": this.getDate(), //day 
            "h+": this.getHours(), //hour 
            "m+": this.getMinutes(), //mins 
            "s+": this.getSeconds(), //second 
            "q+": Math.floor((this.getMonth() + 3) / 3), //season 
            "S": this.getMilliseconds() //mSecond 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    if (requestTypeName == 'New Pack' || requestTypeName == 'Country Add' || requestTypeName == 'Combi Pack') {
        vm.showWarningMessage = true;
        } else {
        vm.showWarningMessage = false;
        }

    /*********************************************************************************************************/
    //Getting SCP request details to be populated on page load
    /*********************************************************************************************************/
    $http.get('SCP/GetSCP?requestId=' +requestId + "&requestType=" + requestType)
        .success(function (data) {
            console.log(data);
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else {
                $scope.getValidData = true;
                //Dorpdowns
                vm.GetLLSourcePlant = data.GetLLSourcePlant;
                vm.GetFFPOutsideEAME = data.GetFFPOutsideEAME;
                vm.GetSAPCodeSourcePlant = data.GetSAPCodeSourcePlant;
                vm.GetProcurementType = data.GetProcurementType;
                vm.GetSupplyResponse = data.GetSupplyResponse;
                vm.GetGSAPHubPlantCode1 = data.GetGSAPHubPlantCode1;
                vm.GetGSAPHubPlantCode2 = data.GetGSAPHubPlantCode2;

                vm.GetSystemCodeSetup = data.GetSystemCodeSetup;
                vm.GetSupplyPlant2 = data.GetSupplyPlant2;
                vm.GetSupplyPlant1 = data.GetSupplyPlant1;
                vm.GetSubmitedDate = data.GetSubmitedDate; //System.DateTime
                var dateM = JSON.stringify(vm.GetSubmitedDate);
                var dateN = new Date(vm.GetSubmitedDate);

                if (dateN) {
                    $scope.time2 = dateN.Format("yyyy-MM-dd");

                    if ($scope.time2 == '1-01-01') {
                        $('#sandbox-container-SCP input').datepicker({ autoclose: true, gotoCurrent: true, });
                        $('#sandbox-container-SCP input').datepicker("setDate", 'now');
                    } else {
                        $('#sandbox-container-SCP input').datepicker({ autoclose: true, format: "yyyy-mm-dd", });
                        $('#sandbox-container-SCP input').datepicker("setDate", $scope.time2);
                    }
                }
                vm.GetSCPName = data.GetSCPName;
                vm.GetSCPComments = data.GetSCPComments;
                vm.GetReleventAPO = data.GetReleventAPO;
                vm.GetPurchaseNumber2 = data.GetPurchaseNumber2;
                vm.GetPurchaseNumber1 = data.GetPurchaseNumber1;
                vm.GetHubMRPControllerName2 = data.GetHubMRPControllerName2;
                vm.GetHubMRPControllerName1 = data.GetHubMRPControllerName1;
                vm.GetHubMRPControllerCode2 = data.GetHubMRPControllerCode2;
                vm.GetHubMRPControllerCode1 = data.GetHubMRPControllerCode1;
                vm.GetLLProcurementType = data.GetLLProcurementType;
                vm.GetLateLabelingId = data.GetLateLabelingId;
                vm.GetLLMRPControllerName = data.GetLLMRPControllerName;
                vm.GetLLMRPControllerCode = data.GetLLMRPControllerCode;
                vm.GetLLSupplyResponse = data.GetLLSupplyResponse;
                vm.GetLLReleventAPO = data.GetLLReleventAPO;
                vm.GetFFPMRPControllerName = data.GetFFPMRPControllerName;
                vm.GetFFPMRPControllerCode = data.GetFFPMRPControllerCode;
                vm.GetCompletedDate = new Date(data.GetCompletedDate);   //System.DateTime

                if (vm.GetCompletedDate) {
                    vm.time2SCP = vm.GetCompletedDate.Format("yyyy-MM-dd");

                    if (vm.time2SCP == '1-01-01') {
                        $('#sandbox-container-SPC input').datepicker({ autoclose: true, gotoCurrent: true, });
                        $('#sandbox-container-SPC input').datepicker("setDate", 'now');
                    } else {
                        $('#sandbox-container-SPC input').datepicker({ autoclose: true, format: "yyyy-mm-dd", });
                        $('#sandbox-container-SPC input').datepicker("setDate", vm.time2SCP);
                    }
                }
                vm.GetSCPID = data.GetSCPID;
                vm.GetOtherData = data.GetOtherData;
                vm.GetSourcePlant = data.GetSourcePlant;
                vm.GetIsSyngentaPack = data.GetIsSyngentaPack;

                //vm.GetSelectedLLSAPCodeSourcePlant
                if (data.GetSelectedLLSAPCodeSourcePlant == "0" || data.GetSelectedLLSAPCodeSourcePlant == null || data.GetSelectedLLSAPCodeSourcePlant == '') {
                    vm.GetSelectedLLSAPCodeSourcePlant = 'SELECT';
                }
                else {
                    vm.GetSelectedLLSAPCodeSourcePlant = data.GetSelectedLLSAPCodeSourcePlant;
                }
                //vm.GetSelectedSAPCodeSourcePlant
                if (data.GetSelectedSAPCodeSourcePlant == "0" || data.GetSelectedSAPCodeSourcePlant == null || data.GetSelectedSAPCodeSourcePlant == '') {
                    vm.GetSelectedSAPCodeSourcePlant = 'SELECT';
                }
                else {
                    vm.GetSelectedSAPCodeSourcePlant = data.GetSelectedSAPCodeSourcePlant;
                }
                //vm.GetSelectedLLProcurementType
                if (data.GetSelectedLLProcurementType == "0" || data.GetSelectedLLProcurementType == null || data.GetSelectedLLProcurementType == '') {
                    vm.GetSelectedLLProcurementType = 'SELECT';
                }
                else {
                    vm.GetSelectedLLProcurementType = data.GetSelectedLLProcurementType;
                }
                //vm.GetSelectedProcurementType
                if (data.GetSelectedProcurementType == "0" || data.GetSelectedProcurementType == null || data.GetSelectedProcurementType == '') {
                    vm.GetSelectedProcurementType = 'SELECT';
                }
                else {
                    vm.GetSelectedProcurementType = data.GetSelectedProcurementType;
                }
                //vm.GetSelectedLLSupplyResponse
                if (data.GetSelectedLLSupplyResponse == "0" || data.GetSelectedLLSupplyResponse == null || data.GetSelectedLLSupplyResponse == '') {
                    vm.GetSelectedLLSupplyResponse = 'SELECT';
                }
                else {
                    vm.GetSelectedLLSupplyResponse = data.GetSelectedLLSupplyResponse;
                }
                //vm.GetSelectedSupplyResponse
                if (data.GetSelectedSupplyResponse == "0" || data.GetSelectedSupplyResponse == null || data.GetSelectedSupplyResponse == '') {
                    vm.GetSelectedSupplyResponse = 'SELECT';
                }
                else {
                    vm.GetSelectedSupplyResponse = data.GetSelectedSupplyResponse;
                }
                //vm.GetSelectedGSAPHubPlantCode1 = data.GetSelectedGSAPHubPlantCode1;
                if (data.GetSelectedGSAPHubPlantCode1 == "0" || data.GetSelectedGSAPHubPlantCode1 == null || data.GetSelectedGSAPHubPlantCode1 == '') {
                    vm.GetSelectedGSAPHubPlantCode1 = 'SELECT';
                }
                else {
                    vm.GetSelectedGSAPHubPlantCode1 = data.GetSelectedGSAPHubPlantCode1;
                }
                // vm.GetSelectedGSAPHubPlantCode2 = data.GetSelectedGSAPHubPlantCode2;
                if (data.GetSelectedGSAPHubPlantCode2 == "0" || data.GetSelectedGSAPHubPlantCode2 == null || data.GetSelectedGSAPHubPlantCode2 == '') {
                    vm.GetSelectedGSAPHubPlantCode2 = 'SELECT';
                }
                else {
                    vm.GetSelectedGSAPHubPlantCode2 = data.GetSelectedGSAPHubPlantCode2;
                }
                //vm.GetSelectedlateLabelingId = data.GetSelectedlateLabelingId;
                if (data.GetSelectedlateLabelingId == "0" || data.GetSelectedlateLabelingId == null || data.GetSelectedlateLabelingId == '') {
                    vm.GetSelectedlateLabelingId = 'SELECT';
                }
                else {
                    vm.GetSelectedlateLabelingId = data.GetSelectedlateLabelingId;
                }
                //vm.GetSelectedFFPOutsideEAME = data.GetSelectedFFPOutsideEAME;
                if (data.GetSelectedFFPOutsideEAME == "0" || data.GetSelectedFFPOutsideEAME == null || data.GetSelectedFFPOutsideEAME == '') {
                    vm.GetSelectedFFPOutsideEAME = 'SELECT';
                }
                else {
                    vm.GetSelectedFFPOutsideEAME = data.GetSelectedFFPOutsideEAME;
                }
                vm.showBranding = data.ShowBranding;

                //if Local ERP is checked, make FFP details disabled
                if (vm.GetSystemCodeSetup == 1) {
                    vm.SAPCodeSourcePlantDisabled = true;
                    vm.ProcurementTypeDisabled = true;
                    vm.FFPMRPControllerNameDisabled = true;
                    vm.FFPMRPControllerCodeDisabled = true;
                    vm.ReleventAPODisabled = true;
                    vm.SupplyResponseDisabled = true;
                }

                vm.displayDepOnFFP();

                if ((requestType == 2 || requestType == 5 || requestType == 3) && data.GetIsSyngentaPack == 26) {
                    vm.showWarningMessage = true;
                }
                else {
                    vm.showWarningMessage = false;
                }

                if (requestType != 2) {
                    vm.showFastRecmd = false;
                } else {
                    vm.showFastRecmd = true;
                }

                //check if page is disabled based on status
                if (data.IsPageDisable == true) {
                    vm.FFPOutsideEAMEDisabled = data.FFPOutsideEAMEDisabled;
                    vm.GSAPSystemCodeSetupDisabled = data.GSAPSystemCodeSetupDisabled;
                    vm.ERPSystemCodeSetupDisabled = data.ERPSystemCodeSetupDisabled;
                    vm.SAPCodeSourcePlantDisabled = data.SAPCodeSourcePlantDisabled;
                    vm.ProcurementTypeDisabled = data.ProcurementTypeDisabled;
                    vm.FFPMRPControllerNameDisabled = data.FFPMRPControllerNameDisabled;
                    vm.FFPMRPControllerCodeDisabled = data.FFPMRPControllerCodeDisabled;
                    vm.ReleventAPODisabled = data.ReleventAPODisabled;
                    vm.SupplyResponseDisabled = data.SupplyResponseDisabled;
                    vm.GSAPHubPlantCode1Disabled = data.GSAPHubPlantCode1Disabled;
                    vm.SupplyPlant1Disabled = data.SupplyPlant1Disabled;
                    vm.HubMRPControllerName1Disabled = data.HubMRPControllerName1Disabled;
                    vm.HubMRPControllerCode1Disabled = data.HubMRPControllerCode1Disabled;
                    vm.PurchaseNumber1Disabled = data.PurchaseNumber1Disabled;
                    vm.SCPCommentsDisabled = data.SCPCommentsDisabled;
                    vm.GSAPHubPlantCode2Disabled = data.GSAPHubPlantCode2Disabled;
                    vm.SupplyPlant2Disabled = data.SupplyPlant2Disabled;
                    vm.HubMRPControllerName2Disabled = data.HubMRPControllerName2Disabled;
                    vm.HubMRPControllerCode2Disabled = data.HubMRPControllerCode2Disabled;
                    vm.PurchaseNumber2Disabled = data.PurchaseNumber2Disabled;
                    vm.CompletedDateDisabled = data.CompletedDateDisabled;
                    vm.SaveDisabled = data.SaveDisabled;
                    vm.SubmitDisabled = data.SubmitDisabled;

                } else {
                    vm.SubmitDisabled = data.SubmitDisabled;
                }
                return;
            }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in GetSCP method of SCRSCP-JS' });
        })

    /*********************************************************************************************************/
    //Controls management
    /*********************************************************************************************************/
    vm.displayDepOnFFP = function () {
        console.log(vm.GetSelectedFFPOutsideEAME);
        if (vm.GetSelectedFFPOutsideEAME == 'SELECT' || vm.GetSelectedFFPOutsideEAME == '25') {
            vm.GSAPSystemCodeSetupDisabled = false;
            vm.ERPSystemCodeSetupDisabled = false;
            vm.SAPCodeSourcePlantDisabled = false;
            vm.ProcurementTypeDisabled = false;
            vm.FFPMRPControllerNameDisabled = false;
            vm.FFPMRPControllerCodeDisabled = false;
            vm.ReleventAPODisabled = false;
            vm.SupplyResponseDisabled = false;
            vm.SCPCommentsDisabled = false;
            //HUB Plant details
            vm.GSAPHubPlantCode1Disabled = true;
            vm.SupplyPlant1Disabled = true;
            vm.HubMRPControllerName1Disabled = true;
            vm.HubMRPControllerCode1Disabled = true;
            vm.PurchaseNumber1Disabled = true;
            //2nd HUB Plant details-if required
            vm.GSAPHubPlantCode2Disabled = true;
            vm.SupplyPlant2Disabled = true;
            vm.HubMRPControllerName2Disabled = true;
            vm.HubMRPControllerCode2Disabled = true;
            vm.PurchaseNumber2Disabled = true;
            vm.CompletedDateDisabled = true;

        } else {
            vm.GSAPSystemCodeSetupDisabled = true;
            vm.ERPSystemCodeSetupDisabled = true;
            vm.SAPCodeSourcePlantDisabled = true;
            vm.ProcurementTypeDisabled = true;
            vm.FFPMRPControllerNameDisabled = true;
            vm.FFPMRPControllerCodeDisabled = true;
            vm.ReleventAPODisabled = true;
            vm.SupplyResponseDisabled = true;
            vm.SCPCommentsDisabled = true;
            //HUB Plant details
            vm.GSAPHubPlantCode1Disabled = false;
            vm.SupplyPlant1Disabled = false;
            vm.HubMRPControllerName1Disabled = false;
            vm.HubMRPControllerCode1Disabled = false;
            vm.PurchaseNumber1Disabled = false;
            //2nd HUB Plant details-if required
            vm.GSAPHubPlantCode2Disabled = false;
            vm.SupplyPlant2Disabled = false;
            vm.HubMRPControllerName2Disabled = false;
            vm.HubMRPControllerCode2Disabled = false;
            vm.PurchaseNumber2Disabled = false;
            vm.CompletedDateDisabled = false;
            if (vm.GSAPSystemCodeSetupDisabled == true) {
                vm.GSAPSystemCodeSetupDisabled = false;
            }

            if (vm.ERPSystemCodeSetupDisabled == true) {
                vm.ERPSystemCodeSetupDisabled = false;
            }
        }
    }

    var requestId = localStorage.getItem('name');
    var requestTypeName = localStorage.getItem('type');

    /*********************************************************************************************************/
    //Save and Submit events for SCP request as well for workflow redirection
    /*********************************************************************************************************/
    vm.saveSCP = function () {
        vm.isEAME = false;
        var isValid = $scope.validateSCP();
        if (isValid) {
            var scp = {
                GetSystemCodeSetup: vm.GetSystemCodeSetup,
                GetSupplyPlant2: vm.GetSupplyPlant2,
                GetSupplyPlant1: vm.GetSupplyPlant1,
                GetSubmitedDate: vm.GetSubmitedDate, //System.DateTime
                GetSCPName: vm.GetSCPName,
                GetSCPComments: vm.GetSCPComments,
                GetReleventAPO: vm.GetReleventAPO,
                GetPurchaseNumber2: vm.GetPurchaseNumber2,
                GetPurchaseNumber1: vm.GetPurchaseNumber1,
                GetHubMRPControllerName2: vm.GetHubMRPControllerName2,
                GetHubMRPControllerName1: vm.GetHubMRPControllerName1,
                GetHubMRPControllerCode2: vm.GetHubMRPControllerCode2,
                GetHubMRPControllerCode1: vm.GetHubMRPControllerCode1,
                GetLLProcurementType: vm.GetLLProcurementType,
                GetLateLabelingId: vm.GetLateLabelingId,
                GetLLMRPControllerName: vm.GetLLMRPControllerName,
                GetLLMRPControllerCode: vm.GetLLMRPControllerCode,
                GetLLSupplyResponse: vm.GetLLSupplyResponse,
                GetLLReleventAPO: vm.GetLLReleventAPO,
                GetFFPMRPControllerName: vm.GetFFPMRPControllerName,
                GetFFPMRPControllerCode: vm.GetFFPMRPControllerCode,
                GetCompletedDate: vm.time2SCP,   //System.DateTime
                GetSCPID: vm.GetSCPID,
                GetOtherData: vm.GetOtherData,
                GetSourcePlant: vm.GetSourcePlant,
                GetIsSyngentaPack: vm.GetIsSyngentaPack,
                GetSelectedLLSAPCodeSourcePlant: vm.GetSelectedLLSAPCodeSourcePlant == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedSAPCodeSourcePlant: vm.GetSelectedSAPCodeSourcePlant == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedLLProcurementType: vm.GetSelectedLLProcurementType == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedProcurementType: vm.GetSelectedProcurementType == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedLLSupplyResponse: vm.GetSelectedLLSupplyResponse == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedSupplyResponse: vm.GetSelectedSupplyResponse == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedGSAPHubPlantCode1: vm.GetSelectedGSAPHubPlantCode1 == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedGSAPHubPlantCode2: vm.GetSelectedGSAPHubPlantCode2 == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedlateLabelingId: vm.GetSelectedlateLabelingId == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedFFPOutsideEAME: vm.GetSelectedFFPOutsideEAME,
                RequestId: requestId
            };
            console.log(requestId);
            $http.post('SCP/Save', scp).success(function (data) {
                vm.showOperationMsgPart(data.ResultMsg);
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saveSCP method of SCRSCP-JS' });
            });
        }
    };

    $scope.SaveAndGo = function (data) {
        vm.NextTabName = data.NextTabName;
        vm.queryString = data.QueryString;
        if (data.NextTabName == 'Search') {
            $state.go("SearchExistingRequest");
        } else if (data.NextTabName == 'errorpage') {
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: vm.queryString });
        } else {
            $rootScope.$broadcast('NextTabName', vm.NextTabName);
            $rootScope.$broadcast('queryString', vm.queryString);
        }
    }
    var requestId = localStorage.getItem('name');
    var requestTypeName = localStorage.getItem('type');
    vm.submitSCP = function () {
        vm.isEAME = false;
        var isValid = $scope.validateSCP();
        if (isValid) {
            var scp = {
                GetSystemCodeSetup: vm.GetSystemCodeSetup,
                GetSupplyPlant2: vm.GetSupplyPlant2,
                GetSupplyPlant1: vm.GetSupplyPlant1,
                GetSubmitedDate: vm.GetSubmitedDate, //System.DateTime
                GetSCPName: vm.GetSCPName,
                GetSCPComments: vm.GetSCPComments,
                GetReleventAPO: vm.GetReleventAPO,
                GetPurchaseNumber2: vm.GetPurchaseNumber2,
                GetPurchaseNumber1: vm.GetPurchaseNumber1,
                GetHubMRPControllerName2: vm.GetHubMRPControllerName2,
                GetHubMRPControllerName1: vm.GetHubMRPControllerName1,
                GetHubMRPControllerCode2: vm.GetHubMRPControllerCode2,
                GetHubMRPControllerCode1: vm.GetHubMRPControllerCode1,
                GetLLProcurementType: vm.GetLLProcurementType,
                GetLateLabelingId: vm.GetLateLabelingId,
                GetLLMRPControllerName: vm.GetLLMRPControllerName,
                GetLLMRPControllerCode: vm.GetLLMRPControllerCode,
                GetLLSupplyResponse: vm.GetLLSupplyResponse,
                GetLLReleventAPO: vm.GetLLReleventAPO,
                GetFFPMRPControllerName: vm.GetFFPMRPControllerName,
                GetFFPMRPControllerCode: vm.GetFFPMRPControllerCode,
                GetCompletedDate: vm.GetCompletedDate,   //System.DateTime
                GetSCPID: vm.GetSCPID,
                GetOtherData: vm.GetOtherData,
                GetSourcePlant: vm.GetSourcePlant,
                GetIsSyngentaPack: vm.GetIsSyngentaPack,
                GetSelectedLLSAPCodeSourcePlant: vm.GetSelectedLLSAPCodeSourcePlant == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedSAPCodeSourcePlant: vm.GetSelectedSAPCodeSourcePlant == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedLLProcurementType: vm.GetSelectedLLProcurementType == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedProcurementType: vm.GetSelectedProcurementType == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedLLSupplyResponse: vm.GetSelectedLLSupplyResponse == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedSupplyResponse: vm.GetSelectedSupplyResponse == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedGSAPHubPlantCode1: vm.GetSelectedGSAPHubPlantCode1 == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedGSAPHubPlantCode2: vm.GetSelectedGSAPHubPlantCode2 == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedlateLabelingId: vm.GetSelectedlateLabelingId == 'SELECT' ? null : vm.GetSelectedLLSAPCodeSourcePlant,
                GetSelectedFFPOutsideEAME: vm.GetSelectedFFPOutsideEAME,
                RequestId: requestId
            };

            $http.post('SCP/Submit', scp).success(function (data) {
                console.log(data);

                if (data.ResultCode == 1) {
                    var nextRequestType = '';
                    var nextTabCode = '';
                    if (requestType == 1) {
                        nextRequestType = 'EPT';
                        nextTabCode = 'SCP_EPT';
                    }
                    else if (requestType == 2) {
                        nextRequestType = 'New Pack';
                        nextTabCode = 'SCP_NP';
                    }
                    else if (requestType == 3) {
                        nextRequestType = 'Country Add';
                        nextTabCode = 'SCP_CA';
                    }
                    else if (requestType == 4) {
                        nextRequestType = 'Supply Chain';
                        nextTabCode = 'SCP_SC';
                    }
                    else if (requestType == 5) {
                        nextRequestType = 'Combi Pack';
                        nextTabCode = 'SCP_CMBI';
                    }
                    else if (requestType == 6) {
                        nextRequestType = 'PFR';
                        nextTabCode = 'SCP_PFR';
                    }
                    if (nextRequestType != '' && nextTabCode != '') {
                        $http.get('NewPackRequest/GetNextPage?requestId=' + requestId + '&requestType=' + nextRequestType + '&tabCode=' + nextTabCode)
                            .success(function (data) {
                                console.log(data);
                                //$state.go("SupplyChainRequest." + data.NextTabName, { QueryString: data.QueryString });
                                $scope.SaveAndGo(data);
                            });
                    }
                }
                else {
                    $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in submitSCP method of SCRSCP-JS' });
                }
                vm.showOperationMsgPart(data.ResultMsg);
            }).error(function (data) {
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in submitSCP method of SCRSCP-JS' });
            });
        }
    };

    /*********************************************************************************************************/
    //Controls management based on dropdown / radio button selection
    /*********************************************************************************************************/
    vm.LateLabellingSelectChangeFunc = function () {
        console.log("selectChange" + vm.GetSelectedlateLabelingId);

        if (vm.GetSelectedlateLabelingId == '26') {
            vm.LateLabellingPart = false;
        }
        else {
            vm.LateLabellingPart = true;
        }
    };

    vm.CodeSetUpERPSelectChangeFunc = function () {
        console.log("selectChange" + vm.GetSelectedlateLabelingId);
        if (vm.GetSystemCodeSetup == 0) {
            //GSAP is checked
            vm.SAPCodeSourcePlantDisabled = false;
            vm.ProcurementTypeDisabled = false;
            vm.FFPMRPControllerNameDisabled = false;
            vm.FFPMRPControllerCodeDisabled = false;
            vm.ReleventAPODisabled = false;
            vm.SupplyResponseDisabled = false;
        } else {
            //Local ERP is checked
            vm.SAPCodeSourcePlantDisabled = true;
            vm.GetSelectedSAPCodeSourcePlant = '';

            vm.ProcurementTypeDisabled = true;
            vm.GetSelectedProcurementType = '';

            vm.FFPMRPControllerNameDisabled = true;
            vm.GetFFPMRPControllerName = '';

            vm.FFPMRPControllerCodeDisabled = true;
            vm.GetFFPMRPControllerCode = '';

            vm.ReleventAPODisabled = true;
            vm.GetReleventAPO = '';

            vm.SupplyResponseDisabled = true;
            vm.GetSelectedSupplyResponse = '';
        }
    }

    vm.FFPSelectedChanged = function () {
        if (vm.GetSelectedFFPOutsideEAME == 'SELECT') {
            vm.isEAME = true;
        }
        else {
            vm.isEAME = false;
            vm.displayDepOnFFP();
        }
    }

    vm.isEAME = false;
    $scope.validateSCP = function () {
        var isValid = true;

        if (vm.GetSelectedFFPOutsideEAME == 'SELECT') {
            vm.isEAME = true;
            isValid = false;
        }

        return isValid;
    }
});