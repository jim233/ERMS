angular.module('ERMS').controller("NewCodeIMCCtrl", function ($scope, $state, $rootScope) {
	var vm = this;

/**************************************************************************************************
//Redirections based on radio buttons selection in IMC tab under new code requests menu item
/***************************************************************************************************/
	vm.radioChecked0 = '1';
	vm.Rchecked0 = '1';
	vm.radioChecked1 = '2';

	vm.showStateName = 'IMC/Country Request';
	$rootScope.$broadcast('NewCodeRequest-parent', vm.showStateName);

	vm.showPart2 = true;
	vm.showPart3 = true;
	vm.Rchecked1 = true;
	vm.Rchecked2 = true;
	vm.radioCheckedFunc = function () {
	    if (vm.radioChecked0 === '0') {
	        vm.showPart2 = false;
	        vm.showPart3 = false;
	    }
	    if (vm.radioChecked0 === '1') {
	        vm.showPart2 = true;
	        vm.showPart3 = true;
	    }
	}
	
	vm.goState = function() {
		if(vm.radioChecked0==='1'){
		    $state.go('CoreRange', { direct: '0',type:'tao' });
		}
		if (vm.radioChecked0 === '0' && vm.radioChecked1 == '2') {
		    localStorage.setItem('name','0');
		    localStorage.setItem('type','PFR');
			$state.go('SupplyChainRequest.request');
		}
		if (vm.radioChecked0 === '0' && vm.radioChecked1 == '3') {
		    localStorage.setItem('name', '0');
		    localStorage.setItem('type', 'Other');
			$state.go('SupplyChainRequest.request');
		}
	};
});