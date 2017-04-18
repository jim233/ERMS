angular.module('ERMS').controller("SCRRequest", function ($scope, $state, $rootScope, $http, $stateParams, $modal, $log) {
    var vm = this;
  
    var requestType;
    var requestID;
    var requestTypeName;
    var nextRequestType = '';
    var nextTabCode = '';
    var showloading = '';
    var testMain = '';
    vm.showLoadingPage = false;
    $scope.showFirstPart = false;
    $scope.showPFRPart = false;
    $scope.showEPTpart = false;
    $scope.showOtherPart = false;
    $scope.showSupplyChainPart = false;
    $scope.showCombiPackPartOne = false;
    $scope.showCombiPackPartTwo = false;
    $scope.showCombiE1 = false;
    $scope.showCombiE2 = false;
    $scope.showCombiE3 = false;
    vm.Region = '';
    vm.SubmitProcMgr = false;
    vm.ProcMgShow = false;
    //nancy write on 9/12/2016

    
    
    
    
    
    //For reports related parameters from session storage
    //$scope.rIfgetboth = '';
    //$scope.rRequestid = '';
    //$scope.rRequestType = '';
  
    //if (sessionStorage.getItem['ifGetBoth'])
    //{
    //    $scope.rIfgetboth = sessionStorage.getItem['ifGetBoth'];
    //}
    //if (sessionStorage.getItem['rqType'])
    //{
    //    $scope.rRequestType = sessionStorage.getItem['rqType'];
    //}
    //if (sessionStorage.getItem['req'])
    //{
    //    $scope.rRequestid = sessionStorage.getItem['req'];
    //}
    //Disabling controls on page load or based on data fetched on page load
    vm.initData = function () {
        //Controls related to Other range request
        vm.othgetCommentsRead = true;
        vm.othgetLeadAIEnable = true;
        vm.othgetProductLineSellerEnable = true;
        vm.othgetDescriptionEnable = true;
        vm.othgetCountryPresCodeEnable = true;
        vm.othgetUoMEnable = true;
        vm.othgetCountryEnable = true;
        vm.othLookUpPrescodeEnable = true;
        vm.SaveEnabledOtr = true;
        vm.SubmitEnabledOtr = true;
        //Controls related to PFR request
        vm.PFRLeadAIEnable = true;
        vm.PFRDesignCodeEnable = true;
        vm.PFRAgiCodeEnable = true;
        vm.PFRQuantityPackSizeEnable = true;
        vm.PFRgetConfigurationorCollationEnable = true;
        vm.UOMSelectedEnable = true;
        vm.PLSselectedEnable = true;
        vm.PFRgetTradeNameEnable = true;
        vm.COSselectedEnable = true;
        vm.PFRgetCountryPresCodeRead = true;
        vm.PFRgetSupplierEnable = true;
        vm.btnLookUpPresCodeEnable = true;
        vm.SubmitEnablePFR = true;
        vm.RegContactEnable = true;
        vm.GALDisable = true;
        vm.PFRCinOEnable = true;
        vm.PFRgetRegulatoryContactEnable = true;
        vm.PFRMTOselectedEnable = true;
        //Controls related to Supply Chain Request
        vm.SCGGetBackgroundInformationRead = true;
        vm.SCGetCurrentDesignCodeVariantnumberEnable = true;
        vm.SCGetCurrentPackEnable = true;
        vm.SCGetCurrentSourceEnable = true;
        vm.SCGetCurrentUCAgiCodeEnable = true;
        vm.SCGetDateChangeEnable = true;
        vm.SCGetDetailsChangeLeadAIEnable = true;
        vm.SCGetNewDesignCodeVariantnumberEnable = true;
        vm.SCGetNewPackEnable = true;
        vm.SCGetNewSourceEnable = true;
        vm.SCGetNewUCAgiCodeEnable = true;
        vm.SCGetNotOrgDataEnable = true;
        vm.SubmitEnabledSC = true;
        vm.SaveEnabledSC = true;
        vm.galDisable = true;
        vm.SCGetSelectedMakeToOrderEnable = true;
        //controls related to New pack and Country Add
        vm.NPCAPresonSynBrandPack = false;
        vm.leadAIIDEnable = true;
        vm.GetDesignCodeEnable = true;
        vm.GetUCagicodeEnable = true;
        vm.GetQuantityPackSizeEnable = true;
        vm.GetConfigurationCollationEnable = true;
        vm.UOMselectedEnable = true;
        vm.GetAncillariesSpecialReqEnable = true;
        vm.PLSselectedEnable = true;
        vm.GetTradeNameEnable = true;
        vm.countrySaleSelectedEnable = true;
        vm.GetCountryPresCodeRead = true;
        vm.GetDateofFirstSaleEnable = true;
        vm.GetCountryPresCodeLink = true;
        vm.SubmitEnabled = true;
        vm.SaveEnabled = true;
        vm.PCselectedEnable = true;
        vm.ddlAncillariesEnable = true;
        vm.SourceLocallyYes = true;
        vm.SourceLocallyNo = true;
        vm.OrgGAL = true;
        vm.RegGAL = true;
        vm.GetNSUCodeEnable = true;
        vm.GetSupplierRead = true;
        vm.GetMarketingJustificationRead = true;
        vm.originatorIdEnable = true;
        vm.GetRegulatoryContactEnable = true;
        vm.showTextarea = true;
        vm.MTOselectedEnable = true;
        vm.SPACselectedEnable = true;
        vm.SUAgiCodeShow = false;
        vm.PartFilledShow = false;
        vm.ProcMgShow = false;
        vm.MktJustMandatory = true;
        //New pack and Country add based on is child and request type
        vm.showSupplier = true;
        vm.sourceDiv = true;
        vm.ShowAncillariesTextarea = true;
        vm.NSUShow = true;
        vm.StandardAncillariesshow = true;
        vm.ProductCategoryShow = true;
        vm.dateofFirstSaleshow = true;
        vm.yeartableShow = true;
        vm.MrktJustificationShow = true;
        vm.RegContactShow = true;
        vm.NotOrgShow = true;
        vm.CountryOfSaleShow = true;
        vm.CntryPresCodeShow = true;
        vm.NoteShow = true;
        vm.SubmitEnabledNPR = true;
        vm.SaveEnabledNPR = true;
        //Controls related to EPT and EPT Copy
        vm.MTOShow = true;
        vm.disableCopy = true;
        vm.EPTgetLeadAIEnable = true;
        vm.EPTgetDesignCodeEnable = true;
        vm.EPTgetCategoryEnable = true;
        vm.EPTgetFDesEnable = true;
        vm.EPTgetUCAgiCodeEnable = true;
        vm.EPTgetQtyEnable = true;
        vm.EPTgetConfigurationEnable = true;
        vm.EPTgetUOMEnable = true;
        vm.SMSTermEnable = true;
        vm.EPTgetAncillariesEnable = true;
        vm.ddlAncillariesYesNocommentsEnable = true;
        vm.showTextarea = true;
        vm.CommentsSectionShow = true;
        vm.TypeHereAI = true;
        vm.EPTgetNotOriginatorEnable = true;
        vm.EPTgetPLSEnable = true;
        vm.EPTgetTradeNameEnable = true;
        vm.EPTgetCountryOfSaleEnable = true;
        vm.EPTgetCountryPresCodeRead = true;
        vm.EPTgetDateOfFirstSaleEnable = true;
        vm.EPTgetRegContactEnable = true;
        vm.OrgGALEPT = true;
        vm.RegGALEPT = true;
        vm.LookupPrescodeEPT = true;
        vm.EPTgetProductCategoryEnable = true;
        vm.EPTGetMakeToOrderEnable = true;
        vm.SubmitEnableEPT = true;
        vm.SaveEnableEPT = true;
        //Controls related to Combipack request
        vm.CPSourceLocallyDetailsEnable = true;
        vm.CPOriginatorEnable = true;
        vm.CPLeadAIEnable = true;
        vm.CPCombiCollationEnable = true;
        vm.CPUOMSelectEnable = true;
        vm.CPCountrySelectEnable = true;
        vm.CPCombiPresCodeEnable = true;
        vm.CPCombiFirstSaleDateEnable = true;
        vm.LookupPresCodeCP = true;
        vm.CPPLSelectEnable = true;
        vm.CPCombiTradeNameEnable = true;
        vm.MktJustificationCP = true;
        vm.CPRegGAL = true;
        vm.CPSourceLocallyYes = true;
        vm.CPSourceLocallyNo = true;
        vm.CPGALNOEnable = true;
        vm.CPRegManagerEnable = true;
        vm.CPElement1SUEnable = true;
        vm.CPElement1LeadAIEnable = true;
        vm.CPElement1DesignEnable = true;
        vm.CPElement1UCCodeEnable = true;
        vm.CPElement1SizeEnable = true;
        vm.CPElement1PartFillQtyEnable = true;
        vm.CPElement1TradenameEnable = true;
        vm.CPElement1ProductlineEnable = true;
        vm.CPElement2SUEnable = true;
        vm.CPElement2LeadAIEnable = true;
        vm.CPElement2DesignEnable = true;
        vm.CPElement2UCCodeEnable = true;
        vm.CPElement2SizeEnable = true;
        vm.CPElement2PartFillQtyEnable = true;
        vm.CPElement2TradenameEnable = true;
        vm.CPElement2ProductlineEnable = true;
        vm.CPMTOSelectEnable = true;
        vm.SaveEnableCP = true;
        vm.SubmitEnableCP = true;
        vm.CPAGI_Code_ReactivateShow = true;

        vm.hdnDomainOrg = '';
        vm.hdnUserIdOrg = '';
        vm.hdnNameOrg = '';
        vm.hdnFirstNameOrg = '';
        vm.hdnEmailOrg = '';
        vm.hdnLastNameOrg = '';
        vm.hdnUrlOrg = '';

        vm.hdnDomainReg = '';
        vm.hdnUserIdReg = '';
        vm.hdnNameReg = '';
        vm.hdnFirstNameReg = '';
        vm.hdnEmailReg = '';
        vm.hdnLastNameReg = '';
        vm.hdnUrlReg = '';
    }
    vm.initData();

    $scope.disableWhenLeadAI = false;
    $scope.showWhenLeadAI = true;
    vm.showTextarea = true;
    vm.subMenu = false;
    vm.ifEPTCopyChecked = false;

    $scope.clearLocalStorage = function () {
        localStorage.removeItem("name");
        localStorage.removeItem("type");
    }

    //nancy write
    vm.SubmitTo = function () {
       
    }
/***************************************************************************************************/
//Below if else loop is to handle varioous navigations from search,core range and from request pages 
    /***************************************************************************************************/
    //debugger;
    if ($stateParams.ifGetBoth == '10001') {
       //only if we get redirect from combi pack to contry add
        requestID = $stateParams.req;
        requestTypeName = $stateParams.rqType;
        $rootScope.$broadcast('SCRNameto-requestID', requestID);
    } else if ($stateParams.ifGetBoth == 'FromReport' || $stateParams.ifGetBoth == 'fromNew') {
        requestTypeName = $stateParams.rqType;
        requestID = $stateParams.req;        
        $rootScope.$broadcast('SCRNameto-requestID', requestID);
    } else if (localStorage.getItem('CPRForm')) {//Not used converted to IfgetBoth
        requestTypeName = localStorage.getItem('CPRFormType');
        requestID = localStorage.getItem('CPRForm');
        $rootScope.$broadcast('SCRNameto-requestID', requestID);
    } else if ($stateParams.ifGetBoth && $stateParams.ifGetBoth == 'true') { //from supply chain home
        $scope.nprLeadAI = $stateParams.leadAI;
        $scope.leadAItext = $stateParams.leadAIText;
        requestTypeName = $stateParams.rqType;
        requestID = $stateParams.req;
        if (localStorage.getItem('name')) {
            requestID = localStorage.getItem('name');
        }
    }
    else if ($stateParams.ifGetBoth == 'fromSearch') {
        requestTypeName = $stateParams.rqType;
        requestID = $stateParams.req;
        localStorage.setItem('name', requestID);
        localStorage.setItem('type', requestTypeName);
        $rootScope.$broadcast('SCRNameto-requestID', requestID);
    } else if ($stateParams.ifGetBoth == 'FromEPTCopyTBL') {
        requestTypeName = $stateParams.rqType;
        requestID = $stateParams.req;
        $rootScope.$broadcast('SCRNameto-requestID', requestID);
    }
    else if ($stateParams.leadAI || $stateParams.isNew || $stateParams.rqType) {
        $scope.nprLeadAI = $stateParams.leadAI;
        $scope.nprIsNew = $stateParams.isNew;
        requestType = $stateParams.rqType;
        $scope.leadAItext = $stateParams.leadAIText;
        $scope.formulationtext = $stateParams.Formulation;
        $scope.ancillaries = $stateParams.ancillaries;
        $scope.category = $stateParams.category;
        $scope.pls = $stateParams.pls;
        $scope.bottleSize = $stateParams.bottleSize;
        $scope.NSU = $stateParams.NSU;
        $scope.sPack = $stateParams.sPack;
        $scope.req = $stateParams.req;
        requestID = '';
        if (localStorage.getItem('name')) {
            requestID = localStorage.getItem('name');
        }
    }
    else {//Not used converted to IfgetBoth
        requestID = localStorage.getItem('name');
        var requestTypeName = localStorage.getItem('type');
    }

/***************************************************************************************************/
//Get the requestID and requestType to show different type of request page 
/***************************************************************************************************/
    if (requestType != null && requestType == 2) {
        requestTypeName = 'New Pack';
    }
    if (requestType != null && requestType == 3) {
        requestTypeName = 'Country Add';
    }
    if (requestTypeName == 'EPT') {
        $scope.showEPTpart = true;
        requestType = 1;
    } else if (requestTypeName == 'New Pack') {
        requestType = 2;
        $scope.showFirstPart = true;
    } else if (requestTypeName == 'Country Add') {
        requestType = 3;
        $scope.showFirstPart = true;
    } else if (requestTypeName == 'PFR') {
        $scope.showPFRPart = true;
        requestType = 6;
    } else if (requestTypeName == 'Other') {
        $scope.showOtherPart = true;
        requestType = 7;
    } else if (requestTypeName == 'EPT-Copy') {
        $scope.showEPTpart = true;
        requestType = 8;
    } else if (requestTypeName == 'Supply Chain') {
        $scope.showSupplyChainPart = true;
        requestType = 4;
    } else if (requestTypeName == 'Combi Pack') {
        $scope.showCombiPackPartOne = true;
        requestType = 5;
        localStorage.removeItem('CPRForm');
    }

    vm.showStateName = 'Request';
    $rootScope.$broadcast('SCRNameto-parent', vm.showStateName);
    $rootScope.$broadcast('SCRNameto-requestTypeName', requestTypeName);

    $scope.npCaContrller = function (nprRqType, nprLeadAI) {
        if (nprRqType == '2') {
            if (nprLeadAI) {
                $scope.showWhenLeadAI = false;
                if (nprLeadAI == '1') {
                    $scope.showWhenLeadAI = true;
                    $scope.disableWhenLeadAI = false;
                }
                else if ($scope.leadAItext.trim().toUpperCase() == 'THIRD PARTY') {
                    $scope.showWhenLeadAI = true;
                    $scope.disableWhenLeadAI = false;
                }
                else if (nprLeadAI) {
                    $scope.showWhenLeadAI = true;
                    $scope.disableWhenLeadAI = false;
                }
            } else {
                $scope.showWhenLeadAI = true;
            }
        }
    };

    ////which input should be hidden
    if (requestType === 2) { //new pack
        vm.showNewPack = true;
        vm.showCountryAdd = false;
    } else if (requestType === 3) { //country add
        vm.showNewPack = false;
        vm.showCountryAdd = true;
    }

 


/***************************************************************************************************/
//Show and hide HTML Loading on pages
/***************************************************************************************************/
    $scope.$watch('getValidData', function () {
        //debugger;
        if ($scope.getValidData) {
            vm.showLoadingPage = false;
            console.log('Check' + $scope.getValidData);
        } else {
            vm.showLoadingPage = true;
            $scope.getValidData = false;
            console.log('Check from true' + $scope.getValidData);
        }
    });

    $scope.newListForSCBigList = [];
/***************************************************************************************************/
//Date Picker - for date format
/***************************************************************************************************/
    Date.prototype.Format = function (fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

/***************************************************************************************************/
//Loading data for all types of request pages
/***************************************************************************************************/

//function of load the page's data when open ----- type New pack and Country add (2,3)
    vm.getRequiredPage = function (Data, Copy, FromSave) {
        var NewRequestID = Data;
        if (!Copy) {
            Copy = '0';
        }
        if (!FromSave) {
            FromSave = '0';
        }
        if (requestType == 3) {
            vm.SpacLabel = 'SPAC packaging required ?*';
        } else {
            vm.SpacLabel = 'Is SPAC packaging required ?*';
        }
        $http({
            url: "NewPackRequest/GetNewPackDetails",
            method: 'POST',
            data: { "RequestID": NewRequestID, "ReqType": requestType, "Copy": Copy, "FromSave": FromSave, "IsNew": $scope.nprIsNew, "LeadAI": $scope.nprLeadAI },
            contentType: "application/json;",
            dataType: "json"
        }).success(function (data) {
            var region = data.Region;
            vm.Region = data.Region;
            if ($scope.nprIsNew && $scope.nprIsNew == '1') {
                $scope.npCaContrller(requestType, $scope.nprLeadAI);
            }
            if (data.Region == 'LATAM') {
                vm.SubmitProcMgr = true;
            }
            else { vm.SubmitProcMgr = false; }
            $scope.getPageInfo = [];
            $scope.getValidData = true;
            $scope.getPageUOM = data.GetUoM;
            $scope.getSPAC = data.GetIsSynBrdPackReq;
            $scope.getPoductLine = data.GetProductLineSeller;
            $scope.getAdditionSlec = data.GetCommentsDdl;
            $scope.getCountryData = data.GetCountrySale;
            $scope.getMaketoOrder = data.GetMakeToOrder;
            $scope.getProductCati = data.GetProductCategory;
            //Hiding,enabling controls based on request type and is child
            //Disbaling controls based on IsChild or GetOthers data
            vm.ProcMgShow = data.ProcurementManager;
            vm.NPCAPresonSynBrandPack = data.NPCAPresonSynBrandPack;
            vm.leadAIIDEnable = data.leadAIIDEnable;
            vm.GetDesignCodeEnable = data.GetDesignCodeEnable;
            vm.GetUCagicodeEnable = data.GetUCagicodeEnable;
            //If its a new request , and third party case as well the LeadAI,Designcode and UC Agi code should be disabled
            if ($scope.nprIsNew) {
                if ($scope.nprIsNew == '1' && $scope.nprLeadAI != '1') {
                    vm.leadAIIDEnable = true;
                    vm.GetDesignCodeEnable = true;
                    vm.GetUCagicodeEnable = true;
                }
                if ($scope.nprLeadAI == '153') {
                    vm.GetDesignCodeEnable = false;
                    vm.GetUCagicodeEnable = false;
                }
            }
            vm.GetQuantityPackSizeEnable = data.GetQuantityPackSizeEnable;
            vm.GetConfigurationCollationEnable = data.GetConfigurationCollationEnable;
            vm.UOMselectedEnable = data.UOMselectedEnable;
            vm.GetAncillariesSpecialReqEnable = data.GetAncillariesSpecialReqEnable;
            vm.PLSselectedEnable = data.PLSselectedEnable;
            vm.GetTradeNameEnable = data.GetTradeNameEnable;
            vm.countrySaleSelectedEnable = data.countrySaleSelectedEnable;
            vm.GetCountryPresCodeRead = data.GetCountryPresCodeRead;
            vm.GetDateofFirstSaleEnable = data.GetDateofFirstSaleEnable;
            vm.GetCountryPresCodeLink = data.GetCountryPresCodeLink;
            vm.SubmitEnabled = data.SubmitEnabled;
            vm.SaveEnabled = data.SaveEnabled;
            vm.PCselectedEnable = data.PCselectedEnable;
            vm.ddlAncillariesEnable = data.ddlAncillariesEnable;
            vm.SourceLocallyYes = data.SourceLocallyYes;
            vm.SourceLocallyNo = data.SourceLocallyNo;
            vm.OrgGAL = data.OrgGAL;
            vm.RegGAL = data.RegGAL;
            vm.GetNSUCodeEnable = data.GetNSUCodeEnable;
            vm.GetSupplierRead = data.GetSupplierRead;
            vm.GetMarketingJustificationRead = data.GetMarketingJustificationRead;
            vm.originatorIdEnable = data.originatorIdEnable;
            vm.GetRegulatoryContactEnable = data.GetRegulatoryContactEnable;
            vm.showTextarea = data.showTextarea;
            vm.MTOselectedEnable = data.MTOselectedEnable;
            vm.SPACselectedEnable = data.SPACselectedEnable;
            //New pack and Country add based on is child and request type
            vm.showSupplier = data.showSupplier;
            vm.sourceDiv = data.sourceDiv;
            vm.ShowAncillariesTextarea = data.ShowAncillariesTextarea;
            vm.NSUShow = data.NSUShow;
            vm.StandardAncillariesshow = data.StandardAncillariesshow;
            vm.ProductCategoryShow = data.ProductCategoryShow;
            vm.dateofFirstSaleshow = data.dateofFirstSaleshow;
            vm.yeartableShow = data.yeartableShow;
            vm.MrktJustificationShow = data.MrktJustificationShow;
            vm.RegContactShow = data.RegContactShow;
            vm.NotOrgShow = data.NotOrgShow;
            vm.CountryOfSaleShow = data.CountryOfSaleShow;
            vm.CntryPresCodeShow = data.CntryPresCodeShow;
            vm.NoteShow = data.NoteShow;
            vm.SubmitEnabledNPR = data.SubmitEnabledNPR;
            vm.SaveEnabledNPR = data.SaveEnabledNPR;
            vm.PartFilledShow = data.PartFilledShow;
            vm.SUAgiCodeShow = data.SUAgiCodeShow;
            vm.UOMselected = 'SELECT';
            vm.PLSselected = 'SELECT';
            vm.SPACselected = 'SELECT';
            vm.countrySaleSelected = 'SELECT';
            vm.MTOselected = 'SELECT';
            vm.PCselected = 'SELECT';
            vm.optionChecked = 'SELECT';
            if (data.yeartableShow == "false") {
                vm.SubmitProcMgr = false;
                vm.ProcMgShow = false;
            }
            else {
                vm.SubmitProcMgr = true;
                vm.ProcMgShow = true;
            }
            vm.optionChecked = 'SELECT'
            if (requestType == 3) {
                vm.MktJustMandatory = false;
            }
            else {
                vm.MktJustMandatory = true;
            }
            if (data.NewPackRequest == null) {
                if (requestType == 3) {
                    vm.PLSselectedEnable = false;
                }
            }
            if (data.NewPackRequest != null) {
                var getPageInfo = data.NewPackRequest;
                vm.leadAIID = getPageInfo.GetNewAI;
                vm.GetDesignCode = getPageInfo.GetDesignCode;
                vm.GetUCagicode = getPageInfo.GetUCagicode;
                vm.reactivationRequest = getPageInfo.GetReactivation_Request;
                vm.GetNSUCode = getPageInfo.GetNSUCode;
                vm.GetTradeName = getPageInfo.GetTradeName;
                vm.GetAncillariesSpecialReq = getPageInfo.GetAncillariesSpecialReq;
                vm.GetConfigurationCollation = getPageInfo.GetConfigurationCollation;
                vm.GetQuantityPackSize = getPageInfo.GetQuantityPackSize;
                vm.GetMarketingJustification = getPageInfo.GetMarketingJustification;
                vm.GetSupplier = getPageInfo.GetSupplier;
                vm.GetRegulatoryContact = getPageInfo.GetRegulatoryContact;
                vm.originatorIdName = getPageInfo.GetNotOriginator;
                //If child of combi
                vm.getPartyFilled = getPageInfo.GetPartFilledQuantity;
                vm.getSUAgiCode = getPageInfo.GetSUAgiCode;
                vm.GetIsChild = getPageInfo.GetIsChild;
                //Get IDs for ORG and REG to use during save and submit
                vm.originatorId = getPageInfo.GetNotOriginatorId;
                vm.GetRegulatoryContactID = getPageInfo.GetRegContactId;
                
                if (getPageInfo.GetSelectedProductLineSeller != null && getPageInfo.GetSelectedProductLineSeller != undefined && getPageInfo.GetSelectedProductLineSeller != '') {
                    vm.PLSselected = getPageInfo.GetSelectedProductLineSeller;
                } else {
                    vm.PLSselected = 'SELECT';
                }
                //vm.PLSselected = getPageInfo.GetSelectedProductLineSeller;
                if (getPageInfo.GetSelectedUoM != null && getPageInfo.GetSelectedUoM != undefined && getPageInfo.GetSelectedUoM != '') {
                    vm.UOMselected = getPageInfo.GetSelectedUoM;
                } else {
                    vm.UOMselected = 'SELECT';
                }
                //vm.UOMselected = getPageInfo.GetSelectedUoM;
                if (getPageInfo.GetSelectedIsSynBrdPackReq != null && getPageInfo.GetSelectedIsSynBrdPackReq != undefined && getPageInfo.GetSelectedIsSynBrdPackReq != '') {
                    vm.SPACselected = getPageInfo.GetSelectedIsSynBrdPackReq.toString();
                } else {
                    vm.SPACselected = 'SELECT';
                }
                //vm.SPACselected = getPageInfo.GetSelectedIsSynBrdPackReq;
                if (getPageInfo.GetSelectedCountry != null && getPageInfo.GetSelectedCountry != undefined && getPageInfo.GetSelectedCountry != '') {
                    vm.countrySaleSelected = getPageInfo.GetSelectedCountry;
                } else {
                    vm.countrySaleSelected = 'SELECT';
                }
                //vm.countrySaleSelected = getPageInfo.GetSelectedCountry;
                if (getPageInfo.GetSelectedMakeToOrder != null && getPageInfo.GetSelectedMakeToOrder != undefined && getPageInfo.GetSelectedMakeToOrder != '') {
                    vm.MTOselected = JSON.stringify(getPageInfo.GetSelectedMakeToOrder);
                } else {
                    vm.MTOselected = 'SELECT';
                }
                //vm.MTOselected = JSON.stringify(getPageInfo.GetSelectedMakeToOrder);
                if (getPageInfo.GetSelectedProductCategory != null && getPageInfo.GetSelectedProductCategory != undefined && getPageInfo.GetSelectedProductCategory != '') {
                    vm.PCselected = getPageInfo.GetSelectedProductCategory;
                } else {
                    vm.PCselected = 'SELECT';
                }
                //vm.PCselected = getPageInfo.GetSelectedProductCategory;
                if (getPageInfo.GetSelectedCommentsDdl != null && getPageInfo.GetSelectedCommentsDdl != undefined && getPageInfo.GetSelectedCommentsDdl != '') {
                    vm.optionChecked = getPageInfo.GetSelectedCommentsDdl;
                } else {
                    vm.optionChecked = 'SELECT';
                }
                //vm.optionChecked = getPageInfo.GetSelectedCommentsDdl;
                vm.GetCountryPresCode = getPageInfo.GetCountryPresCode;
                vm.SourceLocally = JSON.stringify(getPageInfo.GetSourceLocally);
                vm.GetLeadAIID = getPageInfo.GetLeadAIID;
                vm.GetSourceLocallyDetails = getPageInfo.GetSourceLocallyDetails;
                vm.GetDateofFirstSale = getPageInfo.GetDateofFirstSale;
                var dateM = JSON.stringify(vm.GetDateofFirstSale);
                var dateN = new Date(vm.GetDateofFirstSale);
                console.log("!!!!!!!!!!!!!!!!!!!!! = " + vm.GetDateofFirstSale);
                if (dateN) {
                    vm.time2 = dateN.Format("yyyy-MM-dd");
                    console.log("abcdefg = " + vm.time2.toString);
                    if (vm.time2 == '1-01-01') {
                        $('#sandbox-container input').datepicker({ autoclose: true, gotoCurrent: true, });
                        $('#sandbox-container input').datepicker("setDate", 'now');
                    } else {
                        $('#sandbox-container input').datepicker({ autoclose: true, format: "yyyy-mm-dd", });
                        $('#sandbox-container input').datepicker("setDate", vm.time2);
                    }
                }

                var a = dateM.split('T');
                var b = a[0].split('-');
                var c = b[0].split('"');
                //var d = vm.dateN.getFullYear();
                if (c && c[1] != '0001') {
                    vm.getTableYear = c[1];
                    vm.getTableYearOne = parseInt(vm.getTableYear) + 1;
                    vm.getTableYearTwo = vm.getTableYearOne + 1;
                } else {
                    vm.getTableYear = 'Year1';
                    vm.getTableYearOne = 'Year2';
                    vm.getTableYearTwo = 'Year3';
                }

            } else {
                $('#sandbox-container input').datepicker({ autoclose: true, format: "yyyy-mm-dd", });
                $('#sandbox-container input').datepicker("setDate", 'Now');
                if ($scope.leadAItext) {
                    console.log("!!! +" + $scope.leadAItext);
                    vm.leadAIID = $scope.leadAItext;
                }
                //Change here if object is null then values are not getting assigned
                if ($scope.formulationtext) {
                    vm.GetDesignCode = $scope.formulationtext.split('-')[1];
                    vm.GetUCagicode = $scope.formulationtext.split('-')[0];
                }
                if ($scope.bottleSize) {
                    var Config = '';
                    var QtyUom = '';
                    var BottleSize = $scope.bottleSize;
                    for (var i = 0; i <= $scope.bottleSize.split('x').length - 2; i++) {
                        if (Config == "")
                            Config = Config + $scope.bottleSize.split('x')[i];
                        else
                            Config = Config + "x" + $scope.bottleSize.split('x')[i];
                    }
                    vm.GetConfigurationCollation = Config;
                    QtyUom = $scope.bottleSize.split('x')[$scope.bottleSize.split('x').length - 1];
                    vm.GetQuantityPackSize = QtyUom.split(' ')[0];
                    var GetSelectedUoMText = QtyUom.split(' ')[1];
                    for (var i = 0; i < $scope.getPageUOM.length; i++) {
                        if (GetSelectedUoMText == $scope.getPageUOM[i].Text) {
                            vm.UOMselected = $scope.getPageUOM[i].Value;
                        }
                    }
                 }
                if ($scope.NSU) {
                    vm.GetNSUCode = $scope.NSU;
                }
                if ($scope.sPack) {
                    var isSPACselected = $scope.sPack;
                    if (isSPACselected.toLowerCase().trim() == 'yes') {
                        vm.SPACselected = '25';
                        vm.SPACselectedEnable = true;
                    }
                    else {
                        vm.SPACselected = '26';
                        vm.SPACselectedEnable = true;
                    }
                }

                if ($scope.ancillaries) {
                    vm.GetAncillariesSpecialReq = $scope.ancillaries;
                }
                if ($scope.category) {
                    var categorycheck = $scope.category;
                    if (categorycheck.toUpperCase().trim() == 'CASH' || categorycheck.toUpperCase().trim() == 'PHASE OUT') {
                        request.optionChecked = 'false';
                    }
                }
                vm.getTableYear = 'Year1';
                vm.getTableYearOne = 'Year2';
                vm.getTableYearTwo = 'Year3';
                vm.reactivationRequest = '0';
                vm.SourceLocally = false;
            }
            vm.getTableDetail = data.getYear;
            if (vm.getTableDetail) {
                vm.getTableDetail[0].showTitle = "Sales Price per lt/kg in US$*";
                vm.getTableDetail[1].showTitle = "Volume (000's lts/kgs)*";
                vm.getTableDetail[2].showTitle = "Total Sales Value US$";
                if (region == 'LATAM' || vm.Region == 'LATAM') {
                    vm.getTableDetail[3].showTitle = "Cost";
                    vm.getTableDetail[4].showTitle = "Gross Profit%";
                }
            } else {

                if (region == 'LATAM' || vm.Region == 'LATAM') {
                vm.getTableDetail = [
                    { showTitle: 'Sales Price per lt/kg in US$*', Year1: '', Year2: '', Year3: '' },
                    { showTitle: "Volume (000's lts/kgs)*", Year1: '', Year2: '', Year3: '' },
                    { showTitle: 'Total Sales Value US$', Year1: '', Year2: '', Year3: '' },
                        { showTitle: 'Cost', Year1: '', Year2: '', Year3: '' },
                        { showTitle: 'Gross Profit%', Year1: '', Year2: '', Year3: '' },
                ]
            }
                else {
                    vm.getTableDetail = [
                        { showTitle: 'Sales Price per lt/kg in US$*', Year1: '', Year2: '', Year3: '' },
                        { showTitle: "Volume (000's lts/kgs)*", Year1: '', Year2: '', Year3: '' },
                        { showTitle: 'Total Sales Value US$', Year1: '', Year2: '', Year3: '' },
                    ]
                }
            }
        }).error(function (data) {
            console.log("error" + data);
        });
    };

//function of load the page's data when open ----- typePFR
    vm.getRequiredPageForPFR = function (Data, FromSave) {
        var NewRequestID = Data;

        if (!FromSave) {
            FromSave = '0';
        }

        $http({
            url: "PFR/GetPFRData?requestId=" + NewRequestID + "&FromSave=" + FromSave,
            method: 'POST',
            //data: { "RequestID": NewRequestID, "ReqType": requestType, "Copy": Copy, "FromSave": FromSave },
            //contentType: "application/json;",
            //dataType: "json"
        }).success(function (data) {
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess })
            }
            else {
                $scope.getValidData = true;
                vm.UOMSelected = 'SELECT';
                vm.PFRMTOselected = 'SELECT';
                vm.PLSselected = 'SELECT';
                vm.COSselected = 'SELECT';
                if (data.PFRReqDetails != null) {
                    var MTOSelected = data.PFRReqDetails.getMaketoOrder;
                    vm.PFRCinO = data.PFRReqDetails.getNotOriginatorId;
                    vm.PFROriginator = data.PFRReqDetails.getNotOriginator;
                    vm.PFRLeadAI = data.PFRReqDetails.getLeadAI;
                    vm.PFRDesignCode = data.PFRReqDetails.getDesignCode;
                    vm.PFRAgiCode = data.PFRReqDetails.getUCagiCode;
                    vm.PFRQuantityPackSize = data.PFRReqDetails.getQuantityorPrimaryPackSize;
                    vm.PFRgetTradeName = data.PFRReqDetails.getTradeName;
                    vm.PFRgetCountryPresCode = data.PFRReqDetails.getCountryPresCode;
                    vm.PFRgetSupplier = data.PFRReqDetails.getSupplier;
                    vm.PFRgetRegulatoryContact = data.PFRReqDetails.getRegulatoryContact;
                    vm.PFRRegContactId = data.PFRReqDetails.getRegContactId;
                    vm.PFRgetNSUCode = data.PFRReqDetails.getNSUCode;
                    vm.PFRgetConfigurationorCollation = data.PFRReqDetails.getConfigurationorCollation;
                    if (data.PFRReqDetails.getUoM != null && data.PFRReqDetails.getUoM != undefined && data.PFRReqDetails.getUoM != '') {
                        vm.UOMSelected = data.PFRReqDetails.getUoM;
                    } else {
                        vm.UOMSelected = 'SELECT';
                    }
                    if (data.PFRReqDetails.getMaketoOrder != null && data.PFRReqDetails.getMaketoOrder != undefined && data.PFRReqDetails.getMaketoOrder != '') {
                        vm.PFRMTOselected = MTOSelected.toString();
                    } else {
                        vm.PFRMTOselected = 'SELECT';
                    }
                    if (data.PFRReqDetails.getProductLineSeller != null && data.PFRReqDetails.getProductLineSeller != undefined && data.PFRReqDetails.getProductLineSeller != '') {
                        vm.PLSselected = data.PFRReqDetails.getProductLineSeller;
                    } else {
                        vm.PLSselected = 'SELECT';
                    }
                    if (data.PFRReqDetails.getCountryofSale != null && data.PFRReqDetails.getCountryofSale != undefined && data.PFRReqDetails.getCountryofSale != '') {
                        vm.COSselected = data.PFRReqDetails.getCountryofSale;
                    } else {
                        vm.COSselected = 'SELECT';
                    }
                    //vm.UOMSelected = data.PFRReqDetails.getUoM;
                    //vm.PFRMTOselected = MTOSelected.toString();
                    //vm.PLSselected = data.PFRReqDetails.getProductLineSeller;
                    //vm.COSselected = data.PFRReqDetails.getCountryofSale;
                }
                //Regarding controls disable from controller
                vm.PFRLeadAIEnable = data.PFRLeadAIEnable;
                vm.PFRDesignCodeEnable = data.PFRDesignCodeEnable;
                vm.PFRAgiCodeEnable = data.PFRAgiCodeEnable;
                vm.PFRQuantityPackSizeEnable = data.PFRQuantityPackSizeEnable;
                vm.PFRgetConfigurationorCollationEnable = data.PFRgetConfigurationorCollationEnable;
                vm.UOMSelectedEnable = data.UOMSelectedEnable;
                vm.PLSselectedEnable = data.PLSselectedEnable;
                vm.PFRgetTradeNameEnable = data.PFRgetTradeNameEnable;
                vm.COSselectedEnable = data.COSselectedEnable;
                vm.PFRgetCountryPresCodeRead = data.PFRgetCountryPresCodeRead;
                vm.PFRgetSupplierEnable = data.PFRgetSupplierEnable;
                vm.btnLookUpPresCodeEnable = data.btnLookUpPresCodeEnable;
                vm.SubmitEnablePFR = data.SubmitEnablePFR;
                vm.RegContactEnable = data.RegContactEnable;
                vm.GALDisable = data.GALDisable;
                vm.PFRCinOEnable = data.PFRCinOEnable;
                vm.PFRgetRegulatoryContactEnable = data.PFRgetRegulatoryContactEnable;
                vm.PFRMTOselectedEnable = data.PFRMTOselectedEnable;
                $scope.GetUoM = data.GetUoM;
                $scope.GetMakeToOrder = data.GetMakeToOrder;
                $scope.GetProductLineSeller = data.GetProductLineSeller;
                $scope.GetCountryofSale = data.GetCountryofSale;
            }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error Occured in GetPFRData method of SCRRequest-JS' })
        });
    }

