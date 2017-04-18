angular.module('ERMS').controller("homePageCtrl", function ($scope, $state, $http) {
    //debugger;
    var vm = this;
    console.log("QQQQQQQQQQQQQQQQQQQQQQQ");

    $http({
        url: "Home/SetCurrentUser/",
        method: 'POST',
    })
    .success(function (data) {
        if (data.IsAuthorized == "false") {
            $state.go('UserRegistration');
        }
        else {
            $scope.Title = data.TitleRegion;
            $scope.WelcomeNote = data.WelcomeText;
            $scope.TrainingText = data.TrainingText;
            $scope.TrainingNote = data.TrainingNote;
            sessionStorage.setItem('UserRegion', data.Region);
        }
    })
    .error(function (data) {
        console.log("error" + data);
        $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in Home.JS' });
    })
})
