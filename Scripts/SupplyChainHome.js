angular.module('ERMS').controller("SupplyChainHome", function ($scope, $state, $modal, $log, $http) {
    var vm = this;
    console.log('SupplyChainHome');
    /*********************************************************************************************************/
    //Initialization/Popualtion of default controls
    /*********************************************************************************************************/
    $http({
        url: "CombiPackHome/GetCombiHomeDetails",
        method: 'POST',
    }).success(function (data) {
        if (data.ErrorBE) {
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
        }
        else {
            $scope.GetLeadAI = data.GetLeadAI;
            vm.LeadAIValue = 'SELECT';
        }
    }).error(function (data) {
        console.log("error" + data);
        $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in GetCombiHomeDetails method of SupplyChainHome-JS' });
    });
    /*********************************************************************************************************/
    //Redirection to Supply chain request type - setting up of query parameters to be used in supply chain
    /*********************************************************************************************************/
    $scope.open = function () {
        var leadAIValue = vm.LeadAIValue;
        for (var i = 0; i < $scope.GetLeadAI.length; i++) {
            if (vm.LeadAIValue == $scope.GetLeadAI[i].Value) {
                vm.LeadAIText = $scope.GetLeadAI[i].Text;
            }
        }
        var ifgetBoth = true;
        $state.go('SupplyChainRequest.request', { leadAI: leadAIValue, leadAIText: vm.LeadAIText, ifGetBoth: ifgetBoth, req: '0', rqType: 'Supply Chain' });
    }
    /*********************************************************************************************************/
    //Textarea enabling based on DDL selection
    /*********************************************************************************************************/
    vm.changeForTypehere = function () {
        if (vm.LeadAIValue != 'SELECT') {
            vm.showFirstPart = true;
        }
        else {
            vm.showFirstPart = false;
        }
    }
})