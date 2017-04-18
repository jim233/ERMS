using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.Services.ServiceInterfaces;
using Syngenta.ERMS.BusinessEntities;
using Syngenta.ERMS.Common.ViewModels;
using System.Web;
using System.Web.Script.Serialization;
using System.Collections.Specialized;
using Newtonsoft.Json.Linq;
using Syngenta.ERMS.ExceptionManagement;
using Syngenta.ERMS.Common;

namespace ERMS.Controllers
{
    public class RDMController : WorkflowBaseController
    {
        protected IRDMService rdmService = new RDMService();
        protected RDMViewModel rdmVM = new RDMViewModel();
        Admin admUser = new Admin();
        IAdminService admService = new AdminService();
        int ReqType;

        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";

        [HttpPost]
        public HttpResponseMessage RDMDetails(string RequestID)
        {
            try
            {
                rdmVM = rdmService.GetRDMRequestDetails(Convert.ToInt32(RequestID));

                if (HttpContext.Current.Session["ifshow"] != null && HttpContext.Current.Session["ifshow"].ToString() == "Yes")
                {
                    rdmVM.RectivationReq = true;
                }
                string strOtherData = string.Empty;
                strOtherData = string.IsNullOrEmpty(rdmVM.rdmBEV.GetOtherData) ? string.Empty : rdmVM.rdmBEV.GetOtherData;
                if (strOtherData != string.Empty)
                {
                    ReqType = Convert.ToInt32(strOtherData.Split(',')[1]);
                }
                if (ReqType == 8)
                {
                    rdmVM.DatePU2SU = true;
                    rdmVM.PUtoSUmdtryMess = true;
                }
                if (ReqType == 3)
                {
                    //Label is not there in design - refer RDM_EPT.aspx - trExistingNSUTR
                }

                if (rdmVM.rdmBEV.GetMoreDataReq == true)
                {
                    rdmVM.ddlMoreDataReqReasonenable = false;
                    rdmVM.RDMnotesenable = false;
                }
                else
                {
                    rdmVM.ddlMoreDataReqReasonenable = true;
                    rdmVM.RDMnotesenable = true;
                }

                if (strOtherData != string.Empty)
                {
                    if (ReqType == 1 || ReqType == 8)
                    {
                        if (base.PageDisable("RDM_EPT", Convert.ToInt32(strOtherData.Split(',')[0])) == 1)
                            DisableControls();
                        else if (base.PageDisable("RDM_EPT", Convert.ToInt32(strOtherData.Split(',')[0])) == 2)
                        {
                            rdmVM.SubmitEnableRDM = true;
                        }
                    }
                    else if (ReqType == 2)
                    {
                        if (base.PageDisable("RDM_NP", Convert.ToInt32(strOtherData.Split(',')[0])) == 1)
                            DisableControls();
                        else if (base.PageDisable("RDM_NP", Convert.ToInt32(strOtherData.Split(',')[0])) == 2)
                        {
                            rdmVM.SubmitEnableRDM = true;
                        }
                    }
                    else if (ReqType == 3)
                    {
                        if (base.PageDisable("RDM_CA", Convert.ToInt32(strOtherData.Split(',')[0])) == 1)
                            DisableControls();
                        else if (base.PageDisable("RDM_CA", Convert.ToInt32(strOtherData.Split(',')[0])) == 2)
                        {
                            rdmVM.SubmitEnableRDM = true;
                        }
                    }
                    else if (ReqType == 4)
                    {
                        if (base.PageDisable("RDM_SC", Convert.ToInt32(strOtherData.Split(',')[0])) == 1)
                            DisableControls();
                        else if (base.PageDisable("RDM_SC", Convert.ToInt32(strOtherData.Split(',')[0])) == 2)
                        {
                            rdmVM.SubmitEnableRDM = true;
                        }
                    }
                    else if (ReqType == 5)
                    {
                        if (base.PageDisable("RDM_CMBI", Convert.ToInt32(strOtherData.Split(',')[0])) == 1)
                            DisableControls();
                        else if (base.PageDisable("RDM_CMBI", Convert.ToInt32(strOtherData.Split(',')[0])) == 2)
                        {
                            rdmVM.SubmitEnableRDM = true;
                        }
                    }
                    else if (ReqType == 6)
                    {
                        if (base.PageDisable("RDM_PFR", Convert.ToInt32(strOtherData.Split(',')[0])) == 1)
                            DisableControls();
                        else if (base.PageDisable("RDM_PFR", Convert.ToInt32(strOtherData.Split(',')[0])) == 2)
                        {
                            rdmVM.SubmitEnableRDM = true;
                        }
                    }
                    else if (ReqType == 7)
                    {
                        if (base.PageDisable("RDM_OTR", Convert.ToInt32(strOtherData.Split(',')[0])) == 1)
                            DisableControls();
                        else if (base.PageDisable("RDM_OTR", Convert.ToInt32(strOtherData.Split(',')[0])) == 2)
                        {
                            rdmVM.SubmitEnableRDM = true;
                        }
                    }
                }
                if (strOtherData != string.Empty)
                {
                    if ((strOtherData.Split(',')[0]) != string.Empty && (strOtherData.Split(',')[0].ToString()) == "5")
                    {
                        rdmVM.RDMMoreDataReqdEnableYes = true;
                        rdmVM.RDMMoreDataReqdEnableNo = true;
                        rdmVM.RDMSelectedSUPUNSUEnable = true;
                    }
                }
                return Request.CreateResponse(HttpStatusCode.OK, rdmVM);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "RDM");
                ExceptionManager.Publish(ex, additionalInfo);
                Message = errMessages.GetString(Constants.Err_PageLoad);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = Message;
                rdmVM.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, rdmVM);
            }
        }

        [HttpPost]
        public int SaveorSubmit(RDM rdmBE)
        {
            int iResult = 0;
            int iUserAdd = 0;
            try
            {
                if (!string.IsNullOrEmpty(rdmBE.Email))
                {
                    admUser.FirstName = rdmBE.FirstName;
                    admUser.LastName = rdmBE.LastName;
                    admUser.UserId = rdmBE.UserId;
                    admUser.Email = rdmBE.Email;
                    iUserAdd = admService.AddUserData(admUser);
                }
                if (!string.IsNullOrEmpty(rdmBE.SecondUserEmail))
                {
                    admUser.FirstName = rdmBE.SecondUserFirstName;
                    admUser.LastName = rdmBE.SecondUserLastName;
                    admUser.UserId = rdmBE.SecondUserId;
                    admUser.Email = rdmBE.SecondUserEmail;
                    iUserAdd = admService.AddUserData(admUser);
                }
                iResult = rdmService.SaveRDMDetails(rdmBE);
                return iResult;
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "RDM");
                ExceptionManager.Publish(ex, additionalInfo);
                Message = errMessages.GetString(Constants.Err_SaveClick);
                errEntity.ErrorNumber = 420;
                //errEntity.ErrorMess = Message;
                rdmVM.ErrorBE = errEntity;
                return errEntity.ErrorNumber;
            }
        }
        [NonAction]
        public void DisableControls ()
        {
            rdmVM.RDMAAgiCodeRead = true;
            rdmVM.RDMDateCodeRaisedEnable = true;
            rdmVM.RDMGetPUtoSUPromotedDateEnable = true;
            rdmVM.RDMrdmContactEnable = true;
            rdmVM.RDMCommentsRead = true;
            rdmVM.RDMnotesenable = true;
            rdmVM.ddlMoreDataReqReasonenable = true;
            rdmVM.RDMSelectedSUPUNSUEnable = true;
            rdmVM.RDMMoreDataReqdEnableYes = true;
            rdmVM.RDMMoreDataReqdEnableNo = true;
            rdmVM.SaveEnableRDM = true;
            rdmVM.SubmitEnableRDM = true;
            rdmVM.RDMMreDataReqdContactEnable = true;
            rdmVM.RDMSUCodeCompltdDateEnable = true;
            rdmVM.RDMCoreNSUEnable = true;
            //Label is not there in design - refer RDM_EPT.aspx - trExistingNSUTR
        }
    }
}
