angular.module('ERMS').controller("SCRFinalGSCM", function ($scope, $state, $http, $rootScope) {
	var vm=this;
	console.log("SCRFinalGSCM!!!");

/**************************************************************************************************
//Function for initialization of controls and getting request type/request id from session
/***************************************************************************************************/
	vm.subMenu = false;
	vm.showStateName = 'Final GSCM';
	$rootScope.$broadcast('SCRNameto-parent', vm.showStateName);
	vm.initData = function () {
	    vm.MgrReadOnly = false;
	    vm.GSCMApproval = false;
	    vm.MgrComments = false;
	    vm.SaveDisabledGSCM = false;
	    vm.SubmitDisabledGSCM = false;
	    vm.MgrDateDisabled = false;
	}
	vm.initData();
	var requestID = localStorage.getItem('name');

/**************************************************************************************************
//Function to populate GSCM data on Page load
/***************************************************************************************************/
	vm.GSCMPageLoad = function () {
	    $http({
	        url: "GSCM_SupplyChain/GetGSCMDetails/",
	        method: 'POST',
	        data: { "RequestID": requestID, "approvalStep": "2" },
	        contentType: "application/json;",
	        dataType: "json"
	    }).success(function (data) {
	        debugger;
	        if (data.ErrorBE) {
	            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
	        }
	        else {
	            var gscmDetails = data.GSCMReqDetails;
	            vm.GSCMgr = gscmDetails.globalSupplyChainManager;
	            vm.GSCMgrCmts = gscmDetails.globalSupplyChainManagerComments;
	            $scope.GSCMgrApproval = data.GetGlobalSCFirstApproval;
	            vm.getMgrTime = gscmDetails.getCompletedDate;
	            //$scope.time2 = vm.getMgrTime.Format("yyyy-MM-dd");
	            //console.log($scope.time2);
	            //$('#sandbox-container-FnlGSCM input').datepicker({ autoclose: true, format: "yyyy-mm-dd", });
	            //$('#sandbox-container-FnlGSCM input').datepicker("setDate", $scope.time2);

	            if (gscmDetails.globalSupplyChainFirstApproval.toString() == "0" || gscmDetails.globalSupplyChainFirstApproval == null) {
	                vm.GSCMgrAprrovalSel = 'SELECT';
	            }
	            else {
	                vm.GSCMgrAprrovalSel = gscmDetails.globalSupplyChainFirstApproval.toString();
	            }
	            vm.User = gscmDetails.UserId;
	            //regarding disabling controls
	            vm.MgrReadOnly = data.MgrReadOnly;
	            vm.GSCMApproval = data.GSCMApproval;
	            vm.MgrComments = data.MgrComments;
	            vm.SaveDisabledGSCM = data.SaveDisabledGSCM;
	            vm.SubmitDisabledGSCM = data.SubmitDisabledGSCM;
	            vm.MgrDateDisabled = data.MgrDateDisabled;
	        }
	    }).error(function (data) {
	        console.log("error" + data);
	        $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in GetGSCMDetails of FinalGSCMTab-JS' });
	    })
	};
	vm.GSCMPageLoad();

/**************************************************************************************************
//Function to Save/Submit First GSCM data on button events
/***************************************************************************************************/
	vm.showSubmenu = function (go) {
	    if (go === 'go') {
	        isSubmit = '1';
	    } else {
	        isSubmit = '0';
	    }
	    var finalGSCMdata = {
	        'requestId': requestID,
	        'globalSupplyChainFirstApproval': vm.GSCMgrAprrovalSel,
	        'globalSupplyChainManagerComments': vm.GSCMgrCmts,
	        'approvalStep': '2',
	        'isSubmit': isSubmit,
	    }
	    $http({
	        url: "GSCM_SupplyChain/SaveorSubmit",
	        method: 'POST',
	        data: finalGSCMdata,
	        contentType: "application/json;",
	        dataType: "json"
	    }).success(function (data) {
	        if (data == '420') {
	            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured during SaveorSubmit in FinalGSCMTab-JS' });
	        }
	        else {
	            vm.GSCMPageLoad();
	            vm.subMenu = true;
	            localStorage.setItem('name', requestID);
	            localStorage.setItem('type', 'Supply Chain');
	            if (go === 'go') {
	                $http.get("NewPackRequest/GetNextPage?requestId=" + requestID + "&requestType=Supply Chain&tabCode=GSCM2_SC")
                       .success(function (data) {
                           console.log(data);
                           //$state.go("SupplyChainRequest." + data.NextTabName, { QueryString: data.QueryString });
                           $scope.SaveAndGo(data);
                       });
	            }
	        }
	    }).error(function (data) {
	        console.log("error" + data);
	        $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured during SaveorSubmit in FinalGSCMTab-JS' });
	    })
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
	    }
	}
/**************************************************************************************************
//Function to populate comments on Approved dropdown change
/***************************************************************************************************/
	vm.changeForComment = function () {
	    if (vm.GSCMgrCmts)
	    {
	        vm.GSCMgrCmts = vm.GSCMgrCmts;
	    }
	    else
	    {
	        vm.GSCMgrCmts = '';
	    }
	    if (vm.GSCMgrAprrovalSel == '16') {
	        var myDate = new Date();
	        vm.GSCMgrCmts = 'TBA' + '\n' + 'Stated by: ' + vm.User + '\n' + 'On: ' + myDate.toLocaleString() + '  automatically.' + '\n' + vm.GSCMgrCmts;
	    } else if (vm.GSCMgrAprrovalSel == '18') {
	        var myDate = new Date();
	        vm.GSCMgrCmts = 'No Issues' + '\n' + 'Stated by: ' + vm.User + '\n' + 'On: ' + myDate.toLocaleString() + '  automatically.' + '\n' + vm.GSCMgrCmts;
	    } else if (vm.GSCMgrAprrovalSel == '51') {
	        var myDate = new Date();
	        vm.GSCMgrCmts = 'Under Review' + '\n' + 'Stated by: ' + vm.User + '\n' + 'On: ' + myDate.toLocaleString() + '  automatically.' + '\n' + vm.GSCMgrCmts;
	    }
	    else if (vm.GSCMgrAprrovalSel == '52') {
	        var myDate = new Date();
	        vm.GSCMgrCmts = 'No' + '\n' + 'Stated by: ' + vm.User + '\n' + 'On: ' + myDate.toLocaleString() + '  automatically.' + '\n' + vm.GSCMgrCmts;
	    } else {
	        vm.GSCMgrCmts = vm.GSCMgrCmts;
	    }
	}
/**************************************************************************************************
//Function on click of submit - To identify submit click
/***************************************************************************************************/
	vm.GSCMSubmit = function () {
	    var go = 'go';
	    vm.showSubmenu(go);
	}
});