//function of load the page's data when open ----- type EPT and EPT Copy
    vm.getRequiredPageForEPT = function (Data, copy, FromSave) {
        if (copy == -1) {
            NewData = requestID;
            newCopy = 1;
        } else {
            NewData = Data;
            newCopy = copy;
        }
        $http({
            url: "EPTRangeRequest/EPTRangeDetails",
            method: 'POST',
            data: { "RequestID": NewData, "Copy": newCopy, 'FromSave': FromSave },
            contentType: "application/json;",
            dataType: "json"
        }).success(function (data) {
            if (data.eErrorNumber == 420) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in SCRRequest.JS' });
            }
             else {
            $scope.getValidData = true;
            var EPTRange = data.EPTRangeReq;
            vm.EPTgetNotOriginator = EPTRange.getNotOriginator;
            vm.SMSTerm = EPTRange.getUmbrellaTeam;
            if (EPTRange.getLeadAI != null && EPTRange.getLeadAI != undefined && EPTRange.getLeadAI != '') {
                vm.EPTgetLeadAI = EPTRange.getLeadAI.toString();
            } else {
                vm.EPTgetLeadAI = 'SELECT';
            }
            //vm.EPTgetLeadAI = EPTRange.getLeadAI.toString();
            vm.EPTgetAltLeadAI = EPTRange.getAltLeadAI;
            vm.EPTgetCategory = EPTRange.getCategory;
            vm.EPTgetDesignCode = EPTRange.getDesignCode;
            vm.EPTgetUCAgiCode = EPTRange.getUCAgiCode;
            vm.EPTgetFDes = EPTRange.getFDes;
            vm.EPTgetQty = EPTRange.getQty;
            if (EPTRange.getUOM != null && EPTRange.getUOM != undefined && EPTRange.getUOM != '') {
                vm.EPTgetUOM = EPTRange.getUOM.toString();
            } else {
                vm.EPTgetUOM = 'SELECT';
            }
            //vm.EPTgetUOM = EPTRange.getUOM.toString();
            vm.EPTgetConfiguration = EPTRange.getConfiguration;
            if (EPTRange.getMaketoOrder != null && EPTRange.getMaketoOrder != undefined && EPTRange.getMaketoOrder != '') {
                vm.EPTGetMakeToOrder = EPTRange.getMaketoOrder.toString();
            } else {
                vm.EPTGetMakeToOrder = 'SELECT';
            }
            //vm.EPTGetMakeToOrder = EPTRange.getMaketoOrder.toString();
            vm.EPTgetAncillaries = EPTRange.getAncillaries;
            if (EPTRange.getCommentsDdl != null && EPTRange.getCommentsDdl != undefined && EPTRange.getCommentsDdl != 0) {
                vm.optionChecked = EPTRange.getCommentsDdl;
            } else {
                vm.optionChecked = 'SELECT';
            }
            //vm.optionChecked = EPTRange.getComments;
            vm.EPTgetCommentsDdl = EPTRange.getComments;
            if (EPTRange.getPLS != null && EPTRange.getPLS != undefined && EPTRange.getPLS != '') {
                vm.EPTgetPLS = EPTRange.getPLS.toString();
            } else {
                vm.EPTgetPLS = 'SELECT';
            }
            //vm.EPTgetPLS = EPTRange.getPLS.toString();
            vm.EPTgetTradeName = EPTRange.getTradeName;
            if (EPTRange.getCountryOfSale != null && EPTRange.getCountryOfSale != undefined && EPTRange.getCountryOfSale != '') {
                vm.EPTgetCountryOfSale = EPTRange.getCountryOfSale.toString();
            } else {
                vm.EPTgetCountryOfSale = 'SELECT';
            }
            //vm.EPTgetCountryOfSale = EPTRange.getCountryOfSale.toString();
            vm.EPTgetCountryPresCode = EPTRange.getCountryPresCode;
            if (EPTRange.getProductCategory != null && EPTRange.getProductCategory != undefined && EPTRange.getProductCategory != '') {
                vm.EPTgetProductCategory = EPTRange.getProductCategory.toString();
            } else {
                vm.EPTgetProductCategory = 'SELECT';
            }
            //vm.EPTgetProductCategory = EPTRange.getProductCategory.toString();
            var EPTgetDateOfFirstSale = new Date(EPTRange.getDateOfFirstSale);
            if (EPTgetDateOfFirstSale) {
                vm.time2EPT = EPTgetDateOfFirstSale.Format("yyyy-MM-dd");

                if (vm.time2EPT == '1-01-01') {
                    $('#sandbox-container-EPT input').datepicker({ autoclose: true, gotoCurrent: true, });
                    $('#sandbox-container-EPT input').datepicker("setDate", 'now');
                } else {
                    $('#sandbox-container-EPT input').datepicker({ autoclose: true, format: "yyyy-mm-dd", });
                    $('#sandbox-container-EPT input').datepicker("setDate", vm.time2EPT);
                }
            }

            vm.EPTgetRegContact = EPTRange.getRegContact;
            vm.EPTgetComment = EPTRange.getComment;
            //to get ID's
            vm.Orgid = EPTRange.OrgData;
            vm.regID = EPTRange.RegData;
            $scope.getUOM = data.GetUOM;
            $scope.GetMakeToOrder = data.GetMakeToOrder;
            $scope.getComments = data.GetYesNo;
            $scope.getPLS = data.GetPLS;
            $scope.getCountryOfSale = data.GetCountryOfSale;
            $scope.getProductCategory = data.GetProductCategory;
            $scope.getLeadAI = data.GetLeadAI;
            $scope.getMakeToOrder = data.GetMakeToOrder;
            //binding related to controls enable/disable/hide
            vm.MTOShow = data.MTOShow;
            vm.disableCopy = data.disableCopy;
            vm.EPTgetLeadAIEnable = data.EPTgetLeadAIEnable;
            vm.EPTgetDesignCodeEnable = data.EPTgetDesignCodeEnable;
            vm.EPTgetCategoryEnable = data.EPTgetCategoryEnable;
            vm.EPTgetFDesEnable = data.EPTgetFDesEnable;
            vm.EPTgetUCAgiCodeEnable = data.EPTgetUCAgiCodeEnable;
            vm.EPTgetQtyEnable = data.EPTgetQtyEnable;
            vm.EPTgetConfigurationEnable = data.EPTgetConfigurationEnable;
            vm.EPTgetUOMEnable = data.EPTgetUOMEnable;
            vm.SMSTermEnable = data.SMSTermEnable;
            vm.EPTgetAncillariesEnable = data.EPTgetAncillariesEnable;
            vm.ddlAncillariesYesNocommentsEnable = data.ddlAncillariesYesNocommentsEnable;
            vm.showTextarea = data.showTextarea;
            vm.CommentsSectionShow = data.CommentsSectionShow;
            vm.TypeHereAI = data.TypeHereAI;
            vm.EPTgetNotOriginatorEnable = data.EPTgetNotOriginatorEnable;
            vm.EPTgetPLSEnable = data.EPTgetPLSEnable;
            vm.EPTgetTradeNameEnable = data.EPTgetTradeNameEnable;
            vm.EPTgetCountryOfSaleEnable = data.EPTgetCountryOfSaleEnable;
            vm.EPTgetCountryPresCodeRead = data.EPTgetCountryPresCodeRead;
            vm.EPTgetDateOfFirstSaleEnable = data.EPTgetDateOfFirstSaleEnable;
            vm.EPTgetRegContactEnable = data.EPTgetRegContactEnable;
            vm.OrgGALEPT = data.OrgGALEPT;
            vm.RegGALEPT = data.RegGALEPT;
            vm.LookupPrescodeEPT = data.LookupPrescodeEPT;
            vm.EPTgetProductCategoryEnable = data.EPTgetProductCategoryEnable;
            vm.EPTGetMakeToOrderEnable = data.EPTGetMakeToOrderEnable;
            vm.SubmitEnableEPT = data.SubmitEnableEPT;
            vm.SaveEnableEPT = data.SaveEnableEPT;
            if (vm.optionChecked != 25)
            { vm.showTextarea = true; }
                if (requestTypeName == 'EPT-Copy') {
                vm.ShowCopyTable = false;
            }
                else {
                vm.ShowCopyTable = true;
            }
            //binding of copy table
            //debugger;
            if (data.GetCopyRequestNos) {
                if (data.GetCopyRequestNos.length != 0) {
                    $scope.getcopydetails = [];
                    $scope.getcopydetails = data.GetCopyRequestNos;
                }
                else {
                    vm.ShowCopyTable = false;
                }
            }
            else {
                vm.ShowCopyTable = false;
            }
          }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in SCRRequest.JS' });
        });
    }

