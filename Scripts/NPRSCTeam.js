angular.module('ERMS').controller("NPRSCTeam", function ($scope, $filter, $http, $state, $stateParams, $rootScope) {
    var vm = this;
    var requestType;

    /*********************************************************************************************************/
    //Initialization/Popualtion of default controls and enabling of controls based on type of request
    /*********************************************************************************************************/
    vm.showStateName = 'SC Team';
    $rootScope.$broadcast('SCRNameto-parent', vm.showStateName);
    vm.initData = function () {
        vm.PackHeadName = '';
        vm.PackHeadNameDisabled = false;
        vm.ApprovedSelected = 'SELECT';
        vm.ApprovedDisabled = false;
        vm.PackResSelected = 'SELECT';
        vm.PackResDisabled = false;
        vm.comments = '';
        vm.CommentsReadOnly = false;
        vm.Administrator = '';
        vm.AdministratorDisabled = false;
        vm.OutcomeSelected = 'SELECT';
        vm.OutcomeDisabled = false;
        vm.viewIssueLog = '';
        vm.viewIssueLogDisabled = false;
        vm.resolutionComments = '';
        vm.resolutionCommentsReadOnly = false;
        vm.Message3Show = false;
        vm.Message2Show = true;
        vm.Message1Show = true;
        vm.Message1 = '';
        vm.Message2 = '';
        vm.SaveDisabled = false;
        vm.SubmitDisabled = false;
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
        queryString = 'requestId=' + requestId;
    }

    /*********************************************************************************************************/
    //Getting SC Team request details to be populated on page load
    /*********************************************************************************************************/
    $http.get('SCTeam/GetNPRSCTeam?' + queryString)
        .success(function (data) {
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else {
                vm.requestid = data.requestId;
                vm.PackHeadName = data.GetPackTechnologyHead;
                vm.PackHeadNameDisabled = data.PackHeadNameDisabled;
                if (data.GetSelectedApproved == "0" || data.GetSelectedApproved == null) {
                    vm.ApprovedSelected = 'SELECT';
                }
                else {
                    vm.ApprovedSelected = data.GetSelectedApproved;
                }
                vm.ApprovedDisabled = data.ApprovedDisabled;
                vm.Approved = data.GetApproved;
                if (data.GetSelectedPackResponsibility == "0" || data.GetSelectedPackResponsibility == null) {
                    vm.PackResSelected = 'SELECT';
                }
                else {
                    vm.PackResSelected = data.GetSelectedPackResponsibility;
                }
                vm.PackResDisabled = data.PackResDisabled;
                vm.PackRes = data.GetPackResponsibility;
                vm.comments = data.GetComments;
                vm.CommentsReadOnly = data.CommentsReadOnly;
                vm.Administrator = data.GetAdministrator;
                vm.AdministratorDisabled = data.AdministratorDisabled;
                vm.Outcome = data.GetOutCome;
                if (data.GetSelectedOutcome == "0" || data.GetSelectedOutcome == null) {
                    vm.OutcomeSelected = 'SELECT';
                }
                else {
                    vm.OutcomeSelected = data.GetSelectedOutcome;
                }
                vm.OutcomeDisabled = data.OutcomeDisabled;
                //vm.viewIssueLog = data.viewIssueLog;
                //vm.viewIssueLogDisabled = data.viewIssueLogDisabled;
                vm.resolutionComments = data.GetResolutionComments;
                vm.resolutionCommentsReadOnly = data.resolutionCommentsReadOnly;
                vm.Message3Show = data.Message3Show;
                vm.Message2Show = data.Message2Show;
                vm.Message1Show = data.Message1Show;
                vm.Message1 = data.Message1;
                vm.Message2 = data.Message2;
                vm.SaveDisabled = data.btnSaveDisabled;
                vm.SubmitDisabled = data.btnSubmitDisabled;
                vm.hdnPackId = data.GetPackId;
                vm.username = data.username;
                return;
            }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in GetNPRSCTeam method of NPRSCTeam-JS' });
        })

    /*********************************************************************************************************/
    //Save and Submit events for SC Team request as well for workflow redirection
    /*********************************************************************************************************/
    vm.saveSCTeam = function () {
        var SCTeam = {
            GetPackTechnologyHead: vm.PackHeadName,
            GetSelectedApproved: vm.ApprovedSelected,
            GetSelectedPackResponsibility: vm.PackResSelected,
            GetComments: vm.comments,
            GetAdministrator: vm.Administrator,
            GetSelectedOutcome: vm.OutcomeSelected,
            GetResolutionComments: vm.resolutionComments,
            requestId: vm.requestid,
            GetPackId: vm.hdnPackId
        };
        $http.post('SCTeam/SaveNPRSCTeam', SCTeam).success(function (data) {
            vm.showOperationMsgPart(data.ResultMsg);
            console.log(vm.operationMsg);
        }).error(function (data) {
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saveSCTeam method of NPRSCTeam-JS' });
        });
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

    vm.submitSCTeam = function () {
        var SCTeam = {
            GetPackTechnologyHead: vm.PackHeadName,
            GetSelectedApproved: vm.ApprovedSelected == 'SELECT' ? null : vm.ApprovedSelected,
            GetSelectedPackResponsibility: vm.PackResSelected == 'SELECT' ? null : vm.PackResSelected,
            GetComments: vm.comments,
            GetAdministrator: vm.Administrator,
            GetSelectedOutcome: vm.OutcomeSelected == 'SELECT' ? null : vm.OutcomeSelected,
            GetResolutionComments: vm.resolutionComments,
            requestId: vm.requestid,
            GetPackId: vm.hdnPackId
        };

        $http.post('SCTeam/SubmitNPRSCTeam', SCTeam).success(function (data) {
            console.log(data);
            if (data.ResultCode == 1) {
                var nextRequestType = '';
                var nextTabCode = '';
                if (requestType == 2) {
                    nextRequestType = 'New Pack';
                    nextTabCode = 'SC_NP';
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
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saveSCTeam method of NPRSCTeam-JS' });
            }
            vm.showOperationMsgPart(data.ResultMsg);
        }).error(function (data) {
            console.log("error" + data);
        });
    };

  

});