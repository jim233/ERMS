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
using System.Web.Script.Serialization;
using System.Collections.Specialized;
using Newtonsoft.Json.Linq;
using Syngenta.ERMS.ExceptionManagement;

namespace ERMS.Controllers
{
    public class OtherRangeRequestController : WorkflowBaseController
    {
        protected IOtherRangeRequestService orrService = new OtherRangeRequestService();
        OtherRangeRequestViewModel orrVM = new OtherRangeRequestViewModel();
        Admin admUser = new Admin();
        IAdminService admService = new AdminService();

        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";

        [HttpPost]
        public HttpResponseMessage OtherRRDetails(int requestId)
        {
            try
            {
                orrVM = orrService.GetOtherRequestDetails(requestId);
                string strOtherdata = string.Empty;
                if (orrVM.GetOtherRequestDetails != null)
                {
                    strOtherdata = string.IsNullOrEmpty(orrVM.GetOtherRequestDetails.getOtherData) ? string.Empty : orrVM.GetOtherRequestDetails.getOtherData;
                }
                if (strOtherdata != string.Empty)
                {
                    if (base.PageDisable("OTR", Convert.ToInt32(strOtherdata.Split(',')[0])) == 1)
                        DisableControls();
                    else if (base.PageDisable("OTR", Convert.ToInt32(strOtherdata.Split(',')[0])) == 2)
                    {
                        orrVM.SubmitEnabledOtr = false;
                    }
                }
                return Request.CreateResponse(HttpStatusCode.OK, orrVM);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "OtherRangeRequest");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in loading Other Range request data from Controller");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in OtherRRDetails method of OtherRangeRequest controller.";
                orrVM.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, orrVM);
            }
        }

        [HttpPost]
        public int Save(OtherRangeRequest orrSave)
        {
            int i = 0;
            int iUserAdd = 0;
            try
            {
                if (!string.IsNullOrEmpty(orrSave.Email))
                {
                    admUser.FirstName = orrSave.FirstName;
                    admUser.LastName = orrSave.LastName;
                    admUser.UserId = orrSave.UserId;
                    admUser.Email = orrSave.Email;
                    iUserAdd = admService.AddUserData(admUser);
                }
                i = orrService.SaveOtherRangeRequest(orrSave);
                return i;
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "OtherRangeRequest");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in Saving Other Range request data from Controller");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in Save method of OtherRangeRequest controller.";
                orrVM.ErrorBE = errEntity;
                return errEntity.ErrorNumber;
            }
        }

        public void DisableControls()
        {
            orrVM.othgetCommentsRead = true;
            orrVM.othgetLeadAIEnable = true;
            orrVM.othgetProductLineSellerEnable = true;
            orrVM.othgetDescriptionEnable = true;
            orrVM.othgetCountryPresCodeEnable = true;
            orrVM.othgetUoMEnable = true;
            orrVM.othgetCountryEnable = true;
            orrVM.othLookUpPrescodeEnable = true;
            orrVM.SaveEnabledOtr = true;
            orrVM.SubmitEnabledOtr = true;
        }
    }
}
