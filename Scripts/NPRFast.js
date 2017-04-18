angular.module('ERMS').controller("NPRFast", function ($scope, $filter, $http, $state, $stateParams, $rootScope) {
    var vm = this;
    var requestType;
/*********************************************************************************************************/
//Initialization/Popualtion of default controls and enabling of controls based on type of request
/*********************************************************************************************************/
    vm.showStateName = 'Fast';
    $rootScope.$broadcast('SCRNameto-parent', vm.showStateName);
    vm.initData = function () {
        vm.fastContact = '';
        vm.sourcePlant = '';
        vm.comments = '';
        vm.completedDate = '';
        vm.requestApprovedSelected = 'SELECT';
        vm.confirmSourceSelected = 'SELECT';
        vm.fastContactDisabled = false;
        vm.RequestApprovedDisabled = false;
        vm.confirmSourceDisabled = false;
        vm.sourcePlantDisabled = false;
        vm.CommentsReadOnly = false;
        vm.CompleteDateDisabled = false;
        vm.SaveDisabled = false;
        vm.SubmitDisabled = false;
        vm.NPRFastMessage2Show = false;
        vm.NPRFastMessage1 = '';
        vm.username = '';
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

    var queryString = $stateParams.QueryString;
    console.log('Query String: ' + queryString);
    if (queryString == '') {
        queryString = 'requestId=' + requestId + '&requestType=' + requestType;
    } else {
        queryString += '&requestType=' + requestType;
    }

/*********************************************************************************************************/
//Getting FAST request details to be populated on page load
/*********************************************************************************************************/
    $http.get('FAST_NewPack/GetNPRFast?'+ queryString)
        .success(function (data) {
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else {
            vm.fastContact = data.GetFastContact;
        
            if (data.GetSelectedRequestApproved == "0" || data.GetSelectedRequestApproved == null) {
                vm.requestApprovedSelected = 'SELECT';
            }
            else {
                vm.requestApprovedSelected = data.GetSelectedRequestApproved;
            }
           
            if (data.GetSelectedConfirmSource == "0" || data.GetSelectedConfirmSource == null) {
                vm.confirmSourceSelected = 'SELECT';
            }
            else {
                vm.confirmSourceSelected = data.GetSelectedConfirmSource;
            }
            vm.sourcePlant = data.GetSourcePlant;
            vm.comments = data.GetComments;
            vm.completedDate = new Date(data.GetCompletedDate);
            vm.requestApproved = data.GetRequestApproved;
            vm.confirmSource = data.GetConfirmSource;
            vm.fastId = data.GetFastId;
            vm.otherData = data.GetOtherData;
            vm.NPRFastMessage1 = data.NPRFastMessage1;

            vm.fastContactDisabled = data.FastContactDisabled;
            vm.RequestApprovedDisabled = data.RequestApprovedDisabled;
            vm.sourcePlantDisabled = data.SourcePlantDisabled;
            vm.CommentsReadOnly = data.CommentsReadOnly;
            vm.CompleteDateDisabled = data.CompleteDateDisabled;
            vm.SaveDisabled = data.SaveDisabled;
            vm.SubmitDisabled = data.SubmitDisabled;
            vm.confirmSourceDisabled = data.ConfirmSourceDisabled;
            vm.NPRFastMessage2Show = data.NPRFastMessage2Show;
            vm.requestid = data.requestId;
            vm.username = data.username;
            return;
            }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in EPM' });
        })

/*********************************************************************************************************/
//Save and Submit events for EPM request as well for workflow redirection
/*********************************************************************************************************/
    vm.saveFast = function () {
        vm.isReqApprv = false;
        vm.isConfSrc = false;
        vm.isSrcPlnt = false;
        var isValid = $scope.validateFast();
        if (isValid) {
            var fast = {
                GetFastId: vm.fastId,
                GetComments: vm.comments,
                GetSelectedConfirmSource: vm.confirmSourceSelected == 'SELECT' ? null : vm.confirmSourceSelected,
                GetSelectedRequestApproved: vm.requestApprovedSelected == 'SELECT' ? null : vm.requestApprovedSelected,
                GetSourcePlant: vm.sourcePlant,
                requestId: vm.requestid
            };
            $http.post('FAST_NewPack/SaveNPRFast', fast).success(function (data) {
                vm.showOperationMsgPart(data.ResultMsg);
            }).error(function (data) {
                console.log("error" + data);
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
    vm.submitFast = function () {
        vm.isReqApprv = false;
        vm.isConfSrc = false;
        vm.isSrcPlnt = false;
        var isValid = $scope.validateFast();
        if (isValid) {
            var fast = {
                GetFastId: vm.fastId,
                GetComments: vm.comments,
                GetSelectedConfirmSource: vm.confirmSourceSelected == 'SELECT' ? null : vm.confirmSourceSelected,
                GetSelectedRequestApproved: vm.requestApprovedSelected == 'SELECT' ? null : vm.requestApprovedSelected,
                GetSourcePlant: vm.sourcePlant,
                requestId: vm.requestid
            };
            $http.post('FAST_NewPack/SubmitNPRFast', fast).success(function (data) {
                if (data.ResultCode == 1) {
                    var nextRequestType = '';
                    var nextTabCode = '';
                    if (requestType == 2) {
                        nextRequestType = 'New Pack';
                        nextTabCode = 'FAST_NP';
                    }

                    if (nextRequestType != '' && nextTabCode != '') {
                        $http.get("NewPackRequest/GetNextPage?requestId=" + requestId + "&requestType=" + nextRequestType + "&tabCode=" + nextTabCode)
                            .success(function (data) {
                                //$state.go("SupplyChainRequest." + data.NextTabName, { QueryString: data.QueryString });
                                $scope.SaveAndGo(data);
                            });
                    }
                }
                else {

                }
                vm.showOperationMsgPart(data.ResultMsg);
            }).error(function (data) {
                console.log("error" + data);
            });
        }
    };

/*********************************************************************************************************/
//Population of comments text are auto based on approved status selected
/*********************************************************************************************************/
    vm.changeForComment = function () {
        if (!vm.RequestApprovedDisabled) {
            if (vm.requestApprovedSelected == 'SELECT') {
                vm.isReqApprv = true;
            }
            else {
                vm.isReqApprv = false;
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
    }

    vm.isReqApprv = false;
    vm.isConfSrc = false;
    vm.isSrcPlnt = false;

    vm.ConfSrc = function () {
        if (!vm.confirmSourceDisabled) {
            if (vm.confirmSourceSelected == 'SELECT') {
                vm.isConfSrc = true;
            }
            else {
                vm.isConfSrc = false;
            }
        }
    }

    vm.SrcPlnt = function () {
        if (!vm.sourcePlantDisabled) {
            if (vm.sourcePlant == undefined || vm.sourcePlant == "") {
                vm.isSrcPlnt = true;
            }
            else {
                vm.isSrcPlnt = false;
            }
        }
    }

    $scope.validateFast = function () {
        var isValid = true;
        if (!vm.RequestApprovedDisabled) {
            if (vm.requestApprovedSelected == 'SELECT') {
                vm.isReqApprv = true;
                isValid = false;
            }
        }
        if (!vm.confirmSourceDisabled) {
            if (vm.confirmSourceSelected == 'SELECT') {
                vm.isConfSrc = true;
                isValid = false;
            }
        }
        if (!vm.sourcePlantDisabled) {
            if (vm.sourcePlant == undefined) {
                isValid = false;
                vm.isSrcPlnt = true;
            }
        }
        return isValid;
    }
});

