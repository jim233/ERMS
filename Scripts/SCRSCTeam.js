angular.module('ERMS').controller("SCRSCTeam", function ($scope, $filter, $http, $state, $stateParams, $rootScope) {
    var vm = this;
    var requestType;
/*********************************************************************************************************/
//Initialization/Popualtion of default controls and enabling of controls based on type of request
/*********************************************************************************************************/
    vm.showStateName = 'SC Team';
    $rootScope.$broadcast('SCRNameto-parent', vm.showStateName);
    vm.initData = function () {
        //GSCM
        vm.GSCMName = '';
        vm.GSCMNameDisabled = false;
        vm.GSCMApprovedSelected = 'SELECT';
        vm.GSCMApprovedDisabled = false;
        vm.GSCMcomments = '';
        vm.hdnGSCMcomments = '';
        vm.GSCMCommentsReadOnly = false;
        vm.GSCMSaveDisabled = false;
        //Packaging
        vm.Packaging = '';
        vm.Packcomments = '';
        vm.hdnPackcomments = '';
        vm.PackApprovedSelected = 'SELECT';
        vm.packTechnologistSelected = 'SELECT';
        vm.PackagingDisabled = false;
        vm.ApprovedDisabled = false;
        vm.packTechnologistDisabled = false;
        vm.PackCommentsReadOnly = false;
        vm.PackagingSaveDisabled = false;
        //F&P Sourcing
        vm.FPSourcing = '';
        vm.FPcomments = '';
        vm.hdnFPcomments = '';
        vm.FPApprovedSelected = 'SELECT';
        vm.FPSourcingDisabled = false;
        vm.FPApprovedDisabled = false;
        vm.FPCommentsReadOnly = false;
        vm.FAndPSourcingSaveDisabled = false;
        vm.FPComPlantSelected = 'SELECT';
        vm.FPComPlantDisabled = false;
        //Global Transfer Pricing
        vm.GTPName = '';
        vm.GTPNameDisabled = false;
        vm.GTPApprovedSelected = 'SELECT';
        vm.GTPApprovedDiabled = false;
        vm.PricipalLegalEntitySelected = 'SELECT';
        vm.PricipalLegalEntityDisabled = false;
        vm.GTPcomments = '';
        vm.hdnGTPcomments = '';
        vm.GTPcommentsReadOnly = false;
        vm.GTPSaveDisabled = false;
        //Pack Purchasing
        vm.packPurchasing = '';
        vm.PPcomments = '';
        vm.hdnPPcomments = '';
        vm.PPApprovedSelected = 'SELECT';
        vm.packPurchasingDisabled = false;
        vm.PPApprovedDisabled = false;
        vm.PPCommentsReadOnly = false;
        vm.PackPurchasingSaveDisabled = false;
        //Data management
        vm.DataManegementName = '';
        vm.DataManegementNameReadOnly = false;
        vm.DataManagementApprovedSelected = 'SELECT';
        vm.DataManagementApprovedDiabled = false;
        vm.DataManagementEstOfDateCompletion = '';
        vm.DataManagementEstOfDateCompletionDisabled = false;
        vm.DataManagementComments = '';
        vm.hdnDataManagementComments = '';
        vm.DataManagementCommentsReadOnly = false;
        //Administrator
        vm.Administrator = '';
        vm.resolutionComments = '';
        vm.hdnresolutionComments = '';
        vm.OutcomeSelected = 'SELECT';
        vm.AdministratorDisabled = false;
        vm.OutcomeDisabled = false;
        vm.resolutionCommentsReadOnly = false;
        vm.getRQTY = '';
        vm.SaveDisabled = false;
        vm.message1Show = true;
        vm.GSCMShow = true;
        vm.FPComPlantShow = true;
        vm.GTPShow = true;
        vm.DataManageShow = true;
        vm.PackTechnologistShow = true;
        vm.username = '';
        console.log('SC Team page!!!');
    }
    vm.initData();
    vm.showOperationMsgPart = function (msg) {
        vm.showOperationMsg = true;
        vm.operationMsg = msg;
    }

    vm.hideOperationMsgPart = function () {
        vm.showOperationMsg = false;
        vm.operationMsg = '';
    }

    vm.hideOperationMsgPart();
    /*********************************************************************************************************/
    //Getting request no. and request type from local storage and assigning ID for request types
    /*********************************************************************************************************/
    var requestId = localStorage.getItem('name');
    var requestTypeName = localStorage.getItem('type');
    if (requestTypeName == 'EPT') {
        requestType = 1;
    } else if (requestTypeName == 'New Pack') {
        requestType = 2;
    } else if (requestTypeName == 'Country Add') {
        requestType = 3;
    } else if (requestTypeName == 'Supply Chain') {
        requestType = 4;
    } else if (requestTypeName == 'Combi Pack') {
        requestType = 5;
    } else if (requestTypeName == 'PFR') {
        requestType = 6;
    } else if (requestTypeName == 'Other') {
        requestType = 7;
    } else if (requestTypeName == 'EPT-Copy') {
        requestType = 8;
    }
    var queryString = $stateParams.QueryString;
    console.log('Query String: ' + queryString);

    if (queryString == '') {
        queryString = 'requestId=' + requestId;
    }
    /*********************************************************************************************************/
    //Date format
    /*********************************************************************************************************/
    //for date format
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //mouth
            "d+": this.getDate(), //day 
            "h+": this.getHours(), //hour 
            "m+": this.getMinutes(), //mins 
            "s+": this.getSeconds(), //second 
            "q+": Math.floor((this.getMonth() + 3) / 3), //season 
            "S": this.getMilliseconds() //mSecond 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    /*********************************************************************************************************/
    //Getting SCT request details to be populated on page load
    /*********************************************************************************************************/
    $http.get('SCTeam_SupplyChain/GetSCRSCTeam?' + queryString)
        .success(function (data) {
            console.log(data);
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else {
            //GSCM
            vm.GSCMName = data.GetGSCMName;
            vm.GSCMNameDisabled = vm.GSCMNameDisabled;
            vm.GSCMApproved = data.GetGSCMApproved;
            //vm.GSCMApprovedSelected = data.GetSelectedGSCMApproved;
            if (data.GetSelectedGSCMApproved == "0" || data.GetSelectedGSCMApproved == null) {
                vm.GSCMApprovedSelected = 'SELECT';
            }
            else {
                vm.GSCMApprovedSelected = data.GetSelectedGSCMApproved;
            }
            //vm.GSCMApprovedSelected = '18';
            vm.GSCMApprovedDisabled = data.GSCMApprovedDisabled;
            vm.GSCMcomments = data.GetGSCMComments;
            vm.hdnGSCMcomments = data.GetGSCMComments;
            vm.GSCMCommentsReadOnly = data.GSCMCommentsReadOnly;
            vm.GSCMSaveDisabled = data.GSCMSaveDisabled;
            //Packaging
            vm.Packaging = data.GetPackagingName;
            vm.PackApproved = data.GetPackagingApproved;
            //vm.PackApprovedSelected = data.GetSelectedPackagingApproved;
            if (data.GetSelectedPackagingApproved == "0" || data.GetSelectedPackagingApproved == null) {
                vm.PackApprovedSelected = 'SELECT';
            }
            else {
                vm.PackApprovedSelected = data.GetSelectedPackagingApproved;
            }
            vm.packTechnologist = data.GetPackTechnologist;
           // vm.packTechnologistSelected = data.GetSelectedPackTechnologist;
            if (data.GetSelectedPackTechnologist == "0" || data.GetSelectedPackTechnologist == null) {
                vm.packTechnologistSelected = 'SELECT';
            }
            else {
                vm.packTechnologistSelected = data.GetSelectedPackTechnologist;
            }
            vm.Packcomments = data.GetPackagingComments;
            vm.hdnPackcomments = data.GetPackagingComments;
            vm.PackagingDisabled = data.PackagingNameDisabled;
            vm.ApprovedDisabled = data.PackagingApprovedDisabled;
            vm.packTechnologistDisabled = data.PackTechnologistDisabled;
            vm.PackCommentsReadOnly = data.PackagingCommentsReadOnly;
            vm.PackagingSaveDisabled = data.PackagingSaveDisabled;
            //F&P Sourcing
            vm.FPSourcing = data.GetFAndPSourcingName;
            vm.FPApproved = data.GetFAndPSourcingApproved;
           // vm.FPApprovedSelected = data.GetSelectedFAndPSourcingApproved;
            if (data.GetSelectedFAndPSourcingApproved == "0" || data.GetSelectedFAndPSourcingApproved == null) {
                vm.FPApprovedSelected = 'SELECT';
            }
            else {
                vm.FPApprovedSelected = data.GetSelectedFAndPSourcingApproved;
            }
            vm.FPcomments = data.GetFAndPSourcingComments;
            vm.hdnFPcomments = data.GetFAndPSourcingComments;
            vm.FPComPlant = data.GetCombiAssemblyPlant;
           // vm.FPComPlantSelected = data.GetSelectedCombiAssemblyPlant;
            if (data.GetSelectedCombiAssemblyPlant == "0" || data.GetSelectedCombiAssemblyPlant == null) {
                vm.FPComPlantSelected = 'SELECT';
            }
            else {
                vm.FPComPlantSelected = data.GetSelectedCombiAssemblyPlant;
            }
            vm.FPSourcingDisabled = data.FAndPSourcingNameDisabled;
            vm.FPApprovedDisabled = data.FAndPSourcingApprovedDisabled;
            vm.FPCommentsReadOnly = data.FAndPSourcingCommentsReadOnly;
            vm.FAndPSourcingSaveDisabled = data.FAndPSourcingSaveDisabled;
            vm.FPComPlantDisabled = data.FPComPlantDisabled;
            //Global Transfer Pricing
            vm.GTPName = data.GetGTPName;
            vm.GTPNameDisabled = data.GTPNameDisabled;
            vm.GTPApproved = data.GetGTPApproved;
           // vm.GTPApprovedSelected = data.GetSelectedGTPApproved;
            if (data.GetSelectedGTPApproved == "0" || data.GetSelectedGTPApproved == null) {
                vm.GTPApprovedSelected = 'SELECT';
            }
            else {
                vm.GTPApprovedSelected = data.GetSelectedGTPApproved;
            }
            vm.GTPApprovedDiabled = data.GTPApprovedDiabled;
            vm.PricipalLegalEntity = data.GetPricipalLegalEntity;
            //vm.PricipalLegalEntitySelected = data.GetSelectedPrincipalLegalEntity;
            if (data.GetSelectedPrincipalLegalEntity == "0" || data.GetSelectedPrincipalLegalEntity == null) {
                vm.PricipalLegalEntitySelected = 'SELECT';
            }
            else {
                vm.PricipalLegalEntitySelected = data.GetSelectedPrincipalLegalEntity;
            }
            vm.PricipalLegalEntityDisabled = data.PricipalLegalEntityDisabled;
            vm.GTPcomments = data.GetGTPcomments;
            vm.hdnGTPcomments = data.GetGTPcomments;
            vm.GTPcommentsReadOnly = data.GTPcommentsReadOnly;
            vm.GTPSaveDisabled = data.GTPSaveDisabled;
            //Pack Purchasing
            vm.packPurchasing = data.GetPackPurchasingName;
            vm.PPApproved = data.GetPackPurchasingApproved;
           // vm.PPApprovedSelected = data.GetSelectedPackPurchasingApproved.toString();
            if (data.GetSelectedPackPurchasingApproved.toString() == "0" || data.GetSelectedPackPurchasingApproved == null) {
                vm.PPApprovedSelected = 'SELECT';
            }
            else {
                vm.PPApprovedSelected = data.GetSelectedPackPurchasingApproved.toString();
            }
            vm.PPcomments = data.GetPackPurchasingComments;
            vm.hdnPPcomments = data.GetPackPurchasingComments;
            vm.packPurchasingDisabled = data.PackPurchasingNameDisabled;
            vm.PPApprovedDisabled = data.PackPurchasingApprovedDisabled;
            vm.PPCommentsReadOnly = data.PackPurchasingCommentsReadOnly;
            vm.PackPurchasingSaveDisabled = data.PackPurchasingSaveDisabled;
            //Data management
            vm.DataManegementName = data.GetDataManegementName;
            vm.DataManegementNameReadOnly = data.DataManegementNameReadOnly;
            vm.DataManagementApproved = data.GetDataManagementApproved;
           // vm.DataManagementApprovedSelected = data.GetSelectedDataManagementApproved;
            if (data.GetSelectedDataManagementApproved == "0" || data.GetSelectedDataManagementApproved == null) {
                vm.DataManagementApprovedSelected = 'SELECT';
            }
            else {
                vm.DataManagementApprovedSelected = data.GetSelectedDataManagementApproved;
            }
            vm.DataManagementApprovedDiabled = data.DataManagementApprovedDiabled;
         
            var dateN = new Date(data.GetDataManagementEstOfDateCompletion);

            if (dateN) {
                $scope.time2 = dateN.Format("yyyy-MM-dd");

                if ($scope.time2 == '1-01-01') {
                    $('#sandbox-container-SCTEAM input').datepicker({ autoclose: true, gotoCurrent: true, });
                    $('#sandbox-container-SCTEAM input').datepicker("setDate", 'now');
                } else {
                    $('#sandbox-container-SCTEAM input').datepicker({ autoclose: true, format: "yyyy-mm-dd", });
                    $('#sandbox-container-SCTEAM input').datepicker("setDate", $scope.time2);
                }
            }
            
            vm.DataManagementEstOfDateCompletionDisabled = data.DataManagementEstOfDateCompletionDisabled;
            vm.DataManagementComments = data.GetDataManagementComments;
            vm.hdnDataManagementComments = data.GetDataManagementComments;
            vm.DataManagementCommentsReadOnly = data.DataManagementCommentsReadOnly;
            vm.DataManagementSaveDisabled = data.DataManagementSaveDisabled;
            //Administrator
            vm.getRQTY = data.GetRQTY;
            vm.Administrator = data.GetAdministrator;
           // vm.Outcome = data.GetOutCome;
            if (data.GetOutCome == "0" || data.GetOutCome == null) {
                vm.Outcome = 'SELECT';
            }
            else {
                vm.Outcome = data.GetOutCome;
            }
            vm.OutcomeSelected = data.GetSelectedOutcome.toString();
            vm.resolutionComments = data.GetResolutionComments;
            vm.hdnresolutionComments = data.GetResolutionComments;
            vm.requestid = data.requestId;
            vm.username = data.username;
            vm.AdministratorDisabled = data.AdministratorDisabled;
            vm.OutcomeDisabled = data.OutComeDisabled;
            vm.resolutionCommentsReadOnly = data.ResolutionCommentsReadOnly;
            vm.SaveDisabled = data.SaveDisabled;
            vm.message1Show = data.message1Show;
            vm.hdnData = data.GetGSCMData;
            vm.DMstepShow = data.DMstepShow;
            vm.GSCMShow = data.GSCMShow;
            vm.FPComPlantShow = data.FPComPlantShow;
            vm.GTPShow = data.GTPShow;
            vm.DataManageShow = data.DataManageShow;
            vm.PackTechnologistShow = data.PackTechnologistShow;
            console.log(vm.GTPShow);
            console.log(vm.PPApprovedSelected);
            console.log(vm.DataManagementEstOfDateCompletion);
            return;
            }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in GetSCRSCTeam of SCRSCTeam-JS' });
        })

    /*********************************************************************************************************/
    //Save and Submit events for SCP request as well for workflow redirection
    /*********************************************************************************************************/
    $scope.SaveAndGo = function (data) {
        vm.NextTabName = data.NextTabName;
        vm.queryString = data.QueryString;
        if (data.NextTabName == 'Search') {
            $state.go("SearchExistingRequest");
        } else if (data.NextTabName == 'errorpage') {
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: vm.queryString });
        } else {
            $rootScope.$broadcast('NextTabName', vm.NextTabName);
            $rootScope.$broadcast('queryString', vm.queryString);
        }
    }

    vm.CommentChange = function () {
        

        if(vm.hdnGSCMcomments!=vm.GSCMcomments){
            var myDate = new Date();
            
            vm.GSCMcomments= vm.GSCMcomments+'\n Stated by: ' + vm.username + '\n On: ' +  myDate.toLocaleString()  + '  automatically.' ;
           
           }
        if(vm.hdnPackcomments!=vm.Packcomments){
            var myDate = new Date();
            vm.Packcomments = vm.Packcomments + '\n Stated by: ' + vm.username + '\n On: ' + myDate.toLocaleString() + '  automatically.';
           
        }
        if(vm.hdnFPcomments!=vm.FPcomments){
            var myDate = new Date();
            vm.FPcomments=vm.FPcomments+'\n Stated by: ' + vm.username + '\n On: ' +  myDate.toLocaleString()  + '  automatically.' ;
           
        }
        if(vm.hdnGTPcomments!=vm.GTPcomments){
            var myDate = new Date();
            vm.GTPcomments= vm.GTPcomments+'\n Stated by: ' + vm.username + '\n On: ' +  myDate.toLocaleString()  + '  automatically.' ;
           
        }
        if(vm.hdnPPcomments!=vm.PPcomments){
            var myDate = new Date();
            vm.PPcomments=vm.PPcomments+'\n Stated by: ' + vm.username + '\n On: ' +  myDate.toLocaleString()  + '  automatically.' ;
           
        }
     





    }


    vm.saveSCTeam = function () {
        vm.CommentChange();
        var SCTeam = {
            GetRQTY: vm.getRQTY,
            //GSCM
            GetGSCMData: vm.hdnData,
            GetSelectedGSCMApproved: vm.GSCMApprovedSelected == 'SELECT' ? null : vm.GSCMApprovedSelected,
            GetGSCMComments: vm.GSCMComments,
            //Packaging
            GetPackagingName: vm.Packaging,
            GetPackagingComments: vm.Packcomments,
            GetSelectedPackagingApproved: vm.PackApprovedSelected == 'SELECT' ? null : vm.PackApprovedSelected,
            GetSelectedPackTechnologist: vm.packTechnologistSelected == 'SELECT' ? null : vm.packTechnologistSelected,
            //FAndPSourcing
            GetFAndPSourcingName: vm.FPSourcing,
            GetSelectedFAndPSourcingApproved: vm.FPApprovedSelected == 'SELECT' ? null : vm.FPApprovedSelected,
            GetFAndPSourcingComments: vm.FPcomments,
            GetSelectedCombiAssemblyPlant: vm.FPComPlantSelected == 'SELECT' ? null : vm.FPComPlantSelected,
            //GTP
            GetGTPName: vm.GTPName,
            GetSelectedGTPApproved: vm.GTPApprovedSelected == 'SELECT' ? null : vm.GTPApprovedSelected,
            GetSelectedPrincipalLegalEntity: vm.PricipalLegalEntitySelected == 'SELECT' ? null : vm.PricipalLegalEntitySelected,
            GetGTPComments: vm.GTPComments,
            //PackPurchasing
            GetPackPurchasingName: vm.packPurchasing,
            GetPackPurchasingComments: vm.PPcomments,
            GetSelectedPackPurchasingApproved: vm.PPApprovedSelected == 'SELECT' ? null : vm.PPApprovedSelected,
            //Administrator
            GetAdministrator: vm.Administrator,
            GetSelectedOutcome: vm.OutcomeSelected == 'SELECT' ? null : vm.OutcomeSelected,
            GetResolutionComments: vm.resolutionComments,
            requestId: vm.requestid,
            //DataManagement
            GetDataManegementName: vm.DataManegementName,
            GetSelectedDataManagementApproved: vm.DataManagementApprovedSelected == 'SELECT' ? null : vm.DataManagementApprovedSelected,
            GetDataManagementEstOfDateCompletion: vm.DataManagementEstOfDateCompletion,
            GetDataManagementComments: vm.DataManagementComments
        };

        $http.post('SCTeam_SupplyChain/SaveSCRSCTeam', SCTeam).success(function (data) {
            if (data.ResultCode == 1) {
                var nextRequestType = 'Supply Chain';
                var nextTabCode = 'SC';
                if (requestType == 4) {
                    nextRequestType = 'Supply Chain';
                    nextTabCode = 'SCT_SC';
                } else if (requestType == 5) {
                    nextRequestType = 'Combi Pack';
                    nextTabCode = 'SCT_CMBI';
                }
                if (nextRequestType != '' && nextTabCode != '') {
                    $http.get('NewPackRequest/GetNextPage?requestId=' + requestId + '&requestType=' + nextRequestType + '&tabCode=' + nextTabCode)
                        .success(function (data) {
                            console.log(data);
                            //$state.go("SupplyChainRequest." + data.NextTabName, { QueryString: data.QueryString });
                            $scope.SaveAndGo(data);
                        });
                }
            }
            else {
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saveSCTeam of SCRSCTeam-JS' });
            }
            vm.showOperationMsgPart(data.ResultMsg);
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in saveSCTeam of SCRSCTeam-JS' });
        });
    };

    vm.changeForComment = function (selectedApprovel, comments) {
        //debugger;

        if (vm[comments]) {
            vm[comments] = vm[comments];
        }
        else {
            vm[comments] = '';
        }
        if (vm[selectedApprovel] == '16') {
          
            vm[comments] = 'TBA' + '\n'+ vm[comments];
        } else if (vm[selectedApprovel] == '17') {
    
            vm[comments] = 'Concerns' + '\n' + vm[comments];
        } else if (vm[selectedApprovel] == '18') {
          
            vm[comments] = 'No Issues' + '\n' + vm[comments];
           
        } else if (vm[selectedApprovel] == '51') {
          
            vm[comments] = 'Under Review' + '\n' + vm[comments];
           
        } else if (vm[selectedApprovel] == '52') {
          
            vm[comments] = 'No' + '\n' + vm[comments];
           
    } else {
            vm[comments] = vm[comments];
        }

    }

  

});






