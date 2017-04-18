angular.module('ERMS').controller("CombiPackHomeCtrl", function ($scope, $state, $modal, $log, $stateParams, $http) {
    var vm = this;
/**************************************************************************************************
//Declarations at page level, getting state level parameters and page load method call
/***************************************************************************************************/
    console.log('CombiPackHomeCtrl');
    if ($stateParams.leadAI) {
        $scope.nprLeadAI = $stateParams.leadAI;
    }

         $http({
            url: "CombiPackHome/GetCombiHomeDetails",
            method: 'POST',
         }).success(function (data) {
             if (data.ErrorBE) {
                 $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
             }
             else if (data) {
                 $scope.GetLeadAI = data.GetLeadAI;
                 $scope.GetFormulation = data.GetFormulation;
                 if ($scope.nprLeadAI) {
                     vm.LeadAIValue = $scope.nprLeadAI;
                 } else {
                     vm.LeadAIValue = data.CheckLeadAI;
                 }
                 for (var i = 0; i < $scope.GetLeadAI.length; i++) {
                     if (vm.LeadAIValue == $scope.GetLeadAI[i].Value) {
                         vm.LeadAIText = $scope.GetLeadAI[i].Text;
                     }
                 }
                 vm.requestSelected = "SELECT";
             }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in GetCombiHomeDetails method of CombiPackHome.JS' });
        });

/**************************************************************************************************
//Redirection to New combi pack request with elements enabled based on No of formulations selected
/***************************************************************************************************/
         $scope.open = function () {
             $state.go('NewCombiRequest', { LeadAIValue: vm.LeadAIValue, fomulation: vm.requestSelected, LeadAIText: vm.LeadAIText });
         }
});