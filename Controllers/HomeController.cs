using Syngenta.ERMS.Common;
using Syngenta.ERMS.Common.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace ERMS.Controllers
{
    public class HomeController : ApiController
    {
        //public ActionResult Index()
        //{
        //    return View();
        //}

        [HttpPost]
        public HomeViewModel SetCurrentUser()
        {
            HomeViewModel VmHome = new HomeViewModel();
            ERMSAuthorization authenticate = new ERMSAuthorization();
            //bool authorized = false;
            VmHome.IsAuthorized = authenticate.SetCurrentUser();

            if (HttpContext.Current.Session[Constants.USER_REGION] != null && HttpContext.Current.Session[Constants.USER_REGION].ToString().Equals(Constants.REGION_LATAM))
            {
                VmHome.Region = Constants.TEXT_LATAM;
                VmHome.TitleRegion = Constants.TITLE_LATAM;
                VmHome.WelcomeText = Constants.LATAM_WELCOME_NOTE;
                VmHome.TrainingNote = Constants.TRAINING_LATAM;
            }
            else if (HttpContext.Current.Session[Constants.USER_REGION] != null && HttpContext.Current.Session[Constants.USER_REGION].ToString().Equals(Constants.REGION_EAME))
            {
                VmHome.Region = Constants.TEXT_EUROPE;
                VmHome.TitleRegion = Constants.TITLE_EUROPE;
                VmHome.WelcomeText = Constants.EAME_WELCOME_NOTE;
                VmHome.TrainingNote = Constants.TRAINING_EAME;
            }

            return VmHome;
        }
    }
}
