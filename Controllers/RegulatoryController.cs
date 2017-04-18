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
    public class RegulatoryController : WorkflowBaseController
    {
        protected IRegulatoryService regulatoryService = new RegulatoryService();
        protected RegulatoryViewModel regulatoryViewModel;
        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";
        public HttpResponseMessage GetRegulatory(int requestId)
        {
            try
            {
                BaseModel baseModel = regulatoryService.GetRequestFilterValues();
                regulatoryViewModel = regulatoryService.GetRegulatoryDetails(requestId);
                BaseService baseService = new BaseService();
                regulatoryViewModel.requestId = requestId.ToString();
                regulatoryViewModel.username = UserName.Split(Syngenta.ERMS.Common.Constants.SLASH.ToCharArray())[1].ToString();
                if ((baseService.GetOrigitorName(requestId).Rows[0]["Origitor"].ToString().ToUpper() == UserName.ToUpper()) || ((HttpContext.Current.Session[Constants.SESSION_USER_ROLE].ToString().ToUpper()) == "ADMIN"))
                {
                    
                }
                else {

                    DisableControls();
                }
                string otherData = string.IsNullOrEmpty(regulatoryViewModel.GetOtherData) ? string.Empty : regulatoryViewModel.GetOtherData.Split(',')[0];

                if (otherData != string.Empty)
                {
                    string pageCode = string.Empty;
                    pageCode = "RA";
                    if (base.PageDisable(pageCode, Convert.ToInt32(otherData)) == 1)
                        DisableControls();
                    else if (base.PageDisable(pageCode, Convert.ToInt32(otherData)) == 2)
                    {
                        regulatoryViewModel.btnSaveDisabled = true;

                        regulatoryViewModel.btnSubmitDisabled = true;
                    }




                }

            

                return Request.CreateResponse(HttpStatusCode.OK, regulatoryViewModel);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "RA");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in GetSCRFast method of Fast_EPT controller");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetRegulatory method of Regulatory controller";
                regulatoryViewModel.ErrorBE = errEntity;
            }
            return Request.CreateResponse(HttpStatusCode.OK, regulatoryViewModel);

        }

        [HttpPost]
        public HttpResponseMessage SaveRegulatory(RegulatoryViewModel regulatoryViewModel)
        {
            OperationResultViewModel operationResult = new OperationResultViewModel();
            try
            {

                int requestId = Convert.ToInt32(regulatoryViewModel.requestId);
                int result = regulatoryService.SaveRegulatoryDetails(requestId, UserName, regulatoryViewModel);
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
                operationResult.ResultCode = Enums.OperationResultCode.Failed;
                operationResult.ResultMsg = ex.Message;
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Error in Save RA");
                ExceptionManager.Publish(ex, additionalInfo);
            }

            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }

        [HttpPost]
        public HttpResponseMessage SubmitRegulatory(RegulatoryViewModel regulatoryViewModel)
        {

            OperationResultViewModel operationResult = new OperationResultViewModel();

            int requestId = Convert.ToInt32(regulatoryViewModel.requestId);

            try
            {
                int result = regulatoryService.SaveRegulatoryDetails(requestId, UserName, regulatoryViewModel);
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
                operationResult.ResultCode = Enums.OperationResultCode.Failed;
                operationResult.ResultMsg = ex.Message;
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Error in Submit RA");
                ExceptionManager.Publish(ex, additionalInfo);
            }

            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }


        [NonAction]
        private void DisableControls()
        {
            regulatoryViewModel.GetApprovalStatusDisabled=true;

            regulatoryViewModel.GetRegulatoryApproverNameDisabled=true;

            regulatoryViewModel.GetCompletedDateDisabled=true;

            regulatoryViewModel.GetCommentsReadOnly=true;

            regulatoryViewModel.btnSaveDisabled=true;

            regulatoryViewModel.btnSubmitDisabled= true;

        }
       

    }
}
