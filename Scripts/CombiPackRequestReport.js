angular.module('ERMS').controller("CombiRequestReportCtrl", function ($scope, $state, $modal, $log, $stateParams, $http) {
    var vm = this;

/**************************************************************************************************
    //Declarations at page level, getting state level parameters,getting controls
/***************************************************************************************************/
    $scope.getValueCombiPack = localStorage.getItem('setNewCombiRequestValue');
    $scope.first_contain = false;
    $scope.second_contain = false;
    $scope.third_contain = false;

    console.log("!! = " + $scope.getValueCombiPack);
    vm.getValue = JSON.parse($scope.getValueCombiPack);

    if (vm.getValue.noOfFormulation) {
        if (vm.getValue.noOfFormulation == '2') {
            $scope.first_contain = true;
            $scope.second_contain = false;
            $scope.third_contain = false;
        } else if (vm.getValue.noOfFormulation == '3') {
            $scope.first_contain = true;
            $scope.second_contain = true;
            $scope.third_contain = false;
        } else if (vm.getValue.noOfFormulation == '4') {
            $scope.first_contain = true;
            $scope.second_contain = true;
            $scope.third_contain = true;
        }
    }

    vm.collation = vm.getValue.quantity1 + '+' + vm.getValue.quantity2 + '+' + vm.getValue.quantity3 + '+' + vm.getValue.quantity4;
    console.log("!! = " + vm.noOfFormulation);

    console.log("Formulation:" + vm.getValue.formulation1);
    if (vm.getValue.formulation1) {
    var FormulationArray = vm.getValue.formulation1.split("-");
    $scope.SFormulation1 = FormulationArray[0];
    $scope.SUCAgiCode1 = FormulationArray[1];
    $scope.SPack1 = FormulationArray[2];
    }
    if (vm.getValue.formulation2) {
    var FormulationArray2 = vm.getValue.formulation2.split("-");
    $scope.SFormulation2 = FormulationArray2[0];
    $scope.SUCAgiCode2 = FormulationArray2[1];
    $scope.SPack2 = FormulationArray2[2];
    }
    if (vm.getValue.formulation3) {
    var FormulationArray3 = vm.getValue.formulation3.split("-");
    $scope.SFormulation3 = FormulationArray3[0];
    $scope.SUCAgiCode3 = FormulationArray3[1];
    $scope.SPack3 = FormulationArray3[2];
    }
    if (vm.getValue.formulation4) {
    var FormulationArray4 = vm.getValue.formulation4.split("-");
    $scope.SFormulation4 = FormulationArray4[0];
    $scope.SUCAgiCode4 = FormulationArray4[1];
    $scope.SPack4 = FormulationArray4[2];
    }

    $scope.CombiPack=(vm.getValue.quantity1 + "+" + vm.getValue.quantity2 + "+" + vm.getValue.quantity3 + "+" + vm.getValue.quantity4);

    $scope.PackRequired1 = vm.getValue.SelectedIsSynBrdPackReq1;
    if ($scope.PackRequired1 == 25) {
        $scope.PackRequired1 = "Yes";
    }
    else if ($scope.PackRequired1 == 26) {
        $scope.PackRequired1 = "No";
    }
    else {
        $scope.PackRequired1 = "";
    }
    $scope.PackRequired2 = vm.getValue.SelectedIsSynBrdPackReq2;
    if ($scope.PackRequired2 == 25) {
        $scope.PackRequired2 = "Yes";
    }
    else if ($scope.PackRequired2 == 26) {
        $scope.PackRequired2 = "No";
    }
    else {
        $scope.PackRequired2 = "";
    }
    $scope.PackRequired3 = vm.getValue.SelectedIsSynBrdPackReq3;
    if ($scope.PackRequired3 == 25) {
        $scope.PackRequired3 = "Yes";
    }
    else if ($scope.PackRequired3 == 26) {
        $scope.PackRequired3 = "No";
    }
    else {
        $scope.PackRequired3 = "";
    }
    $scope.PackRequired4 = vm.getValue.SelectedIsSynBrdPackReq4;
    if ($scope.PackRequired4 == 25) {
        $scope.PackRequired4 = "Yes";
    }
    else if ($scope.PackRequired4 == 26) {
        $scope.PackRequired4 = "No";
    }
    else {
        $scope.PackRequired4 = "";
    }
   
    if(vm.getValue.sUExist1 == "Yes" || vm.getValue.packSize1 != "Pack Not in Core Range")
    {
        $scope.systemaction1 = "SU Exists Create Country Add Request for SCP details";
    }
    else if (vm.getValue.sUExist1 == "No" && vm.getValue.packSize1 == "Pack Not in Core Range")
    {
        $scope.systemaction1 = "Non Core Range Generate New Pack Request";
    }
    else {
        $scope.systemaction1 = "Core Range Generate New Pack Request";
    }

    if (vm.getValue.sUExist2 == "Yes" || vm.getValue.packSize2 != "Pack Not in Core Range") {
        $scope.systemaction2 = "SU Exists Create Country Add Request for SCP details";
    }
    else if (vm.getValue.sUExist2 == "No" && vm.getValue.packSize2 == "Pack Not in Core Range") {
        $scope.systemaction2 = "Non Core Range Generate New Pack Request";
    }
    else {
        $scope.systemaction2 = "Core Range Generate New Pack Request";
    }

    if (vm.getValue.sUExist3 == "Yes" || vm.getValue.packSize3 != "Pack Not in Core Range") {
        $scope.systemaction3 = "SU Exists Create Country Add Request for SCP details";
    }
    else if (vm.getValue.sUExist3 == "No" && vm.getValue.packSize3 == "Pack Not in Core Range") {
        $scope.systemaction3 = "Non Core Range Generate New Pack Request";
    }
    else {
        $scope.systemaction3 = "Core Range Generate New Pack Request";
    }

    if (vm.getValue.sUExist4 == "Yes" || vm.getValue.packSize4 != "Pack Not in Core Range") {
        $scope.systemaction4 = "SU Exists Create Country Add Request for SCP details";
    }
    else if (vm.getValue.sUExist4 == "No" && vm.getValue.packSize4 == "Pack Not in Core Range") {
        $scope.systemaction4 = "Non Core Range Generate New Pack Request";
    }
    else {
        $scope.systemaction4 = "Core Range Generate New Pack Request";
    }

/**************************************************************************************************
//Method call on click of 'CREATE REQUEST(S)' click 
/***************************************************************************************************/
    vm.createOpen = function () {
        var RequestFilters = {
            //Get params for parent
            "collationDesc": $scope.CombiPack,
            "combiPackLeadAI": vm.getValue.leadAIID,
            "combiPackTradeName": vm.getValue.combiPackTradeName,
            "combiPackPresentationCode": vm.getValue.combiPackPresentationCode,
            "combiPackProductLine": vm.getValue.productLineID,
            "combiPackCountryOfSale": vm.getValue.countryID,
            'productCategory': vm.getValue.combiPackProductCategory,
            'noOfFormulation': vm.getValue.noOfFormulation,
            //Start getting params for child element1
            'elementConfiguration1': vm.getValue.elementConfiguration1,
            'elementQuantity1': vm.getValue.elementQuantity1,
            'elementUOM1': vm.getValue.elementUOM1,
            'fillQuantity1': vm.getValue.fillQuantity1,
            'leadAIID1': vm.getValue.leadAIID1,
            'productLineID1': vm.getValue.productLineID1,
            'formulationID1': vm.getValue.formulationID1,
            'packSizeID1': vm.getValue.packSizeID1,
            'tradeName1': vm.getValue.tradeName1,
            'sUAgiCode1': vm.getValue.suAGICode1,
            'countryID': vm.getValue.countryID,
            'requestId': "0",
            'IsSynBrdPack1': vm.getValue.SelectedIsSynBrdPackReq1,
            //Start getting params for child element2
            'elementConfiguration2': vm.getValue.elementConfiguration2,
            'elementQuantity2': vm.getValue.elementQuantity2,
            'elementUOM2': vm.getValue.elementUOM2,
            'fillQuantity2': vm.getValue.fillQuantity2,
            'leadAIID2': vm.getValue.leadAIID2,
            'productLineID2': vm.getValue.productLineID2,
            'formulationID2': vm.getValue.formulationID2,
            'packSizeID2': vm.getValue.packSizeID2,
            'tradeName2': vm.getValue.tradeName2,
            'sUAgiCode2': vm.getValue.suAGICode2,
            'IsSynBrdPack2': vm.getValue.SelectedIsSynBrdPackReq2,
            //Start getting params for child element3
            'elementConfiguration3': vm.getValue.elementConfiguration3,
            'elementQuantity3': vm.getValue.elementQuantity3,
            'elementUOM3': vm.getValue.elementUOM3,
            'fillQuantity3': vm.getValue.fillQuantity3,
            'leadAIID3': vm.getValue.leadAIID3,
            'productLineID3': vm.getValue.productLineID3,
            'formulationID3': vm.getValue.formulationID3,
            'packSizeID3': vm.getValue.packSizeID3,
            'tradeName3': vm.getValue.tradeName3,
            'sUAgiCode3': vm.getValue.suAGICode3,
            'IsSynBrdPack3': vm.getValue.SelectedIsSynBrdPackReq3,
            //Start getting params for child element4
            'elementConfiguration4': vm.getValue.elementConfiguration4,
            'elementQuantity4': vm.getValue.elementQuantity4,
            'elementUOM4': vm.getValue.elementUOM4,
            'fillQuantity4': vm.getValue.fillQuantity4,
            'leadAIID4': vm.getValue.leadAIID4,
            'productLineID4': vm.getValue.productLineID4,
            'formulationID4': vm.getValue.formulationID4,
            'packSizeID4': vm.getValue.packSizeID4,
            'tradeName4': vm.getValue.tradeName4,
            'sUAgiCode4': vm.getValue.suAGICode4,
            'IsSynBrdPack4': vm.getValue.SelectedIsSynBrdPackReq4,
        }
        $http({
            url: "CombiPackRequestConfirm/CreateRequest",
            method: 'POST',
            data: RequestFilters,
            contentType: "application/json;",
            dataType: "json"
        }).success(function (data) {
            if (data == 0) {
                $state.go('errorPage', { ErrorNo: 420, ErrorMessage: 'Error occured in CombiPackRequestConfirm' });
            }
            else {
                console.log(data);
                $scope.RequestID = data;
                $scope.requestType = 'Combi Pack';
                $state.go('SupplyChainRequest.request', { ifGetBoth: 'fromNew', req: $scope.RequestID, rqType: $scope.requestType });
            }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: 420, ErrorMessage: 'Error occured in CombiPackRequestReport.JS' });
        })
    }
})