angular.module('ERMS').controller("SCRFast", function ($scope, $filter, $http, $state, $stateParams, $rootScope) {
    var vm = this;
    var requestType;
    /*********************************************************************************************************/
    //Initialization/Popualtion of default controls and enabling of controls based on type of request
    /*********************************************************************************************************/
    vm.initData = function () {
       vm.SubmittedDate='';
       vm.FastContact='';
       vm.AgreedSourcePlant='';
       vm.comments='';
       vm.completedDate='';
       vm.SubmittedDateDisabled=false;
       vm.FastContactDisabled=false;
       vm.AgreedSourcePlantDisabled=false;
       vm.CommentsReadOnly=false;
       vm.CompletedDateDiabled = false;
        //SOCB - LRMS change - Addition of Approval dropdown in FAST
       vm.showApprovalDDL = false;
       vm.Approval = 'SELECT';
       vm.GetApprovalStatusIDDisabled = false;
        //EOCB - LRMS change - Addition of Approval dropdown in FAST
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
    //Getting FAST request details to be populated on page load
    /*********************************************************************************************************/
    $http.get('FAST_EPT/GetSCRFast?' + queryString)
        .success(function (data) {
            //SOCB - LRMS change - Addition of Approval dropdown in FAST
            vm.Region = data.Region;
            if (vm.Region == 'LATAM')
            {
                vm.showApprovalDDL = true;
                vm.ddlApprovalStatus = data != null ? data.ApprovalDDL : null;
                if (data.ApprovalStatusID == "0" || data.ApprovalStatusID == null) {
                    vm.Approval = 'SELECT';
                }
                else {
                    vm.Approval = data.ApprovalStatusID;
                }
            }
            else { vm.showApprovalDDL = false; }
            //EOCB - LRMS change - Addition of Approval dropdown in FAST
            console.log(data);
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else {
            vm.requestid = data.requestId;
            vm.SubmittedDate=new Date(data.GetSubmitDate);
            vm.FastContact=data.GetFastContact;
            vm.AgreedSourcePlant=data.GetAgreedSourcePlant;
            vm.comments=data.GetComments;
            vm.completedDate = new Date(data.GetCompletedDate);
            if (vm.completedDate) {
                $scope.time2Fast = vm.completedDate.Format("yyyy-MM-dd");

                if ($scope.time2Fast == '1-01-01') {
                    $('#sandbox-container-Fast input').datepicker({ autoclose: true, gotoCurrent: true, });
                    $('#sandbox-container-Fast input').datepicker("setDate", 'now');
                } else {
                    $('#sandbox-container-Fast input').datepicker({ autoclose: true, format: "yyyy-mm-dd", });
                    $('#sandbox-container-Fast input').datepicker("setDate", $scope.time2Fast);
                }
            }

            vm.SubmittedDateDisabled=data.SubmittedDateDisabled;
            vm.FastContactDisabled=data.FastContactDisabled;
            vm.AgreedSourcePlantReadOnly = data.AgreedSourcePlantReadOnly;
            vm.CommentsReadOnly=data.CommentsReadOnly;
            vm.CompletedDateDiabled = data.CompletedDateDiabled;
            vm.otherData = data.GetOtherData;
            vm.SaveDisabled = data.btnSaveDisabled;
            vm.SubmitDisabled = data.btnSubmitDisabled;
            vm.GetApprovalStatusIDDisabled = data.GetApprovalStatusIDDisabled;
            return;
            }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in GetSCRFast method of SCRFast-JS' });
        })

    /*********************************************************************************************************/
    //Save and Submit events for EPM request as well for workflow redirection
    /*********************************************************************************************************/
    vm.saveFast = function () {
        //debugger;
        var fast = {
            GetSubmitDate: vm.SubmittedDate,
            GetFastContact: vm.FastContact,
            GetAgreedSourcePlant: vm.AgreedSourcePlant,
            GetComments: vm.comments,
            GetCompletedDate: vm.completedDate,
            GetOtherData: vm.otherData,
            requestId: vm.requestid,
            //SOCB - LRMS change - Addition of Approval dropdown in FAST
            GetApprovalStatusID: vm.Approval == 'SELECT' ? null : vm.Approval
            //EOCB - LRMS change - Addition of Approval dropdown in FAST
        };
        $http.post('FAST_EPT/SaveSCRFast', fast).success(function (data) {
            console.log(data);
            if (data.ResultCode == -1) {
                $state.go('errorPage', { ErrorNo: 420 , ErrorMessage: "Error in Save FAST EPT" });
            }
            else {
            vm.showOperationMsgPart(data.ResultMsg);
            }
        }).error(function (data) {
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in SaveSCRFast method of SCRFast-JS' });
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

    vm.submitFast = function () {
        var fast = {
            GetSubmitDate: vm.SubmittedDate,
            GetFastContact: vm.FastContact,
            GetAgreedSourcePlant: vm.AgreedSourcePlant,
            GetComments: vm.comments,
            GetCompletedDate: vm.completedDate,
            GetOtherData: vm.otherData,
            requestId: vm.requestid,
            //SOCB - LRMS change - Addition of Approval dropdown in FAST
            GetApprovalStatusID: vm.Approval == 'SELECT' ? null : vm.Approval
            //EOCB - LRMS change - Addition of Approval dropdown in FAST
        };
        $http.post('FAST_EPT/SubmitSCRFast', fast).success(function (data) {
            if (data.ResultCode == 1) {
                var nextRequestType = '';
                var nextTabCode = '';

                if (requestType == 1) {
                    nextRequestType = 'EPT';
                    nextTabCode = 'FAST_EPT';
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
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in SubmitSCRFast method of SCRFast-JS' });
            }
            vm.showOperationMsgPart(data.ResultMsg);
        }).error(function (data) {
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in SubmitSCRFast method of SCRFast-JS' });
        });
    };
});