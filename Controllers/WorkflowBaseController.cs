using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Xml;

using Syngenta.ERMS.BusinessEntities;
using Syngenta.ERMS.Common;
using Syngenta.ERMS.Common.ViewModels;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.Services.Services;
using Syngenta.ERMS.Services.ServiceInterfaces;

using System.Collections.Specialized;
using Newtonsoft.Json.Linq;
using Syngenta.ERMS.ExceptionManagement;
using Newtonsoft.Json;

namespace ERMS.Controllers
{
    public abstract class WorkflowBaseController : ApiController
    {
        #region Fields

        private int noOfTabs;
        private int order;
        private int bytenoOfTabsMM = 1;
        //private int byteselectedTabMM = 1;
        private string[] tabNames = new string[9];
        private string[] urls = new string[8];
        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";
        private HeadControlService headerService = new HeadControlService();
       
        #endregion

        #region Workflow methods

        public HttpResponseMessage GetRequestTab(int requestId)
        {
            HeaderControlViewModel headerViewModel = new HeaderControlViewModel();
            try
            {
                headerViewModel = headerService.GetHeaderDetails(requestId);
                string userregion = HttpContext.Current.Session[Constants.USER_REGION].ToString();
                //nancy:according to the diffrent region,load the diffrent LoadXML function.
                if (userregion == "EAME")
                {
                    LoadXML(requestId, headerViewModel, 0);
                }
                else
                {
                    LoadXML(requestId, headerViewModel, 1);
                }
                //LoadXML(requestId, headerViewModel, 1);
                headerViewModel.TabNames = new List<string>();
                for (int i = 0; i <= tabNames.Length - 1; i++)
                {
                    headerViewModel.TabNames.Add(tabNames[i]);
                }


                return Request.CreateResponse(HttpStatusCode.OK, headerViewModel);
            }
            catch (Exception ex)
            {

                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "WorkFlow Base controller");
                //Message = errMessages.GetString("Error in loading search realted filters");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in getting request header data from GetRequestTab method in WorkFlowBaseController";
                headerViewModel.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, headerViewModel);
            }
        }

        private void LoadXML(int requestId, HeaderControlViewModel headerViewModel,int xmlno)
        {
            int countOfTabsMM = 0;
            int selectedTabIndexMM = 0;
            string tabNameMM = "";
            string tabUrlMM = "";
            string trimChar = "*";
            string showEPM = "";
           
            FileInfo fileInfo;
            if (xmlno == 0)
            {


                fileInfo = new FileInfo(System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/" + Constants.FILE_NAME));
            }
            else
            {
                fileInfo = new FileInfo(System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/" + Constants.FILE_NAME2));
            }
       
            //Check if the file exists

           
            if (!fileInfo.Exists)
            {
                return;
            }

            if (headerViewModel.GetRangeRequestType == Constants.PFR)
            {
                showEPM = headerService.GetEPMShow(requestId);
            }

            //Add by nancy, 2016-08-22, old logic is also this
            if (headerViewModel.GetRangeRequestType == Constants.EPT_Copy)
            {
                headerViewModel.GetRangeRequestType = Constants.EPT;
            } 
            //Add End

            XmlDocument xmlDoc = new XmlDocument();

            xmlDoc.Load(fileInfo.FullName);

            //if request is complete, rejected or deleted, same as RDM count
            if (headerViewModel.GetProgCode == 5 || headerViewModel.GetProgCode == -1 || headerViewModel.GetProgCode == -99)
            {
                headerViewModel.GetProgCode = 8;
            }

            foreach (XmlNode node in xmlDoc["ERMSRequestTab"])
            {
                if (Convert.ToInt32(node.Attributes["tabReqCode"].Value) == headerViewModel.GetProgCode && node.Attributes["type"].Value == headerViewModel.GetRangeRequestType)
                {
                    noOfTabs = Convert.ToInt32(node.Attributes["count"].Value.ToString());   //for what use???

                    //#region old   order not needed now

                    //order = Convert.ToInt32(node.Attributes["order"].Value.ToString());
                    ////start of change by Tod for ERMS case 1113902-1 and 1126755-1
                    //if (Convert.ToInt32(node.Attributes["tabReqCode"].Value) == 8 && node.Attributes["type"].Value == "EPT")
                    //{
                    //    // order = 5;
                    //    //changed by srikanth to fix tab setting when RDM directly selects More data required.
                    //    if (headerViewModel.GetOtherData != string.Empty && headerViewModel.GetOtherData.Split(',')[5] != string.Empty && headerViewModel.GetOtherData.Split(',')[5] != null && headerViewModel.GetOtherData.Split(',')[5] != "Jan  1 1900 12:00AM")
                    //    {
                    //        order = 5 + xmlno;
                    //    }
                    //    else
                    //    {
                    //        order = 4 + xmlno;
                    //    }
                    //    //end
                    //}
                    //if (Convert.ToInt32(node.Attributes["tabReqCode"].Value) == 8 && node.Attributes["type"].Value == "New Pack")
                    //{
                    //    // order = 7;
                    //    //changed by srikanth to fix tab setting when RDM directly selects Moredata required.
                    //    if (headerViewModel.GetOtherData != string.Empty && headerViewModel.GetOtherData.Split(',')[5] != string.Empty && headerViewModel.GetOtherData.Split(',')[5] != null && headerViewModel.GetOtherData.Split(',')[5] != "Jan  1 1900 12:00AM")
                    //    {
                    //        order = 7 + xmlno;
                    //    }
                    //    else
                    //    {
                    //        order = 6 + xmlno;
                    //    }
                    //    //end
                    //}
                    ////end of change by Tod 

                    //#endregion

                    break;
                }
            }

            //reducing count of tabs by 1 for no hurdles -- this must be tested
            if ((headerViewModel.GetRangeRequestType == Constants.COUNTRY_ADD || headerViewModel.GetRangeRequestType == Constants.NEW_PACK) && headerViewModel.GetProgCode == 3)
            {
                noOfTabs = noOfTabs - 1;
            }

            //default tab
            if (noOfTabs <= 0)
            {
                noOfTabs = 1;
                tabNames[0] = Constants.REQUEST;
                tabNameMM = "*" + Constants.REQUEST;
                countOfTabsMM = 1;
                selectedTabIndexMM = 1;
            }
            else
            {
                int i = 0;

                //assign names and urls               
                foreach (XmlNode node in xmlDoc["ERMSRequestTab"])
                {
                    if (headerViewModel.GetRangeRequestType == node.Attributes["type"].Value && noOfTabs >= Convert.ToInt32(node.Attributes["count"].Value))
                    {
                        tabNames[i] = node.Attributes["name"].Value.ToString();
                        //nancy change
                        //urls[i] = node.Attributes["page"].Value.ToString();
                        i++;
                    }
                }

                //#region old get tab urls, don't need it forever

                //bool url = false;
                //bool epm = false;

                //foreach (XmlNode node in xmlDoc["ERMSRequestTab"])
                //{
                //    if (Convert.ToInt32(node.Attributes["order"].Value) <= order && node.Attributes["type"].Value == headerViewModel.GetRangeRequestType)
                //    {
                //        countOfTabsMM += 1;

                //        if (node.Attributes["tabCode"].Value.ToString() == ErmsTabCode)
                //        {
                //            selectedTabIndexMM = countOfTabsMM;
                //        }

                //        ///Remove tab based on hurdles
                //        // Begin: Modified for Enhancement by Infosys Sep 2012 
                //        //
                //        //if (GetRangeRequestType == Constants.COUNTRY_ADD && GetOtherData != string.Empty && GetOtherData.Split(',')[0] != string.Empty && Convert.ToDecimal(GetOtherData.Split(',')[0]) > 20000)
                //        if (headerViewModel.GetRangeRequestType == Constants.COUNTRY_ADD && headerViewModel.GetOtherData != string.Empty && headerViewModel.GetOtherData.Split(',')[0] != string.Empty && Convert.ToDecimal(headerViewModel.GetOtherData.Split(',')[0]) > 30000)
                //        // End: Modified for Enhancement by Infosys Sep 2012
                //        {
                //            //skip EPM if sales > 20k
                //            if (node.Attributes["tabCode"].Value.ToString() != "EPM_CA")
                //            {
                //                tabNameMM = tabNameMM + "*" + node.Attributes["name"].Value.ToString();
                //            }
                //        }
                //        else if (headerViewModel.GetRangeRequestType == Constants.NEW_PACK && headerViewModel.GetOtherData != string.Empty && Convert.ToInt32(headerViewModel.GetOtherData.Split(',')[1]) == 14)
                //        {

                //            tabNameMM = tabNameMM + "*" + node.Attributes["name"].Value.ToString();

                //        }
                //        else if (headerViewModel.GetRangeRequestNumber.Contains("Copy"))
                //        {
                //            //skip FAST, SCP, Pack Tech
                //            if (node.Attributes["tabCode"].Value.ToString() == "FAST_EPT" || node.Attributes["tabCode"].Value.ToString() == "SCP_EPT" || node.Attributes["tabCode"].Value.ToString() == "PE_EPT")
                //            {
                //                // countOfTabsMM = countOfTabsMM - 1;
                //            }
                //            else
                //            {
                //                tabNameMM = tabNameMM + "*" + node.Attributes["name"].Value.ToString();
                //            }
                //        }
                //        //Begin added by amy on apr 21
                //        //else if (GetRangeRequestType == Constants.PFR && Convert.ToInt32(requestId) < Convert.ToInt32(ConfigurationManager.AppSettings["NewPFRStart"]))
                //        else if (headerViewModel.GetRangeRequestType == Constants.PFR && showEPM == "false")
                //        {
                //            //headerControlPresenter.GetEPMShow(RequestId);
                //            if (node.Attributes["tabCode"].Value.ToString() != "EPM_PFR")
                //                tabNameMM = tabNameMM + "*" + node.Attributes["name"].Value.ToString();
                //        }
                //        //End added by amy on apr 21
                //        else
                //        {
                //            tabNameMM = tabNameMM + "*" + node.Attributes["name"].Value.ToString();
                //        }
                //        if (requestId != 0)
                //        {
                //            string pageName = node.Attributes["page"].Value.ToString();
                //            pageName = pageName.Substring(0, pageName.Length - 2);
                //            ///Remove tab based on hurdles

                //            // Begin: Modified for Enhancement by Infosys Sep 2012
                //            //if (GetRangeRequestType == Constants.COUNTRY_ADD && GetOtherData != string.Empty && GetOtherData.Split(',')[0] != string.Empty && Convert.ToDecimal(GetOtherData.Split(',')[0]) > 20000)
                //            if (headerViewModel.GetRangeRequestType == Constants.COUNTRY_ADD && headerViewModel.GetOtherData != string.Empty && headerViewModel.GetOtherData.Split(',')[0] != string.Empty && Convert.ToDecimal(headerViewModel.GetOtherData.Split(',')[0]) > 30000)
                //            // End: Modified for Enhancement by Infosys Sep 2012
                //            {
                //                //skip EPM if sales > 20k
                //                if (node.Attributes["tabCode"].Value.ToString() != "EPM_CA")
                //                {
                //                    tabUrlMM = tabUrlMM + "*" + pageName + "?RequestId=" + requestId.ToString();
                //                    url = true;
                //                    epm = true;

                //                }
                //                else
                //                {
                //                    countOfTabsMM = countOfTabsMM - 1;
                //                }
                //            }
                //            else if (headerViewModel.GetRangeRequestType == Constants.NEW_PACK && headerViewModel.GetOtherData != string.Empty && Convert.ToInt32(headerViewModel.GetOtherData.Split(',')[1]) == 14)
                //            {
                //                tabUrlMM = tabUrlMM + "*" + pageName + "?RequestId=" + requestId.ToString();
                //                url = true;
                //            }
                //            else if (headerViewModel.GetRangeRequestNumber.Contains("Copy"))
                //            {
                //                //skip FAST, SCP, Pack Tech
                //                if (node.Attributes["tabCode"].Value.ToString() == "FAST_EPT" || node.Attributes["tabCode"].Value.ToString() == "SCP_EPT" || node.Attributes["tabCode"].Value.ToString() == "PE_EPT")
                //                {
                //                    countOfTabsMM = countOfTabsMM - 1;
                //                }
                //                //Start change by Infosys for EPT copy request page load issue
                //                else if (node.Attributes["tabCode"].Value.ToString() == "EPT")
                //                {
                //                    tabUrlMM = tabUrlMM + "*" + pageName + "?RequestId=" + requestId.ToString() + "&Copy=" + requestId.ToString();
                //                    url = true;
                //                }
                //                //End change
                //                else
                //                {
                //                    tabUrlMM = tabUrlMM + "*" + pageName + "?RequestId=" + requestId.ToString();
                //                    url = true;
                //                }
                //            }
                //            //Begin added by amy on apr 21
                //            //else if (GetRangeRequestType == Constants.PFR && Convert.ToInt32(requestId) < Convert.ToInt32(ConfigurationManager.AppSettings["NewPFRStart"]))
                //            else if (headerViewModel.GetRangeRequestType == Constants.PFR && showEPM == "false")
                //            {
                //                if (node.Attributes["tabCode"].Value.ToString() != "EPM_PFR")
                //                {
                //                    tabUrlMM = tabUrlMM + "*" + pageName + "?RequestId=" + requestId.ToString();
                //                    url = true;
                //                }
                //                else
                //                {
                //                    countOfTabsMM = countOfTabsMM - 1;
                //                }
                //            }
                //            //End added by amy on apr 21
                //            else
                //            {
                //                tabUrlMM = tabUrlMM + "*" + pageName + "?RequestId=" + requestId.ToString();
                //                url = true;
                //            }
                //            //Approval Step for GSCM and EBM
                //            //begin modified by amy on apr 21 
                //            //if (node.Attributes["tabCode"].Value.ToString() == "GSCM1_SC" || node.Attributes["tabCode"].Value.ToString() == "EPM1_CMBI" || node.Attributes["tabCode"].Value.ToString() == "EPM_NP" || ((epm != true) && node.Attributes["tabCode"].Value.ToString() == "EPM_CA"))
                //            if (node.Attributes["tabCode"].Value.ToString() == "GSCM1_SC" || node.Attributes["tabCode"].Value.ToString() == "EPM1_CMBI" || node.Attributes["tabCode"].Value.ToString() == "EPM_NP" || ((epm != true) && node.Attributes["tabCode"].Value.ToString() == "EPM_CA") || (node.Attributes["tabCode"].Value.ToString() == "EPM_PFR" && showEPM == "true"))
                //                //end modified by amy on apr 21   
                //                tabUrlMM = tabUrlMM + "&ApprovalStep=1";
                //            if (node.Attributes["tabCode"].Value.ToString() == "GSCM2_SC" || node.Attributes["tabCode"].Value.ToString() == "EPM2_CMBI")
                //                tabUrlMM = tabUrlMM + "&ApprovalStep=2";
                //            int type = 0;

                //            if (headerViewModel.GetRangeRequestType == Constants.NEW_PACK && node.Attributes["tabCode"].Value.ToString() == "NP")
                //            {
                //                type = 2;
                //            }
                //            else if (headerViewModel.GetRangeRequestType == Constants.COUNTRY_ADD && node.Attributes["tabCode"].Value.ToString() == "CA")
                //            {
                //                type = 3;
                //            }

                //            if (node.Attributes["tabCode"].Value.ToString() == "CA" || node.Attributes["tabCode"].Value.ToString() == "NP")
                //            {
                //                tabUrlMM = tabUrlMM + "&RequestType=" + type;
                //            }

                //            if (url == true)
                //            {
                //                tabUrlMM = tabUrlMM + "\")";
                //                url = false;
                //            }

                //        }
                //        else
                //            tabUrlMM = tabUrlMM + "*" + node.Attributes["page"].Value.ToString();
                //    }
                //}

                //#endregion
            }

            //tabNameMM = tabNameMM.TrimStart(trimChar.ToCharArray());
            //tabUrlMM = tabUrlMM.TrimStart(trimChar.ToCharArray());

            bytenoOfTabsMM = countOfTabsMM;

            char[] ch = { '*' };
            //tabNames = tabNameMM.Split(ch, bytenoOfTabsMM);
        }

        public HttpResponseMessage GetNextPage(int requestId, string requestType, string tabCode)
        {
            try
            {
            NextTabObj nextTabObj = new NextTabObj();
            try
            {

            //start of change by Infosys for ERMS case 1165727 and case 1269404-1 EPT Copy
            string EstTime = "";
            string NSUCode = "";
            string BPSCode = "";
            string saveOrSubmit = "";
            string ccAddress = "";
            string mailTo = null;
            string EPTCopyRR = "";

            if (tabCode.Contains(","))
            {
                if (tabCode.Split(',').Length == 3)
                {
                    string[] tabCodeTemp = new string[3];
                    tabCodeTemp = tabCode.Split(',');
                    tabCode = tabCodeTemp[0];
                    EstTime = tabCodeTemp[1];
                    saveOrSubmit = tabCodeTemp[2];
                }
                else
                {
                    string[] tabCodeTemp = new string[5];
                    tabCodeTemp = tabCode.Split(',');

                    if (tabCode.Split(',').Length == 5)
                    {
                        if (tabCodeTemp[4] != string.Empty)
                        {
                            EPTCopyRR = tabCodeTemp[4];
                        }
                    }

                    tabCode = tabCodeTemp[0];
                    NSUCode = tabCodeTemp[1];
                    BPSCode = tabCodeTemp[2];
                    saveOrSubmit = tabCodeTemp[3];
                }
            }
            //end of change by Infosys for ERMS case 1165727 and case 1269404-1
            BaseService baseService = new BaseService();
            DataSet dsToAddress;

            if (EstTime != "" || NSUCode != "" || BPSCode != "")
            {
                dsToAddress = baseService.GetEmailAddress(requestId, tabCode, saveOrSubmit);
            }
            else
            {
                //cHECK WITH MARTIN, LAST PARAMETER CANNOT NBE EMpty
                dsToAddress = baseService.GetEmailAddress(requestId, tabCode, string.Empty);
            }


            #region Mail
            try
            {

                MailService mail = new MailService();
                string subject = string.Empty;
                StringBuilder sbBody = new StringBuilder();
                string informationText = string.Empty;
                bool packHeadFlag = false;

                //Read subject and body from xml file
                //Check if the file exists
                string mailPath = HttpContext.Current.Request.PhysicalApplicationPath;
                FileInfo mailFileInfo = new FileInfo(System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/" + Constants.MAIL_FILE_NAME));
                if (!mailFileInfo.Exists)
                {
                }

                XmlDocument xmlMailDoc = new XmlDocument();

                xmlMailDoc.Load(mailFileInfo.FullName);

                //int flag = 0;//change by Tod Zhang on 21/3/2008 for case 1095831-1
                int count;
                string type = string.Empty;
                for (count = 0; count < dsToAddress.Tables.Count; count++)
                {
                    if (dsToAddress.Tables[count].Rows.Count > 0)
                    {
                        sbBody = new StringBuilder();

                        //Start change for case 1269404-1 EPT Copy mail
                        //Added for sending mail to originator when RDM raise PU code to Pack Tech by Infosys on 26-Mar-2009
                        int intXMLMail = 0;
                        //End change
                        //Added for case 1313367-1 Email Information Error on 15-Jun-2009
                        int intStatus = 0;

                        foreach (XmlNode node in xmlMailDoc["ERMSMail"])
                        {
                            if (dsToAddress.Tables[count].Rows[0]["RequestType"].ToString() == Constants.EPT_Copy)
                                type = Constants.EPT;
                            else
                                type = dsToAddress.Tables[count].Rows[0]["RequestType"].ToString();

                            if (node.Attributes["tabCode"].Value == type && node.Attributes["status"].Value == dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() && Convert.ToInt32(node.Attributes["mail"].Value) == count + 1)
                            {
                                //Start change for case 1269404-1 EPT Copy mail
                                //Added for sending mail to originator when RDM raise PU code to Pack Tech by Infosys on 26-Mar-2009
                                intXMLMail = Convert.ToInt32(node.Attributes["mail"].Value);
                                // End change on 26-Mar-2009
                                // Added for case 1313367-1 Email Information Error on 15-Jun-2009
                                intStatus = Convert.ToInt32(node.Attributes["status"].Value);

                                if (dsToAddress.Tables[0].Rows[0]["RequestType"].ToString() == Constants.COMBI_PACK && dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "2")
                                {
                                    if (dsToAddress.Tables[count].Rows[0]["RequestType"].ToString() == Constants.SUPPLY_CHAIN)
                                    {
                                        informationText = "SCP Data Input Required";
                                        subject = node.Attributes["subject"].Value + dsToAddress.Tables[count].Rows[0]["RequestId"].ToString() + " - " + informationText;
                                        break;
                                    }
                                    else
                                    {
                                        informationText = node.Attributes["body"].Value;
                                        subject = node.Attributes["subject"].Value + dsToAddress.Tables[count].Rows[0]["RequestId"].ToString() + " - " + informationText;
                                        break;
                                    }
                                }
                                //start of change by Tod Zhang for ERMS SU/NSU mail subject problem                                                  
                                else
                                {
                                    if (dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "5")
                                    {
                                        informationText = node.Attributes["body"].Value;
                                        subject = node.Attributes["subject"].Value + dsToAddress.Tables[count].Rows[0]["RequestId"].ToString() + " - " + informationText;
                                        break;
                                    }
                                    else
                                    {
                                        informationText = node.Attributes["body"].Value;
                                        subject = node.Attributes["subject"].Value + dsToAddress.Tables[count].Rows[0]["RequestId"].ToString() + " - " + informationText;
                                        //if the pack engineer click the save button or submit button for step1 or step3, the mailto address,mail content and mail subject need to be updated
                                        //start of change by Infosys for ERMS case 1165727
                                        if (saveOrSubmit == "save1" || saveOrSubmit == "submit1")
                                        {
                                            string[] date = new string[3];
                                            if (EstTime.Contains("/"))
                                            {
                                                date = EstTime.Split('/');
                                                if (date.Length == 3)
                                                    EstTime = date[1] + "/" + date[0] + "/" + date[2];
                                            }

                                            informationText = informationText.Replace(informationText, "This ERMS information is sent to you as the originator of this request, the Est Pack Comp Date: @EstPackDate has been raised.");
                                            informationText = informationText.Replace("@EstPackDate", EstTime);
                                            subject = subject.Replace(subject, "ERMS INFORMATION: request no " + dsToAddress.Tables[count].Rows[0]["RequestId"] + " - " + "Est Pack Comp Date has been raised");
                                        }
                                        else if ((saveOrSubmit == "save3" || saveOrSubmit == "submit3"))
                                        {
                                            //Start of change on 21/1/2009
                                            if (NSUCode != "" && BPSCode != "" && saveOrSubmit == "submit3")
                                            {
                                                subject = subject.Replace(subject, "ERMS Alert: request no " + dsToAddress.Tables[count].Rows[0]["RequestId"] + " - " + "NSU code and BPS code have been  raised");

                                                informationText = informationText.Replace(informationText, "Request no " + dsToAddress.Tables[count].Rows[0]["RequestId"] + " - " + "This ERMS alert is sent to you as the RDM contact of this request, the NSU code: @NSU and BPS code: @BPS have been raised.");

                                                if (dsToAddress.Tables[count].Rows[0]["EmailAdds"].ToString() == "Richard.Ball@syngenta.com" || dsToAddress.Tables[count].Rows[0]["EmailAdds"].ToString() == "Freddy.Pfammatter@syngenta.com")
                                                {
                                                    subject = subject.Replace(subject, "ERMS INFORMATION: request no " + dsToAddress.Tables[count].Rows[0]["RequestId"] + " - " + "BPS code and NSU code have been raised.");
                                                    informationText = informationText.Replace(informationText, "Request no " + dsToAddress.Tables[count].Rows[0]["RequestId"] + " - " + "This ERMS information is sent to you to inform that the NSU code: @NSU and BPS code: @BPS have been raised.");
                                                }
                                                informationText = informationText.Replace("@NSU", NSUCode);
                                                informationText = informationText.Replace("@BPS", BPSCode);
                                            }
                                            else if (NSUCode != "" && BPSCode != "" && saveOrSubmit == "save3")
                                            {
                                                subject = subject.Replace(subject, "ERMS Information: request no " + dsToAddress.Tables[count].Rows[0]["RequestId"] + " - " + "NSU code and BPS code have been  raised");
                                                informationText = informationText.Replace(informationText, "This ERMS information is sent to you as the RDM contact of this request, the NSU code: @NSU and BPS code: @BPS have been raised.");
                                                informationText = informationText.Replace("@NSU", NSUCode);
                                                informationText = informationText.Replace("@BPS", BPSCode);
                                            }
                                            //End of change on 21/1/2009
                                            //only raised the BPS code by pack engineer
                                            else if (NSUCode == "" && BPSCode != "" && saveOrSubmit == "save3")
                                            {
                                                informationText = informationText.Replace(informationText, "This ERMS information is sent to you as the RDM contact of this request, the BPS code: @BPS has been raised");
                                                informationText = informationText.Replace("@BPS", BPSCode);
                                                subject = subject.Replace(subject, "ERMS Information: request no " + dsToAddress.Tables[count].Rows[0]["RequestId"] + " - " + "BPS code has been raised");
                                            }
                                            //only raised the NSU code by pack engineer
                                            else if (NSUCode != "" && BPSCode == "" && saveOrSubmit == "save3")
                                            {
                                                informationText = informationText.Replace(informationText, "This ERMS information is sent to you as the RDM contact of this request, the NSU code: @NSU has been raised");
                                                informationText = informationText.Replace("@NSU", NSUCode);
                                                subject = subject.Replace(subject, "ERMS Information: request no " + dsToAddress.Tables[count].Rows[0]["RequestId"] + " - " + "NSU code has been raised");
                                            }
                                        }
                                        //end of change by Infosys for ERMS case 1165727
                                        break;
                                    }
                                }
                                //end of change by Tod Zhang  
                            }
                        }
                        ccAddress = System.Configuration.ConfigurationManager.AppSettings["CcAddress"];
                        mailTo = dsToAddress.Tables[count].Rows[0]["EmailAdds"].ToString();
                        //mail is being sent to IDS
                        //changes from Tod on 2nd June
                        //if (dsToAddress.Tables[count].Rows[0]["RequestType"].ToString() == Constants.NEW_PACK && dsToAddress.Tables.Count == 2)
                        if (dsToAddress.Tables[count].Rows[0]["RequestType"].ToString() == Constants.NEW_PACK && dsToAddress.Tables.Count == 2 && dsToAddress.Tables[count].Rows[0]["CurrentStatus"].ToString() == "3")
                        {
                            if (count == 1)
                            {
                                informationText = "New Pack request for local source - please raise NSU with dummy BPS";
                                subject = "ERMS INFORMATION: request no " + dsToAddress.Tables[1].Rows[0]["RequestId"] + " - " + informationText;
                            }
                        }





                        //the below block of code was added by infosys for erms case 1102922 on 18 -april 2008
                        string mailFrom = null;
                        //changes from Tod on 2nd June
                        //if (tabCode == "RDM_SC" || tabCode == "RDM_EPT" || tabCode == "RDM_NP" || tabCode == "RDM_CA" || tabCode == "RDM_PFR" || tabCode == "RDM_OTR" || tabCode == "RDM_CMBI")
                        if ((tabCode == "RDM_SC" || tabCode == "RDM_EPT" || tabCode == "RDM_NP" || tabCode == "RDM_CA" || tabCode == "RDM_PFR" || tabCode == "RDM_OTR" || tabCode == "RDM_CMBI") && dsToAddress.Tables[count].Rows[0]["CurrentStatus"].ToString() == "13")
                        {
                            mailFrom = dsToAddress.Tables[count].Rows[0]["RDMContactEmail"].ToString();
                        }
                        if (mailFrom == null || mailFrom == string.Empty)
                        {
                            //start of change by Infosys on the 2008-5-5 for case 1124315
                            //mailFrom = dsToAddress.Tables[count].Rows[0]["EmailAdds"].ToString();
                            mailFrom = System.Configuration.ConfigurationManager.AppSettings["FromAddress"];
                            //end of change by Infosys on the 2008-5-5 for case 1124315
                        }
                        //end of changes by infosys for erms case 1102922

                        string mailTemplatePath = HttpContext.Current.Request.PhysicalApplicationPath;
                        string templatePath = string.Empty;

                        //start of change by Infosys for ERMS case 1165727
                        if (dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "9" ||
                          dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "5" ||
                          dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "10" ||
                          dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "-1")
                        {
                            templatePath = "Document\\MailTemplates\\Information.htm";
                        }
                        else if (dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "13" && count == 0)
                        {
                            templatePath = "Document\\MailTemplates\\MoreDataRequired.htm";
                        }
                        else if (dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "16" ||
                            dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "18")
                        {
                            templatePath = "Document\\MailTemplates\\Concerns.htm";
                        }
                        else
                        {
                            if (informationText.ToUpper().Contains("INFORMATION"))
                                templatePath = "Document\\MailTemplates\\AlertInformation.htm";
                            else
                                templatePath = "Document\\MailTemplates\\Alert.htm";
                        }

                        if (dsToAddress.Tables[count].Rows[0]["RequestType"].ToString() == "PFR" &&
                            dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "5" && (count == 3 || count == 4))
                            templatePath = "Document\\MailTemplates\\Alert.htm";

                        if ((NSUCode != "" && BPSCode == "" && saveOrSubmit == "save3") || (NSUCode == "" && BPSCode != "" && saveOrSubmit == "save3"))
                        {
                            templatePath = "Document\\MailTemplates\\AlertInformation.htm";
                        }
                        else if (saveOrSubmit == "save1" || saveOrSubmit == "submit1")
                        {
                            templatePath = "Document\\MailTemplates\\AlertInformation.htm";

                        }
                        else if (NSUCode != "" && BPSCode != "" && saveOrSubmit == "save3")
                        {
                            templatePath = "Document\\MailTemplates\\AlertInformation.htm";

                        }
                        //Start of change on 21/1/2009
                        //If mail to Freddy Pfammatter or Richard Ball, use AlertInformation mail temp
                        else if (NSUCode != "" && BPSCode != "" && saveOrSubmit == "submit3" && (mailTo.ToString() == "Freddy.Pfammatter@syngenta.com") || (mailTo.ToString() == "Richard.Ball@syngenta.com"))
                        {
                            templatePath = "Document\\MailTemplates\\AlertInformation.htm";
                        }
                        else if (NSUCode != "" && BPSCode != "" && saveOrSubmit == "submit3" && mailTo.ToString() != "Freddy.Pfammatter@syngenta.com" && mailTo.ToString() != "Richard.Ball@syngenta.com")
                        {
                            templatePath = "Document\\MailTemplates\\Alert.htm";
                        }
                        //End of change on 21/1/2009

                        //Start change for case 1269404-1 EPT Copy mail and case 1313367-1 Email Information Error
                        //Added for EPT & New Pack when sending mail to originator when RDM raise PU code to Pack Tech by Infosys on 26-Mar-2009
                        if ((dsToAddress.Tables[count].Rows[0]["RequestType"].ToString() == "EPT" || dsToAddress.Tables[count].Rows[0]["RequestType"].ToString() == "New Pack")
                            && (intXMLMail == 2 || intXMLMail == 3 || intXMLMail == 4)
                            && (intStatus == 8))
                        {
                            templatePath = "Document\\MailTemplates\\Information.htm";
                        }
                        //End change for case 1269404-1 and case 1313367-1

                        //start of change by Infosys for ERMS case 1165727

                        using (StreamReader sr = new StreamReader(mailTemplatePath + templatePath))
                        {
                            String line;
                            // Read and display lines from the file until the end of 
                            // the file is reached.
                            while ((line = sr.ReadLine()) != null)
                            {
                                sbBody.Append(line);
                            }
                        }

                        //Start change for case 1269404-1 EPT Copy mail
                        //Added for EPT & New Pack when sending mail to originator when RDM raise PU code to Pack Tech by Infosys on 26-Mar-2009
                        if (count == 0 || (count == 3 && intXMLMail == 4 &&
                            (dsToAddress.Tables[count].Rows[0]["RequestType"].ToString() == "EPT" || dsToAddress.Tables[count].Rows[0]["RequestType"].ToString() == "New Pack")))
                            sbBody.Replace("<origin>", "originator");
                        else if (count == 1)
                            sbBody.Replace("<origin>", "back up originator");
                        else if (count == 2)
                            sbBody.Replace("<origin>", "regulatory contact");

                        if (dsToAddress.Tables[count].Rows[0]["RequestType"].ToString() == "PFR" && (count == 3 || count == 4))
                            sbBody.Replace("<origin>", "SCP");

                        if (dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "9" ||
                            dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "19" ||
                            dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "5" ||
                            dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "10" ||
                            dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "-1" ||
                            dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "16")
                        {
                            try
                            {
                                sbBody.Replace("<sentTo>", dsToAddress.Tables[count].Rows[0]["EmailAdds"].ToString());
                            }
                            catch (Exception ex)
                            {
                                sbBody.Replace("Sent To:", string.Empty);
                            }

                            try
                            {
                                if (dsToAddress.Tables[count].Rows[0]["Country"].ToString() == null || dsToAddress.Tables[count].Rows[0]["Country"].ToString() == string.Empty)
                                    sbBody.Replace("<country>", "No country information available");
                                else
                                    sbBody.Replace("<country>", dsToAddress.Tables[count].Rows[0]["Country"].ToString());
                            }
                            catch (Exception ex)
                            {
                                sbBody.Replace("Country:", string.Empty);
                            }
                        }

                        sbBody.Replace("<informationText>", informationText);
                        sbBody.Replace("<requestNo>", dsToAddress.Tables[count].Rows[0]["RequestId"].ToString());
                        sbBody.Replace("<requestType>", dsToAddress.Tables[count].Rows[0]["RequestType"].ToString());
                        sbBody.Replace("<leadAI>", dsToAddress.Tables[count].Rows[0]["LeadAI"].ToString());
                        sbBody.Replace("<requestor>", dsToAddress.Tables[count].Rows[0]["Requestor"].ToString());

                        //more data required
                        if (dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() == "13" && count == 0)
                        {
                            try
                            {
                                sbBody.Replace("<notes>", dsToAddress.Tables[count].Rows[0]["notes"].ToString());
                            }
                            catch (Exception ex)
                            {
                                sbBody.Replace("Notes:", string.Empty);
                            }
                        }


                        sbBody.Replace("<SyngentaImage>", "http:\\\\" + HttpContext.Current.Request.Url.Host + "\\ermsNPI\\" + Constants.SyngentaImage);
                        sbBody.Replace("<InfoImage>", "http:\\\\" + HttpContext.Current.Request.Url.Host + "\\ermsNPI\\" + Constants.InfoImage);
                        sbBody.Replace("<link>", "http://" + HttpContext.Current.Request.Url.Host + "/UserInterface/Index.html#/SupplyChainRequest/SupplyChainRequestRequest///" + dsToAddress.Tables[count].Rows[0]["RequestType"].ToString() + "/////////"  + dsToAddress.Tables[count].Rows[0]["RequestId"].ToString() + "/10001");

                        // Start Change for case 1269404-1 EPT Copy by Infosys on 20 Mar 2009
                        //nancy.li:the code is not useful
                        //if (EPTCopyRR != "")
                        //{
                        //    string link = "";
                        //    for (int i = 0; i < EPTCopyRR.Split(' ').Length; i++)
                        //    {
                        //        if (link == "")
                        //        {
                        //            link = "<a href=\"" + "http:\\\\" + HttpContext.Current.Request.Url.Host + "\\ermsNPI\\EPTRangeRequest.aspx?RequestId=" + EPTCopyRR.Split(' ')[i] + "\">" + EPTCopyRR.Split(' ')[i] + "</a>";
                        //        }
                        //        else if (i == EPTCopyRR.Split(' ').Length - 1)
                        //        {
                        //            link = link + " and " + "<a href=\"" + "http:\\\\" + HttpContext.Current.Request.Url.Host + "\\ermsNPI\\EPTRangeRequest.aspx?RequestId=" + EPTCopyRR.Split(' ')[i] + "\">" + EPTCopyRR.Split(' ')[i] + "</a></span>";
                        //        }
                        //        else
                        //        {
                        //            link = link + ", " + "<a href=\"" + "http:\\\\" + HttpContext.Current.Request.Url.Host + "\\ermsNPI\\EPTRangeRequest.aspx?RequestId=" + EPTCopyRR.Split(' ')[i] + "\">" + EPTCopyRR.Split(' ')[i] + "</a>";
                        //        }
                        //    }

                        //    link = "<span style=\"font-family:Verdana;font-size:11px;font-weight:bold\">Please convert the PU to SU on the linked EPT copy request(s) " + link;
                        //    sbBody = sbBody.Replace("<%informationTextForEPTCOPY%>", link);
                        //}
                        // End Change for case 1269404-1

                        //Start of change on 21/1/2009
                        if (mailTo.ToString() == string.Empty || ((mailTo.ToString() == "Freddy.Pfammatter@syngenta.com" || mailTo.ToString() == "Richard.Ball@syngenta.com") && saveOrSubmit == "save3"))
                        { }
                        else
                        {
                            mail.Send(mailTo,
                            ccAddress,
                            mailFrom,
                            subject,
                            sbBody.ToString(),
                            string.Empty,
                            System.Configuration.ConfigurationManager.AppSettings["SMTPServer"]);
                        }
                        //End of change on 21/1/2009



                        if (packHeadFlag == true)
                            break;
                    }
                }
            }
            catch (Exception ex)
            {

            }
            #endregion Mail

            StringBuilder nextPage = new StringBuilder();
            string nextTabCode = string.Empty;
            //Check if the file exists
            string path = HttpContext.Current.Request.PhysicalApplicationPath;
            string userregion = HttpContext.Current.Session[Constants.USER_REGION].ToString();
            FileInfo fileInfo;
            //nancy:according to the diffrent region,load the diffrent LoadXML function.
            if (userregion == "EAME")
            {
                fileInfo = new FileInfo(System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/" + Constants.FILE_NAME));

            }
            else
            {

                fileInfo = new FileInfo(System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/" + Constants.FILE_NAME2));
            }
            //fileInfo = new FileInfo(System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/" + Constants.FILE_NAME2));
           
            if (!fileInfo.Exists)
            {
            }

            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(fileInfo.FullName);

            foreach (XmlNode node in xmlDoc["ERMSRequestTab"])
            {
                if (node.Attributes["type"].Value == requestType)
                {
                    if (node.Attributes["tabCode"].Value.ToString() == tabCode)
                    {
                        //go to RDM from SCP to allow them to raise PU code
                        if (tabCode == "SCP_EPT" || tabCode == "SCP_NP")
                        {
                            nextPage.Append(node.NextSibling.Attributes["page"].Value.ToString());
                            nextTabCode = node.NextSibling.Attributes["tabCode"].Value.ToString();

                            nextTabObj.NextTabName = node.NextSibling.Attributes["urlName"].Value.ToString();
                        }
                        else
                        {
                            if (tabCode == "RDM_CMBI")
                            {
                                nextPage.Append(string.Empty);
                                nextTabCode = string.Empty;
                            }
                            else if (tabCode == "PE_SC")
                            {
                                nextPage.Append(node.Attributes["page"].Value.ToString());
                                nextTabCode = node.Attributes["tabCode"].Value.ToString();
                            }
                            else if (saveOrSubmit == "submit1")
                            {
                                nextPage.Append("Javascript:Load(\"PackTech_EPT.aspx\")");
                                nextTabCode = "PE_NP";
                            }
                            else
                            {
                                nextPage.Append(node.NextSibling.Attributes["page"].Value.ToString());
                                nextTabCode = node.NextSibling.Attributes["tabCode"].Value.ToString();

                                nextTabObj.NextTabName = node.NextSibling.Attributes["urlName"].Value.ToString();
                            }
                        }
                        break;
                    }
                }
            }

            //for hurdles dont go to next page
            int counter = 0;
            bool noNextPage = false;
            int status = 0;
            if (dsToAddress.Tables.Count > 0)
            {
                for (counter = 0; counter < dsToAddress.Tables[0].Rows.Count; counter++)
                {
                    status = Convert.ToInt32(dsToAddress.Tables[0].Rows[counter]["CurrentStatus"].ToString());

                    //rejected, deleted or concerns raised
                    if (Convert.ToInt32(dsToAddress.Tables[0].Rows[counter]["CurrentStatus"].ToString()) == -1 || Convert.ToInt32(dsToAddress.Tables[0].Rows[counter]["CurrentStatus"].ToString()) == 16 || Convert.ToInt32(dsToAddress.Tables[0].Rows[counter]["CurrentStatus"].ToString()) == 18 || Convert.ToInt32(dsToAddress.Tables[0].Rows[counter]["CurrentStatus"].ToString()) == -99)
                    {
                        noNextPage = true;
                        break;
                    }
                    //for supply chain move to next page only if everything is no issue
                    if (tabCode == "SCT_SC")
                    {
                        if (Convert.ToInt32(dsToAddress.Tables[0].Rows[counter]["CurrentStatus"].ToString()) == 15)
                            noNextPage = false;
                        else
                        {
                            noNextPage = true;
                            break;
                        }
                    }
                    //for combi move to next page only if everything is no issue
                    if (tabCode == "SCT_CMBI")
                    {
                        if (Convert.ToInt32(dsToAddress.Tables[0].Rows[counter]["CurrentStatus"].ToString()) == 7)
                            noNextPage = false;
                        else
                        {
                            noNextPage = true;
                            break;
                        }
                    }
                    //Flow is hardcoded due to hurdle
                    if ((tabCode == "EPT" || tabCode == "SCP_NP") && Convert.ToInt32(dsToAddress.Tables[0].Rows[counter]["CurrentStatus"].ToString()) == 8)
                    {
                        //for copy request, local/regional redirect to RDM
                        //string URL = "PackTech_EPT.aspx?RequestId=" + requestId;
                        //Response.Redirect(URL, false);
                        //redirectURL = "PackTech_EPT.aspx?RequestId=" + requestId;
                        nextTabObj.NextTabName = "PackEngineer";
                        nextTabObj.QueryString = "RequestId=" + requestId;
                    }
                    else if ((tabCode == "EPT-Copy"))
                    {
                        //for copy request, local/regional redirect to RDM
                        //Response.Redirect("RDM_EPT.aspx?RequestId=" + requestId);
                        //redirectURL = "RDM_EPT.aspx?RequestId=" + requestId;
                        nextTabObj.NextTabName = "RDM";
                        nextTabObj.QueryString = "RequestId=" + requestId;
                    }
                    if (tabCode == "FAST_NP" || tabCode == "CA")
                    {
                        //local/regional or sales > 20 k redirect to SCP
                        if (Convert.ToInt32(dsToAddress.Tables[0].Rows[counter]["CurrentStatus"].ToString()) == 3)
                        {
                            //Response.Redirect("SCP_EPT.aspx?RequestId=" + requestId);
                            //redirectURL = "SCP_EPT.aspx?RequestId=" + requestId;
                            nextTabObj.NextTabName = "";
                            nextTabObj.QueryString = "RequestId=" + requestId;
                        }
                        else
                        {
                            noNextPage = false;
                            break;
                        }
                    }
                }
            }
            else
            {
                noNextPage = true;
            }

            //If request is complete, redirect to RDM page
            if (tabCode.StartsWith("RDM"))
            {
                //Start of fixing the issue 1091414-1 by Tod Zhang on 19/2/2008
                //Response.Redirect("RDM_EPT.aspx?RequestId=" + requestId, false);
                //redirectURL = "RDM_EPT.aspx?RequestId=" + requestId;
                nextTabObj.NextTabName = "";
                nextTabObj.QueryString = "RequestId=" + requestId;
                //End of fixing the issue 1091414-1 by Tod Zhang on 19/2/2008
            }
            else
            {
                if (noNextPage == false)
                {
                    ////display next page when there are no hurdles
                    //nextPage.Replace("\"", string.Empty);
                    //nextPage.Replace("Javascript:Load(", string.Empty);
                    //nextPage.Replace(")", string.Empty);

                    //begin modified by amy on apr 21
                    if (nextTabCode == "GSCM1_SC" || nextTabCode == "EPM1_CMBI" || nextTabCode == "EPM_NP" || nextTabCode == "EPM_CA" || nextTabCode == "EPM_PFR")
                    //end modified by amy on apr 21
                    {
                        //nextPage.Append("?RequestId=" + requestId.ToString() + "&ApprovalStep=1");
                        nextTabObj.QueryString = "RequestId=" + requestId.ToString() + "&ApprovalStep=1";
                    }
                    else if (nextTabCode == "GSCM2_SC" || nextTabCode == "EPM2_CMBI")
                    {
                        //nextPage.Append("?RequestId=" + requestId.ToString() + "&ApprovalStep=2");
                        nextTabObj.QueryString = "RequestId=" + requestId.ToString() + "&ApprovalStep=2";
                    }
                    else
                    {
                        //nextPage.Append("?RequestId=" + requestId.ToString());
                        nextTabObj.QueryString = "RequestId=" + requestId;
                    }

                    //Response.Redirect(nextPage.ToString(), false);
                    //redirectURL = nextPage.ToString();                    
                }
                else
                {
                    //start of change by Tod zhang on 24/2/2008
                    //Response.Redirect("Search.aspx");
                    if ((requestType == "Supply Chain" && tabCode == "SCT_SC") || (requestType == "Combi Pack" && tabCode == "SCT_CMBI"))
                    {
                        //Response.Redirect("SupplyChain_SCTeam.aspx" + "?RequestId=" + requestId.ToString());
                        //redirectURL = "SupplyChain_SCTeam.aspx" + "?RequestId=" + requestId.ToString();
                        nextTabObj.NextTabName = "SCTeam";
                        nextTabObj.QueryString = "RequestId=" + requestId;
                    }
                    else
                    {
                        //Response.Redirect("Search.aspx");
                        //redirectURL = "Search.aspx";
                        nextTabObj.NextTabName = "Search";
                        nextTabObj.QueryString = string.Empty;
                    }
                    //end of change by Tod zhang on 24/2/2008
                }
                }
            }
            catch (Exception ex)
            {
                nextTabObj.NextTabName = "errorpage";
                nextTabObj.QueryString = "Error in GetNextPage method of Workflow base controller";
            }
            return Request.CreateResponse(HttpStatusCode.OK, nextTabObj);
        }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "WorkFlowBase");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in loading search realted filters");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetNextPage method of Workflowbase controller.";
                return Request.CreateResponse(HttpStatusCode.OK, errEntity);
            }
        }

        #endregion
        protected int PageDisable(string pageCode, int status)
        {
    
          string userregion = HttpContext.Current.Session[Constants.USER_REGION].ToString();
                //nancy:according to the diffrent region,load the diffrent LoadXML function.
                if (userregion == "EAME")
                {
                  return  PageDisable1(pageCode,status);
                }
                else
                {
                  return PageDisable2(pageCode, status);
                }
    
        }
        #region This function checks if page is to be disabled based on status, if the request is already submitted.

        protected int PageDisable1(string pageCode, int status)
        {
            bool request = false;
            bool returnValue = false;
            int retVal = 0;

            //all request pages
            if ((pageCode == "EPT" || pageCode == "EPT-Copy" || pageCode == "NP" || pageCode == "CA" || pageCode == "PFR" || pageCode == "OTR" || pageCode == "SC" || pageCode == "CMBI") && status != 1)
                request = true;

            switch (status)
            {   //TODO:Check the logic
                //Request, EPM, GSCM
                case 1:
                case 6:
                case 17:
                case 14:
                    if (request == true)
                        returnValue = true;
                    else
                        returnValue = false;
                    break;
                //FAST
                case 2:
                case 18: if (request == true)
                        returnValue = true;
                    else if (pageCode == "EPM_NP")
                        returnValue = true;
                    else
                        returnValue = false;
                    break;
                //SCP
                case 3: if (request == true)
                        returnValue = true;
                    else if (pageCode.StartsWith("FAST") || pageCode.StartsWith("EPM") || pageCode.StartsWith("GSCM") || pageCode.StartsWith("SC_"))
                        returnValue = true;
                    else
                        returnValue = false;
                    break;
                //SC Team
                case 4:
                case 16: if (request == true)
                        returnValue = true;
                    else if (pageCode.StartsWith("FAST") || pageCode.StartsWith("EPM1") || pageCode.StartsWith("GSCM1") || pageCode == "EPM_NP")
                        returnValue = true;
                    else
                        returnValue = false;
                    break;
                //Complete
                case 5:
                    if (request == true)
                        returnValue = true;
                    else if (pageCode.StartsWith("FAST") || pageCode.StartsWith("EPM") || pageCode.StartsWith("GSCM") || pageCode.StartsWith("SCT") || pageCode.StartsWith("SCP") || pageCode == "SC_NP" || pageCode.StartsWith("PE") || pageCode.StartsWith("RDM") || pageCode.StartsWith("IDS"))
                        returnValue = true;
                    else
                        returnValue = false;
                    break;
                //PE
                case 8:
                case 9:
                case 10:
                case 11:
                case 13:
                case 19: if (request == true)
                        returnValue = true;
                    else if (pageCode.StartsWith("FAST") || pageCode.StartsWith("EPM") || pageCode.StartsWith("GSCM") || pageCode.StartsWith("SCT") || pageCode.StartsWith("SCP") || pageCode == "SC_NP")
                        returnValue = true;
                    else
                        returnValue = false;
                    break;
                //RDM
                case 12: if (request == true)
                        returnValue = true;
                    else if (pageCode.StartsWith("FAST") || pageCode.StartsWith("EPM") || pageCode.StartsWith("GSCM") || pageCode.StartsWith("SCT") || pageCode == "SC_NP" || pageCode.StartsWith("SCP") || pageCode.StartsWith("PE"))
                        returnValue = true;
                    else
                        returnValue = false;
                    break;
                //GSCM2, EPM2
                case 15:
                    //start of change by Infosys for erms issue
                    if (pageCode.StartsWith("GSCM1_SC"))
                        returnValue = true;
                    else if (request == true)
                        returnValue = true;
                    break;
                //end of change by Infosys for erms issue
                case 7: if (request == true)
                        returnValue = true;
                    //start of change by Infosys on 2008/4/18 for erms case 1120531-1
                    else if (pageCode.StartsWith("SCT") || pageCode.StartsWith("EPM1"))
                        returnValue = true;
                    //end of change by Infosys on 2008/4/18 
                    else
                        returnValue = false;
                    break;
              
                default:
                    returnValue = false;
                    break;
            }
            if (returnValue == true)
            {
                //if admin only submit button needs to be disabled. hence return value 2
                if (HttpContext.Current.User.IsInRole(Constants.ADMIN) == true)
                    retVal = 2;
                else
                    retVal = 1;
            }
            else
            {
                retVal = 0;
            }
            if (status == -99 || status == -1)
                retVal = 2;
            return retVal;
        }

        #endregion

        #region This function checks if page is to be disabled based on status, if the request is already submitted.

        protected int PageDisable2(string pageCode, int status)
        {
            bool request = false;
            bool returnValue = false;
            int retVal = 0;

            //all request pages
            if ((pageCode == "EPT" || pageCode == "EPT-Copy" || pageCode == "NP" || pageCode == "CA" || pageCode == "PFR" || pageCode == "OTR" || pageCode == "SC" || pageCode == "CMBI") && status != 1)
                request = true;

            switch (status)
            {   //TODO:Check the logic
                //Request, EPM, GSCM
                case 1:
                case 6:
                case 17:
                case 14:
                    if (request == true)
                        returnValue = true;
                    else
                        returnValue = false;
                    break;
                //FAST
                case 2:
                case 18: if (request == true)
                        returnValue = true;
                    else if (pageCode == "EPM_NP")
                        returnValue = true;
                    else
                        returnValue = false;
                    break;
                //SCP
                case 3: if (request == true)
                        returnValue = true;
                    else if (pageCode.StartsWith("FAST") || pageCode.StartsWith("EPM") || pageCode.StartsWith("GSCM") || pageCode.StartsWith("SC_"))
                        returnValue = true;
                    else
                        returnValue = false;
                    break;
                //SC Team
                case 4:
                case 16: if (request == true)
                        returnValue = true;
                    else if (pageCode.StartsWith("FAST") || pageCode.StartsWith("EPM1") || pageCode.StartsWith("GSCM1") || pageCode == "EPM_NP")
                        returnValue = true;
                    else
                        returnValue = false;
                    break;
                //Complete
                case 5:
                    if (request == true)
                        returnValue = true;
                    else if (pageCode.StartsWith("FAST") || pageCode.StartsWith("EPM") || pageCode.StartsWith("GSCM") || pageCode.StartsWith("SCT") || pageCode.StartsWith("SCP") || pageCode == "SC_NP" || pageCode.StartsWith("PE") || pageCode.StartsWith("RDM") || pageCode.StartsWith("IDS") || pageCode.StartsWith("RA"))
                        returnValue = true;
                    else
                        returnValue = false;
                    break;
                //PE
                case 8:
                case 9:
                case 10:
                case 11:
                case 13:
                case 19: if (request == true)
                        returnValue = true;
                    else if (pageCode.StartsWith("FAST") || pageCode.StartsWith("EPM") || pageCode.StartsWith("GSCM") || pageCode.StartsWith("SCT") || pageCode.StartsWith("SCP") || pageCode == "SC_NP" || pageCode.StartsWith("RA"))
                        returnValue = true;
                    else
                        returnValue = false;
                    break;
                //RDM
                case 12: if (request == true)
                        returnValue = true;
                    else if (pageCode.StartsWith("FAST") || pageCode.StartsWith("EPM") || pageCode.StartsWith("GSCM") || pageCode.StartsWith("SCT") || pageCode == "SC_NP" || pageCode.StartsWith("RA") || pageCode.StartsWith("PE"))
                        returnValue = true;
                    else
                        returnValue = false;
                    break;
                //GSCM2, EPM2
                case 15:
                    //start of change by Infosys for erms issue
                    if (pageCode.StartsWith("GSCM1_SC"))
                        returnValue = true;
                    else if (request == true)
                        returnValue = true;
                    break;
                //end of change by Infosys for erms issue
                case 7: if (request == true)
                        returnValue = true;
                    //start of change by Infosys on 2008/4/18 for erms case 1120531-1
                    else if (pageCode.StartsWith("SCT") || pageCode.StartsWith("EPM1"))
                        returnValue = true;
                    //end of change by Infosys on 2008/4/18 
                    else
                        returnValue = false;
                    break;
                //RA
                case 21: if (request == true)
                        returnValue = true;
                 
                    else if (pageCode.StartsWith("FAST") || pageCode.StartsWith("EPM") || pageCode.StartsWith("GSCM") || pageCode.StartsWith("SC_")|| pageCode.StartsWith("SCP"))
                        returnValue = true;
                  
                    else
                        returnValue = false;
                    break;
                default:
                    returnValue = false;
                    break;
            }
            if (returnValue == true)
            {
                //if admin only submit button needs to be disabled. hence return value 2
                if (HttpContext.Current.User.IsInRole(Constants.ADMIN) == true)
                    retVal = 2;
                else
                    retVal = 1;
            }
            else
            {
                retVal = 0;
            }
            if (status == -99 || status == -1)
                retVal = 2;
            return retVal;
        }

        #endregion

        #region LRMSRequests


        public HttpResponseMessage GetSubmitToProcurementMgr(string reqId)
        {

            #region Mail
                MailService mail = new MailService();
                string subject = string.Empty;
                StringBuilder sbBody = new StringBuilder();
                string informationText = string.Empty;
                int RequestId = Convert.ToInt32(reqId);
                string tabCode = "ProcurementMgr";
                string ccAddress = "";
                string mailTo = null;
                int status = 0;
                //Read subject and body from xml file
                //Check if the file exists
                string mailPath = HttpContext.Current.Request.PhysicalApplicationPath;
                FileInfo mailFileInfo = new FileInfo(System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/" + Constants.MAIL_FILE_NAME2));
                if (!mailFileInfo.Exists)
                {
                }

                XmlDocument xmlMailDoc = new XmlDocument();

                xmlMailDoc.Load(mailFileInfo.FullName);
                BaseService baseService = new BaseService();
                DataSet dsToAddress;

                dsToAddress = baseService.GetEmailAddress(RequestId, tabCode, string.Empty);
                //int flag = 0;//change by Tod Zhang on 21/3/2008 for case 1095831-1
                int count;
                string type = string.Empty;
                if (dsToAddress.Tables.Count > 0)
                {
                    for (count = 0; count < dsToAddress.Tables.Count; count++)
                    {
                        if (dsToAddress.Tables[count].Rows.Count > 0)
                        {
                            sbBody = new StringBuilder();

                            //Start change for case 1269404-1 EPT Copy mail
                            //Added for sending mail to originator when RDM raise PU code to Pack Tech by Infosys on 26-Mar-2009
                            int intXMLMail = 0;
                            //End change
                            //Added for case 1313367-1 Email Information Error on 15-Jun-2009
                            int intStatus = 0;

                            foreach (XmlNode node in xmlMailDoc["ERMSMail"])
                            {
                                if (dsToAddress.Tables[count].Rows[0]["RequestType"].ToString() == Constants.EPT_Copy)
                                    type = Constants.EPT;
                                else
                                    type = dsToAddress.Tables[count].Rows[0]["RequestType"].ToString();

                                if (node.Attributes["tabCode"].Value == type && node.Attributes["status"].Value == dsToAddress.Tables[count].Rows[0]["currentstatus"].ToString() && Convert.ToInt32(node.Attributes["mail"].Value) == count + 1)
                                {

                                    intXMLMail = Convert.ToInt32(node.Attributes["mail"].Value);
                                    intStatus = Convert.ToInt32(node.Attributes["status"].Value);
                                    informationText = node.Attributes["body"].Value;
                                    subject = node.Attributes["subject"].Value + dsToAddress.Tables[count].Rows[0]["RequestId"].ToString() + " - " + informationText;

                                }

                                //end of change by Tod Zhang  
                            }
                        }
                        ccAddress = System.Configuration.ConfigurationManager.AppSettings["CcAddress"];
                        mailTo = dsToAddress.Tables[count].Rows[0]["EmailAdds"].ToString();



                        string mailFrom = null;

                        if (mailFrom == null || mailFrom == string.Empty)
                        {
                            mailFrom = System.Configuration.ConfigurationManager.AppSettings["FromAddress"];

                        }

                        string mailTemplatePath = HttpContext.Current.Request.PhysicalApplicationPath;
                        string templatePath = string.Empty;
                        templatePath = "Document\\MailTemplates\\Information.htm";

                        using (StreamReader sr = new StreamReader(mailTemplatePath + templatePath))
                        {
                            String line;
                            // Read and display lines from the file until the end of 
                            // the file is reached.
                            while ((line = sr.ReadLine()) != null)
                            {
                                sbBody.Append(line);
                            }
                        }


                        if (count == 1)
                            sbBody.Replace("<origin>", "back up originator");
                        else if (count == 2)
                            sbBody.Replace("<origin>", "regulatory contact");


                        sbBody.Replace("<informationText>", informationText);
                        sbBody.Replace("<requestNo>", dsToAddress.Tables[count].Rows[0]["RequestId"].ToString());
                        sbBody.Replace("<requestType>", dsToAddress.Tables[count].Rows[0]["RequestType"].ToString());
                        sbBody.Replace("<leadAI>", dsToAddress.Tables[count].Rows[0]["LeadAI"].ToString());
                        sbBody.Replace("<requestor>", dsToAddress.Tables[count].Rows[0]["Requestor"].ToString());
                        sbBody.Replace("<SyngentaImage>", "http:\\\\" + HttpContext.Current.Request.Url.Host + "\\ermsNPI\\" + Constants.SyngentaImage);
                        sbBody.Replace("<InfoImage>", "http:\\\\" + HttpContext.Current.Request.Url.Host + "\\ermsNPI\\" + Constants.InfoImage);


                        // Start Change for case 1269404-1 EPT Copy by Infosys on 20 Mar 2009

                        if (mailTo.ToString() == string.Empty)
                        { }
                        else
                        {
                            mail.Send(mailTo,
                            ccAddress,
                            mailFrom,
                            subject,
                            sbBody.ToString(),
                            string.Empty,
                            System.Configuration.ConfigurationManager.AppSettings["SMTPServer"]);
                        }
                        //End of change on 21/1/2009

                    }
                    status = 1;
                    return Request.CreateResponse(HttpStatusCode.OK, status);
        }
                else {
                    status = 0;
                    return Request.CreateResponse(HttpStatusCode.OK, status);
                }
                
         
            #endregion Mail

        }
        #endregion

        #region Properties

        protected virtual string ErmsTabCode
        {
            get {
                return "NC";
            }
        }

        protected string UserName
        {
            get
            {
                //return HttpContext.Current.Session["UserName"].ToString();
                return HttpContext.Current.Session["FullUserName"].ToString();	

                //return "EAME\\m183317";
            }
        }

        #endregion
    }
}
