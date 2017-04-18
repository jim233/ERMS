using Syngenta.ERMS.BusinessEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.Services.ServiceInterfaces;
using Syngenta.ERMS.ExceptionManagement;
using System.Collections.Specialized;


namespace ERMS.Controllers
{
    public class CombiPackRequestConfirmController : ApiController
    {
        ICombiPackConfirmService cmbpckConfirm;
        [HttpPost]
        public int CreateRequest(CombiPackRequestNew cmbSave)
        {
            cmbpckConfirm = new CombiPackConfirmService();
            try
            {
                int RequestID;
                RequestID = cmbpckConfirm.SaveCombiPackRequest(cmbSave);

                if (RequestID > 0)
                {
                    for (int i = 0; i < Convert.ToInt32(cmbSave.noOfFormulation); i++)
                    {
                        if (i == 0)
                        {
                            cmbSave.requestId = RequestID;
                            cmbpckConfirm.SaveCombiPackElementRequest(cmbSave);
                        }
                        if (i == 1)
                        {
                            cmbSave.elementConfiguration1 = cmbSave.elementConfiguration2;
                            cmbSave.elementQuantity1 = cmbSave.elementQuantity2;
                            cmbSave.elementUOM1 = cmbSave.elementUOM2;
                            cmbSave.fillQuantity1 = cmbSave.fillQuantity2;
                            cmbSave.leadAIID1 = cmbSave.leadAIID2;
                            cmbSave.productLineID1 = cmbSave.productLineID2;
                            cmbSave.formulationID1 = cmbSave.formulationID2;
                            cmbSave.packSizeID1 = cmbSave.packSizeID2;
                            cmbSave.tradeName1 = cmbSave.tradeName2;
                            cmbSave.sUAgiCode1 = cmbSave.sUAgiCode2;
                            cmbSave.IsSynBrdPack1 = cmbSave.IsSynBrdPack2;
                            cmbSave.requestId = RequestID;
                            cmbpckConfirm.SaveCombiPackElementRequest(cmbSave);
                        }
                        if (i == 2)
                        {
                            cmbSave.elementConfiguration = cmbSave.elementConfiguration3;
                            cmbSave.elementQuantity1 = cmbSave.elementQuantity3;
                            cmbSave.elementUOM1 = cmbSave.elementUOM3;
                            cmbSave.fillQuantity1 = cmbSave.fillQuantity3;
                            cmbSave.leadAIID1 = cmbSave.leadAIID3;
                            cmbSave.productLineID1 = cmbSave.productLineID3;
                            cmbSave.formulationID1 = cmbSave.formulationID3;
                            cmbSave.packSizeID1 = cmbSave.packSizeID3;
                            cmbSave.tradeName1 = cmbSave.tradeName3;
                            cmbSave.sUAgiCode1 = cmbSave.sUAgiCode3;
                            cmbSave.IsSynBrdPack1 = cmbSave.IsSynBrdPack3;
                            cmbSave.requestId = RequestID;
                            cmbpckConfirm.SaveCombiPackElementRequest(cmbSave);
                        }
                        if (i == 4)
                        {
                            cmbSave.elementConfiguration = cmbSave.elementConfiguration4;
                            cmbSave.elementQuantity1 = cmbSave.elementQuantity4;
                            cmbSave.elementUOM1 = cmbSave.elementUOM4;
                            cmbSave.fillQuantity1 = cmbSave.fillQuantity4;
                            cmbSave.leadAIID1 = cmbSave.leadAIID4;
                            cmbSave.productLineID1 = cmbSave.productLineID4;
                            cmbSave.formulationID1 = cmbSave.formulationID4;
                            cmbSave.packSizeID1 = cmbSave.packSizeID4;
                            cmbSave.tradeName1 = cmbSave.tradeName4;
                            cmbSave.sUAgiCode1 = cmbSave.sUAgiCode4;
                            cmbSave.IsSynBrdPack1 = cmbSave.IsSynBrdPack4;
                            cmbSave.requestId = RequestID;
                            cmbpckConfirm.SaveCombiPackElementRequest(cmbSave);
                        }
                    }
                }
                return RequestID;
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "CombiPackRequestConfirm");
                ExceptionManager.Publish(ex, additionalInfo);
                return 0;
            }
        }
       
    }
}
