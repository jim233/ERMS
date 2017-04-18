using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Syngenta.ERMS.BusinessEntities;
using Syngenta.ERMS.Common;
using Syngenta.ERMS.Common.ViewModels;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.Services.Services;
using Syngenta.ERMS.Services.ServiceInterfaces;
using System.Web.Script.Serialization;
using System.Collections.Specialized;
using Newtonsoft.Json.Linq;
using Syngenta.ERMS.ExceptionManagement;

namespace ERMS.Controllers
{
    public class NewPackRequestController : WorkflowBaseController
    {
        INewPackRequestService NewPackReqService;
        NewPackRequestViewModel npReqVM;
        ICombiPackRequestService cmbService;
        Admin admUser = new Admin();
        IAdminService admService = new AdminService();
        int isChild = 0;

        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";

        [HttpPost]
        public HttpResponseMessage GetNewPackDetails(GetReqParam temp)
        {
            NewPackReqService = new NewPackRequestService();
            npReqVM = new NewPackRequestViewModel();
            cmbService = new CombiPackRequestService();
            DateTime dtFirstSaleCheck = new DateTime();
            //npReqVM = NewPackReqService.GetNewRequestDetails(Convert.ToInt32(reqID), Convert.ToInt32(reqType));
            try
            {
                if (temp.RequestID != string.Empty)
                {
                    npReqVM = NewPackReqService.GetNewRequestDetails(Convert.ToInt32(temp.RequestID), Convert.ToInt32(temp.ReqType));
                }
                else
                {
                    npReqVM = NewPackReqService.GetNewRequestDetails(0, Convert.ToInt32(temp.ReqType));
                }


                if (npReqVM.NewPackRequest != null && npReqVM.NewPackRequest.GetReactivation_Request == "1")
                {
                    HttpContext.Current.Session["ifshow"] = "Yes";
                }
                else
                {
                    HttpContext.Current.Session["ifshow"] = "No";
                }

                if (Convert.ToInt32(temp.ReqType) == 2)
                {
                    int ret = cmbService.GetNumberofDays("New Pack");
                    dtFirstSaleCheck = DateTime.Now.AddDays(ret);
                    npReqVM.NPCAPresonSynBrandPack = true;
                }
                else if (Convert.ToInt32(temp.ReqType) == 3)
                {
                    int ret = cmbService.GetNumberofDays("Country Add");
                    dtFirstSaleCheck = DateTime.Now.AddDays(ret);
                    npReqVM.NPCAPresonSynBrandPack = false;
                }

                //SOCB - LRMS change - Added Procurement Manager
                npReqVM.ProcurementManager = HttpContext.Current.Session[Constants.USER_REGION].ToString().Equals(Constants.REGION_LATAM) ? true : false;
                //EOCB - LRMS change - Added Procurement Manager

                DisplayTypeSpecificFields(Convert.ToInt32(temp.ReqType), 0);
                if (npReqVM.NewPackRequest != null)
                {
                    isChild = Convert.IsDBNull(npReqVM.NewPackRequest.GetIsChild) ? 0 : npReqVM.NewPackRequest.GetIsChild;
                    if (Convert.ToInt32(temp.ReqType) == 2 && isChild != 1)
                    {
                        //check with team
                    }

                    DisplayTypeSpecificFields(Convert.ToInt32(temp.ReqType), isChild);
                    string strOther = string.IsNullOrEmpty(npReqVM.NewPackRequest.GetOtherData) ? string.Empty : npReqVM.NewPackRequest.GetOtherData;
                    if (strOther != string.Empty)
                    {
                        if (strOther.Split(',')[0] != string.Empty)
                        {
                            if (Convert.ToInt32(temp.ReqType) == 3)
                            {
                                if (base.PageDisable("CA", Convert.ToInt32(strOther.Split(',')[0])) == 1)
                                    DisableControls();
                                else if (base.PageDisable("CA", Convert.ToInt32(strOther.Split(',')[0])) == 2)
                                {
                                    npReqVM.SubmitEnabledNPR = true;
                                }
                            }
                            else if (Convert.ToInt32(temp.ReqType) == 2)
                            {
                                if (base.PageDisable("NP", Convert.ToInt32(strOther.Split(',')[0])) == 1)
                                    DisableControls();
                                else if (base.PageDisable("NP", Convert.ToInt32(strOther.Split(',')[0])) == 2)
                                {
                                    npReqVM.SubmitEnabledNPR = true;
                                }
                            }

                        }
                    }
                }
                npReqVM.Region = HttpContext.Current.Session["Region"] != null ? HttpContext.Current.Session["Region"].ToString() : string.Empty;
                return Request.CreateResponse(HttpStatusCode.OK, npReqVM);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "NewPackRequest");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in loading Other Range request data from Controller");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetNewPackDetails method of NewPackRequest controller." + ex.InnerException;
                npReqVM.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, npReqVM);
            }
        }

        public class GetReqParam
        {
            public string RequestID { get; set; }
            public string ReqType { get; set; }
            public string Copy { get; set; }
            public string FromSave { get; set; }
            public string IsNew { get; set; }
        }

        [HttpPost]
        public int SaveorSubmitReq(NewPackRequestSelected nprSelectedSave)
        {
            NewPackReqService = new NewPackRequestService();
            try
            {
                int i = 0;
                int iUserAdd = 0;
                if (!string.IsNullOrEmpty(nprSelectedSave.Email))
                {
                    admUser.FirstName = nprSelectedSave.FirstName;
                    admUser.LastName = nprSelectedSave.LastName;
                    admUser.UserId = nprSelectedSave.UserId;
                    admUser.Email = nprSelectedSave.Email;
                    iUserAdd = admService.AddUserData(admUser);
                }
                if (!string.IsNullOrEmpty(nprSelectedSave.SecondUserEmail))
                {
                    admUser.FirstName = nprSelectedSave.SecondUserFirstName;
                    admUser.LastName = nprSelectedSave.SecondUserLastName;
                    admUser.UserId = nprSelectedSave.SecondUserId;
                    admUser.Email = nprSelectedSave.SecondUserEmail;
                    iUserAdd = admService.AddUserData(admUser);
                }
                //SOCB - LRMS change - Submit Request to procurement Manager
                if (!string.IsNullOrEmpty(nprSelectedSave.SecondUserEmail))
                {
                    admUser.FirstName = nprSelectedSave.ProcMgrFirstName;
                    admUser.LastName = nprSelectedSave.ProcMgrLastName;
                    admUser.UserId = nprSelectedSave.ProcMgrUserId;
                    admUser.Email = nprSelectedSave.ProcMgrEmail;
                    iUserAdd = admService.AddUserData(admUser);
                }
                //EOCB - LRMS change - Submit Request to procurement Manager
                i = NewPackReqService.SaveNewRequestDetails(nprSelectedSave);
                return i;
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "NewPackRequest");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in loading Other Range request data from Controller");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in SaveorSubmitReq method of NewPackRequest controller." + ex.InnerException;
                npReqVM.ErrorBE = errEntity;
                return errEntity.ErrorNumber;
            }
        }

        public void DisableControls()
        {
            npReqVM.leadAIIDEnable = true;
            //Dropdown on leadAI missing
            npReqVM.GetDesignCodeEnable = true;
            npReqVM.GetUCagicodeEnable = true;
            npReqVM.GetQuantityPackSizeEnable = true;
            npReqVM.GetConfigurationCollationEnable = true;
            npReqVM.UOMselectedEnable = true;
            npReqVM.GetAncillariesSpecialReqEnable = true;
            npReqVM.PLSselectedEnable = true;
            npReqVM.GetTradeNameEnable = true;
            npReqVM.countrySaleSelectedEnable = true;
            npReqVM.GetCountryPresCodeRead = true;
            npReqVM.GetDateofFirstSaleEnable = true;
            npReqVM.GetCountryPresCodeLink = true;
            npReqVM.SubmitEnabledNPR = true;
            npReqVM.SaveEnabledNPR = true;
            npReqVM.PCselectedEnable = true;
            npReqVM.ddlAncillariesEnable = true;
            npReqVM.SourceLocallyYes = true;
            npReqVM.SourceLocallyNo = true;
            npReqVM.OrgGAL = true;
            npReqVM.RegGAL = true;
            npReqVM.GetNSUCodeEnable = true;
            npReqVM.GetSupplierRead = true;
            npReqVM.GetMarketingJustificationRead = true;
            npReqVM.originatorIdEnable = true;
            npReqVM.GetRegulatoryContactEnable = true;
            npReqVM.showTextarea = true;
            npReqVM.MTOselectedEnable = true;
            npReqVM.SPACselectedEnable = true;
            //Part filled textbox missing
            //SU AGI code textbox missing
        }

        public void DisplayTypeSpecificFields(int RequestType,int isChild)
        {
            if (RequestType == 3)
            {
                npReqVM.showSupplier = false;
                npReqVM.sourceDiv = false;
                npReqVM.GetDesignCodeEnable = true;
                npReqVM.GetUCagicodeEnable = true;
                npReqVM.GetQuantityPackSizeEnable = true;
                npReqVM.UOMselectedEnable = true;
                npReqVM.PLSselectedEnable = true;
                npReqVM.GetConfigurationCollationEnable = true;
                npReqVM.GetNSUCodeEnable = true;
                npReqVM.ShowAncillariesTextarea = true;
                npReqVM.NSUShow = true;
                npReqVM.StandardAncillariesshow = true;
                npReqVM.ProductCategoryShow = true;
                npReqVM.dateofFirstSaleshow = true;
                npReqVM.yeartableShow = true;
                npReqVM.MrktJustificationShow = true;
                npReqVM.RegContactShow = true;
                npReqVM.NotOrgShow = true;
                npReqVM.CountryOfSaleShow = true;
                npReqVM.CntryPresCodeShow = true;
                npReqVM.NoteShow = false;
                npReqVM.PartFilledShow = false;
                npReqVM.SUAgiCodeShow = false;
            }
            if (isChild == 1)
            {
                npReqVM.leadAIIDEnable = false;
                npReqVM.GetDesignCodeEnable = false;
                npReqVM.GetUCagicodeEnable = false;
                npReqVM.GetQuantityPackSizeEnable = false;
                npReqVM.GetConfigurationCollationEnable = false;
                npReqVM.ShowAncillariesTextarea = false;
                npReqVM.UOMselectedEnable = false;
                npReqVM.PLSselectedEnable = false;
                npReqVM.NSUShow = false;
                npReqVM.StandardAncillariesshow = false;
                npReqVM.showSupplier = false;
                npReqVM.sourceDiv = true;
                npReqVM.ProductCategoryShow = false;
                npReqVM.dateofFirstSaleshow = false;
                npReqVM.yeartableShow = false;
                npReqVM.MrktJustificationShow = false;
                npReqVM.RegContactShow = false;
                npReqVM.SubmitEnabledNPR = true;
                npReqVM.NotOrgShow = false;
                npReqVM.CountryOfSaleShow = false;
                npReqVM.CntryPresCodeShow = false;
                npReqVM.NoteShow = false;
                npReqVM.PartFilledShow = true;
                npReqVM.SUAgiCodeShow = true;
            }
            if(RequestType == 2 && isChild != 1)
            {
                npReqVM.showSupplier = true;
                npReqVM.sourceDiv = true;
                npReqVM.ShowAncillariesTextarea = true;
                npReqVM.NSUShow = false;
                npReqVM.StandardAncillariesshow = true;
                npReqVM.ProductCategoryShow = true;
                npReqVM.dateofFirstSaleshow = true;
                npReqVM.yeartableShow = true;
                npReqVM.MrktJustificationShow = true;
                npReqVM.RegContactShow = true;
                npReqVM.NotOrgShow = true;
                npReqVM.CountryOfSaleShow = true;
                npReqVM.CntryPresCodeShow = true;
                npReqVM.NoteShow = true;
                npReqVM.PartFilledShow = false;
                npReqVM.SUAgiCodeShow = false;
            }
        }        
    }
}
