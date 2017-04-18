angular.module('ERMS').controller("NewCodeRequestSubCtrl", function($scope,$state) {
    var vm = this;

	$scope.$on('NewCodeRequest-parent', function (d, data) {
	    console.log("!@@!@!@!@!@! +" + d.name + ' ' + data);
	    vm.titleName = data;
	});
});