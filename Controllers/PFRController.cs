using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Syngenta.ERMS.Services.ServiceInterfaces;
using Syngenta.ERMS.BusinessEntities;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.Common;
using System.Web.Script.Serialization;
using System.Collections.Specialized;
using Newtonsoft.Json.Linq;
using Syngenta.ERMS.ExceptionManagement;

namespace ERMS.Controllers
{
    public class PFRController : WorkflowBaseController
    {
        IPFRService pfrService = new PFRService();
        PFRViewModel pfrVM = new PFRViewModel();
        Admin admUser = new Admin();
        IAdminService admService = new AdminService();
        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";

        [HttpPost]
        public HttpResponseMessage GetPFRData(string requestId)
        {
            try
            {
                pfrVM = pfrService.GetPFRData(Convert.ToInt32(requestId));
                string strOtherData = string.Empty;
                if (pfrVM.PFRReqDetails != null)
                {
                    strOtherData = string.IsNullOrEmpty(pfrVM.PFRReqDetails.getOtherData) ? string.Empty : pfrVM.PFRReqDetails.getOtherData;
                }
                    if (strOtherData != string.Empty)
                    {
                        if (base.PageDisable("PFR", Convert.ToInt32(strOtherData.Split(',')[0])) == 1)
                            DisableControls();
                        else if (base.PageDisable("PFR", Convert.ToInt32(strOtherData.Split(',')[0])) == 2)
                        {
                            pfrVM.SubmitEnablePFR = true;
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.OK, pfrVM);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "PFR");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in loading search realted filters");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetPFRData method of PFRController.";
                pfrVM.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, pfrVM);
            }
        }

        [HttpPost]
        public int Save( PFR pfrSave)
        {
            try
            {
                int i = 0;
                int iUserAdd = 0;
                if (!string.IsNullOrEmpty(pfrSave.Email))
                {
                    admUser.FirstName = pfrSave.FirstName;
                    admUser.LastName = pfrSave.LastName;
                    admUser.UserId = pfrSave.UserId;
                    admUser.Email = pfrSave.Email;
                    iUserAdd = admService.AddUserData(admUser);
                }
                if (!string.IsNullOrEmpty(pfrSave.SecondUserEmail))
                {
                    admUser.FirstName = pfrSave.SecondUserFirstName;
                    admUser.LastName = pfrSave.SecondUserLastName;
                    admUser.UserId = pfrSave.SecondUserId;
                    admUser.Email = pfrSave.SecondUserEmail;
                    iUserAdd = admService.AddUserData(admUser);
                }
                i = pfrService.SavePFRData(pfrSave);
                return i;
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "PFR Request Save");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in Saving PFR request");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in Save method of PFRController";
                pfrVM.ErrorBE = errEntity;
                return errEntity.ErrorNumber;
            }
        }

        [NonAction]
        public void DisableControls()
        {
            pfrVM.PFRLeadAIEnable = true;
            pfrVM.PFRDesignCodeEnable = true;
            pfrVM.PFRAgiCodeEnable = true;
            pfrVM.PFRQuantityPackSizeEnable = true;
            pfrVM.PFRgetConfigurationorCollationEnable = true;
            pfrVM.UOMSelectedEnable = true;
            pfrVM.PLSselectedEnable = true;
            pfrVM.PFRgetTradeNameEnable = true;
            pfrVM.COSselectedEnable = true;
            pfrVM.PFRgetCountryPresCodeRead = true;
            pfrVM.PFRgetSupplierEnable = true;
            pfrVM.btnLookUpPresCodeEnable = true;
            pfrVM.SubmitEnablePFR = true;
            pfrVM.RegContactEnable = true;
            pfrVM.GALDisable = true;
            pfrVM.PFRCinOEnable = true;
            pfrVM.PFRgetRegulatoryContactEnable = true;
            pfrVM.PFRMTOselectedEnable = true;
        }
    }
}