//function of load the page's data when open ----- type Other
    vm.getRequiredPageForOther = function (fromsave) {
        $http({
            url: "OtherRangeRequest/OtherRRDetails?requestId=" + requestID + "&FromSave=" + fromsave,
            method: 'POST',
            //data: { "RequestID": NewRequestID, "ReqType": requestType, "Copy": Copy, "FromSave": FromSave },
            //contentType: "application/json;",
            //dataType: "json"
        }).success(function (data) {
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else if (data) {
            $scope.getValidData = true;
            //Data related to enabling/disabling controls
            vm.othgetCommentsRead = data.othgetCommentsRead;
            vm.othgetLeadAIEnable = data.othgetLeadAIEnable;
            vm.othgetProductLineSellerEnable = data.othgetProductLineSellerEnable;
            vm.othgetDescriptionEnable = data.othgetDescriptionEnable;
            vm.othgetCountryPresCodeEnable = data.othgetCountryPresCodeEnable;
            vm.othgetUoMEnable = data.othgetUoMEnable;
            vm.othgetCountryEnable = data.othgetCountryEnable;
            vm.othLookUpPrescodeEnable = data.othLookUpPrescodeEnable;
            vm.SaveEnabledOtr = data.SaveEnabledOtr;
            vm.SubmitEnabledOtr = data.SubmitEnabledOtr;
            $scope.GetCountryOfSaleList = data.GetCountryOfSale;
            vm.othgetCountry = 'SELECT';
            if (data.GetOtherRequestDetails != null) {
                var OtherRange = data.GetOtherRequestDetails;
                vm.othgetNotOriginatorId = data.GetOtherRequestDetails.getNotOriginatorId;
                vm.othgetLeadAI = data.GetOtherRequestDetails.getLeadAI;
                vm.othgetProductLineSeller = data.GetOtherRequestDetails.getProductLineSeller;
                vm.othgetDescription = data.GetOtherRequestDetails.getDescription;
                vm.othgetUoM = data.GetOtherRequestDetails.getUoM;
                vm.othgetComments = data.GetOtherRequestDetails.getComments;
                if (data.GetOtherRequestDetails.getCountry != null && data.GetOtherRequestDetails.getCountry != undefined && data.GetOtherRequestDetails.getCountry != '') {
                    vm.othgetCountry = data.GetOtherRequestDetails.getCountry;
                } else {
                    vm.othgetCountry = 'SELECT';
                }
                //ssvm.othgetCountry = data.GetOtherRequestDetails.getCountry;
                vm.othgetCountryPresCode = data.GetOtherRequestDetails.getCountryPresCode;
                vm.othgetNotOriginator = data.GetOtherRequestDetails.getNotOriginator;
            }
            }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in OtherRRDetails method of SCRRequest.JS' });
        });
    };

