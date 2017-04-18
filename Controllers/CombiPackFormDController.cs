using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.Services.ServiceInterfaces;
using Syngenta.ERMS.Common.ViewModels;
using Syngenta.ERMS.BusinessEntities;
using System.Collections.Specialized;
using Syngenta.ERMS.ExceptionManagement;
using System.Web;
using Syngenta.ERMS.Common;

namespace ERMS.Controllers
{
    public class CombiPackFormDController : WorkflowBaseController
    {
        //int requestId;
        CombiPackRequestViewModel cprVM;
        ICombiPackRequestService CombiReqService;
        //BaseModel bsmodel;
        //IBaseService baseServ;
        Admin admUser = new Admin();
        IAdminService admService = new AdminService();

        ErrorEntity errEntity = new ErrorEntity();

        [HttpPost]
        public HttpResponseMessage GetNewPackDetails(int requestID)
        {
            cprVM = new CombiPackRequestViewModel();
            try
            {
                
                CombiReqService = new CombiPackRequestService();
                cprVM = CombiReqService.GetCombiDetails(requestID);
                if (cprVM.CombiPackRequest.IsSynBrdPack1 != null && cprVM.CombiPackRequest.IsSynBrdPack2 != null)
                {
                    if (cprVM.CombiPackRequest.IsSynBrdPack1.Trim().ToLower() == "yes" || cprVM.CombiPackRequest.IsSynBrdPack2.Trim().ToLower() == "yes")
                    {
                        cprVM.CombiPackRequest.IsSynBrdPack = "Yes";
                    }
                    else if (cprVM.CombiPackRequest.IsSynBrdPack3 != null)
                    {
                        if (cprVM.CombiPackRequest.IsSynBrdPack3.Trim().ToLower() == "yes")
                        {
                            cprVM.CombiPackRequest.IsSynBrdPack = "Yes";
                        }
                        else if (cprVM.CombiPackRequest.IsSynBrdPack4 != null)
                        {
                            if (cprVM.CombiPackRequest.IsSynBrdPack4.Trim().ToLower() == "yes")
                            {
                                cprVM.CombiPackRequest.IsSynBrdPack = "Yes";
                            }
                            else
                            {
                                cprVM.CombiPackRequest.IsSynBrdPack = "No";
                            }
                        }
                        else
                        {
                            cprVM.CombiPackRequest.IsSynBrdPack = "No";
                        }
                    }
                    else
                    {
                        cprVM.CombiPackRequest.IsSynBrdPack = "No";
                    }
                }

                DateTime dtFirstSaleCheck = new DateTime();
                int ret = CombiReqService.GetNumberofDays("Combi Pack");
                dtFirstSaleCheck = DateTime.Now.AddDays(ret);

                int iIsPresent = 0;
                if (cprVM.CombiPackRequest != null)
                {
                    iIsPresent = Convert.IsDBNull(cprVM.CombiPackRequest.isSucess) ? 0 : cprVM.CombiPackRequest.isSucess;
                }
                if (iIsPresent == 3 || iIsPresent == 1)
                {
                    if (cprVM.CombiPackRequest.SourceLocally)
                    {
                        cprVM.CPSourceLocallyDetailsEnable = false;
                    }
                    else
                    {
                        cprVM.CPSourceLocallyDetailsEnable = true;
                    }
                }

                string strOther = string.Empty;
                if (cprVM.CombiPackRequest != null)
                {
                    strOther = string.IsNullOrEmpty(cprVM.CombiPackRequest.OtherData) ? string.Empty : cprVM.CombiPackRequest.OtherData;
                }
                if (strOther != string.Empty)
                {
                    if (base.PageDisable("CMBI", Convert.ToInt32(strOther.Split(',')[0])) == 1)
                        DisableControls();
                    else if (base.PageDisable("CMBI", Convert.ToInt32(strOther.Split(',')[0])) == 2)
                    {
                        cprVM.SubmitEnableCP = false;
                    }
                }
                cprVM.Region = HttpContext.Current.Session[Constants.USER_REGION] != null ? HttpContext.Current.Session[Constants.USER_REGION].ToString() : string.Empty;
                return Request.CreateResponse(HttpStatusCode.OK, cprVM);
            }
            catch(Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "CombiPackFormD");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Admin - To get new pack details");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetNewPackDetails method of combipackformD controller";
                cprVM.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, cprVM);
            }
        }

        [HttpPost]
        public int SaveorsubmitCombi(CombiPackRequest cmbSave)
        {
            try
            {
                CombiReqService = new CombiPackRequestService();

                int iUserAdd = 0;
                if (!string.IsNullOrEmpty(cmbSave.Email))
                {
                    admUser.FirstName = cmbSave.FirstName;
                    admUser.LastName = cmbSave.LastName;
                    admUser.UserId = cmbSave.UserId;
                    admUser.Email = cmbSave.Email;
                    iUserAdd = admService.AddUserData(admUser);
                }
                if (!string.IsNullOrEmpty(cmbSave.SecondUserEmail))
                {
                    admUser.FirstName = cmbSave.SecondUserFirstName;
                    admUser.LastName = cmbSave.SecondUserLastName;
                    admUser.UserId = cmbSave.SecondUserId;
                    admUser.Email = cmbSave.SecondUserEmail;
                    iUserAdd = admService.AddUserData(admUser);
                }
                //SOCB - LRMS change - Submit Request to procurement Manager
                if (!string.IsNullOrEmpty(cmbSave.SecondUserEmail))
                {
                    admUser.FirstName = cmbSave.ProcMgrFirstName;
                    admUser.LastName = cmbSave.ProcMgrLastName;
                    admUser.UserId = cmbSave.ProcMgrUserId;
                    admUser.Email = cmbSave.ProcMgrEmail;
                    iUserAdd = admService.AddUserData(admUser);
                }
                //EOCB - LRMS change - Submit Request to procurement Manager
                int i = 0;
                i = CombiReqService.SaveCombiDetails(cmbSave);
                return i;
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "CombiPackFormD");
                ExceptionManager.Publish(ex, additionalInfo);
                return 0;
            }

        }

        [NonAction]
        public void DisableControls()
        {
            cprVM.CPOriginatorEnable = true;
            cprVM.CPLeadAIEnable = true;
            cprVM.CPCombiCollationEnable = true;
            cprVM.CPUOMSelectEnable = true;
            cprVM.CPCountrySelectEnable = true;
            cprVM.CPCombiPresCodeEnable = true;
            cprVM.CPCombiFirstSaleDateEnable = true;
            cprVM.LookupPresCodeCP = true;
            cprVM.SaveEnableCP = true;
            cprVM.SubmitEnableCP = true;
            cprVM.CPPLSelectEnable = true;
            cprVM.CPCombiTradeNameEnable = true;
            cprVM.MktJustificationCP = true;
            cprVM.CPRegManagerEnable = true;
            cprVM.CPRegGAL = true;
            cprVM.CPSourceLocallyYes = true;
            cprVM.CPSourceLocallyNo = true;
            cprVM.CPGALNOEnable = true;
            cprVM.CPElement1SUEnable = true;
            cprVM.CPElement1LeadAIEnable = true;
            cprVM.CPElement1DesignEnable = true;
            cprVM.CPElement1UCCodeEnable = true;
            cprVM.CPElement1SizeEnable = true;
            cprVM.CPElement1PartFillQtyEnable = true;
            cprVM.CPElement1TradenameEnable = true;
            cprVM.CPElement1ProductlineEnable = true;
            cprVM.CPElement2SUEnable = true;
            cprVM.CPElement2LeadAIEnable = true;
            cprVM.CPElement2DesignEnable = true;
            cprVM.CPElement2UCCodeEnable = true;
            cprVM.CPElement2SizeEnable = true;
            cprVM.CPElement2PartFillQtyEnable = true;
            cprVM.CPElement2TradenameEnable = true;
            cprVM.CPElement2ProductlineEnable = true;
            cprVM.CPMTOSelectEnable = true;
        }
    }
}
