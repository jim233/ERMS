angular.module('ERMS').controller("NPREPM", function ($scope, $filter, $http, $state, $stateParams, $rootScope) {
    var vm = this;
    var requestType;

    // Display Text Based on Region
    var userRegion = sessionStorage.getItem('UserRegion');

    if (userRegion && userRegion == 'LATAM') {
        $scope.EPMTitle = 'LATAM Product Manager First Approval';
        $scope.FinalEPMTitle = 'LATAM Product Manager Final Approval';
        $scope.FieldName = 'LPM Name';
    }
    else {
        $scope.EPMTitle = 'European Product Manager First Approval';
        $scope.FinalEPMTitle = 'European Product Manager Final Approval';
        $scope.FieldName = 'EPM Name';
    }

/*********************************************************************************************************/
//Initialization/Popualtion of default controls and enabling of controls based on type of request
/*********************************************************************************************************/
    vm.showStateName = 'EPM';
    $rootScope.$broadcast('SCRNameto-parent', vm.showStateName);
    vm.initData = function () {
        vm.epmName = '';
        vm.approvalStep = '';
        vm.requestApproved = '';
        vm.coreRange = '';
        vm.comments = '';
        vm.completedDate = '';
        vm.requestApprovedSelected = 'SELECT';
        vm.requestType = '';
        vm.otherData = '';
        vm.getEBMId = '';
        vm.operationMsg = '';
        vm.username = '';
        vm.showLoadingPage = false;
        vm.EpmNameDisabled = false;
        vm.CommentsReadOnly = false;
        vm.CoreRangeDisabled = false;
        vm.RequestApprovedDisabled = false;
        vm.SaveDisabled = false;
        vm.SubmitDisabled = false;
        vm.CompleteDateDisabled = false;
        vm.showOperationMsg = false;
        vm.showFirstApprovalMsg = false;
        vm.showFinalApprovalMsg = false;
        vm.AddToCoreRangeShow = false;

    }
    vm.initData();

/*********************************************************************************************************/
//To check if its from first EPM or final EPM
/*********************************************************************************************************/
    if (sessionStorage.getItem('FromEPM')) {
        vm.ShowAddtoCOreFirstFInal = sessionStorage.getItem('FromEPM');
    }

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
    }else if (requestTypeName == 'New Pack') {
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

    var queryString = $stateParams.QueryString;    

    if (queryString == '') {
        queryString = 'requestId=' + requestId + '&approvalStep=1&requestType=' + requestType;
    } else {
        queryString += '&requestType=' + requestType;
    }

/*********************************************************************************************************/
//Date format
/*********************************************************************************************************/
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

/*********************************************************************************************************/
//Getting EPM request details to be populated on page load
/*********************************************************************************************************/
    $http.get('EPM/GetEPM?' + queryString)
        .success(function (data) {
            console.log(data);            
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else {
                $scope.getValidData = true;
                vm.epmName = data.GetEBMName;
                vm.approvalStep = data.GetApproveStep;
                vm.requestApproved = data.GetRequestApproved;
                if (data.GetSelectedRequestApproved == "0" || data.GetSelectedRequestApproved == null) {
                    vm.requestApprovedSelected = 'SELECT';
                }
                else {
                    vm.requestApprovedSelected = data.GetSelectedRequestApproved;
                }
                vm.coreRange = data.GetCoreRange;
                vm.comments = data.GetComments;
                //vm.completedDate = data.GetCompletedDate;
                vm.completedDate = new Date(data.GetCompletedDate);
                if (vm.completedDate) {
                    $scope.time2 = vm.completedDate.Format("yyyy-MM-dd");

                    if ($scope.time2 == '1-01-01') {
                        $('#sandbox-container-EPM input').datepicker({ autoclose: true, gotoCurrent: true, });
                        $('#sandbox-container-EPM input').datepicker("setDate", 'now');
                    } else {
                        $('#sandbox-container-EPM input').datepicker({ autoclose: true, format: "yyyy-mm-dd", });
                        $('#sandbox-container-EPM input').datepicker("setDate", $scope.time2);
                    }
                }
          
                vm.requestType = data.RequestType;
                vm.otherData = data.GetOtherData;
                vm.getEBMId = data.GetEBMId;
                vm.EpmNameDisabled = data.EpmNameDisabled;
                vm.CommentsReadOnly = data.CommentsReadOnly;
                vm.CoreRangeDisabled = data.CoreRangeDisabled;
                vm.RequestApprovedDisabled = data.RequestApprovedDisabled;
                vm.SaveDisabled = data.SaveDisabled;
                vm.SubmitDisabled = data.SubmitDisabled;
                vm.CompleteDateDisabled = data.CompleteDateDisabled;
                vm.showFirstApprovalMsg = data.ShowFirstApprovalMsg;
                vm.showFinalApprovalMsg = data.ShowFinalApprovalMsg;
                vm.username = data.username;
                if (requestType == 3 || requestType == 6) {
                    vm.AddToCoreRangeShow = false;
                }
                else {
                    vm.AddToCoreRangeShow = true;
                }
                if (requestType == 5) {
                    if (vm.ShowAddtoCOreFirstFInal) {
                        vm.AddToCoreRangeShow = true;
                        sessionStorage.removeItem('FromEPM');
                    }
                    else {
                        vm.AddToCoreRangeShow = false;
                    }
                }
                return;
            }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in GetEPM method of NPREPM-JS' });
        })

    vm.isReqAprv = false;
    $scope.validateEPM = function () {
        var isValid = true;

        if (vm.requestApprovedSelected == 'SELECT') {
            vm.isReqAprv = true;
            isValid = false;
        }

        return isValid;
    }
/*********************************************************************************************************/
//Save and Submit events for EPM request as well for workflow redirection
/*********************************************************************************************************/
    vm.saveEPM = function () {
        vm.isReqAprv = false;
        var isValid = $scope.validateEPM();
        if (isValid) {
            if ($scope.fnValidateEBM()) {
                var epm = {
                    RequestId: requestId,
                    GetEBMId: vm.getEBMId,
                    GetEBMName: vm.getEBMId,  //Martin, 2016-08-08, logic from old version
                    //GetRequestApproved: vm.requestApprovedSelected.Value,
                    GetRequestApproved: vm.requestApprovedSelected == 'SELECT' ? null : vm.requestApprovedSelected,
                    GetCoreRange: vm.coreRange,
                    GetComments: vm.comments,
                    ApprovalStep: 1
                };
                $http.post('EPM/Save', epm).success(function (data) {
                    console.log(data);
                    if (data.ResultCode == -1) {
                        $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saving EPM details in NPREPM-JS' });
                    }
                    else {
                        vm.showOperationMsgPart(data.ResultMsg);
                        console.log(vm.operationMsg);
                    }
                }).error(function (data) {
                    console.log("error" + data);
                    $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saving EPM details in NPREPM-JS' });
                });
            }
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

    vm.submitEPM = function () {
        vm.isReqAprv = false;
        var isValid = $scope.validateEPM();
        if (isValid) {
            if ($scope.fnValidateEBM()) {
                var epm = {
                    RequestId: requestId,
                    GetEBMId: vm.getEBMId,
                    GetEBMName: vm.getEBMId,  //Martin, 2016-08-08, logic from old version
                    //GetRequestApproved: vm.requestApproved.Value,
                    GetRequestApproved: vm.requestApprovedSelected == 'SELECT' ? null : vm.requestApprovedSelected,
                    GetCoreRange: vm.coreRange,
                    GetComments: vm.comments,
                    ApprovalStep: 1
                };
                $http.post('EPM/Submit', epm).success(function (data) {
                    console.log(data);
                    if (data.ResultCode == -1) {
                        $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saving EPM details' });
                    }
                    else if (data.ResultCode == 1) {
                        var nextRequestType = '';
                        var nextTabCode = '';

                        if (requestType == 3) {
                            nextRequestType = 'Country Add';
                            nextTabCode = 'EPM_CA';
                        }
                        else if (requestType == 2) {
                            nextRequestType = 'New Pack';
                            nextTabCode = 'EPM_NP';
                        }
                            //begin added by amy on apr 21
                        else if (requestType == 6) {
                            nextRequestType = 'PFR';
                            nextTabCode = 'EPM_PFR';
                        }
                            //end added by amy on apr 21
                        else if (requestType == 5) {
                            if (vm.approvalStep == '1') {
                                nextRequestType = 'Combi Pack';
                                nextTabCode = 'EPM1_CMBI';
                            }
                            else if (vm.approvalStep == '2') {
                                nextRequestType = 'Combi Pack';
                                nextTabCode = 'EPM2_CMBI';
                            }
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
                        $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in NPREPM.JS' });
                    }
                    vm.showOperationMsgPart(data.ResultMsg);
                }).error(function (data) {
                    console.log("error" + data);
                    $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in NPREPM.JS' });
                });
            }
        }
    };

/*********************************************************************************************************/
//Population of comments text are auto based on approved status selected
/*********************************************************************************************************/
    vm.changeForComment = function () {
        if (vm.requestApprovedSelected == 'SELECT') {
            vm.isReqAprv = true;
        }
        else {
            vm.isReqAprv = false;


            if (vm.requestApprovedSelected == '11' && vm.comments != null) {
                var myDate = new Date();
                vm.comments = vm.comments + '\n' + 'Yes' + '\n' + 'Stated by: ' + vm.username + '\n' + 'On: ' + myDate.toLocaleString() + '  automatically.'
            }
            if (vm.requestApprovedSelected == '11' && vm.comments == null) {
                var myDate = new Date();
                vm.comments = 'Yes' + '\n' + 'Stated by: ' + vm.username + '\n' + 'On: ' + myDate.toLocaleString() + '  automatically.'
            }
        }
    }
  


/*********************************************************************************************************/
//Validation related methods
/*********************************************************************************************************/
    //Testing if validation works this way
    $scope.fnValidateEBM = function () {
        var success = true;
        //if (vm.requestApprovedSelected == 'SELECT') {
        //    vm.showOperationMsgPart("Please select a Request Approved value");
        //    success = false;
        //}
        if (vm.AddToCoreRangeShow == true && vm.requestApprovedSelected != 3 && success != false) {
            if (vm.coreRange == null) {
                vm.showOperationMsgPart("Please select whether it is Add To Core Range or not");
                success= false;
            }
        }
        return success;
    }
});