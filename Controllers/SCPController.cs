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
using Syngenta.ERMS.Services.Services;
using Syngenta.ERMS.BusinessEntities;
using System.Web.Script.Serialization;
using System.Collections.Specialized;
using Newtonsoft.Json.Linq;
using Syngenta.ERMS.ExceptionManagement;
using Newtonsoft.Json;
using Syngenta.ERMS.Services;

namespace ERMS.Controllers
{
    public class SCPController : WorkflowBaseController
    {
        protected ISCPService scpService = new SCPService();
        protected SCPViewModel scpViewModel = new SCPViewModel();
        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";
        public HttpResponseMessage GetSCP(int requestId, int requestType)
        {
            try
            {
                BaseModel baseModel = scpService.GetRequestFilterValues();
                BaseService baseService = new BaseService();
                scpViewModel = scpService.GetSCPRequestDetails(requestId);
                scpViewModel.username = UserName.Split(Syngenta.ERMS.Common.Constants.SLASH.ToCharArray())[1].ToString();
                if ((baseService.GetOrigitorName(requestId).Rows[0]["Origitor"].ToString().ToUpper() == UserName.ToUpper()) || ((HttpContext.Current.Session[Constants.SESSION_USER_ROLE].ToString().ToUpper()) == "ADMIN"))
                {

                }
                else
                {

                    DisableControls();
                }
                if (HttpContext.Current.Session["ifshow"] != null && HttpContext.Current.Session["ifshow"].ToString() == "Yes")
                {
                    scpViewModel.ShowBranding = true;
                }
                CheckPageDisabledDepByStatus(requestType);
                return Request.CreateResponse(HttpStatusCode.OK, scpViewModel);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "SCP");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in SCP");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetSCP method of SCPController";
                scpViewModel.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, scpViewModel);
            }
        }

        [NonAction]
        private void CheckPageDisabledDepByStatus(int requestType)
        {

            string pageCode = string.Empty;
            string otherData1 = string.IsNullOrEmpty(scpViewModel.GetOtherData.Split(',')[0]) ? string.Empty : scpViewModel.GetOtherData.Split(',')[0];
            int otherData = Convert.ToInt32(otherData1);
            if (requestType == 1)
            {
                pageCode = "SCP_EPT";
            }
            else if (requestType == 2)
            {
                pageCode = "SCP_NP";
            }
            else if (requestType == 3)
            {
                pageCode = "SCP_CA";
            }
            else if (requestType == 4)
            {
                pageCode = "SCP_SC";
            }
            else if (requestType == 5)
            {
                pageCode = "SCP_CMBI";
            }
            else if (requestType == 6)
            {
                pageCode = "SCP_PFR";
            }

            if (base.PageDisable(pageCode, otherData) == 1)
            {
                scpViewModel.IsPageDisable = true;
                DisableControls();
            }
            else if (base.PageDisable(pageCode, otherData) == 2)
            {
                scpViewModel.SubmitDisabled = true;
            }
        }

        [NonAction]
        private void DisableControls()
        {
            scpViewModel.FFPOutsideEAMEDisabled = true;
            scpViewModel.GSAPSystemCodeSetupDisabled = true;
            scpViewModel.ERPSystemCodeSetupDisabled = true;
            scpViewModel.SAPCodeSourcePlantDisabled = true;
            scpViewModel.ProcurementTypeDisabled = true;
            scpViewModel.FFPMRPControllerNameDisabled = true;
            scpViewModel.FFPMRPControllerCodeDisabled = true;
            scpViewModel.ReleventAPODisabled = true;
            scpViewModel.SupplyResponseDisabled = true;
            scpViewModel.GSAPHubPlantCode1Disabled = true;
            scpViewModel.SupplyPlant1Disabled = true;
            scpViewModel.HubMRPControllerName1Disabled = true;
            scpViewModel.HubMRPControllerCode1Disabled = true;
            scpViewModel.PurchaseNumber1Disabled = true;
            scpViewModel.SCPCommentsDisabled = true;
            scpViewModel.GSAPHubPlantCode2Disabled = true;
            scpViewModel.SupplyPlant2Disabled = true;
            scpViewModel.HubMRPControllerName2Disabled = true;
            scpViewModel.HubMRPControllerCode2Disabled = true;
            scpViewModel.PurchaseNumber2Disabled = true;
            scpViewModel.CompletedDateDisabled = true;
            scpViewModel.SaveDisabled = true;
            scpViewModel.SubmitDisabled = true;
            //lblSubmittedDate.Enabled = false;
            //lblSCPName.Enabled = false;
        }

        [HttpPost]
        public HttpResponseMessage Save(SCPDTO scpDTO)
        {
            OperationResultViewModel operationResult = new OperationResultViewModel();
            try
            {
                int result = scpService.SaveSCPData(UserName, scpDTO);
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
                additionalInfo.Add("PageName", "SCP");
                ExceptionManager.Publish(ex, additionalInfo);
                operationResult.ResultCode = Enums.OperationResultCode.Failed;
                operationResult.ResultMsg = ex.Message;
            }
            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }

        [HttpPost]
   
        public HttpResponseMessage Submit(SCPDTO scpDTO)
        {
            OperationResultViewModel operationResult = new OperationResultViewModel();
            try
            {
                int result = scpService.SaveSCPData(UserName, scpDTO);

                if (result > 0)
                {
                    operationResult.ResultCode = Enums.OperationResultCode.Success;
                    operationResult.ResultMsg = Constants.OPERATION_SUBMIT_SUCC;
                }
                else
                {
                    operationResult.ResultCode = Enums.OperationResultCode.Failed;
                    operationResult.ResultMsg = Constants.OPERATION_SUBMIT_FAILED;
                }
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "SCP");
                ExceptionManager.Publish(ex, additionalInfo);
                operationResult.ResultCode = Enums.OperationResultCode.Failed;
                operationResult.ResultMsg = ex.Message;
            }
            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }
    }
}