//function of load the page's data when open ----- type Supply Chain
    vm.getRequiredPageForSupplyChain = function (data) {
        if (data) {
            requestID = data;
        }
        $http({
            url: "SupplyChainRequest/SCRgetDetails?requestId=" + requestID,
            method: 'POST',
        }).success(function (data) {
            
            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else {
                $scope.getValidData = true;
                //binding value related to enabling controls
                vm.SCGGetBackgroundInformationRead = data.SCGGetBackgroundInformationRead;
                vm.SCGetCurrentDesignCodeVariantnumberEnable = data.SCGetCurrentDesignCodeVariantnumberEnable;
                vm.SCGetCurrentPackEnable = data.SCGetCurrentPackEnable;
                vm.SCGetCurrentSourceEnable = data.SCGetCurrentSourceEnable;
                vm.SCGetCurrentUCAgiCodeEnable = data.SCGetCurrentUCAgiCodeEnable;
                vm.SCGetDateChangeEnable = data.SCGetDateChangeEnable;
                vm.SCGetDetailsChangeLeadAIEnable = data.SCGetDetailsChangeLeadAIEnable;
                vm.SCGetNewDesignCodeVariantnumberEnable = data.SCGetNewDesignCodeVariantnumberEnable;
                vm.SCGetNewPackEnable = data.SCGetNewPackEnable;
                vm.SCGetNewSourceEnable = data.SCGetNewSourceEnable;
                vm.SCGetNewUCAgiCodeEnable = data.SCGetNewUCAgiCodeEnable;
                vm.SCGetNotOrgDataEnable = data.SCGetNotOrgDataEnable;
                vm.SubmitEnabledSC = data.SubmitEnabledSC;
                vm.SaveEnabledSC = data.SaveEnabledSC;
                vm.galDisable = data.galDisable;
                vm.SCGetSelectedMakeToOrderEnable = data.SCGetSelectedMakeToOrderEnable;
                vm.SCGetSelectedMakeToOrder = 'SELECT';
                if (data.GetSupplyChainDetails != null) {
                    //IF LEADAi has data then keep textbox disabled
                    vm.SCGetDetailsChangeLeadAIEnable = true;
                    var getSupplyChainDetail = data.GetSupplyChainDetails;
                    vm.SCGetNotOrgData = getSupplyChainDetail.GetNotOrginator;
                    vm.SCGetNotOrgDataData = getSupplyChainDetail.GetNotOrgData;
                    vm.SCGetDetailsChangeLeadAI = getSupplyChainDetail.GetDetailsChangeLeadAI;
                    var getDateChangeTime = new Date(getSupplyChainDetail.GetDateChange);

                    if (getDateChangeTime) {
                        vm.time2SCP = getDateChangeTime.Format("yyyy-MM-dd");

                        if (vm.time2SCP == '1-01-01') {
                            $('#sandbox-container-SPC input').datepicker({ autoclose: true, gotoCurrent: true, });
                            $('#sandbox-container-SPC input').datepicker("setDate", 'now');
                        } else {
                            $('#sandbox-container-SPC input').datepicker({ autoclose: true, format: "yyyy-mm-dd", });
                            $('#sandbox-container-SPC input').datepicker("setDate", vm.time2SCP);
                        }
                    }

                    //a = getDateChangeTime.getMonth() + 1;
                    //vm.SCGetDateChange = getDateChangeTime.getFullYear() + '-' + a + '-' + getDateChangeTime.getDate();
                    vm.SCGetCurrentDesignCodeVariantnumber = getSupplyChainDetail.GetCurrentDesignCodeVariantnumber;
                    vm.SCGetNewDesignCodeVariantnumber = getSupplyChainDetail.GetNewDesignCodeVariantnumber;
                    vm.SCGetCurrentUCAgiCode = getSupplyChainDetail.GetCurrentUCAgiCode;
                    vm.SCGetNewUCAgiCode = getSupplyChainDetail.GetNewUCAgiCode;
                    vm.SCGetCurrentPack = getSupplyChainDetail.GetCurrentPack;
                    vm.SCGetNewPack = getSupplyChainDetail.GetNewPack;
                    if (getSupplyChainDetail.GetSelectedMakeToOrder != null && getSupplyChainDetail.GetSelectedMakeToOrder != undefined && getSupplyChainDetail.GetSelectedMakeToOrder != '') {
                        vm.SCGetSelectedMakeToOrder = getSupplyChainDetail.GetSelectedMakeToOrder.toString();
                    } else {
                        vm.SCGetSelectedMakeToOrder = 'SELECT';
                    }
                    //vm.SCGetSelectedMakeToOrder = getSupplyChainDetail.GetSelectedMakeToOrder.toString();
                    vm.SCGetCurrentSource = getSupplyChainDetail.GetCurrentSource;
                    vm.SCGGetBackgroundInformation = getSupplyChainDetail.GetBackgroundInformation;
                    vm.SCGetNewSource = getSupplyChainDetail.GetNewSource;
                }
                if ($stateParams.ifGetBoth == 'true') {
                    vm.SCGetDetailsChangeLeadAI = $scope.leadAItext;
                }
                $scope.SCGGetMakeToOrder = data.GetMakeToOrder;
                $scope.getGetSUAgiCodeAffected = data.UCAGICode;
                $scope.LineONEBig = [];
                if ($scope.getGetSUAgiCodeAffected) {

                } else {
                    $scope.getGetSUAgiCodeAffected = [
                        { m_Item1: '', m_Item2: '', m_Item3: '', m_Item4: '', m_Item5: '' },
                        { m_Item1: '', m_Item2: '', m_Item3: '', m_Item4: '', m_Item5: '' },
                        { m_Item1: '', m_Item2: '', m_Item3: '', m_Item4: '', m_Item5: '' },
                        { m_Item1: '', m_Item2: '', m_Item3: '', m_Item4: '', m_Item5: '' },
                    ];
                }
            }
        }).error(function (data) {
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in SCRgetDetails method of SCRRequest.JS' });
        });
    }

//function of load the page's data when open ----- type combi pack
    vm.getRequiredPageForCombiPack = function () {
        $http({
            url: "CombiPackFormD/GetNewPackDetails?requestId=" + requestID,
            method: 'POST',
        }).success(function (data) {

            if (data.ErrorBE) {
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
            }
            else if (data) {
                vm.Region = data.Region;
                if (data.Region == 'LATAM') {
                    vm.SubmitProcMgr = true;
                    vm.ProcMgShow = true;
                }
                else {
                    vm.SubmitProcMgr = false;
                    vm.ProcMgShow = false;
                }
            $scope.getValidData = true;
            $scope.CPUOM = data.UOM;
            $scope.CPProductLine = data.ProductLine;
            $scope.CPCountries = data.Countries;
            $scope.CPYearList = [];
            $scope.CPYearList = data.Year;
            console.log("!!!" + JSON.stringify($scope.CPYearList));
       
            if ($scope.CPYearList) {
                $scope.CPYearList[0].yearName = 'Sales Price per lt/kg in US$';
                $scope.CPYearList[1].yearName = "Volume (000's lts/kgs)";
                $scope.CPYearList[2].yearName = 'Total Sales Value US$';
                    if (vm.Region == 'LATAM') {
                    $scope.CPYearList[3].yearName = "Cost";
                $scope.CPYearList[4].yearName = 'Gross Profit%';
            }
            } else {
                if (vm.Region == 'LATAM') {
                $scope.CPYearList = [
                        { yearName: 'Sales Price per lt/kg in US$', year1: '', year2: '', year3: '' },
                        { yearName: "Volume (000's lts/kgs)", year1: '', year2: '', year3: '' },
                        { yearName: 'Total Sales Value US$', year1: '', year2: '', year3: '' },
                        { yearName: "Cost", year1: '', year2: '', year3: '' },
                        { yearName: 'Gross Profit%', year1: '', year2: '', year3: '' },
                ];
            }
                else {
                    $scope.CPYearList = [
                    { yearName: 'Sales Price per lt/kg in US$', year1: '', year2: '', year3: '' },
                       { yearName: "Volume (000's lts/kgs)", year1: '', year2: '', year3: '' },
                       { yearName: 'Total Sales Value US$', year1: '', year2: '', year3: '' },
                    ];
                }
            }
            var CPCombiPackRequest = data.CombiPackRequest;
            console.log("CP data" + JSON.stringify(CPCombiPackRequest))
            vm.CPOriginator = CPCombiPackRequest.Originator;
            vm.CPLeadAI = CPCombiPackRequest.CombiLeadAI;
            vm.CPCombiCollation = CPCombiPackRequest.CombiCollation;
            if (CPCombiPackRequest.UoMAsPC != null && CPCombiPackRequest.UoMAsPC != undefined && CPCombiPackRequest.UoMAsPC != '') {
                vm.CPUOMSelect = CPCombiPackRequest.UoMAsPC;
            } else {
                vm.CPUOMSelect = 'SELECT';
            }
            //vm.CPUOMSelect = CPCombiPackRequest.UoMAsPC;
            if (CPCombiPackRequest.MaketoOrder != null && CPCombiPackRequest.MaketoOrder != undefined && CPCombiPackRequest.MaketoOrder != '') {
                vm.CPMTOSelect = CPCombiPackRequest.MaketoOrder.toString();
            } else {
                vm.CPMTOSelect = 'SELECT';
            }
            //vm.CPMTOSelect = CPCombiPackRequest.MaketoOrder;
            if (CPCombiPackRequest.CombiCountry != null && CPCombiPackRequest.CombiCountry != undefined && CPCombiPackRequest.CombiCountry != '') {
                vm.CPCountrySelect = CPCombiPackRequest.CombiCountry;
            } else {
                vm.CPCountrySelect = 'SELECT';
            }
            //debugger;
            //vm.CPCountrySelect = CPCombiPackRequest.CombiCountry;
            vm.CPCombiPresCode = CPCombiPackRequest.CombiPresCode;
            var CPCombiFirstSaleDate = new Date(CPCombiPackRequest.CombiFirstSaleDate);
            console.log("abcabc " + CPCombiFirstSaleDate);
            if (CPCombiFirstSaleDate) {
                vm.time2CoP = CPCombiFirstSaleDate.Format("yyyy-MM-dd");
                console.log("abcabc " + vm.time2CoP);
                if (vm.time2CoP == '1-01-01') {
                    $('#sandbox-container-CP input').datepicker({ autoclose: true, gotoCurrent: true, });
                    $('#sandbox-container-CP input').datepicker("setDate", 'now');
                } else {
                    $('#sandbox-container-CP input').datepicker({ autoclose: true, format: "yyyy-mm-dd", });
                    $('#sandbox-container-CP input').datepicker("setDate", vm.time2CoP);
                }
            }

            vm.CPCombiTradeName = CPCombiPackRequest.CombiTradeName;
            if (CPCombiPackRequest.CombiProductline != null && CPCombiPackRequest.CombiProductline != undefined && CPCombiPackRequest.CombiProductline != '') {
                vm.CPPLSelect = CPCombiPackRequest.CombiProductline;
            } else {
                vm.CPPLSelect = 'SELECT';
            }
            //vm.CPPLSelect = CPCombiPackRequest.CombiProductline;
            vm.CPSourceLocally = CPCombiPackRequest.SourceLocally;
            vm.CPSourceLocallyDetails = CPCombiPackRequest.SourceLocallyDetails;
            vm.CPNoOfChildElements = CPCombiPackRequest.NoOfChildElements;
            vm.CPAGI_Code_Reactivate = CPCombiPackRequest.AGI_Code_Reactivate;
            vm.CPReactivation_Request = CPCombiPackRequest.Reactivation_Request;
            vm.MktJustification = CPCombiPackRequest.MarketingJustification;
            vm.RegContact = CPCombiPackRequest.RegulatoryContact;
            vm.SynBrand = CPCombiPackRequest.IsSynBrdPack;
            if (vm.CPNoOfChildElements) {
                if (vm.CPNoOfChildElements == '2') {
                    $scope.showCombiE1 = true;
                }
                else if (vm.CPNoOfChildElements == '3') {
                    $scope.showCombiE1 = true;
                    $scope.showCombiE2 = true;
                }
                else if (vm.CPNoOfChildElements == '4') {
                    $scope.showCombiE1 = true;
                    $scope.showCombiE2 = true;
                    $scope.showCombiE3 = true;
                }
            }
            //combi E1
            vm.CPElement1RangeReqNo = CPCombiPackRequest.Element1RangeReqNo;
            vm.CPElement1Status = CPCombiPackRequest.Element1Status;
            vm.CPElement1RequestType = CPCombiPackRequest.Element1RequestType;
            vm.CPElement1SU = CPCombiPackRequest.Element1SU;
            vm.CPElement1LeadAI = CPCombiPackRequest.Element1LeadAI;
            vm.CPElement1Design = CPCombiPackRequest.Element1Design;
            vm.CPElement1UCCode = CPCombiPackRequest.Element1UCCode;
            vm.CPElement1Size = CPCombiPackRequest.Element1Size;
            vm.CPElement1PartFillQty = CPCombiPackRequest.Element1PartFillQty;
            vm.CPElement1Tradename = CPCombiPackRequest.Element1Tradename;
            vm.CPElement1Productline = CPCombiPackRequest.Element1Productline;
            vm.SynBrand1 = CPCombiPackRequest.IsSynBrdPack1;
            //combi E2
            vm.CPElement2RangeReqNo = CPCombiPackRequest.Element2RangeReqNo;
            vm.CPElement2Status = CPCombiPackRequest.Element2Status;
            vm.CPElement2RequestType = CPCombiPackRequest.Element2RequestType;
            vm.CPElement2SU = CPCombiPackRequest.Element2SU;
            vm.CPElement2LeadAI = CPCombiPackRequest.Element2LeadAI;
            vm.CPElement2Design = CPCombiPackRequest.Element2Design;
            vm.CPElement2Size = CPCombiPackRequest.Element2Size;
            vm.CPElement2PartFillQty = CPCombiPackRequest.Element2PartFillQty;
            vm.CPElement2Tradename = CPCombiPackRequest.Element2Tradename;
            vm.CPElement2Productline = CPCombiPackRequest.Element2Productline;
            vm.SynBrand2 = CPCombiPackRequest.IsSynBrdPack2;
            //combi E3
            vm.CPElement3RangeReqNo = CPCombiPackRequest.Element3RangeReqNo;
            vm.CPElement3Status = CPCombiPackRequest.Element3Status;
            vm.CPElement3RequestType = CPCombiPackRequest.Element3RequestType;
            vm.CPElement3SU = CPCombiPackRequest.Element3SU;
            vm.CPElement3LeadAI = CPCombiPackRequest.Element3LeadAI;
            vm.CPElement3Design = CPCombiPackRequest.Element3Design;
            vm.CPElement3Size = CPCombiPackRequest.Element3Size;
            vm.CPElement3PartFillQty = CPCombiPackRequest.Element3PartFillQty;
            vm.CPElement3Tradename = CPCombiPackRequest.Element3Tradename;
            vm.CPElement3Productline = CPCombiPackRequest.Element3Productline;
            vm.SynBrand3 = CPCombiPackRequest.IsSynBrdPack3;
            //combi E4
            vm.CPElement4RangeReqNo = CPCombiPackRequest.Element4RangeReqNo;
            vm.CPElement4Status = CPCombiPackRequest.Element4Status;
            vm.CPElement4RequestType = CPCombiPackRequest.Element4RequestType;
            vm.CPElement4SU = CPCombiPackRequest.Element4SU;
            vm.CPElement4LeadAI = CPCombiPackRequest.Element4LeadAI;
            vm.CPElement4Design = CPCombiPackRequest.Element4Design;
            vm.CPElement4Size = CPCombiPackRequest.Element4Size;
            vm.CPElement4PartFillQty = CPCombiPackRequest.Element4PartFillQty;
            vm.CPElement4Tradename = CPCombiPackRequest.Element4Tradename;
            vm.CPElement4Productline = CPCombiPackRequest.Element4Productline;
            vm.SynBrand4 = CPCombiPackRequest.IsSynBrdPack4;

            //Maintaining ORG and REG ID for Save
            vm.CPOrgID = CPCombiPackRequest.OriginatorId;
            vm.CPRegID = CPCombiPackRequest.RegContactId
            //binding related to enable/disable of controls
            vm.CPSourceLocallyDetailsEnable = data.CPSourceLocallyDetailsEnable;
            vm.CPOriginatorEnable = data.CPOriginatorEnable;
            vm.CPLeadAIEnable = data.CPLeadAIEnable;
            vm.CPCombiCollationEnable = data.CPCombiCollationEnable;
            vm.CPUOMSelectEnable = data.CPUOMSelectEnable;
            vm.CPCountrySelectEnable = data.CPCountrySelectEnable;
            vm.CPCombiPresCodeEnable = data.CPCombiPresCodeEnable;
            vm.CPCombiFirstSaleDateEnable = data.CPCombiFirstSaleDateEnable;
            vm.LookupPresCodeCP = data.LookupPresCodeCP;
            vm.CPPLSelectEnable = data.CPPLSelectEnable;
            vm.CPCombiTradeNameEnable = data.CPCombiTradeNameEnable;
            vm.MktJustificationCP = data.MktJustificationCP;
            vm.CPRegGAL = data.CPRegGAL;
            vm.CPSourceLocallyYes = data.CPSourceLocallyYes;
            vm.CPSourceLocallyNo = data.CPSourceLocallyNo;
            vm.CPGALNOEnable = data.CPGALNOEnable;
            vm.CPRegManagerEnable = data.CPRegManagerEnable;
            vm.CPElement1SUEnable = data.CPElement1SUEnable;
            vm.CPElement1LeadAIEnable = data.CPElement1LeadAIEnable;
            vm.CPElement1DesignEnable = data.CPElement1DesignEnable;
            vm.CPElement1UCCodeEnable = data.CPElement1UCCodeEnable;
            vm.CPElement1SizeEnable = data.CPElement1SizeEnable;
            vm.CPElement1PartFillQtyEnable = data.CPElement1PartFillQtyEnable;
            vm.CPElement1TradenameEnable = data.CPElement1TradenameEnable;
            vm.CPElement1ProductlineEnable = data.CPElement1ProductlineEnable;
            vm.CPElement2SUEnable = data.CPElement2SUEnable;
            vm.CPElement2LeadAIEnable = data.CPElement2LeadAIEnable;
            vm.CPElement2DesignEnable = data.CPElement2DesignEnable;
            vm.CPElement2UCCodeEnable = data.CPElement2UCCodeEnable;
            vm.CPElement2SizeEnable = data.CPElement2SizeEnable;
            vm.CPElement2PartFillQtyEnable = data.CPElement2PartFillQtyEnable;
            vm.CPElement2TradenameEnable = data.CPElement2TradenameEnable;
            vm.CPElement2ProductlineEnable = data.CPElement2ProductlineEnable;
            vm.CPMTOSelectEnable = data.CPMTOSelectEnable;
            vm.SaveEnableCP = data.SaveEnableCP;
            vm.SubmitEnableCP = data.SubmitEnableCP;
            if (vm.CPSourceLocally == true || vm.CPSourceLocally == 'true') {
                vm.CPSourceLocallyDetailsEnable = false;
            }
            else {
                vm.CPSourceLocallyDetailsEnable = true;
            }
            /*Keep Combi lead Ai, SPAC and collation disabled always for parent and child should be disabled always from search*/
            vm.CPLeadAIEnable = true;
            vm.CPCombiCollationEnable = true;
            vm.SynBrandEnable = true;
            //Element 1
            vm.CPElement1SUEnable = true;
            vm.CPElement1LeadAIEnable = true;
            vm.CPElement1DesignEnable = true;
            vm.CPElement1UCCodeEnable = true;
            vm.CPElement1SizeEnable = true;
            vm.CPElement1PartFillQtyEnable = true;
            vm.CPElement1TradenameEnable = true;
            vm.CPElement1ProductlineEnable = true;
            vm.SynBrand1Enable = true;
            //Element 2
            vm.CPElement2SUEnable = true;
            vm.CPElement2LeadAIEnable = true;
            vm.CPElement2DesignEnable = true;
            vm.CPElement2UCCodeEnable = true;
            vm.CPElement2SizeEnable = true;
            vm.CPElement2PartFillQtyEnable = true;
            vm.CPElement2TradenameEnable = true;
            vm.CPElement2ProductlineEnable = true;
            vm.SynBrand2Enable = true;
            //Element 3
            vm.CPElement3SUEnable = true;
            vm.CPElement3LeadAIEnable = true;
            vm.CPElement3DesignEnable = true;
            vm.CPElement3UCCodeEnable = true;
            vm.CPElement3SizeEnable = true;
            vm.CPElement3PartFillQtyEnable = true;
            vm.CPElement3TradenameEnable = true;
            vm.CPElement3ProductlineEnable = true;
            vm.SynBrand3Enable = true;
            //Element 4
            vm.CPElement4SUEnable = true;
            vm.CPElement4LeadAIEnable = true;
            vm.CPElement4DesignEnable = true;
            vm.CPElement4UCCodeEnable = true;
            vm.CPElement4SizeEnable = true;
            vm.CPElement4PartFillQtyEnable = true;
            vm.CPElement4TradenameEnable = true;
            vm.CPElement4ProductlineEnable = true;
            vm.SynBrand4Enable = true;

        }
            //debugger;
        }).error(function (data) {
            //debugger;
            console.log("error" + data);
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in SaveorsubmitCombi method of SCRRequest.JS' });

        });
    }

    vm.finalTestList = [];

