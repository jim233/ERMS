using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Syngenta.ERMS.Common.ViewModels;
using Syngenta.ERMS.Services.ServiceInterfaces;
using Syngenta.ERMS.Services;
using Syngenta.ERMS.Common;
using System.Text;
using System.Data;
using System.Data.OleDb;
using System.Web;
using System.IO;
using System.Net.Http.Headers;
using System.Configuration;
using NPOI.HSSF.Util;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using NPOI.XSSF.Model;
using NPOI.XSSF.UserModel;
using System.Globalization;
using System.Web.Script.Serialization;
using System.Collections.Specialized;
using Newtonsoft.Json.Linq;
using Syngenta.ERMS.ExceptionManagement;
using Syngenta.ERMS.BusinessEntities;

namespace ERMS.Controllers
{
    public class ReportsController : ApiController
    {
        IReportsService reportServ;
        ReportsViewModel reportsVM;

        IErrorResourceManagerService errMessages = new ErrorResourceManager();
        ErrorEntity errEntity = new ErrorEntity();
        protected string Message = "";
        /// <summary>
        /// Method to load the data in controls for reports on page load
        /// </summary>
        /// <returns>Data for drop down controls on reports screen</returns>
        [HttpPost]
        public HttpResponseMessage GetReportsControl()
        {
            try
            {
                reportServ = new ReportsService();
                reportsVM = new ReportsViewModel();

                reportsVM = reportServ.GetReportFilters();

                return Request.CreateResponse(HttpStatusCode.OK, reportsVM);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Reports");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in loading search realted filters");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetReportsControl method of Reports controller";
                reportsVM.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, reportsVM);
            }
        }

        /// <summary>
        /// Method to get the report data as per the selected report option
        /// </summary>
        /// <param name="reportNo">Selected Report Number</param>
        /// <param name="param1">Parameter 1 depending on the selected report</param>
        /// <param name="param2">Parameter 2 depending on the selected report</param>
        /// <returns>The data for the selected report</returns>
        [HttpPost]
        public HttpResponseMessage GetReport(string reportNo, string param1, string param2)
        {
            try
            {
                reportsVM = new ReportsViewModel();
                reportsVM = GetReportDetails(reportNo, param1, param2);

                return Request.CreateResponse(HttpStatusCode.OK, reportsVM);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Reports");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in loading search realted filters");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetReport method of Reports controller";
                reportsVM.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, reportsVM);
            }
        }

        /// <summary>
        /// Method to get the report data as per the selected report option
        /// </summary>
        /// <param name="reportNo">Selected Report Number</param>
        /// <param name="param1">Parameter 1 depending on the selected report</param>
        /// <param name="param2">Parameter 2 depending on the selected report</param>
        /// <returns>Reports View Model containing the data for the selected report</returns>
        private ReportsViewModel GetReportDetails(string reportNo, string param1, string param2)
        {
            try
            {
                reportServ = new ReportsService();
                reportsVM = new ReportsViewModel();
                if (!string.IsNullOrEmpty(reportNo))
                {
                    int reportNumber = Convert.ToInt32(reportNo);
                    int parameter1 = 0;
                    int parameter2 = 0;
                    if (reportNumber != 9)
                    {
                        parameter1 = string.IsNullOrEmpty(param1) ? 0 : Convert.ToInt32(param1);
                        parameter2 = string.IsNullOrEmpty(param2) ? 0 : Convert.ToInt32(param2);
                    }
                    string header = string.Empty;

                    switch (reportNumber)
                    {
                        case 1:
                            reportsVM.HeaderText = Constants.Report1;
                            reportsVM = reportServ.GetReportData(reportNumber, parameter1, parameter2);
                            break;
                        case 2:
                            reportsVM.HeaderText = Constants.Report2;
                            reportsVM = reportServ.GetReportData(reportNumber, parameter1, parameter2);
                            break;
                        case 3:
                            reportsVM.HeaderText = Constants.Report3;
                            reportsVM = reportServ.GetReportData(reportNumber, parameter1, parameter2);
                            break;
                        case 4:
                            reportsVM.HeaderText = Constants.Report4;
                            reportsVM = reportServ.GetReportData(reportNumber, parameter1, parameter2);
                            break;
                        case 5:
                            reportsVM.HeaderText = Constants.Report5;
                            reportsVM = reportServ.GetReportData(reportNumber, parameter1, parameter2);
                            break;
                        case 6:
                            reportsVM.HeaderText = Constants.Report6;
                            reportsVM = reportServ.GetReportData(reportNumber, parameter1, parameter2);
                            break;
                        case 7:
                            reportsVM.HeaderText = Constants.Report7;
                            reportsVM = reportServ.GetReportData(reportNumber, parameter1, parameter2);
                            break;
                        case 8:
                            reportsVM.HeaderText = Constants.Report8;
                            reportsVM = reportServ.GetReportData(reportNumber, parameter1, parameter2);
                            break;
                        case 9:
                            reportsVM.HeaderText = Constants.Report9;
                            reportsVM = reportServ.GetReportDataPackTechReport(reportNumber, Convert.ToDateTime(param1, System.Globalization.CultureInfo.GetCultureInfo("en-GB")), Convert.ToDateTime(param2, System.Globalization.CultureInfo.GetCultureInfo("en-GB")));
                            break;
                        case 10:
                            reportsVM.HeaderText = Constants.Report10;
                            reportsVM = reportServ.GetReportData(reportNumber, parameter1, parameter2);
                            break;
                    }
                }
                return reportsVM;
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Reports");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in loading search realted filters");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in GetReportDetails method of Reports controller";
                reportsVM.ErrorBE = errEntity;
                return reportsVM;
            }

        }

        #region ExportToExcel

        /// <summary>
        /// Method to export the report to excel
        /// </summary>
        /// <param name="reportNo">Report Number</param>
        /// <param name="param1">Parameter 1 depending on the selected report</param>
        /// <param name="param2">Parameter 2 depending on the selected report</param>
        /// <returns>Excel file containing the data for the selected report</returns>
        public HttpResponseMessage ExportReport(string reportNo, string param1, string param2)
        {
            try
            {
                ReportsViewModel reportVM = GetReportDetails(reportNo, param1, param2);

                var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
                string templateDir = Path.Combine(baseDirectory, ConfigurationManager.AppSettings["ReportsTemplatePath"]);
                string tempExcelDir = Path.Combine(baseDirectory, ConfigurationManager.AppSettings["ReportsOutputPath"]);
                string template = string.Empty;
                FileStream file;
                XSSFWorkbook workbook;
                ISheet sheet;
                IRow row;
                FileStream fs;


                //row.CreateCell(0).SetCellValue("ERMS Report Generated on:" + DateTime.Now.ToLocalTime().ToString("U", CultureInfo.InvariantCulture));

                int rowIndex = 0;
                if (Directory.Exists(tempExcelDir))
                {
                    File.Delete(tempExcelDir + "ERMS_Report.xlsx");

                }
                switch (reportNo)
                {
                    case "1":
                        if (reportVM.GetEDMRangeStatus != null && reportVM.GetEDMRangeStatus.Tables[0].Rows.Count > 0)
                        {
                            template = templateDir + "ERMS_Report.xlsx";
                            file = new FileStream(template, FileMode.Open, FileAccess.Read);
                            workbook = new XSSFWorkbook(file);
                            sheet = workbook.GetSheetAt(0);
                            row = sheet.CreateRow(0);

                            rowIndex = rowIndex + 1;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetEDMRangeStatus.Tables[0].Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetEDMRangeStatus.Tables[0].Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetEDMRangeStatus.Tables[0].Columns[j]);

                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetEDMRangeStatus.Tables[0].Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetEDMRangeStatus.Tables[0].Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetEDMRangeStatus.Tables[0].Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetEDMRangeStatus.Tables[0].Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }
                            reportsVM.FileName = "ERMS_Report.xlsx";
                            fs = new FileStream(tempExcelDir + reportsVM.FileName, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                            workbook.Write(fs);
                        }

                        break;
                    case "2":

                        template = templateDir + "ERMS_Report.xlsx";
                        file = new FileStream(template, FileMode.Open, FileAccess.Read);
                        workbook = new XSSFWorkbook(file);
                        if (reportVM.GetAppStatusSummaryEPM != null && reportVM.GetAppStatusSummaryEPM.Rows.Count > 0)
                        {
                            sheet = workbook.GetSheetAt(0);
                            row = sheet.CreateRow(0);

                            rowIndex = rowIndex + 1;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetAppStatusSummaryEPM.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetAppStatusSummaryEPM.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummaryEPM.Columns[j]);

                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetAppStatusSummaryEPM.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetAppStatusSummaryEPM.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetAppStatusSummaryEPM.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummaryEPM.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        if (reportVM.GetAppStatusSummaryFAST != null && reportVM.GetAppStatusSummaryFAST.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("FAST");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetAppStatusSummaryFAST.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetAppStatusSummaryFAST.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummaryFAST.Columns[j]);

                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetAppStatusSummaryFAST.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetAppStatusSummaryFAST.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetAppStatusSummaryFAST.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummaryFAST.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        if (reportVM.GetAppStatusSummarySCP != null && reportVM.GetAppStatusSummarySCP.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("Supply Chain Planner");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetAppStatusSummarySCP.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetAppStatusSummarySCP.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummarySCP.Columns[j]);
                                cellValue = cellValue.Replace("SCP", "Supply Chain Planner");
                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetAppStatusSummarySCP.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetAppStatusSummarySCP.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetAppStatusSummarySCP.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummarySCP.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        if (reportVM.GetAppStatusSummarySCTeam != null && reportVM.GetAppStatusSummarySCTeam.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("Supply Chain Team");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetAppStatusSummarySCTeam.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetAppStatusSummarySCTeam.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummarySCTeam.Columns[j]);
                                cellValue = cellValue.Replace("SCTeam", "Supply Chain Team");
                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetAppStatusSummarySCTeam.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetAppStatusSummarySCTeam.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetAppStatusSummarySCTeam.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummarySCTeam.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        if (reportVM.GetAppStatusSummaryGSCM != null && reportVM.GetAppStatusSummaryGSCM.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("GSCM");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetAppStatusSummaryGSCM.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetAppStatusSummaryGSCM.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummaryGSCM.Columns[j]);
                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetAppStatusSummaryGSCM.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetAppStatusSummaryGSCM.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetAppStatusSummaryGSCM.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummaryGSCM.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        if (reportVM.GetAppStatusSummaryPP != null && reportVM.GetAppStatusSummaryPP.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("Purchasing");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetAppStatusSummaryPP.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetAppStatusSummaryPP.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummaryPP.Columns[j]);
                                cellValue = cellValue.Replace("PP", "Purchasing");

                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetAppStatusSummaryPP.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetAppStatusSummaryPP.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetAppStatusSummaryPP.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummaryPP.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        if (reportVM.GetAppStatusSummaryFP != null && reportVM.GetAppStatusSummaryFP.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("FP");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetAppStatusSummaryFP.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetAppStatusSummaryFP.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummaryFP.Columns[j]);
                                cellValue = cellValue.Replace("FP", "F&P Sourcing");
                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetAppStatusSummaryFP.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetAppStatusSummaryFP.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetAppStatusSummaryFP.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummaryFP.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        if (reportVM.GetAppStatusSummaryPK != null && reportVM.GetAppStatusSummaryPK.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("Packaging");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetAppStatusSummaryPK.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetAppStatusSummaryPK.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummaryPK.Columns[j]);
                                cellValue = cellValue.Replace("Pack", "Packaging");
                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetAppStatusSummaryPK.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetAppStatusSummaryPK.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetAppStatusSummaryPK.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummaryPK.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        if (reportVM.GetAppStatusSummaryDM != null && reportVM.GetAppStatusSummaryDM.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("DM");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetAppStatusSummaryDM.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetAppStatusSummaryDM.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummaryDM.Columns[j]);
                                cellValue = cellValue.Replace("DM", "Data Management");
                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetAppStatusSummaryDM.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetAppStatusSummaryDM.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetAppStatusSummaryDM.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummaryDM.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        if (reportVM.GetAppStatusSummaryGTP != null && reportVM.GetAppStatusSummaryGTP.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("GTP");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetAppStatusSummaryGTP.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetAppStatusSummaryGTP.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummaryGTP.Columns[j]);
                                cellValue = cellValue.Replace("GTP", "Global Tranfer Pricing");
                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetAppStatusSummaryGTP.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetAppStatusSummaryGTP.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetAppStatusSummaryGTP.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetAppStatusSummaryGTP.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        reportsVM.FileName = "ERMS_Report.xlsx";
                        fs = new FileStream(tempExcelDir + reportsVM.FileName, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                        workbook.Write(fs);
                        break;
                    case "3":
                        if (reportsVM.GetPackTech != null)
                        {
                            template = templateDir + "ERMS_Report.xlsx";
                            file = new FileStream(template, FileMode.Open, FileAccess.Read);
                            workbook = new XSSFWorkbook(file);
                            sheet = workbook.GetSheetAt(0);
                            row = sheet.CreateRow(0);
                            DataTable dataTable = reportsVM.GetPackTech.Tables[0];

                            row = sheet.GetRow(rowIndex);

                            rowIndex = rowIndex + 1;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < dataTable.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetEDMRangeStatus.Tables[0].Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetEDMRangeStatus.Tables[0].Columns[j]);

                                cellValue = cellValue.Replace("PackSentDate", "Date sent to packaging");
                                cellValue = cellValue.Replace("SaleDate", "Date required for sale");
                                cellValue = cellValue.Replace("PackCompDate", "Packaging Completion Date");
                                cellValue = cellValue.Replace("EstPackCompDate", "Est.Packaging Completion Date");
                                cellValue = cellValue.Replace("PackConfig", "Pack");

                                cell.SetCellValue(cellValue);
                            }
                            rowIndex = rowIndex + 1;
                            for (int i = 0; i < dataTable.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);
                                for (int j = 0; j < dataTable.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    cell.SetCellValue(Convert.ToString(dataTable.Rows[i][j]));
                                }
                            }
                            reportsVM.FileName = "ERMS_Report.xlsx";
                            fs = new FileStream(tempExcelDir + reportsVM.FileName, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                            workbook.Write(fs);
                        }
                        break;
                    case "4":
                        if (reportVM.GetRequestSummary != null && reportVM.GetRequestSummary.Tables[0].Rows.Count > 0)
                        {
                            template = templateDir + "ERMS_Report.xlsx";
                            file = new FileStream(template, FileMode.Open, FileAccess.Read);
                            workbook = new XSSFWorkbook(file);
                            sheet = workbook.GetSheetAt(0);
                            row = sheet.CreateRow(0);

                            rowIndex = rowIndex + 1;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetRequestSummary.Tables[0].Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetRequestSummary.Tables[0].Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetRequestSummary.Tables[0].Columns[j]);
                                cellValue = cellValue.Replace("Country", "Country/Area");
                                cellValue = cellValue.Replace("ProgressCount", "In Progress");
                                if (cellValue != "In Progress" && cellValue != "Country/Area")
                                    cellValue = DateTime.Now.AddMonths(-j + 1).ToString("MMM");
                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetRequestSummary.Tables[0].Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetRequestSummary.Tables[0].Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetRequestSummary.Tables[0].Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetRequestSummary.Tables[0].Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }
                            reportsVM.FileName = "ERMS_Report.xlsx";
                            fs = new FileStream(tempExcelDir + reportsVM.FileName, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                            workbook.Write(fs);
                        }
                        break;
                    case "5":
                        if (reportVM.GetProgressRequests != null && reportVM.GetProgressRequests.Tables[0].Rows.Count > 0)
                        {
                            template = templateDir + "ERMS_Report.xlsx";
                            file = new FileStream(template, FileMode.Open, FileAccess.Read);
                            workbook = new XSSFWorkbook(file);
                            sheet = workbook.GetSheetAt(0);
                            row = sheet.CreateRow(0);

                            rowIndex = rowIndex + 1;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetProgressRequests.Tables[0].Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetProgressRequests.Tables[0].Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetProgressRequests.Tables[0].Columns[j]);
                                cellValue = cellValue.Replace("CurrentDate", "Current Due Date");

                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetProgressRequests.Tables[0].Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetProgressRequests.Tables[0].Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetProgressRequests.Tables[0].Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetProgressRequests.Tables[0].Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }
                            reportsVM.FileName = "ERMS_Report.xlsx";
                            fs = new FileStream(tempExcelDir + reportsVM.FileName, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                            workbook.Write(fs);
                        }
                        break;
                    case "6":
                        template = templateDir + "ERMS_Report.xlsx";
                        file = new FileStream(template, FileMode.Open, FileAccess.Read);
                        workbook = new XSSFWorkbook(file);
                        if (reportVM.GetTimeApprovalEPT != null && reportVM.GetTimeApprovalEPT.Rows.Count > 0)
                        {
                            sheet = workbook.GetSheetAt(0);
                            row = sheet.CreateRow(0);

                            rowIndex = rowIndex + 1;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetTimeApprovalEPT.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetTimeApprovalEPT.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetTimeApprovalEPT.Columns[j]);
                                cellValue = cellValue.Replace("EDM1", "RDM raise SU code ");
                                cellValue = cellValue.Replace("EDM", "RDM raise PU code");

                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetTimeApprovalEPT.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetTimeApprovalEPT.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetTimeApprovalEPT.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetTimeApprovalEPT.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        if (reportVM.GetTimeApprovalNP != null && reportVM.GetTimeApprovalNP.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("New Pack");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetTimeApprovalNP.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetTimeApprovalNP.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetTimeApprovalNP.Columns[j]);
                                cellValue = cellValue.Replace("LocalRegional", "Local Or Regional");
                                cellValue = cellValue.Replace("Packaging", "Total with Packaging");
                                cellValue = cellValue.Replace("EDM1", "RDM raise SU code");
                                cellValue = cellValue.Replace("EDM", "RDM raise PU code");
                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetTimeApprovalNP.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetTimeApprovalNP.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetTimeApprovalNP.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetTimeApprovalNP.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        if (reportVM.GetTimeApprovalCA != null && reportVM.GetTimeApprovalCA.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("Country Add");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetTimeApprovalCA.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetTimeApprovalCA.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetTimeApprovalCA.Columns[j]);
                                cellValue = cellValue.Replace("EDM", "RDM");
                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetTimeApprovalCA.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetTimeApprovalCA.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetTimeApprovalCA.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetTimeApprovalCA.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        if (reportVM.GetTimeApprovalSC != null && reportVM.GetTimeApprovalSC.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("Supply Chain");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetTimeApprovalSC.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetTimeApprovalSC.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetTimeApprovalSC.Columns[j]);
                                cellValue = cellValue.Replace("GSCMApproval1", "GSCM First Approval");
                                cellValue = cellValue.Replace("GSCMApproval2", "GSCM Final Approval");
                                cellValue = cellValue.Replace("EBMApproval1", "EBM First Approval");
                                cellValue = cellValue.Replace("EBMApproval2", "EBM Final Approval");
                                cellValue = cellValue.Replace("EDM", "RDM");
                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetTimeApprovalSC.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetTimeApprovalSC.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetTimeApprovalSC.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetTimeApprovalSC.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        //Report 6 - Combi Pack
                        if (reportVM.GetTimeApprovalCP != null && reportVM.GetTimeApprovalCP.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("Combi Pack");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetTimeApprovalCP.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetTimeApprovalCP.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetTimeApprovalCP.Columns[j]);
                                cellValue = cellValue.Replace("GSCMApproval1", "GSCM First Approval");
                                cellValue = cellValue.Replace("GSCMApproval2", "GSCM Final Approval");
                                cellValue = cellValue.Replace("EBMApproval1", "EBM First Approval");
                                cellValue = cellValue.Replace("EBMApproval2", "EBM Final Approval");
                                cellValue = cellValue.Replace("EDM", "RDM");
                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetTimeApprovalCP.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetTimeApprovalCP.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetTimeApprovalCP.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetTimeApprovalCP.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        //Report 6 - PFR
                        if (reportVM.GetTimeApprovalPFR != null && reportVM.GetTimeApprovalPFR.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("PFR");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetTimeApprovalPFR.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetTimeApprovalPFR.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetTimeApprovalPFR.Columns[j]);
                                cellValue = cellValue.Replace("EDM", "RDM");
                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetTimeApprovalPFR.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetTimeApprovalPFR.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetTimeApprovalPFR.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetTimeApprovalPFR.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }

                        //Report 6 - Other
                        if (reportVM.GetTimeApprovalOTR != null && reportVM.GetTimeApprovalOTR.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("Other");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetTimeApprovalOTR.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetTimeApprovalOTR.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetTimeApprovalOTR.Columns[j]);
                                cellValue = cellValue.Replace("EDM", "RDM");
                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetTimeApprovalOTR.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetTimeApprovalOTR.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetTimeApprovalOTR.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetTimeApprovalOTR.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }

                        //Report 6 - Other
                        if (reportVM.GetTimeApprovalEPTCopy != null && reportVM.GetTimeApprovalEPTCopy.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("EPT Copy");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetTimeApprovalEPTCopy.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetTimeApprovalEPTCopy.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetTimeApprovalEPTCopy.Columns[j]);
                                cellValue = cellValue.Replace("EDM1", "RDM raise SU code");
                                cellValue = cellValue.Replace("EDM", "RDM raise PU code");
                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetTimeApprovalEPTCopy.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetTimeApprovalEPTCopy.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetTimeApprovalEPTCopy.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetTimeApprovalEPTCopy.Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        reportsVM.FileName = "ERMS_Report.xlsx";
                        fs = new FileStream(tempExcelDir + reportsVM.FileName, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                        workbook.Write(fs);
                        break;
                    case "7":
                        if (reportVM.GetNPIKPI != null && reportVM.GetNPIKPI.Tables[0].Rows.Count > 0)
                        {
                            template = templateDir + "ERMS_Report.xlsx";
                            file = new FileStream(template, FileMode.Open, FileAccess.Read);
                            workbook = new XSSFWorkbook(file);
                            sheet = workbook.GetSheetAt(0);
                            row = sheet.CreateRow(0);

                            rowIndex = rowIndex + 1;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetNPIKPI.Tables[0].Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetNPIKPI.Tables[0].Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetNPIKPI.Tables[0].Columns[j]);
                                cellValue = cellValue.Replace("CurrentDate", "Current Due Date");

                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetNPIKPI.Tables[0].Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetNPIKPI.Tables[0].Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetNPIKPI.Tables[0].Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetNPIKPI.Tables[0].Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }
                            reportsVM.FileName = "ERMS_Report.xlsx";
                            fs = new FileStream(tempExcelDir + reportsVM.FileName, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                            workbook.Write(fs);
                        }
                        break;
                    case "8":
                        if (reportVM.GetNPCP != null && reportVM.GetNPCP.Tables[0].Rows.Count > 0)
                        {
                            template = templateDir + "ERMS_Report.xlsx";
                            file = new FileStream(template, FileMode.Open, FileAccess.Read);
                            workbook = new XSSFWorkbook(file);
                            sheet = workbook.GetSheetAt(0);
                            row = sheet.CreateRow(0);

                            rowIndex = rowIndex + 1;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetNPCP.Tables[0].Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetNPCP.Tables[0].Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetNPCP.Tables[0].Columns[j]);
                                cellValue = cellValue.Replace("CurrentDate", "Current Due Date");

                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetNPCP.Tables[0].Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetNPCP.Tables[0].Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetNPCP.Tables[0].Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetNPCP.Tables[0].Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }
                            reportsVM.FileName = "ERMS_Report.xlsx";
                            fs = new FileStream(tempExcelDir + reportsVM.FileName, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                            workbook.Write(fs);
                        }
                        break;
                    case "9":
                        template = templateDir + "ERMS_Report.xlsx";
                        file = new FileStream(template, FileMode.Open, FileAccess.Read);
                        workbook = new XSSFWorkbook(file);
                        if (reportVM.GetPTSTPA != null && reportVM.GetPTSTPA.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("SubmittedToPackagingApprover");
                            workbook.RemoveSheetAt(0);
                            row = sheet.CreateRow(0);


                            rowIndex = rowIndex + 1;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetNPCP.Tables[0].Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetPTSTPA.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetPTSTPA.Columns[j]);

                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetPTSTPA.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetPTSTPA.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetPTSTPA.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetPTSTPA.Rows[i][j]);
                                    if (reportVM.GetPTSTPA.Columns[j].DataType.Name == "DateTime" && reportVM.GetPTSTPA.Rows[i][j].ToString() != string.Empty)
                                        cellValue = Convert.ToDateTime(reportVM.GetPTSTPA.Rows[i][j].ToString()).ToString("dd/MM/yyyy");
                                    cell.SetCellValue(cellValue);
                                }
                            }
                        }

                        if (reportVM.GetPTSTPT != null && reportVM.GetPTSTPT.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("SubmittedToPackTechnologist");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetPTSTPT.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetPTSTPT.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetPTSTPT.Columns[j]);
                                cellValue = cellValue.Replace("EDM1", "RDM raise SU code");
                                cellValue = cellValue.Replace("EDM", "RDM raise PU code");
                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetPTSTPT.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetPTSTPT.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetPTSTPT.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetPTSTPT.Rows[i][j]);
                                    if (reportVM.GetPTSTPA.Columns[j].DataType.Name == "DateTime" && reportVM.GetPTSTPA.Rows[i][j].ToString() != string.Empty)
                                        cellValue = Convert.ToDateTime(reportVM.GetPTSTPA.Rows[i][j].ToString()).ToString("dd/MM/yyyy");
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }

                        if (reportVM.GetPTEPCD != null && reportVM.GetPTEPCD.Rows.Count > 0)
                        {
                            sheet = workbook.CreateSheet("EstimatedPackCompletionDate");
                            row = sheet.CreateRow(0);

                            rowIndex = 0;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetPTEPCD.Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetPTEPCD.Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetPTEPCD.Columns[j]);

                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetPTEPCD.Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetPTEPCD.Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetPTEPCD.Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetPTEPCD.Rows[i][j]);
                                    if (reportVM.GetPTSTPA.Columns[j].DataType.Name == "DateTime" && reportVM.GetPTSTPA.Rows[i][j].ToString() != string.Empty)
                                        cellValue = Convert.ToDateTime(reportVM.GetPTSTPA.Rows[i][j].ToString()).ToString("dd/MM/yyyy");
                                    cell.SetCellValue(cellValue);
                                }
                            }

                        }
                        reportsVM.FileName = "ERMS_Report.xlsx";
                        fs = new FileStream(tempExcelDir + reportsVM.FileName, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                        workbook.Write(fs);
                        break;
                    case "10":
                        if (reportVM.GetPlantSellerLine != null && reportVM.GetPlantSellerLine.Tables[0].Rows.Count > 0)
                        {
                            template = templateDir + "ERMS_Report.xlsx";
                            file = new FileStream(template, FileMode.Open, FileAccess.Read);
                            workbook = new XSSFWorkbook(file);
                            sheet = workbook.GetSheetAt(0);
                            row = sheet.CreateRow(0);

                            rowIndex = rowIndex + 1;
                            row = sheet.CreateRow(rowIndex++);
                            for (int j = 0; j < reportVM.GetPlantSellerLine.Tables[0].Columns.Count; ++j)
                            {
                                ICell cell = row.CreateCell(j);
                                //var style = GetStyle(workbook, null);
                                //cell.CellStyle = style;
                                string cellValue = reportVM.GetPlantSellerLine.Tables[0].Columns[j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetPlantSellerLine.Tables[0].Columns[j]);
                                cellValue = cellValue.Replace("CurrentDate", "Current Due Date");

                                cell.SetCellValue(cellValue);
                            }

                            for (int i = 0; i < reportVM.GetPlantSellerLine.Tables[0].Rows.Count; ++i)
                            {
                                row = sheet.CreateRow(rowIndex++);

                                for (int j = 0; j < reportVM.GetPlantSellerLine.Tables[0].Columns.Count; ++j)
                                {
                                    ICell cell = row.CreateCell(j);
                                    //var style = GetStyle(workbook, null);
                                    //cell.CellStyle = style;
                                    string cellValue = reportVM.GetPlantSellerLine.Tables[0].Rows[i][j].Equals(DBNull.Value) ? string.Empty : Convert.ToString(reportVM.GetPlantSellerLine.Tables[0].Rows[i][j]);
                                    cell.SetCellValue(cellValue);
                                }
                            }
                            reportsVM.FileName = "ERMS_Report.xlsx";
                            fs = new FileStream(tempExcelDir + reportsVM.FileName, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                            workbook.Write(fs);
                        }
                        break;
                }

                //return ConfigurationManager.AppSettings["ReportsOutputPath"] + fileName + "&&" + fileName;
                reportsVM.ExcelPath = ConfigurationManager.AppSettings["AppendPathForReport"] + (ConfigurationManager.AppSettings["ReportsOutputPath"] + reportsVM.FileName).Replace("\\", "/");
                return Request.CreateResponse(HttpStatusCode.OK, reportsVM);
            }
            catch (Exception ex)
            {
                NameValueCollection additionalInfo = new NameValueCollection();
                additionalInfo.Add("PageName", "Reports");
                ExceptionManager.Publish(ex, additionalInfo);
                //Message = errMessages.GetString("Error in loading search realted filters");
                errEntity.ErrorNumber = 420;
                errEntity.ErrorMess = "Error in ExportReport method of Reports controller";
                reportsVM.ErrorBE = errEntity;
                return Request.CreateResponse(HttpStatusCode.OK, reportsVM);
            }
        }

        #endregion ExportToExcel

    }
}
