angular.module('ERMS').controller("SCRPackEngineer", function ($scope, $filter, $http, $state, $stateParams, $rootScope, $modal, $log) {
    var vm = this;
    var requestType;

    /*********************************************************************************************************/
    //Initialization/Popualtion of default controls and enabling of controls based on type of request
    /*********************************************************************************************************/
    vm.showStateName = 'Pack Engineer';
    $rootScope.$broadcast('SCRNameto-parent', vm.showStateName);
    vm.initData = function () {
        vm.packTechName = '';
        vm.ESTPackCompDate = '';
        vm.packagingComments = '';
        vm.BPSDesignCode = '';
        vm.ESTWorkInvolved = '';
        vm.BPSAgiCode = '';
        vm.NSUCode = '';
        vm.BottleFormulationSelected = 'SELECT';
        vm.packTechNameDisabled = false;
        vm.ESTPackCompDateDisabled = false;
        vm.submitStep1Disabled = false;
        vm.saveStep1Disabled = false;
        vm.packagingCommentsReadOnly = false;
        vm.BPSDesignCodeDisabled = false;
        vm.BottleFormulationDisabled = false;
        vm.ESTWorkInvolvedDisabled = false;
        vm.saveStep2Disabled = false;
        vm.BPSAgiCodeDisabled = false;
        vm.NSUCodeDisabled = false;
        vm.submitStep3Disabled = false;
        vm.saveStep3Disabled = false;
        vm.packTech_EPTMessageShow = false;
        vm.EPMMessage = '';
        vm.FASTMessage = '';
        vm.SCTeamMessage = '';
        vm.EPMMessageShow = true;
        vm.FASTMessageShow = true;
        vm.SCTeamMessageShow = true;
        vm.hdnDomain = '';
        vm.hdnUserId = '';
        vm.hdnName = '';
        vm.hdnFirstName = '';
        vm.hdnEmail = '';
        vm.hdnLastName = '';
        vm.hdnUrl = '';
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
        queryString = 'requestId=' + requestId;
    }
    /*********************************************************************************************************/
    //Getting Pack engineer request details to be populated on page load
    /*********************************************************************************************************/
    $http.get('PackEngineer/GetPackEngineer?' + queryString)
        .success(function (data) {
            console.log(data);
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else {
                vm.packTechName = data.GetPackTechName;
                vm.ESTPackCompDate = new Date(data.GetESTPackCompDate);
                vm.packagingComments = data.GetPackingComments;
                vm.BPSDesignCode = data.GetBPSDesignCode;
                if (data.GetSelectedFormulationADRCompatible == "0" || data.GetSelectedFormulationADRCompatible == null) {
                    vm.BottleFormulationSelected = 'SELECT';
                }
                else {
                    vm.BottleFormulationSelected = data.GetSelectedFormulationADRCompatible;
                }
                vm.BottleFormulation = data.GetFormulationADRCompatibleList;
                vm.ESTWorkInvolved = data.GetESTWorkInvolved;
                vm.BPSAgiCode = data.GetBPSAgiCode;
                vm.NSUCode = data.GetNSUCode;
                vm.requestid = data.requestId;
                vm.hdnOtherData = data.GetOtherData;
                vm.completedDate = new Date(data.GetCompletedDate);
                vm.saveStep2Disabled = data.SaveStep2Disabled;
                vm.ESTPackCompDateDisabled = data.ESTPackCompDateDisabled;
                vm.BPSDesignCodeDisabled = data.BPSDesignCodeDisabled;
                vm.BottleFormulationDisabled = data.FormulationADRCompatibleDisabled;
                vm.ESTWorkInvolvedDisabled = data.ESTWorkInvolvedDisabled;
                vm.BPSAgiCodeDisabled = data.BPSAgiCodeDisabled;
                vm.NSUCodeDisabled = data.NSUCodeDisabled;
                vm.completedDateDisabled = data.CompletedDateDisabled;
                vm.submitStep1Disabled = data.SubmitStep1Disabled;
                vm.saveStep1Disabled == data.SubmitStep1Disabled;
                vm.SaveStep3Disabled = data.SaveStep3Disabled;
                vm.SubmitStep3Disabled = data.SubmitStep3Disabled;
                vm.packTech_EPTMessageShow = data.packTech_EPTMessageShow;
                vm.EPMMessage = data.EPMMessage;
                vm.FASTMessage = data.FASTMessage;
                vm.SCTeamMessage = data.SCTeamMessage;
                vm.EPMMessageShow = data.EPMMessageShow;
                vm.FASTMessageShow = data.FASTMessageShow;
                vm.SCTeamMessageShow = data.SCTeamMessageShow;
                return;
            }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in GetPackEngineer method of SCRPackEngineer-JS' });
        })

    /*********************************************************************************************************/
    //Save and Submit events for Pack engineer request as well for workflow redirection
    /*********************************************************************************************************/
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

    vm.saveStep1 = function () {
        vm.isPkTechNme = false;
        var isValid = $scope.validateFast();
        if (isValid) {
            var PackEngineer1 = {
                GetESTPackCompDate: vm.ESTPackCompDate,
                GetPackingComments: vm.packagingComments,
                GetBPSDesignCode: vm.BPSDesignCode,
                GetSelectedFormulationADRCompatible: vm.BottleFormulationSelected == 'SELECT' ? null : vm.BottleFormulationSelected,
                GetESTWorkInvolved: vm.ESTWorkInvolved,
                GetBPSAgiCode: vm.BPSAgiCode,
                GetNSUCode: vm.NSUCode,
                requestId: vm.requestid
            };
            $http.post('PackEngineer/SavePackEngineer1', PackEngineer1).success(function (data) {
                console.log(data);
                if (data.ResultCode == 1) {
                    vm.showOperationMsgPart(data.ResultMsg);
                }
                else {
                    $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saveStep1 method of SCRPackEngineer-JS' });
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saveStep1 method of SCRPackEngineer-JS' });
            });
        }
    };

    vm.isPkTechNme = false;

    vm.PkTechNme=function()
    {
        if(!vm.packTechNameDisabled)
        {
            if (vm.packTechName == undefined || vm.packTechName == "") {
                vm.isPkTechNme = true;
            }
            else {
                vm.isPkTechNme = false;
            }
        }
    }

    vm.ValidateSCRPack = function () {
        var isValid = true;

        if (!vm.packTechNameDisabled) {
            if (vm.packTechName == undefined || vm.packTechName == "") {
                isValid = false;
                vm.isPkTechNme = true;
            }
        }
        return isValid;
    }

    vm.submitStep1 = function () {
        vm.isPkTechNme = false;
        var isValid = $scope.validateFast();
        if (isValid) {
            var PackEngineer1 = {
                GetESTPackCompDate: vm.ESTPackCompDate,
                GetPackingComments: vm.packagingComments,
                GetBPSDesignCode: vm.BPSDesignCode,
                GetSelectedFormulationADRCompatible: vm.BottleFormulationSelected == 'SELECT' ? null : vm.BottleFormulationSelected,
                GetESTWorkInvolved: vm.ESTWorkInvolved,
                GetBPSAgiCode: vm.BPSAgiCode,
                GetNSUCode: vm.NSUCode,
                requestId: vm.requestid
            };
            $http.post('PackEngineer/SubmitPackEngineer1', PackEngineer1).success(function (data) {
                if (data.ResultCode == 1) {
                    var nextRequestType = '';
                    var nextTabCode = '';
                    if (requestType == 1) {
                        nextRequestType = 'EPT';
                        nextTabCode = 'PE_EPT';
                    } else if (requestType == 2) {
                        nextRequestType = 'New Pack';
                        nextTabCode = 'PE_NP';
                    } else if (requestType == 4) {
                        nextRequestType = 'Supply Chain';
                        nextTabCode = 'PE_SC';
                    } else if (requestType == 5) {
                        nextRequestType = 'Combi Pack';
                        nextTabCode = 'PE_CMBI';
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
                    $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saveStep1 method of SCRPackEngineer-JS' });
                }
                vm.showOperationMsgPart(data.ResultMsg);
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saveStep1 method of SCRPackEngineer-JS' });
            });
        }
    };

    vm.saveStep2 = function () {
        var PackEngineer2 = {
            GetESTPackCompDate: vm.ESTPackCompDate,
            GetPackingComments: vm.packagingComments,
            GetBPSDesignCode: vm.BPSDesignCode,
            GetSelectedFormulationADRCompatible: vm.BottleFormulationSelected == 'SELECT' ? null : vm.BottleFormulationSelected,
            GetESTWorkInvolved: vm.ESTWorkInvolved,
            GetBPSAgiCode: vm.BPSAgiCode,
            GetNSUCode: vm.NSUCode,
            requestId: vm.requestid
        };
        $http.post('PackEngineer/SavePackEngineer', PackEngineer2).success(function (data) {
            vm.showOperationMsgPart(data.ResultMsg);
            console.log(vm.operationMsg);
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saveStep2 method of SCRPackEngineer-JS' });
        });
    };

    vm.saveStep3 = function () {
        var PackEngineer3 = {
            GetESTPackCompDate: vm.ESTPackCompDate,
            GetPackingComments: vm.packagingComments,
            GetBPSDesignCode: vm.BPSDesignCode,
            GetSelectedFormulationADRCompatible: vm.BottleFormulationSelected == 'SELECT' ? null : vm.BottleFormulationSelected,
            GetESTWorkInvolved: vm.ESTWorkInvolved,
            GetBPSAgiCode: vm.BPSAgiCode,
            GetNSUCode: vm.NSUCode,
            requestId: vm.requestid
        };
        $http.post('PackEngineer/SavePackEngineer3', PackEngineer3).success(function (data) {
            vm.showOperationMsgPart(data.ResultMsg);
            console.log(vm.operationMsg);
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saveStep3 method of SCRPackEngineer-JS' });
        });
    };

    vm.submitStep3 = function () {
        var PackEngineer3 = {
            GetESTPackCompDate: vm.ESTPackCompDate,
            GetPackingComments: vm.packagingComments,
            GetBPSDesignCode: vm.BPSDesignCode,
            GetSelectedFormulationADRCompatible: vm.BottleFormulationSelected == 'SELECT' ? null : vm.BottleFormulationSelected,
            GetESTWorkInvolved: vm.ESTWorkInvolved,
            GetBPSAgiCode: vm.BPSAgiCode,
            GetNSUCode: vm.NSUCode,
            requestId: vm.requestid
        };
        $http.post('PackEngineer/SubmitPackEngineer3', PackEngineer3).success(function (data) {
            console.log(data);
            if (data.ResultCode == 1) {
                var nextRequestType = '';
                var nextTabCode = '';
                if (requestType == 1) {
                    nextRequestType = 'EPT';
                    nextTabCode = 'PE_EPT';
                } else if (requestType == 2) {
                    nextRequestType = 'New Pack';
                    nextTabCode = 'PE_NP';
                } else if (requestType == 4) {
                    nextRequestType = 'Supply Chain';
                    nextTabCode = 'PE_SC';
                } else if (requestType == 5) {
                    nextRequestType = 'Combi Pack';
                    nextTabCode = 'PE_CMBI';
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
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in submitStep3 method of SCRPackEngineer-JS' });
            }
            vm.showOperationMsgPart(data.ResultMsg);
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in submitStep3 method of SCRPackEngineer-JS' });
        });
    };

    /**************************************************************************************************/
    //Function related to GAL picker
    /***************************************************************************************************/
    vm.open = function () {
        var a, b, c, d, e, f, g;
        var userDetails = PickAdd(a, b, c, d, e, f, '0', g);
        vm.hdnDomain = userDetails.Domain;
        vm.hdnUserId = userDetails.UserId;
        vm.Orginator = userDetails.FirstName + " " + userDetails.LastName;
        vm.hdnFirstName = userDetails.FirstName;
        vm.hdnEmail = userDetails.Email;
        vm.hdnLastName = userDetails.LastName;
        vm.packTechName = userDetails.FirstName + " " + userDetails.LastName;
    }
})