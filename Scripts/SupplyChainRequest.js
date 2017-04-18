angular.module('ERMS').controller("SupplyChainRequest", function ($scope, $http, $state, $rootScope) {
     var vm = this;

    // Display Text Based on Region
    var userRegion = sessionStorage.getItem('UserRegion');

    /*********************************************************************************************************/
    //Initialization/Popualtion of default controls
    /*********************************************************************************************************/
     vm.supplyDetail = '';
     vm.subTabSCRs = [];
     vm.titleName = '';
     $scope.NextTabName = '';
     $scope.showRangeFirst = true;
     var requestType = localStorage.getItem('type');   
     vm.getTypeName = 'EPT';
    
     vm.supplyDetail.rangeNumber = '27874';

     vm.initData = function () {
        vm.GetRangeRequestNumber = '',
        vm.GetRangeRequestType = '',
        vm.GetLeadAI = '',
        vm.GetCountry = '',
        vm.GetTradeName = '',
        vm.GetPack = '',
        vm.GetFirstCodeDate = '',
        vm.GetCodeDueDate = '',
        vm.GetStatus = '',
        vm.GetStatusLastChanged = '',
        vm.GetHasAncillaries = '',
        vm.GetAncillariesComments = '',
        vm.GetProgCode = 0, //int
        vm.GetOriginator = '',
        vm.GetCreatedDate = '',
        vm.GetOtherData  = ''
     };
     vm.initData();
     
     $scope.$on('SCRNameto-parent', function (d, data) {
         console.log("!@@!@!@!@!@! +" + d.name + ' ' + data);
         vm.titleName = data;
         if (localStorage.getItem('titleTypeName')) {
             vm.titleTypeName = localStorage.getItem('titleTypeName');
         }
     });
    

     $scope.$on('SCRNameto-requestTypeName', function (d, data) {
         console.log("!@@!@!@!@!@! +" + d.name + ' ' + data);
         vm.titleTypeName = data;
         localStorage.setItem('titleTypeName', vm.titleTypeName);
     });

     $scope.$on('NextTabName', function (d, data) {
         console.log("!@@!@!@!@!@!222222222 +" + d.name + ' ' + data);
         $scope.NextTabName = data;
     });

     $scope.$on('queryString', function (d, data) {
         console.log("!@@!@!@!@!@!333333333 +" + d.name + ' ' + data);
         $scope.queryString = data;
     });
     
     vm.currentURL = function(a) {
           return $state.href('SupplyChainRequest' + a);
     }
           
    /*********************************************************************************************************/
    //Getting/Pushing TABS
    /*********************************************************************************************************/
     vm.listRequest = {
           url: vm.currentURL('.request'), //the url name should be the same as the following name
           printName: 'Request',   //the display tab name
           name: 'request',   //should be same as the url
           checkName: 'Request',  //check with the value from xml to check this tab should be displayed
           tabReqCode: '1',
     };

     if (userRegion && userRegion == 'LATAM') {
         vm.listEPM = {
             url: vm.currentURL('.EPM'),
             printName: 'LPM',
             name: 'EPM',
             checkName: 'EPM',
             tabReqCode: '2',
         };
     }
     else {
     vm.listEPM = {
           url: vm.currentURL('.EPM'),
           printName: 'LPM',
           name: 'EPM',
           checkName: 'EPM',
           tabReqCode: '2',
     };
     }

     vm.listNPRFast = {
           url: vm.currentURL('.NPRFast'),
           printName: 'Fast',
           name: 'NPRFast',
           checkName: 'NP Fast',
           tabReqCode: '3',
     };
     vm.listFast = {
         url: vm.currentURL('.Fast'),
         printName: 'Fast',
         name: 'Fast',
         checkName: 'SC Fast',
         tabReqCode: '3',
     };
     vm.listFirstGSCM = {
           url: vm.currentURL('.FirstGSCM'),
           printName: 'First GSCM',
           name: 'FirstGSCM',
           checkName: 'First GSCM',
           tabReqCode: '4',
     };
     vm.listSCTeam = {
           url: vm.currentURL('.SCTeam'),
           printName: 'SC Team',
           name: 'SCTeam',
           checkName: 'SC SC Team',
           tabReqCode: '5',     
     };
     vm.listNPRSCTeam = {
         url: vm.currentURL('.NPRSCTeam'),
         printName: 'SC Team',
         name: 'NPRSCTeam',
         checkName: 'NP SC Team',
         tabReqCode: '5',
     };
     vm.listFinalGSCM = {
           url: vm.currentURL('.FinalGSCM'),
           printName: 'Final GSCM',
           name: 'FinalGSCM',
           checkName: 'Final GSCM',
           tabReqCode: '6',           
     }
     vm.listSCP = {
           url: vm.currentURL('.SCP'),
           printName: 'SCP',
           name: 'SCP',
           checkName: 'SCP',
           tabReqCode: '7',           
     };
     vm.listPackEngineer = {
           url: vm.currentURL('.PackEngineer'),
           printName: 'Pack Engineer',
           name: 'PackEngineer',
           checkName: 'Pack Engineer',
           tabReqCode: '8',
     };
     vm.listRDM = {
           url: vm.currentURL('.RDM'),
           printName: 'RDM',
           name: 'RDM',
           checkName: 'RDM',
           tabReqCode: '9',
     };

     if (userRegion && userRegion == 'LATAM') {
         vm.listFirstEPM = {
             url: vm.currentURL('.FirstEPM'),
             printName: 'First LPM',
             name: 'FirstEPM',
             checkName: 'First EPM',
             tabReqCode: '10',
         };
         vm.listFinalEPM = {
             url: vm.currentURL('.FinalEPM'),
             printName: 'Final LPM',
             name: 'FinalEPM',
             checkName: 'Final EPM',
             tabReqCode: '11',
         };
     }
     else {
         vm.listFirstEPM = {
             url: vm.currentURL('.FirstEPM'),
             printName: 'First EPM',
             name: 'FirstEPM',
             checkName: 'First EPM',
             tabReqCode: '10',
         };
         vm.listFinalEPM = {
             url: vm.currentURL('.FinalEPM'),
             printName: 'Final EPM',
             name: 'FinalEPM',
             checkName: 'Final EPM',
             tabReqCode: '11',
         };
     }
     
     vm.listIDS = {
         url: vm.currentURL('.IDS'),
         printName: 'MDM',
         name: 'IDS',
         checkName: 'IDS',
         tabReqCode: '12',
     };
     vm.listRA = {
         url: vm.currentURL('.RA'),
         printName: 'RA',
         name: 'RA',
         checkName: 'RA',
         tabReqCode: '13',
     };
    //Add By Martin, 2016-08-04, Request Tab
     vm.tabList = [];
     vm.tabList.push(vm.listRequest, vm.listEPM, vm.listFirstEPM, vm.listFast, vm.listNPRFast, vm.listFirstGSCM, vm.listSCTeam, vm.listNPRSCTeam, vm.listFinalGSCM, vm.listFinalEPM, vm.listSCP,vm.listRA, vm.listPackEngineer, vm.listIDS, vm.listRDM);

    /*********************************************************************************************************/
    //If redirection from combi pack [requests child of combi pack then]
    /*********************************************************************************************************/
    //getRedirect from Range Request No.
     $scope.getRedirectFromRRNF = function (r,q) {
         if (r) {
             if (q == 'CombiPack') {
                 q = 'Combi Pack';
             }
             $state.go('SupplyChainRequest.request', { req: r, rqType: q, ifGetBoth: '10001' });
             console.log("!!RRRRR = " + r + ' ' + q);
         }

     };
    /*********************************************************************************************************/
    //Redirection to view history
    /*********************************************************************************************************/
     vm.getNewViewHistory = function () {
         $state.go('RequestViewHistory');
     }


    /*********************************************************************************************************/
    //Getting tabs to be displayed based on request type and getting header data
    /*********************************************************************************************************/
     $scope.getListTabs = function (a) {
         var requestID;
         if ($scope.NewRequestID) {
             requestID = $scope.NewRequestID;
         } else {
             requestID = localStorage.getItem('name');
         }
         if (requestID != null) {
             $http.get('NewPackRequest/GetRequestTab?requestId=' + requestID)
                  .success(function (data) {
                      if (data.ErrorBE) {
                          $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
                      }
                      else {
                          vm.GetRangeRequestNumber = data.GetRangeRequestNumber;
                          console.log("abc + " + vm.GetRangeRequestNumber);
                          if (vm.GetRangeRequestNumber) {
                              if (vm.GetRangeRequestNumber.indexOf('?') > -1) {
                                  $scope.showRangeFirst = false;
                                  var a = vm.GetRangeRequestNumber.split("?");
                                  vm.GetRangeRequestNumberFst = a[0];
                                  vm.GetRangeRequestNumberSnd = a[1];
                                  vm.GetRangeRequestNumberThd = a[2];
                                  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@" + ' ' + a[0] + ' ' + a[1] + ' ' + a[2]);
                              } else {
                                  $scope.showRangeFirst = true;
                              }
                          }
                          vm.GetRangeRequestType = data.GetRangeRequestType;
                          vm.GetLeadAI = data.GetLeadAI;
                          vm.GetCountry = data.GetCountry;
                          vm.GetTradeName = data.GetTradeName;
                          vm.GetPack = data.GetPack;
                          vm.GetFirstCodeDate = data.GetFirstCodeDate;
                          vm.GetCodeDueDate = data.GetCodeDueDate;
                          vm.GetStatus = data.GetStatus;
                          vm.GetStatusLastChanged = data.GetStatusLastChanged;
                          vm.GetHasAncillaries = data.GetHasAncillaries;
                          vm.GetAncillariesComments = data.GetAncillariesComments;
                          vm.GetProgCode = data.GetProgCode; //int
                          vm.GetOriginator = data.GetOriginator;
                          vm.GetCreatedDate = data.GetCreatedDate;
                          vm.GetOtherData = data.GetOtherData;
                          vm.subTabSCRs = [];
                          angular.forEach(data.TabNames, function (curData, index, array) {
                              angular.forEach(vm.tabList, function (curTab, index, array) {
                                  //if (curData == curTab.printName) {
                                  //    vm.subTabSCRs.push(curTab);
                                  //}
                                  //console.log(curData + ' = ' + curTab.name);
                                  if (curTab.checkName == 'First EPM') {
                                      sessionStorage.setItem('FromEPM', 'ATCDisplay');
                                  }
                                  if (curData == curTab.checkName) {
                                      vm.subTabSCRs.push(curTab);

                                  }
                              })
                          });
                          return;
                      }
                  });
         }
         else {
             vm.subTabSCRs.push(vm.listRequest);
         }
     };

     $scope.$watch('NextTabName', $scope.goRefreshTabs = function () {
         //debugger;
         if ($scope.NextTabName) {
             vm.subTabSCRs = [];
             $scope.getListTabs();
             $state.go('SupplyChainRequest.' + $scope.NextTabName, { QueryString: $scope.queryString });
         }
     });
     
     $scope.getListTabs();
     $scope.$on('SCRNameto-requestID', function (d, data) {
         console.log("!@@!@!@!@!@! +" + d.name + ' ' + data);
         $scope.NewRequestID = data;
         $scope.getListTabs($scope.NewRequestID);
     });
     //$scope.$watch('NewRequestID', $scope.getListTabs('a'));

    /*********************************************************************************************************/
    //Redirection to new code request page
    /*********************************************************************************************************/
     vm.goBack = function () {
         $state.go('NewCodeRequests');
     };
     //vm.subTabSCRs.push(vm.listRequest, vm.listEPM);
    //Add End

     //switch (vm.getTypeName) {

     //        case 'EPT':
     //           vm.subTabSCRs.push(vm.listRequest,vm.listEPM,vm.listFast,vm.listFirstGSCM);
     //            break;
     //        case 'New Pack':
     //           vm.subTabSCRs.push(vm.listRequest,vm.listEPM);
     //            break;
     //        case 'Country Add':
     //           vm.subTabSCRs.push(vm.listRequest,vm.listEPM);
     //            break;
     //        case 'PFR':
     //           vm.subTabSCRs.push(vm.listRequest,vm.listEPM);
     //            break;
     //        case 'Other':
     //           vm.subTabSCRs.push(vm.listRequest,vm.listEPM);
     //            break;
     //        case 'Supply Chain':
     //           vm.subTabSCRs.push(vm.listRequest,vm.listEPM);
     //            break;
     //        case 'Combi Pack':
     //           vm.subTabSCRs.push(vm.listRequest,vm.listEPM);
     //            break;
     //        default:
     //            vm.subTabSCRs = [];
     //    }
});

