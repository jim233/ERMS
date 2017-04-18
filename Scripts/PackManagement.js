angular.module('ERMS').controller("PackManagement", function ($scope, $state, $http) {
    var vm = this;
    vm.LinkShow = false;
    vm.showSelect = true;
    vm.selectedLeadAI = 'SELECT';
    $scope.Rnumber = '';
   
    $http({
        url: "Admin/ManagePack/",
        method: 'POST',
    }).success(function (data) {
        if (data.ErrorBE) {
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
        }
        else if (data) {
            vm.ddlLeadAI = data.LeadAIList;
            vm.selectedLeadAI = 'SELECT';
        }
    }).error(function (data) {
        console.log("error" + data);
        $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in ManagePack method of PackManagement.JS' });
    })

    

    vm.change = function () {
        if (vm.selectedLeadAI == null) {
            vm.LinkShow = false;
            vm.showSelect = true;
            vm.showSearchResult = false;
        } else {
            vm.LinkShow = true;
            vm.showSelect = false;
            vm.requestSelected1 = null;
            vm.showSearchResult = false;
            $http({
                url: "Admin/GetFormulationForLeadAI?leadAIValue=" + vm.selectedLeadAI,
                method: 'POST',
            }).success(function (data) {
                if (data.ErrorBE) {
                    $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
                }
                else if (data) {
                    vm.ddlFormulation = data.Formulation;
                    vm.selectedFormulation = 'SELECT';
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in GetFormulationForLeadAI method of PackManagement.JS' });
            })

        }

    }

    vm.change1 = function () {
        
        if (vm.selectedFormulation == null) {
            vm.showSearchResult = false;
        } else {
            vm.showSearchResult = true;
            //$scope.showCreatePack1 = true;
            vm.showCreatePack2 = true;
            $http({
                url: "Admin/GetPackManagementDetails?leadAI=" + vm.selectedLeadAI + "&formulation=" + vm.selectedFormulation,
                method: 'POST',
            }).success(function (data) {
                if (data.ErrorBE) {
                    $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
                }
                else if (data) {
                    vm.PackDetails = data.PackDetails;
                    $scope.PackDetails = vm.PackDetails;
                    //for (var i = 0; i < vm.PackDetails.length; i++)
                    //{
                    //    var comn = vm.PackDetails[i].Comment;
                    //    console.log('check comment' + comn);
                    //}
                    if (data.PackDetails != null) {
                        //to make grid visible
                        vm.griddata = true;
                        vm.EditPart = true;
                        vm.pageSize = 8;
                        vm.pages = Math.ceil(vm.PackDetails.length / vm.pageSize);
                        console.log("!! + " + vm.pages);
                        vm.newPages = vm.pages > 5 ? 5 : vm.pages;
                        vm.pageList = [];
                        vm.selPage = 1;
                        vm.setData = function () {
                            vm.PackDetailsRepeat = vm.PackDetails.slice((vm.pageSize * (vm.selPage - 1)), (vm.selPage * vm.pageSize));
                        }
                        vm.PackDetailsRepeat = vm.PackDetails.slice(0, vm.pageSize);
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
                        //To hide create dummy pack link based on grid data
                        if(vm.PackDetails.length > 0)
                        {
                            vm.showCreatePack2 = false;
                        }
                        else
                        {
                            vm.showCreatePack2 = true;
                        }
                    }
                    else
                    {
                        //to make grid invisible
                        vm.griddata = false;
                        vm.showCreatePack2 = false;
                    }
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in GetPackManagementDetails method of PackManagement.JS' });

            })
        }
    }

    vm.isActivePage = function (page) {
        return $scope.selPage == page;
    };

    vm.Previous = function () {
        $scope.selectPage($scope.selPage - 1);
    }

    vm.Next = function () {
        $scope.selectPage($scope.selPage + 1);
    };

    vm.goState = function () {
        console.log("backadmin");
        $state.go('Admin');
    }

    vm.getDummyPack = function (saveDisplay) {
        debugger;
        $http({
            url: "Admin/GetDummyPack?leadAI=" + vm.selectedLeadAI + "&formulation=" + vm.selectedFormulation + "&saveOrDisplay=" + saveDisplay,
            method: 'POST',
        }).success(function (data) {
            debugger;
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else if (data) {
                vm.DummyPack = data.PackDetails;
            }
        }).error(function (data) {
            debugger;
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in GetDummyPack method of PackManagement.JS' });
        })
    }

    vm.CreatePack = function () {
        debugger;
        vm.getDummyPack("1");
        vm.showCreatePack1 = true;
        vm.showCreatePack2 = false;
        $scope.CreateTablePart = true;
        vm.griddata = false;
    }

    vm.BtnCancel = function () {
        vm.showCreatePack1 = false;
        vm.showCreatePack2 = true;
        vm.CreateTablePart = false;
    }

    vm.SaveDummyPack = function () {
        vm.getDummyPack("1");
    }

    //vm.EditPart = true;
    //vm.UserSelect = true;

    $scope.EditClick = function (r) {
       
        if ($scope.Rnumber >= '0') {
            $scope.CancelClick($scope.Rnumber);
        }
        $scope.Rnumber = r;
        $scope.comn = vm.PackDetails[r].Comment;
        $scope.CommentArea = $scope.comn;
        $scope.hideSingleRow = r;
        $scope.EditPart = false;
        $scope.UpdatePart = r;
        $scope.UserName = r;
        $scope.UserSelect = r;
    }

    $scope.CancelClick = function (r) {
        //$scope.CommentArea = $scope.comn;
        if ($scope.CommentArea != '') {
            vm.PackDetails[r].Comment = $scope.CommentArea;
        }
        $scope.EditPart = true;
        $scope.UpdatePart = r;
        $scope.UserName = r;
        $scope.UserSelect = r;
        $scope.Rnumber = '';
        $scope.CommentArea = '';
    }

    $scope.UpdateClick = function (r) {
       
        console.log("222PackDetails: " + JSON.stringify($scope.PackDetails));
        $scope.CommentArea = vm.PackDetails[r].Comment;
        if (vm.PackDetails[r].Comment == null) {
            alert("Please!!!");
        }
        else {
            var Pack = {
                "PackId": vm.PackDetails[r].PackId,
                "RequestID" : vm.PackDetails[r].RequestID,
                "Comment": vm.PackDetails[r].Comment
            }
            $http({
                url: "Admin/UpdatePack/",
                method: 'POST',
                data: Pack,
                contentType: "application/json;",
                dataType: "json"
            }).success(function (data) {
               
                if (data == "1") {
                    $scope.CancelClick(r);
                    vm.getLocalSCPDetails();
                }
                else
                {
                    $state.go('errorPage', { ErrorNo: data, ErrorMessage: 'Error occured in UpdatePack' });
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: data, ErrorMessage: 'Error occured in UpdatePack method of PackManagement.JS' });
            })
        }
        $scope.EditPart = true;
        $scope.UpdatePart = r;
        $scope.UserName = r;
        $scope.UserSelect = r;
    }
})