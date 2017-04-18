angular.module('ERMS').controller("AdminCtrl", function ($scope, $state) {
	var vm = this;
	console.log("Admin");

	$scope.AdmLinkRepeat = [{
		Admlink: 'Manage Pack Tech',
		url: 'AdminManagePackTech'
	}, {
	    Admlink: 'Manage Local Contacts',
	    url: 'AdminManageLocalSCP'
	}, {
	    Admlink: 'Manage PLS Contacts',
	    url: 'AdminManagePLSContacts'
	}, {
	    Admlink: 'Manage Contacts Based on Request Type',
	    url: 'AdminManageRequestTypeContacts'
	},{
	    Admlink: 'Manage Pack',
	    url: 'PackManagement'
	},{
	    Admlink: 'Core Range Upload',
	    url: 'CoreRangeUpload'
	}, 
	];
})