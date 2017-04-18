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
using Syngenta.ERMS.Common;
using System.Collections.Specialized;
using Syngenta.ERMS.ExceptionManagement;

namespace ERMS.Controllers
{
    public class CombiPackRequestController : ApiController
    {
        CombiPackRequestNewViewModel cprnVM = new CombiPackRequestNewViewModel();
        ICombiPackRequestNewService cmbreqNew = new CombiPackRequestNewService();

        ErrorEntity errEntity = new ErrorEntity();

        public HttpResponseMessage Combipack(int iNoOfFormulation)
        {
            try
            {
                cprnVM = cmbreqNew.GetProductCategory();
                cprnVM = cmbreqNew.GetLeadAI();
                cprnVM = cmbreqNew.GetProductLine(iNoOfFormulation);
                cprnVM = cmbreqNew.GetUOM();
                cprnVM = cmbreqNew.GetSUExist();
                cprnVM = cmbreqNew.GetCountry();
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "CombiPackHome");
                ExceptionManager.Publish(ex, additionalInfo);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in Combi Pack - To get Combi Home details";
                cprnVM.ErrorBE = errEntity;
            }
            return Request.CreateResponse(HttpStatusCode.OK, cprnVM);

        }
        public HttpResponseMessage CombipackFormulation(string intLeadAIId, string strLeadAICtlId)
        {
            try
            {
                cprnVM = cmbreqNew.GetFormulation(Convert.ToInt32(intLeadAIId), strLeadAICtlId);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "CombiPackHome");
                ExceptionManager.Publish(ex, additionalInfo);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in Combi Pack - To get formulation details";
                cprnVM.ErrorBE = errEntity;
            }
            return Request.CreateResponse(HttpStatusCode.OK, cprnVM);
        }
        public HttpResponseMessage Combipackpacksize(string intFormulationId, string strFormulationCtlId)
        {
            try
            {
                cprnVM = cmbreqNew.GetPackSize(Convert.ToInt32(intFormulationId), strFormulationCtlId);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "CombiPackHome");
                ExceptionManager.Publish(ex, additionalInfo);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in Combi Pack - To get pack size details";
                cprnVM.ErrorBE = errEntity;
            }
            return Request.CreateResponse(HttpStatusCode.OK, cprnVM);
        }
    }
}
