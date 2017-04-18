angular.module('ERMS').controller("CoreRangeUpload", function ($scope, $state, $http) {
    var vm = this;

    vm.CoreRangeUploadMess = '';
    vm.CoreRangeUploadMessageonLoad = '';
    console.log("CoreRangeUpload");
    $scope.uploadme = '';
    $scope.fileValue = '';
    $scope.getSuccessValue = false;

   
    $http({
        url: "Admin/GetCoreRangeUploadDetails",
        method: 'POST',
    }).success(function (data) {
        if (data.ErrorBE) {
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
        }
        else if (data) {           
            $scope.CoreRangeUploadMessageonLoad = data.CoreRangeUploadMessageonLoad;
        }
    }).error(function (data) {
        console.log("error" + data);
        $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in Corerangeupload.JS' });
    })

    $scope.goState = function () {
        $state.go('Admin');
    }

    $scope.uploadfile = function () {
        console.log("abc");
       
        var file = $("#upfile").val();
        $http({
            url: "Admin/GetCoreRangePath?path=" + file,
            method: 'POST',
        }).success(function (data) {
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else if (data) {
                $scope.getSuccessValue = true;
                $scope.CoreRangeUploadMess = data.CoreRangeUploadMess;
            }
            
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in GetCoreRangePath method of CoreRangeUpload.JS' });
           })
    }
});