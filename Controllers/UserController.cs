using Syngenta.ERMS.BusinessEntities;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.Services.ServiceInterfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ERMS.Controllers
{
    public class UserController : ApiController
    {
        IAdminService admService = new AdminService();

        [HttpPost]
        public int RegisterUser(Admin userDetails)
        {
            int userAdded = -1;
            if (userDetails != null)
            {
                userAdded = admService.AddUserData(userDetails);
            }

            return userAdded;
        }
    }
}
