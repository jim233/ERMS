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
using Syngenta.ERMS.BusinessEntities;
using System.IO;
using System.Data;
using System.Web.Script.Serialization;
using System.Collections.Specialized;
using Syngenta.ERMS.ExceptionManagement;

namespace ERMS.Controllers
{
    public class AdminController : ApiController
    {
        IAdminService adminServ;
        AdminViewModel adminViewModel;
        string uploadPath = System.Configuration.ConfigurationManager.AppSettings["UPLOADPATH"];

        ErrorEntity errEntity = new ErrorEntity();

        [HttpPost]
        public HttpResponseMessage GetCoreRangeUploadDetails()
        {
            adminViewModel = new AdminViewModel();
            try
            {
                adminServ = new AdminService();
                adminViewModel.CoreRangeDetails = adminServ.GetCoreRangeUploadDetails();
                DataTable dtUploadDetails = new DataTable();
                dtUploadDetails = adminViewModel.CoreRangeDetails;
                if (dtUploadDetails.Rows.Count == 0)
                {
                    adminViewModel.CoreRangeUploadMessageonLoad = "No Core Range update information.";
                }
                else
                {
                    DateTime dtUploadTime = Convert.ToDateTime(dtUploadDetails.Rows[0]["DATE"]);
                    //Start change by Candy Wang for ERMS Enhancement - Date format HH:MM, the seconds removed, on 13 Aug 2009 
                    adminViewModel.CoreRangeUploadMessageonLoad = "Core Range last updated by " + dtUploadDetails.Rows[0]["USER"] + " on "
                        + dtUploadTime.Day.ToString() + "/" + dtUploadTime.Month.ToString() + "/" + dtUploadTime.Year.ToString() + " "
                        + dtUploadTime.Hour.ToString() + ":" + dtUploadTime.Minute.ToString()// + ":" + dtUploadTime.Second.ToString()
                        + ".";
                    //End change
                }
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Admin");
                ExceptionManager.Publish(ex, additionalInfo);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in Admin - To get core range upload details";
                adminViewModel.ErrorBE = errEntity;
            }
            return Request.CreateResponse(HttpStatusCode.OK, adminViewModel);

        }
        [HttpPost]
        public HttpResponseMessage GetCoreRangePath(string path)
        {
           
            adminViewModel = new AdminViewModel();
            try
            {
            string pathaaya = path;
            //split to get file name and check if its NSU and allow control further
            int pos = pathaaya.LastIndexOf("\\") + 1;
            string strCheckfileName = pathaaya.Substring(pos, path.Length - pos);
          
                adminServ = new AdminService();
                CleanFiles(uploadPath + "NSU.xlsx");
                string strDestinationpath = uploadPath + "NSU.xlsx";
                if (pathaaya.Contains(".xls"))
                {
                    if (pathaaya.Contains("NSU.xls"))
                    {
                        File.Copy(pathaaya, strDestinationpath);
                        adminServ.SetCoreRangeUploadDetails();
                        adminViewModel.CoreRangeUploadMess = "The NSU file has been uploaded successfully. The Core Range process shall start soon.";
                    }
                    else
                    {
                        adminViewModel.CoreRangeUploadMess = "NSU Excel file uploaded incorrect.";
                    }
                }
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Admin");
                ExceptionManager.Publish(ex, additionalInfo);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in Admin - To get core range path";
                adminViewModel.ErrorBE = errEntity;
            }
            return Request.CreateResponse(HttpStatusCode.OK, adminViewModel);
            
        }

        [NonAction]
        public void CleanFiles(string dir)
        {
                if (!Directory.Exists(dir))
                {
                    File.Delete(dir);
                    return;
                }
        }
        /// <summary>
        /// Method to get details of PackTech Details
        /// </summary>
        /// <returns>Admin View Model with details of PackTech Details</returns>
        [HttpPost]
        public HttpResponseMessage GetPackTechDetails()
        {
            adminViewModel = new AdminViewModel();
            try
            { 
                adminServ = new AdminService();
                adminViewModel.PackTechDetails = adminServ.GetPackTechDetails();
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Admin");
                ExceptionManager.Publish(ex, additionalInfo);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in Admin - To get pack tech details";
                adminViewModel.ErrorBE = errEntity;
            }
            return Request.CreateResponse(HttpStatusCode.OK, adminViewModel);

        }

