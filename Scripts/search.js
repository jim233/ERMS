/// <reference path="../UserInterface/print_page.html" />
/// <reference path="../UserInterface/print_page.html" />
/// <reference path="../UserInterface/print_page.html" />
angular.module('ERMS').controller("searchExistingCtrl", function ($scope, $state, $http, $modal, $log) {
    var vm = this;

    /*********************************************************************************************************/
    //Initialization/Popualtion of default controls and enabling of controls based on type of request
    /*********************************************************************************************************/
    vm.requestmodel = '';
    vm.country = '';
    vm.leadAI = '';
    vm.area = '';
    vm.status = '';
    vm.subStatus = '';
    vm.getSResultsTable = '';
    vm.showLoadingPage = false;

    vm.initData = function () {
        vm.requestSelected = 'All';
        vm.countrySelected = 'All';
        vm.NSU = '';
        vm.reqNumber = '';
        vm.SUorPU = '';
        vm.concerns = '';
        vm.selectedArea = 'All';
        vm.selectedSubArea = '';
        vm.selectedLeadAI = 'All';
        vm.selectedOrginator = '';
        vm.selectedStatus = 'All';
        vm.selectedSubStatus = 'All';

        //Used for GAL Picker
        vm.hdnDomain = '';
        vm.hdnUserId = '';
        vm.hdnName = '';
        vm.hdnFirstName = '';
        vm.hdnEmail = '';
        vm.hdnLastName = '';
       
    }
    vm.initData();

    vm.radioChecked = '0';
    vm.showFirstPart = false;
    vm.showSndPart = true;
    vm.showThrPart = true;
    vm.ShowFourPart = true;
    vm.showSearchResult = false;
    vm.contain1 = true;

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

    /*********************************************************************************************************/
    //Getting dropdown related data to bind on page load
    /*********************************************************************************************************/
    $http({
        url: "Search/SearchRequest/",
        method: 'POST',
    }).success(function (data) {
        if (data.ErrorBE) {
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
        }
        else {
            $scope.getValidData = true;
            vm.showSearchResult = false;
            vm.requestmodel = data.RequestType;
            vm.country = data.CountryList;
            vm.leadAI = data.LeadAI;
            vm.area = data.Area;
            vm.status = data.Status;
            console.log(vm.status);
            vm.subStatus = data.SubStatus;
            vm.getSResultsTable = '';
            vm.hdnDomain = '';
            vm.hdnUserId = '';
            vm.hdnName = '';
            vm.hdnFirstName = '';
            vm.hdnEmail = '';
            vm.hdnLastName = '';
            return;
        }
    }).error(function (data) {
        console.log("error" + data);
        $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in SearchRequest method of searchJS' });
    })

    /***************************************************************************************************/
    //Date Picker - for date format
    /***************************************************************************************************/
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

    /*********************************************************************************************************/
    //Getting data on click of search based on filters selection
    /*********************************************************************************************************/
    $scope.goState = function (rrrr) {
        $scope.getValidData = false;
        //if (vm.Orginator == '' || vm.Orginator == undefined || vm.Orginator == null) {
        //    alert("Please select an Originator");
        //}
        //else {
        if (vm.Concernchecked == true)
        {
            vm.Concernchecked = 'Y';
        }
        else
        {
            vm.Concernchecked = 'N';
        }
            var RequestFilters = {
                "NSU": vm.NSU,
                "ReqNumber": vm.reqNumber,
                "SUorPU": vm.SUorPU,
                "Concerns": vm.Concernchecked,
                "SelectedArea": vm.selectedArea,
                "SelectedSubArea": vm.selectedSubArea,
                'SelectedCountry': vm.countrySelected,
                'SelectedLeadAI': vm.selectedLeadAI,
                "SelectedReqType": vm.requestSelected,
                'SelectedOrginator': vm.selectedOrginator,
                'SelectedStatus': vm.selectedStatus,
                'SelectedSubStatus': vm.selectedSubStatus,
                //'SelectedOrginator': vm.Orginator
            }

            //console.log("!@!@!@!@ " + JSON.stringify(filters));
            $http({
                url: "Search/GetSearchResults",
                method: 'POST',
                data: RequestFilters,
                contentType: "application/json;",
                dataType: "json"
            }).success(function (data) {
                if (data.ErrorBE)
                {
                    $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
                }
                else {
                $scope.getValidData = true;
                vm.getTableReturn = data.RequestResults;
                if (vm.getTableReturn != null) {

                    console.log("data11111:" + vm.getTableReturn.length);
                    vm.itemsNo = vm.getTableReturn.length;
                    vm.showSearchResult = true;
                    vm.contain1 = false;
                    vm.pageSize = 8;
                    vm.pages = Math.ceil(vm.getTableReturn.length / vm.pageSize);
                    vm.newPages = vm.pages > 5 ? 5 : vm.pages;
                    vm.pageList = [];
                    vm.selPage = 1;

                    vm.setData = function () {
                        vm.pageTableRepeat = vm.getTableReturn.slice((vm.pageSize * (vm.selPage - 1)), (vm.selPage * vm.pageSize));
                    }

                    vm.pageTableRepeat = vm.getTableReturn.slice(0, vm.pageSize);
                    for (var i = 0; i < vm.newPages; i++) {
                        vm.pageList.push(i + 1);
                    }
                    vm.selectPage = function (page) {
                        if (page < 1 || page > vm.pages) return;
                        if (page > 2) {
                            var newpageList = [];
                            for (var i = (page - 3) ; i < ((page + 2) > vm.pages ? vm.pages : (page + 2)) ; i++) {
                                newpageList.push(i + 1);
                            }
                            vm.pageList = newpageList;
                        }
                        vm.selPage = page;
                        vm.setData();
                        vm.isActivePage(page);
                        console.log("page is：" + page);
                    };
                    vm.showSearchResult = true;
                }
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in goState method of searchJS' });
            })
        //}
    }

    /*********************************************************************************************************/
    //Getting data on click of Print
    /*********************************************************************************************************/
    vm.print = function (rrrr) {
        $scope.getValidData = false;
        //if (vm.Orginator == '' || vm.Orginator == undefined || vm.Orginator == null) {
        //    alert("Please select an Originator");
        //}
        //else {
        var RequestFilters = {
            "NSU": vm.NSU,
            "ReqNumber": vm.reqNumber,
            "SUorPU": vm.SUorPU,
            "Concerns": vm.Concernchecked,
            "SelectedArea": vm.selectedArea,
            "SelectedSubArea": vm.selectedSubArea,
            'SelectedCountry': vm.countrySelected,
            'SelectedLeadAI': vm.selectedLeadAI,
            "SelectedReqType": vm.requestSelected,
            'SelectedOrginator': vm.selectedOrginator,
            'SelectedStatus': vm.selectedStatus,
            'SelectedSubStatus': vm.selectedSubStatus,
            //'SelectedOrginator': vm.Orginator
        }
        sessionStorage.setItem('Data', JSON.stringify(RequestFilters));
        $scope.getValidData = true;
        window.open('../UserInterface/print_page.html', '_blank');
        //console.log("!@!@!@!@ " + JSON.stringify(filters));
        //$http({
        //    url: "Search/GetSearchResults",
        //    method: 'POST',
        //    data: RequestFilters,
        //    contentType: "application/json;",
        //    dataType: "json"
        //}).success(function (data) {
        //    if (data.ErrorBE) {
        //        $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
        //    }
        //    else {
        //        $scope.getValidData = true;
        //        vm.getTableReturn = data.RequestResults;
        //        if (vm.getTableReturn != null) {
        //            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in goState method of searchJS' });
        //        }
        //    }
        //}).error(function (data) {
        //    console.log("error" + data);
        //    $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in goState method of searchJS' });
        //})
        //}
    }
    /*********************************************************************************************************/
    //Redirection on click of requestid and setting of local storage to be used in next page
    /*********************************************************************************************************/
    vm.goRequestID = function (a, b) {
        console.log("!!!!! = " + a + b);
        localStorage.setItem('name', a);
        localStorage.setItem('type', b);
        $state.go('SupplyChainRequest.request');
    }

    /*********************************************************************************************************/
    //Functionality/methods related to Reject/Delete request
    /*********************************************************************************************************/
    $scope.rejectRequest = function (requestID, type) {
        //console.log("12345"+$scope.requestID+$scope.type);
        var modalInstance = $modal.open({
            templateUrl: 'rejectModal.html', //指向上面创建的视图
            controller: 'rejectModalCtrl', // 初始化模态范围
            resolve: {
                rejectReason: function () {
                    return $scope.rejectReason;
                }
            }
        })
        modalInstance.result.then(function (rejectReason) {
            $scope.rejectReason = rejectReason;
            console.log("!!!!!!!!" + requestID + ' ' + type + ' ' + JSON.stringify($scope.rejectReason));
            $http({
                url: "Search/RejectDeleteRequest?reqID=" + requestID + "&reason=" + $scope.rejectReason.rejectReason + "&type=" + parseInt(type),
                method: 'POST',
                //data: { "reqID": requestID, "reason": $scope.reasons, "type": parseInt(type) },
                //contentType: "application/json;",
                //dataType: "json"
            }).success(function (data) {
                if (data.ErrorBE) {
                    $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
                }
                else {
                    $scope.getValidData = true;
                    $scope.goState();
                    console.log("reject success!  = " + data);
                }
            }).error(function (data) {
                console.log("error" + JSON.stringify(data));
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in RejectDeleteRequest method of searchJS' });
            })
        }, function () {
            $log.info('Modal dismissed at: ' + new Date())
        })
    }

    vm.RegisterPart = true;
    vm.NoRegisterPart = false;

    vm.goState1 = function () {
        window.location.reload();
    }

    /*********************************************************************************************************/
    //Search based on section selected by user
    /*********************************************************************************************************/
    vm.radioCheckedFunc = function () {
        console.log("444444444444444444 " + vm.radioChecked);
        if (vm.radioChecked === '0') {
            vm.showFirstPart = false;
            vm.showSndPart = true;
            vm.showThrPart = true;
            vm.ShowFourPart = true;
        }
        if (vm.radioChecked === '1') {
            vm.showFirstPart = true;
            vm.showSndPart = false;
            vm.showThrPart = true;
            vm.ShowFourPart = true;
        }
        if (vm.radioChecked === '2') {
            vm.showFirstPart = true;
            vm.showSndPart = true;
            vm.showThrPart = false;
            vm.ShowFourPart = true;
        }
        if (vm.radioChecked === '3') {
            vm.showFirstPart = true;
            vm.showSndPart = true;
            vm.showThrPart = true;
            vm.ShowFourPart = false;
        }
    }

    vm.isActivePage = function (page) {
        return vm.selPage == page;
    };

    $scope.Previous = function () {
        vm.selectPage(vm.selPage - 1);
    }

    $scope.Next = function () {
        vm.selectPage(vm.selPage + 1);
    };

    //vm.print = function () {
    //    alert("!!!");
    //    window.open('http://www.abc.com?requestType&whatever&whatever');
    //}

    $scope.items = ['html5', 'jq', 'FE-演示平台', 'html52', 'jq2', 'FE-演示平台2', 'html53', 'jq3', 'FE-演示平台3', 'html54', 'jq4', 'FE-演示平台4'];

    /*********************************************************************************************************/
    //GAL picker function
    /*********************************************************************************************************/
    //Method to open GAL Picker and get the user details
    vm.open = function () {
        var a, b, c, d, e, f, g;
        var userDetails = PickAdd(a, b, c, d, e, f, '0', g);
        vm.hdnDomain = userDetails.Domain;
        vm.hdnUserId = userDetails.UserId;
        vm.Orginator = userDetails.FirstName + " " + userDetails.LastName;
        vm.hdnFirstName = userDetails.FirstName;
        vm.hdnEmail = userDetails.Email;
        vm.hdnLastName = userDetails.LastName;
        vm.OrginatorName = userDetails.FirstName + " " + userDetails.LastName;
        vm.selectedOrginator = userDetails.Domain + '\\' + userDetails.UserId;
    }
})


/*********************************************************************************************************/
//Functionality/methods related to Reject/Delete request
/*********************************************************************************************************/
angular.module('ERMS').controller('rejectModalCtrl', function ($scope, $modalInstance, rejectReason, $modal, $log) { //依赖于modalInstance
        //$scope.rejectReason = '';
    //$scope.NewReject;
    $scope.rejectReason = '';
    $scope.rejectReason = {
        rejectReason: $scope.rejectReason
    };
    $scope.changeReject = function () {
        $scope.NewReject = $scope.rejectReason;
        console.log('!!!!!!:');
        console.log($scope.NewReject);
    }

    $scope.ok = function () {
        console.log($scope.rejectReason); //get reject reason
        $modalInstance.close($scope.rejectReason); //关闭并返回当前选项
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel'); // 退出
    }
})

angular.module('ERMS').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, $modal, $log) { //依赖于modalInstance
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };
    $scope.Rchecked0 = true;
    $scope.disabled = true;
    //	alert($scope.radioChecked0);
    $scope.radioCheckedFunc1 = function (disabled) {
        $scope.disabled = disabled;
        //		alert("mod"+$scope.radioChecked0)
    }

    $scope.ok = function () {
        console.log("$scope.selected:" + $scope.selected.item);
        $modalInstance.close($scope.selected.item); //关闭并返回当前选项
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel'); // 退出
    }

    $scope.open1 = function (size) { //打开模态 
        var modalInstance = $modal.open({
            templateUrl: 'myModelContent1.html', //指向上面创建的视图
            controller: 'ModalInstanceCtrl1', // 初始化模态范围
            size: size, //大小配置
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        })
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date())
        })
    }
})

angular.module('ERMS').controller('ModalInstanceCtrl1', function ($scope, $modalInstance, items, $modal) { //依赖于modalInstance
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item); //关闭并返回当前选项
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel'); // 退出
    }

})
