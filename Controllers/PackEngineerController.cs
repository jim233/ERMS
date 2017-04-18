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
    public class PackEngineerController : WorkflowBaseController
    {
        protected IPackTech_EPTService packTech_EPTService = new PackTech_EPTService();
        protected PackTech_EPTViewModel packTech_EPTViewModel;
        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";
        public HttpResponseMessage GetPackEngineer(int requestId)
        {
            try
            {
              
                packTech_EPTViewModel = packTech_EPTService.GetPackTechRequestDetails(requestId);
                packTech_EPTViewModel.requestId = requestId.ToString();
                packTech_EPTViewModel.username = UserName.Split(Syngenta.ERMS.Common.Constants.SLASH.ToCharArray())[1].ToString();
                if (HttpContext.Current.Session["ifshow"] != null && HttpContext.Current.Session["ifshow"].ToString() == "Yes")
                {
                    packTech_EPTViewModel.packTech_EPTMessageShow = true;
                }
                BaseService baseService = new BaseService();
                if ((baseService.GetOrigitorName(requestId).Rows[0]["Origitor"].ToString().ToUpper() == UserName.ToUpper()) || ((HttpContext.Current.Session[Constants.SESSION_USER_ROLE].ToString().ToUpper()) == "ADMIN"))
                {

                }
                else
                {

                    DisableControls();
                }

                string otherData = packTech_EPTViewModel.GetOtherData;

                string[] sArray = otherData.Split('c');

                int count = -1;

                foreach (string i in sArray)

                    count++;

                if (otherData != string.Empty)
                {
                    string pageCode = string.Empty;
                    pageCode = "PE_EPT";
                    if (base.PageDisable(pageCode, Convert.ToInt32(otherData.Split('~')[0])) == 1)
                    {

                        DisableControls();

                    }
                    else if (base.PageDisable(pageCode, Convert.ToInt32(otherData.Split('~')[0])) == 2)
                    {

                    }

                }

                if (count >= 1 && otherData.Split('~')[1] != string.Empty)
                {
                    if (count >= 4)
                    {
                        string dcf = otherData.Split('~')[4].ToString();
                        int iCoreRange = 0;
                        if (dcf != string.Empty)
                        {

                            iCoreRange = Convert.ToInt32(dcf);

                        }

                        switch (iCoreRange)
                        {
                            case 0:
                                packTech_EPTViewModel.EPMMessage = "EPM input - Add to Core Range = No";
                                break;
                            case 1:
                                packTech_EPTViewModel.EPMMessage = "EPM input - Add to Core Range = Yes";
                                break;
                            default:
                                packTech_EPTViewModel.EPMMessage = "EPM input - ";
                                break;
                        }
                    }
                    if (count >= 5)
                    {
                        string sFASTSource = Convert.ToString(otherData.Split('~')[5]);
                        if (sFASTSource != string.Empty && sFASTSource != null)
                        {
                            packTech_EPTViewModel.FASTMessage = "FAST input - Source = " + sFASTSource;
                        }
                    }
                    if (count >= 6)
                    {
                        string sFASTSourcePlant = Convert.ToString(otherData.Split('~')[6]);
                        if (sFASTSourcePlant != string.Empty && sFASTSourcePlant != null)
                        {
                            packTech_EPTViewModel.FASTMessage = packTech_EPTViewModel.FASTMessage + "<br>Source Plant = " + sFASTSourcePlant + "";
                        }
                    }
                    if (count >= 7)
                    {
                        string sSCTMPackResponsibility = Convert.ToString(otherData.Split('~')[7]);
                        switch (sSCTMPackResponsibility)
                        {
                            case "14":
                                packTech_EPTViewModel.SCTeamMessage = "SC Team input - Pack = Local";
                                break;
                            case "15":
                                packTech_EPTViewModel.SCTeamMessage = "SC Team input - Pack = Regional";
                                break;
                            default:
                                packTech_EPTViewModel.SCTeamMessage = "SC Team input - Pack = null";
                                break;
                        }
                    }
                }
                else
                {

                    packTech_EPTViewModel.EPMMessageShow = false;
                    packTech_EPTViewModel.FASTMessageShow = false;
                    packTech_EPTViewModel.SCTeamMessageShow = false;


                }
                ButtonsDisable();
                return Request.CreateResponse(HttpStatusCode.OK, packTech_EPTViewModel);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "PackTech_EPT");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in PackTech_EPT");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetPackEngineer method of PackEngineer Controller";
                packTech_EPTViewModel.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, packTech_EPTViewModel);
            }
        }

        [HttpPost]
        public HttpResponseMessage SavePackEngineer(PackTech_EPTViewModel packTech_EPTViewModel)
        {
            OperationResultViewModel operationResult = new OperationResultViewModel();
            try
            {
                int i = 0;
                int requestId = Convert.ToInt32(packTech_EPTViewModel.requestId);
                int result = packTech_EPTService.SavePackTechData(requestId, 2, i, UserName, packTech_EPTViewModel);
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
                additionalInfo.Add("PageName", "PackTech_EPT");
                ExceptionManager.Publish(ex, additionalInfo);
                operationResult.ResultCode = Enums.OperationResultCode.Failed;
                operationResult.ResultMsg = ex.Message;
            }
            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }


        public HttpResponseMessage SavePackEngineer1(PackTech_EPTViewModel packTech_EPTViewModel)
        {

            OperationResultViewModel operationResult = new OperationResultViewModel();
            try
            {
                int i = 0;
                int requestId = Convert.ToInt32(packTech_EPTViewModel.requestId);
                int result = packTech_EPTService.SavePackTechData(requestId, 1, i, UserName, packTech_EPTViewModel);
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
                additionalInfo.Add("PageName", "PackTech_EPT");
                ExceptionManager.Publish(ex, additionalInfo);
                operationResult.ResultCode = Enums.OperationResultCode.Failed;
                operationResult.ResultMsg = ex.Message;
            }
            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }

        public HttpResponseMessage SavePackEngineer3(PackTech_EPTViewModel packTech_EPTViewModel)
        {

            OperationResultViewModel operationResult = new OperationResultViewModel();
            try
            {
                int i = 0;
                int requestId = Convert.ToInt32(packTech_EPTViewModel.requestId);
                int result = packTech_EPTService.SavePackTechData(requestId, 3, i, UserName, packTech_EPTViewModel);
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
                additionalInfo.Add("PageName", "PackTech_EPT");
                ExceptionManager.Publish(ex, additionalInfo);
                operationResult.ResultCode = Enums.OperationResultCode.Failed;
                operationResult.ResultMsg = ex.Message;
            }
            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }

        public HttpResponseMessage SubmitPackEngineer1(PackTech_EPTViewModel packTech_EPTViewModel)
        {
            OperationResultViewModel operationResult = new OperationResultViewModel();

            int requestId = Convert.ToInt32(packTech_EPTViewModel.requestId);
            int i = 1;
            try
            {
                int result = packTech_EPTService.SavePackTechData(requestId, 1, i, UserName, packTech_EPTViewModel);


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
                additionalInfo.Add("PageName", "PackTech_EPT");
                ExceptionManager.Publish(ex, additionalInfo);
                operationResult.ResultCode = Enums.OperationResultCode.Failed;
                operationResult.ResultMsg = ex.Message;
            }
            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }

        public HttpResponseMessage SubmitPackEngineer3(PackTech_EPTViewModel packTech_EPTViewModel)
        {
            OperationResultViewModel operationResult = new OperationResultViewModel();

            int requestId = Convert.ToInt32(packTech_EPTViewModel.requestId);
            int i = 1;
            try
            {
                int result = packTech_EPTService.SavePackTechData(requestId, 3, i, UserName, packTech_EPTViewModel);


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
                additionalInfo.Add("PageName", "PackTech_EPT");
                ExceptionManager.Publish(ex, additionalInfo);
                operationResult.ResultCode = Enums.OperationResultCode.Failed;
                operationResult.ResultMsg = ex.Message;
            }
            return Request.CreateResponse(HttpStatusCode.OK, operationResult);
        }


        [NonAction]
        private void DisableControls()
        {

            packTech_EPTViewModel.PackTechNameDisabled = true;
            packTech_EPTViewModel.ESTPackCompDateDisabled = true;
            packTech_EPTViewModel.BPSDesignCodeDisabled = true;
            packTech_EPTViewModel.FormulationADRCompatibleDisabled = true;
            packTech_EPTViewModel.ESTWorkInvolvedDisabled = true;
            packTech_EPTViewModel.BPSAgiCodeDisabled = true;
            packTech_EPTViewModel.NSUCodeDisabled = true;
            packTech_EPTViewModel.CompletedDateDisabled = true;
            packTech_EPTViewModel.ESTPackCompDateDisabled = true;
           
        }


        [NonAction]
        private void ButtonsDisable()
        {
            string otherData = packTech_EPTViewModel.GetOtherData;
            string estCompSubmitDate;
            if (otherData.Split('~').Length == 9)
                estCompSubmitDate = otherData.Split('~')[8];
            else
                estCompSubmitDate = otherData.Split('~')[4];
           
            if (estCompSubmitDate == "")
            {
              
                packTech_EPTViewModel.SubmitStep1Disabled = false;
                packTech_EPTViewModel.SaveStep3Disabled = true;
                packTech_EPTViewModel.SubmitStep3Disabled = true;
            
            }
            else if (packTech_EPTViewModel.GetCompletedDate == "")
            {
                packTech_EPTViewModel.SubmitStep1Disabled = true;
                packTech_EPTViewModel.SaveStep3Disabled = false;
                packTech_EPTViewModel.SubmitStep3Disabled = false;
          
            }
            else
            {
                packTech_EPTViewModel.SubmitStep1Disabled = true;
                packTech_EPTViewModel.SaveStep3Disabled =true;
                packTech_EPTViewModel.SubmitStep3Disabled = false;
            
            }
        }
    }
}
