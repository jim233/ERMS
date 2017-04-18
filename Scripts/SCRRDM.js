angular.module('ERMS').controller("SCRRDM", function ($scope, $state, $modal, $log, $http, $rootScope) {
    var vm = this;
    console.log("SCRRDM!!!");
    vm.subMenu = false;
    var requestType;

/**************************************************************************************************
//Function for initialization of controls and getting request type/request id from session
/***************************************************************************************************/
    var requestID = localStorage.getItem('name');
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
    vm.showStateName = 'RDM';
    $rootScope.$broadcast('SCRNameto-parent', vm.showStateName);

    vm.initData = function () {
        vm.RectivationReq = false;
        vm.DatePU2SU = false;
        vm.PUtoSUmdtryMess = false;
        vm.ddlMoreDataReqReasonenable = false;
        vm.RDMnotesenable = false;
        vm.RDMAAgiCodeRead = true;
        vm.RDMDateCodeRaisedEnable = true;
        vm.RDMGetPUtoSUPromotedDateEnable = true;
        vm.RDMrdmContactEnable = true;
        vm.RDMCommentsRead = true;
        vm.RDMSelectedSUPUNSUEnable = true;
        vm.RDMMoreDataReqdEnableYes = true;
        vm.RDMMoreDataReqdEnableNo = true;
        vm.RDMMreDataReqdContactEnable = true;
        vm.RDMSUCodeCompltdDateEnable = true;
        vm.SaveEnableRDM = true;
        vm.SubmitEnableRDM = true;
        vm.NSUShow = true;
        vm.RDMNSUCodeRead = true;

        vm.hdnDomainOrg = '';
        vm.hdnUserIdOrg = '';
        vm.hdnNameOrg = '';
        vm.hdnFirstNameOrg = '';
        vm.hdnEmailOrg = '';
        vm.hdnLastNameOrg = '';
        vm.hdnUrlOrg = '';

        vm.hdnDomainReg = '';
        vm.hdnUserIdReg = '';
        vm.hdnNameReg = '';
        vm.hdnFirstNameReg = '';
        vm.hdnEmailReg = '';
        vm.hdnLastNameReg = '';
        vm.hdnUrlReg = '';
    }

    vm.initData();

/**************************************************************************************************
//Function for Date format
/***************************************************************************************************/
    //for date format
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

/**************************************************************************************************
//Function to populate RDM data on Page load
/***************************************************************************************************/
    vm.RDMgetData = function () {
        $http({
            url: "RDM/RDMDetails?RequestID=" + requestID,
            method: 'POST',
        }).success(function (data) {
              if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else{
            var RDMDetails = data.rdmBEV;
            $scope.ddlSUPUNSU = data.GetSUPUNSU;
            $scope.ddlMoreDataReqReason = data.GetMoreDataReqReason;
            if (RDMDetails.GetSelectedSUPUNU != null && RDMDetails.GetSelectedSUPUNU != undefined && RDMDetails.GetSelectedSUPUNU != '') {
                vm.RDMSelectedSUPUNSU = RDMDetails.GetSelectedSUPUNU.toString();
            } else {
                vm.RDMSelectedSUPUNSU = 'SELECT';
            }
            if (RDMDetails.GetSelectedMoreDataReqReason != null && RDMDetails.GetSelectedMoreDataReqReason != undefined && RDMDetails.GetSelectedMoreDataReqReason != '')
                vm.RDMMreDataReqReason = RDMDetails.GetSelectedMoreDataReqReason.toString();
            else
                vm.RDMMreDataReqReason = 'SELECT';
            vm.RDMrdmContact = RDMDetails.GetEDMContact;
            vm.RDMAAgiCode = RDMDetails.GetAgiCode;
            vm.RDMComments = RDMDetails.GetEDMComments;
            vm.RDMMreDataReqdContact = RDMDetails.GetMoreDataContact;
            vm.RDMnotes = RDMDetails.GetNotes;
            vm.RDMDateCodeRaised = new Date(RDMDetails.GetCodeRaisedDate);

            if (vm.RDMDateCodeRaised) {
                vm.time2RDM = vm.RDMDateCodeRaised.Format("yyyy-MM-dd");

                if (vm.time2RDM == '1-01-01') {
                    $('#sandbox-container-RDM input').datepicker({ autoclose: true, gotoCurrent: true, });
                    $('#sandbox-container-RDM input').datepicker("setDate", 'now');
                } else {
                    $('#sandbox-container-RDM input').datepicker({ autoclose: true, format: "yyyy-mm-dd", });
                    $('#sandbox-container-RDM input').datepicker("setDate", vm.time2RDM);
                }
            }

            vm.RDMSUCodeCompltdDate = RDMDetails.GetCompletedDate;
            vm.RDMMoreDataReqd = RDMDetails.GetMoreDataReq;
            vm.RDMGetPUtoSUPromotedDate = RDMDetails.GetPUtoSUPromotedDate;
            vm.RDMNSUCode = RDMDetails.GetNSUCode;

            //Maintain ID for saving
            vm.RDMID = RDMDetails.GetEDMId;
            vm.MoreDataRedID = RDMDetails.GetMoreDataContactId;
            //Assignment related to disabling or enabling controls
            vm.RectivationReq = data.RectivationReq;
            vm.DatePU2SU = data.DatePU2SU;
            vm.PUtoSUmdtryMess = data.PUtoSUmdtryMess;
            vm.ddlMoreDataReqReasonenable = data.ddlMoreDataReqReasonenable;
            vm.RDMnotesenable = data.ddlMoreDataReqReasonenable;
            vm.RDMAAgiCodeRead = data.RDMAAgiCodeRead;
            vm.RDMDateCodeRaisedEnable = data.RDMDateCodeRaisedEnable;
            vm.RDMGetPUtoSUPromotedDateEnable = data.RDMGetPUtoSUPromotedDateEnable;
            vm.RDMrdmContactEnable = true;//Keep disabled always
            vm.RDMCommentsRead = data.RDMCommentsRead;
            vm.RDMSelectedSUPUNSUEnable = data.RDMSelectedSUPUNSUEnable;
            vm.RDMMoreDataReqdEnableYes = data.RDMMoreDataReqdEnableYes;
            vm.RDMMoreDataReqdEnableNo = data.RDMMoreDataReqdEnableNo;
            vm.RDMMreDataReqdContactEnable = data.RDMMreDataReqdContactEnable;
            vm.RDMSUCodeCompltdDateEnable = data.RDMSUCodeCompltdDateEnable;
            vm.SaveEnableRDM = data.SaveEnableRDM;
            vm.SubmitEnableRDM = data.SubmitEnableRDM;
            vm.RDMNSUCodeRead = data.RDMCoreNSUEnable;
            if(requestType == 3)
            {
                vm.NSUShow = true;
            }
            else
            {
                vm.NSUShow = false;
            }
        }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in RDMDetails of SCRRDM-JS' });
        })
    };

vm.RDMgetData();


vm.isSuPuNsu = false;
vm.isAgiCode = false;
vm.isCoreNsu = false;
vm.isDateCode = false;
vm.isAgiCodeNum = false;
vm.isRDMCommentLen = false;
$scope.validateOtherNSU = function () {
    if (vm.RDMSelectedSUPUNSU == 'SELECT') {
        vm.isSuPuNsu = true;
    }
    else {
        vm.isSuPuNsu = false;
    }
}

$scope.validateOtherCoreNSU=function()
{
    if (vm.RDMNSUCode == undefined) {
        vm.isCoreNsu = true;
    }
    else
    {
        vm.isCoreNsu = false;
    }
}

$scope.validateOtherAgiCode = function () {
    if (vm.RDMAAgiCode == undefined || vm.RDMAAgiCode == "") {
        vm.isAgiCode = true;
        vm.isAgiCodeNum = false;
    }
    else {
        if (!isNaN(vm.RDMAAgiCode)) {
            vm.isAgiCode = false;
            vm.isAgiCodeNum = false;
        }
        else {
            vm.isAgiCodeNum = true;
            vm.isAgiCode = false;
        }
    }
}

$scope.checkLength = function () {
    if (vm.RDMComments.length > 1000) {
        vm.isRDMCommentLen = true;
    }
    else {
        vm.isRDMCommentLen = false;
    }
}

$scope.validateOther = function () {
    var isValid = true;
    if (vm.RDMSelectedSUPUNSU == 'SELECT') {
        vm.isSuPuNsu = true;
        isValid = false;
    }
    if (vm.RDMAAgiCode == undefined) {
        vm.isAgiCode = true;
        isValid = false;
    }
    if (vm.NSUShow) {
        if (vm.RDMNSUCode == undefined) {
            vm.isCoreNsu = true;
            isValid = false;
        }
    }

    if (vm.time2RDM == '1-01-01')
    {
        vm.isDate = true;
        isValid = false;
    }

    if (vm.RDMComments.length > 1000) {
        vm.isRDMCommentLen = true;
        isValid = false;
    }

    return isValid;
}

/**************************************************************************************************
//Function to Save/Submit RDM data on button events
/***************************************************************************************************/
    vm.saveRDMMenu = function (go) {
        var submit;
        vm.isSuPuNsu = false;
        vm.isAgiCode = false;
        vm.isCoreNsu = false;
        vm.isDateCode = false;
        vm.isAgiCodeNum = false;
        vm.isDate = false;
        var isValid = $scope.validateOther();
        if (isValid) {
            if (go === 'go') {
                submit = '1';
            } else {
                submit = '0';
            }
            var RDMdataBind = {
                'RequestID': requestID,
                'GetAgiCode': vm.RDMAAgiCode,
                'GetCodeRaisedDate': vm.time2RDM,
                'GetMoreDataReq': vm.RDMMoreDataReqd,
                'GetPUtoSUPromotedDate': vm.RDMGetPUtoSUPromotedDate,
                'GetEDMComments': vm.RDMComments,
                'GetEDMContact': vm.RDMID,
                'GetSelectedMoreDataReqReason': vm.RDMMreDataReqReason,
                'GetNotes': vm.RDMnotes,
                'GetSelectedSUPUNU': vm.RDMSelectedSUPUNSU,
                'GetNSUCode': vm.RDMNSUCode,
                'isSubmit': submit,
                'GetMoreDataContact': vm.MoreDataRedID,
                'FirstName': (vm.hdnFirstNameOrg != null) ? vm.hdnFirstNameOrg : '',
                'LastName': (vm.hdnLastNameOrg != null) ? vm.hdnLastNameOrg : '',
                'UserId': (vm.hdnUserIdOrg != null) ? vm.hdnDomainOrg + '//' + vm.hdnUserIdOrg : '',
                'Email': (vm.hdnEmailOrg != null) ? vm.hdnEmailOrg : '',
                'SecondUserFirstName': (vm.hdnFirstNameReg != null) ? vm.hdnFirstNameReg : '',
                'SecondUserLastName': (vm.hdnLastNameReg != null) ? vm.hdnLastNameReg : '',
                'SecondUserId': (vm.hdnUserIdReg != null) ? vm.hdnDomainReg + '//' + vm.hdnUserIdReg : '',
                'SecondUserEmail': (vm.hdnEmailReg != null) ? vm.hdnEmailReg : '',
            }
            if (RDMdataBind) {
                $http({
                    url: "RDM/SaveorSubmit",
                    method: 'POST',
                    data: RDMdataBind,
                    contentType: "application/json;",
                    dataType: "json"
                }).success(function (data) {
                    if (data == '420') {
                        $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured during in SaveorSubmit method of RDMController' });
                    }
                    else {
                        if (go === 'go') {
                            if (data) {
                                var nextRequestType = '';
                                var nextTabCode = '';

                                if (requestType == 1 || requestType == 8) {
                                    nextRequestType = 'EPT';
                                    nextTabCode = 'RDM_EPT';
                                }
                                else if (requestType == 3) {
                                    nextRequestType = 'Country Add';
                                    nextTabCode = 'RDM_CA';
                                }
                                else if (requestType == 2) {
                                    nextRequestType = 'New Pack';
                                    nextTabCode = 'RDM_NP';
                                }
                                else if (requestType == 6) {
                                    nextRequestType = 'PFR';
                                    nextTabCode = 'RDM_PFR';
                                }
                                else if (requestType == 5) {
                                    nextRequestType = 'Combi Pack';
                                    nextTabCode = 'RDM_CMBI';
                                }
                                else if (requestType == 7) {
                                    nextRequestType = 'Other';
                                    nextTabCode = 'RDM_OTR';
                                }
                                else if (requestType == 4) {
                                    nextRequestType = 'Supply Chain';
                                    nextTabCode = 'RDM_SC';
                                }
                            }
                            if (nextRequestType != '' && nextTabCode != '') {
                                $http.get('NewPackRequest/GetNextPage?requestId=' + requestID + '&requestType=' + nextRequestType + '&tabCode=' + nextTabCode)
                                    .success(function (data) {
                                        console.log(data);
                                        //$state.go("SupplyChainRequest." + data.NextTabName, { QueryString: data.QueryString });
                                        $scope.SaveAndGo(data);
                                    });
                            }
                        } else {
                            vm.subMenu = true;
                            $rootScope.$broadcast('SCRNameto-requestID', requestID);
                        };
                    }
                }).error(function (data) {
                    console.log("error" + data);
                    $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured during in SaveorSubmit method of SCRRDM-JS' });
                })
            } else {
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured during in SaveorSubmit method of SCRRDM-JS' });
            }
        }
    }

/**************************************************************************************************
//Function on click of submit - To identify submit click
/***************************************************************************************************/
    vm.submitRDMMenu = function () {
        vm.saveRDMMenu("go");
    }

/**************************************************************************************************
//Function to change workflow on click of submit
/***************************************************************************************************/
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
            $rootScope.$broadcast('SCRNameto-requestID', requestID);
        }
    }

