angular.module('ERMS').controller("ReportNAR", function ($scope, $state, $modal, $log, $stateParams) {
    var vm = this;

    var producerType = $stateParams.producerType;
    $scope.typeOne = false;
    $scope.typeTwo = false;
    $scope.typeThree = false;
    $scope.typeFour = false;
    $scope.typeFive = false;
    $scope.typeSix = false;
    $scope.typeSeven = false;
    $scope.typeEight = false;
    $scope.typeNine = false;
    $scope.typeTen = false;
    console.log("!!!!!!!!" + producerType);
    $scope.tableListBig = [];
    $scope.tableListBig = [
        { requestId: "24629", type: "Combi Pack", OverDue: "05/08/2010", Status: "amy.chen@syngenta.com", Country: "TBA", Area: "05/08/2010", SUCode: "", SURaised: "", CurrentDueDate: "", DaysOverdue: "" },
        { requestId: "24629", type: "Combi Pack", OverDue: "05/08/2010", Status: "amy.chen@syngenta.com", Country: "TBA", Area: "05/08/2010", SUCode: "", SURaised: "", CurrentDueDate: "", DaysOverdue: "" },
    ]

   switch (producerType) {
        case 'StatusRDM':
            $scope.typeOne = true;
            break;
        case 'viewSummary':
            $scope.typeTwo = true;
            break;
        case 'selectPackStatus':
            $scope.typeThree = true;
            break;
        case 'lineReport':
            $scope.typeFour = true;
            break;
        case 'summaryProgress':
            $scope.typeFive = true;
            break;
        case 'rangeProgress':
            $scope.typeSix = true;
            break;
        case 'timeTakenStages':
            $scope.typeSeven = true;
            break;
        case 'viewKPI':
            $scope.typeEight = true;
            break;
        case 'addCoreRange':
            $scope.typeNine = true;
            break;
        case 'packReport':
            $scope.typeTen = true;
            break;

        default:
            break;
    }

    $scope.goState = function () {
        $state.go("Reports");
    }
})