/***************************************************************************************************/
//Switch case - which function should be load when entry
/***************************************************************************************************/
    switch (requestTypeName) { 
        case 'New Pack':
            vm.getRequiredPage(requestID);
            break;
        case 'Country Add':
            vm.getRequiredPage(requestID);
            break;
        case 'PFR':
            vm.getRequiredPageForPFR(requestID);
            break;
        case 'EPT':
            vm.getRequiredPageForEPT(requestID, '0');
            break;
        case 'EPT-Copy':
            vm.getRequiredPageForEPT(requestID, requestID); //for EPT copy from search send requestid as value for both requestid and copy
            vm.disableCopy = true;
            break;
        case 'Other':
            vm.getRequiredPageForOther();
            break;
        case 'Supply Chain':
            vm.getRequiredPageForSupplyChain();
            break;
        case 'Combi Pack':
            vm.getRequiredPageForCombiPack();
            break;
        default:
            break;
    }

/***************************************************************************************************/
//Workflow realted - on click of submit
/***************************************************************************************************/
    $scope.SaveAndGo = function (data) {
        vm.NextTabName = data.NextTabName;
        vm.queryString = data.QueryString;
        if (data.NextTabName == 'Search') {
            $state.go("SearchExistingRequest");
        } else if (data.NextTabName == 'errorpage') {
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: vm.queryString });
        }
        else {
            $rootScope.$broadcast('NextTabName', vm.NextTabName);
            $rootScope.$broadcast('queryString', vm.queryString);
        }
    }

  
/**************************************************************************************************
//Validation - For Request type New pack and Country add
/***************************************************************************************************/
    vm.isPackLeadAI = false;
    vm.isPackSUAgiCode = false;
    vm.isPackDesCode = false;
    vm.isPackUCAgiCode = false;
    vm.isPackQty = false;
    vm.isPartFilled = false;
    vm.isPartUOM = false;
    vm.isPackCol = false;
    vm.isPackSPAC = false;
    vm.isPackProd = false;
    vm.isPackTrade = false;
    vm.isPackCntry = false;
    vm.isPackCntryPcode = false;
    vm.isPackMtO = false;
    vm.isPackProdCat = false;
    vm.isPackMarket = false;
    vm.isPackReg = false;

    vm.ValidatePackLeadAI = function () {
        if (vm.leadAIID == undefined) {
            vm.isPackLeadAI = true;
        }
        else {
            vm.isPackLeadAI = false;
        }
    }

    vm.ValidatePackSUAgiCode = function () {
        if (vm.getSUAgiCode == undefined) {
            vm.isPackSUAgiCode = true;
        }
        else {
            vm.isPackSUAgiCode = false;
        }
    }

    vm.ValidatePackDesCode = function () {
        if (vm.GetDesignCode == undefined) {
            vm.isPackDesCode = true;
        }
        else {
            vm.isPackDesCode = false;
        }
    }

    vm.ValidatePackUCAgiCode = function () {
        if (vm.GetUCagicode == undefined) {
            vm.isPackUCAgiCode = true;
        }
        else {
            vm.isPackUCAgiCode = false;
        }
    }

    vm.ValidatePackQty = function () {
        if (vm.GetQuantityPackSize == undefined) {
            vm.isPackQty = true;
        }
        else {
            vm.isPackQty = false;
        }
    }

    vm.ValidatePackPartFilled = function () {
        if (vm.getPartyFilled == undefined) {
            vm.isPartFilled = true;
        }
        else {
            vm.isPartFilled = false;
        }
    }

    vm.ValidatePackUOM = function () {
        if (vm.UOMselected == 'SELECT') {
            vm.isPartUOM = true;
        }
        else {
            vm.isPartUOM = false;
        }
    }

    vm.ValidatePackCol = function () {
        if (vm.GetConfigurationCollation == undefined) {
            vm.isPackCol = true;
        }
        else {
            vm.isPackCol = false;
        }
    }

    vm.ValidatePackSPAC = function () {
        if (vm.SPACselected == 'SELECT') {
            vm.isPackSPAC = true;
        }
        else {
            vm.isPackSPAC = false;
        }
    }

    vm.ValidatePackSProd = function () {
        if (vm.PLSselected == 'SELECT') {
            vm.isPackProd = true;
        }
        else {
            vm.isPackProd = false;
        }
    }

    vm.ValidatePacktrade = function () {
        if (vm.GetTradeName == undefined) {
            vm.isPackTrade = true;
        }
        else {
            vm.isPackTrade = false;
        }
    }

    vm.validatePackCntry = function () {
        if (vm.countrySaleSelected == 'SELECT') {
            vm.isPackCntry = true;
        }
        else {
            vm.isPackCntry = false;
        }
    }

    vm.validatePackCntryPcode = function () {
        if (vm.GetCountryPresCode == undefined) {
            vm.isPackCntryPcode = true;
        }
        else {
            vm.isPackCntryPcode = false;
        }
    }

    vm.validatePackMtO = function () {
        if (vm.MTOselected == 'SELECT') {
            vm.isPackMtO = true;
        }
        else {
            vm.isPackMtO = false;
        }
    }

    vm.validatePackProdCat = function () {
        if (vm.PCselected == 'SELECT') {
            vm.isPackProdCat = true;
        }
        else {
            vm.isPackProdCat = false;
        }
    }

    vm.validatePackMarket = function () {
        if (vm.GetMarketingJustification == undefined || vm.GetMarketingJustification == "") {
            vm.isPackMarket = true;
        }
        else {
            vm.isPackMarket = false;
        }
    }

    vm.validatePackReg = function () {
        if (vm.GetRegulatoryContact == undefined || vm.GetRegulatoryContact == "") {
            vm.isPackReg = true;
        }
        else {
            vm.isPackReg = false;
        }
    }

    $scope.validateNewPack = function () {
        var isValid = true;

        if (vm.leadAIID == undefined) {
            vm.isPackLeadAI = true;
            isValid = false;
        }
        if (vm.SUAgiCodeShow) {
            if (vm.getSUAgiCode == undefined) {
                vm.isPackSUAgiCode = true;
                isValid = false;
            }
        }
        if (vm.GetDesignCode == undefined) {
            vm.isPackDesCode = true;
            isValid = false;
        }

        if (vm.GetUCagicode == undefined) {
            vm.isPackUCAgiCode = true;
            isValid = false;
        }
        if (vm.GetQuantityPackSize == undefined) {
            vm.isPackQty = true;
            isValid = false;
        }

        if (vm.PartFilledShow) {
            if (vm.getPartyFilled == undefined) {
                vm.isPartFilled = true;
                isValid = false;
            }
        }

        if (vm.UOMselected == 'SELECT') {
            vm.isPartUOM = true;
            isValid = false;
        }


        if (vm.GetConfigurationCollation == undefined) {
            vm.isPackCol = true;
            isValid = false;
        }

        if (vm.SPACselected == 'SELECT') {
            vm.isPackSPAC = true;
            isValid = false;
        }

        if (vm.PLSselected == 'SELECT') {
            vm.isPackProd = true;
            isValid = false;
        }

        if (vm.GetTradeName == undefined) {
            vm.isPackTrade = true;
            isValid = false;
        }

        if (vm.countrySaleSelected == 'SELECT') {
            vm.isPackCntry = true;
            isValid = false;
        }

        if (vm.GetCountryPresCode == undefined) {
            vm.isPackCntryPcode = true;
            isValid = false;
        }

        if (vm.MTOselected == 'SELECT') {
            vm.isPackMtO = true;
            isValid = false;
        }

        if (vm.PCselected == 'SELECT') {
            vm.isPackProdCat = true;
            isValid = false;
        }

        if (vm.GetMarketingJustification == undefined) {
            vm.isPackMarket = true;
            isValid = false;
        }

        if (vm.GetRegulatoryContact == undefined) {
            vm.isPackReg = true;
            isValid = false;
        }

        return isValid;
    }
        
