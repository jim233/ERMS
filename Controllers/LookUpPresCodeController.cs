using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.Services.ServiceInterfaces;
using Syngenta.ERMS.Common.ViewModels;
using System.Web.Script.Serialization;
using System.Collections.Specialized;
using Newtonsoft.Json.Linq;
using Syngenta.ERMS.ExceptionManagement;
using Syngenta.ERMS.BusinessEntities;

namespace ERMS.Controllers
{
    public class LookUpPresCodeController : ApiController
    {
        BaseModel bsModel = new BaseModel();
        IBaseService bsService = new BaseService();
        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";
        public HttpResponseMessage LookUpPresDetails()
        {
            try
            {
                bsModel.GetPresCodeDropdown = bsService.GetPresCodeDropdown();
                bsModel.GetCountrySpecificLabel = bsService.GetCountrySpecificLabel();
                bsModel.GetCustomerSpecificLabel = bsService.GetCustomerSpecificLabel();
                return Request.CreateResponse(HttpStatusCode.OK, bsModel);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Lookup Pres Code");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in loading IDS page");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in LookUpPresDetails method of LookUpPresCode controller.";
                bsModel.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, bsModel);
            }
        }
    }
}
