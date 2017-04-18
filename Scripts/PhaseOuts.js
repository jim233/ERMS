angular.module('ERMS').controller("PhaseOutsCtrl", function ($scope, $state, $modal, $log, $http) {
    console.log("phaseout");
    var vm = this;
    vm.ShowTable = false;

    vm.PhaseOutsDetails = [
        { SU: "1", LCC: "2", Lead: "3" }, { LCC: "1" }, { Lead: "1" }, { Formulation: "1" }
    ]

    vm.TableShow = function () {
        vm.ShowTable = true;
    }

    vm.TableHide = function () {
        vm.ShowTable = false;
        vm.PhaseOutsDetails = [];
    }
})