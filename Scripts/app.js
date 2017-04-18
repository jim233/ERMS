'use strict';
var IndexApp = angular.module('ERMS', ['ui.router', 'oc.lazyLoad', 'ui.bootstrap', 'angularFileUpload']);

IndexApp.run(function($rootScope, $state, $stateParams) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;

	$rootScope.$on('$stateChangeStart',
		function(event, toState, toParams, fromState, fromParams) {
			console.log("from the state + " + fromState.name);
		});

	$rootScope.$on('$stateChangeSuccess',
		function(event, toState, toParams, fromState, fromParams) {
			console.log("$stateChangeSuccess!!!!" + toState.name);
			$rootScope.getCurrentName = $state.current.name;
			$rootScope.$broadcast('to-child', $rootScope.getCurrentName);
		});
});

IndexApp.controller("headerCtrl", function($scope, $state, $rootScope) {
	var vm = this;

	$scope.$on('DisableMenu', function (d, data) {	    
	    if (data == '1') {
	        vm.loginEntry = false;
	    } else {
	        vm.loginEntry = true;
	    }

	});

	vm.subMenu = false;
	vm.mainMenu = false;
	vm.loginEntry = true;

	vm.showMainMenu = function() {
		vm.mainMenu = !vm.mainMenu;
	};

	vm.showSubmenu = function() {
		vm.subMenu = !vm.subMenu;
	};

	vm.closeShade = function() {
		vm.mainMenu = false;
	}

	$scope.$on('to-child', function(d, data) {
		vm.getCurrentName = data;
	});

	$scope.getNowState = function (a) {
	    switch (a) {
	        case 'NewCodeRequestSub.NewCodeSC':
	            return 'NewCodeRequests';
	    }
	}

	vm.subTabActive = function (tab) {
	    var a = vm.getCurrentName;
	    $scope.getNowState(a);

	    return vm.getCurrentName === tab;
	};

	vm.subTabActive2 = function(tab) {
		return vm.getCurrentName === tab;
	};

	vm.redirectSubMenu = function (r) {
	    if (r) {
	        switch (r) {
	            case 'home':
	                $state.go('home');
	                break;
	            case 'SearchExistingRequest':
	                $state.go('SearchExistingRequest');
	                break;
	            case 'info':
	                window.open('http://cms/knowhow2/en/Pages/KnowHow.aspx');
	                break;
	            case 'Contact':
	                window.open('mailto:sustex.servicedesk@syngenta.com');
	                break;
	            case 'Help':
	                window.open('http://eame1.dev.intra/ermsNPI/Files/Range_Management_Glossary.htm');
	                break;
	        };
	    }
	    vm.subMenu = false;
	};

	vm.infoNum = '12';

	//	vm.menuRepeat = [
	//      {uiSelf: 'home',name: 'Home'},
	//      {uiSelf: 'CoreRange',name: 'Core Range'},
	//      {uiSelf: 'CoreRange',name: 'Core Range'},
	//	];
});

