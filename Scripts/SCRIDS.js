angular.module('ERMS').controller("SCRIDS", function ($scope, $state, $http, $rootScope) {
    var vm = this;
    console.log("we are in IDS");

    /*Declaration of page level variables/Initialization*/
    vm.subMenu = false;
    var requestID = localStorage.getItem('name');
    vm.showStateName = 'IDS';
    $rootScope.$broadcast('SCRNameto-parent', vm.showStateName);
    vm.initData = function () {
        vm.RectivationReq = false;
        vm.designcodeEnable = true;
        vm.ucagicodeEnable = true;
        vm.SubmitEnableIDS = true;
        vm.SaveEnableIDS = true;
    }
    vm.initData();

    /*Population of controls or binding data on page load*/
    vm.IDSPageLoad = function () {
        $http({
            url: "MDMIDS/GetIDSDetails?RequestID=" + requestID,
            method: 'POST'
        }).success(function (data) {
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else {
                var MDMdata = data.mdmReqDetails;
                vm.designcode = MDMdata.CombiDesignCode;
                vm.ucagicode = MDMdata.CombiUCAgiCode;
                vm.SubmitEnableIDS = data.SubmitEnableIDS;
                vm.SaveEnableIDS = data.SaveEnableIDS;
            }
        }).error(function (data) {
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in Loading IDS from GetIDSDetails JS file' });
        })
    };
    vm.IDSPageLoad();

    /*Function on click of Save/Submit for IDS*/
    vm.SaveIDSmenu = function (go) {
        var submit;
        if (go === 'go') {
            submit = '1';
        } else {
            submit = '0';
        }
        var IDSdataBind = {
            'RequestID': requestID,
            'CombiDesignCode' : vm.designcode,
            'CombiUCAgiCode' : vm.ucagicode,
        }
        if (IDSdataBind) {
            $http({
                url: "MDMIDS/SaveorSubmit",
                method: 'POST',
                data: IDSdataBind,
                contentType: "application/json;",
                dataType: "json"
            }).success(function (data) {
                if (data == '420') {
                    $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured during Saving IDS Request from SaveorSubmit SCRIDS JS' });
                }
                else {
                    if (go === 'go') {
                        $http.get("NewPackRequest/GetNextPage?requestId=" + requestID + "&requestType=Combi Pack&tabCode=IDS_CMBI")
                               .success(function (data) {
                                   console.log(data);
                                   //$state.go("SupplyChainRequest." + data.NextTabName, { QueryString: data.QueryString });
                                   $scope.SaveAndGo(data);
                               });
                    } else {
                        vm.subMenu = true;
                    };
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured during Saving IDS Request from SaveorSubmit SCRIDS JS' });
            })
        } else {
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured during Saving IDS Request from SaveorSubmit SCRIDS JS' });
        }
    }

    /*Function on click of Submit for IDS*/
    vm.submitIDSMenu = function () {
        vm.SaveIDSmenu("go");
    }

    /*Function related to workflow on click of submit*/
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

});