/**************************************************************************************************
//Function related to GAL picker
/***************************************************************************************************/
    vm.openOrg = function () {
        var a, b, c, d, e, f, g;
        var userDetails = PickAdd(a, b, c, d, e, f, '0', g);
        console.log(h.FirstName);
        vm.hdnDomainOrg = userDetails.Domain;
        vm.hdnUserIdOrg = userDetails.UserId;
        vm.OrginatorOrg = userDetails.FirstName + " " + userDetails.LastName;
        vm.hdnFirstNameOrg = userDetails.FirstName;
        vm.hdnEmailOrg = userDetails.Email;
        vm.hdnLastNameOrg = userDetails.LastName;
        //For display and saving
        vm.RDMrdmContact = userDetails.FirstName + " " + userDetails.LastName;
        vm.RDMID = userDetails.Domain + '\\' + userDetails.UserId;
    }

    vm.openReg = function () {
        var a, b, c, d, e, f, g;
        var userDetails = PickAdd(a, b, c, d, e, f, '0', g);
        console.log(h.FirstName);
        vm.hdnDomainReg = userDetails.Domain;
        vm.hdnUserIdReg = userDetails.UserId;
        vm.OrginatorReg = userDetails.FirstName + " " + userDetails.LastName;
        vm.hdnFirstNameReg = userDetails.FirstName;
        vm.hdnEmailReg = userDetails.Email;
        vm.hdnLastNameReg = userDetails.LastName;
        //For display and saving
        vm.RDMMreDataReqdContact = userDetails.FirstName + " " + userDetails.LastName;
        vm.MoreDataRedID = userDetails.Domain + '\\' + userDetails.UserId;
    }

    vm.MoreDataRequiredFunc = function () {
        console.log("selectChange" + vm.RDMMoreDataReqd);
        if (vm.RDMMoreDataReqd == true) {
            // More Data Required Reason,More Data Required Contact,Notes should be editable
            vm.ddlMoreDataReqReasonenable = false;
            vm.RDMMreDataReqdContactEnable = false;
            vm.RDMnotesenable = false;
        }
        else {
            vm.ddlMoreDataReqReasonenable = true;
            vm.RDMMreDataReqdContactEnable = true;
            vm.RDMnotesenable = true;
        }
    }
})