using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using Syngenta.ERMS.Common;
using Syngenta.ERMS.Services.ServiceInterfaces;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.BusinessEntities;

namespace ERMS
{
    public class ERMSAuthorization : System.Web.Mvc.AuthorizeAttribute
    {
        #region Variables
        string[] userrole; 
        //string loginID;
        //string domain;		
        #endregion Variables

        public bool SetCurrentUser()
        {
            string fullUserName = HttpContext.Current.Request.LogonUserIdentity.Name;
            string[] nameArray = fullUserName.Split('\\');
            string region = string.Empty;
            bool status = false;
            if (null != nameArray && nameArray.Length >= 2)
            {
                string userName = nameArray[1];
                string domainName = nameArray[0];

                HttpContext.Current.Session["FullUserName"] = fullUserName;
                HttpContext.Current.Session["UserName"] = userName;
                HttpContext.Current.Session["Domain"] = domainName;

                // Check whether the user name is in the Users property, if not, return false.
                if (string.IsNullOrEmpty(Users) || Users.Contains(userName))
                {
                    List<string> roleName =new List<string>();
                    IAuthorizationService service = new AuthorizationService();

                    Admin adminObj = service.GetLoggedInUser(fullUserName);
                    HttpContext.Current.Session[Constants.SESSION_USER_ROLE] = adminObj.Role;
                    status = !adminObj.Region.Equals(Constants.TEXT_USER_NOT_EXISTS) ? true : false;
                    if (status)
                    {
                        HttpContext.Current.Session[Constants.USER_REGION] = adminObj.Region;
                        status = true;
                    }                   
                }  
            }
            return status;
        }

        /// <summary>
        /// Logic for unauthorized request. Show the necessary information to user, and let
        /// the user know what happened
        /// </summary>
        /// <param name="filterContext">Authorization Context</param>
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            if (filterContext.HttpContext.Request.IsAjaxRequest())
            {
                filterContext.Result = new JsonResult()
                {
                    Data = new { IsSuccess = false, Message = "Access Limited" },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }

            if (filterContext.HttpContext.Response.StatusCode == Constants.HTTP_UNAUTHORIZED_CODE)
            {
                filterContext.Result = new RedirectResult("~/Error/AccessDenied");                
            }
        }

        /// <summary>
        /// check current user's permission 
        /// </summary>
        /// <param name="roles">roles</param>
        /// <param name="httpContext">httpContext</param>
        /// <param name="userName">userName</param>
        /// <returns></returns>
        private bool IsAccess(List<string> roles, HttpContextBase httpContext, string userName)
        {
            bool pass = false;
            string roleString = string.Empty;
            for (int i = 0; i < roles.Count; i++)
            {
                if (string.IsNullOrEmpty(Roles) || Roles.Contains(roles[i]))
                {
                    pass = true;
                }
                roleString += roles[i] + ",";

            }
            httpContext.Session["Role"] = roles;
            httpContext.Session["RoleString"] = roleString.Substring(0, roleString.Length - 1);
            httpContext.Session["UserName"] = userName;
            
            return pass;
        }      

        public bool IsInRole(string role)
        {
            if (role.ToUpper() == "ADMIN")
            {
                if (IsAdmin())
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }        
       
        public bool IsAdmin()
        {
            Array.Sort(userrole);
            return Array.BinarySearch(userrole, "ADMIN") >= 0 ? true : false;
        }
        

        /// <summary>
        /// To check if the current user has access to the page or not
        /// </summary>
        /// <param name="menuCode"></param>
        /// <returns>True: if page is accessible, False: if access is not granted</returns>
   
        public bool HasAccessToPage(string menuCode)
        {
            Array.Sort(userrole);
            if (menuCode == "AD")
            {
                if (IsAdmin())
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return true;
            }
        }
       
    }
}