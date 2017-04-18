using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Syngenta.ERMS.BusinessEntities;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.Services.ServiceInterfaces;
using Syngenta.ERMS.Common.ViewModels;
using System.Web;
using System.Web.Script.Serialization;
using System.Collections.Specialized;
using Newtonsoft.Json.Linq;
using Syngenta.ERMS.ExceptionManagement;
using Syngenta.ERMS.Common;

namespace ERMS.Controllers
{
    public class GSCM_SupplyChainController : WorkflowBaseController
    {
        protected IGSCM_SupplyChainMgrService gscmService = new GSCM_SupplyChainMgrService();
        protected GSCM_SupplyChainMgrViewModel gscmVM = new GSCM_SupplyChainMgrViewModel();
        BaseService baseService = new BaseService();
        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";

        public class GetReqParam
        {
            public string RequestID { get; set; }
            public string approvalStep { get; set; }
        }

        [HttpPost]
        public HttpResponseMessage GetGSCMDetails(GetReqParam temp)
        {
            try
            {
                gscmVM = gscmService.GetGSCMSupplyChainDetails(Convert.ToInt32(temp.approvalStep), Convert.ToInt32(temp.RequestID));
                gscmVM.GSCMReqDetails.UserId = HttpContext.Current.Session["FullUserName"].ToString();
                string strOtherData = string.IsNullOrEmpty(gscmVM.GSCMReqDetails.status) ? string.Empty : gscmVM.GSCMReqDetails.status;
                if (Convert.ToInt32(temp.approvalStep) == 1)
                {
                    if (strOtherData != "" || strOtherData != string.Empty)
                    {
                        string pageCode = string.Empty;
                        pageCode = "GSCM1_SC";
                        if (base.PageDisable(pageCode, Convert.ToInt32(strOtherData)) == 1)
                        {
                            DisableControls();
                        }
                        else if (base.PageDisable(pageCode, Convert.ToInt32(strOtherData)) == 2)
                        {
                            gscmVM.SaveDisabledGSCM = true;
                            gscmVM.SubmitDisabledGSCM = true;
                        }
                    }
                }
                else
                {
                    if (strOtherData != "")
                    {
                        string pageCode = string.Empty;
                        pageCode = "GSCM2_SC";
                        if (base.PageDisable(pageCode, Convert.ToInt32(strOtherData)) == 1)
                        {
                            DisableControls();
                        }
                        else if (base.PageDisable(pageCode, Convert.ToInt32(strOtherData)) == 2)
                        {
                            gscmVM.SaveDisabledGSCM = true;
                            gscmVM.SubmitDisabledGSCM = true;
                        }
                    }
                }
                if ((baseService.GetOrigitorName(Convert.ToInt32(temp.RequestID)).Rows[0]["Origitor"].ToString().ToUpper() == UserName.ToUpper()) || ((HttpContext.Current.Session[Constants.SESSION_USER_ROLE].ToString().ToUpper()) == "ADMIN"))
                {
                    //If true then dont do anything
                }
                else
                {

                    DisableControls();
                }
                return Request.CreateResponse(HttpStatusCode.OK, gscmVM);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "GSCM");
                ExceptionManager.Publish(ex, additionalInfo);
                Message = errMessages.GetString(Constants.Err_PageLoad);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = Message;
                gscmVM.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, gscmVM);
            }

        }

        [HttpPost]
        public int SaveorSubmit(GSCM_SupplyChainMgr gscmSave)
        {
            try
            {
                int iResult = 0;
                iResult = gscmService.SaveGSCMSupplyChainData(gscmSave);
                return iResult;
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "GSCM");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString(Constants.Err_PageLoad);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error occured in SaveorSubmit method of GSCM_SupplyChain controller";
                gscmVM.ErrorBE = errEntity;
                return errEntity.ErrorNumber;
            }
        }

        [NonAction]
        private void DisableControls()
        {
            gscmVM.MgrReadOnly = true;
            gscmVM.GSCMApproval = true;
            gscmVM.MgrComments = true;
            gscmVM.SaveDisabledGSCM = true;
            gscmVM.SubmitDisabledGSCM = true;
            gscmVM.MgrDateDisabled = true;
        }
    }
}
