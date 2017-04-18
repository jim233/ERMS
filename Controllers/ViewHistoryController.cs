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
    public class ViewHistoryController : WorkflowBaseController
    {


        protected IViewHistoryService viewHistoryService = new ViewHistoryService();
        protected ViewHistoryViewModel viewHistoryViewModel;
        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";
        public HttpResponseMessage GetHistoryView(int requestId)
        {
            try
            {
            BaseModel baseModel = viewHistoryService.GetRequestFilterValues();
            viewHistoryViewModel = new ViewHistoryViewModel();
            InitShow();
            viewHistoryViewModel.RequestId = requestId.ToString();
            viewHistoryViewModel = viewHistoryService.GetHistoryData(viewHistoryViewModel);
            viewHistoryViewModel.username = UserName.Split(Syngenta.ERMS.Common.Constants.SLASH.ToCharArray())[1].ToString();
            BaseService baseService = new BaseService();
            //For Fast
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetFastTeamMgr))
            {
                viewHistoryViewModel.trFastMgrShow = false;
            }
           
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetFastTeamSignOff))
            {
                viewHistoryViewModel.trFastSignOffShow = false;
                viewHistoryViewModel.trFastTimeTakenShow = false;
            }
          
            /*
            if (SetFastSignOffDays == 0)
            {
                trFastTimeTaken.Visible = false;
            }
            */
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetFastTeamMgr) && string.IsNullOrEmpty(viewHistoryViewModel.SetFastTeamSignOff) && viewHistoryViewModel.SetFastSignOffDays=="0")
            {
                viewHistoryViewModel.trFastShow = false;
            }
       
            //For SCP
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetSCPMgr))
            {
                viewHistoryViewModel.trSCPMgrShow = false;
            }
           
          
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetSCPSignOff))
            {
                viewHistoryViewModel.trSCPSignOffShow = false;
                viewHistoryViewModel.trSCPTimeTakenShow = false;
            }
  
            /*
            if (SetSCPSignOffDays == 0)
            {
                trSCPTimeTaken.Visible = false;
            }
             */
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetSCPMgr) && string.IsNullOrEmpty(viewHistoryViewModel.SetSCPSignOff) && viewHistoryViewModel.SetSCPSignOffDays == "0")
            {
                viewHistoryViewModel.trSCPShow = false;
            }
 
            //For Pack Tech
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetPackTechMgr))
            {
                viewHistoryViewModel.trPackTechMgrShow = false;
            }
            
            
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetPackTechSignOff))
            {
                viewHistoryViewModel.trPackTechSignOffShow = false;
                viewHistoryViewModel.trPackTechTimeTakenShow = false;
            }
 
            /*
            if (SetPackTechSignOffDays == 0)
            {
                trPackTechTimeTaken.Visible = false;
            }
             */
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetPackTechCompleteMgr))
            {
                viewHistoryViewModel.trPackCompleteMgrShow = false;
            }
        
              
         
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetPackCompletSignOff))
            {
                viewHistoryViewModel.trPackCompleteSignOffShow = false;
                viewHistoryViewModel.trPackTestCompleteTimeTakenShow = false;
            }

            /*
            if (SetPackTestCompleteTimeTaken == 0)
            {
                trPackTestCompleteTimeTaken.Visible = false;
            }
            */
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetPackTechMgr) && string.IsNullOrEmpty(viewHistoryViewModel.SetPackTechSignOff) && viewHistoryViewModel.SetPackTechSignOffDays == "0" &&
                 string.IsNullOrEmpty(viewHistoryViewModel.SetPackTechCompleteMgr) && string.IsNullOrEmpty(viewHistoryViewModel.SetPackCompletSignOff) && viewHistoryViewModel.SetPackTestCompleteTimeTaken == "0")
            {
                viewHistoryViewModel.trPackTechShow = false;
            }
             //For RDM
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetRDMMgr))
            {
                viewHistoryViewModel.trRDMMgrShow = false;
            }
  
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetRDMSignOff))
            {
                viewHistoryViewModel.trRDMSignOffShow = false;
                viewHistoryViewModel.trRDMTimeTakenShow = false;
            }

            /*
            if (SetRDMSignOffDays == 0)
            {
                trRDMTimeTaken.Visible = false;
            }
             */
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetSUCodeRaiseRDMMgr))
            {
                viewHistoryViewModel.trSUCodeRaiseRDMMgrShow = false;
            }
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetSUCodeRaiseSignOff))
            {
                viewHistoryViewModel.trSUCodeRaiseSignOffShow = false;
                viewHistoryViewModel.trSUCodeRaiseTimeTakenShow = false;

            }
            /*
            if (SetSUCodeRaiseTimeTake == 0)
            {
                trSUCodeRaiseTimeTaken.Visible = false;
            }
             */
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetRDMMgr) && string.IsNullOrEmpty(viewHistoryViewModel.SetRDMSignOff) && viewHistoryViewModel.SetRDMSignOffDays == "0" &&
                 string.IsNullOrEmpty(viewHistoryViewModel.SetSUCodeRaiseRDMMgr) && string.IsNullOrEmpty(viewHistoryViewModel.SetSUCodeRaiseSignOff) && viewHistoryViewModel.SetSUCodeRaiseTimeTake == "0")
            {
                viewHistoryViewModel.trRDMShow = false;
            }
             //For EBM
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetEBMMgr))
            {
                viewHistoryViewModel.trEBMMgrShow = false;
            }
         
               
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetEBMSignOff))
            {
                viewHistoryViewModel.trEBMSignOffShow = false;
                viewHistoryViewModel.trEBMTimeTakenShow = false;
            }
            
            /*
            if (SetEBMSignOffDays == 0)
            {
                trEBMTimeTaken.Visible = false;
            }
            */
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetEBM2ndManager))
            {
                viewHistoryViewModel.trEBM2ndManagerShow = false;
            }

            if (string.IsNullOrEmpty(viewHistoryViewModel.SetEBM2ndSignOff))
            {
                viewHistoryViewModel.trEBM2ndSignOffShow = false;
                viewHistoryViewModel.trEBM2ndTimeTakenShow = false;
            }

            /*
            if (SetEBM2ndTimeTaken == 0)
            {
                trEBM2ndTimeTaken.Visible = false;
            }
            */
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetEBMMgr) && string.IsNullOrEmpty(viewHistoryViewModel.SetEBMSignOff) && viewHistoryViewModel.SetEBMSignOffDays == "0" &&
                 string.IsNullOrEmpty(viewHistoryViewModel.SetEBM2ndManager) && string.IsNullOrEmpty(viewHistoryViewModel.SetEBM2ndSignOff) && viewHistoryViewModel.SetEBM2ndTimeTaken == "0")
            {
                viewHistoryViewModel.trEBMShow = false;
            }

            //For SCTeam
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetSCTeamPackTechHead))
            {
                viewHistoryViewModel.trSCTeamPackTechHeadShow = false;
            }
          
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetSCTeamPackPuchasingMgr))
            {
                viewHistoryViewModel.trSCTeamPackPurchasingMgrShow = false;
            }
          
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetSCTeamFastMgr))
            {
                viewHistoryViewModel.trSCTeamFastMgrShow = false;
            }

            //Start of change for ERMS case 1165724-1 and 1165721-1
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetSCTeamGSCMMgr) || viewHistoryViewModel.SetRequestType != "Combi Pack")
            {
                viewHistoryViewModel.trSCTeamGSCMMgrShow = false;
            }
       
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetSCTeamGTPMgr))
            {
                viewHistoryViewModel.trSCTeamGTPMgrShow = false;
            }

            if (string.IsNullOrEmpty(viewHistoryViewModel.SetSCTeamPackTechMgr))
            {
                viewHistoryViewModel.trSCTeamPackTechShow = false;
            }

            //end of change for ERMS case 1165724-1 and 1165721-1
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetSCTeamRDMMgr))
            {
                viewHistoryViewModel.trSCTeamRDMMgrShow = false;
            }

            if (string.IsNullOrEmpty(viewHistoryViewModel.SetSCTeamSignOff))
            {
                viewHistoryViewModel.trSCTeamSignOffShow = false;
                viewHistoryViewModel.trSCTeamTimeTakenShow = false;
            }

            /*
            if (SetSCTeamSignOffDays == 0)
            {
                trSCTeamTimeTaken.Visible = false;
            }
             */
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetSCTeamPackTechHead) && string.IsNullOrEmpty(viewHistoryViewModel.SetSCTeamPackPuchasingMgr) && string.IsNullOrEmpty(viewHistoryViewModel.SetSCTeamFastMgr) &&
                 string.IsNullOrEmpty(viewHistoryViewModel.SetSCTeamGSCMMgr) && string.IsNullOrEmpty(viewHistoryViewModel.SetSCTeamRDMMgr) && string.IsNullOrEmpty(viewHistoryViewModel.SetSCTeamSignOff) &&
                 viewHistoryViewModel.SetSCTeamSignOffDays == "0")
            {
                viewHistoryViewModel.trSCTeamShow = false;
            }

            //For GSCM
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetGSCMMgr) || viewHistoryViewModel.SetRequestType != "Supply Chain")
            {
                viewHistoryViewModel.trGSCMMgrShow = false;
            }

            if (string.IsNullOrEmpty(viewHistoryViewModel.SetGSCMSignOff) || viewHistoryViewModel.SetRequestType != "Supply Chain")
            {
                viewHistoryViewModel.trGSCMSignOffShow = false;
                viewHistoryViewModel.trGSCMTimeTakenShow = false;
            }

            /*
            if (SetGSCMSignOffDays == 0 || lblReqType.Text != "Supply Chain")
            {
                trGSCMTimeTaken.Visible = false;
            }
             */
            if (string.IsNullOrEmpty(viewHistoryViewModel.SetGSCM2ndManager) || viewHistoryViewModel.SetRequestType != "Supply Chain")
            {
                viewHistoryViewModel.trGSCM2ndManagerShow = false;
            }

            if (string.IsNullOrEmpty(viewHistoryViewModel.SetGSCM2ndSignOff) || viewHistoryViewModel.SetRequestType != "Supply Chain")
            {
                viewHistoryViewModel.trGSCM2ndSignOffShow = false;
                viewHistoryViewModel.trGSCM2ndTimeTakenShow = false;
            }
           
            /*
            if (SetGSCM2ndTimeTaken == 0 || lblReqType.Text != "Supply Chain")
            {
                trGSCM2ndTimeTaken.Visible = false;
            }
             */
            if ((string.IsNullOrEmpty(viewHistoryViewModel.SetGSCMMgr) && string.IsNullOrEmpty(viewHistoryViewModel.SetGSCMSignOff) && viewHistoryViewModel.SetGSCMSignOffDays == "0" &&
               string.IsNullOrEmpty(viewHistoryViewModel.SetGSCM2ndManager) && string.IsNullOrEmpty(viewHistoryViewModel.SetGSCM2ndSignOff) && viewHistoryViewModel.SetGSCM2ndTimeTaken == "0")
                || viewHistoryViewModel.SetRequestType != "Supply Chain")
            {
                viewHistoryViewModel.trGSCMShow = false;
            }
           

            return Request.CreateResponse(HttpStatusCode.OK, viewHistoryViewModel);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "ViewHistory");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in ViewHistory");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetHistoryView method of ViewHistory controller";
                viewHistoryViewModel.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, viewHistoryViewModel);
            }
        }

        [NonAction]
        private void InitShow()
        {
           
                viewHistoryViewModel.trFastMgrShow = true;
                viewHistoryViewModel.trFastSignOffShow = true;
                viewHistoryViewModel.trFastTimeTakenShow = true;
                viewHistoryViewModel.trFastShow = true;
                viewHistoryViewModel.trSCPMgrShow = true;
                viewHistoryViewModel.trSCPSignOffShow = true;
                viewHistoryViewModel.trSCPTimeTakenShow = true;
                viewHistoryViewModel.trSUCodeRaiseSignOffShow = true;
                viewHistoryViewModel.trSUCodeRaiseTimeTakenShow = true;
                viewHistoryViewModel.trRDMSignOffShow = true;
                viewHistoryViewModel.trRDMTimeTakenShow = true;
                viewHistoryViewModel.trRDMMgrShow = true;
                viewHistoryViewModel.trPackTechShow = true;
                viewHistoryViewModel.trPackCompleteSignOffShow = true;
                viewHistoryViewModel.trPackTestCompleteTimeTakenShow = true;
                viewHistoryViewModel.trPackCompleteMgrShow = true;
                viewHistoryViewModel.trPackTechSignOffShow = true;
                viewHistoryViewModel.trPackTechTimeTakenShow = true;
                viewHistoryViewModel.trPackTechMgrShow = true;
                viewHistoryViewModel.trSCPShow = true;
                viewHistoryViewModel.trSUCodeRaiseRDMMgrShow = true;
                viewHistoryViewModel.trEBMShow = true;
                viewHistoryViewModel.trEBMMgrShow = true;
                viewHistoryViewModel.trRDMShow = true;
                viewHistoryViewModel.trEBMSignOffShow = true;
                viewHistoryViewModel.trEBMTimeTakenShow = true;
                viewHistoryViewModel.trEBM2ndManagerShow = true;
                viewHistoryViewModel.trEBM2ndSignOffShow = true;
                viewHistoryViewModel.trEBM2ndTimeTakenShow = true;
                viewHistoryViewModel.trSCTeamPackTechHeadShow = true;
                viewHistoryViewModel.trSCTeamPackPurchasingMgrShow = true;
                viewHistoryViewModel.trSCTeamFastMgrShow = true;
                viewHistoryViewModel.trSCTeamGSCMMgrShow = true;
                viewHistoryViewModel.trSCTeamGTPMgrShow = true;
                viewHistoryViewModel.trSCTeamPackTechShow = true;
                viewHistoryViewModel.trSCTeamRDMMgrShow = true;
                viewHistoryViewModel.trSCTeamSignOffShow = true;
                viewHistoryViewModel.trSCTeamTimeTakenShow = true;
                viewHistoryViewModel.trSCTeamShow = true;
                viewHistoryViewModel.trGSCMMgrShow = true;
                viewHistoryViewModel.trGSCMSignOffShow = true;
                viewHistoryViewModel.trGSCMTimeTakenShow = true;
                viewHistoryViewModel.trGSCM2ndManagerShow = true;
                viewHistoryViewModel.trGSCM2ndSignOffShow = true;
                viewHistoryViewModel.trGSCM2ndTimeTakenShow = true;
                viewHistoryViewModel.trGSCMShow = true;
            
        }
    }
}