        /// <summary>
        /// Method to get details of LocalSCP Details
        /// </summary>
        /// <returns>Admin View Model with details of LocalSCP Details</returns>
        [HttpPost]
        public HttpResponseMessage GetLocalSCPDetails()
        {
            adminViewModel = new AdminViewModel();
            try
            {
                adminServ = new AdminService();
                adminViewModel.LocalSCPDetails = adminServ.GetLocalSCPDetails();
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Admin");
                ExceptionManager.Publish(ex, additionalInfo);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in Admin - To get core range path";
                adminViewModel.ErrorBE = errEntity;
            }
            return Request.CreateResponse(HttpStatusCode.OK, adminViewModel);

        }

        /// <summary>
        /// Method to get details of PLS Contact Details
        /// </summary>
        /// <returns>Admin View Model with details of PLS Contact Details</returns>
        [HttpPost]
        public HttpResponseMessage GetPLSContactDetails()
        {
            adminViewModel = new AdminViewModel();
            try
            { 
                 adminServ = new AdminService();
                 adminViewModel.PLSContactDetails = adminServ.GetPLSContactDetails();
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Admin");
                ExceptionManager.Publish(ex, additionalInfo);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in Admin - To get PLS contact details";
                adminViewModel.ErrorBE = errEntity;
            }
            return Request.CreateResponse(HttpStatusCode.OK, adminViewModel);
        }

        /// <summary>
        /// Method to get details of Request Type based Contacts
        /// </summary>
        /// <returns>Admin View Model with details of Request Type based Contacts</returns>
        [HttpPost]
        public HttpResponseMessage GetRequestTypeContactDetails()
        {
            adminViewModel = new AdminViewModel();
            try
            {
                adminServ = new AdminService();
                adminViewModel.RequestTypeContactDetails = adminServ.GetRequestTypeContactDetails();
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Admin");
                ExceptionManager.Publish(ex, additionalInfo);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in Admin - To get request type contact details";
                adminViewModel.ErrorBE = errEntity;
            }
            return Request.CreateResponse(HttpStatusCode.OK, adminViewModel);
        }

        /// <summary>
        /// Method to get LeadAI for Pack Management
        /// </summary>
        /// <returns>Admin View Model with LeadAI values </returns>
        [HttpPost]
        public HttpResponseMessage ManagePack()
        {
            adminViewModel = new AdminViewModel();
            try
            {
                adminServ = new AdminService();
                adminViewModel.LeadAIList = adminServ.GetLeadUICode();
            }
            catch(Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Admin");
                ExceptionManager.Publish(ex, additionalInfo);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in Admin - To get LeadAI for Pack Management ";
                adminViewModel.ErrorBE = errEntity;
            }
            return Request.CreateResponse(HttpStatusCode.OK, adminViewModel);
               
        }

        /// <summary>
        /// Method to get formulations for the selected LeadAI
        /// </summary>
        /// <param name="leadAIText">Selected Lead AI Text</param>
        /// <param name="leadAIValue">Selected Lead AI value</param>
        [HttpPost]
        public HttpResponseMessage GetFormulationForLeadAI(string leadAIValue)
        {
            adminViewModel = new AdminViewModel();
            try
            {
                adminServ = new AdminService();
                //int index = leadAIValue.IndexOf(Constants.HYPHEN);
                if (!string.IsNullOrEmpty(leadAIValue))
                {
                    int intIndex = leadAIValue.IndexOf(Constants.HYPHEN);

                    int leadAI = Convert.ToInt32(leadAIValue.Substring(0, intIndex));

                    adminViewModel.Formulation = adminServ.GetFormulation(leadAI);

                }
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Admin");
                ExceptionManager.Publish(ex, additionalInfo);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in Admin - To get formulations for the selected LeadAI ";
                adminViewModel.ErrorBE = errEntity;
            }
            return Request.CreateResponse(HttpStatusCode.OK, adminViewModel);
        }

