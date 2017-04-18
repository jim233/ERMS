angular.module('ERMS').controller("AdminManageRequestTypeContacts", function ($scope, $state, $http) {
    var vm = this;
    console.log("AdminManageRequestTypeContacts");
    vm.initData = function () {

        vm.hdnDomain = '';
        vm.hdnUserId = '';
        vm.hdnName = '';
        vm.hdnFirstName = '';
        vm.hdnEmail = '';
        vm.hdnLastName = '';
        vm.hdnUrl = '';
        vm.Orginator = '';
        $scope.InputText1 = '';
    }
    vm.initData();
    $scope.EditPart = true;
    $scope.UserName = true;


    vm.getContacts = function () {
        $http({
            url: "Admin/GetRequestTypeContactDetails/",
            method: 'POST',
        }).success(function (data) {
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else if (data) {
                vm.rqTypeContacts = data.RequestTypeContactDetails;
            }

        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in GetRequestTypeContactDetails method of AdminManageRequestTypeContacts.JS' });
            })
    }

    vm.getContacts();

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

    $scope.UpdateClick = function (r, contact) {
        if ($scope.InputText1 == null) {
            alert("Please select the Request type contact name");
        }
        else {
            var Admin = {
                "FirstName": vm.hdnFirstName,
                "LastName": vm.hdnLastName,
                "UserId": vm.hdnDomain + '\\' + vm.hdnUserId,
                "Email": vm.hdnEmail,
                "Id": contact.RequestContact_ID,
                //"SecondUserFirstName": "Renuka",
                //"SecondUserLastName": "Tandon",
                //"SecondUserId": "EAME\t888175",
                //"SecondUserEmail": "Renuka.Tandon@syngenta.com"
            }
            $http({
                url: "Admin/UpdateRequestTypeBasedContacts/",
                method: 'POST',
                data: Admin,
                contentType: "application/json;",
                dataType: "json"
            }).success(function (data) {
                if (data == "1") {
                    $scope.CancelClick(r);
                    vm.getContacts();
                }
                else {
                    $state.go('errorPage', { ErrorNo: data, ErrorMessage: 'Error occured in update request type based contacts' });
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: data, ErrorMessage: 'Error occured in AdminManageRequesTypeContacts.JS' });

            })
        }
    }

    $scope.goState = function () {
        $state.go('Admin');
    }
})