using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Syngenta.ERMS.BusinessEntities;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.Common;
using Syngenta.ERMS.Services.ServiceInterfaces;
using System.Collections.Specialized;
using Newtonsoft.Json.Linq;
using Syngenta.ERMS.ExceptionManagement;
using Newtonsoft.Json;


namespace ERMS.Controllers
{
    public class EPTRangeRequestController : WorkflowBaseController
    {
        protected IEPTRangeRequestService eptService = new EPTRangeRequestService();
        EPTRangeRequestViewModel eptVM = new EPTRangeRequestViewModel();
        ICombiPackRequestService cmbService = new CombiPackRequestService();
        DateTime dtdateTime = new DateTime();
        int i = 0;
        ErrorEntity errEntity = new ErrorEntity();
        public class GetReqParam
        {
            public string RequestID { get; set; }
            public string Copy { get; set; }
            public string FromSave { get; set; }
        }

        [HttpPost]
        public int Save(EPTRangeRequestSave eptsave)
        {
            try
            {
                int i = 0;
                i = eptService.SaveEPTData(eptsave);
                return i;
            }
            catch (Exception ex)
            { 
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "EPT Save");
                ExceptionManager.Publish(ex, additionalInfo);
                return -1;
            }
        }
        [HttpPost]
        public int submit(EPTRangeRequestSave eptsave)
        {
            try
            {
            int i = 0;
            i = eptService.SaveEPTData(eptsave);
            return i;
        }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "EPT Submit");
                ExceptionManager.Publish(ex, additionalInfo);
                return -1;
            }
        }
        [HttpPost]
        public HttpResponseMessage EPTRangeDetails(GetReqParam temp)
        {
            try
            {
            eptVM = eptService.GetEPTRequestDetails(Convert.ToInt32(temp.RequestID), Convert.ToInt32(temp.Copy));

            if (temp.Copy != null && temp.Copy != "0")
            {
                i = 1;
                int ret = cmbService.GetNumberofDays("EPT-Copy");
                dtdateTime = DateTime.Now.AddDays(ret);
                eptVM.MTOShow = false;
                DisableCopy(temp.Copy);
            }
            else
            {
                int ret = cmbService.GetNumberofDays("EPT");
                dtdateTime = DateTime.Now.AddDays(ret);
                eptVM.MTOShow = true;
                DisableCopy(temp.Copy);
                eptVM.disableCopy = true;
            }

            int iIsParent = Convert.IsDBNull(eptVM.EPTRangeReq.parent) ? 0 : eptVM.EPTRangeReq.parent;
            if (iIsParent == 1)
            {
                i = 1;
                eptVM.disableCopy = true;
                eptVM.CommentsSectionShow = false;
                eptVM.TypeHereAI = false;
                DisableCopy(temp.Copy);
            }
            //Call presenter function and sets the value of the table on the screen
            eptVM.GetCopyRequestNos = eptService.GetCopyRequestDetails(Convert.ToInt32(temp.RequestID));

            string strOther = string.IsNullOrEmpty(eptVM.EPTRangeReq.OtherData) ? string.Empty : eptVM.EPTRangeReq.OtherData;
            if (strOther != string.Empty)
            {
                if (strOther.Split(',')[0].ToString() != string.Empty)
                {
                    if (Convert.ToInt32(strOther.Split(',')[0]) == 1)
                    {
                        eptVM.disableCopy = false;
                    }
                    //For disabling the page if request is already submitted
                    if (base.PageDisable("EPT", Convert.ToInt32(strOther.Split(',')[0])) == 1)
                        DisableControls();
                    //commented by Jayashree
                    else if (base.PageDisable("EPT", Convert.ToInt32(strOther.Split(',')[0])) == 2) //&& Request.QueryString["Copy"] == null)
                    {
                        eptVM.SubmitEnableEPT = true;
                    }
                }
                }
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Get EPT Range details");
                ExceptionManager.Publish(ex, additionalInfo);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in Get EPT Range details";
                eptVM.ErrorBE = errEntity;
            }
            return Request.CreateResponse(HttpStatusCode.OK, eptVM);
        }
        [NonAction]
        public void DisableControls()
        {
            eptVM.EPTgetNotOriginatorEnable = true;
            eptVM.EPTgetLeadAIEnable = true;
            eptVM.SMSTermEnable = true;
            eptVM.EPTgetDesignCodeEnable = true;
            eptVM.EPTgetCategoryEnable = true;
            eptVM.EPTgetFDesEnable = true;
            eptVM.EPTgetUCAgiCodeEnable = true;
            eptVM.EPTgetQtyEnable = true;
            eptVM.EPTgetConfigurationEnable = true;
            eptVM.EPTgetUOMEnable = true;
            eptVM.EPTgetAncillariesEnable = true;
            eptVM.EPTgetPLSEnable = true;
            eptVM.EPTgetTradeNameEnable = true;
            eptVM.EPTgetCountryOfSaleEnable = true;
            eptVM.EPTgetCountryPresCodeRead = true;
            eptVM.EPTgetDateOfFirstSaleEnable = true;
            eptVM.EPTgetRegContactEnable = true;
            eptVM.RegGALEPT = true;
            eptVM.OrgGALEPT = true;
            eptVM.LookupPrescodeEPT = true;
            eptVM.SubmitEnableEPT = true;
            eptVM.SaveEnableEPT = true;
            eptVM.EPTgetAncillariesEnable = true;
            eptVM.ddlAncillariesYesNocommentsEnable = true;
            eptVM.EPTgetProductCategoryEnable = true;
            eptVM.EPTGetMakeToOrderEnable = true;
        }
        [NonAction]
        public void DisableCopy(string iCopy)
        {
            if (iCopy != null && iCopy != "0")
            {
                eptVM.disableCopy = true;
                //Copy gridview is missing
                eptVM.EPTgetLeadAIEnable = true;
                eptVM.EPTgetDesignCodeEnable = true;
                eptVM.EPTgetCategoryEnable = true;
                eptVM.EPTgetFDesEnable = true;
                eptVM.EPTgetUCAgiCodeEnable = true;
                eptVM.EPTgetQtyEnable = true;
                eptVM.EPTgetConfigurationEnable = true;
                eptVM.EPTgetUOMEnable = true;
                eptVM.SMSTermEnable = true;
                eptVM.EPTgetAncillariesEnable = true;
                eptVM.ddlAncillariesYesNocommentsEnable = true;
                eptVM.showTextarea = true;
                eptVM.CommentsSectionShow = false;
                eptVM.TypeHereAI = false;
            }
            else
            {
                eptVM.CommentsSectionShow = true;
                eptVM.TypeHereAI = true;
            }
        }
    }
}
