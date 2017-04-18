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
    public class FAST_EPTController : WorkflowBaseController
    {
        protected IFAST_EPTService fAST_EPTService = new FAST_EPTService();
        protected FAST_EPTViewModel fAST_EPTViewModel;
        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";
        public HttpResponseMessage GetSCRFast(int requestId)
        {
           try
            {
            BaseModel baseModel = fAST_EPTService.GetRequestFilterValues();
            fAST_EPTViewModel = fAST_EPTService.GetFASTRequestDetails(requestId);
            BaseService baseService = new BaseService();
            fAST_EPTViewModel.requestId = requestId.ToString();
            fAST_EPTViewModel.username = UserName.Split(Syngenta.ERMS.Common.Constants.SLASH.ToCharArray())[1].ToString();
                //SOCB - LRMS change - Addition of Approval dropdown in FAST
                fAST_EPTViewModel.Region = HttpContext.Current.Session[Constants.USER_REGION] != null ? HttpContext.Current.Session[Constants.USER_REGION].ToString() : Constants.REGION_EAME;
                //EOCB - LRMS change - Addition of Approval dropdown in FAST
                if ((baseService.GetOrigitorName(requestId).Rows[0]["Origitor"].ToString().ToUpper() == UserName.ToUpper()) || ((HttpContext.Current.Session[Constants.SESSION_USER_ROLE].ToString().ToUpper()) == "ADMIN"))
                {

                }
                else
                {

                    DisableControls();
                }
                string otherData = string.IsNullOrEmpty(fAST_EPTViewModel.GetOtherData) ? string.Empty : fAST_EPTViewModel.GetOtherData.Split(',')[1];
           
            if (otherData != string.Empty)
            {
                string pageCode = string.Empty;
                pageCode = "FAST_EPT";
                if (base.PageDisable(pageCode, Convert.ToInt32(otherData)) == 1)
                    DisableControls();
                else if (base.PageDisable(pageCode, Convert.ToInt32(otherData)) == 2)
                {
                    fAST_EPTViewModel.btnSubmitDisabled = true;
                    fAST_EPTViewModel.SubmittedDateDisabled = true;
                }

              


            }
            
           

            return Request.CreateResponse(HttpStatusCode.OK, fAST_EPTViewModel);
            }
           catch (Exception ex)
           {
               NameValueCollection additionalInfo = new NameValueCollection();
               additionalInfo.Add("PageName", "Fast_EPT");
               ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in GetSCRFast method of Fast_EPT controller");
               errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetSCRFast method of Fast_EPT controller";
               fAST_EPTViewModel.ErrorBE = errEntity;
            }
               return Request.CreateResponse(HttpStatusCode.OK, fAST_EPTViewModel);

           }

        [HttpPost]
        public HttpResponseMessage SaveSCRFast(FAST_EPTViewModel fAST_EPTViewModel)
        {
            OperationResultViewModel operationResult = new OperationResultViewModel();
            try
            {
             
                int requestId = Convert.ToInt32(fAST_EPTViewModel.requestId);
                int result = fAST_EPTService.SaveFASTRequestDetails(requestId, UserName, fAST_EPTViewModel);
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
                additionalInfo.Add("PageName", "Error in Save FAST EPT");
                ExceptionManager.Publish(ex, additionalInfo);
            }

            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }

        [HttpPost]
        public HttpResponseMessage SubmitSCRFast(FAST_EPTViewModel fAST_EPTViewModel)
        {

            OperationResultViewModel operationResult = new OperationResultViewModel();

            int requestId = Convert.ToInt32(fAST_EPTViewModel.requestId);

            try
            {
                int result = fAST_EPTService.SaveFASTRequestDetails(requestId, UserName, fAST_EPTViewModel);
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
                additionalInfo.Add("PageName", "Error in Submit FAST EPT");
                ExceptionManager.Publish(ex, additionalInfo);
            }

            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }


        [NonAction]
        private void DisableControls()
        {
            fAST_EPTViewModel.CommentsReadOnly = true;
            fAST_EPTViewModel.AgreedSourcePlantReadOnly = true;
            fAST_EPTViewModel.btnSaveDisabled = true;
            fAST_EPTViewModel.btnSubmitDisabled = true;
            fAST_EPTViewModel.SubmittedDateDisabled = true;
            fAST_EPTViewModel.FastContactDisabled = true; 
            fAST_EPTViewModel.CompletedDateDiabled = true;
            fAST_EPTViewModel.GetApprovalStatusIDDisabled = true;
        }
       
    }
}
