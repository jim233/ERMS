angular.module('ERMS').controller("AdminManageLocalSCP", function ($scope, $state, $http) {
    var vm = this;

    /***********************************************************************************************/
    /*Declarations, Initialization method*/
    /***********************************************************************************************/
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
        $scope.EditPart = true;
        $scope.UserName = true;
        $scope.InputText1 = null;
        $scope.InputText2 = null;
    }
    vm.initData();
    console.log("AdminManageLocalSCP");


    /***********************************************************************************************/
    //Method to get local scp details
    /***********************************************************************************************/
    vm.getLocalSCPDetails = function () {
        $http({
            url: "Admin/GetLocalSCPDetails/",
            method: 'POST',
        }).success(function (data) {
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else if (data) {
                vm.LocalSCPDetails = data.LocalSCPDetails;
            }

        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in AdminManageLocalSCP.JS' });
        })
    }

    vm.getLocalSCPDetails();

    $scope.EditClick = function (r) {
        console.log("abc = " + r);
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

    $scope.UpdateClick = function (r, localSCPObj) {
        if (localSCPObj == null || $scope.InputText1 == null || $scope.InputText2 == null) {
            alert("Please select the SCP name or Pack Engineer to update");
        }
        else {
            var Admin = {
                "FirstName": vm.hdnFirstName,
                "LastName": vm.hdnLastName,
                "UserId": vm.hdnDomain + '\\' + vm.hdnUserId,
                "Email": vm.hdnEmail,
                "Id": localSCPObj.LocalSCPID,
                "SecondUserFirstName": vm.hdnFirstNameSec,
                "SecondUserLastName": vm.hdnLastNameSec,
                "SecondUserId": vm.hdnDomainSec + '\\' + vm.hdnUserIdSec,
                "SecondUserEmail": vm.hdnEmailSec
            }
            $http({
                url: "Admin/UpdateLocalSCP/",
                method: 'POST',
                data: Admin,
                contentType: "application/json;",
                dataType: "json"
            }).success(function (data) {
                if (data == "1") {
                    $scope.CancelClick(r);
                    vm.getLocalSCPDetails();
                }
                else {
                    $state.go('errorPage', { ErrorNo: data, ErrorMessage: 'Error occured in Update Local SCP.' });
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: data, ErrorMessage: 'Error occured in UpdateLocalSCP method of AdminManageLocalSCP.JS' });

            })
        }
    }

    $scope.goState = function () {
        $state.go('Admin');
    }
})