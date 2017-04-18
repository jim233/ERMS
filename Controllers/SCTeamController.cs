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
    public class SCTeamController : WorkflowBaseController
    {

        protected ISCTeamService sCTeamService = new SCTeamService();
        protected SCTeamViewModel sCTeamViewModel;
        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";
        public HttpResponseMessage GetNPRSCTeam(int requestId)
        {
            try
            {
                BaseModel baseModel = sCTeamService.GetRequestFilterValues();
                sCTeamViewModel = sCTeamService.GetSCPRequestDetails(requestId);

                sCTeamViewModel.requestId = requestId.ToString();
                sCTeamViewModel.username = UserName.Split(Syngenta.ERMS.Common.Constants.SLASH.ToCharArray())[1].ToString();
                if (HttpContext.Current.Session["ifshow"] != null && HttpContext.Current.Session["ifshow"].ToString() == "Yes")
                {
                    sCTeamViewModel.Message3Show = true;
                }
                if (((HttpContext.Current.Session[Constants.SESSION_USER_ROLE].ToString().ToUpper()) == "ADMIN"))
                {
                    sCTeamViewModel.OutcomeDisabled = false;
                    sCTeamViewModel.UpdateDisabled = false;
                    sCTeamViewModel.ResolutionCommentsReadOnly = false;


                }
                else
                {
                    sCTeamViewModel.OutcomeDisabled = true;
                    sCTeamViewModel.UpdateDisabled = true;
                    sCTeamViewModel.ResolutionCommentsReadOnly = true;
                }

                if ((sCTeamViewModel.GetPackId.ToUpper() == UserName.ToUpper()) || ((HttpContext.Current.Session[Constants.SESSION_USER_ROLE].ToString().ToUpper()) == "ADMIN") || sCTeamViewModel.GetPackTechList.ToUpper().Contains(UserName.ToUpper()))
                {
                    //do nothing
                }
                else
                {
                    DisableControls();
                }

                string hdnOthers = string.IsNullOrEmpty(sCTeamViewModel.GetOtherData) ? string.Empty : sCTeamViewModel.GetOtherData;

                if (hdnOthers != string.Empty)
                {
                    string hdnOthers1 = string.IsNullOrEmpty(hdnOthers.Split(',')[0]) ? string.Empty : hdnOthers.Split(',')[0];

                    if (base.PageDisable("SC_NP", Convert.ToInt32(hdnOthers1)) == 1)
                        DisableControls();
                    else if (base.PageDisable("SC_NP", Convert.ToInt32(hdnOthers1)) == 2)
                    {
                        sCTeamViewModel.btnSubmitDisabled = true;
                        sCTeamViewModel.btnSaveDisabled = true;
                    }
                    string hdnOthers2 = string.IsNullOrEmpty(hdnOthers.Split(',')[2]) ? string.Empty : hdnOthers.Split(',')[2];
                    int iCoreRange = Convert.ToInt32(hdnOthers2);
                    switch (iCoreRange)
                    {
                        case 0:
                            sCTeamViewModel.Message1 = "EPM input - Add to Core Range = No";
                            break;
                        case 1:
                            sCTeamViewModel.Message1 = "EPM input - Add to Core Range = Yes";
                            break;
                        default:
                            sCTeamViewModel.Message1 = "EPM input - ";
                            break;
                    }
                    string sFASTSource = string.IsNullOrEmpty(hdnOthers.Split(',')[3]) ? string.Empty : Convert.ToString(hdnOthers.Split(',')[3]);

                    if (sFASTSource != string.Empty)
                    {
                        sCTeamViewModel.Message2 = "<h4>FAST input - Source = " + sFASTSource;
                    }
                    string sFASTSourcePlant = string.IsNullOrEmpty(hdnOthers.Split(',')[4]) ? string.Empty : Convert.ToString(hdnOthers.Split(',')[4]);

                    if (sFASTSourcePlant != string.Empty)
                    {
                        sCTeamViewModel.Message2 = sCTeamViewModel.Message2 + "<br>Source Plant = " + sFASTSourcePlant + "";
                    }
                    //End of change for case 1205140 on 11/20/2008
                }

                return Request.CreateResponse(HttpStatusCode.OK, sCTeamViewModel);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "SCTeam");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in GetNPRSCTeam method of SCTeam controller");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetNPRSCTeam method of SCTeam controller";
                sCTeamViewModel.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, sCTeamViewModel);
            }
        }

        [HttpPost]
        public HttpResponseMessage SaveNPRSCTeam(SCTeamViewModel sCTeamViewModel)
        {
            OperationResultViewModel operationResult = new OperationResultViewModel();
            try
            {
                int i = 0;
                int requestId = Convert.ToInt32(sCTeamViewModel.requestId);
                int result = sCTeamService.SaveSCTData(requestId, 0, UserName, sCTeamViewModel);
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
                additionalInfo.Add("PageName", "SCTeam");
                ExceptionManager.Publish(ex, additionalInfo);
                operationResult.ResultCode = Enums.OperationResultCode.Failed;
                operationResult.ResultMsg = ex.Message;
            }
            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }

        [HttpPost]
        public HttpResponseMessage SubmitNPRSCTeam(SCTeamViewModel sCTeamViewModel)
        {
            OperationResultViewModel operationResult = new OperationResultViewModel();

            int requestId = Convert.ToInt32(sCTeamViewModel.requestId);
            int i = 1;
            try
            {
                int result = sCTeamService.SaveSCTData(requestId, 1, UserName, sCTeamViewModel);
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
                additionalInfo.Add("PageName", "SCTeam");
                ExceptionManager.Publish(ex, additionalInfo);
                operationResult.ResultCode = Enums.OperationResultCode.Failed;
                operationResult.ResultMsg = ex.Message;
            }
            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }


        [NonAction]
        private void DisableControls()
        {
            sCTeamViewModel.CommentsReadOnly = true;
            sCTeamViewModel.ApprovedDisabled = true;
            sCTeamViewModel.OutcomeDisabled = true;
            sCTeamViewModel.btnSubmitDisabled = true;
            sCTeamViewModel.btnSaveDisabled = true;
            sCTeamViewModel.UpdateDisabled = true;
            sCTeamViewModel.PackHeadNameDisabled = true;
            sCTeamViewModel.AdministratorDisabled = true;
            sCTeamViewModel.ResolutionCommentsReadOnly = true;
            sCTeamViewModel.PackResDisabled = true;

        }
    }
}
