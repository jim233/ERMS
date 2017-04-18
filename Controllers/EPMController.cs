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
    public class EPMController : WorkflowBaseController
    {

        protected IEPMService empService = new EPMService();
        protected EPMViewModel epmViewModel;
        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";
        public HttpResponseMessage GetEPM(int requestId, int requestType, int approvalStep)
        {
            try
            {

            BaseModel baseModel = empService.GetRequestFilterValues();

            epmViewModel = empService.GetEPMDetails(requestId, approvalStep);

            epmViewModel.GetApproveStep = approvalStep.ToString();

                epmViewModel.username = UserName.Split(Syngenta.ERMS.Common.Constants.SLASH.ToCharArray())[1].ToString();

         
            if (epmViewModel.GetEBMId != null)
            {
                if ((epmViewModel.GetEBMId.ToUpper() == UserName.ToUpper())
                || ((HttpContext.Current.Session[Constants.SESSION_USER_ROLE].ToString().ToUpper()) == "ADMIN"))
                {
                    
                }
                else {

                    DisableControls();
                }
            }
            string otherData = string.IsNullOrEmpty(epmViewModel.GetOtherData) ? string.Empty : epmViewModel.GetOtherData.Split(',')[0];
            
            if (otherData != string.Empty)
            {
                string pageCode = string.Empty;

                if (requestType == 3)
                {
                    pageCode = "EPM_CA";
                }
                else if (requestType == 2)
                {
                    pageCode = "EPM_NP";
                }
                else if (requestType == 5)
                {
                    if (approvalStep == 1)
                    {
                        epmViewModel.ShowFirstApprovalMsg = true;
                        pageCode = "EPM1_CMBI";
                    }
                    else if (approvalStep == 2)
                    {
                        epmViewModel.ShowFinalApprovalMsg = true;
                        pageCode = "EPM2_CMBI";
                    }
                }
                else if (requestType == 6)
                {
                    pageCode = "EPM_PFR";
                }

                if (base.PageDisable(pageCode, Convert.ToInt32(otherData)) == 1)
                {
                    DisableControls();
                }
                else if (base.PageDisable(pageCode, Convert.ToInt32(otherData)) == 2)
                {
                    epmViewModel.SubmitDisabled = true;
                }
            }
        }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Get EPM details");
                ExceptionManager.Publish(ex, additionalInfo);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetEPM method of EPM controller";
                epmViewModel.ErrorBE = errEntity;
            }
            return Request.CreateResponse(HttpStatusCode.OK, epmViewModel);

        }

        [NonAction]
        private void DisableControls()
        {
            epmViewModel.EpmNameDisabled = true;
            epmViewModel.CommentsReadOnly = true;
            epmViewModel.CoreRangeDisabled = true;
            epmViewModel.RequestApprovedDisabled = true;
            epmViewModel.SaveDisabled = true;
            epmViewModel.SubmitDisabled = true;
            epmViewModel.CompleteDateDisabled = true;
        }

        [HttpPost]
        public HttpResponseMessage Save(EPMDTO epmDTO)
        {
            int isSubmit = 0;
            OperationResultViewModel operationResult = new OperationResultViewModel();

            try
            {
                int result = empService.SaveEPMDetails(epmDTO.RequestId, isSubmit, UserName, epmDTO);
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
                additionalInfo.Add("PageName", "EPM");
                ExceptionManager.Publish(ex, additionalInfo);
                operationResult.ResultCode = Enums.OperationResultCode.Failed;
                operationResult.ResultMsg = ex.Message;
            }
            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }

        [HttpPost]
        public HttpResponseMessage Submit(EPMDTO epmDTO) 
        {
            int isSubmit = 1;
            int requestId = epmDTO.RequestId;
            OperationResultViewModel operationResult = new OperationResultViewModel();

            try
            {
                int result = empService.SaveEPMDetails(requestId, isSubmit, UserName, epmDTO);
                if (result > 0)
                {
                    operationResult.ResultCode = Enums.OperationResultCode.Success;
                    operationResult.ResultMsg = Constants.OPERATION_SUBMIT_SUCC;
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
                additionalInfo.Add("PageName", "EPM");
                ExceptionManager.Publish(ex, additionalInfo);
                operationResult.ResultCode = Enums.OperationResultCode.Failed;
                operationResult.ResultMsg = ex.Message;
            }
            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }

    }
}
