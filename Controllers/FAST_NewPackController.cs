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
using Syngenta.ERMS.Services;


namespace ERMS.Controllers
{
    public class FAST_NewPackController : WorkflowBaseController
    {

        protected IFAST_NewPackService fAST_NewPackService = new FAST_NewPackService();
        protected FAST_NewPackViewModel fAST_NewPackViewModel;
        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";
        public HttpResponseMessage GetNPRFast(int requestId, int requestType)
        {
           try
            {
            //BaseModel baseModel = fAST_NewPackService.GetRequestFilterValues();
            fAST_NewPackViewModel = fAST_NewPackService.GetNewRequestDetails_Fast(requestId);
            fAST_NewPackViewModel.username = UserName.Split(Syngenta.ERMS.Common.Constants.SLASH.ToCharArray())[1].ToString();
                //SOCB - LRMS change - Addition of Approval dropdown in FAST
                fAST_NewPackViewModel.Region = HttpContext.Current.Session[Constants.USER_REGION] != null ? HttpContext.Current.Session[Constants.USER_REGION].ToString() : Constants.REGION_EAME;
                //SOCB - LRMS change - Addition of Approval dropdown in FAST
            BaseService baseService = new BaseService();
            fAST_NewPackViewModel.requestId = requestId.ToString();
            if (HttpContext.Current.Session["ifshow"] != null && HttpContext.Current.Session["ifshow"].ToString() == "Yes")
            {
                fAST_NewPackViewModel.NPRFastMessage2Show = true;
            }
            if ((baseService.GetOrigitorName(requestId).Rows[0]["Origitor"].ToString().ToUpper() == UserName.ToUpper()) || ((HttpContext.Current.Session[Constants.SESSION_USER_ROLE].ToString().ToUpper()) == "ADMIN"))
            {

            }
            else
            {

                DisableControls();
            }
           
                string otherData = string.IsNullOrEmpty(fAST_NewPackViewModel.GetOtherData) ? string.Empty : fAST_NewPackViewModel.GetOtherData.Split(',')[0];
                if (otherData != string.Empty)
                {
                    string pageCode = string.Empty;
                    pageCode = "FAST_NP";
                    if (base.PageDisable(pageCode, Convert.ToInt32(otherData)) == 1)
                        DisableControls();
                    else if (base.PageDisable(pageCode, Convert.ToInt32(otherData)) == 2)
                    {
                        fAST_NewPackViewModel.SaveDisabled = true;
                        fAST_NewPackViewModel.SubmitDisabled = true;
                    }
                    string sCoreRange = string.IsNullOrEmpty(fAST_NewPackViewModel.GetOtherData.Split(',')[2]) ? string.Empty : fAST_NewPackViewModel.GetOtherData.Split(',')[2];
                    int iCoreRange = Convert.ToInt32(sCoreRange);
                    switch (iCoreRange)
                    {
                        case 0:
                            fAST_NewPackViewModel.NPRFastMessage1 = "EPM input - Add to Core Range = No";
                            break;
                        case 1:
                            fAST_NewPackViewModel.NPRFastMessage1 = "EPM input - Add to Core Range = Yes";
                            break;
                        default:
                            fAST_NewPackViewModel.NPRFastMessage1 = "EPM input - ";
                            break;
                    }


                }
            return Request.CreateResponse(HttpStatusCode.OK, fAST_NewPackViewModel);
            }
           catch (Exception ex)
           {
               NameValueCollection additionalInfo = new NameValueCollection();
               additionalInfo.Add("PageName", "FAST_NewPack");
               ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in GetNPRFast method of FAST_Newpack controller");
               errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetNPRFast method of FAST_Newpack controller";
               fAST_NewPackViewModel.ErrorBE = errEntity;
               return Request.CreateResponse(HttpStatusCode.OK, fAST_NewPackViewModel);
           }
        }

        [HttpPost]
        public HttpResponseMessage SaveNPRFast(FAST_NewPackViewModel fAST_NewPackViewModel)
        {

            OperationResultViewModel operationResult = new OperationResultViewModel();
            try
            {

                int requestId = Convert.ToInt32(fAST_NewPackViewModel.requestId);
                int result = fAST_NewPackService.SaveNewRequestDetails_Fast(requestId, UserName, fAST_NewPackViewModel);
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
                additionalInfo.Add("PageName", "FAST_NewPack");
                ExceptionManager.Publish(ex, additionalInfo);
                operationResult.ResultCode = Enums.OperationResultCode.Failed;
                operationResult.ResultMsg = ex.Message;
            }

            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }

        [HttpPost]
        public HttpResponseMessage SubmitNPRFast(FAST_NewPackViewModel fAST_NewPackViewModel)
        {
            OperationResultViewModel operationResult = new OperationResultViewModel();
            int requestId = Convert.ToInt32(fAST_NewPackViewModel.requestId);

            try
            {
                int result = fAST_NewPackService.SaveNewRequestDetails_Fast(requestId, UserName, fAST_NewPackViewModel);
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
                additionalInfo.Add("PageName", "FAST_NewPack");
                ExceptionManager.Publish(ex, additionalInfo);
                operationResult.ResultCode = Enums.OperationResultCode.Failed;
                operationResult.ResultMsg = ex.Message;
            }
            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }


        [NonAction]
        private void DisableControls()
        {
            fAST_NewPackViewModel.CommentsReadOnly = true;
            fAST_NewPackViewModel.ConfirmSourceDisabled = true;
            fAST_NewPackViewModel.RequestApprovedDisabled = true;
            fAST_NewPackViewModel.SaveDisabled = true;
            fAST_NewPackViewModel.SubmitDisabled = true;
            fAST_NewPackViewModel.FastContactDisabled = true;
            fAST_NewPackViewModel.SourcePlantDisabled = true;
            fAST_NewPackViewModel.CompleteDateDisabled = true;
        }
    }
}
