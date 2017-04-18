'use strict';
var IndexApp = angular.module('ERMS_print', ['ui.bootstrap']);
var data = sessionStorage.getItem('Data');
var RequestFilters = JSON.parse(data);
IndexApp.controller("printCtrl", function ($scope, $rootScope, $http) {
    console.log("abcabcabc");

    var str = location.href; //
    var num = str.indexOf("?");
    if (num) {
        str = str.substr(num + 1); //s
        var arr = str.split("&"); //
    }

    var vm = this;
    $scope.hideTitle = true;

    $http({
        url: "Search/GetPrintResultsData",
        method: 'POST',
        data: RequestFilters,
        contentType: "application/json;",
        dataType: "json"
    }).success(function (data) {
        vm.getTableReturn = data;
    }).error(function (data) {
        console.log("error" + data);
    })
    

    vm.print = function () {
         console.log("cdcdcd");
        $scope.hideTitle = false;
        location.reload(true); window.print();
    }
});