/**************************************************************************************************
//Validation - For Request type PFR
/***************************************************************************************************/
    vm.isPFRLeadAI = false;
    vm.isDesignCode = false;
    vm.isUcAgiCode = false;
    vm.isQty = false;
    vm.isUOM = false;
    vm.isPacks = false;
    vm.isOrder = false;
    vm.isProd = false;
    vm.isTrade = false;
    vm.isCoS = false;
    vm.isCPC = false;
    vm.isQtyNum = false;
    $scope.validatePFRLeadAI = function () {
        if (vm.PFRLeadAI == undefined) {
            vm.isPFRLeadAI = true;
        }
        else {
            vm.isPFRLeadAI = false;
        }

    }

    $scope.validatePFRDesignCode = function () {
        if (vm.PFRDesignCode == undefined) {
            vm.isDesignCode = true;
        }
        else {
            vm.isDesignCode = false;
        }

    }

    $scope.validatePFRAgiCode = function () {
        if (vm.PFRAgiCode == undefined) {
            vm.isUcAgiCode = true;
        }
        else {
            vm.isUcAgiCode = false;
        }

    }

    $scope.validateQty = function () {
        vm.isQtyNum = false;
        vm.isQty = false;
        if (vm.PFRQuantityPackSize == undefined) {
            vm.isQty = true;
        }
        if (!fnValidateDecimal(vm.PFRQuantityPackSize)) {
            vm.isQty = false;
            vm.isQtyNum = true;
        }

        if (vm.PFRQuantityPackSize < 0 || vm.PFRQuantityPackSize > 9999999.99) {
            vm.isQty = false;
            vm.isQtyNum = true;

        }
    }

    function fnValidateDecimal(strValue) {
        var strPattern1 = /^\d+(\.\d{2})?$/;
        var strPattern2 = /^\d+(\.\d{1})?$/;
        var strPattern3 = /^\d+(\.\d{0})?$/;
        var strPattern4 = /^\.\d$/;
        var strPattern5 = /^\.\d\d$/;
        if (!(strPattern1.test(strValue)) && !(strPattern2.test(strValue)) && !(strPattern3.test(strValue)) && !(strPattern4.test(strValue)) && !(strPattern5.test(strValue)))//&& !(strPattern6.test(strValue)))
        {
            return false;
        }
        else {
            return true;
        }
    }

    $scope.validateUOM = function () {
        if (vm.UOMSelected == 'SELECT') {
            vm.isUOM = true;
        }
        else {
            vm.isUOM = false;
        }
    }

    $scope.validatePacks = function () {
        if (vm.PFRgetConfigurationorCollation == undefined) {
            vm.isPacks = true;
        }
        else {
            vm.isPacks = false;
        }
    }

    $scope.validateOrder = function () {
        if (vm.PFRMTOselected == 'SELECT') {
            vm.isOrder = true;
        }
        else {
            vm.isOrder = false;
        }
    }

    $scope.validateProd = function () {
        if (vm.PLSselected == 'SELECT') {
            vm.isProd = true;
        }
        else {
            vm.isProd = false;
        }
    }

    $scope.validateTrade = function () {
        if (vm.PFRgetTradeName == undefined) {
            vm.isTrade = true;
        }
        else {
            vm.isTrade = false;
        }
    }

    $scope.validateCoS = function () {
        if (vm.COSselected == 'SELECT') {
            vm.isCoS = true;
        }
        else {
            vm.isCoS = false;
        }
    }

    $scope.validateCPC = function () {
        if (vm.PFRgetCountryPresCode == undefined) {
            vm.isCPC = true;
        }
        else {
            vm.isCPC = false;
        }
    }
    $scope.validatePFR = function () {
        var isValid = true;
        if (vm.PFRLeadAI == undefined) {
            vm.isPFRLeadAI = true;
            isValid = false;
        }

        if (vm.PFRDesignCode == undefined) {
            vm.isDesignCode = true;
            isValid = false;
        }

        if (vm.PFRAgiCode == undefined) {
            vm.isUcAgiCode = true;
            isValid = false;
        }

        if (vm.PFRQuantityPackSize == undefined) {
            vm.isQty = true;
            isValid = false;
        }

        if (vm.UOMSelected == 'SELECT') {
            vm.isUOM = true;
            isValid = false;
        }

        if (vm.PFRgetConfigurationorCollation == undefined) {
            vm.isPacks = true;
            isValid = false;
        }

        if (vm.PFRMTOselected == 'SELECT') {
            vm.isOrder = true;
            isValid = false;
        }

        if (vm.PLSselected == 'SELECT') {
            vm.isProd = true;
            isValid = false;
        }

        if (vm.PFRgetTradeName == undefined) {
            vm.isTrade = true;
            isValid = false;
        }

        if (vm.COSselected == 'SELECT') {
            vm.isCoS = true;
            isValid = false;
        }

        if (vm.PFRgetCountryPresCode == undefined) {
            vm.isCPC = true;
            isValid = false;
        }

        return isValid;
    }

/**************************************************************************************************
//Validation - For Request type Other range request
/***************************************************************************************************/
    vm.isotherLeadAI = false;
    vm.isotherCountry = false;
    vm.isotherCountryPCode = false;
    vm.icCommentLen = false;
    $scope.checkLength = function () {
        if (vm.othgetComments.length > 1000) {
            vm.icCommentLen = true;
        }
        else {
            vm.icCommentLen = false;
        }
    }

    $scope.validateOtherLeadAI = function () {
        if (vm.othgetLeadAI == undefined) {
            vm.isotherLeadAI = true;
        }
        else {
            vm.isotherLeadAI = false;
        }
    }

    $scope.validateOtherCountry = function () {
        if (vm.othgetCountry == 'SELECT') {
            vm.isotherCountry = true;
        }
        else {
            vm.isotherCountry = false;
        }
    }

    $scope.validateOtherCountryPC = function () {
        if (vm.othgetCountryPresCode == undefined) {
            vm.isotherCountryPCode = true;
        }
        else {
            vm.isotherCountryPCode = false;
        }
    }

    $scope.validateOther = function () {
        var isValid = true;
        if (vm.othgetLeadAI == undefined) {
            vm.isotherLeadAI = true;
            isValid = false;
        }
        if (vm.othgetCountry == 'SELECT') {
            vm.isotherCountry = true;
            isValid = false;
        }
        if (vm.othgetCountryPresCode == undefined) {
            vm.isotherCountryPCode = true;
            isValid = false;
        }
        if (vm.othgetComments != undefined && vm.othgetComments != "") {
            if (vm.othgetComments.length > 1000) {
                vm.icCommentLen = true;
                isValid = false;
            }
        }
        return isValid;
    }
/**************************************************************************************************
//Combi pack - On Radio button change
/***************************************************************************************************/
        vm.CPReactivation_Requestfunc = function () {
            if (vm.CPReactivation_Request == 1) {
                vm.CPAGI_Code_ReactivateShow = true;
            }
            else {
                vm.CPAGI_Code_ReactivateShow = false;
            }
        }

        vm.CPSourceLocallyfunc = function () {
            console.log("selectChange" + vm.CPSourceLocally);
            if (vm.CPSourceLocally == true || vm.CPSourceLocally == 'true') {
                vm.CPSourceLocallyDetailsEnable = false;
            }
            else {
                vm.CPSourceLocallyDetailsEnable = true;
            }
        }



/***************************************************************************************************/
//Save and Submit click realted for all requests
/***************************************************************************************************/
//Function to save data for New pack and country add
    vm.saveSubmenu = function (go) {
        vm.isPackLeadAI = false;
        vm.isPackSUAgiCode = false;
        vm.isPackDesCode = false;
        vm.isPackUCAgiCode = false;
        vm.isPackQty = false;
        vm.isPartFilled = false;
        vm.isPartUOM = false;
        vm.isPackCol = false;
        vm.isPackSPAC = false;
        vm.isPackProd = false;
        vm.isPackTrade = false;
        vm.isPackCntry = false;
        vm.isPackCntryPcode = false;
        vm.isPackMtO = false;
        vm.isPackProdCat = false;
        vm.isPackMarket = false;
        vm.isPackReg = false;
        var isValid = $scope.validateNewPack();
        if (isValid) {
        //debugger;
        var leadAIValue;
        if ($scope.nprLeadAI) {
            leadAIValue = $scope.nprLeadAI;
        } else {
            leadAIValue = vm.GetLeadAIID;
        }
        if (vm.hdnDomainOrg && vm.hdnUserIdOrg) {
            vm.originatorId = vm.hdnDomainOrg + '//' + vm.hdnUserIdOrg;
        }
        if (vm.hdnDomainReg && vm.hdnUserIdReg) {
            vm.GetRegulatoryContactID = vm.hdnDomainReg + '//' + vm.hdnUserIdReg;
        }
            if (vm.GetIsChild == 1) {
                vm.GetNewAI = vm.leadAIID;
        }
        var NewPackRequestSelected = {
            'requestID': requestID,
            'ReqType': requestType,
            'copy': '0',
            'GetNotOriginatorId': vm.originatorId,
            'GetSelectedAI': leadAIValue,
            'GetNewAI': vm.GetNewAI,
            'GetAGI_Code_Reactivate': '',
            'GetIsChild': vm.GetIsChild,
            'GetSUAgiCode': vm.getSUAgiCode,
            'GetDesignCode': vm.GetDesignCode,
            'GetUCagicode': vm.GetUCagicode,
            'GetQuantityPackSize': vm.GetQuantityPackSize,
                'GetPartFilledQuantity': vm.getPartyFilled,
            'GetSelectedUoM': vm.UOMselected,
            'GetAncillariesSpecialReq': vm.GetAncillariesSpecialReq,
            'GetPLSName': vm.PLSselected,
            'GetTradeName': vm.GetTradeName,
            'GetSelectedCountry': vm.countrySaleSelected,
            'GetCountryPresCode': vm.GetCountryPresCode,
            'GetSourceLocally': vm.SourceLocally,
            //== false ? $scope.getPageInfo.GetSourceLocally = 0 : $scope.getPageInfo.GetSourceLocally = 1,
            'GetSourceLocallyDetails': vm.GetSourceLocallyDetails,
            'GetMarketingJustification': vm.GetMarketingJustification,
            'GetSupplier': vm.GetSupplier,
            'GetRegContactId': vm.GetRegulatoryContactID,
            'GetSelectedMakeToOrder': vm.MTOselected,
            'GetDateofFirstSale': vm.time2,
            'GetSalesPriceYear1': vm.getTableDetail[0].Year1,
            'GetSalesPriceYear2': vm.getTableDetail[0].Year2,
            'GetSalesPriceYear3': vm.getTableDetail[0].Year3,
            'GetSalesValueYear1': vm.getTableDetail[2].Year1,
            'GetSalesValueYear2': vm.getTableDetail[2].Year2,
            'GetSalesValueYear3': vm.getTableDetail[2].Year3,
            'GetSalesVolumeYear1': vm.getTableDetail[1].Year1,
            'GetSalesVolumneYear2': vm.getTableDetail[1].Year2,
            'GetSalesVolumneYear3': vm.getTableDetail[1].Year3,

            //SOCB LRMS change            
                'CostYear1': vm.Region == 'LATAM' ? vm.getTableDetail[3].Year1 : '',
                'CostYear2': vm.Region == 'LATAM' ? vm.getTableDetail[3].Year2 : '',
                'CostYear3': vm.Region == 'LATAM' ? vm.getTableDetail[3].Year3 : '',
                'GrossProfitYear1': vm.Region == 'LATAM' ? vm.getTableDetail[4].Year1 : '',
                'GrossProfitYear2': vm.Region == 'LATAM' ? vm.getTableDetail[4].Year2 : '',
            'GrossProfitYear3': vm.Region == 'LATAM' ? vm.getTableDetail[4].Year3 : '',
            //EOCB LRMS change
            'GetSelectedCommentsDdl': vm.optionChecked,
            'GetCommentsTxt': (vm.textAdditionalRequire == undefined) ? vm.textAdditionalRequire = ' ' : vm.textAdditionalRequire,
            'GetReactivation_Request': vm.reactivationRequest,
            'GetSelectedIsSynBrdPackReq': vm.SPACselected,
            'GetConfigurationCollation': vm.GetConfigurationCollation,
            'GetNSUCode': vm.GetNSUCode,
            'GetSelectedProductCategory': vm.PCselected == undefined ? vm.PCselected = '0' : vm.PCselected,
            'FirstName': (vm.hdnFirstNameOrg != null) ? vm.hdnFirstNameOrg : '',
            'LastName': (vm.hdnLastNameOrg != null) ? vm.hdnLastNameOrg : '',
            'UserId': (vm.hdnUserIdOrg != null) ? vm.hdnDomainOrg + '//' + vm.hdnUserIdOrg : '',
            'Email': (vm.hdnEmailOrg != null) ? vm.hdnEmailOrg : '',
            'SecondUserFirstName': (vm.hdnFirstNameReg != null) ? vm.hdnFirstNameReg : '',
            'SecondUserLastName': (vm.hdnLastNameReg != null) ? vm.hdnLastNameReg : '',
            'SecondUserId': (vm.hdnUserIdReg != null) ? vm.hdnDomainReg + '//' + vm.hdnUserIdReg : '',
            'SecondUserEmail': (vm.hdnEmailReg != null) ? vm.hdnEmailReg : '',

            //SOCB - LRMS change - Submit Request to procurement Manager
                'ProcMgrFirstName': (vm.Region == 'LATAM' && vm.ProcMgrFirstName != null) ? vm.ProcMgrFirstName : '',
            'ProcMgrLastName': (vm.Region == 'LATAM' && vm.ProcMgrLastName != null) ? vm.ProcMgrLastName : '',
            'ProcMgrUserId': (vm.Region == 'LATAM' && vm.ProcMgrID != null) ? vm.ProcMgrID : '',
            'ProcMgrEmail': (vm.Region == 'LATAM' && vm.ProcMgrEmail != null) ? vm.ProcMgrEmail : '',
            //EOCB - LRMS change - Submit Request to procurement Manager          
        };
        if (NewPackRequestSelected) {
            $http({
                url: "NewPackRequest/SaveorSubmitReq",
                method: 'POST',
                data: NewPackRequestSelected,
                contentType: "application/json;",
                dataType: "json"
            }).success(function (data) {
                //debugger;
                requestID = data;
                localStorage.setItem('name', requestID);
                localStorage.setItem('type', requestTypeName);
                var copy = '0';
                var FromSave = '1';
                if (go === 'go') {
                    if (requestType == '2') {
                        $http.get("NewPackRequest/GetNextPage?requestId=" + requestID + "&requestType=New Pack&tabCode=NP")
                            .success(function (data) {
                                console.log(data);
                                //$state.go("SupplyChainRequest." + data.NextTabName, { QueryString: data.QueryString });
                                $scope.SaveAndGo(data);
                            });
                    }
                    if (requestType == '3') {
                        $http.get("NewPackRequest/GetNextPage?requestId=" + requestID + "&requestType=Country Add&tabCode=CA")
                           .success(function (data) {
                               console.log(data);
                               //$state.go("SupplyChainRequest." + data.NextTabName, { QueryString: data.QueryString });
                               $scope.SaveAndGo(data);
                           });
                    }

                    return;
                }
                    //SOCB - LRMS change - Submit Request to Procurement Manager
                    else if (go == 'ProcMgr') {
                    if (requestType.toString() == '2') {
                        $http.get("NewPackRequest/GetSubmitToProcurementMgr?reqId=" + requestID)
                               .success(function (data) {
                                   console.log(data);
                                   vm.getRequiredPage(data, copy, FromSave);
                                   vm.subMenu = true;

                                   $rootScope.$broadcast('SCRNameto-requestID', requestID);
                               });
                    }
                    if (requestType.toString() == '3') {
                        $http.get("NewPackRequest/GetSubmitToProcurementMgr?reqId=" + requestID)
                           .success(function (data) {
                               debugger;
                               console.log(data);
                               vm.getRequiredPage(data, copy, FromSave);
                               vm.subMenu = true;

                               $rootScope.$broadcast('SCRNameto-requestID', requestID);
                           });
                    }
                }
                    //EOCB - LRMS change - Submit Request to Procurement Manager
                else {
                    vm.getRequiredPage(data, copy, FromSave);
                    vm.subMenu = true;
                    
                    $rootScope.$broadcast('SCRNameto-requestID', requestID);
                };
            }).error(function (data) {
                console.log("error" + data);
            })
        } else {
            return alert("!!!!!!");
        }
        }
    };