IndexApp.config(function($stateProvider, $locationProvider, $urlRouterProvider, $ocLazyLoadProvider) {
	$urlRouterProvider.otherwise('home');
	$stateProvider
		.state('home', {
			url: "/home",
			views: {
				"lazyLoadView": {
					controller: 'homePageCtrl',
					templateUrl: 'Home/Home.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/home.js');
				}]
			},
		})
		.state('SupplyChainHome', {
			url: "/SupplyChainHome",
			views: {
				"lazyLoadView": {
					controller: 'SupplyChainHome as SCH',
					templateUrl: 'SupplyChainReq/SupplyChainHome.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load('../Scripts/SupplyChainHome.js');
				}]
			},
		})
		.state('CoreRange', {
		    url: '/CoreRange/:direct',
			views: {
				"lazyLoadView": {
			        controller: 'coreRangeCtrl as coreRange',
					templateUrl: 'CoreRange/CoreRange.html'
				}
			},
		    resolve: {
		        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
		            return $ocLazyLoad.load('../Scripts/CoreRange.js');
		        }]
		    },
		})
		.state('PhaseOuts', {
			url: '/PhaseOuts',
			views: {
			    "lazyLoadView": {
			        controller: 'PhaseOutsCtrl as PhaseOuts',
					templateUrl: 'PhaseOuts/PhaseOuts.html'
				}
			},
			resolve: {
			    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
			        return $ocLazyLoad.load('../Scripts/PhaseOuts.js');
			    }]
			},
		})
		.state('NewCodeRequests', {
			url: '/NewCodeRequests',
			views: {
				"lazyLoadView": {
					controller: 'newCodeRequestCtrl as NCR',
					templateUrl: 'NewCodeReq/NewCodeRequests.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/newCodeRequest.js');
				}]
			},
		})
		.state('SearchExistingRequest', {
			url: "/SearchExistingRequest",
			views: {
				"lazyLoadView": {
					controller: 'searchExistingCtrl as search',
					templateUrl: 'Search/SearchRequest.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/search.js');
				}]
			},
		})
		.state('ERMSReports', {
			url: '/ERMSReports',
			views: {
				"lazyLoadView": {
					templateUrl: 'Reports/ERMSReports.html'
				}
			},
		})
        .state('Reports', {
            url: '/Reports',
            views: {
                "lazyLoadView": {
                    controller: 'reportsCtrl as reports',
                    templateUrl: 'Reports/Reports.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('../Scripts/reports.js');
                }]
            },
        })
		.state('Admin', {
			url: '/Admin',
			views: {
				"lazyLoadView": {
					controller: 'AdminCtrl',
					templateUrl: 'Admin/Admin.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/Admin.js');
				}]
			},
		})
        .state('AdminManagePackTech', {
            url: '/AdminManagePackTech',
            views: {
                "lazyLoadView": {
                    controller: 'AdminManagePackTech as packTechAdmin',
                    templateUrl: 'Admin/AdminManagePackTech.html'
                }
            }, 
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('../Scripts/AdminManagePackTech.js');
                }]
            },
        })
        .state('AdminManageLocalSCP', {
            url: '/AdminManageLocalSCP',
            views: {
                "lazyLoadView": {
                    controller: 'AdminManageLocalSCP as ctrlLocalSCP',
                    templateUrl: 'Admin/AdminManageLocalSCP.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('../Scripts/AdminManageLocalSCP.js');
                }]
            },
        })
        .state('AdminManagePLSContacts', {
            url: '/AdminManagePLSContacts',
            views: {
                "lazyLoadView": {
                    controller: 'AdminManagePLSContacts as ctrlPLSContacts',
                    templateUrl: 'Admin/AdminManagePLSContacts.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('../Scripts/AdminManagePLSContacts.js');
                }]
            },
        })
        .state('AdminManageRequestTypeContacts', {
            url: '/AdminManageRequestTypeContacts',
            views: {
                "lazyLoadView": {
                    controller: 'AdminManageRequestTypeContacts as ctrlReqstTypeContacts',
                    templateUrl: 'Admin/AdminManageRequestTypeContacts.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('../Scripts/AdminManageRequestTypeContacts.js');
                }]
            },
        })
        .state('PackManagement', {
            url: '/PackManagement',
            views: {
                "lazyLoadView": {
                    controller: 'PackManagement as ctrlPackMgmt',
                    templateUrl: 'Admin/PackManagement.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('../Scripts/PackManagement.js');
                }]
            },
        })
        .state('CoreRangeUpload', {
            url: '/CoreRangeUpload',
            views: {
                "lazyLoadView": {
                    controller: 'CoreRangeUpload',
                    templateUrl: 'Admin/CoreRangeUpload.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('../Scripts/CoreRangeUpload.js');
                }]
            },
        })
		.state('NewCodeRequestSub', {
			url: '/NewCodeRequestSub',
			views: {
				"lazyLoadView": {
					controller: 'NewCodeRequestSubCtrl as NCodeRequest',
					templateUrl: 'NewCodeReq/NewCodeRequestSub.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/newCodeRequestSub.js');
				}]
			},
		})
		.state("CombiPHome", {
		    url: "/CombiPackHome/:leadAI",
		    views: {
		        "lazyLoadView": {
		            controller: 'CombiPackHomeCtrl as combiHome',
		            templateUrl: 'NewCodeReq/CombiPackHome.html'
		        }
		    },
		    resolve: {
		        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
		            return $ocLazyLoad.load('../Scripts/CombiPackHome.js');
		        }]
		    },
		})
		.state("NewCombiRequest", {
		    url: "/NewCombiRequest/:LeadAIValue/:fomulation/:LeadAIText",
		    views: {
		        "lazyLoadView": {
		            controller: 'NewCombiRequestCtrl as newCombi',
		            templateUrl: 'NewCodeReq/newCombiRequest.html'
		        }
		    },
		    resolve: {
		        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
		            return $ocLazyLoad.load('../Scripts/newCombiRequest.js');
		        }]
		    },
		})
        .state("CombiPackRequestReport", {
            url: "/CombiPackRequestReport",
            views: {
                "lazyLoadView": {
                    controller: 'CombiRequestReportCtrl as CombiReport',
                    templateUrl: 'NewCodeReq/CombiPackRequestReport.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('../Scripts/CombiPackRequestReport.js');
                }]
            },
        })
		.state("NewCodeRequestSub.NewCodeIMC", {
			url: "/NewCodeRequestSubIMC",
			views: {
				"lazyLoadView": {
					controller: 'NewCodeIMCCtrl as NewCodeIMC',
					templateUrl: 'NewCodeReq/NewCodeIMC.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/NewCodeIMC.js');
				}]
			},
		})
		.state("NewCodeRequestSub.NewCodeSC", {
			url: "/NewCodeRequestSubSupplyChain",
			views: {
				"lazyLoadView": {
					controller: 'NewCodeSupplyChain as NewCodeSC',
					templateUrl: 'NewCodeReq/NewCodeSupplyChain.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/NewCodeSupplyChain.js');
				}]
			},
		})
		.state('SupplyChainRequest', {
			url: '/SupplyChainRequest',
			views: {
				"lazyLoadView": {
					controller: 'SupplyChainRequest as SupplyChain',
					templateUrl: 'SupplyChainReq/SupplyChainRequest.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/SupplyChainRequest.js');
				}]
			},
		})
		.state("SupplyChainRequest.request", {
		    url: "/SupplyChainRequestRequest/:leadAI/:isNew/:rqType/:leadAIText/:Formulation/:ancillaries/:category/:pls/:bottleSize/:NSU/:sPack/:req/:ifGetBoth",
			views: {
				"lazyLoadView": {
				    controller: 'SCRRequest as request',
					templateUrl: 'supplyChainReq/SCRRequest.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/SCRRequest.js');
				}]
			},
		})
		.state("SupplyChainRequest.EPM", {
		    url: "/NewPackRequestEPM/:QueryString",
			views: {
				"lazyLoadView": {
					controller: 'NPREPM as EPM',
					templateUrl: 'newPackReq/NPREPM.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/NPREPM.js');
				}]
			},
		})
        .state("SupplyChainRequest.FirstEPM", {
            url: "/NewPackRequestFirstEPM/:QueryString",
            views: {
                "lazyLoadView": {
                    controller: 'NPREPM as EPM',
                    templateUrl: 'newPackReq/NPREPM.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('../Scripts/NPREPM.js');
                }]
            },
        })
        .state("SupplyChainRequest.FinalEPM", {
            url: "/NewPackRequestFinalEPM/:QueryString",
            views: {
                "lazyLoadView": {
                    controller: 'NPREPM as EPM',
                    templateUrl: 'newPackReq/NPREPM.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('../Scripts/NPREPM.js');
                }]
            },
        })
        //nancy fast
        		.state("SupplyChainRequest.Fast", {
        		    url: "/SupplyChainRequestFast/:QueryString",
		    views: {
		        "lazyLoadView": {
        		            controller: 'SCRFast as Fast',
        		            templateUrl: 'SupplyChainReq/SCRFast.html'
		        }
		    },
		    resolve: {
		        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
        		            return $ocLazyLoad.load('../Scripts/SCRFast.js');
		        }]
		    },
		})
        //nancy SCTeam
        .state("SupplyChainRequest.NPRSCTeam", {
            url: "/NewPackRequestSCTeam/:QueryString",
		    views: {
		        "lazyLoadView": {
                    controller: 'NPRSCTeam as SCTeam',
                    templateUrl: 'newPackReq/NPRSCTeam.html'
		        }
		    },
		    resolve: {
		        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('../Scripts/NPRSCTeam.js');
		        }]
		    },
		})
        .state("SupplyChainRequest.SCRIDS", {
            url: "/NewPackRequestSCRIDS/:QueryString",
            views: {
                "lazyLoadView": {
                    controller: 'SCRIDS as SCRIDS',
                    templateUrl: 'newPackReq/SCRIDS.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('../Scripts/SCRIDS.js');
                }]
            },
        })
		.state("SupplyChainRequest.NPRFast", {
		    url: "/NewPackRequestFast/:QueryString",
			views: {
				"lazyLoadView": {
					controller: 'NPRFast as Fast',
					templateUrl: 'newPackReq/NPRFast.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/NPRFast.js');
				}]
			},
		})
		.state("SupplyChainRequest.FirstGSCM", {
		    url: "/SupplyChainRequestFirstGSCM/:QueryString",
			views: {
				"lazyLoadView": {
				    controller: 'SCRFirstGSCM as FirstGSCM',
					templateUrl: 'SupplyChainReq/SCRFirstGSCM.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/SCRFirstGSCM.js');
				}]
			},
		})
		.state("SupplyChainRequest.SCTeam", {
		    url: "/SupplyChainRequestSCTeam/:QueryString",
			views: {
				"lazyLoadView": {
					controller: 'SCRSCTeam as SCTeam',
					templateUrl: 'SupplyChainReq/SCRSCTeam.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/SCRSCTeam.js');
				}]
			},
		})
		.state("SupplyChainRequest.FinalGSCM", {
		    url: "/SupplyChainRequestFinalGSCM/:QueryString",
			views: {
				"lazyLoadView": {
				    controller: 'SCRFinalGSCM as FinalGSCM',
					templateUrl: 'SupplyChainReq/SCRFinalGSCM.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/SCRFinalGSCM.js');
				}]
			},
		})
		.state("SupplyChainRequest.SCP", {
		    url: "/SupplyChainRequestSCP/:QueryString",
			views: {
				"lazyLoadView": {
					controller: 'SCRSCP as SCP',
					templateUrl: 'SupplyChainReq/SCRSCP.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/SCRSCP.js');
				}]
			},
		})
        .state("SupplyChainRequest.RA", {
            url: "/SupplyChainRequestRA/:QueryString",
            views: {
                "lazyLoadView": {
                    controller: 'RegulatoryApproval as RegApprover',
                    templateUrl: 'SupplyChainReq/RegulatoryApprover.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('../Scripts/RegulatoryApproval.js');
                }]
            },
        })
		.state("SupplyChainRequest.PackEngineer", {
		    url: "/SupplyChainRequestPackEngineer/:QueryString",
			views: {
				"lazyLoadView": {
				    controller: 'SCRPackEngineer as PackEngineer',
					templateUrl: 'SupplyChainReq/SCRPackEngineer.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/SCRPackEngineer.js');
				}]
			},
		})
		.state("SupplyChainRequest.RDM", {
		    url: "/SupplyChainRequestRDM/:QueryString",
			views: {
				"lazyLoadView": {
				    controller: 'SCRRDM as RDM',
					templateUrl: 'SupplyChainReq/SCRRDM.html'
				}
			},
			resolve: {
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				    return $ocLazyLoad.load('../Scripts/SCRRDM.js');
				}]
			},
		})
        //IDS
         .state("SupplyChainRequest.IDS", {
             url: "/SupplyChainRequestIDS/:QueryString",
        	    views: {
        	        "lazyLoadView": {
        	            controller: 'SCRIDS as SCRIDS',
        	            templateUrl: 'SupplyChainReq/SCRIDS.html'
        	        }
        	    },
        	    resolve: {
        	        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
        	            return $ocLazyLoad.load('../Scripts/SCRIDS.js');
        	        }]
        	    },
        	})
        .state('ReportView', {
            url: '/newTableReport/:reportNo/:param1/:param2',
            views: {
                "lazyLoadView": {
                    controller: 'reportCtrl as reportView',
                    templateUrl: 'Reports/newTableReport.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('../Scripts/newTableReport.js');
                }]
            }
        })
        .state('RequestViewHistory', {
            url: '/RequestViewHistory/:QueryString',
            views: {
                "lazyLoadView": {
                    controller: 'viewHistoryCtrl as viewHistory',
                    templateUrl: 'SupplyChainReq/viewHistory.html'
                }
            },
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('../Scripts/RequestViewHistory.js');
                }]
            }
        })
            .state('errorPage', {
                url: '/error/:ErrorNo/:ErrorMessage',
                views: {
                    "lazyLoadView": {
                        controller: 'errorPageCtrl as error',
                        templateUrl: 'error/errorPage.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('../Scripts/error.js');
                    }]
                }
            })

    .state('UserRegistration', {
        url: '/UserRegistration',
        views: {
            "lazyLoadView": {
                controller: 'userCtrl',
                templateUrl: 'User/UserRegistration.html'
            }
        },
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load('../Scripts/UserRegistration.js');
            }]
        }
    })
});