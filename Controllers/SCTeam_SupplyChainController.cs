using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;
using Syngenta.ERMS.BusinessEntities.NewCodeRequests;
using Syngenta.ERMS.Common;
using Syngenta.ERMS.Common.ViewModels;
using Syngenta.ERMS.Services.ServiceInterfaces;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.BusinessEntities;
using System.Web.Script.Serialization;
using System.Collections.Specialized;
using Newtonsoft.Json.Linq;
using Syngenta.ERMS.ExceptionManagement;
using Newtonsoft.Json;

namespace ERMS.Controllers
{
    public class SCTeam_SupplyChainController : WorkflowBaseController
    {

        protected ISCTeam_SupplyChainService sCTeam_SupplyChainService = new SCTeam_SupplyChainService();
        protected SCTeam_SupplyChainViewModel sCTeam_SupplyChainViewModel;
        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";
        public HttpResponseMessage GetSCRSCTeam(int requestId)
        {
            try
            {
                sCTeam_SupplyChainViewModel = sCTeam_SupplyChainService.GetSCPRequestDetails(requestId);
                sCTeam_SupplyChainViewModel.requestId = requestId.ToString();
                sCTeam_SupplyChainViewModel.username = UserName.Split(Syngenta.ERMS.Common.Constants.SLASH.ToCharArray())[1].ToString();
                if (HttpContext.Current.Session["ifshow"] != null && HttpContext.Current.Session["ifshow"].ToString() == "Yes")
                {
                    sCTeam_SupplyChainViewModel.message1Show = true;
                }
                if (((HttpContext.Current.Session[Constants.SESSION_USER_ROLE].ToString().ToUpper()) == "ADMIN"))
                {
                    sCTeam_SupplyChainViewModel.ResolutionCommentsReadOnly = false;
                    sCTeam_SupplyChainViewModel.SaveDisabled = false;
                    sCTeam_SupplyChainViewModel.OutComeDisabled = false;

                }
                else
                {
                    sCTeam_SupplyChainViewModel.ResolutionCommentsReadOnly = true;
                    sCTeam_SupplyChainViewModel.SaveDisabled = true;
                    sCTeam_SupplyChainViewModel.OutComeDisabled = true;

                }
                BaseService baseService = new BaseService();
                if (baseService.GetOrigitorName(requestId).Rows[0]["Origitor"].ToString().ToUpper() == UserName.ToUpper() || ((HttpContext.Current.Session[Constants.SESSION_USER_ROLE].ToString().ToUpper()) == "ADMIN") || sCTeam_SupplyChainViewModel.GetPackTechList.ToUpper().Contains(UserName.ToUpper()))
                {
                    //do nothing
                }
                else
                {
                    DisableControls();
                }
                PackagingDisableControls();
                FAndPSourcingDisableControls();
                PackPurchasingDisableControls();
                GSCMDisableControls();
                GTPDisableControls();
                string hdnStatus = sCTeam_SupplyChainViewModel.GetStatus;
                if (base.PageDisable("SCT_SC", Convert.ToInt32(hdnStatus)) == 1)
                {
                    DisableControls();
                }
             

                string hdnType = string.IsNullOrEmpty(sCTeam_SupplyChainViewModel.GetRQTY) ? string.Empty : sCTeam_SupplyChainViewModel.GetRQTY;
                if (Convert.ToInt32(hdnType) == 4)
                {
                    sCTeam_SupplyChainViewModel.DataManageShow = false;
                    sCTeam_SupplyChainViewModel.GSCMShow = false;
                    sCTeam_SupplyChainViewModel.FPComPlantShow = false;
                    sCTeam_SupplyChainViewModel.GTPShow = false;
                    sCTeam_SupplyChainViewModel.PackTechnologistShow = true;
                }
                else
                {
                    sCTeam_SupplyChainViewModel.GSCMShow = true;
                    sCTeam_SupplyChainViewModel.FPComPlantShow = true;
                    sCTeam_SupplyChainViewModel.GTPShow = true;
                    sCTeam_SupplyChainViewModel.DataManageShow = false;
                    sCTeam_SupplyChainViewModel.PackTechnologistShow = false;
                }
                return Request.CreateResponse(HttpStatusCode.OK, sCTeam_SupplyChainViewModel);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "SCTeam_SupplyChain");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in GetSCRSCTeam method of SCTeam_SupplyChain controller");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetSCRSCTeam method of SCTeam_SupplyChain controller";
                sCTeam_SupplyChainViewModel.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, sCTeam_SupplyChainViewModel);
            }
        }

        [HttpPost]
        public HttpResponseMessage SaveSCRSCTeam(SCTeam_SupplyChainViewModel sCTeam_SupplyChainViewModel)
        {

            OperationResultViewModel operationResult = new OperationResultViewModel();
            try
            {
                int requestId = Convert.ToInt32(sCTeam_SupplyChainViewModel.requestId);
                int result = 0;

                if (Convert.ToInt32(sCTeam_SupplyChainViewModel.GetRQTY) == 4)
                {
                    result = sCTeam_SupplyChainService.SaveSCPData(requestId, sCTeam_SupplyChainViewModel);
                }

                else
                {
                    result = sCTeam_SupplyChainService.SaveCombiData(requestId, sCTeam_SupplyChainViewModel);
                }
                if (result > 0)
                {
                    operationResult.ResultCode = Enums.OperationResultCode.Success;
                    operationResult.ResultMsg = Constants.OPERATION_SAVE_SUCC;
                }
                else
                {
                    operationResult.ResultCode = Enums.OperationResultCode.Failed;
                    operationResult.ResultMsg = Constants.OPERATION_SAVE_FAILED;
                }
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "SCTeam_SupplyChain");
                ExceptionManager.Publish(ex, additionalInfo);
                operationResult.ResultCode = Enums.OperationResultCode.Failed;
                operationResult.ResultMsg = ex.Message;
            }
            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }

        [NonAction]
        private void DisableControls()
        {
            //Packaging
            sCTeam_SupplyChainViewModel.PackagingNameDisabled = true;
            sCTeam_SupplyChainViewModel.PackagingApprovedDisabled = true;
            sCTeam_SupplyChainViewModel.PackTechnologistDisabled = true;
            sCTeam_SupplyChainViewModel.PackagingCommentsReadOnly = true;
            sCTeam_SupplyChainViewModel.PackagingSaveDisabled = true;
            //FAndPSourcing
            sCTeam_SupplyChainViewModel.FAndPSourcingNameDisabled = true;
            sCTeam_SupplyChainViewModel.FAndPSourcingApprovedDisabled = true;
            sCTeam_SupplyChainViewModel.FAndPSourcingCommentsReadOnly = true;
            sCTeam_SupplyChainViewModel.FPComPlantDisabled = true;
            sCTeam_SupplyChainViewModel.FAndPSourcingSaveDisabled = true;
            //PackPurchasing
            sCTeam_SupplyChainViewModel.PackPurchasingNameDisabled = true;
            sCTeam_SupplyChainViewModel.PackPurchasingApprovedDisabled = true;
            sCTeam_SupplyChainViewModel.PackPurchasingCommentsReadOnly = true;
            sCTeam_SupplyChainViewModel.PackPurchasingSaveDisabled = true;
            //Administrator
            sCTeam_SupplyChainViewModel.AdministratorDisabled = true;
            sCTeam_SupplyChainViewModel.ResolutionCommentsReadOnly = true;
            sCTeam_SupplyChainViewModel.SaveDisabled = true;
            sCTeam_SupplyChainViewModel.OutComeDisabled = true;
            //GSCM
            sCTeam_SupplyChainViewModel.GSCMNameDisabled= true;
            sCTeam_SupplyChainViewModel.GSCMApprovedDisabled = true;
            sCTeam_SupplyChainViewModel.GSCMCommentsReadOnly= true;
            sCTeam_SupplyChainViewModel.GSCMSaveDisabled = true;
            //GTP
            sCTeam_SupplyChainViewModel.GTPNameDisabled = true;
            sCTeam_SupplyChainViewModel.GTPApprovedDiabled = true;
            sCTeam_SupplyChainViewModel.PricipalLegalEntityDisabled = true;
            sCTeam_SupplyChainViewModel.GTPcommentsReadOnly= true;
            sCTeam_SupplyChainViewModel.GTPSaveDisabled = true;
            //DataManegement
            sCTeam_SupplyChainViewModel.DataManegementNameReadOnly= true;
            sCTeam_SupplyChainViewModel.DataManagementApprovedDiabled = true;
            sCTeam_SupplyChainViewModel.DataManagementEstOfDateCompletionDisabled = true;
            sCTeam_SupplyChainViewModel.DataManagementCommentsReadOnly = true;
            sCTeam_SupplyChainViewModel.DataManagementSaveDisabled = true;

        }


        [NonAction]
        private void PackagingDisableControls()
        {
            //Packaging

            if (string.IsNullOrEmpty(sCTeam_SupplyChainViewModel.GetPackagingName))
            {

            }
            else
            {

                if ((sCTeam_SupplyChainViewModel.GetPackagingName == UserName.ToUpper()) || (HttpContext.Current.User.IsInRole(HttpContext.Current.Session[Constants.SESSION_USER_ROLE].ToString()) == true))
                {
                    sCTeam_SupplyChainViewModel.PackagingNameDisabled = false;
                    sCTeam_SupplyChainViewModel.PackagingApprovedDisabled = false;
                    sCTeam_SupplyChainViewModel.PackTechnologistDisabled = false;
                    sCTeam_SupplyChainViewModel.PackagingCommentsReadOnly = false;
                    sCTeam_SupplyChainViewModel.PackagingSaveDisabled = false;

                }
                else
                {
                    sCTeam_SupplyChainViewModel.PackagingNameDisabled = true;
                    sCTeam_SupplyChainViewModel.PackagingApprovedDisabled = true;
                    sCTeam_SupplyChainViewModel.PackTechnologistDisabled = true;
                    sCTeam_SupplyChainViewModel.PackagingCommentsReadOnly = true;
                    sCTeam_SupplyChainViewModel.PackagingSaveDisabled = true;
                }
            } 
        
       }


        [NonAction]
        private void FAndPSourcingDisableControls()
        {
            //FAndPSourcing

            if (string.IsNullOrEmpty(sCTeam_SupplyChainViewModel.GetFAndPSourcingName))
            {

            }
            else
            {

                if ((sCTeam_SupplyChainViewModel.GetFAndPSourcingName == UserName.ToUpper()) || (HttpContext.Current.User.IsInRole(HttpContext.Current.Session[Constants.SESSION_USER_ROLE].ToString()) == true))
                {
                    sCTeam_SupplyChainViewModel.FAndPSourcingNameDisabled = false;
                    sCTeam_SupplyChainViewModel.FAndPSourcingApprovedDisabled = false;
                    sCTeam_SupplyChainViewModel.FAndPSourcingCommentsReadOnly = false;
                    sCTeam_SupplyChainViewModel.FPComPlantDisabled = false;
                    sCTeam_SupplyChainViewModel.FAndPSourcingSaveDisabled = false;

                }
                else
                {
                    sCTeam_SupplyChainViewModel.FAndPSourcingNameDisabled = true;
                    sCTeam_SupplyChainViewModel.FAndPSourcingApprovedDisabled = true;
                    sCTeam_SupplyChainViewModel.FAndPSourcingCommentsReadOnly = true;
                    sCTeam_SupplyChainViewModel.FPComPlantDisabled = true;
                    sCTeam_SupplyChainViewModel.FAndPSourcingSaveDisabled = true;
                }
            } 
          
        }



        [NonAction]
        private void PackPurchasingDisableControls()
        {
            //PackPurchasing
            if (string.IsNullOrEmpty(sCTeam_SupplyChainViewModel.GetPackPurchasingName))
            {

            }
            else
            {

                if ((sCTeam_SupplyChainViewModel.GetPackPurchasingName == UserName.ToUpper()) || (HttpContext.Current.User.IsInRole(HttpContext.Current.Session[Constants.SESSION_USER_ROLE].ToString()) == true))
                {
                    sCTeam_SupplyChainViewModel.PackPurchasingNameDisabled = false;
                    sCTeam_SupplyChainViewModel.PackPurchasingApprovedDisabled = false;
                    sCTeam_SupplyChainViewModel.PackPurchasingCommentsReadOnly = false;
                    sCTeam_SupplyChainViewModel.PackPurchasingSaveDisabled = false;

                }
                else
                {
                    sCTeam_SupplyChainViewModel.PackPurchasingNameDisabled = true;
                    sCTeam_SupplyChainViewModel.PackPurchasingApprovedDisabled = true;
                    sCTeam_SupplyChainViewModel.PackPurchasingCommentsReadOnly = true;
                    sCTeam_SupplyChainViewModel.PackPurchasingSaveDisabled = true;
                }
            } 
           
        }

        [NonAction]
        private void GSCMDisableControls()
        {
            //GSCM
            if (string.IsNullOrEmpty(sCTeam_SupplyChainViewModel.GetGSCMName))
            {

            }
            else
            {

                if ((sCTeam_SupplyChainViewModel.GetGSCMName == UserName.ToUpper()) || (HttpContext.Current.User.IsInRole(HttpContext.Current.Session[Constants.SESSION_USER_ROLE].ToString()) == true))
                {
                    sCTeam_SupplyChainViewModel.GSCMNameDisabled = false;
                    sCTeam_SupplyChainViewModel.GSCMApprovedDisabled = false;
                    sCTeam_SupplyChainViewModel.GSCMCommentsReadOnly = false;
                    sCTeam_SupplyChainViewModel.GSCMSaveDisabled = false;

                }
                else
                {
                    sCTeam_SupplyChainViewModel.GSCMNameDisabled = true;
                    sCTeam_SupplyChainViewModel.GSCMApprovedDisabled = true;
                    sCTeam_SupplyChainViewModel.GSCMCommentsReadOnly = true;
                    sCTeam_SupplyChainViewModel.GSCMSaveDisabled = true;
                }
            } 
          
        }

        [NonAction]
        private void GTPDisableControls()
        {
            //GTP
            if (string.IsNullOrEmpty(sCTeam_SupplyChainViewModel.GetGTPName))
            {

            }
            else
            {

                if ((sCTeam_SupplyChainViewModel.GetGTPName == UserName.ToUpper()) || (HttpContext.Current.User.IsInRole(HttpContext.Current.Session[Constants.SESSION_USER_ROLE].ToString()) == true))
                {
                    sCTeam_SupplyChainViewModel.GTPNameDisabled = false;
                    sCTeam_SupplyChainViewModel.GTPApprovedDiabled = false;
                    sCTeam_SupplyChainViewModel.PricipalLegalEntityDisabled = false;
                    sCTeam_SupplyChainViewModel.GTPcommentsReadOnly = false;
                    sCTeam_SupplyChainViewModel.GTPSaveDisabled = false;

                }
                else
                {
                    sCTeam_SupplyChainViewModel.GTPNameDisabled = true;
                    sCTeam_SupplyChainViewModel.GTPApprovedDiabled = true;
                    sCTeam_SupplyChainViewModel.PricipalLegalEntityDisabled = true;
                    sCTeam_SupplyChainViewModel.GTPcommentsReadOnly = true;
                    sCTeam_SupplyChainViewModel.GTPSaveDisabled = true;
                }
            } 
       
        }


    }
}
