angular.module('ERMS').controller("AdminManagePackTech", function ($scope, $state, $http) {
    var vm = this;
    vm.initData = function () {

        vm.hdnDomain = '';
        vm.hdnUserId = '';
        vm.hdnName = '';
        vm.hdnFirstName = '';
        vm.hdnEmail = '';
        vm.hdnLastName = '';
        vm.hdnUrl = '';
        $scope.EditPart = true;
        $scope.InputText1 = '';
        $scope.hideSingleRow = '';
        $scope.UpdatePart = '';
        $scope.UserName = '';
        $scope.UserSelect = '';
    }
    vm.initData();
    vm.showLoadingPage = false;


    vm.getPackTechDetails = function () {
        $http({
            url: "Admin/GetPackTechDetails/",
            method: 'POST',
        }).success(function (data) {
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else if (data) {
                $scope.getValidData = true;
                vm.PackTechDetails = data.PackTechDetails;
            }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in GetPackTechDetails method of AdminManagePackTech.JS' });
        })
    }

    vm.getPackTechDetails();

    /**************************************************************************************************
    //Function related to GAL picker
    /***************************************************************************************************/
    vm.openPT = function () {
        var a, b, c, d, e, f, g;
        var userDetails = PickAdd(a, b, c, d, e, f, '0', g);
        vm.hdnDomain = userDetails.Domain;
        vm.hdnUserId = userDetails.UserId;
        vm.Orginator = userDetails.FirstName + " " + userDetails.LastName;
        vm.hdnFirstName = userDetails.FirstName;
        vm.hdnEmail = userDetails.Email;
        vm.hdnLastName = userDetails.LastName;
        //To display in textbox when selected
        //vm.InputText1 = vm.Orginator;
        $scope.InputText1 = vm.Orginator;
    }

    $scope.$watch('getValidData', function () {
        if ($scope.getValidData) {
            vm.showLoadingPage = false;
        } else {
            vm.showLoadingPage = true;
        }
    });

    $scope.EditClick = function (r) {
        $scope.hideSingleRow = r;
        $scope.EditPart = false;
        $scope.UpdatePart = r;
        $scope.UserName = r;
        $scope.UserSelect = r;
    }

    $scope.CancelClick = function (r) {
        $scope.EditPart = true;
        $scope.UpdatePart = r;
        $scope.UserName = r;
        $scope.UserSelect = r;
        vm.initData();
    }

    $scope.UpdateClick = function (r, packTechObj) {
        if (!$scope.InputText1) {
            alert("Please select the PackTech name" + r);
        }

        else {
            var Admin = {
                "FirstName": vm.hdnFirstName,
                "LastName": vm.hdnLastName,
                "UserId": vm.hdnDomain + '\\' + vm.hdnUserId,
                "Email": vm.hdnEmail,
                "Id": packTechObj.PackID,
            }
            $http({
                url: "Admin/UpdatePackTech/",
                method: 'POST',
                data: Admin,
                contentType: "application/json;",
                dataType: "json"
            }).success(function (data) {
                if (data == "1") {
                    $scope.CancelClick(r);
                    vm.getPackTechDetails();
                }
                else {
                    $state.go('errorPage', { ErrorNo: data, ErrorMessage: 'Error occured in Update Pack Tech.' });
                }

            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: data, ErrorMessage: 'Error occured in UpdatePackTech method of AdminManagementPackTech.JS' });
            })
        }
    }

    $scope.goState = function () {
        $state.go('Admin');
    }


})