//Function to save data for PFR
    vm.savePFRMenu = function (go) {
        vm.isPFRLeadAI = false;
        vm.isDesignCode = false;
        vm.isUcAgiCode = false;
        vm.isQty = false;
        vm.isUOM = false;
        vm.isPacks = false;
        vm.isOrder = false;
        vm.isProd = false;
        vm.isTrade = false;
        vm.isCoS = false;
        vm.isCPC = false;
        vm.isQtyNum = false;
        //debugger;
        //RequestType = '44006';
        //dtFirstSaleCheck = '';
        //IsChild = '0';
        //return fnNPSaveMandatoryCheck(RequestType,dtFirstSaleCheck, 0,IsChild);
        var isValid = $scope.validatePFR();
        if (isValid) {
        if (vm.hdnDomainOrg && vm.hdnUserIdOrg) {
            vm.PFRCinO = vm.hdnDomainOrg + '//' + vm.hdnUserIdOrg;
        }
        if (vm.hdnDomainReg && vm.hdnUserIdReg) {
            vm.PFRRegContactId = vm.hdnDomainReg + '//' + vm.hdnUserIdReg;
        }
        var PFRRequestSelected = {
            'RequestId': parseInt(requestID),
            'getLeadAI': vm.PFRLeadAI,
            'getDesignCode': vm.PFRDesignCode,
            'getUCagiCode': vm.PFRAgiCode,
            'getQuantityorPrimaryPackSize': vm.PFRQuantityPackSize,
            'getConfigurationorCollation': vm.PFRgetConfigurationorCollation,
            'getUoM': vm.UOMSelected,
            'getProductLineSeller': vm.PLSselected,
            'getTradeName': vm.PFRgetTradeName,
            'getCountryofSale': vm.COSselected,
            'getCountryPresCode': vm.PFRgetCountryPresCode,
            'getSupplier': vm.PFRgetSupplier,
            'getRegulatoryContact': vm.PFRRegContactId,
            'getNSUCode': vm.PFRgetNSUCode,
            'getNotOriginator': vm.PFRCinO,
            'getMaketoOrder': vm.PFRMTOselected,
            'FirstName': (vm.hdnFirstNameOrg != null) ? vm.hdnFirstNameOrg : '',
            'LastName': (vm.hdnLastNameOrg != null) ? vm.hdnLastNameOrg : '',
            'UserId': (vm.hdnUserIdOrg != null) ? vm.hdnDomainOrg + '//' + vm.hdnUserIdOrg : '',
            'Email': (vm.hdnEmailOrg != null) ? vm.hdnEmailOrg : '',
            'SecondUserFirstName': (vm.hdnFirstNameReg != null) ? vm.hdnFirstNameReg : '',
            'SecondUserLastName': (vm.hdnLastNameReg != null) ? vm.hdnLastNameReg : '',
            'SecondUserId': (vm.hdnUserIdReg != null) ? vm.hdnDomainReg + '//' + vm.hdnUserIdReg : '',
            'SecondUserEmail': (vm.hdnEmailReg != null) ? vm.hdnEmailReg : '',
        }
        if (PFRRequestSelected) {
            $http({
                url: "PFR/Save",
                method: 'POST',
                data: PFRRequestSelected,
                contentType: "application/json;",
                dataType: "json"
            }).success(function (data) {
                if (data == '420') {
                    $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured during Saving PFR from Save method of PFRController' })
                }
                else {
                    var FromSave = '1';
                    requestID = data;
                    localStorage.setItem('name', requestID);
                    localStorage.setItem('type', requestTypeName);
                    if (go === 'go') {
                        $http.get("NewPackRequest/GetNextPage?requestId=" + requestID + "&requestType=PFR&tabCode=PFR")
                           .success(function (data) {
                               console.log(data);
                               //$state.go("SupplyChainRequest." + data.NextTabName, { QueryString: data.QueryString });
                               $scope.SaveAndGo(data);
                           });

                        return;
                    } else {
                        vm.getRequiredPageForPFR(data, FromSave);
                        vm.subMenu = true;
                        requestID = data;
                        $rootScope.$broadcast('SCRNameto-requestID', requestID);
                    };
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured during Saving PFR from Save method of SCRRequest-JS' })
            })
        } else {
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured during Saving PFR from Save method of SCRRequest-JS' })
        }
    }
    }

//Function to save data for EPT
    vm.saveEPTMenu = function (submit) {
        var copy;
        //if we recieve the submit parameter from submit function, then we will make the copy to 0, and use existing value of requestID
        //else we didnt recieve submit means we save it from save button, with or with out copy, if with copy checked, we should make value of copy to requestID, and requestID to 0
        if (submit == '1') {
            if (requestTypeName == 'EPT-Copy') {
                requestID = requestID;
                copy = requestID;
            } else {
                copy = 0;
            }

        } else if (requestTypeName == 'EPT-Copy') {
            requestID = requestID;
            copy = requestID;
            submit = 0;
        } else {
            if (vm.ifEPTCopyChecked === true) {
                var a = requestID;
                copy = a;
                if (copy == a) {
                    requestID = 0;
                }
            } else {
                copy = 0;
            }
        }
        if (vm.hdnDomainOrg && vm.hdnUserIdOrg) {
            vm.Orgid = vm.hdnDomainOrg + '//' + vm.hdnUserIdOrg;
        }
        if (vm.hdnDomainReg && vm.hdnUserIdReg) {
            vm.regID = vm.hdnDomainReg + '//' + vm.hdnUserIdReg;
        }
        var EPTRequestSelected = {
            'RequestId': parseInt(requestID),
            'copy': copy,
            'Submit': submit,
            'GetNotOrgData': vm.Orgid,
            'GetUmbrellaTeam': vm.SMSTerm,
            'getLeadAI': vm.EPTgetLeadAI,
            'GetAltLeadAI': vm.EPTgetAltLeadAI,
            'GetDesignCode': vm.EPTgetDesignCode,
            'GetCategory': vm.EPTgetCategory,
            'GetFDes': vm.EPTgetFDes,
            'GetUCAGICode': vm.EPTgetUCAgiCode,
            'GetQty': vm.EPTgetQty,
            'GetConfiguration': vm.EPTgetConfiguration,
            'GetSelectedUOM': vm.EPTgetUOM,
            'GetAncillaries': vm.EPTgetAncillaries,
            'GetSelectedPLS': vm.EPTgetPLS,
            'GetTradeName': vm.EPTgetTradeName,
            'GetSelectedCntryOfSale': vm.EPTgetCountryOfSale,
            'GetCountryPresCode': vm.EPTgetCountryPresCode,
            'GetDateofFirstSale': vm.time2EPT,
            'GetRegData': vm.regID,
            'GetSelectedProductCategory': vm.EPTgetProductCategory,
            'GetSelectedCommentsDdl': vm.optionChecked,
            'GetCommentsTxt': vm.EPTgetCommentsDdl, //???????????
            'GetSelectedMakeToOrder': vm.EPTGetMakeToOrder,
            'GetComment': vm.EPTgetComment,
        }
        if (EPTRequestSelected) {
            $http({
                url: "EPTRangeRequest/Save",
                method: 'POST',
                data: EPTRequestSelected,
                contentType: "application/json;",
                dataType: "json"
            }).success(function (data) {
                if (data == -1) {
                    $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in SCRRequest.JS' });
                }
                else {
                    var go = '1';
                    var FromSave = 1;
                    requestID = data;
                    localStorage.setItem('name', requestID);
                    localStorage.setItem('type', requestTypeName);
                    if (go === submit) {
                        //if (requestType == 1) {
                        //    nextRequestType = 'EPT';
                        //    nextTabCode = 'SCP_EPT';
                        //} else if (requestType == 2) {
                        //    nextRequestType = 'New Pack';
                        //    nextTabCode = 'SCP_NP';
                        //} else if (requestType == 3) {
                        //    nextRequestType = 'Country Add';
                        //    nextTabCode = 'SCP_CA';
                        //} else if (requestType == 4) {
                        //    nextRequestType = 'Supply Chain';
                        //    nextTabCode = 'SCP_SC';
                        //} else if (requestType == 5) {
                        //    nextRequestType = 'Combi Pack';
                        //    nextTabCode = 'SCP_CMBI';
                        //} else if (requestType == 6) {
                        //    nextRequestType = 'PFR';
                        //    nextTabCode = 'SCP_PFR';
                        //}

                        //$http.get("NewPackRequest/GetNextPage?requestId=" + requestID + "&requestType=" + nextRequestType + "&tabCode=" + nextTabCode)
                        $http.get("NewPackRequest/GetNextPage?requestId=" + requestID + "&requestType=EPT&tabCode=EPT")
                           .success(function (data) {
                               console.log(data);
                               //$state.go("SupplyChainRequest." + data.NextTabName, { QueryString: data.QueryString });
                               $scope.SaveAndGo(data);
                           });

                        return;
                    } else {
                        // binding the new value for requestID if we copyed
                        requestID = data;
                        if (requestID != copy) {
                            copy = '0';
                        }
                        vm.getRequiredPageForEPT(requestID, copy, vm.FromSave);
                        vm.subMenu = true;
                        $rootScope.$broadcast('SCRNameto-requestID', requestID);
                    };
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in SCRRequest.JS' });
            })
        } else {
            return alert("!!!!!!");
        }
    };

   
//Function to save data for Other
    vm.saveOtherMenu = function (go) {
        //Saveorsubmit
        vm.isotherLeadAI = false;
        vm.isotherCountry = false;
        vm.isotherCountryPCode = false;
        var isValid = $scope.validateOther();
        if (isValid) {
            if (vm.hdnDomainOrg && vm.hdnUserIdOrg) {
            vm.othgetNotOriginatorId = vm.hdnDomainOrg + '//' + vm.hdnUserIdOrg;
        }
        var OtherRequestSelected = {
            'requestId': requestID,
            'getLeadAI': vm.othgetLeadAI,
            'getProductLineSeller': vm.othgetProductLineSeller,
            'getDescription': vm.othgetDescription,
            'getUoM': vm.othgetUoM,
            'getComments': vm.othgetComments,
            'getCountry': vm.othgetCountry,
            'getCountryPresCode': vm.othgetCountryPresCode,
            'getNotOriginator': vm.othgetNotOriginatorId,
                'FirstName': (vm.hdnFirstNameOrg != null) ? vm.hdnFirstNameOrg : '',
                'LastName': (vm.hdnLastNameOrg != null) ? vm.hdnLastNameOrg : '',
                'UserId': (vm.hdnUserIdOrg != null) ? vm.hdnDomainOrg + '//' + vm.hdnUserIdOrg : '',
                'Email': (vm.hdnEmailOrg != null) ? vm.hdnEmailOrg : '',
        }
        if (OtherRequestSelected) {
            $http({
                url: "OtherRangeRequest/Save",
                method: 'POST',
                data: OtherRequestSelected,
                contentType: "application/json;",
                dataType: "json"
            }).success(function (data) {
                if (data == '420') {
                    $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured during Saving Other range request from Otherrange controller' })
                }
                else {
                    var FromSave = 1;
                    requestID = data;
                    localStorage.setItem('name', requestID);
                    localStorage.setItem('type', requestTypeName);
                    vm.getRequiredPageForOther(FromSave);
                    vm.subMenu = true;
                    if (go === 'go') {
                        $http.get("NewPackRequest/GetNextPage?requestId=" + requestID + "&requestType=Other&tabCode=OTR")
                           .success(function (data) {
                               console.log(data);
                               //$state.go("SupplyChainRequest." + data.NextTabName, { QueryString: data.QueryString });
                               $scope.SaveAndGo(data);
                           })
                    }
                    $rootScope.$broadcast('SCRNameto-requestID', requestID);
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured during Saving Other range request from Save method of SCRREquest-JS' })
            })
        } else {
            $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured during Saving Other range request from Save method of SCRREquest-JS' })
        }
        }
    };

//Function to save data for Supply Chain
    vm.saveSCMenu = function (go) {
        var testMain1 = '';
        
        for (i = 0; i < $scope.InputRepeat.length; i++) {
            var a = $scope.InputRepeat[i];
            if (a.n_Item1 == undefined) {
                a.n_Item1 = '';
            }
            if (a.n_Item2 == undefined) {
                a.n_Item2 = '';
            }
            if (a.n_Item3 == undefined) {
                a.n_Item3 = '';
            }
            if (a.n_Item4 == undefined) {
                a.n_Item4 = '';
            }
            if (a.n_Item5 == undefined) {
                a.n_Item5 = '';
            }
            testMain1 = testMain1 + a.n_Item1 + '~' + a.n_Item2 + '~' + a.n_Item3 + '~' + a.n_Item4 + '~' + a.n_Item5 + '^';
        };
        $scope.testMain1 = testMain1;

        for (i = 0; i < $scope.getGetSUAgiCodeAffected.length; i++) {
            var a = $scope.getGetSUAgiCodeAffected[i];
            testMain = testMain + a.m_Item1 + '~' + a.m_Item2 + '~' + a.m_Item3 + '~' + a.m_Item4 + '~' + a.m_Item5 + '^';
        };
        if ($scope.testMain1) {
            testMain = testMain + $scope.testMain1;
        }
        if ($scope.nprLeadAI) {
            var leadAIValue = $scope.nprLeadAI;
        }
        if (vm.hdnDomainOrg && vm.hdnUserIdOrg) {
            vm.SCGetNotOrgDataData = vm.hdnDomainOrg + '//' + vm.hdnUserIdOrg;
        }
        var SCRequestSelected = {
            'requestId': requestID,
            'leadAI': leadAIValue,
            'GetNotOrginator': vm.SCGetNotOrgDataData,
            'GetDetailsChangeLeadAI': vm.SCGetDetailsChangeLeadAI,
            'GetDateChange': vm.time2SCP,
            'GetCurrentDesignCodeVariantnumber': vm.SCGetCurrentDesignCodeVariantnumber,
            'GetNewDesignCodeVariantnumber': vm.SCGetNewDesignCodeVariantnumber,
            'GetCurrentUCAgiCode': vm.SCGetCurrentUCAgiCode,
            'GetNewUCAgiCode': vm.SCGetNewUCAgiCode,
            'GetCurrentPack': vm.SCGetCurrentPack,
            'GetNewPack': vm.SCGetNewPack,
            'GetCurrentSource': vm.SCGetCurrentSource,
            'GetNewSource': vm.SCGetNewSource,
            'GetSUAgiCodeAffected': testMain,
            'GetCountryofSalesAffected': 'null',
            'GetBackgroundInformation': vm.SCGGetBackgroundInformation,
            'GetSelectedNSU': 'null',
            'GetSelectedMakeToOrder': vm.SCGetSelectedMakeToOrder,
            'FirstName': (vm.hdnFirstNameOrg != null) ? vm.hdnFirstNameOrg : '',
            'LastName': (vm.hdnLastNameOrg != null) ? vm.hdnLastNameOrg : '',
            'UserId': (vm.hdnUserIdOrg != null) ? vm.hdnDomainOrg + '//' + vm.hdnUserIdOrg : '',
            'Email': (vm.hdnEmailOrg != null) ? vm.hdnEmailOrg : '',
        }
        if (SCRequestSelected) {
            $http({
                url: "SupplyChainRequest/Saveorsubmit",
                method: 'POST',
                data: SCRequestSelected,
                contentType: "application/json;",
                dataType: "json"
            }).success(function (data) {
                if (data == '420') {
                    $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured during Saving Supply chain Request' });
                }
                else {
                    requestID = data;
                    localStorage.setItem('name', requestID);
                    localStorage.setItem('type', requestTypeName);
                    if (go === 'go') {
                        nextRequestType = 'Supply Chain';
                        nextTabCode = 'SC';

                        $http.get("NewPackRequest/GetNextPage?requestId=" + requestID + "&requestType=" + nextRequestType + "&tabCode=" + nextTabCode)
                            .success(function (data) {
                                //$state.go("SupplyChainRequest." + data.NextTabName, { QueryString: data.QueryString });
                                $scope.SaveAndGo(data);
                            });

                        return;
                    } else {
                        var fromSave = "1";
                        vm.getRequiredPageForSupplyChain(data, fromSave);
                    }
                    vm.subMenu = true;
                    $rootScope.$broadcast('SCRNameto-requestID', requestID);
                    $stateParams.ifGetBoth == null;
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured during Saveorsubmit method from SCR RequestJS' });
            })
        } else {
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured during Saveorsubmit method from SCR RequestJS' });
        }
    }

//Function to save data for Combi Pack
    vm.saveCPMenu = function (go) {
        if (vm.hdnDomainOrg && vm.hdnUserIdOrg) {
            vm.CPOrgID = vm.hdnDomainOrg + '//' + vm.hdnUserIdOrg;
        }
        if (vm.hdnDomainReg && vm.hdnUserIdReg) {
            vm.CPRegID = vm.hdnDomainReg + '//' + vm.hdnUserIdReg;
        }
        var CPRequestSelected = {
            'requestID': requestID,
            'Originator': vm.CPOrgID,
            'UoMAsPC': vm.CPUOMSelect,
            'CombiCountry': vm.CPCountrySelect,
            'CombiPresCode': vm.CPCombiPresCode,
            'CombiFirstSaleDate': vm.time2CoP,
            'CombiProductline': vm.CPPLSelect,
            'CombiTradeName': vm.CPCombiTradeName,
            'RegulatoryContact': vm.CPRegID,
            'MarketingJustification': vm.MktJustification,
            'SalesPriceYear1': $scope.CPYearList[0].Year1,
            'SalesPriceYear2': $scope.CPYearList[0].Year2,
            'SalesPriceYear3': $scope.CPYearList[0].Year3,
            'SalesValueYear1': $scope.CPYearList[1].Year1,
            'SalesValueYear2': $scope.CPYearList[1].Year2,
            'SalesValueYear3': $scope.CPYearList[1].Year3,
            'SalesVolumeYear1': $scope.CPYearList[2].Year1,
            'SalesVolumeYear2': $scope.CPYearList[2].Year2,
            'SalesVolumeYear3': $scope.CPYearList[2].Year3,
            //SOCB LRMS change
            'CostYear1': vm.Region == 'LATAM' ? $scope.CPYearList[3].Year1 : '',
            'CostYear2': vm.Region == 'LATAM' ? $scope.CPYearList[3].Year2 : '',
            'CostYear3': vm.Region == 'LATAM' ? $scope.CPYearList[3].Year3 : '',
            'GrossProfitYear1': vm.Region == 'LATAM' ? $scope.CPYearList[4].Year1 : '',
            'GrossProfitYear2': vm.Region == 'LATAM' ? $scope.CPYearList[4].Year2 : '',
            'GrossProfitYear3': vm.Region == 'LATAM' ? $scope.CPYearList[4].Year3 : '',
            //EOCB LRMS change
            'SourceLocallyDetails': vm.CPSourceLocallyDetails,
            'MaketoOrder': vm.CPMTOSelect,
            'Reactivation_Request': vm.CPReactivation_Request,
            'AGI_Code_Reactivate': vm.CPAGI_Code_Reactivate,
            'FirstName': (vm.hdnFirstNameOrg != null) ? vm.hdnFirstNameOrg : '',
            'LastName': (vm.hdnLastNameOrg != null) ? vm.hdnLastNameOrg : '',
            'UserId': (vm.hdnUserIdOrg != null) ? vm.hdnDomainOrg + '//' + vm.hdnUserIdOrg : '',
            'Email': (vm.hdnEmailOrg != null) ? vm.hdnEmailOrg : '',
            'SecondUserFirstName': (vm.hdnFirstNameReg != null) ? vm.hdnFirstNameReg : '',
            'SecondUserLastName': (vm.hdnLastNameReg != null) ? vm.hdnLastNameReg : '',
            'SecondUserId': (vm.hdnUserIdReg != null) ? vm.hdnDomainReg + '//' + vm.hdnUserIdReg : '',
            'SecondUserEmail': (vm.hdnEmailReg != null) ? vm.hdnEmailReg : '',
            //SOCB - LRMS change - Submit Request to procurement Manager
            'ProcMgrFirstName': (vm.Region == 'LATAM' && vm.ProcMgrFirstName != null) ? vm.ProcMgrFirstName : '',
            'ProcMgrLastName': (vm.Region == 'LATAM' && vm.ProcMgrLastName != null) ? vm.ProcMgrLastName : '',
            'ProcMgrUserId': (vm.Region == 'LATAM' && vm.ProcMgrID != null) ? vm.ProcMgrID : '',
            'ProcMgrEmail': (vm.Region == 'LATAM' && vm.ProcMgrEmail != null) ? vm.ProcMgrEmail : '',
            //EOCB - LRMS change - Submit Request to procurement Manager
        }
        if (CPRequestSelected) {
            $http({
                url: "CombiPackFormD/SaveorsubmitCombi",
                method: 'POST',
                data: CPRequestSelected,
                contentType: "application/json;",
                dataType: "json"
            }).success(function (data) {
                //debugger;
                if (data != 0) {
                requestID = data;
                localStorage.setItem('name', requestID);
                localStorage.setItem('type', requestTypeName);
                if (go == 'go') {
                    $http.get("NewPackRequest/GetNextPage?requestId=" + requestID + "&requestType=Combi Pack&tabCode=CMBI")
                    .success(function (data) {
                        console.log(data);
                        $scope.SaveAndGo(data);
                    })
                    return;
                }
                    //SOCB - LRMS change - Submit Request to Procurement Manager
                else if (go == 'ProcMgr') {
                        $http.get("NewPackRequest/SubmitToProcurementMgr?reqId=" + requestID + "&requestType=Combi Pack")
                               .success(function (data) {
                                   vm.getRequiredPage(data, copy, FromSave);
                                   vm.subMenu = true;
                               });      
                }
                    //EOCB - LRMS change - Submit Request to Procurement Manager
                else {
                    vm.getRequiredPageForCombiPack();
                }
                vm.subMenu = true;
                $rootScope.$broadcast('SCRNameto-requestID', requestID);
                }
                else {
                    $state.go('errorPage', { ErrorNo: data, ErrorMessage: 'Error occured in SaveorsubmitCombi method' });
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: data, ErrorMessage: 'Error occured in SaveorsubmitCombi for CombipackformD of SCRRequest.JS' });
            })
        } else {
            $state.go('errorPage', { ErrorNo: data, ErrorMessage: 'Error occured in SaveorsubmitCombi for CombipackformD of SCRRequest.JS' })
        }
    }

/***************************************************************************************************/
//GAL picker related function which will return user details
/***************************************************************************************************/
    //For orginator contact
    vm.openOrg = function () {
        var a, b, c, d, e, f, g;
        var userDetails = PickAdd(a, b, c, d, e, f, '0', g);
        vm.hdnDomainOrg = userDetails.Domain;
        vm.hdnUserIdOrg = userDetails.UserId;
        vm.OrginatorOrg = userDetails.FirstName + " " + userDetails.LastName;
        vm.hdnFirstNameOrg = userDetails.FirstName;
        vm.hdnEmailOrg = userDetails.Email;
        vm.hdnLastNameOrg = userDetails.LastName;

        if (requestType == 2 || requestType == 3) {
            vm.originatorIdName = vm.OrginatorOrg;
        }
        if (requestType == 6) {
            vm.PFROriginator = vm.OrginatorOrg;
        }
        if (requestType == 1 || requestType == 8) {
            vm.EPTgetNotOriginator = vm.OrginatorOrg;
        }
        if (requestType == 7) {
            vm.othgetNotOriginator = vm.OrginatorOrg;
        }
        if (requestType == 4) {
            vm.SCGetNotOrgData = vm.OrginatorOrg;
        }
        if (requestType == 5) {
            vm.CPOriginator = vm.OrginatorOrg;
        }
    }

    //For regulatory contact
    vm.openReg = function () {
        var a, b, c, d, e, f, g;
        var userDetails = PickAdd(a, b, c, d, e, f, '0', g);
        vm.hdnDomainReg = userDetails.Domain;
        vm.hdnUserIdReg = userDetails.UserId;
        vm.OrginatorReg = userDetails.FirstName + " " + userDetails.LastName;
        vm.hdnFirstNameReg = userDetails.FirstName;
        vm.hdnEmailReg = userDetails.Email;
        vm.hdnLastNameReg = userDetails.LastName;

        if (requestType == 2 || requestType == 3) {
            vm.GetRegulatoryContact = vm.OrginatorReg;
        }
        if (requestType == 6) {
            vm.PFRgetRegulatoryContact = vm.OrginatorReg;
        }
        if (requestType == 1 || requestType == 8) {
            vm.EPTgetRegContact = vm.OrginatorReg;
        }
        if (requestType == 5) {
            vm.RegContact = vm.OrginatorReg;
        }
    }

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
        vm.RegContactID = userDetails.Domain + "\\" + userDetails.UserId;
    }

    vm.openGALProcMgr = function () {

        var a, b, c, d, e, f, g;

        var userDetails = PickAdd(a, b, c, d, e, f, '0', g);
        console.log(h.FirstName);

        vm.ProcMgrDomain = userDetails.Domain;
        vm.ProcMgrUserId = userDetails.UserId;
        vm.ProcMgrName = userDetails.FirstName + " " + userDetails.LastName;
        vm.ProcMgrFirstName = userDetails.FirstName;
        vm.ProcMgrEmail = userDetails.Email;
        vm.ProcMgrLastName = userDetails.LastName;
        vm.ProcMgrID = userDetails.Domain + "\\" + userDetails.UserId;

    }
/***************************************************************************************************/
//Submit button related parameters for all request types
/***************************************************************************************************/
    //SOCB - LRMS change - Submit Request to Procurement Manager
    vm.SubmitToProcurementMgr = function () {
        vm.saveSubmenu('ProcMgr');
    };
    //EOCB - LRMS change - Submit Request to Procurement Manager
    vm.touploadData = function () {
        vm.saveSubmenu('go');
    };

    vm.PFRSubmit = function () {
        vm.savePFRMenu('go');
    };

    vm.EPTSubmit = function () {
        vm.saveEPTMenu('1');
    };

    vm.OtherSubmit = function () {
        vm.saveOtherMenu('go');
    };

    vm.SCSunbmit = function () {
        vm.saveSCMenu('go');
    }

    vm.CPSubmit = function () {
        vm.saveCPMenu('go');
    }

/***************************************************************************************************/
//On click of COPY - EPT - Set parameter to be used in SAVE and SUBMIT later
/***************************************************************************************************/
    //EPT on click of copy set parameter to use in save and submit and pass those
    vm.EPTCopy = function () {
        vm.ifEPTCopyChecked = true;
        vm.getRequiredPageForEPT(requestID, -1);
        vm.disableCopy = true;
    }

    vm.OnClickCopyTbl = function (ReqID) {
        $state.go("SupplyChainRequest.request", { ifGetBoth: 'FromEPTCopyTBL', rqType: 'EPT-Copy', req: ReqID });
    }
/***************************************************************************************************/
//Redirection from COMBI PACK -  Child elements
/***************************************************************************************************/
    vm.elementNoToRedirect = function (r) {
        if (r) {
            var a;
            var b;
            if (r == '1') {
                a = vm.CPElement1RequestType;
                b = vm.CPElement1RangeReqNo;
            } else if (r == '2') {
                a = vm.CPElement2RequestType;
                b = vm.CPElement2RangeReqNo;
            } else if (r == '3') {
                a = vm.CPElement3RequestType;
                b = vm.CPElement3RangeReqNo;
            } else if (r == '4') {
                a = vm.CPElement4RequestType;
                b = vm.CPElement4RangeReqNo;
            }
        }
        $scope.getRdToOWnPage = '10001';  //only if we get redirect from combi pack to contry add
        $state.go("SupplyChainRequest.request", { ifGetBoth: $scope.getRdToOWnPage, rqType: a, req: b });
    }


    //	console.log("selectChange" + vm.optionChecked);
    //$scope.thisTestTimeChange = function () {
    //    if (vm.time2) {
    //        vm.time2 = new Date(vm.time2);
    //    }
    //}

/***************************************************************************************************/
//Table calculation - For 3rd row - In Newpack, Country add and Combipack
/***************************************************************************************************/
    $scope.countForTotalSalesValue = function (q, List) {
        if (List == 'a') {
            var myList = vm.getTableDetail;
        } else if (List == 'b') {
            var myList = $scope.CPYearList;
        }
        if (q == '1') {
            myList[2].Year1 = parseFloat(myList[0].Year1 * myList[1].Year1) * 1000;
            myList[4].Year1 = parseFloat(myList[2].Year1) / parseFloat(myList[3].Year1);
        }
        if (q == '2') {
            myList[2].Year2 = parseFloat(myList[0].Year2 * myList[1].Year2) * 1000;
            myList[4].Year2 = parseFloat(myList[2].Year2) / parseFloat(myList[3].Year2);
        }
        if (q == '3') {
            myList[2].Year3 = parseFloat(myList[0].Year3 * myList[1].Year3) * 1000;
            myList[4].Year3 = parseFloat(myList[2].Year3) / parseFloat(myList[3].Year3);
        }
    };

/***************************************************************************************************/
//Text area enabling/hiding based on values selected in dropdown - example like comments
/***************************************************************************************************/
    //EPT on LeadAI change
    vm.EPTLeadAI = function () {
        if (vm.EPTgetLeadAI == 'SELECT') {
            vm.EPTgetAltLeadAIenable = false;
        }
        else {
            vm.EPTgetAltLeadAI = '';
            vm.EPTgetAltLeadAIenable = true;
        }
    }

    vm.EPTCommentChange = function () {
        if(vm.optionChecked == 25)
        { vm.showTextarea = false;}
        else { vm.showTextarea = true; }
    }
    vm.SelectChangeFunc = function (a) {
        if (a !== '25') {
            vm.showTextarea = true;
        } else {
            vm.showTextarea = false;
        }
    }

    vm.checkForWYBSIL = function () {
        console.log('1 ' + vm.SourceLocally);
        vm.SourceLocally = !vm.SourceLocally;
        console.log('2 ' + vm.SourceLocally);
        if (vm.SourceLocally) {
            if (vm.SourceLocally == true) {
                vm.checkForWYBSILValue = false;
            } else {
                vm.checkForWYBSILValue = true;
            }
        }
    };

    $scope.InputRepeat = [];
    var i = 0;
    $scope.add = function () {
        var InputRepeat = {}
        i = i + 1;
        $scope.Inputid = i;
        InputRepeat.repeatID = i - 1;
        $scope.InputRepeat.push(InputRepeat);
        console.log('Inputid1：' + $scope.Inputid);
    }

    //$scope.changeAddTable = function (r) {

    //};

    $scope.del = function (index, r) {
        i = i - 1;
        $scope.Inputid = i;
        $scope.InputRepeat.splice(index, 1);
        console.log('Inputid2：' + r);
    }

    //jim add start
    $scope.CountryArray = [{
        id: 0,
        name: 'Select',
    }, {
        id: 1,
        name: 'Yes',
    }, {
        id: 2,
        name: 'No',
    }];

/***************************************************************************************************/
//Functions related to LookUp Presentation code popup
/***************************************************************************************************/
    $scope.items = ['html5', 'jq'];
    $scope.LookPresentationCode = function (size) { //打开模态 
       
        var modalInstance = $modal.open({
            templateUrl: 'myModelContentscrr.html', //指向上面创建的视图
            controller: 'ModalInstanceCtrlscrr', // 初始化模态范围
            size: size, //大小配置
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        })
        modalInstance.result.then(function (selectedItem) {
            $scope.Modelselected = selectedItem;
            console.log("$scope.selected1111:" + $scope.Modelselected);
            if (requestType == '2' || requestType == '3') {
                vm.GetCountryPresCode = $scope.Modelselected;
            } else if (requestType == '1') {
                vm.EPTgetCountryPresCode = $scope.Modelselected;
            } else if (requestType == '6') {
                vm.PFRgetCountryPresCode = $scope.Modelselected;
            } else if (requestType == '7') {
                vm.othgetCountryPresCode = $scope.Modelselected;
            } else if (requestType == '5') {
                vm.CPCombiPresCode = $scope.Modelselected;
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date())
        })
    }
});

