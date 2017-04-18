angular.module('ERMS').controller("RegulatoryApproval", function ($scope, $filter, $http, $state, $stateParams, $rootScope) {
    var vm = this;
    var requestType;
    /*********************************************************************************************************/
    //Initialization/Popualtion of default controls and enabling of controls based on type of request
    /*********************************************************************************************************/
    vm.showStateName = 'RA';
    $rootScope.$broadcast('SCRNameto-parent', vm.showStateName);
    vm.initData = function () {
        
        vm.GetRegulatoryApproverName = '';
        vm.GetCompletedDate = '';
        vm.GetSelectedApprovalStatus = 'SELECT';
        vm.GetComments = '';
        vm.GetApprovalStatusDisabled = false;
        vm.GetRegulatoryApproverNameDisabled = false;
        vm.GetCompletedDateDisabled = false;
        vm.GetCommentsReadOnly = false;
        vm.btnSaveDisabled = false;
        vm.btnSubmitDisabled = false;
        vm.operationMsg = '';
        vm.username = '';
        vm.showOperationMsg = false;
      

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

    if (queryString == '') {
        queryString = 'requestId=' + requestId + '&requestType=' + requestType;
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
    //Getting Regulatory request details to be populated on page load
    /*********************************************************************************************************/
    $http.get('Regulatory/GetRegulatory?' + queryString)
        .success(function (data) {
            console.log(data);
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else {
                vm.GetApprovalStatus = data.GetApprovalStatus;
                vm.GetRegulatoryApproverName = data.GetRegulatoryApproverName;
                vm.GetCompletedDate = new Date(data.GetCompletedDate);
                if (data.GetSelectedApprovalStatus == "0" || data.GetSelectedApprovalStatus == null) {
                    vm.GetSelectedApprovalStatus = 'SELECT';
                }
                else {
                    vm.GetSelectedApprovalStatus = data.GetSelectedApprovalStatus;
                }
                vm.GetComments = data.GetComments;
                vm.GetApprovalStatusDisabled = data.GetApprovalStatusDisabled;
                vm.GetRegulatoryApproverNameDisabled = data.GetRegulatoryApproverNameDisabled;
                vm.GetCompletedDateDisabled = data.GetCompletedDateDisabled;
                vm.GetCommentsReadOnly = data.GetCommentsReadOnly;
                vm.btnSaveDisabled = data.btnSaveDisabled;
                vm.btnSubmitDisabled = data.btnSubmitDisabled;
                vm.requestid = data.requestId;
                vm.username = data.username;
                vm.GetRegId = data.GetRegId;

            
                return;
            }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in GetRegulatory method of RegulatoryApproval-JS' });
        })

    vm.saveRegulatory = function () {
       
        var regulatory = {
            RequestId: requestId,
            GetRegulatoryApproverName:vm.GetRegulatoryApproverName,
            GetCompletedDate:vm.GetCompletedDate,
            GetSelectedApprovalStatus: vm.GetSelectedApprovalStatus == 'SELECT' ? null : vm.GetSelectedApprovalStatus,
            GetComments: vm.GetComments,
            GetRegId: vm.GetRegId
        }
            $http.post('Regulatory/SaveRegulatory', regulatory).success(function (data) {
                console.log(data);
                if (data.ResultCode == -1) {
                    $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saving Regulatory details in RegulatoryApproval-JS' });
                }
                else {
                    vm.showOperationMsgPart(data.ResultMsg);
                    console.log(vm.operationMsg);
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saving Regulatory details in RegulatoryApproval-JS' });
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

    vm.submitRegulatory = function () {
        var regulatory = {
            RequestId: vm.requestId,
            GetRegulatoryApproverName: vm.GetRegulatoryApproverName,
            GetCompletedDate: vm.GetCompletedDate,
            GetSelectedApprovalStatus: vm.GetSelectedApprovalStatus == 'SELECT' ? null : vm.GetSelectedApprovalStatus,
            GetComments: vm.GetComments,
            GetRegId: vm.GetRegId
        };
        $http.post('Regulatory/SubmitRegulatory', regulatory).success(function (data) {
            console.log(data);
            if (data.ResultCode == -1) {
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saving Regulatory details' });
            }
            else if (data.ResultCode == 1) {
                var nextRequestType = '';
                var nextTabCode = '';
                if (requestType == 1) {
                    nextRequestType = 'EPT';
                    nextTabCode = 'RA_EPT';
                }
                else if (requestType == 2) {
                    nextRequestType = 'New Pack';
                    nextTabCode = 'RA_NP';
                }
                else if (requestType == 3) {
                    nextRequestType = 'Country Add';
                    nextTabCode = 'RA_CA';
                }
                else if (requestType == 4) {
                    nextRequestType = 'Supply Chain';
                    nextTabCode = 'RA_SC';
                }
                else if (requestType == 5) {
                    nextRequestType = 'Combi Pack';
                    nextTabCode = 'RA_CMBI';
                }
                else if (requestType == 6) {
                    nextRequestType = 'PFR';
                    nextTabCode = 'RA_PFR';
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
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in RegulatoryApproval.JS' });
            }
            vm.showOperationMsgPart(data.ResultMsg);
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in RegulatoryApproval.JS' });
        });
    };


    vm.changeForComment = function () {
        if (vm.GetComments) {
            vm.GetComments = vm.GetComments;
        }
        else {
            vm.GetComments = '';
        }
        if (vm.GetSelectedApprovalStatus == '16') {
            var myDate = new Date();
            vm.GetComments = 'TBA' + '\n' + 'Stated by: ' + vm.username + '\n' + 'On: ' + myDate.toLocaleString() + '  automatically.' + '\n' + vm.GetComments;
        } else if (vm.GetSelectedApprovalStatus == '18') {
            var myDate = new Date();
            vm.GetComments = 'No Issues' + '\n' + 'Stated by: ' + vm.username + '\n' + 'On: ' + myDate.toLocaleString() + '  automatically.' + '\n' + vm.GetComments;
        } else if (vm.GetSelectedApprovalStatus == '51') {
            var myDate = new Date();
            vm.GetComments = 'Under Review' + '\n' + 'Stated by: ' + vm.username + '\n' + 'On: ' + myDate.toLocaleString() + '  automatically.' + '\n' + vm.GetComments;
        }
        else if (vm.GetSelectedApprovalStatus == '52') {
            var myDate = new Date();
            vm.GetComments = 'No' + '\n' + 'Stated by: ' + vm.username + '\n' + 'On: ' + myDate.toLocaleString() + '  automatically.' + '\n' + vm.GetComments;
        } else {
            vm.GetComments = vm.GetComments;
        }
    }


});