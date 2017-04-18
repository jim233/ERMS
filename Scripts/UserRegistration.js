angular.module('ERMS').controller("userCtrl", function ($scope, $state, $http, $modal, $log, $rootScope) {
    var vm = this;
    console.log("QQQQQQQQQQQQQQQQQQQQQQQ");
    $rootScope.$broadcast('DisableMenu', '1');

    $scope.regionsList = [{ Value: 'EAME', Text: 'EAME' }, { Value: 'LATAM', Text: 'LATAM' }];
    $scope.initData = function () {
        $scope.UserID = '';
        $scope.FirstName = '';
        $scope.LastName = '';
        $scope.Email = '';
        $scope.region = 'EAME';
        $scope.Domain = '';
    }

    $scope.initData();

    //Method to open GAL Picker and get the user details
    $scope.GALOpen = function () {

        var a, b, c, d, e, f, g;
        var userDetails = PickAdd(a, b, c, d, e, f, '0', g);

        $scope.Domain = userDetails.Domain;
        $scope.UserID = userDetails.Domain + "\\" + userDetails.UserId;
        $scope.region = userDetails.FirstName + " " + userDetails.LastName;
        $scope.FirstName = userDetails.FirstName;
        $scope.Email = userDetails.Email;
        $scope.LastName = userDetails.LastName;
        $scope.UserName = userDetails.FirstName + " " + userDetails.LastName;
    }

    //method to save the user details for user registration
    $scope.Register = function () {

        if ($scope.UserID != '' && $scope.FirstName != '' && $scope.LastName != '' && $scope.Email != '' && $scope.region != '') {

            var userDetails = {
                "FirstName": $scope.FirstName,
                "LastName": $scope.LastName,
                "UserId": $scope.UserID,
                "Email": $scope.Email,
                "Region": $scope.region
            }
            $http({
                url: "User/RegisterUser/",
                method: 'POST',
                data: userDetails,
                contentType: "application/json;",
                dataType: "json"
            }).success(function (data) {
                if (data == "-1") {
                    alert("Registration Failed");
                }
                else {
                    $rootScope.$broadcast('DisableMenu', '0');
                    $state.go('home');
                }
            }).error(function (data) {
            });
        }
    }
})