        /// <summary>
        /// Method to get Pack Management Details for the specified lead AI and Formulation
        /// </summary>
        /// <param name="leadAI">User selected Lead AI</param>
        /// <param name="formulation">User selected Formulation</param>
        /// <returns></returns>
        [HttpPost]
        public HttpResponseMessage GetPackManagementDetails(string leadAI, string formulation)
        {
            try
            {
                adminServ = new AdminService();
                adminViewModel = new AdminViewModel();
                if (!leadAI.Equals("SELECT") && !formulation.Equals("SELECT"))
                {
                    int leadAIValue = Convert.ToInt32(leadAI.Substring(0, leadAI.IndexOf(Constants.HYPHEN)));
                    int formulationValue = Convert.ToInt32(formulation.Substring(0, formulation.IndexOf(Constants.HYPHEN)));
                    adminViewModel = adminServ.GetPackManagementDetails(leadAIValue, formulationValue);
                }

            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Admin");
                ExceptionManager.Publish(ex, additionalInfo);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in Admin - To get Pack Management Details for the specified lead AI and Formulation";
                adminViewModel.ErrorBE = errEntity;
            }
            return Request.CreateResponse(HttpStatusCode.OK, adminViewModel);
        }

        /// <summary>
        /// Method to update the Pack Tech 
        /// </summary>
        /// <param name="adminObj"></param>
        /// <returns></returns>
        [HttpPost]
        public int UpdatePackTech(Admin adminObj)
        {
            
                
          try
            {
                adminServ = new AdminService();
                int isSuccess = adminServ.AddUserData(adminObj);
                PackTechDetails packTechObj = new PackTechDetails();
                packTechObj.PackID = adminObj.Id;
                packTechObj.PackEngineerID = adminObj.UserId;
                isSuccess = adminServ.UpdatePackTechDetails(packTechObj);
                return isSuccess;
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Admin");
                ExceptionManager.Publish(ex, additionalInfo);
                return 420;
            }
        }

        [HttpPost]
        public int UpdateLocalSCP(Admin adminObj)
        {
            try
            {
                adminServ = new AdminService();
                LocalSCP localSCPObj = new LocalSCP();
                int isSuccess = 0;
                if (!String.IsNullOrEmpty(adminObj.FirstName) && !String.IsNullOrEmpty(adminObj.LastName) && !String.IsNullOrEmpty(adminObj.UserId) && !String.IsNullOrEmpty(adminObj.Email))
                {
                    isSuccess = adminServ.AddUserData(adminObj);
                    localSCPObj.LocalSCPID = adminObj.Id;
                    localSCPObj.LSCP_UserID = adminObj.UserId;
                    isSuccess = adminServ.UpdateLocalSCPDetails(localSCPObj,1);
                }

                if (!String.IsNullOrEmpty(adminObj.SecondUserFirstName) && !String.IsNullOrEmpty(adminObj.SecondUserLastName) && !String.IsNullOrEmpty(adminObj.SecondUserId) && !String.IsNullOrEmpty(adminObj.SecondUserEmail))
                {
                    adminObj.FirstName = adminObj.SecondUserFirstName;
                    adminObj.LastName = adminObj.SecondUserLastName;
                    adminObj.UserId = adminObj.SecondUserId;
                    adminObj.Email = adminObj.SecondUserEmail;
                    isSuccess = adminServ.AddUserData(adminObj);
                    localSCPObj.LocalSCPID = adminObj.Id;
                    localSCPObj.LSCP_UserID = adminObj.SecondUserId;
                    isSuccess = adminServ.UpdateLocalSCPDetails(localSCPObj,2);
                }

                return isSuccess;
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Admin");
                ExceptionManager.Publish(ex, additionalInfo);
                return 420;
            }
        }

