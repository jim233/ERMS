angular.module('ERMS').controller("AdminManagePLSContacts", function ($scope, $state, $http) {
    var vm = this;
    console.log("AdminManagePLSContacts");
    vm.initData = function () {
        vm.hdnDomain = '';
        vm.hdnUserId = '';
        vm.hdnName = '';
        vm.hdnFirstName = '';
        vm.hdnEmail = '';
        vm.hdnLastName = '';
        vm.hdnUrl = '';
        vm.Orginator = '';

        vm.hdnDomainSec = '';
        vm.hdnUserIdSec = '';
        vm.hdnNameSec = '';
        vm.hdnFirstNameSec = '';
        vm.hdnEmailSec = '';
        vm.hdnLastNameSec = '';
        vm.hdnUrlSec = '';
        vm.OrginatorSec = '';
        $scope.InputText1 = '';
        $scope.InputText2 = '';
    }
    vm.initData();
    $scope.EditPart = true;
    $scope.UserName = true;


    vm.getPLSContacts = function () {
        $http({
            url: "Admin/GetPLSContactDetails/",
            method: 'POST',
        }).success(function (data) {
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else if (data) {
                vm.PLSContacts = data.PLSContactDetails;
            }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in GetPLSContactDetails method in AdminManagePLSContacts.JS' });
        })
    }

    vm.getPLSContacts();

    /**************************************************************************************************
    //Function related to GAL picker
    /***************************************************************************************************/
    vm.openFirst = function () {
        var a, b, c, d, e, f, g;
        var userDetails = PickAdd(a, b, c, d, e, f, '0', g);
        vm.hdnDomain = userDetails.Domain;
        vm.hdnUserId = userDetails.UserId;
        vm.Orginator = userDetails.FirstName + " " + userDetails.LastName;
        vm.hdnFirstName = userDetails.FirstName;
        vm.hdnEmail = userDetails.Email;
        vm.hdnLastName = userDetails.LastName;
        //To display in textbox when selected
        $scope.InputText1 = vm.Orginator;
    }

    vm.openSecond = function () {
        var a, b, c, d, e, f, g;
        var userDetails = PickAdd(a, b, c, d, e, f, '0', g);
        vm.hdnDomainSec = userDetails.Domain;
        vm.hdnUserIdSec = userDetails.UserId;
        vm.OrginatorSec = userDetails.FirstName + " " + userDetails.LastName;
        vm.hdnFirstNameSec = userDetails.FirstName;
        vm.hdnEmailSec = userDetails.Email;
        vm.hdnLastNameSec = userDetails.LastName;
        //To display in textbox when selected
        $scope.InputText2 = vm.OrginatorSec;
    }

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

    $scope.UpdateClick = function (r, plsContactObj) {
        if ($scope.InputText1 == null || $scope.InputText2 == null) {
            alert("Please select the SCP name or Pack Engineer to update");
        }
        else {
            var Admin = {
                "FirstName": vm.hdnFirstNameSec,
                "LastName": vm.hdnLastNameSec,
                "UserId": vm.hdnDomainSec + '\\' + vm.hdnUserIdSec,
                "Email": vm.hdnEmailSec,
                "Id": plsContactObj.PLSContact_ID,
                "SecondUserFirstName": vm.hdnFirstName,
                "SecondUserLastName": vm.hdnLastName,
                "SecondUserId": vm.hdnDomain + '\\' + vm.hdnUserId,
                "SecondUserEmail": vm.hdnEmail
            }
            $http({
                url: "Admin/UpdatePLS/",
                method: 'POST',
                data: Admin,
                contentType: "application/json;",
                dataType: "json"
            }).success(function (data) {
                if (data == "1") {
                    $scope.CancelClick(r);
                    vm.getPLSContacts();
                }
                else {
                    $state.go('errorPage', { ErrorNo: data, ErrorMessage: 'Error occured in Update PLS' });
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: data, ErrorMessage: 'Error occured in UpdatePLS method of AdminManagePLSContact.JS' });

            })
        }
    }

    $scope.goState = function () {
        $state.go('Admin');
    }




})