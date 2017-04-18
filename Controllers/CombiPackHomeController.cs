using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Syngenta.ERMS.Services.ServiceInterfaces;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.Common.ViewModels;
using System.Collections.Specialized;
using Syngenta.ERMS.ExceptionManagement;
using Syngenta.ERMS.BusinessEntities;

namespace ERMS.Controllers
{
    public class CombiPackHomeController : ApiController
    {
        ICombiPackHomeService cmbHmeService = new CombiPackHomeService();
        CombiPackHomeViewModel cmbhmeVM = new CombiPackHomeViewModel();

        ErrorEntity errEntity = new ErrorEntity();
   
        /*Below method is used to Populate LeadAI and Formulation dropdowns on page load*/
        [HttpPost]
        public HttpResponseMessage GetCombiHomeDetails()
        {
            try
            {
                cmbhmeVM = cmbHmeService.GetCombiDetails();
            }
            catch(Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "CombiPackHome");
                ExceptionManager.Publish(ex, additionalInfo);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Combi Pack home- To get Combi Home details";
                cmbhmeVM.ErrorBE = errEntity;
             }
            return Request.CreateResponse(HttpStatusCode.OK, cmbhmeVM);
        }

        public int CheckLeadAI(string strLeadAI)
        {
            int iResult = cmbHmeService.chkLeadAI(strLeadAI);
            return iResult;
        }
    }
}
