angular.module('ERMS').controller("NewCombiRequestCtrl", function ($scope, $state, $modal, $log, $stateParams, $http) {
    var vm = this;
/*********************************************************************************************************/
//Redirection to create Combi pack request from combipack home. Population of controls based on selection
/*********************************************************************************************************/
    var LeadAIValue = $stateParams.LeadAIValue;
    var LeadAIText = $stateParams.LeadAIText;
    var fomulation = $stateParams.fomulation;
    $scope.showFirstPart = false;
    $scope.showSecondPart = false;
    $scope.showThirdPart = false;
    vm.showLoadingPage = false;

    $scope.$watch('getValidData', function () {
        if ($scope.getValidData == true) {
            console.log("! = 1" + $scope.getValidData);
            vm.showLoadingPage = false;
        }
        else {
            console.log("! = 0" + $scope.getValidData);
            vm.showLoadingPage = true;
            $scope.getValidData = false;
        }
    });

/*********************************************************************************************************/
//Initialization of values, enabling of controls based on No. of formulation
/*********************************************************************************************************/
    vm.getProductLine = '';
    vm.getCountrySale = '';
    vm.productCaty = '';
    vm.getLeaAIFst = '0';
    vm.getLeaAISnd = '0';
    vm.getLeaAIThd = '';
    vm.getLeaAIFth = '';
    vm.SYNBrandedPackFst = '';
    vm.SYNBrandedPackSnd = '';
    vm.SYNBrandedPackThd = '';
    vm.SYNBrandedPackFth = '';
    vm.getProductLineFst = '';
    vm.getProductLineSnd = '';
    vm.getProductLineThd = '';
    vm.getProductLineFth = '';
    vm.salesExistFst = '';
    vm.salesExistSnd = '';
    vm.salesExistThd = '';
    vm.salesExistFth = '';

    switch (fomulation) {
        case '2':
            $scope.showFirstPart = true;
            break;
        case '3':
            $scope.showFirstPart = true;
            $scope.showSecondPart = true;
            break;
        case '4':
            $scope.showFirstPart = true;
            $scope.showSecondPart = true;
            $scope.showThirdPart = true;
            break;
        default:
            break;
    }

/*********************************************************************************************************/
//Get formulation dropdown details based on Lead AI selection
/*********************************************************************************************************/
    $scope.checkAIValue = function (r, q) {
        $scope.GetFormulation = [];
        //debugger;
        if (q != '' && q) {
            $http({
                url: "CombiPackRequest/CombipackFormulation?intLeadAIId=" + q + "&strLeadAICtlId=" + r,
                method: 'POST',
                //data: { "RequestID": NewRequestID, "ReqType": requestType, "Copy": Copy, "FromSave": FromSave },
                //contentType: "application/json;",
                //dataType: "json"
            }).success(function (data) {
                if (data.ErrorBE) {
                    $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
                }
                else {
                    console.log("get data for leadAI = " + JSON.stringify(data.GetFormulation));
                    $scope.GetFormulation = data.GetFormulation;
                    if (r == '1') {
                        $scope.GetFormulationFst = $scope.GetFormulation;
                        vm.checkFomulationFst = '0';
                    } else if (r == '2') {
                        $scope.GetFormulationSnd = $scope.GetFormulation;
                        vm.checkFomulationSnd = '0';
                    } else if (r == '3') {
                        $scope.GetFormulationThd = $scope.GetFormulation;
                        vm.checkFomulationThd = '0';
                    } else if (r == '4') {
                        $scope.GetFormulationFth = $scope.GetFormulation;
                        vm.checkFomulationFth = '0';
                    }
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in checkAIValue method of newCombiRequest-JS' });
            });
        }
    };

/*********************************************************************************************************/
//Get pack size dropdown details based on Formulation selection
/*********************************************************************************************************/
    $scope.checkPackSizeFst = function (r, q) {
        console.log("!!!!!!!!!!!!!" + r + q);
        if (q != '' && q) {
            $http({
                url: "CombiPackRequest/Combipackpacksize?intFormulationId=" + q + "&strFormulationCtlId=" + r,
                method: 'POST',
                //data: { "RequestID": NewRequestID, "ReqType": requestType, "Copy": Copy, "FromSave": FromSave },
                //contentType: "application/json;",
                //dataType: "json"
            }).success(function (data) {
                if (data.ErrorBE) {
                    $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
                }
                else {
                    console.log("get data for leadAI = " + JSON.stringify(data.GetFormulation));
                    $scope.GetPackSize = data.GetPackSize;
                    if (r == '1') {
                        $scope.GetPackSizeFst = $scope.GetPackSize;
                        vm.checkPackSizeFst = '0';
                    } else if (r == '2') {
                        $scope.GetPackSizeSnd = $scope.GetPackSize;
                        vm.checkPackSizeSnd = '0';
                    } else if (r == '3') {
                        $scope.GetPackSizeThd = $scope.GetPackSize;
                        vm.checkPackSizeThd = '0';
                    } else if (r == '4') {
                        $scope.GetPackSizeFth = $scope.GetPackSize;
                        vm.checkPackSizeFth = '0';
                    }
                }
            }).error(function (data) {
                console.log("error" + data);
                $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in checkPackSizeFst method of newCombiRequest-JS' });
            });
        }
    }

/*********************************************************************************************************/
//Get dropdown details on page load
/*********************************************************************************************************/
    $http({
        url: "CombiPackRequest/Combipack?iNoOfFormulation=" + fomulation,
        method: 'POST',
        //data: { "RequestID": NewRequestID, "ReqType": requestType, "Copy": Copy, "FromSave": FromSave },
        //contentType: "application/json;",
        //dataType: "json"
    }).success(function (data) {
        if (data.ErrorBE) {
            $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: data.ErrorBE.ErrorMess });
        }
        else {
            $scope.getValidData = true;
            if (data) {
                $scope.GetCountryOfSale = data.GetCountryOfSale;
                $scope.GetLeadAI = data.GetLeadAI;
                $scope.GetProductCategory = data.GetProductCategory;
                $scope.GetProductLine = data.GetProductLine;
                $scope.GetSUExist = data.GetSUExist;
                $scope.GetUOM = data.GetUOM;
                //debugger;
                vm.getProductLine = '0';
                vm.getCountrySale = '0';
                vm.productCaty = '0';
                vm.GetUOMSelected1 = '0';
                vm.getLeaAIfst = '0';
                vm.SYNBrandedPackFst = '0';
                vm.getProductLineFst = '0';
                vm.salesExistFst = '0';
                vm.GetUOMSelected2 = '0';
                vm.getLeaAISnd = '0';
                vm.SYNBrandedPackSnd = '0';
                vm.getProductLineSnd = '0';
                vm.salesExistSnd = '0';
                vm.GetUOMSelected3 = '0';
                vm.getLeaAIThd = '0';
                vm.SYNBrandedPackThd = '0';
                vm.getProductLineThd = '0';
                vm.salesExistThd = '0';
                vm.GetUOMSelected4 = '0';
                vm.getLeaAIFth = '0';
                vm.SYNBrandedPackFth = '0';
                vm.getProductLineFth = '0';
                vm.salesExistFth = '0';
                vm.LeadAIValue = LeadAIValue;
                vm.LeadAIText = LeadAIText;
                vm.fomulation = fomulation;
                vm.LeadAITextEnable = true;
                //console.log("###############################" + $scope.GetLeadAI[$scope.getLoopText(vm.getLeaAIfst, $scope.GetLeadAI));
            }
            $scope.c = vm.elementConfiguration1 == '' || vm.elementConfiguration1 == undefined ? '' : vm.elementConfiguration1 + "x" + vm.elementQuantity1 + $scope.getLoopText(vm.GetUOMSelected1, $scope.GetUOM);
            $scope.d = vm.elementConfiguration2 == '' || vm.elementConfiguration2 == undefined ? '' : vm.elementConfiguration2 + "x" + vm.elementQuantity2 + $scope.getLoopText(vm.GetUOMSelected2, $scope.GetUOM);
            $scope.e = vm.elementConfiguration3 == '' || vm.elementConfiguration3 == undefined ? '' : vm.elementConfiguration3 + "x" + vm.elementQuantity3 + $scope.getLoopText(vm.GetUOMSelected3, $scope.GetUOM);
            $scope.f = vm.elementConfiguration4 == '' || vm.elementConfiguration4 == undefined ? '' : vm.elementConfiguration4 + "x" + vm.elementQuantity4 + $scope.getLoopText(vm.GetUOMSelected4, $scope.GetUOM);
            console.log($scope.c + "+" + $scope.d + "+" + $scope.e + "+" + $scope.f);
        }
    }).error(function (data) {
        console.log("error" + data);
        $state.go('errorPage', { ErrorNo: data.ErrorBE.ErrorNumber, ErrorMessage: 'Error occured in Combipack method of newCombiRequest-JS' });
    });

/*********************************************************************************************************/
//Get the value selected from various dropdown based on text selected
/*********************************************************************************************************/
    $scope.getLoopText = function (value, r) {
        if (value && r) {
            for (var i = 0; i < r.length; i++) {
                console.log(r[i].Value);
                if (value == r[i].Value)
                    {
                value = r[i].Value;
                return r[i].Text;
                }
            }
        }
    }


/*********************************************************************************************************/
//Get all the selected values and navigate to report view for combi pack before user creates requests
/*********************************************************************************************************/
    $scope.showSubmenu = function () {
        //var b = vm.productCaty == '' || vm.productCaty == undefined ? '' : $scope.getLoopText(vm.productCaty, $scope.GetProductCategory);
        $scope.c = vm.elementConfiguration1 == '' || vm.elementConfiguration1 == undefined ? '' : vm.elementConfiguration1 + "x" + vm.elementQuantity1 + $scope.getLoopText(vm.GetUOMSelected1, $scope.GetUOM);
        $scope.d = vm.elementConfiguration2 == '' || vm.elementConfiguration2 == undefined ? '' : vm.elementConfiguration2 + "x" + vm.elementQuantity2 + $scope.getLoopText(vm.GetUOMSelected2, $scope.GetUOM);
        $scope.e = vm.elementConfiguration3 == '' || vm.elementConfiguration3 == undefined ? '' : vm.elementConfiguration3 + "x" + vm.elementQuantity3 + $scope.getLoopText(vm.GetUOMSelected3, $scope.GetUOM);
        $scope.f = vm.elementConfiguration4 == '' || vm.elementConfiguration4 == undefined ? '' : vm.elementConfiguration4 + "x" + vm.elementQuantity4 + $scope.getLoopText(vm.GetUOMSelected4, $scope.GetUOM);
        getNewCombiRequestValue = {
            'quantity1': $scope.c,
            'quantity2': $scope.d,
            'quantity3': $scope.e,
            'quantity4': $scope.f,
            'elementConfiguration1':vm.elementConfiguration1,
            'elementConfiguration2':vm.elementConfiguration2,
            'elementConfiguration3':vm.elementConfiguration3,
            'elementConfiguration4':vm.elementConfiguration4,
            'elementQuantity1':vm.elementQuantity1,
            'elementQuantity2':vm.elementQuantity2,
            'elementQuantity3':vm.elementQuantity3,
            'elementQuantity4':vm.elementQuantity4,
            'elementUOM1':vm.GetUOMSelected1,
            'elementUOM2':vm.GetUOMSelected2,
            'elementUOM3':vm.GetUOMSelected3,
            'elementUOM4':vm.GetUOMSelected4,
            'leadAI1': vm.getLeaAIfst == '' || vm.getLeaAIfst == undefined ? '' : $scope.getLoopText(vm.getLeaAIfst, $scope.GetLeadAI),
            'leadAI2': vm.getLeaAISnd == '' || vm.getLeaAISnd == undefined ? '' : $scope.getLoopText(vm.getLeaAISnd, $scope.GetLeadAI),
            'leadAI3': vm.getLeaAIThd == '' || vm.getLeaAIThd == undefined ? '' : $scope.getLoopText(vm.getLeaAIThd, $scope.GetLeadAI),
            'leadAI4': vm.getLeaAIFth == '' || vm.getLeaAIFth == undefined ? '' : $scope.getLoopText(vm.getLeaAIFth, $scope.GetLeadAI),
            'leadAIID1':vm.getLeaAIfst,
            'leadAIID2':vm.getLeaAISnd,
            'leadAIID3':vm.getLeaAIThd,
            'leadAIID4':vm.getLeaAIFth,
            'formulation1': vm.checkFomulationFst == '' || vm.checkFomulationFst == undefined ? '' : $scope.getLoopText(vm.checkFomulationFst, $scope.GetFormulationFst),
            'formulation2': vm.checkFomulationSnd == '' || vm.checkFomulationSnd == undefined ? '' : $scope.getLoopText(vm.checkFomulationSnd, $scope.GetFormulationSnd),
            'formulation3': vm.checkFomulationThd == '' || vm.checkFomulationThd == undefined ? '' : $scope.getLoopText(vm.checkFomulationThd, $scope.GetFormulationThd),
            'formulation4': vm.checkFomulationFth == '' || vm.checkFomulationFth == undefined ? '' : $scope.getLoopText(vm.checkFomulationFth, $scope.GetFormulationFth),
            'formulationID1':vm.checkFomulationFst,
            'formulationID2':vm.checkFomulationSnd,
            'formulationID3':vm.checkFomulationThd,
            'formulationID4':vm.checkFomulationFth,
            'packSize1': vm.checkPackSizeFst == '' || vm.checkPackSizeFst == undefined ? '' : $scope.getLoopText(vm.checkPackSizeFst, $scope.GetPackSizeFst),
            'packSize2': vm.checkPackSizeSnd == '' || vm.checkPackSizeSnd == undefined ? '' : $scope.getLoopText(vm.checkPackSizeSnd, $scope.GetPackSizeSnd),
            'packSize3': vm.checkPackSizeThd == '' || vm.checkPackSizeThd == undefined ? '' : $scope.getLoopText(vm.checkPackSizeThd, $scope.GetPackSizeThd),
            'packSize4': vm.checkPackSizeFth == '' || vm.checkPackSizeFth == undefined ? '' : $scope.getLoopText(vm.checkPackSizeFth, $scope.GetPackSizeFth),
            'packSizeID1':vm.checkPackSizeFst,
            'packSizeID2':vm.checkPackSizeSnd,
            'packSizeID3':vm.checkPackSizeThd,
            'packSizeID4':vm.checkPackSizeFth,
            'productLine1': vm.getProductLineFst == '' || vm.getProductLineFst == undefined ? '' : $scope.getLoopText(vm.getProductLineFst, $scope.GetProductLine),
            'productLine2': vm.getProductLineSnd == '' || vm.getProductLineSnd == undefined ? '' : $scope.getLoopText(vm.getProductLineSnd, $scope.GetProductLine),
            'productLine3': vm.getProductLineThd == '' || vm.getProductLineThd == undefined ? '' : $scope.getLoopText(vm.getProductLineThd, $scope.GetProductLine),
            'productLine4': vm.getProductLineFth == '' || vm.getProductLineFth == undefined ? '' : $scope.getLoopText(vm.getProductLineFth, $scope.GetProductLine),
            'productLineID1':vm.getProductLineFst,
            'productLineID2':vm.getProductLineSnd,
            'productLineID3':vm.getProductLineThd,
            'productLineID4':vm.getProductLineFth,
            'tradeName1':vm.tradeNameFst,
            'tradeName2':vm.tradeNameSnd,
            'tradeName3':vm.tradeNameThd,
            'tradeName4':vm.tradeNameFth,
            'sUExist1': vm.SYNBrandedPackFst == '' || vm.SYNBrandedPackFst == undefined ? '' : $scope.getLoopText(vm.SYNBrandedPackFst, $scope.GetSUExist),
            'sUExist2': vm.SYNBrandedPackSnd == '' || vm.SYNBrandedPackSnd == undefined ? '' : $scope.getLoopText(vm.SYNBrandedPackSnd, $scope.GetSUExist),
            'sUExist3': vm.SYNBrandedPackThd == '' || vm.SYNBrandedPackThd == undefined ? '' : $scope.getLoopText(vm.SYNBrandedPackThd, $scope.GetSUExist),
            'sUExist4': vm.salesExistFth == '' || vm.salesExistFth == undefined ? '' : $scope.getLoopText(vm.salesExistFth, $scope.GetSUExist),
            'sUAgiCode1':vm.suAGICode1,
            'sUAgiCode2':vm.suAGICode2,
            'sUAgiCode3':vm.suAGICode3,
            'sUAgiCode4':vm.suAGICode4,
            'noOfFormulation':fomulation,
            'collationDesc':'',
            'combiPackLeadAI':vm.LeadAIText,
            'combiPackProductLine': vm.getProductLine == '' || vm.getProductLine == undefined ? '' : $scope.getLoopText(vm.getProductLine, $scope.GetProductLine),
            'combiPackTradeName': vm.getCPTradeName,
            'combiPackCountryOfSale' : vm.getCountrySale == '' || vm.getCountrySale == undefined ? '' : $scope.getLoopText(vm.getCountrySale, $scope.GetCountryOfSale),
            'combiPackPresentationCode':vm.presentationCode,
            'combiPackProductCategory':vm.productCaty,
            'leadAIID':LeadAIValue,
            'productLineID':vm.getProductLine,
            'countryID':vm.getCountrySale,
            'fillQuantity1':vm.fillQuantity1,
            'fillQuantity2':vm.fillQuantity2,
            'fillQuantity3':vm.fillQuantity3,
            'fillQuantity4':vm.fillQuantity4,
            'combiPackProductCategoryText': vm.productCaty == '' || vm.productCaty == undefined ? '' : $scope.getLoopText(vm.productCaty, $scope.GetProductCategory),
            'SelectedIsSynBrdPackReq1':vm.SYNBrandedPackFst,
            'SelectedIsSynBrdPackReq2':vm.SYNBrandedPackSnd,
            'SelectedIsSynBrdPackReq3':vm.SYNBrandedPackThd,
            'SelectedIsSynBrdPackReq4':vm.SYNBrandedPackFth,
        }
         if (getNewCombiRequestValue) {
            console.log("12222222" + typeof(getNewCombiRequestValue));
            localStorage.setItem('setNewCombiRequestValue', JSON.stringify(getNewCombiRequestValue));
            $state.go('CombiPackRequestReport');
        }
    }

/*********************************************************************************************************/
//Setting format for Collation description based on various values selected
/*********************************************************************************************************/
    $scope.changeQuatity1 = function (rrr) {
        $scope.c = vm.elementConfiguration1 == '' || vm.elementConfiguration1 == undefined ? '' : vm.elementConfiguration1 + "x" + vm.elementQuantity1 + $scope.getLoopText(vm.GetUOMSelected1, $scope.GetUOM);
        $scope.d = vm.elementConfiguration2 == '' || vm.elementConfiguration2 == undefined ? '' : vm.elementConfiguration2 + "x" + vm.elementQuantity2 + $scope.getLoopText(vm.GetUOMSelected2, $scope.GetUOM);
        $scope.e = vm.elementConfiguration3 == '' || vm.elementConfiguration3 == undefined ? '' : vm.elementConfiguration3 + "x" + vm.elementQuantity3 + $scope.getLoopText(vm.GetUOMSelected3, $scope.GetUOM);
        $scope.f = vm.elementConfiguration4 == '' || vm.elementConfiguration4 == undefined ? '' : vm.elementConfiguration4 + "x" + vm.elementQuantity4 + $scope.getLoopText(vm.GetUOMSelected4, $scope.GetUOM);
        vm.fomulation;
        vm.CollationDescription = $scope.c + "+" + $scope.d + "+" + $scope.e + '+' + $scope.f;
    }

    $scope.mathDoforCollection = function (r) {
        if (r == '1') {
            if (vm.elementConfiguration1 && vm.elementQuantity1 && vm.GetUOMSelected1) {
                $scope.collectionE1 = vm.elementConfiguration1 + 'X' + vm.elementQuantity1 + $scope.getLoopText(vm.GetUOMSelected1, $scope.GetUOM);
            } else {
                $scope.collectionE1 = '';
            }
        }
        if (r == '2') {
            if (vm.elementConfiguration2 && vm.elementQuantity2 && vm.GetUOMSelected2) {
                $scope.collectionE2 = vm.elementConfiguration2 + 'X' + vm.elementQuantity2 + $scope.getLoopText(vm.GetUOMSelected2, $scope.GetUOM); //vm.GetUOMSelected2;
            } else {
                $scope.collectionE2 = '';
            }
        }
        if (r == '3') {
            if (vm.elementConfiguration3 && vm.elementQuantity3 && vm.GetUOMSelected3) {
                $scope.collectionE3 = vm.elementConfiguration3 + 'X' + vm.elementQuantity3 + $scope.getLoopText(vm.GetUOMSelected3, $scope.GetUOM); //vm.GetUOMSelected3;
            } else {
                $scope.collectionE3 = '';
            }
        }
        if (r == '4') {
            if (vm.elementConfiguration4 && vm.elementQuantity4 && vm.GetUOMSelected4) {
                $scope.collectionE4 = vm.elementConfiguration4 + 'X' + vm.elementQuantity4 + $scope.getLoopText(vm.GetUOMSelected4, $scope.GetUOM);// vm.GetUOMSelected4;
            } else {
                $scope.collectionE4 = '';
            }
        }

        if ($scope.collectionE1 && $scope.collectionE2 && $scope.collectionE3 && $scope.collectionE4) {
            vm.CollationDescription = $scope.collectionE1 + "+" + $scope.collectionE2 + "+" + $scope.collectionE3 + "+" + $scope.collectionE4;
        } else if ($scope.collectionE1 && $scope.collectionE2 && $scope.collectionE3) {
            vm.CollationDescription = $scope.collectionE1 + "+" + $scope.collectionE2 + "+" + $scope.collectionE3;
        } else if ($scope.collectionE1 && $scope.collectionE2 && $scope.collectionE4) {
            vm.CollationDescription = $scope.collectionE1 + "+" + $scope.collectionE2 + "+" + $scope.collectionE4;
        } else if ($scope.collectionE1 && $scope.collectionE3 && $scope.collectionE4) {
            vm.CollationDescription = $scope.collectionE1 + "+" + $scope.collectionE3 + "+" + $scope.collectionE4;
        } else if ($scope.collectionE1 && $scope.collectionE2) {
            vm.CollationDescription = $scope.collectionE1 + "+" + $scope.collectionE2;
        } else if ($scope.collectionE1 && $scope.collectionE3) {
            vm.CollationDescription = $scope.collectionE1 + "+" + $scope.collectionE3;
        } else if ($scope.collectionE1 && $scope.collectionE4) {
            vm.CollationDescription = $scope.collectionE1 + "+" + $scope.collectionE4;
        } else if ($scope.collectionE1) {
            vm.CollationDescription = $scope.collectionE1;
        } else if ($scope.collectionE2 && $scope.collectionE3 && $scope.collectionE4) {
            vm.CollationDescription = $scope.collectionE2 + "+" + $scope.collectionE3 + "+" + $scope.collectionE4;
        } else if ($scope.collectionE2 && $scope.collectionE3) {
            vm.CollationDescription = $scope.collectionE2 + "+" + $scope.collectionE3;
        } else if ($scope.collectionE2 && $scope.collectionE4) {
            vm.CollationDescription = $scope.collectionE2 + "+" + $scope.collectionE4;
        } else if ($scope.collectionE2) {
            vm.CollationDescription = $scope.collectionE2;
        } else if ($scope.collectionE3 && $scope.collectionE4) {
            vm.CollationDescription = $scope.collectionE3 + "+" + $scope.collectionE4;
        } else if ($scope.collectionE3) {
            vm.CollationDescription = $scope.collectionE3;
        } else if ($scope.collectionE4) {
            vm.CollationDescription = $scope.collectionE4;
        } else {
            vm.CollationDescription = '';
        }

        $scope.CollationDescription = vm.CollationDescription;
    }

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
             vm.presentationCode = $scope.Modelselected;

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
        $state.go('errorPage', { ErrorNo: '420', ErrorMessage: 'Error occured in Combipack Lookup Prese code' });
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