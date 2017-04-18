angular.module('ERMS').controller("NewCodeSupplyChain", function ($scope, $state, $modal, $log, $rootScope) {
    var vm = this;
    var userRegion = sessionStorage.getItem('UserRegion');

    if (userRegion && userRegion == 'LATAM') {
        $scope.showERMS = false;
        $scope.showLRMS = true;
    }
    else {
        $scope.showERMS = true;
        $scope.showLRMS = false;
    }

/**************************************************************************************************/
//Method/Initilization for Supply chain home from New code Request menu
/***************************************************************************************************/
	$scope.radioChecked=[];
	$scope.radioChecked.ooo='aaa';
	$scope.radioChecked.qqq = '0';
	vm.showStateName = 'Supply Chain Request';
	$rootScope.$broadcast('NewCodeRequest-parent', vm.showStateName);

	$scope.radioCheckedFunc = function() {
		console.log("444444 " + $scope.radioChecked);
		if($scope.radioChecked.qqq === '0'){

		}
		if($scope.radioChecked.qqq === '1'){

		}
	}
	
/**************************************************************************************************/
//Open modal popup
/***************************************************************************************************/
	$scope.open = function (size) {
		var modalInstance = $modal.open({
			templateUrl: 'myModelContent.html', 
			controller: 'ModalInstanceCtrl', 
			size: size,
			resolve: {
				radioChecked: function() {
					return $scope.radioChecked;
				}
			}
		})
		modalInstance.result.then(function(selectedItem) {
//			$scope.selected = selectedItem;
		}, function() {
			$log.info('Modal dismissed at: ' + new Date())
		})
	}
});

/**************************************************************************************************/
//Redirection based on option selected and on click of OK on modal popup
/***************************************************************************************************/
angular.module('ERMS').controller('ModalInstanceCtrl', function($scope, $modalInstance, radioChecked,$state) { //依赖于modalInstance
	$scope.radioChecked = radioChecked;
	
	console.log(JSON.stringify($scope.radioChecked));
	$scope.ok = function () {
	   
//		$modalInstance.close($scope.selected.item); //关闭并返回当前选项
		$modalInstance.dismiss('cancel'); // 退出
		if ($scope.radioChecked.qqq === '0') {
		    localStorage.removeItem('name');
		    localStorage.removeItem('type');
			$state.go('SupplyChainHome');
		}
		if ($scope.radioChecked.qqq === '1') {
		    localStorage.setItem('name', '0');
		    localStorage.setItem('type', 'EPT');
			$state.go('SupplyChainRequest.request');
		}
	};
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel'); // 退出
	}
})