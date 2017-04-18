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

namespace ERMS.Controllers
{
    public class MDMIDSController : WorkflowBaseController
    {
        IMDMIDSService mdmService = new MDMIDSService();
        Syngenta.ERMS.Common.ViewModels.MDMIDS mdmVM = new Syngenta.ERMS.Common.ViewModels.MDMIDS();

        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";

        [HttpPost]
        public HttpResponseMessage GetIDSDetails(int RequestID)
        {
            try
            {
                mdmVM = mdmService.GetIDSDetails(RequestID);

                if (HttpContext.Current.Session["ifshow"] != null && HttpContext.Current.Session["ifshow"].ToString() == "Yes")
                {
                    mdmVM.RectivationReq = true;
                }
                string strOtherData = string.Empty;
                strOtherData = mdmVM.mdmReqDetails.OtherData;
                if (strOtherData != string.Empty)
                {
                    if (base.PageDisable("IDS", Convert.ToInt32(strOtherData.Split(',')[0])) == 1)
                    {
                        DisableControls();
                    }
                    else if (base.PageDisable("IDS", Convert.ToInt32(strOtherData.Split(',')[0])) == 2)
                    {
                        mdmVM.SubmitEnableIDS = true;
                    }
                }
                return Request.CreateResponse(HttpStatusCode.OK, mdmVM);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "MDMIDS");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in loading IDS page");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetIDSDetails method of MDMIDS controller.";
                mdmVM.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, mdmVM);
            }
        }

        [HttpPost]
        public int SaveorSubmit(Syngenta.ERMS.BusinessEntities.MDMIDS mdmSave)
        {
            int iResult = 0;
            try
            {
                iResult = mdmService.SaveIDSDetails(mdmSave);
                return iResult;
            }
            catch (Exception ex)
            {
                
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "MDMIDS");
                ExceptionManager.Publish(ex, additionalInfo);
                ///Message = errMessages.GetString("Error in SAve/Submit IDS page");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in SaveorSubmit method od MDMIDS controller.";
                mdmVM.ErrorBE = errEntity;
                return errEntity.ErrorNumber;
            }
        }
        [NonAction]
        public void DisableControls()
        {
            mdmVM.designcodeEnable = true;
            mdmVM.ucagicodeEnable = true;
            mdmVM.SubmitEnableIDS = true;
            mdmVM.SaveEnableIDS = true;
        }
    }
}
