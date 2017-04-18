using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Syngenta.ERMS.Common;
using Syngenta.ERMS.Common.ViewModels;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.Services.ServiceInterfaces;
using System.Web.Mvc;
using Syngenta.ERMS.ExceptionManagement;
using System.Collections.Specialized;
using Syngenta.ERMS.BusinessEntities;

namespace ERMS.Controllers
{
    public class CoreRangeController : ApiController
    {
        ICoreRangeService coreRangeServ;
        CoreRangeViewModel coreRangeViewModel;
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";

        [System.Web.Http.HttpPost]
        public HttpResponseMessage GetLeadAI(string direct)
        {
            coreRangeViewModel = new CoreRangeViewModel();
            try
            {
                coreRangeServ = new CoreRangeService();

                coreRangeViewModel.LeadAIList = coreRangeServ.GetLeadUICode();

                CacheObjectWrapper.Add("CoreRangeDirect", direct);

                return Request.CreateResponse(HttpStatusCode.OK, coreRangeViewModel);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "CoreRange");
                ExceptionManager.Publish(ex, additionalInfo);
                Message = "Error in GetLeadAI method of Corerange controller";
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = Message;
                coreRangeViewModel.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, coreRangeViewModel);
            }
        }

        /// <summary>
        /// Method to get formulations for the selected LeadAI
        /// </summary>
        /// <param name="leadAIText">Selected Lead AI Text</param>
        /// <param name="leadAIValue">Selected Lead AI value</param>
        [System.Web.Http.HttpPost]
        public HttpResponseMessage GetFormulationForLeadAI(string leadAIValue)
        {
            coreRangeViewModel = new CoreRangeViewModel();
            coreRangeServ = new CoreRangeService();
            //int index = leadAIValue.IndexOf(Constants.HYPHEN);
            try
            {
                if (!string.IsNullOrEmpty(leadAIValue))
                {
                    int intIndex = leadAIValue.IndexOf(Constants.HYPHEN);

                    if (intIndex > 0)
                    {
                        int leadAI = Convert.ToInt32(leadAIValue.Substring(0, intIndex));

                        coreRangeViewModel.Formulation = coreRangeServ.GetFormulation(leadAI);
                    }
                    else
                    {
                        List<SelectListItem> newList = new List<SelectListItem>();
                        newList.Add(new SelectListItem()
                        {
                            Text = "SELECT",
                            Value = "SELECT",
                            Selected = true
                        });
                        coreRangeViewModel.Formulation = newList;
                    }
                    if (leadAIValue.Contains(Constants.const_AddedToCoreRangeStatus))
                    {
                        coreRangeViewModel.LeadAIStatus = Constants.const_Status;
                    }
                }
                return Request.CreateResponse(HttpStatusCode.OK, coreRangeViewModel);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "CoreRange");
                ExceptionManager.Publish(ex, additionalInfo);
                Message = "Error in GetFormulationForLeadAI method of Corerange controller";
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = Message;
                coreRangeViewModel.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, coreRangeViewModel);
            }
        }

        /// <summary>
        /// Method to get Core Range details for the selected LeadAI and Formulation
        /// </summary>
        /// <param name="selectedleadAI">Lead AI selectd by the user</param>
        /// <param name="selectedformulation">Formulation selected by the user</param>
        [System.Web.Http.HttpPost]
        public HttpResponseMessage GetCoreRangeDetails(string selectedleadAI, string selectedformulation)
        {
            coreRangeServ = new CoreRangeService();
            coreRangeViewModel = new CoreRangeViewModel();
            try
            {
                int index = selectedformulation.IndexOf(Constants.HYPHEN);
                //int leadAIIndex = selectedleadAI.IndexOf(Constants.HYPHEN);
                if (!selectedleadAI.Equals("-1"))
                {
                    int formulation = selectedformulation.Equals("SELECT", StringComparison.OrdinalIgnoreCase) || string.IsNullOrEmpty(selectedformulation) ? 0 : Convert.ToInt32(selectedformulation.Substring(0, index));
                    int leadAI = Convert.ToInt32(selectedleadAI);
                    coreRangeViewModel = coreRangeServ.GetCoreRangeDetails(leadAI, formulation);

                    if (selectedformulation.Contains(Constants.const_AddedToCoreRangeStatus))
                    {
                        coreRangeViewModel.FormulationStatus = Constants.const_Status;
                    }
                }
                return Request.CreateResponse(HttpStatusCode.OK, coreRangeViewModel);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "CoreRange");
                ExceptionManager.Publish(ex, additionalInfo);
                Message = "Error in GetCoreRangeDetails method of Corerange controller";
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = Message;
                coreRangeViewModel.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, coreRangeViewModel);
            }
        }
    }
}
