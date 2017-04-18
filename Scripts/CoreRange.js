angular.module('ERMS').controller("coreRangeCtrl", function ($scope, $state, $http, $stateParams) {
    var coreRange = this;

    var dataType = $stateParams.direct;
    if (dataType == '0') {
        coreRange.pageId = dataType;
        coreRange.PackCollation = false;
    }
    else {        
        coreRange.pageId = 1;
        coreRange.PackCollation = true;
        }   

    $scope.$watch('getValidData', function () {
        if ($scope.getValidData == true) {
            console.log("! = 1" + $scope.getValidData);
            coreRange.showLoadingPage = false;
        }
        else {
            console.log("! = 0" + $scope.getValidData);
            coreRange.showLoadingPage = true;
            $scope.getValidData = false;
        }
    });

    coreRange.PageRedirection = function () {
        //if (dataType == '0') {
        //    coreRange.PackCollation = false;
        //    coreRange.btnAddNewPack = true;
        //    coreRange.packSizeNote = true;
        //    coreRange.newCombiPack = true;
        //    coreRange.pageId = dataType;
        //} else {
        //    coreRange.PackCollation = true;
        //    coreRange.btnAddNewPack = false;
        //    coreRange.packSizeNote = false;
        //    coreRange.newCombiPack = false;
        //    coreRange.pageId = 1;
        //}
    }
    //Method to initialize the selected values in the controls on Page Load
    coreRange.initData = function () {        
        coreRange.coreRangeDetails = '';
        coreRange.pageTableRepeat = '';
        coreRange.leadAI = '';
        coreRange.selectedLeadAI = { Value: "SELECT" };
        coreRange.selectedFormulation = { Value: "SELECT" };
    }
    
    //Method to reset the  controls 
    coreRange.resetControls = function () {
        coreRange.note = false;
        coreRange.LinkShow = false;
        coreRange.showSelect = true;        
        coreRange.formulation = '';
        coreRange.coreRangeDetails = '';
        coreRange.PLS = '';
        coreRange.sector = '';
        coreRange.category = '';
        coreRange.phaseOutDate = '';
        coreRange.records = '';
        coreRange.selectedFormulation = { Value: "SELECT" };
        coreRange.coreRangeDetails = '';
        coreRange.pageTableRepeat = '';
        coreRange.leadAIText = '';
        coreRange.formulationText = '';        
        coreRange.thirdPartyNote = false;
        coreRange.showCombiPackResults = false;
        coreRange.btnAddNewPack = false;
        coreRange.newCombiPack = false;
    }


    coreRange.initData();
    //coreRange.resetControls();

    //Method call to load Lead AI on Page Load
    $http({
        url: "CoreRange/GetLeadAI?direct=" + coreRange.pageId,
        method: 'POST',
    }).success(function (data) {
        if (data.ErrorBE) {
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
        }
        else {
            $scope.getValidData = true;
            coreRange.resetControls();
            coreRange.leadAI = data.LeadAIList;
            coreRange.selectedLeadAI = { Value: "SELECT" };
            if (coreRange.leadAIText == "THIRD PARTY" && coreRange.pageId != 1) {
                //coreRange.newCombiPack = false;
                coreRange.thirdPartyNote = true;
            }
        }
        
    }).error(function (data) {
        console.log("error" + data);
        $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in Corerange.JS' });
    })

    //Method call to get Formulations for the selected LeadAI
    coreRange.getFormulation = function () {
        coreRange.resetControls();

        var leadAIText = coreRange.selectedLeadAI.Text;
        var leadAIValue = coreRange.selectedLeadAI.Value.split("-")[0];
        var index = coreRange.selectedLeadAI.Value.indexOf("-");

        coreRange.leadAIText = leadAIText;

        if (leadAIValue == "1" && coreRange.pageId != 1) {
            localStorage.removeItem("name");
            localStorage.removeItem("type");
            $state.go("SupplyChainRequest.request", { leadAI: '1', isNew: '1', rqType: '2' });           
        }

        else {
            if (coreRange.selectedLeadAI == null && coreRange.leadAIText == "SELECT") {
                coreRange.LinkShow = false;
                coreRange.showSelect = true;
                coreRange.selectedFormulation = null;
                coreRange.showSearchResult = false;
            } else {
                coreRange.LinkShow = true;
                coreRange.showSelect = false;
                console.log(coreRange.showSelect);
                coreRange.selectedFormulation = null;
                coreRange.showSearchResult = false;
            }
            $http({
                url: "CoreRange/GetFormulationForLeadAI?leadAIValue=" + coreRange.selectedLeadAI.Value,
                method: 'POST',
            }).success(function (data) {
                if (data.ErrorBE) {
                    $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
                }
                else {
                    coreRange.note = false;
                    if (index > 0 && coreRange.pageId != 1 && leadAIText.toUpperCase() == 'THIRD PARTY') {
                        coreRange.btnAddNewPack = true;
                        coreRange.newCombiPack = false;
                        coreRange.thirdPartyNote = true;
                    }
                    coreRange.formulation = data.Formulation;

                    coreRange.selectedFormulation = { Value: "SELECT" };
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in CorerangeJS' });
            })
        }
    }

    //Method to get core range details for the selected LeadAI and formulation
    coreRange.getCoreRangeDetails = function () {
        coreRange.thirdPartyNote = false;
        if (coreRange.selectedFormulation == null || coreRange.selectedFormulation == undefined) {
            coreRange.showSearchResult = false;
        } else {
            var leadAI = coreRange.selectedLeadAI.Value.split("-")[0];
            var note = '';
            var formulationText = '';
            var indexEPT;

            var formulationValue = coreRange.selectedFormulation.Value;
            if (formulationValue != null && formulationValue != undefined && formulationValue != '' && formulationValue != 'SELECT') {
                note = coreRange.selectedFormulation.Value.split("-")[2];
                coreRange.formulationText = coreRange.selectedFormulation.Text;
                var len = coreRange.selectedFormulation.Text.split("-").length;
                coreRange.EPTCheck = coreRange.selectedFormulation.Text.split("-")[len - 1];
                coreRange.LinkShow = false;
                indexEPT = coreRange.selectedFormulation.Text.indexOf("EPT product launch");
            }
            else {
                coreRange.LinkShow = true;
                formulationValue = 'SELECT';
            }

            $http({
                url: "CoreRange/GetCoreRangeDetails?selectedleadAI=" + leadAI + "&selectedformulation=" + formulationValue,
                method: 'POST',
            }).success(function (data) {
                if (data.ErrorBE) {
                    $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
                }
                else {
                    coreRange.showSearchResult = false;
                    coreRange.showCombiPackResults = false;
                    coreRange.coreRangeDetails = data.PackDetails;
                    if (coreRange.coreRangeDetails)
                    {
                        if(coreRange.coreRangeDetails[0].PACKDESC == 'Dummy')
                        {
                            coreRange.PackCollation = true;
                        }
                        else
                        {
                            coreRange.PackCollation = false;
                        }
                    }
                    coreRange.PLS = data.CoreRange.PLS;
                    coreRange.sector = data.CoreRange.Sector;
                    coreRange.category = data.CoreRange.Category;
                    coreRange.phaseOutDate = data.CoreRange.PhaseOutDate;

                    if (data.CombiPack != null && data.CombiPack.length > 0) {
                        coreRange.combiPackRepeat = data.CombiPack;
                        coreRange.showCombiPackResults = true;
                    }

                    if (coreRange.EPTCheck == " EPT product launch ")
                    { coreRange.note = true; }
                    else { coreRange.note = false; }

                    if (note == 1) {
                        coreRange.packSizeNote = false;
                    }
                    else {
                        coreRange.packSizeNote = true;
                        coreRange.btnAddNewPack = true;
                    }

                    if (coreRange.pageId == "1") {
                        coreRange.btnAddNewPack = false;
                        coreRange.newCombiPack = false;
                        coreRange.packSizeNote = false;
                    }
                    else if (coreRange.coreRangeDetails != null) {
                        if (note != 1) {
                            coreRange.packSizeNote = true;
                        }
                        else { coreRange.packSizeNote = false; }
                    }
                    else { coreRange.packSizeNote = false; }

                    if (coreRange.pageId != "1") {
                        if (coreRange.selectedLeadAI.Text.toUpperCase() != 'THIRD PARTY') {
                            if (coreRange.category == '' || coreRange.category.toUpperCase() == 'GROWTH' || coreRange.category.toUpperCase() == 'VALUE' || coreRange.category.toUpperCase() == 'CASH' || coreRange.category.toUpperCase() == 'PHASE OUT') {
                                coreRange.btnAddNewPack = true;
                                coreRange.newCombiPack = true;
                            }
                            else {
                                coreRange.btnAddNewPack = false;
                                coreRange.newCombiPack = false;
                            }
                        }
                        else {
                            coreRange.btnAddNewPack = false;
                            coreRange.newCombiPack = false;
                            coreRange.thirdPartyNote = false;
                        }
                    }

                    if (coreRange.coreRangeDetails != null) {
                        if (indexEPT > -1 && coreRange.pageId != "1") {
                            if (coreRange.coreRangeDetails[0]["PackCollation"] != '-1x-1G') {
                                coreRange.btnAddNewPack = false;
                                coreRange.newCombiPack = false;
                            }
                        }

                        if (coreRange.coreRangeDetails[0]["PackCollation"] == '-1x-1G' && coreRange.pageId != "1") {
                            coreRange.packSizeNote = false;
                        }

                        //coreRange.btnPackCollation = true;
                        coreRange.records = coreRange.coreRangeDetails.length;
                        coreRange.showSearchResult = true;
                        coreRange.pageSize = 5;
                        coreRange.pages = Math.ceil(coreRange.coreRangeDetails.length / coreRange.pageSize);
                        console.log("!! + " + coreRange.pages);
                        coreRange.newPages = coreRange.pages > 5 ? 5 : coreRange.pages;
                        coreRange.pageList = [];
                        coreRange.selPage = 1;

                        coreRange.setData = function () {
                            coreRange.pageTableRepeat = coreRange.coreRangeDetails.slice((coreRange.pageSize * (coreRange.selPage - 1)), (coreRange.selPage * coreRange.pageSize));
                        }

                        coreRange.pageTableRepeat = coreRange.coreRangeDetails.slice(0, coreRange.pageSize);
                        for (var i = 0; i < coreRange.newPages; i++) {
                            coreRange.pageList.push(i + 1);
                        }
                        coreRange.selectPage = function (page) {
                            if (page < 1 || page > coreRange.pages) return;
                            if (page > 2) {
                                var newpageList = [];
                                for (var i = (page - 3) ; i < ((page + 2) > coreRange.pages ? coreRange.pages : (page + 2)) ; i++) {
                                    newpageList.push(i + 1);
                                }
                                coreRange.pageList = newpageList;
                            }
                            coreRange.selPage = page;
                            coreRange.setData();
                            coreRange.isActivePage(page);
                            console.log("page is：" + page);
                        };
                    }
                    else {
                        coreRange.btnAddNewPack = false;
                        coreRange.packSizeNote = false;
                        coreRange.LinkShow = false;
                    }
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in CorerangeJS' });
                coreRange.showSearchResult = false;
                coreRange.newCombiPack = false;
            })            
        }
    }

    //Pagination Code
    coreRange.isActivePage = function (page) {
        return coreRange.selPage == page;
    };

    $scope.Previous = function () {
        coreRange.selectPage(coreRange.selPage - 1);
    }

    $scope.Next = function () {
        coreRange.selectPage(coreRange.selPage + 1);
    };
    //Pagination COde End

    //Method to add New Pack Request
    coreRange.addNewPackRequest = function () {
        var leadAIValue = coreRange.selectedLeadAI.Value.split("-")[0];
        var formulation = '';
        if (coreRange.formulationText != '' && coreRange.formulationText != undefined && coreRange.formulationText != null && coreRange.leadAIText.toUpperCase() != "THIRD PARTY") {
            formulation = coreRange.formulationText;
        }

        localStorage.removeItem("name");
        localStorage.removeItem("type");
        $state.go("SupplyChainRequest.request", { leadAI: leadAIValue, isNew: '1', rqType: '2', leadAIText: coreRange.leadAIText, Formulation: formulation });
    };

    coreRange.newCombiPackRequest = function () {
        var leadAIValue = coreRange.selectedLeadAI.Value.split("-")[0];
        $state.go("CombiPHome", { leadAI: leadAIValue });
    };

    coreRange.getCombiPackForLeadAI = function () {
        coreRange.selectedFormulation = "SELECT";
        coreRange.getCoreRangeDetails();
    };

    coreRange.NewPackCollationReq = function (columnValues) {
        localStorage.removeItem("name");
        localStorage.removeItem("type");
        var leadAIValue = coreRange.selectedLeadAI.Value.split("-")[0];
        var leadAIText = coreRange.selectedLeadAI.Text;

        $state.go("SupplyChainRequest.request", { leadAI: leadAIValue, isNew: '1', rqType: '3', leadAIText: coreRange.leadAIText, Formulation: coreRange.formulationText, ancillaries: columnValues.ANCILLARIES, category: coreRange.category, pls: coreRange.PLS, bottleSize: columnValues.CONFIGURATION, NSU: columnValues.NSU, sPack: columnValues.IsSynBrdPack, req: 0 });
    };
})

