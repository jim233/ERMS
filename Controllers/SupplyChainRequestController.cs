using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Syngenta.ERMS.Services.ServiceInterfaces;
using Syngenta.ERMS.BusinessEntities;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.Common.ViewModels;
using System.Collections.Specialized;
using Newtonsoft.Json.Linq;
using Syngenta.ERMS.ExceptionManagement;
using Syngenta.ERMS.Common;

namespace ERMS.Controllers
{
    public class SupplyChainRequestController : WorkflowBaseController
    {
        ISupplyChainRequestService scrService = new SupplyChainRequestService();
        SupplyChainRequestViewModel scrVM = new SupplyChainRequestViewModel();
        Admin admUser = new Admin();
        IAdminService admService = new AdminService();

        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";

        [HttpPost]
        public HttpResponseMessage SCRgetDetails(int requestId)
        {
            try
            {
                scrVM = scrService.GetSupplyChainDetails(requestId);
                string strOtherData = string.Empty;
                if (scrVM.GetSupplyChainDetails != null)
                {
                    strOtherData = string.IsNullOrEmpty(scrVM.GetSupplyChainDetails.GetOtherData) ? string.Empty : scrVM.GetSupplyChainDetails.GetOtherData;
                }
                if (strOtherData != string.Empty)
                {
                    if (base.PageDisable("SC", Convert.ToInt32(strOtherData.Split(',')[0])) == 1)
                    {
                        DisableControls();
                    }
                    else if (base.PageDisable("SC", Convert.ToInt32(strOtherData.Split(',')[0])) == 2)
                    {
                        scrVM.SubmitEnabledSC = true;
                    }
                }
                return Request.CreateResponse(HttpStatusCode.OK, scrVM);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Supply Chain Request");
                ExceptionManager.Publish(ex, additionalInfo);
                Message = errMessages.GetString(Constants.Err_PageLoad);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = Message;
                scrVM.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, scrVM);
            }
        }

        [HttpPost]
        public int Saveorsubmit(SupplyChainRequest scrSave)
        {
            int i = 0;
            int iUserAdd = 0;
            try
            {
                if (!string.IsNullOrEmpty(scrSave.Email))
                {
                    admUser.FirstName = scrSave.FirstName;
                    admUser.LastName = scrSave.LastName;
                    admUser.UserId = scrSave.UserId;
                    admUser.Email = scrSave.Email;
                    iUserAdd = admService.AddUserData(admUser);
                }

                i = scrService.SaveSupplyChainData(scrSave);
                return i;
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Supply Chain Request");
                ExceptionManager.Publish(ex, additionalInfo);
                Message = errMessages.GetString(Constants.Err_SaveClick);
                errEntity.ErrorNumber = 420;
                //errEntity.ErrorMess = Message;
                scrVM.ErrorBE = errEntity;
                return errEntity.ErrorNumber;
            }
        }

        public void DisableControls()
        {
            scrVM.SCGGetBackgroundInformationRead = true;
            scrVM.SCGetCurrentDesignCodeVariantnumberEnable = true;
            scrVM.SCGetCurrentPackEnable = true;
            scrVM.SCGetCurrentSourceEnable = true;
            scrVM.SCGetCurrentUCAgiCodeEnable = true;
            scrVM.SCGetDateChangeEnable = true;
            scrVM.SCGetDetailsChangeLeadAIEnable = true;
            scrVM.SCGetNewDesignCodeVariantnumberEnable = true;
            scrVM.SCGetNewPackEnable = true;
            scrVM.SCGetNewSourceEnable = true;
            scrVM.SCGetNewUCAgiCodeEnable = true;
            scrVM.SCGetNotOrgDataEnable = true;
            scrVM.SubmitEnabledSC = true;
            scrVM.SaveEnabledSC = true;
            scrVM.galDisable = true;
            scrVM.SCGetSelectedMakeToOrderEnable = true;
        }
    }
}
