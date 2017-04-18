using Syngenta.ERMS.Common;
using Syngenta.ERMS.Common.ViewModels;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.Services.ServiceInterfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Helpers;
using System.Web.Http;
using Newtonsoft.Json;
using Syngenta.ERMS.BusinessEntities;
using System.Web.Script.Serialization;
using System.Collections.Specialized;
using Newtonsoft.Json.Linq;
using Syngenta.ERMS.ExceptionManagement;
using System.Data;

namespace ERMS.Controllers
{
    public class SearchController : ApiController
    {
        SearchViewModel searchViewModel;
        BaseModel baseModel;
        ISearchService searchSerObj;
        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";

        [HttpPost]
        public HttpResponseMessage SearchRequest()
        {
            searchViewModel = new SearchViewModel();
            searchSerObj = new SearchService();

            try
            {
                baseModel = CacheObjectWrapper.Exists("SearchFilters") ? baseModel = CacheObjectWrapper.Get<BaseModel>("SearchFilters")
                                                               : searchSerObj.GetRequestFilterValues();

                baseModel = searchSerObj.GetRequestFilterValues();
                searchViewModel.Area = baseModel.Area;
                searchViewModel.CountryList = baseModel.CountryList;
                searchViewModel.LeadAI = baseModel.LeadAI;
                searchViewModel.RequestType = baseModel.RequestType;
                searchViewModel.Status = baseModel.Status;
                searchViewModel.SubStatus = baseModel.SubStatus;

                return Request.CreateResponse(HttpStatusCode.OK, searchViewModel);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Search");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in loading search realted filters");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in SearchRequest method of Search controller";
                searchViewModel.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, searchViewModel);
            }
        }
        /// <summary>
        /// Method to get the Requests based on the user's selection
        /// </summary>
        [HttpPost]
        public HttpResponseMessage GetSearchResults(RequestFilters requestFilters)
        {
            try
            {
                searchViewModel = new SearchViewModel();
                searchSerObj = new SearchService();
                RequestFilters reqFiltersObj = new RequestFilters();
                reqFiltersObj = requestFilters;
                //RequestFilters reqFiltersObj = new JavaScriptSerializer().Deserialize<List<RequestFilters>>(selectedFilters).FirstOrDefault();
                //RequestFilters reqFiltersObj = new RequestFilters();
                reqFiltersObj.SelectedCountry = reqFiltersObj.SelectedCountry.Equals(Constants.TEXT_DROPDOWN_DEFAULT) ? "0" : reqFiltersObj.SelectedCountry;
                reqFiltersObj.SelectedArea = reqFiltersObj.SelectedArea.Equals(Constants.TEXT_DROPDOWN_DEFAULT) || reqFiltersObj.SelectedArea.Equals(string.Empty) ? "0" : reqFiltersObj.SelectedArea;
                reqFiltersObj.SelectedLeadAI = reqFiltersObj.SelectedLeadAI.Equals(Constants.TEXT_DROPDOWN_DEFAULT) ? "0" : reqFiltersObj.SelectedLeadAI;
                reqFiltersObj.SelectedOrginator = reqFiltersObj.SelectedOrginator == null ? Constants.TEXT_DROPDOWN_DEFAULT : reqFiltersObj.SelectedOrginator;
                reqFiltersObj.SelectedReqType = reqFiltersObj.SelectedReqType.Equals(Constants.TEXT_DROPDOWN_DEFAULT) ? "0" : reqFiltersObj.SelectedReqType;
                reqFiltersObj.SelectedStatus = reqFiltersObj.SelectedStatus.Equals(Constants.TEXT_DROPDOWN_DEFAULT) ? "0" : reqFiltersObj.SelectedStatus;
                reqFiltersObj.SelectedSubArea = string.Empty;
                reqFiltersObj.SelectedSubStatus = reqFiltersObj.SelectedSubStatus.Equals(Constants.TEXT_DROPDOWN_DEFAULT) ? "0" : reqFiltersObj.SelectedSubStatus;
                reqFiltersObj.SUorPU = reqFiltersObj.SUorPU.Equals(string.Empty) ? "-1" : reqFiltersObj.SUorPU;
                reqFiltersObj.NSU = reqFiltersObj.NSU.Equals(string.Empty) ? "-1" : reqFiltersObj.NSU;
                reqFiltersObj.Concerns = reqFiltersObj.Concerns;
                reqFiltersObj.ReqNumber = reqFiltersObj.ReqNumber.Equals(string.Empty) ? "-1" : reqFiltersObj.ReqNumber;

                searchViewModel.RequestResults = searchSerObj.GetSearchResultsData(reqFiltersObj);

                return Request.CreateResponse(HttpStatusCode.OK, searchViewModel);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Search");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString(Constants.Err_PageLoad);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetSearchResults method of search controller";
                searchViewModel.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, searchViewModel);
            }
        }

        /// <summary>
        /// Method to reject a request
        /// </summary>
        /// <param name="reqID">Request ID to be rejected</param>
        /// <param name="reason">Reason for request rejection</param>
        /// <param name="type">Type: 1- Reject, 2-Delete</param>
        [HttpPost]
        public HttpResponseMessage RejectDeleteRequest(int reqID, string reason, int type)
        {
            searchViewModel = new SearchViewModel();
            try
            {
                searchSerObj = new SearchService();
                int success = searchSerObj.RejectOrDeleteRequest(reqID, reason, type);
                return Request.CreateResponse(HttpStatusCode.OK, success);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Search");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString(Constants.Err_PageLoad);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in RejectDeleteRequest method of search controller";
                searchViewModel.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, searchViewModel);
            }

        }

        /// <summary>
        /// Method to get the Requests based on the user's selection
        /// </summary>
        [HttpPost]
        public HttpResponseMessage GetPrintResultsData(RequestFilters requestFilters)
        {
            try
            {
                searchViewModel = new SearchViewModel();
                searchSerObj = new SearchService();
                RequestFilters reqFiltersObj = new RequestFilters();
                reqFiltersObj = requestFilters;
                //RequestFilters reqFiltersObj = new JavaScriptSerializer().Deserialize<List<RequestFilters>>(selectedFilters).FirstOrDefault();
                //RequestFilters reqFiltersObj = new RequestFilters();
                reqFiltersObj.SelectedCountry = reqFiltersObj.SelectedCountry.Equals(Constants.TEXT_DROPDOWN_DEFAULT) ? "0" : reqFiltersObj.SelectedCountry;
                reqFiltersObj.SelectedArea = reqFiltersObj.SelectedArea.Equals(Constants.TEXT_DROPDOWN_DEFAULT) || reqFiltersObj.SelectedArea.Equals(string.Empty) ? "0" : reqFiltersObj.SelectedArea;
                reqFiltersObj.SelectedLeadAI = reqFiltersObj.SelectedLeadAI.Equals(Constants.TEXT_DROPDOWN_DEFAULT) ? "0" : reqFiltersObj.SelectedLeadAI;
                reqFiltersObj.SelectedOrginator = reqFiltersObj.SelectedOrginator == null ? Constants.TEXT_DROPDOWN_DEFAULT : reqFiltersObj.SelectedOrginator;
                reqFiltersObj.SelectedReqType = reqFiltersObj.SelectedReqType.Equals(Constants.TEXT_DROPDOWN_DEFAULT) ? "0" : reqFiltersObj.SelectedReqType;
                reqFiltersObj.SelectedStatus = reqFiltersObj.SelectedStatus.Equals(Constants.TEXT_DROPDOWN_DEFAULT) ? "0" : reqFiltersObj.SelectedStatus;
                reqFiltersObj.SelectedSubArea = string.Empty;
                reqFiltersObj.SelectedSubStatus = reqFiltersObj.SelectedSubStatus.Equals(Constants.TEXT_DROPDOWN_DEFAULT) ? "0" : reqFiltersObj.SelectedSubStatus;
                reqFiltersObj.SUorPU = reqFiltersObj.SUorPU.Equals(string.Empty) ? "-1" : reqFiltersObj.SUorPU;
                reqFiltersObj.NSU = reqFiltersObj.NSU.Equals(string.Empty) ? "-1" : reqFiltersObj.NSU;
                reqFiltersObj.Concerns = reqFiltersObj.Concerns;
                reqFiltersObj.ReqNumber = reqFiltersObj.ReqNumber.Equals(string.Empty) ? "-1" : reqFiltersObj.ReqNumber;

                DataTable dtPrint = searchSerObj.GetPrintResultsData(reqFiltersObj);

                return Request.CreateResponse(HttpStatusCode.OK, dtPrint);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Search");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString(Constants.Err_PageLoad);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetSearchResults method of search controller";
                searchViewModel.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, searchViewModel);
            }
        }
        /// <summary>
        /// Method to delete a request
        /// </summary>
        /// <param name="reqID">Request ID to be deleted</param>
        /// <param name="reason">Reason for request deletion</param>
        //[HttpPost]
        //public void DeleteRequest(int reqID, string reason)
        //{
        //    searchSerObj = new SearchService();

        //    int success = searchSerObj.RejectOrDeleteRequest(reqID, reason, 2);

        //}
    }
}