angular.module('ERMS').controller('ModalInstanceCtrlscrr', function ($scope, $modalInstance, items, $modal, $log, $http) { //依赖于modalInstance
    var vm = this;
    $scope.items = items;

    $http({
        url: "LookUpPresCode/LookUpPresDetails/",
        method: 'POST',
    }).success(function (data) {
       
        $scope.CountryLabel = data.GetCountrySpecificLabel;
        $scope.CusotmerLabel = data.GetCustomerSpecificLabel;
        $scope.PresCode = data.GetPresCodeDropdown;
    }).error(function (data) {
      
        console.log("error" + data);
    });

    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.showSndLookUp = false;
    $scope.showThdLoopUp = false;
    $scope.showFthLoopUp = false;
    $scope.showSndLookUpSnd = false;

    $scope.Country = function (CountryData) {
        console.log("CountryData" + CountryData);
        if (CountryData == 1) {
            $scope.showSndLookUp = true;
            $scope.showThdLoopUp = false;
            $scope.showFthLoopUp = false;
            $scope.showSndLookUpSnd = false;
        } else if (CountryData == 2) {
            $scope.showSndLookUpSnd = true;
            $scope.showSndLookUp = false;
            $scope.showThdLoopUp = false;
            $scope.showFthLoopUp = true;
        } else {
            $scope.showSndLookUp = false;
            $scope.showThdLoopUp = false;
            $scope.showSndLookUpSnd = false;
            $scope.showFthLoopUp = false;
        }
    }

    $scope.SndCountry = function (r) {
        console.log("CountryData Second = " + r);
        if (r == 1) {
            $scope.showThdLoopUp = true;
            $scope.showFthLoopUp = true;
            $scope.PresData = '';
        } else {
            $scope.showThdLoopUp = false;
            $scope.showFthLoopUp = true;
            $scope.PresData = 'Use Syngenta Presentation Code';
        }
    }

    $scope.ChangePresData = function (r) {
        if (r) {
            $scope.PresData = 'Customer Specific Label for ' + r;
        }
    };

    $scope.PresDataIntl = function (r) {
        if (r) {
            for (var i = 0; i < $scope.PresCode.length; i++) {
                if ($scope.PresCode[i].Value = r) {
                    var c = $scope.PresCode[i].Text;
                    $scope.PresData = 'Use INTL. Code ' + c;
                }
        }
    }
    };

    $scope.ok = function (r) {
        console.log("$scope.selected:" + r);
        $modalInstance.close(r); //关闭并返回当前选项
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel'); // 退出
    }



})