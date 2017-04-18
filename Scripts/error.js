angular.module('ERMS').controller("errorPageCtrl", function ($scope, $state, $modal, $log, $http, $stateParams) {
    var vm = this;
    var ErrorNumber;
    var ErrorMessage;
    console.log('error');
    if ($stateParams.ErrorNo)
    {
        vm.ErrorNumber = $stateParams.ErrorNo;
        vm.ErrorMessage = $stateParams.ErrorMessage;
    }
})