        [HttpPost]
        public int UpdatePLS(Admin adminObj)
        {
            try
            {
                adminServ = new AdminService();
                PLSContacts plsObj = new PLSContacts();
                int isSuccess = 0;
                if (!String.IsNullOrEmpty(adminObj.FirstName) && !String.IsNullOrEmpty(adminObj.LastName) && !String.IsNullOrEmpty(adminObj.UserId) && !String.IsNullOrEmpty(adminObj.Email))
                {
                    isSuccess = adminServ.AddUserData(adminObj);
                    plsObj.PLS_ID = adminObj.Id;
                    plsObj.UserName = adminObj.UserId;
                    isSuccess = adminServ.UpdatePLSContactDetails(1, plsObj);
                }

                if (!String.IsNullOrEmpty(adminObj.SecondUserFirstName) && !String.IsNullOrEmpty(adminObj.SecondUserLastName) && !String.IsNullOrEmpty(adminObj.SecondUserId) && !String.IsNullOrEmpty(adminObj.SecondUserEmail))
                {
                    adminObj.FirstName = adminObj.SecondUserFirstName;
                    adminObj.LastName = adminObj.SecondUserLastName;
                    adminObj.UserId = adminObj.SecondUserId;
                    adminObj.Email = adminObj.SecondUserEmail;
                    isSuccess = adminServ.AddUserData(adminObj);
                    plsObj.PLS_ID = adminObj.Id;
                    plsObj.UserName = adminObj.SecondUserId;
                    isSuccess = adminServ.UpdatePLSContactDetails(2, plsObj);
                }

                return isSuccess;
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Admin");
                ExceptionManager.Publish(ex, additionalInfo);
                return 420;
            }
        }

        [HttpPost]
        public int UpdateRequestTypeBasedContacts(Admin adminObj)
        {
            try
            {
                adminServ = new AdminService();
                int isSuccess = adminServ.AddUserData(adminObj);
                RequestContact requestContactObj = new RequestContact();
                requestContactObj.RequestContact_ID = adminObj.Id;
                requestContactObj.UserID = adminObj.UserId;
                isSuccess = adminServ.UpdateContactBasedonRequestType(requestContactObj);

                return isSuccess;
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Admin");
                ExceptionManager.Publish(ex, additionalInfo);
                return 420;
            }
        }

        [HttpPost]
        public int UpdatePack(Pack packObj)
        {
            try
            {
                adminServ = new AdminService();
                int isSuccess = adminServ.UpdatePackComment(packObj);

                return isSuccess;
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Admin");
                ExceptionManager.Publish(ex, additionalInfo);
                return 420;
            }
        }

        /// <summary>
        /// Method to get the Dummy Pack
        /// </summary>
        /// <param name="leadAI">Selected Lead AI</param>
        /// <param name="formulation">Selected Formulation</param>
        /// <returns>Return Admin View Model containing the Dummy Pack details</returns>
        [HttpPost]
        public HttpResponseMessage GetDummyPack(string leadAI, string formulation, string saveOrDisplay)
        {
            try
            {
                adminServ = new AdminService();
                int leadAIValue = Convert.ToInt32(leadAI.Substring(0, leadAI.IndexOf(Constants.HYPHEN)));
                int formulationValue = Convert.ToInt32(formulation.Substring(0, formulation.IndexOf(Constants.HYPHEN)));
                int saveOrDisplayValue = string.IsNullOrEmpty(saveOrDisplay) ? 0 : Convert.ToInt32(saveOrDisplay);
                AdminViewModel adminVM = adminServ.GetDummyPack(leadAIValue, formulationValue, saveOrDisplayValue);
                return Request.CreateResponse(HttpStatusCode.OK, adminVM);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Admin");
                ExceptionManager.Publish(ex, additionalInfo);
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in Admin - To get dummy pack details";
                adminViewModel.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, adminViewModel);
            }

        }

        /// <summary>
        /// Method to delete the Dummy Pack
        /// </summary>
        /// <param name="leadAI">Selected Lead AI</param>
        /// <param name="formulation">Selected Formulation</param>
        /// <returns>returns: 1 - Success, 0 - Failure</returns>
        public int DeleteDummyPack(int leadAI, int formulation)
        {
            try
            {
               adminServ = new AdminService();            
               int success = adminServ.DeleteDummyPack(leadAI, formulation);
               return success;
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Admin");
                ExceptionManager.Publish(ex, additionalInfo);
                return 420;
            }
        }

    }
}
