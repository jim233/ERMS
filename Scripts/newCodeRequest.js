angular.module('ERMS').controller("newCodeRequestCtrl", ['$scope', '$state', '$modal', '$log', function($scope, st, $modal, $log) {
    var vm = this;
/**************************************************************************************************/
//Redirections based on radio buttons selection on New code request landing
/***************************************************************************************************/
	vm.initData = function () {
	    vm.hdnDomain = '';
	    vm.hdnUserId = '';
	    vm.hdnName = '';
	    vm.hdnFirstName = '';
	    vm.hdnEmail = '';
	    vm.hdnLastName = '';
	    vm.hdnUrl = '';
	}
	vm.initData();
    vm.radioChecked='0';
   
    vm.radioCheckedFunc = function() {};

/**************************************************************************************************/
//Goto search or New code request - Supply chain based on radio button selection
/***************************************************************************************************/
	vm.goState = function() {
		if(vm.radioChecked==='0'){
		    st.go('NewCodeRequestSub.NewCodeSC', {direct:'0'});
		}
		if(vm.radioChecked==='1'){
			st.go('SearchExistingRequest');
		}
	};

/**************************************************************************************************/
//Function related to User registration - NOT USED HERE
/***************************************************************************************************/
	vm.goState2 = function(rrrr) {
		console.log("@@@@@@@@@@@@@@@"+rrrr);
		st.go(rrrr);
	}

/**************************************************************************************************/
//Function related to GAL picker
/***************************************************************************************************/
	vm.open = function () {
	    var a, b, c, d, e, f, g;
	    var userDetails = PickAdd(a, b, c, d, e, f, '0', g);
	    console.log(h.FirstName);
	    vm.hdnDomain = userDetails.Domain;
	    vm.hdnUserId = userDetails.UserId;
	    vm.Orginator = userDetails.FirstName + " " + userDetails.LastName;
	    vm.hdnFirstName = userDetails.FirstName;
	    vm.hdnEmail = userDetails.Email;
	    vm.hdnLastName = userDetails.LastName;
	    
	}


/**************************************************************************************************/
//Methods/code related to modal pop up. NOT USED HERE
/***************************************************************************************************/
	$scope.items = ['html5', 'jq', 'FE-演示平台', 'html52', 'jq2', 'FE-演示平台2', 'html53', 'jq3', 'FE-演示平台3','html54', 'jq4', 'FE-演示平台4'];
}])

angular.module('ERMS').controller('ModalInstanceCtrl', function($scope, $modalInstance, items,$modal, $log) { //依赖于modalInstance
	$scope.items = items;
	$scope.selected = {
		item: $scope.items[0]
	};
	$scope.Rchecked0=true;
	$scope.disabled=true;
//	alert($scope.radioChecked0);
	$scope.radioCheckedFunc1= function(disabled){
		$scope.disabled=disabled;
//		alert("mod"+$scope.radioChecked0)
	}

	$scope.ok = function() {
		console.log("$scope.selected:"+$scope.selected.item);
		$modalInstance.close($scope.selected.item); //关闭并返回当前选项
	};
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel'); // 退出
	}
	
	$scope.open1 = function(size) { //打开模态 
		var modalInstance = $modal.open({
			templateUrl: 'myModelContent1.html', //指向上面创建的视图
			controller: 'ModalInstanceCtrl1', // 初始化模态范围
			size: size, //大小配置
			resolve: {
				items: function() {
					return $scope.items;
				}
			}
		})
		modalInstance.result.then(function(selectedItem) {
			$scope.selected = selectedItem;
		}, function() {
			$log.info('Modal dismissed at: ' + new Date())
		})
	}
})

angular.module('ERMS').controller('ModalInstanceCtrl1', function($scope, $modalInstance, items,$modal) { //依赖于modalInstance
	$scope.items = items;
	$scope.selected = {
		item: $scope.items[0]
	};
	$scope.ok = function() {
		$modalInstance.close($scope.selected.item); //关闭并返回当前选项
	};
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel'); // 退出
	}
	
})