// JScript File
//Delete the left spaces
function ltrim(s)
{ 
    return s.replace( /^\s*/, ""); 
} 
//Delete the right spaces
function rtrim(s)
{ 
    return s.replace( /\s*$/, ""); 
} 
//Delete the right spaces and left spaces
function trim(s)
{ 
    return rtrim(ltrim(s)); 
} 

//FAST screen
function fnMandatory()
{
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
            var LastIndex = document.activeElement.id.lastIndexOf('_');
            var id = document.activeElement.id.substring(0,LastIndex+1);
            var source = document.getElementById(id + "txtAgreed");
            if(source.value == "")
            {
                alert("Please enter Agreed or Best Guess Source Plant");
                return false;
            }
        }    
    }            
}
function fnSetOutcome(user,dt,id,OutCome,hdnOutCome)
{    
    var arr = dt.split("/");
    var date=arr[1]+"/"+arr[0]+"/"+arr[2];  
    var Comments = document.activeElement.id;
    var hdnValue= document.getElementById(hdnOutCome);
    if(document.getElementById(Comments).value == '17')
    {
        document.getElementById(OutCome).value = '48';
    }
    hdnValue.value=document.getElementById(OutCome).value;
     var textId=document.getElementById(document.activeElement.id);
    var text = textId.options[textId.selectedIndex].text;
   if(text !='select')
   {   
       var ctl=document.getElementById(id);
       ctl.value=text+"\n"+'Stated by:'+ user + "\n"+'On:'+ date + "\n" +"\n"+ctl.value;
   }
}

function ValidateCollation()
{
    //debugger;
    var countPlus = 0;
    var countMul = 0;
    
    var LastIndex = document.activeElement.id.lastIndexOf('_');
    var id = document.activeElement.id.substring(0,LastIndex+1);
    var FormulationId = id + "lblNoOfFormulation";
    var NoOfFormulations = (Number)(document.getElementById(FormulationId).innerText);
    
    var CollationId = id + "txtCollation"; 
    var Collation = document.getElementById(CollationId).value;
    var QuantityId = id + "lblQuant";  
    var QuantityId = id + "lblQuant";  

	for(var i=0; i<Collation.length; i++)
	{
	    var oneChar = Collation.charAt(i);
	    if(oneChar == '+')
	    {
	        countPlus++;
	    }
	    if(oneChar == 'x')
	    {
	        countMul++;
	    }	    
	}       
       
	if(countPlus == NoOfFormulations - 1 && countMul == NoOfFormulations)
    {       
        var arr = new Array();  
        arr = Collation.split('+');
        for(var ElementCount = 0; ElementCount<arr.length; ElementCount++)
        {
            Id = QuantityId + (ElementCount + 1);
            document.getElementById(Id).innerHTML = arr[ElementCount];
        }    
    }
    else
    {
       for(var intCount = 0; intCount< NoOfFormulations; intCount++)
       {
            Id = QuantityId + (intCount+1);
            document.getElementById(Id).innerHTML = "";            
        }    
       CollationId.value = "";
       alert("Please enter valid Collation Description in the format as shown in the example");      
       
    }		
}

function fnEnableUpdate()
{
//debugger;
    var LastIndex = document.activeElement.firstChild.id.lastIndexOf('_');
    var id = document.activeElement.firstChild.id.substring(0,LastIndex+1);
    var LnkUpdateId = id + "lnkUpdate";
    document.getElementById(LnkUpdateId).visible = true;
}

function fnCheckUserSelected()
{
//debugger;
    var LastIndex = document.activeElement.id.lastIndexOf('_');
    var id = document.activeElement.id.substring(0,LastIndex+1);
//    if(AdminRequest == 1)
//    {
        var TxtId = id + "txtSCManager";
//    }
    if(document.getElementById(TxtId) == "")
    {
        alert("Please select the user");
        return false;
    }
}

// Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
function fnCalculateCollation()
{
//debugger;
//     var Quantity1 = "";
//     var Configuration1 = "";
//     var UOM1 = "";
     var LastIndex = document.activeElement.id.lastIndexOf('_');
     var id = document.activeElement.id.substring(0,LastIndex+1);
     var FormulationId = id + "lblNoOfFormulation";
     var Collation = document.getElementById(id + "lblCollationDesc").innerText;

//     Quantity1 = document.getElementById(id + "txtQuantity12");
//     Configuration1 = document.getElementById(id + "txtQuantity11");
//     UOM1 = document.getElementById(id + "ddlQuantity13");
//     Quantity2 = document.getElementById(id + "txtQuantity22");
//     Configuration2 = document.getElementById(id + "txtQuantity21");
//     UOM2 = document.getElementById(id + "ddlQuantity23");
     
     var arrQuantity = new Array();
     var arrFillQuantity = new Array();
     var arrConfiguration = new Array();
     var arrUOM = new Array();
     var ElementNumber = document.getElementById(FormulationId).innerText;
     
     for (i=1; i <= ElementNumber; i++)
     {
        arrQuantity[i] = document.getElementById(id + "txtQuantity" + i + "2");
        arrFillQuantity[i] = document.getElementById(id + "txtFillQuantity" + i);
        arrConfiguration[i] = document.getElementById(id + "txtQuantity" + i + "1");
        arrUOM[i] = document.getElementById(id + "ddlQuantity" + i + "3");
    }

     document.getElementById(id + "lblCollationDesc").innerText = "";
     Collation = "";

     for (i=1; i <= ElementNumber; i++)
     {
        if (arrQuantity[i].value != "" && arrConfiguration[i].value != "" && arrUOM[i].selectedIndex > 0)
        {
            if (Collation == "")
            {
                if (arrFillQuantity[i].value != "")
                {
                    Collation = arrConfiguration[i].value + 'x' +
                            arrFillQuantity[i].value + ' ' +
                            arrUOM[i].options[arrUOM[i].selectedIndex].text;
                }
                else if (arrFillQuantity[i].value == "")
                {
                    Collation = arrConfiguration[i].value + 'x' +
                            arrQuantity[i].value + ' ' +
                            arrUOM[i].options[arrUOM[i].selectedIndex].text;
                }
            }
            else
            {
                if (arrFillQuantity[i].value != "")
                {
                    Collation = Collation + '+' + arrConfiguration[i].value + 'x' +
                            arrFillQuantity[i].value + ' ' +
                            arrUOM[i].options[arrUOM[i].selectedIndex].text;
                }
                else if (arrFillQuantity[i].value == "")
                {
                        Collation = Collation + '+' + arrConfiguration[i].value + 'x' +
                                arrQuantity[i].value + ' ' +
                                arrUOM[i].options[arrUOM[i].selectedIndex].text;
                }
            }
        }
     }
     
//     if(document.getElementById(FormulationId).innerText == "2")
//     {   
//        document.getElementById(id + "lblCollationDesc").innerText = "";
//        Collation = "";
//                
//        if((Quantity1.value != "" && Configuration1.value != "" && UOM1.selectedIndex > 0) &&
//            (Quantity2.value != "" && Configuration2.value != "" && UOM2.selectedIndex > 0))
//        {
//            Collation = Configuration1.value + 'x' +
//                    Quantity1.value + ' ' +
//                    UOM1.options[UOM1.selectedIndex].text +  '+' +                             
//                    Configuration2.value + 'x' +
//                    Quantity2.value + ' ' +
//                    UOM2.options[UOM2.selectedIndex].text; 
//        } 
//        else
//        { 
//            if(Quantity1.value != "" && Configuration1.value != "" && UOM1.selectedIndex > 0)            
//            {
//                Collation = Configuration1.value + 'x' +
//                        Quantity1.value + ' ' +
//                        UOM1.options[UOM1.selectedIndex].text; 
//            }
//            else if(Quantity2.value != "" && Configuration2.value != "" && UOM2.selectedIndex > 0)
//            {
//                Collation = Configuration2.value + 'x' +
//                        Quantity2.value + ' ' +
//                        UOM2.options[UOM2.selectedIndex].text; 
//            }                             
//        }
//     }
//     
//     if(document.getElementById(FormulationId).innerText == "3")
//     {  
//        document.getElementById(id + "lblCollationDesc").innerText = ""; 
//        Collation = "";     
//        Quantity3 = document.getElementById(id + "txtQuantity32");
//        Configuration3 = document.getElementById(id + "txtQuantity31");
//        UOM3 = document.getElementById(id + "ddlQuantity33");
//        
//        if((Quantity1.value != "" && Configuration1.value != "" && UOM1.selectedIndex > 0)
//            && (Quantity2.value != "" && Configuration2.value != "" && UOM2.selectedIndex > 0)
//            && (Quantity3.value != "" && Configuration3.value != "" && UOM3.selectedIndex > 0))
//        {
//            Collation = Configuration1.value + 'x' +
//                        Quantity1.value + ' ' +
//                        UOM1.options[UOM1.selectedIndex].text + '+' +
//                        Configuration2.value + 'x' +
//                        Quantity2.value + ' ' +
//                        UOM2.options[UOM2.selectedIndex].text + '+' +
//                        Configuration3.value + 'x' +
//                        Quantity3.value + ' ' +
//                        UOM3.options[UOM3.selectedIndex].text ; 
//        }
//        else
//        {
//            if(Quantity1.value != "" && Configuration1.value != "" && UOM1.selectedIndex > 0)            
//            {
//                Collation = Configuration1.value + 'x' +
//                        Quantity1.value + ' ' +
//                        UOM1.options[UOM1.selectedIndex].text; 
//            }
//            
//            if(Quantity2.value != "" && Configuration2.value != "" && UOM2.selectedIndex > 0)
//            {
//                if(Collation == "")
//                {
//                    Collation = Configuration2.value + 'x' +
//                            Quantity2.value + ' ' +
//                            UOM2.options[UOM2.selectedIndex].text; 
//                }
//                else
//                {
//                     Collation = Collation + '+' + Configuration2.value + 'x' +
//                            Quantity2.value + ' ' +
//                            UOM2.options[UOM2.selectedIndex].text; 
//                }
//            } 
//            
//            if(Quantity3.value != "" && Configuration3.value != "" > 0 && UOM3.selectedIndex > 0)
//            {
//                if(Collation == "")
//                {
//                    Collation = Configuration3.value + 'x' +
//                            Quantity3.value + ' ' +
//                            UOM3.options[UOM3.selectedIndex].text; 
//                }
//                else
//                {
//                    Collation = Collation + '+' + Configuration3.value + 'x' +
//                            Quantity3.value + ' ' +
//                            UOM3.options[UOM3.selectedIndex].text; 
//                }
//            }            
//        }      
//       
//     }
//     
//     if(document.getElementById(FormulationId).innerText == "4")
//     {  
//        document.getElementById(id + "lblCollationDesc").innerText = "";
//        Collation = "";      
//        Quantity3 = document.getElementById(id + "txtQuantity32");
//        Configuration3 = document.getElementById(id + "txtQuantity31");
//        UOM3 = document.getElementById(id + "ddlQuantity33");
//        Quantity4 = document.getElementById(id + "txtQuantity42");
//        Configuration4 = document.getElementById(id + "txtQuantity41");
//        UOM4 = document.getElementById(id + "ddlQuantity43");
//        
//        if((Quantity1.value != "" && Configuration1.value != "" && UOM1.selectedIndex > 0)
//            && (Quantity2.value != "" && Configuration2.value != "" && UOM2.selectedIndex > 0)
//            && (Quantity3.value != "" && Configuration3.value != "" && UOM3.selectedIndex > 0)
//            && (Quantity4.value != "" && Configuration4.value != "" && UOM4.selectedIndex > 0))
//        {        
//            Collation = Configuration1.value + 'x' +
//                        Quantity1.value + ' ' +
//                        UOM1.options[UOM1.selectedIndex].text + '+' +
//                        Configuration2.value + 'x' +
//                        Quantity2.value + ' ' +
//                        UOM2.options[UOM2.selectedIndex].text + '+' +
//                        Configuration3.value + 'x' +
//                        Quantity3.value + ' ' +
//                        UOM3.options[UOM3.selectedIndex].text  + '+' +
//                        Configuration4.value + 'x' +
//                        Quantity4.value + ' ' +
//                        UOM4.options[UOM4.selectedIndex].text;  
//        }
//        else
//        {
//            if(Quantity1.value != "" && Configuration1.value != "" && UOM1.selectedIndex > 0)            
//            {
//                Collation = Configuration1.value + 'x' +
//                        Quantity1.value + ' ' +
//                        UOM1.options[UOM1.selectedIndex].text; 
//            }
//            
//            if(Quantity2.value != "" && Configuration2.value != "" && UOM2.selectedIndex > 0)
//            {
//                if(Collation == "")
//                {
//                    Collation = Configuration2.value + 'x' +
//                            Quantity2.value + ' ' +
//                            UOM2.options[UOM2.selectedIndex].text; 
//                }
//                else
//                {
//                     Collation = Collation + '+' + Configuration2.value + 'x' +
//                            Quantity2.value + ' ' +
//                            UOM2.options[UOM2.selectedIndex].text; 
//                }
//            } 
//            
//            if(Quantity3.value != "" && Configuration3.value != "" && UOM3.selectedIndex > 0)
//            {
//                if(Collation == "")
//                {
//                    Collation = Configuration3.value + 'x' +
//                            Quantity3.value + ' ' +
//                            UOM3.options[UOM3.selectedIndex].text; 
//                }
//                else
//                {
//                    Collation = Collation + '+' + Configuration3.value + 'x' +
//                            Quantity3.value + ' ' +
//                            UOM3.options[UOM3.selectedIndex].text; 
//                }
//            }
//            if(Quantity4.value != "" && Configuration4.value != "" && UOM4.selectedIndex > 0)
//            {
//                if(Collation == "")
//                {
//                    Collation = Configuration4.value + 'x' +
//                            Quantity4.value + ' ' +
//                            UOM4.options[UOM4.selectedIndex].text; 
//                }
//                else
//                {
//                    Collation = Collation + '+' + Configuration4.value + 'x' +
//                            Quantity4.value + ' ' +
//                            UOM4.options[UOM4.selectedIndex].text; 
//                }
//            }                 
//        }
//    }    
    document.getElementById(id + "lblCollationDesc").innerText = Collation; 
    document.getElementById(id + "hdnCollation").value = Collation;
}
// End of change by Infosys for ERMS case 1198549-1 on 30/10/2008

function fnValidateQuantityEntered()
{
    //debugger;
    if (fnValuecheck())
	{
        var LastIndex = document.activeElement.id.lastIndexOf('_');
        var id = document.activeElement.id.substring(0,LastIndex+1);
        var QuantityId = document.activeElement.id;
        var Quantity = document.getElementById(QuantityId).value;
        var QuantityCtlId = QuantityId.substring(LastIndex+1, QuantityId.length);
        if(QuantityCtlId == "txtQuantity12")
        {
            var FillQuantityId = document.getElementById(id + "txtFillQuantity1");        
        }
        if(QuantityCtlId == "txtQuantity22")
        {
            var FillQuantityId = document.getElementById(id + "txtFillQuantity2");
        }
        if(QuantityCtlId == "txtQuantity32")
        {
            var FillQuantityId = document.getElementById(id + "txtFillQuantity3");
        }
        if(QuantityCtlId == "txtQuantity42")
        {
            var FillQuantityId = document.getElementById(id + "txtFillQuantity4");
        }
        if(Quantity == "")
        {
            if(FillQuantityId.value != "")
            { 
                alert("Please enter Quantity");  
                document.getElementById(QuantityId).focus();
                return true;              
            }
        }
        else
        {
            if(FillQuantityId.value != "")
            {           
                if(parseFloat(Quantity) <  parseFloat(FillQuantityId.value))
                {
                    //document.getElementById(FillQuantityId).value = "";
                    alert("Quantity entered should be more than the Fill Quantity entered");                   
                    document.getElementById(QuantityId).value = "";  
                    document.getElementById(QuantityId).focus();                  
                    return false;
                }
                else
                {
                    return true;
                }
            }
            else
            {
                return true;
            }
        }
    }
    else
    {
        return false;
    }
}




function fnCheckQuantity()
{
 //debugger;

        var LastIndex = document.activeElement.id.lastIndexOf('_');
        var id = document.activeElement.id.substring(0,LastIndex+1);
        var FillQuantityId = document.activeElement.id;
        var FillQuantity = document.getElementById(FillQuantityId).value;
        var FillQuantityCtlId = FillQuantityId.substring(LastIndex+1, FillQuantityId.length);
       
   if(fnValuecheck())
   {   
        if(FillQuantityCtlId == "txtFillQuantity1")
        {
            var ConfigurationId = document.getElementById(id + "txtQuantity12");
            if(ConfigurationId.value != "")
            {
                var SelectedValue = ConfigurationId.value;
                if(parseFloat(SelectedValue) <  parseFloat(FillQuantity))
                {
                    //document.getElementById(FillQuantityId).value = "";
                    alert("Please enter valid Fill Quantity, Fill Quantity should be less than the Quantity entered");
                    // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                    document.getElementById(FillQuantityId).value = "";
                    ConfigurationId.focus();
                    if (document.getElementById(id + "lblCollationDesc") != null)
                    {
                    	fnCalculateCollation();
                    }// End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                    return false;
                }
                // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                else if (document.getElementById(id + "lblCollationDesc") != null)
                {
                    fnCalculateCollation();
                }
                // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
            }
            else
            {   //document.getElementById(FillQuantityId).value = "";
                alert("Please first enter the quantity");
                document.getElementById(FillQuantityId).value = "";
                ConfigurationId.focus();
                return false;
            }
            
        }
        if(FillQuantityCtlId == "txtFillQuantity2")
        {
            var ConfigurationId = document.getElementById(id + "txtQuantity22");
            if(ConfigurationId.value != "")
            {
                var SelectedValue = ConfigurationId.value;
                if(parseFloat(SelectedValue) <  parseFloat(FillQuantity))
                {
                    //document.getElementById(FillQuantityId).value = "";
                    alert("Please enter valid Fill Quantity, Fill Quantity should be less than the Quantity entered");
                    // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                    document.getElementById(FillQuantityId).value = "";
                    ConfigurationId.focus();
                    if (document.getElementById(id + "lblCollationDesc") != null)
                    {
                    	fnCalculateCollation();
                    }
                    // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                    return false;
                }
                // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                else if (document.getElementById(id + "lblCollationDesc") != null)
                {
                    fnCalculateCollation();
                }
                // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
            }
            else
            {
                //document.getElementById(FillQuantityId).value = "";
                alert("Please first enter the quantity");
                document.getElementById(FillQuantityId).value = "";
                ConfigurationId.focus();
                return false;
            }
        }
        if(FillQuantityCtlId == "txtFillQuantity3")
        {
            var ConfigurationId = document.getElementById(id + "txtQuantity32");
            if(ConfigurationId.value != "")
            {
                var SelectedValue = ConfigurationId.value;
                if(parseFloat(SelectedValue) <  parseFloat(FillQuantity))
                {
                    //document.getElementById(FillQuantityId).value = "";
                    alert("Please enter valid Fill Quantity, Fill Quantity should be less than the Quantity entered");
                    // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                    document.getElementById(FillQuantityId).value = "";
                    ConfigurationId.focus();
                    if (document.getElementById(id + "lblCollationDesc") != null)
                    {
                    	fnCalculateCollation();
                    }
                    // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                    return false;
                }
                // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                else if (document.getElementById(id + "lblCollationDesc") != null)
                {
                    fnCalculateCollation();
                }
                // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
            }
            else
            {
                //document.getElementById(FillQuantityId).value = "";       
                alert("Please first enter the quantity");
                document.getElementById(FillQuantityId).value = "";
                ConfigurationId.focus();
                return false;
            }
        }
         if(FillQuantityCtlId == "txtFillQuantity4")
        {
            var ConfigurationId = document.getElementById(id + "txtQuantity42");
            if(ConfigurationId.value != "")
            {
               //start of change by Infosys for ERMS case
               var SelectedValue = ConfigurationId.value;
               //end of change by Infosys for ERMS case
               if(parseFloat(SelectedValue) <  parseFloat(FillQuantity))
                {
                    //document.getElementById(FillQuantityId).value = "";
                    alert("Please enter valid Fill Quantity, Fill Quantity should be less than the Quantity entered");
                    // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                    document.getElementById(FillQuantityId).value = "";
                    ConfigurationId.focus();
                    if (document.getElementById(id + "lblCollationDesc") != null)
                    {
                    	fnCalculateCollation();
                    }
                    // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                    return false;
                }
                // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                else if (document.getElementById(id + "lblCollationDesc") != null)
                {
                    fnCalculateCollation();
                }
                // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
            }
            else
            {
                //document.getElementById(FillQuantityId).value = "";
                alert("Please first enter the quantity");
                document.getElementById(FillQuantityId).value = "";
                ConfigurationId.focus();
                return false;
            }
        } 
        //Start of change by Infosys for ERMS issue
        if(FillQuantityCtlId == "txtPartFilledQty")
        {
            var ConfigurationId = document.getElementById(id + "txtQtyOrPackSize");
            if(ConfigurationId.value != "")
            {
                var SelectedValue = ConfigurationId.value;
                if(parseFloat(SelectedValue) <  parseFloat(FillQuantity))
                {
                    //document.getElementById(FillQuantityId).value = "";
                    alert("Please enter valid Fill Quantity, Fill Quantity should be less than the Quantity entered");
                    // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                    document.getElementById(FillQuantityId).value = "";
                    ConfigurationId.focus();
                    if (document.getElementById(id + "lblCollationDesc") != null)
                    {
                    	fnCalculateCollation();
                    }
                    // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                    return false;
                }
                // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                else if (document.getElementById(id + "lblCollationDesc") != null)
                {
                    fnCalculateCollation();
                }
                // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008

            }
            else
            {   //document.getElementById(FillQuantityId).value = "";
                alert("Please first enter the quantity");
                document.getElementById(FillQuantityId).value = "";
                ConfigurationId.focus();
                return false;
            }
        }
        //End of change by Infosys for ERMS issue
    }  
    else
    {
        // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
        if (document.getElementById(id + "lblCollationDesc") != null)
        {
        	fnCalculateCollation();
        }
        // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
        return false;    
    }   
}

//Start to change by Infosys for EMRS issue 1174053-1
function fnValidateQuantityEnteredforChild()
{
    if (fnValuecheck())
    {
        var LastIndex = document.activeElement.id.lastIndexOf('_');
        var id = document.activeElement.id.substring(0,LastIndex+1);        
        var QuantityId = document.getElementById(id + "txtQtyOrPackSize");
        var PartFilledId = document.getElementById(id + "txtPartFilledQty");

        if(QuantityId.value != "")
        {
            if(PartFilledId!=null)
               if(PartFilledId.value != "")
               {           
                   if(parseFloat(QuantityId.value ) <  parseFloat(PartFilledId.value))
                   {                   
                       alert("Quantity entered should be more than the Fill Quantity entered");                                       
                       document.getElementById(id + "txtQtyOrPackSize").focus();                  
                       return false;
                   }
                   else
                   {
                       return true;
                   }
               }
               else
               {
                   return true;
               }
        }
        else
           return true;
    }
}
//End to change by Infosys for EMRS issue 1174053-1

function fnValidateQuantity(ElementNo)
{
//debugger;
	// Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
	var LastIndex = document.activeElement.id.lastIndexOf('_');
	var id = document.activeElement.id.substring(0,LastIndex+1);
	// End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
	
    if(fnValuecheck())
    {
       if(fnValidateQuantityEntered())
       {
            var QuantityId = document.getElementById(document.activeElement.id);
            
            if(QuantityId.value != "")
            {
                if(ElementNo == 1)
                {
                    var PackSizeId = document.getElementById(id + "ddlPackSize1");
                }
                if(ElementNo == 2)
                {
                    var PackSizeId = document.getElementById(id + "ddlPackSize2");
                }
                if(ElementNo == 3)
                {
                    var PackSizeId = document.getElementById(id + "ddlPackSize3");
                }
                if(ElementNo == 4)
                {
                    var PackSizeId = document.getElementById(id + "ddlPackSize4");
                }
                if(PackSizeId.selectedIndex > 0 && PackSizeId.value != 1)  
                {
                    var PackSizeQuantity = PackSizeId.options[PackSizeId.selectedIndex].text;
                    var PackSizeIndex = PackSizeQuantity.indexOf('(');
                    var PackSize = PackSizeQuantity.substring(0,PackSizeIndex);
                    var QuantityValue = 0;        
                    var Count = 0;
                   
                    for(var i=0; i<PackSize.length; i++)
	                {
	                    var oneChar = PackSize.charAt(i);
	                    if(oneChar == "0" || oneChar == "1" || oneChar == "2" || oneChar == "3" || oneChar == "4" || oneChar == "5" || oneChar == "6" || oneChar == "7" || oneChar == "8" || oneChar == "9" || oneChar == ".")
	                    {
	                        Count = Count + 1;
	                        if(Count == 1)
	                        {
	                            QuantityValue = oneChar;
	                        }
	                        else
	                        {
	                           QuantityValue = QuantityValue + oneChar;
	                        }
	                    }
	                }
	                if(QuantityId.value != QuantityValue)
                    {
                        alert("Please enter the Quantity same as selected Pack Size");
                        QuantityId.value = "";
                        QuantityId.focus();
                        // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                        if (document.getElementById(id + "lblCollationDesc") != null)
                        {
                        	fnCalculateCollation();
                        }
                        // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                        return false;
                    }
	            }
                // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                if (document.getElementById(id + "lblCollationDesc") != null)
                {
                	fnCalculateCollation();
                }
                // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
	        }	
	    } 	    
	    else
	    {
	        // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
	        if (document.getElementById(id + "lblCollationDesc") != null)
	        {
	        	fnCalculateCollation();
	        }
	        // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
	        return false;
	    }
	}
	else
	{
	    // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
	    if (document.getElementById(id + "lblCollationDesc") != null)
	    {
	    	fnCalculateCollation();
	    }
	    // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
	    return false;
	}
}


function fnValidateUOM(ElementNo)
{
//debugger;
    var UOMId = document.getElementById(document.activeElement.id);
    var LastIndex = document.activeElement.id.lastIndexOf('_');
    var id = document.activeElement.id.substring(0,LastIndex+1);
    
    if(UOMId.selectedIndex > 0)
    {
        if(ElementNo == 1)
        {
            var PackSizeId = document.getElementById(id + "ddlPackSize1");
        }
        if(ElementNo == 2)
        {
            var PackSizeId = document.getElementById(id + "ddlPackSize2");
        }
        if(ElementNo == 3)
        {
            var PackSizeId = document.getElementById(id + "ddlPackSize3");
        }
        if(ElementNo == 4)
        {
            var PackSizeId = document.getElementById(id + "ddlPackSize4");
        }
        if(PackSizeId.selectedIndex > 0 && PackSizeId.value != 1)  
        {        
            var PackSizeQuantity = PackSizeId.options[PackSizeId.selectedIndex].text;
            var PackSizeIndex = PackSizeQuantity.indexOf('(');
            var PackSize = PackSizeQuantity.substring(0,PackSizeIndex);
            var UOMValue = "";        
            var Count = 0;
           
            for(var i=0; i<PackSize.length; i++)
	        {
	            var oneChar = PackSize.charAt(i);
	            if(oneChar != "0" && oneChar != "1" && oneChar != "2" && oneChar != "3" && oneChar != "4" && oneChar != "5" && oneChar != "6" && oneChar != "7" && oneChar != "8" && oneChar != "9" && oneChar != ".")
	            {
	                Count = Count + 1;
	                if(Count == 1)
	                {
	                    UOMValue = oneChar;
	                }
	                else
	                {
	                   UOMValue = UOMValue + oneChar;
	                }
	            }
	        }
	        if(UOMId.options[UOMId.selectedIndex].text != UOMValue)
            {
                alert("Please select the UOM same as in selected Pack Size");
                UOMId.selectedIndex = 0;
                // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                if (document.getElementById(id + "lblCollationDesc") != null)
                {
                	fnCalculateCollation();
                }
                // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
                return false;
            }
	    }	
        // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
        else if (document.getElementById(id + "lblCollationDesc") != null)
        {
            fnCalculateCollation();
        }
        // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
    }
    // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
    if (document.getElementById(id + "lblCollationDesc") != null)
    {
    	fnCalculateCollation();
    }
    // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008  
}


function fnValidatePackSize(ElementNo)
{
//debugger;
    var PackSizeId = document.getElementById(document.activeElement.id);
    var LastIndex = document.activeElement.id.lastIndexOf('_');
    var id = document.activeElement.id.substring(0,LastIndex+1);
    if(PackSizeId.selectedIndex > 0 && PackSizeId.value != 1)
    {
        if(ElementNo == 1)
        {
            var QuantityId = id + "txtQuantity12";
            var UomId = id + "ddlQuantity13";        
        }
        if(ElementNo == 2)
        {
            var QuantityId = id + "txtQuantity22";
            var UomId = id + "ddlQuantity23";        
        }
        if(ElementNo == 3)
        {
            var QuantityId = id + "txtQuantity32";
            var UomId = id + "ddlQuantity33";        
        }
        if(ElementNo == 4)
        {
            var QuantityId = id + "txtQuantity42";
            var UomId = id + "ddlQuantity43";        
        }
        var Quantity = document.getElementById(QuantityId);
        var UOM = document.getElementById(UomId);
        
        var PackSizeQuantity = PackSizeId.options[PackSizeId.selectedIndex].text;
        var PackSizeIndex = PackSizeQuantity.indexOf('(');
        var PackSize = PackSizeQuantity.substring(0,PackSizeIndex);
        var QuantityValue = 0;
        var UomValue = "";
        var Count = 0;
        var CountUom = 0;    
        for(var i=0; i<PackSize.length; i++)
	    {
	        var oneChar = PackSize.charAt(i);
	        if(oneChar == "0" || oneChar == "1" || oneChar == "2" || oneChar == "3" || oneChar == "4" || oneChar == "5" || oneChar == "6" || oneChar == "7" || oneChar == "8" || oneChar == "9" || oneChar == ".")
	        {
	            Count = Count + 1;
	            if(Count == 1)
	            {
	                QuantityValue = oneChar;
	            }
	            else
	            {
	               QuantityValue = QuantityValue + oneChar;
	            }
	        }
	         else
	         {
	            CountUom = CountUom + 1;
	            if(CountUom == 1)
	            {
	                UomValue = oneChar;
	            }
	            else
	            {
	                UomValue = UomValue + oneChar;
	            }  
             } 
        }    
    	
        if(Quantity.value != "")
        {
            if(Quantity.value != QuantityValue)
            {
                alert("Please select the PackSize for which the Quantity should be same as entered Quantity");
                PackSizeId.selectedIndex = 0;
                return false;
            }        
        }
        if(UOM.selectedIndex != 0)
        {
            if(UOM.options[UOM.selectedIndex].text != UomValue)
            {
                alert("Please select the PackSize for which the UOM should be same as selected from the UOM dropdown");
                PackSizeId.selectedIndex = 0;
                return false;
            }
        } 
    }   
}

function fnCheckSupplyChainMandatoryFields()
{
//debugger;
    var LastIndex = document.activeElement.id.lastIndexOf('_');
    var id = document.activeElement.id.substring(0,LastIndex+1);
    var LeadAIId = document.getElementById(id + "ddlLeadAI");   
    var txtLeadAIId = document.getElementById(id + "txtLeadAI");   
    if(LeadAIId.selectedIndex ==0 && txtLeadAIId.value=="")
    {
        alert("LeadAI need to be selected or typed");
        return false;
    }  
    return true; 
}

function fnCheckCombiPackHomeMandatoryFields()
{
//debugger;
    var LastIndex = document.activeElement.id.lastIndexOf('_');
    var id = document.activeElement.id.substring(0,LastIndex+1);
    var LeadAIId = document.getElementById(id + "ddlLeadAI");
    var NoOfFormulationId = document.getElementById(id + "ddlContents");
    if(LeadAIId.selectedIndex == 0)
    {
        alert("Please select the LeadAI");
        return false;
    }
    if(NoOfFormulationId.selectedIndex == 0)
    {
        alert("Please select the NoOfFormulations for the Combi Pack");
        return false;
    }    
}

//Start of change by Infosys for ERMS issue
function fnValueCheckForSales()
{
    		
	//debugger;
	
	obj = document.getElementById(document.activeElement.id)
		
  if(document.activeElement.id=="ctl00_ermsContentPageHeader_gvYear_ctl02_txtYear1" || 
     document.activeElement.id=="ctl00_ermsContentPageHeader_gvYear_ctl02_txtYear2" || 
     document.activeElement.id=="ctl00_ermsContentPageHeader_gvYear_ctl02_txtYear3")
  {  
	if (!fnValidateDecimal(obj.value))
	{
		if(obj.value == "")
		{
			obj.value = "";
		}
		else
		{
			alert("Please enter a valid Sales Price upto 2 decimal places and it should be less than 9999999.99");		
			obj.focus();
			obj.value="";
			return false;
		}
	} 
	parseFloat(obj.value)
	{
		if(obj.value < 0 || obj.value > 9999999.99)
		{		    
			alert("Please enter a valid Sales Price upto 2 decimal places and it should be less than 9999999.99");		
			obj.focus();
			obj.value="";
			return false;
		}
		else
		{
		    return true;
		}
	}
  }	
  if(document.activeElement.id=="ctl00_ermsContentPageHeader_gvYear_ctl03_txtYear1" || 
     document.activeElement.id=="ctl00_ermsContentPageHeader_gvYear_ctl03_txtYear2" || 
     document.activeElement.id=="ctl00_ermsContentPageHeader_gvYear_ctl03_txtYear3")
  {  
	if (!fnValidateDecimal(obj.value))
	{
		if(obj.value == "")
		{
			obj.value = "";
		}
		else
		{
		    
			alert("Please enter a valid volume upto 2 decimal places and it should be less than 9999999.99");		
			
			
			obj.focus();
			obj.value="";
			return false;
		}
	} 
	parseFloat(obj.value)
	{
		if(obj.value < 0 || obj.value > 9999999.99)
		{		    
		    alert("Please enter a valid volume upto 2 decimal places and it should be less than 9999999.99");		
			
			
			obj.focus();
			obj.value="";
			return false;
		}
		else
		{
		    return true;
		}
	}
  }				
}

//check whether the value entered is integer
function fnValidateInteger(strValue)
{ 
	var strPattern1 =/^\-?\d+$/;           
	if (!(strPattern1.test(strValue))&& !(strValue=="") )
	{
		return false;
	}                
	else
	{
		return true;
	}
}

// start of change on 22/10/2008
function fncheckSUAgiCode()
{    		
	obj = document.getElementById(document.activeElement.id)
	if (!fnValidateInteger(obj.value))
	{
		if(obj.value == "")
		{
			obj.value = "";
		}
		else
		{
		    
			alert("Please Enter valid SU Agi Code which contain integer only");
			//Added for case 1259130-1 Combi Element SU on 30-Mar-2009
			obj.value = "";
			
			obj.focus();
			return false;
		}
	} 
	parseFloat(obj.value)
	{
		if(obj.value < 0 || obj.value > 999999999)
		{		    
			alert("Please Enter valid SU Agi Code which contain integer only");
			//Added for case 1259130-1 Combi Element SU on 30-Mar-2009
			obj.value = "";
			
			obj.focus();
			return false;
		}
		else
		{
		    return true;
		}
	}			
}
// end of change on 22/10/2008


function fncheckSCPPurchaseNumber()
{
    		
	//debugger;
	obj = document.getElementById(document.activeElement.id)
	if (!fnValidateInteger(obj.value))
	{
		if(obj.value == "")
		{
			obj.value = "";
		}
		else
		{
		    
			alert("Please Enter valid Purchase Number which contain integer only");
			
			
			obj.focus();
			return false;
		}
	} 
	parseFloat(obj.value)
	{
		if(obj.value < 0 || obj.value > 999)
		{		    
			alert("Please Enter valid Purchase Number which contain integer only");
			
			
			obj.focus();
			return false;
		}
		else
		{
		    return true;
		}
	}			
}

function fncheckNSUCode()
{
    		
	//debugger;
	obj = document.getElementById(document.activeElement.id)
	if (!fnValidateInteger(obj.value))
	{
		if(obj.value == "")
		{
			obj.value = "";
		}
		else
		{
		    
			alert("Please Enter valid NSU code which contain integer only");
			
			
			obj.focus();
			return false;
		}
	} 
	parseFloat(obj.value)
	{
		if(obj.value < 0)
		{		    
			alert("Please Enter valid NSU code which contain integer only");
			
			
			obj.focus();
			return false;
		}
		else
		{
		    return true;
		}
	}			
}


function fncheckAgiCode()
{
    		
	//debugger;
	obj = document.getElementById(document.activeElement.id)
	if (!fnValidateInteger(obj.value))
	{
		if(obj.value == "")
		{
			obj.value = "";
		}
		else
		{
		    
			alert("Please Enter valid Agi Code which contain integer only");
			
			
			obj.focus();
			return false;
		}
	} 
	parseFloat(obj.value)
	{
		if(obj.value < 0)
		{		    
			alert("Please Enter valid Agi Code which contain integer only");
			
			
			obj.focus();
			return false;
		}
		else
		{
		    return true;
		}
	}			
}


function fncheckPrimaryPackSize()
{
    		
	//debugger;
	obj = document.getElementById(document.activeElement.id)
	if (!fnValidateDecimal(obj.value))
	{
		if(obj.value == "")
		{
			obj.value = "";
		}
		else
		{
		    
			alert("Please enter a valid quantity, it should contain numeric values upto 2 decimal places only");
			
			
			obj.focus();
			return false;
		}
	} 
	parseFloat(obj.value)
	{
		return true;
	}			
}
//End of change by Infosys for ERMS issue

function fnValuecheck()
{
    		
	//debugger;
	// Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
	var LastIndex = document.activeElement.id.lastIndexOf('_');
	var id = document.activeElement.id.substring(0,LastIndex+1);
	// End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
	
	obj = document.getElementById(document.activeElement.id)
	if (!fnValidateDecimal(obj.value))
	{
		if(obj.value == "")
		{
			obj.value = "";
		}
		else
		{
		    
			alert("Please enter a valid quantity, it should contain numeric values upto 2 decimal places only");
			
			obj.value = "";
			obj.focus();
			return false;
		}
	} 
	parseFloat(obj.value)
	{
		if(obj.value < 0 || obj.value > 9999999.99)
		{		    
			alert("Please enter a valid quantity, it should contain numeric values upto 2 decimal places only");
			
			obj.value = "";
			obj.focus();
		    // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
		    if (document.getElementById(id + "lblCollationDesc") != null)
		    {
		    	fnCalculateCollation();
		    }
		    // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
			return false;
		}
		else
		{
		    // Start of change by Infosys for ERMS case 1198549-1 on 30/10/2008
		    if (document.getElementById(id + "lblCollationDesc") != null)
		    {
		    	fnCalculateCollation();
		    }
		    // End of change by Infosys for ERMS case 1198549-1 on 30/10/2008
		    return true;
		}
	}			
}
		
//check whether the value entered is decimal
function fnValidateDecimal(strValue)
{                       
	var strPattern1 = /^\d+(\.\d{2})?$/;
	var strPattern2 = /^\d+(\.\d{1})?$/;
	var strPattern3 = /^\d+(\.\d{0})?$/; 
	//Start of change by Infosys for ERMS issue 
	var strPattern4 = /^\.\d$/; 
	var strPattern5 = /^\.\d\d$/;
	if (!(strPattern1.test(strValue)) && !(strPattern2.test(strValue)) && !(strPattern3.test(strValue)) && !(strPattern4.test(strValue)) && !(strPattern5.test(strValue)))//&& !(strPattern6.test(strValue)))
	//End of change by Infosys for ERMS issue
	{
		return false;
	}                
	else
	{
		return true;
	}
}


function fnCheckMandatoryFields()
{
    //debugger;
    var LastIndex = document.activeElement.id.lastIndexOf('_');
     var id = document.activeElement.id.substring(0,LastIndex+1);
     var LeadAI = document.getElementById(id + "lblLeadAI").innerText;
     var NoOfFormulation = document.getElementById(id + "lblNoOfFormulation").innerText;     
     var ProductLine = document.getElementById(id + "ddlProductLine");
     var TradeName = document.getElementById(id + "txtTradeName").value;
     var CountryOfSale = document.getElementById(id + "ddlCountryOfSale");
     var PresentationCode = document.getElementById(id + "txtCountryPresCode").value;  
     var ProductCategory = document.getElementById(id + "ddlProductCategory");   
     var Collation = document.getElementById(id + "lblCollationDesc").innerText;
     
     var Quantity11 = document.getElementById(id + "txtQuantity11");
     var Quantity12 = document.getElementById(id + "txtQuantity12");
     var Quantity13 = document.getElementById(id + "ddlQuantity13");
     var LeadAI1 = document.getElementById(id + "ddlLeadAI1");
     var Formulation1 = document.getElementById(id + "ddlFormulation1");
     var PackSize1 = document.getElementById(id + "ddlPackSize1");
     //start code change on 19th May 2008
     var IsSynBrdPack1 =document.getElementById(id + "ddlIsSynBrdPack1");
     //end
     var ProductLine1 = document.getElementById(id + "ddlProductLine1");
     var TradeName1 = document.getElementById(id + "txtTradeName1").value;
     var SUExist1 = document.getElementById(id + "ddlSUExist1");
     var SUAgiCode1 = document.getElementById(id + "txtSuAgiCode1").value;
     
     var Quantity21 = document.getElementById(id + "txtQuantity21");
     var Quantity22 = document.getElementById(id + "txtQuantity22");
     var Quantity23 = document.getElementById(id + "ddlQuantity23");
     var LeadAI2 = document.getElementById(id + "ddlLeadAI2");
     var Formulation2 = document.getElementById(id + "ddlFormulation2");
     var PackSize2 = document.getElementById(id + "ddlPackSize2");
      //start code change on 19th May 2008
     var IsSynBrdPack2=document.getElementById(id + "ddlIsSynBrdPack2");
     //end
     var ProductLine2 = document.getElementById(id + "ddlProductLine2");
     var TradeName2 = document.getElementById(id + "txtTradeName2").value;
     var SUExist2 = document.getElementById(id + "ddlSUExist2");
     var SUAgiCode2 = document.getElementById(id + "txtSuAgiCode2").value;
       //start of change by Tod Zhang on the 26/3/2008 for case 1106376-1
//     if(Collation == "" || ProductLine.selectedIndex == 0 || TradeName == "" || CountryOfSale.selectedIndex == 0 
//        || PresentationCode == "" || ProductCategory.selectedIndex == 0)
//     {
//        alert("Please enter all the mandatory fields");
//        return false;
//     }
     
    
     if(ProductLine.selectedIndex == 0 )
     {
        alert("Please select a ProductLine");
        return false;
     }
     else if(TradeName== "" )
     {
        alert("Please enter TradeName");
        return false;
     }
     else if(CountryOfSale.selectedIndex == 0  )
     {
        alert("Please select a CountryOfSale");
        return false;
     }
     else if(  trim(PresentationCode) == ""  )
     {
        alert("Please enter PresentationCode");
        return false;
     }
     else if(ProductCategory.selectedIndex == 0  )
     {
        alert("Please select a ProductCategory");
        return false;
     }
     
     
      //end of change by Tod Zhang on the 26/3/2008 for case 1106376-1
     else
     {    
         var quantity1=trim(document.getElementById("ctl00$ermsContentPage$txtQuantity11").value); 
            
            if(quantity1!="")
            {
               
               
               if(!fnValidateDecimal(quantity1))
               {
                 alert("Please enter the valid quantity for the quantity1"); 
                 document.getElementById("ctl00$ermsContentPage$txtQuantity11").value="";
                 document.getElementById("ctl00$ermsContentPage$txtQuantity11").focus();
                 return false;
               }
               
            }
            
            var quantity2=trim(document.getElementById("ctl00$ermsContentPage$txtQuantity21").value); 
            
            if(quantity2!="")
            { 
               

               
               if(!fnValidateDecimal(quantity2))
               {
                 alert("Please enter the valid quantity for the quantity2"); 
                 document.getElementById("ctl00$ermsContentPage$txtQuantity21").value="";
                 document.getElementById("ctl00$ermsContentPage$txtQuantity21").focus();
                 return false;
               }
               

            }
            
         if(NoOfFormulation == "2")
         {
         //start of change by Tod Zhang on the 26/3/2008 for case 1106376-1
//                if(Quantity11.value == "" || Quantity12.value == "" || Quantity13.selectedIndex == 0 
//                || LeadAI1.selectedIndex == 0 || Formulation1.selectedIndex == 0 || PackSize1.selectedIndex == 0 
//                ||  ProductLine1.selectedIndex == 0 || TradeName1 == "" || SUExist1.selectedIndex == 0 
//                || Quantity21.value == "" || Quantity22.value == "" || Quantity23.selectedIndex == 0 
//                || LeadAI2.selectedIndex == 0 || Formulation2.selectedIndex == 0 || PackSize2.selectedIndex == 0 
//                ||  ProductLine2.selectedIndex == 0 || TradeName2 == "" || SUExist2.selectedIndex == 0 )
//            {
//                alert("Please enter all the mandatory fields");
//                return false;
//            }

            //start of change by Infosys for ERMS case
            var fillQuantity1 = document.getElementById(id + "txtFillQuantity1");
            var fillQuantity2 = document.getElementById(id + "txtFillQuantity2");
            if (!fnValidateDecimal(fillQuantity1.value))
	        {
		       if(fillQuantity1.value == "")
		       {
			      fillQuantity1.value = "";
		       }
		       else
		       {
		    
			      alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the FillQuantity1");
			
			      fillQuantity1.value = "";
			      fillQuantity1.focus();
			      return false;
		       }
	        }
	        if (!fnValidateDecimal(fillQuantity2.value))
	        {
		       if(fillQuantity2.value == "")
		       {
			      fillQuantity2.value = "";
		       }
		       else
		       {
		    
			      alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the FillQuantity2");
			
			      fillQuantity2.value = "";
			      fillQuantity2.focus();
			      return false;
		       }
	        } 
	        
            //End of change by Infosys for ERMS case
            
            
            //element1
            if(Quantity11.value == "")
            {
                alert("Please enter Quantity1 in the element1");
                return false;
            }
            else if(Quantity12.value == "")
            {
                alert("Please enter Quantity2 in the element1");
                return false;
            }
            else if(Quantity13.selectedIndex == 0)
            {
                alert("Please select a unit for Quantity1 in the element1");
                return false;
            }
            else if( LeadAI1.selectedIndex == 0)
            {
                alert("Please select a LeadAI in the element1");
                return false;
            }
            else if( Formulation1.selectedIndex == 0 )
            {
                alert("Please select a Formulation in the element1");
                return false;
            }
            else if( PackSize1.selectedIndex == 0  )
            {
                alert("Please select a PackSize in the element1");
                return false;
            }
            else if( IsSynBrdPack1.selectedIndex == 0  )
            {
                alert("Please select do you require Syngenta Branded pack in the element1");
                return false;
            }
            else if( ProductLine1.selectedIndex == 0  )
            {
                alert("Please select a ProductLine in the element1");
                return false;
            }
            else if( TradeName1 == ""  )
            {
                alert("Please enter a TradeName in the element1");
                return false;
            }
            else if( SUExist1.selectedIndex == 0 )
            {
                alert("Please select a SUExist in the element1");
                return false;
            }
            //element2
            else if(Quantity21.value == "")
            {
                alert("Please enter Quantity2 in the element2");
                return false;
            }
            else if(Quantity22.value == "")
            {
                alert("Please enter Quantity2 in the element2");
                return false;
            }
            else if(Quantity23.selectedIndex == 0)
            {
                alert("Please select a unit for Quantity2 in the element2");
                return false;
            }
            else if( LeadAI2.selectedIndex == 0)
            {
                alert("Please select a LeadAI2 in the element2");
                return false;
            }
            else if( Formulation2.selectedIndex == 0 )
            {
                alert("Please select a Formulation2 in the element2");
                return false;
            }
            else if( PackSize2.selectedIndex == 0  )
            {
                alert("Please select a PackSize2 in the element2");
                return false;
            }
             else if( IsSynBrdPack2.selectedIndex == 0  )
            {
                alert("Please select do you require Syngenta Branded pack in the element2");
                return false;
            }
            else if( ProductLine2.selectedIndex == 0  )
            {
                alert("Please select a ProductLine2 in the element2");
                return false;
            }
            else if( TradeName2 == ""  )
            {
                alert("Please enter a TradeName2 in the element2");
                return false;
            }
            else if( SUExist2.selectedIndex == 0 )
            {
                alert("Please select a SUExist2 in the element2");
                return false;
            }
            //end of change by Tod Zhang on the 26/3/2008 for case 1106376-1
            else if((SUExist1.options[SUExist1.selectedIndex].text == "Yes" && SUAgiCode1 == "") ||
                    (SUExist2.options[SUExist2.selectedIndex].text == "Yes" && SUAgiCode2 == ""))             
            {
                alert("Please enter SU Agi Code if Sales Unit Exists");
                return false;
            }
            else if(LeadAI1.selectedIndex != 0 && LeadAI2.selectedIndex != 0 && LeadAI != "")
            {
                if(LeadAI1.options[LeadAI1.selectedIndex].text != LeadAI && LeadAI2.options[LeadAI2.selectedIndex].text != LeadAI)
                {
                    alert("Please select proper LeadAI as at least one Element LeadAI should be same as Combi Pack LeadAI");
                    return false;
                }
            }
         }
         if(NoOfFormulation == "3")
         {
             var Quantity31 = document.getElementById(id + "txtQuantity31");
             var Quantity32 = document.getElementById(id + "txtQuantity32");
             var Quantity33 = document.getElementById(id + "ddlQuantity33");
             var LeadAI3 = document.getElementById(id + "ddlLeadAI3");
             var Formulation3 = document.getElementById(id + "ddlFormulation3");
             var PackSize3 = document.getElementById(id + "ddlPackSize3");
             //start code change on 19th May 2008
              var IsSynBrdPack3=document.getElementById(id + "ddlIsSynBrdPack3");
             //end
             var ProductLine3 = document.getElementById(id + "ddlProductLine3");
             var TradeName3 = document.getElementById(id + "txtTradeName3").value;
             var SUExist3 = document.getElementById(id + "ddlSUExist3");
             var SUAgiCode3 = document.getElementById(id + "txtSuAgiCode3").value;
             //start of change by Tod Zhang on the 26/3/2008 for case 1106376-1
//            if(Quantity11.value == "" || Quantity12.value == "" || Quantity13.selectedIndex == 0 
//                || LeadAI1.selectedIndex == 0 || Formulation1.selectedIndex == 0 || PackSize1.selectedIndex == 0 
//                ||  ProductLine1.selectedIndex == 0 || TradeName1 == "" || SUExist1.selectedIndex == 0 
//                || Quantity21.value == "" || Quantity22.value == "" || Quantity23.selectedIndex == 0 
//                || LeadAI2.selectedIndex == 0 || Formulation2.selectedIndex == 0 || PackSize2.selectedIndex == 0 
//                ||  ProductLine2.selectedIndex == 0 || TradeName2 == "" || SUExist2.selectedIndex == 0
//                || Quantity31.value == "" || Quantity32.value == "" || Quantity33.selectedIndex == 0 
//                || LeadAI3.selectedIndex == 0 || Formulation3.selectedIndex == 0 || PackSize3.selectedIndex == 0 
//                ||  ProductLine3.selectedIndex == 0 || TradeName3 == "" || SUExist3.selectedIndex == 0)
//            {
//                alert("Please enter all the mandatory fields");
//                return false;
//            } 

            //start of change by Infosys for ERMS case
            var fillQuantity1 = document.getElementById(id + "txtFillQuantity1");
            var fillQuantity2 = document.getElementById(id + "txtFillQuantity2");
            var fillQuantity3 = document.getElementById(id + "txtFillQuantity3");
            
            
            var quantity3=trim(document.getElementById("ctl00$ermsContentPage$txtQuantity31").value); 
            
            if(quantity3!="")
            { 
             


               if(!fnValidateDecimal(quantity3))
               {
                 alert("Please enter the valid quantity for the quantity3"); 
                 document.getElementById("ctl00$ermsContentPage$txtQuantity31").value="";
                 document.getElementById("ctl00$ermsContentPage$txtQuantity31").focus();
                 return false;
               }

            }
            
            
            
            if (!fnValidateDecimal(fillQuantity1.value))
	        {
		       if(fillQuantity1.value == "")
		       {
			      fillQuantity1.value = "";
		       }
		       else
		       {
		    
			      alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the FillQuantity1");
			
			      fillQuantity1.value = "";
			      fillQuantity1.focus();
			      return false;
		       }
	        }
	        if (!fnValidateDecimal(fillQuantity2.value))
	        {
		       if(fillQuantity2.value == "")
		       {
			      fillQuantity2.value = "";
		       }
		       else
		       {
		    
			      alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the FillQuantity2");
			
			      fillQuantity2.value = "";
			      fillQuantity2.focus();
			      return false;
		       }
	        }
	        if (!fnValidateDecimal(fillQuantity3.value))
	        {
		       if(fillQuantity3.value == "")
		       {
			      fillQuantity3.value = "";
		       }
		       else
		       {
		    
			      alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the FillQuantity3");
			
			      fillQuantity3.value = "";
			      fillQuantity3.focus();
			      return false;
		       }
	        }  
            //End of change by Infosys for ERMS case
             
            //element1
            if(Quantity11.value == "")
            {
                alert("Please enter Quantity1 in the element1");
                return false;
            }
            else if(Quantity12.value == "")
            {
                alert("Please enter Quantity2 in the element1");
                return false;
            }
            else if(Quantity13.selectedIndex == 0)
            {
                alert("Please select a unit for Quantity1 in the element1");
                return false;
            }
            else if( LeadAI1.selectedIndex == 0)
            {
                alert("Please select a LeadAI in the element1");
                return false;
            }
            else if( Formulation1.selectedIndex == 0 )
            {
                alert("Please select a Formulation in the element1");
                return false;
            }
            else if( PackSize1.selectedIndex == 0  )
            {
                alert("Please select a PackSize in the element1");
                return false;
            }
            else if( IsSynBrdPack1.selectedIndex == 0  )
            {
                alert("Please select do you require Syngenta Branded pack in the element1");
                return false;
            }
            else if( ProductLine1.selectedIndex == 0  )
            {
                alert("Please select a ProductLine in the element1");
                return false;
            }
            else if( TradeName1 == ""  )
            {
                alert("Please enter a TradeName in the element1");
                return false;
            }
            else if( SUExist1.selectedIndex == 0 )
            {
                alert("Please select a SUExist in the element1");
                return false;
            }
            //element2
            else if(Quantity21.value == "")
            {
                alert("Please enter Quantity1 in the element2");
                return false;
            }
            else if(Quantity22.value == "")
            {
                alert("Please enter Quantity2 in the element2");
                return false;
            }
            else if(Quantity23.selectedIndex == 0)
            {
                alert("Please select a unit for Quantity2 in the element2");
                return false;
            }
            else if( LeadAI2.selectedIndex == 0)
            {
                alert("Please select a LeadAI2 in the element2");
                return false;
            }
            else if( Formulation2.selectedIndex == 0 )
            {
                alert("Please select a Formulation2 in the element2");
                return false;
            }
            else if( PackSize2.selectedIndex == 0  )
            {
                alert("Please select a PackSize2 in the element2");
                return false;
            }
            else if( IsSynBrdPack2.selectedIndex == 0  )
            {
                alert("Please select do you require Syngenta Branded pack in the element2");
                return false;
            }
            else if( ProductLine2.selectedIndex == 0  )
            {
                alert("Please select a ProductLine2 in the element2");
                return false;
            }
            else if( TradeName2 == ""  )
            {
                alert("Please enter a TradeName2 in the element2");
                return false;
            }
            else if( SUExist2.selectedIndex == 0 )
            {
                alert("Please select a SUExist2 in the element2");
                return false;
            }
            //element3
            else if(Quantity31.value == "")
            {
                alert("Please enter Quantity1 in the element3");
                return false;
            }
            else if(Quantity32.value == "")
            {
                alert("Please enter Quantity2 in the element3");
                return false;
            }
            else if(Quantity33.selectedIndex == 0)
            {
                alert("Please select a unit for Quantity3 in the element3");
                return false;
            }
            else if( LeadAI3.selectedIndex == 0)
            {
                alert("Please select a LeadAI3 in the element3");
                return false;
            }
            else if( Formulation3.selectedIndex == 0 )
            {
                alert("Please select a Formulation3 in the element3");
                return false;
            }
            else if( PackSize3.selectedIndex == 0  )
            {
                alert("Please select a PackSize3 in the element3");
                return false;
            }
            else if( IsSynBrdPack3.selectedIndex == 0  )
            {
                alert("Please select do you require Syngenta Branded pack in the element3");
                return false;
            }
            else if( ProductLine3.selectedIndex == 0  )
            {
                alert("Please select a ProductLine3 in the element3");
                return false;
            }
            else if( TradeName3 == ""  )
            {
                alert("Please enter a TradeName3 in the element3");
                return false;
            }
            else if( SUExist3.selectedIndex == 0 )
            {
                alert("Please select a SUExist3 in the element3");
                return false;
            }
            //end of change by Tod Zhang on the 26/3/2008 for case 1106376-1
            else if((SUExist1.options[SUExist1.selectedIndex].text == "Yes" && SUAgiCode1 == "") ||
                    (SUExist2.options[SUExist2.selectedIndex].text == "Yes" && SUAgiCode2 == "") ||
                    (SUExist3.options[SUExist3.selectedIndex].text == "Yes" && SUAgiCode3 == ""))             
            {
                alert("Please enter SU Agi Code if Sales Unit Exists");
                return false;
            }
            else if(LeadAI1.selectedIndex != 0 && LeadAI2.selectedIndex != 0 && LeadAI3.selectedIndex != 0 && LeadAI != "")
            {
                if(LeadAI1.options[LeadAI1.selectedIndex].text != LeadAI && LeadAI2.options[LeadAI2.selectedIndex].text != LeadAI && LeadAI3.options[LeadAI3.selectedIndex].text != LeadAI)
                {
                    alert("Please select proper LeadAI as at least one Element LeadAI should be same as Combi Pack LeadAI");
                    return false;
                }
            }                                       
         }        
         if(NoOfFormulation == "4")
         {
            var Quantity31 = document.getElementById(id + "txtQuantity31");
            var Quantity32 = document.getElementById(id + "txtQuantity32");
            var Quantity33 = document.getElementById(id + "ddlQuantity33");
            var LeadAI3 = document.getElementById(id + "ddlLeadAI3");
             var Formulation3 = document.getElementById(id + "ddlFormulation3");
             var PackSize3 = document.getElementById(id + "ddlPackSize3");
             //start code change on 19th May 2008
              var IsSynBrdPack3=document.getElementById(id + "ddlIsSynBrdPack3");
             //end
             var ProductLine3 = document.getElementById(id + "ddlProductLine3");
             var TradeName3 = document.getElementById(id + "txtTradeName3").value;
             var SUExist3 = document.getElementById(id + "ddlSUExist3");
             var SUAgiCode3 = document.getElementById(id + "txtSuAgiCode3").value;
             
             var Quantity41 = document.getElementById(id + "txtQuantity41");
             var Quantity42 = document.getElementById(id + "txtQuantity42");
             var Quantity43 = document.getElementById(id + "ddlQuantity43");
             var LeadAI4 = document.getElementById(id + "ddlLeadAI4");
             var Formulation4 = document.getElementById(id + "ddlFormulation4");
             var PackSize4 = document.getElementById(id + "ddlPackSize4");
             //start code change on 19th May 2008
              var IsSynBrdPack4=document.getElementById(id + "ddlIsSynBrdPack4");
             //end
             var ProductLine4 = document.getElementById(id + "ddlProductLine4");
             var TradeName4 = document.getElementById(id + "txtTradeName4").value;
             var SUExist4 = document.getElementById(id + "ddlSUExist4");
             var SUAgiCode4 = document.getElementById(id + "txtSuAgiCode4").value;
              //start of change by Tod Zhang on the 26/3/2008 for case 1106376-1
//            if(Quantity11.value == "" || Quantity12.value == "" || Quantity13.selectedIndex == 0 
//                ||LeadAI1.selectedIndex == 0 || Formulation1.selectedIndex == 0 || PackSize1.selectedIndex == 0 
//                ||  ProductLine1.selectedIndex == 0 || TradeName1 == "" || SUExist1.selectedIndex == 0 
//                || Quantity21.value == "" || Quantity22.value == "" || Quantity23.selectedIndex == 0 
//                || LeadAI2.selectedIndex == 0 || Formulation2.selectedIndex == 0 || PackSize2.selectedIndex == 0 
//                ||  ProductLine2.selectedIndex == 0 || TradeName2 == "" || SUExist2.selectedIndex == 0
//                || Quantity31.value == "" || Quantity32.value == "" || Quantity33.selectedIndex == 0 
//                || LeadAI3.selectedIndex == 0 || Formulation3.selectedIndex == 0 || PackSize3.selectedIndex == 0 
//                ||  ProductLine3.selectedIndex == 0 || TradeName3 == "" || SUExist3.selectedIndex == 0
//                || Quantity41.value == "" || Quantity42.value == "" || Quantity43.selectedIndex == 0 
//                || LeadAI4.selectedIndex == 0 || Formulation4.selectedIndex == 0 || PackSize4.selectedIndex == 0 
//                ||  ProductLine4.selectedIndex == 0 || TradeName4 == "" || SUExist4.selectedIndex == 0)
//            {
//                alert("Please enter all the mandatory fields");
//                return false;
//            } 


            //start of change by Infosys for ERMS case
            var fillQuantity1 = document.getElementById(id + "txtFillQuantity1");
            var fillQuantity2 = document.getElementById(id + "txtFillQuantity2");
            var fillQuantity3 = document.getElementById(id + "txtFillQuantity3");
            var fillQuantity4 = document.getElementById(id + "txtFillQuantity4");
            
            var quantity3=trim(document.getElementById("ctl00$ermsContentPage$txtQuantity31").value); 
            
            if(quantity3!="")
            { 
              

               if(!fnValidateDecimal(quantity3))
               {
                 alert("Please enter the valid quantity for the quantity3"); 
                 document.getElementById("ctl00$ermsContentPage$txtQuantity31").value="";
                 document.getElementById("ctl00$ermsContentPage$txtQuantity31").focus();
                 return false;
               }

            }
            
            var quantity4=trim(document.getElementById("ctl00$ermsContentPage$txtQuantity41").value); 
            
            if(quantity4!="")
            { 
              
               if(!fnValidateDecimal(quantity4))
               {
                 alert("Please enter the valid quantity for the quantity4"); 
                 document.getElementById("ctl00$ermsContentPage$txtQuantity41").value="";
                 document.getElementById("ctl00$ermsContentPage$txtQuantity41").focus();
                 return false;
               }

            }
            
            
            if (!fnValidateDecimal(fillQuantity1.value))
	        {
		       if(fillQuantity1.value == "")
		       {
			      fillQuantity1.value = "";
		       }
		       else
		       {
		    
			      alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the FillQuantity1");
			
			      fillQuantity1.value = "";
			      fillQuantity1.focus();
			      return false;
		       }
	        }
	        if (!fnValidateDecimal(fillQuantity2.value))
	        {
		       if(fillQuantity2.value == "")
		       {
			      fillQuantity2.value = "";
		       }
		       else
		       {
		    
			      alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the FillQuantity2");
			
			      fillQuantity2.value = "";
			      fillQuantity2.focus();
			      return false;
		       }
	        }
	        if (!fnValidateDecimal(fillQuantity3.value))
	        {
		       if(fillQuantity3.value == "")
		       {
			      fillQuantity3.value = "";
		       }
		       else
		       {
		    
			      alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the FillQuantity3");
			
			      fillQuantity3.value = "";
			      fillQuantity3.focus();
			      return false;
		       }
	        }
	        if (!fnValidateDecimal(fillQuantity4.value))
	        {
		       if(fillQuantity4.value == "")
		       {
			      fillQuantity4.value = "";
		       }
		       else
		       {
		    
			      alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the FillQuantity4");
			
			      fillQuantity4.value = "";
			      fillQuantity4.focus();
			      return false;
		       }
	        }    
            //End of change by Infosys for ERMS case

            //element1
            if(Quantity11.value == "")
            {
                alert("Please enter Quantity1 in the element1");
                return false;
            }
            else if(Quantity12.value == "")
            {
                alert("Please enter Quantity2 in the element1");
                return false;
            }
            else if(Quantity13.selectedIndex == 0)
            {
                alert("Please select a unit for Quantity1 in the element1");
                return false;
            }
            else if( LeadAI1.selectedIndex == 0)
            {
                alert("Please select a LeadAI in the element1");
                return false;
            }
            else if( Formulation1.selectedIndex == 0 )
            {
                alert("Please select a Formulation in the element1");
                return false;
            }
            else if( PackSize1.selectedIndex == 0  )
            {
                alert("Please select a PackSize in the element1");
                return false;
            }
            else if( IsSynBrdPack1.selectedIndex == 0  )
            {
                alert("Please select do you require Syngenta Branded pack in the element1");
                return false;
            }
            else if( ProductLine1.selectedIndex == 0  )
            {
                alert("Please select a ProductLine in the element1");
                return false;
            }
            else if( TradeName1 == ""  )
            {
                alert("Please enter a TradeName in the element1");
                return false;
            }
            else if( SUExist1.selectedIndex == 0 )
            {
                alert("Please select a SUExist in the element1");
                return false;
            }
            //element2
            else if(Quantity21.value == "")
            {
                alert("Please enter Quantity1 in the element2");
                return false;
            }
            else if(Quantity22.value == "")
            {
                alert("Please enter Quantity2 in the element2");
                return false;
            }
            else if(Quantity23.selectedIndex == 0)
            {
                alert("Please select a unit for Quantity2 in the element2");
                return false;
            }
            else if( LeadAI2.selectedIndex == 0)
            {
                alert("Please select a LeadAI2 in the element2");
                return false;
            }
            else if( Formulation2.selectedIndex == 0 )
            {
                alert("Please select a Formulation2 in the element2");
                return false;
            }
            else if( PackSize2.selectedIndex == 0  )
            {
                alert("Please select a PackSize2 in the element2");
                return false;
            }
            else if( IsSynBrdPack2.selectedIndex == 0  )
            {
                alert("Please select do you require Syngenta Branded pack in the element2");
                return false;
            }
            else if( ProductLine2.selectedIndex == 0  )
            {
                alert("Please select a ProductLine2 in the element2");
                return false;
            }
            else if( TradeName2 == ""  )
            {
                alert("Please enter a TradeName2 in the element2");
                return false;
            }
            else if( SUExist2.selectedIndex == 0 )
            {
                alert("Please select a SUExist2 in the element2");
                return false;
            }
            //element3
            else if(Quantity31.value == "")
            {
                alert("Please enter Quantity1 in the element3");
                return false;
            }
            else if(Quantity32.value == "")
            {
                alert("Please enter Quantity2 in the element3");
                return false;
            }
            else if(Quantity33.selectedIndex == 0)
            {
                alert("Please select a unit for Quantity3 in the element3");
                return false;
            }
            else if( LeadAI3.selectedIndex == 0)
            {
                alert("Please select a LeadAI3 in the element3");
                return false;
            }
            else if( Formulation3.selectedIndex == 0 )
            {
                alert("Please select a Formulation3 in the element3");
                return false;
            }
            else if( PackSize3.selectedIndex == 0  )
            {
                alert("Please select a PackSize3 in the element3");
                return false;
            }
            else if( IsSynBrdPack3.selectedIndex == 0  )
            {
                alert("Please select do you require Syngenta Branded pack in the element3");
                return false;
            }
            else if( ProductLine3.selectedIndex == 0  )
            {
                alert("Please select a ProductLine3 in the element3");
                return false;
            }
            else if( TradeName3 == ""  )
            {
                alert("Please enter a TradeName3 in the element3");
                return false;
            }
            else if( SUExist3.selectedIndex == 0 )
            {
                alert("Please select a SUExist3 in the element3");
                return false;
            }
            //element4
            else if(Quantity41.value == "")
            {
                alert("Please enter Quantity1 in the element4");
                return false;
            }
            else if(Quantity42.value == "")
            {
                alert("Please enter Quantity2 in the element4");
                return false;
            }
            else if(Quantity43.selectedIndex == 0)
            {
                alert("Please select a unit for Quantity4 in the element4");
                return false;
            }
            else if( LeadAI4.selectedIndex == 0)
            {
                alert("Please select a LeadAI4 in the element4");
                return false;
            }
            else if( Formulation4.selectedIndex == 0 )
            {
                alert("Please select a Formulation4 in the element4");
                return false;
            }
            else if( PackSize4.selectedIndex == 0  )
            {
                alert("Please select a PackSize4 in the element4");
                return false;
            }
            else if( IsSynBrdPack4.selectedIndex == 0  )
            {
                alert("Please select do you require Syngenta Branded pack in the element4");
                return false;
            }
            else if( ProductLine4.selectedIndex == 0  )
            {
                alert("Please select a ProductLine4 in the element4");
                return false;
            }
            else if( TradeName4 == ""  )
            {
                alert("Please enter a TradeName4 in the element4");
                return false;
            }
            else if( SUExist4.selectedIndex == 0 )
            {
                alert("Please select a SUExist4 in the element4");
                return false;
            }
             //end of change by Tod Zhang on the 26/3/2008 for case 1106376-1
            else if((SUExist1.options[SUExist1.selectedIndex].text == "Yes" && SUAgiCode1 == "") ||
                    (SUExist2.options[SUExist2.selectedIndex].text == "Yes" && SUAgiCode2 == "") ||
                    (SUExist3.options[SUExist3.selectedIndex].text == "Yes" && SUAgiCode3 == "") ||
                    (SUExist4.options[SUExist4.selectedIndex].text == "Yes" && SUAgiCode4 == ""))             
            {
                alert("Please enter SU Agi Code if Sales Unit Exists");
                return false;
            } 
            else if(LeadAI1.selectedIndex != 0 && LeadAI2.selectedIndex != 0 && LeadAI3.selectedIndex != 0 && LeadAI4.selectedIndex != 0 && LeadAI != "")
            {
                if(LeadAI1.options[LeadAI1.selectedIndex].text != LeadAI && LeadAI2.options[LeadAI2.selectedIndex].text != LeadAI && 
                    LeadAI3.options[LeadAI3.selectedIndex].text != LeadAI && LeadAI4.options[LeadAI4.selectedIndex].text != LeadAI)
                {
                    alert("Please select proper LeadAI as at least one Element LeadAI should be same as Combi Pack LeadAI");
                    return false;
                }
            }               
         }   
     }    
}

//function fnCheckMandatoryFields()
//{
//    //debugger;
//    var LastIndex = document.activeElement.id.lastIndexOf('_');
//    var id = document.activeElement.id.substring(0,LastIndex+1);
//    
//     var NoOfFormulation = document.getElementById(id + "lblNoOfFormulation").innerText;    
//     var SUExist1 = document.getElementById(id + "ddlSUExist1");
//     var SUAgiCode1 = document.getElementById(id + "txtSuAgiCode1").value;

//     var SUExist2 = document.getElementById(id + "ddlSUExist2");
//     var SUAgiCode2 = document.getElementById(id + "txtSuAgiCode2").value;
//     

//        if(SUExist1.options[SUExist1.selectedIndex].text == "Yes" && SUAgiCode1 == "")                             
//        {
//            alert("Please enter SU Agi Code for Element1");
//            return false;
//        }
//        if(SUExist2.options[SUExist2.selectedIndex].text == "Yes" && SUAgiCode2 == "")             
//        {
//            alert("Please enter SU Agi Code for Element2");
//            return false;
//        }

//        if(NoOfFormulation == "3")
//        {
//             var SUExist3 = document.getElementById(id + "ddlSUExist3");
//             var SUAgiCode3 = document.getElementById(id + "txtSuAgiCode3").value;

//             if(SUExist3.options[SUExist3.selectedIndex].text == "Yes" && SUAgiCode3 == "")                             
//             {
//                alert("Please enter SU Agi Code for Element3");
//                return false;
//             }
//        }
//        
//         if(NoOfFormulation == "4")
//        {
//             var SUExist3 = document.getElementById(id + "ddlSUExist3");
//             var SUAgiCode3 = document.getElementById(id + "txtSuAgiCode3").value;
//             
//             var SUExist4 = document.getElementById(id + "ddlSUExist4");
//             var SUAgiCode4 = document.getElementById(id + "txtSuAgiCode4").value;

//             if(SUExist3.options[SUExist3.selectedIndex].text == "Yes" && SUAgiCode3 == "")                             
//             {
//                alert("Please enter SU Agi Code for Element3");
//                return false;
//             }
//             if(SUExist4.options[SUExist4.selectedIndex].text == "Yes" && SUAgiCode4 == "")                             
//             {
//                alert("Please enter SU Agi Code for Element4");
//                return false;
//             }
//        }
//  }


/*******************************************************************************************************************
For Validating SCP Screen
******************************************************************************************************************/
function fnControlFFPHubControls()
{
    var rdButtonGSAP = document.getElementById("ctl00_ermsContentPageHeader_rdbCodeSetUp_0" );
    var rdButtonERP = document.getElementById("ctl00_ermsContentPageHeader_rdbCodeSetUp_1");
    var ddlSAPPlant = document.getElementById("ctl00_ermsContentPageHeader_ddlSAPCode");
    var ddlProcurement = document.getElementById("ctl00_ermsContentPageHeader_ddlProcType");
    var txtMRPContName = document.getElementById("ctl00_ermsContentPageHeader_txtMRPControllerName");
    var txtMRPContCode = document.getElementById("ctl00_ermsContentPageHeader_txtMRPControllerCode" );
    var rdPlanInAPO = document.getElementById("ctl00_ermsContentPageHeader_rdbReleventForAPO_1");
    var ddlSupplyResponse = document.getElementById("ctl00_ermsContentPageHeader_lblSupplyResponse");
    var ddlMakeToOrder = document.getElementById("ctl00_ermsContentPageHeader_lblMakeToOrder");
    
    if( rdButtonGSAP.checked == true && rdButtonERP.checked == false)
    {
        ddlProcurement.disabled=false;
        txtMRPContName.disabled = false;
        txtMRPContCode.disabled=false;
        rdPlanInAPO.parentNode.disabled=false;
        ddlSupplyResponse.disaled = false;
        ddlMakeToOrder.disabled = false;
        
    }
    
    
    if( rdButtonGSAP.checked == false && rdButtonERP.checked == true)
    {
        ddlProcurement.disabled=true;
        txtMRPContName.disabled = true;
        txtMRPContCode.disabled=true;
        rdPlanInAPO.parentNode.disabled=true;
        ddlSupplyResponse.disaled = true;
        ddlMakeToOrder.disabled = true;
        
    }
    
}

/**********************************************************************************************************
Function to Validate Mandatory Fields in Other Range Request Screen
***********************************************************************************************************/

function fnValidateOtherRequest()
{
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
            var LastIndex = document.activeElement.id.lastIndexOf('_');
            var id = document.activeElement.id.substring(0,LastIndex+1);
            var leadAI = id + "txtLeadAI";
            var country = id + "ddlCountryOfSale";
            var countryPresCode = id  + "txtCountryPresCode";
          
            if(document.getElementById(leadAI).value == "")
            {
                alert("Please give Lead AI value");
               return false;
           }
           
           if(document.getElementById(country).selectedIndex == 0)
           {
                alert("Please Select a value for Country");
               return false;
           }
           
           if(document.getElementById(countryPresCode).value == "")
           {
                alert("Please give Country Pres Code");
                return false;
           }
           //start of change by Infosys for erms case 1157496
           if(document.getElementById("ctl00$ermsContentPageHeader$txtComments").value.length <= 1000)
	             return true;
	       else 
	       {
	           alert("Maximum 1000 letters in the field Comment");
	          return false;
	       }
	       //end of change by Infosys  
        }
    }                   
}
//for save
function fnOtherRequestSaveMandatory()
{
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
            var LastIndex = document.activeElement.id.lastIndexOf('_');
            var id = document.activeElement.id.substring(0,LastIndex+1);
            var leadAI = id + "txtLeadAI";
            
            if(document.getElementById(leadAI).value == "")
            {
                alert("Please give Lead AI value");
               return false;
            }
            if(document.getElementById("ctl00$ermsContentPageHeader$txtComments").value.length <= 1000)
	             return true;
	        else 
	        {
	            alert("Maximum 1000 letters in the field Comment");
	           return false;
	        }		 
        }           
    }   
}
/**********************************************************************************************************
Function to Validate Mandatory Fields in Fast Screen for New Pack
***********************************************************************************************************/

function fnValidateFastScreen()
{
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
            var LastIndex = document.activeElement.id.lastIndexOf('_');
            var id = document.activeElement.id.substring(0,LastIndex+1);
            var requestApproved = id + "ddlRequestApproved";
            var confirmSource = id + "ddlConfirmSource";
            var sourceplant=id + "txtSourcePlant";
            if(document.getElementById(requestApproved).selectedIndex == 0)
            {
                alert("Please Select a value for Request Appoved");
               return false;
            }
           
           if(document.getElementById(confirmSource).selectedIndex == 0 && document.getElementById(requestApproved).selectedIndex == 1)
           {
                alert("Please Select a value for Confirm Source");
               return false;
           }
           if(document.getElementById(sourceplant).value == "" && document.getElementById(requestApproved).selectedIndex == 1)
           {
                alert("Please provide Source Plant details.");
                document.getElementById(sourceplant).focus();
               return false;
           }
        }
    }                   
}


/**********************************************************************************************************
Function to Validate Mandatory Fields in RDM Screen for New Pack
***********************************************************************************************************/
/*start of change by Tod Zhang on January 17 2008*/
 
//Start of change by Tod Zhang for ERMS issue
function clearDatePUofSU()
{
    document.getElementById("ctl00$ermsContentPageHeader$txtDtPUtoSU").value="";
    document.getElementById("ctl00_ermsContentPageHeader_hdnPUDate").value="";
}
//End of change by Tod Zhang for ERMS issue
                        
function fnValidateRDMScreen(length,requestType,SUPUNUCode )
{
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
            var LastIndex = document.activeElement.id.lastIndexOf('_');
            var id = document.activeElement.id.substring(0,LastIndex+1);
           
            var SUPUNSU = id + "ddlSUorPUorNSU";
            var ddlMoreData = id + "ddlMoreDataReqReason";
            var moreDataYes = id + "rdbMoreDataReqYes";
            var moreDataNo = id + "rdbMoreDataReqNo";
            var AgiCode = id + "txtAgiCode";
            var MoreDataContact= id + "txtMoreDataRequiredContact";
            
            //start of change by Tod Zhang on 24/1/2007
            var DtCodeRaised=id+"txtDtCodeRaised";
            var DtPUtoSU=id+"txtDtPUtoSU";
            //end of change by Tod Zhang on 24/1/2007
            
            //start of change on 21/1/2009
            var PUSubDate = id + "hdnPUSubDate";
            //end of change on 21/1/2009
          /*
          if(requestType=="1" ||  requestType=="2" || requestType=="8")
          {
            
            var time=trim(document.getElementById("ctl00$ermsContentPageHeader$txtDtPUtoSU").value); 
            time=time.replace("/","-");
            time=time.replace("/","-");
            if(time!="")
            { 
               var re2_1 = /^\d{2}-\d{2}-\d{4}$/;
               var re2_2 = /^\d{1}-\d{1}-\d{4}$/;
               var re2_3 = /^\d{2}-\d{1}-\d{4}$/;
               var re2_4 = /^\d{1}-\d{2}-\d{4}$/;

               if(!re2_1.test(time) && !re2_1.test(time)
               && !re2_3.test(time) && !re2_4.test(time)
               ){
                 alert("Please enter the valid quantity for the Date of PU promoted to SU, such as:dd-mm-yyyy or dd/mm/yyyy"); 
                 document.getElementById("ctl00$ermsContentPageHeader$txtDtPUtoSU").value="";
                 document.getElementById("ctl00$ermsContentPageHeader$txtDtPUtoSU").focus();
                 return false;
               }

            }
          }
          */
            
            if(document.getElementById(moreDataYes).checked == false && document.getElementById(moreDataNo).checked == true)
            {
               
                //start of change by Tod Zhang on 29/1/2008
                /*
                if(document.getElementById(SUPUNSU).selectedIndex == 0)
                {
                    alert("Please select a value for SU or PU or NSU ");
                   return false;
                }
                else
                {
                    if(requestType=="1" ||  requestType=="2" || requestType=="8")
                    if(document.getElementById(DtPUtoSU).value == "" && document.getElementById(SUPUNSU).value == "5")
                    {
                         alert("Please provide Date of PU promoted to SU");
                        return false;
                    }
                }
                if(document.getElementById(AgiCode).value == "")
                {
                    alert("Please provide Agi Code");
                   return false;
                }
                else
                {
                    if(document.getElementById(DtCodeRaised).value == "")
                    {
                        alert("Please provide Date Code Raised");
                        return false;
                    }
                    
                }
                */
                if(document.getElementById(SUPUNSU).selectedIndex != 0)
                {                 
                    if(document.getElementById(SUPUNSU).options[document.getElementById(SUPUNSU).selectedIndex].value=="5")
                    {
                       if(document.getElementById(AgiCode).value == "")
                       {
                            alert("Please enter 'Agi Code'");
                           return false;
                       }
                       if(document.getElementById(DtCodeRaised).value == "")
                       {
                            alert("Please enter 'Date Code Raised'");
                           return false;
                       }
                       if(requestType=="1" ||  requestType=="2" || requestType=="8")
                       if(document.getElementById(DtPUtoSU).value == "" && document.getElementById(SUPUNSU).options[document.getElementById(SUPUNSU).selectedIndex].value=="5" )
                       {
                            alert("Please enter 'Date of PU promoted to SU'");
                           return false;
                       }
                    }
                    
                    if(document.getElementById(SUPUNSU).options[document.getElementById(SUPUNSU).selectedIndex].value=="5")
                    {
                       if(document.getElementById(AgiCode).value == "")
                       {
                            alert("Please enter 'Agi Code'");
                           return false;
                       }
                       if(document.getElementById(DtCodeRaised).value == "")
                       {
                            alert("Please enter 'Date Code Raised'");
                           return false;
                       }
                    }
                    
                    if(document.getElementById(SUPUNSU).options[document.getElementById(SUPUNSU).selectedIndex].value=="33")
                    {
                       if(document.getElementById(AgiCode).value == "")
                       {
                            alert("Please enter 'Agi Code'");
                           return false;
                       }
                       if(document.getElementById(DtCodeRaised).value == "")
                       {
                            alert("Please enter 'Date Code Raised'");
                           return false;
                       }
                    }
                }
                if(document.getElementById(SUPUNSU).selectedIndex == 0)
                {
                     alert("Please choose code in the 'SU or PU or NSU*'");
                         return false;
                }
                
                if(document.getElementById(AgiCode).value == "")
                {
                     alert("Please enter 'Agi Code'");
                         return false;
                }
                                       
                if(document.getElementById(DtCodeRaised).value == "")
                {
                     alert("Please enter 'Date Code Raised'");
                         return false;
                }
                
                if(requestType=="1" ||  requestType=="2" || requestType=="8")
                  if(document.getElementById(DtPUtoSU).value != ""&& document.getElementById(SUPUNSU).options[document.getElementById(SUPUNSU).selectedIndex].value!="5" )
                {
                       alert("Please choose SU in the 'SU or PU or NSU*'");
                       return false;
                }
                //end of change by Tod Zhang on 29/1/2008
            }
            if(document.getElementById(moreDataYes).checked == true && document.getElementById(moreDataNo).checked == false)
            {
                if(document.getElementById(ddlMoreData).selectedIndex == 0)
                {   
                   alert("Please Select a value for More Data Required Reason ");
                   return false;
                }
                if(trimAll(document.getElementById(MoreDataContact).value) == "")
                {   
                   alert("Please enter 'More Data Required Contact' ");
                   return false;
                }
            }
            if(document.getElementById("ctl00$ermsContentPageHeader$txtEDMComments").value.length > length)
            {
	            alert("Maximum "+length+" letters in the field RDM Comments");
	            return false;
	        }
	        //Start of change on 21/1/2009
	        //check 'SU/PU/NSU' field, if PU code has been raised, a warning message will display
            if(document.getElementById(PUSubDate).value != null && document.getElementById(PUSubDate).value != "" && document.getElementById(SUPUNSU).selectedIndex == 2 && document.getElementById(SUPUNSU).selectedIndex && document.getElementById(moreDataYes).checked == false)
            {
                alert("PU code has been raised.");
                return false;
            }
            //End of change on 21/1/2009
         }         
    }    
}
/*end of change*/

/*****************************************************************************************************************
Function to Enable/Disable 
******************************************************************************************************************/
function fnControlSourceDetails()
{
    var LastIndex = document.activeElement.id.lastIndexOf('_');
    var id = document.activeElement.id.substring(0,LastIndex+1);
    var No = id + "rdSourceNo";
    var txt = id + "txtSourceDetails";
    if (No.checked == true)
    {
        txt.disabled=true;
    }
    else
    {
        txt.disabled=false;
    }
    
}

/**********************************************************************************************************
Function to Validate Mandatory Fields in New Pack Request/ Country Add and CombiChild
***********************************************************************************************************/

function fnValidateNewPackReqScreen(requestType, DateFirstSale, isSubmit, isChild)
{
    //debugger;
     if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {       
            var LastIndex = document.activeElement.id.lastIndexOf('_');
            var id = document.activeElement.id.substring(0,LastIndex+1);
            var leadAI = id + "ddlLeadAI";
            var newLeadAI = id + "txtLeadAI";
            var designCode = id + "txtDesignCode";
            var UCAGICode = id + "txtUCAgiCode";
            var qty = id + "txtQtyOrPackSize";
            var configuration = id + "txtConfig";
            var UoM = id + "ddlUoM";
            var PLS = id + "ddlProductLineSeller";
            var tradeName = id + "txtTradeName";
            var country  = id + "ddlCountryOfSale";
            var countryPresCode = id + "txtCountryPresCode";
            var localSourceYes = id + "rdSourceYes";
            var localSourceNo = id + "rdSourceNo";
            var firstSaleDate = id + "txtFirstSale";
            var regContact = id + "txtRegContactName";
            var gridYr = id + "gvYear";
            var productCategory = id + "ddlProductCategory";
            var leadAIlbl = id + "lblLeadAI";
            var designCodelbl = id + "lblDesignCode";
            var UCAGICodelbl = id + "lblUCAgiCode";
            var AncYNddl = id + "ddlAncillariesYesNo";
            var AncTxtArea = id + "txtAncillariesComments";
            //start code change by srikanth aluri ono 15th May
            var MakeToOrder=id+"ddlMakeToOrder";
            //end
               
            // For New Pack
            if(requestType == 2 && isChild != 1)
             {
                var IsSynPack =id+"ddlIsSynBrdPackReq";
                if(document.getElementById(newLeadAI))
                {
                    if(document.getElementById(leadAI))
                    {                        
                    }
                    else                    
                    {    
                        if(document.getElementById(newLeadAI).value == "")
                        {                    
                            alert("Please give Lead AI Details ");
                            return false; 
                        }                          
                    }
                }
                
                if(document.getElementById(leadAI))
                {
                if(document.getElementById(leadAI).selectedIndex == 0)
                {
                    if (document.getElementById(newLeadAI).value == "")
                    {
                        alert("Please give Lead AI Details ");
                        return false;
                    }
                               
                }
                }
                     
                if(document.getElementById(designCode))
                {
                if (document.getElementById(designCode).value == "")
                    {
                        alert("Please give Design Code Details ");
                        return false;
                    }
                }
                
                if(document.getElementById(UCAGICode))
                {
                if (document.getElementById(UCAGICode).value == "")
                    {
                        alert("Please give UC AGI Code Details ");
                        return false;
                    }
                }
                    
                if (document.getElementById(qty).value == "")
                {
                    alert("Please give Quantity Details ");
                    return false;
                }
               
                if (document.getElementById(configuration).value == "")
                {
                    alert("Please give Configuration/Collation Details ");
                    return false;
                }
                
                if (document.getElementById(UoM).selectedIndex == 0)
                {
                    alert("Please select a UOM value ");
                    return false;
                }
                 if (document.getElementById(IsSynPack).selectedIndex == 0)
                {
                    alert("Please select do you require Syngenta branded pack value");
                    return false;
                }
                if (document.getElementById(MakeToOrder).selectedIndex == 0)
                {
                    alert("Please select Make To Order value ");
                    return false;
                }
                             
                if (document.getElementById(PLS).selectedIndex == 0)
                {
                    alert("Please select a Product Line Seller value ");
                    return false;
                }
                
                 if (document.getElementById(localSourceYes).checked == false)
                {
                    if (document.getElementById(localSourceNo).checked == false)
                    {
                        alert("Please Sourcing Details ");
                        return false;
                    }    
                }
                
                  
                if (document.getElementById(tradeName).value == "")
                {
                    alert("Please give Trade Name Details ");
                    return false;
                }
                
                if (document.getElementById(country).selectedIndex == 0)
                {
                    alert("Please select a Country of Sale value ");
                    return false;
                }
                
                if (document.getElementById(countryPresCode).value == "")
                {
                    alert("Please give Country Presentation Code Details ");
                    return false;
                }
                
               
                
                if (document.getElementById(firstSaleDate).value == "")
                {
                    alert("Please give First Sale Date Details ");
                    return false;
                }
                
               
                
                if(document.getElementById(gridYr).rows[1].childNodes[1].firstChild.value == "" || 
                   document.getElementById(gridYr).rows[1].childNodes[2].firstChild.value == "" ||
                   document.getElementById(gridYr).rows[1].childNodes[3].firstChild.value == "" )        
                {
                    alert("Please give Sales Price Details ");
                    return false;
                }
                    
                if(document.getElementById(gridYr).rows[2].childNodes[1].firstChild.value == "" ||
                   document.getElementById(gridYr).rows[2].childNodes[2].firstChild.value == "" ||
                   document.getElementById(gridYr).rows[2].childNodes[3].firstChild.value == "" )
                {
                    alert("Please give Sales Volume Details ");
                    return false;
                }
                
                      
                 if (document.getElementById(productCategory).selectedIndex == 0)
                {
                    alert("Please give Product Category Details ");
                    return false;
                }
                      
                if (document.getElementById(regContact).value == "" || document.getElementById(regContact).value == " ")
                {
                    alert("Please give Regulatory Contact Details ");
                    return false;
                }    
                    
               if(isSubmit!=0)
               {
                    
                    var num=document.getElementById(firstSaleDate).value;
                    var arr=num.split("/");
                    var end = arr[1]+"/"+arr[0]+"/"+arr[2];
                    var date=CompareDate(end,DateFirstSale);
                     if(date==false)
                    {
                           if(confirm("Date of first sale is too early,Do you want to procced?"))
                           {
                             return true;
                           }
                           else
                           {
                             return false;
                           }
                     }
                       
               }
               
               if(document.getElementById("ctl00$ermsContentPageHeader$txtMarketing")==null&&document.getElementById("ctl00$ermsContentPageHeader$txtSupliers")==null)
               {
	              return true;
               }
               else
               {
                  if(document.getElementById("ctl00$ermsContentPageHeader$txtMarketing").value.length <= 1000)
	                if(document.getElementById("ctl00$ermsContentPageHeader$txtSupliers").value.length <= 100)
	                   return true;
	                else 
	                {
	                   alert("Maximum 100 letters in the field Supllier");
	                    return false;
	                }		 
	             else
	             {
	                    alert("Maximum 1000 letters in the field Marketing");
	                     return false;
	              }
               }
             }
                
             // For COuntry Add Request
             if(requestType == 3 && isChild != 1)
             {
                if(document.getElementById(newLeadAI))
                {
                    if(document.getElementById(leadAI))
                    {                        
                    }
                    else                    
                    {    
                        if(document.getElementById(newLeadAI).value == "")
                        {                    
                            alert("Please give Lead AI Details ");
                            return false; 
                        }                          
                    }
                }
                if (document.getElementById(MakeToOrder).selectedIndex == 0)
                {
                    alert("Please select a Make To Order value ");
                    return false;
                }
                if (document.getElementById(tradeName).value == "")
                {
                    alert("Please give Trade Name Details ");
                    return false;
                }
                
                if (document.getElementById(country).selectedIndex == 0)
                {
                    alert("Please select a Country of Sale value ");
                    return false;
                }
                
                if (document.getElementById(countryPresCode).value == "")
                {
                    alert("Please give Country Presentation Code Details ");
                    return false;
                }
                
                if (document.getElementById(PLS).selectedIndex == 0)
                {
                    alert("Please select a Product Line Seller value ");
                    return false;
                }
                
                if (document.getElementById(firstSaleDate).value == "")
                {
                    alert("Please give First Sale Date Details ");
                    return false;
                }
                
                if(document.getElementById(gridYr).rows[1].childNodes[1].firstChild.value == "" || 
                   document.getElementById(gridYr).rows[1].childNodes[2].firstChild.value == "" ||
                   document.getElementById(gridYr).rows[1].childNodes[3].firstChild.value == "" )        
                {
                    alert("Please give Sales Price Details ");
                    return false;
                }
                    
                if(document.getElementById(gridYr).rows[2].childNodes[1].firstChild.value == "" ||
                   document.getElementById(gridYr).rows[2].childNodes[2].firstChild.value == "" ||
                   document.getElementById(gridYr).rows[2].childNodes[3].firstChild.value == "" )
                {
                    alert("Please give Sales Volume Details ");
                    return false;
                }
                
                      
                 if (document.getElementById(productCategory).selectedIndex == 0)
                {
                    alert("Please give Product Category Details ");
                    return false;
                }
                if (document.getElementById(regContact).value == "" || document.getElementById(regContact).value == " ")
                {
                    alert("Please give Regulatory Contact Details ");
                    return false;
                }

                if ((document.getElementById(AncYNddl).selectedIndex == 1) && (document.getElementById(AncTxtArea).Value == "") )
                {
                    alert("Please provide additional ancillary details.");
                    return false;
                }
                
               if(isSubmit!=0)
               {
                    
                    var num=document.getElementById(firstSaleDate).value;
                    var arr=num.split("/");
                    var end = arr[1]+"/"+arr[0]+"/"+arr[2];
                    var date=CompareDate(end,DateFirstSale);
                     if(date==false)
                    {
                           if(confirm("Date of first sale is too early,Do you want to procced?"))
                           {
                             return true;
                           }
                           else
                           {
                             return false;
                           }
                     }
                       
               }
               
               if(document.getElementById("ctl00$ermsContentPageHeader$txtMarketing").value.length > 1000)
               {
	                 alert("Maximum 1000 letters in the field Marketing");
	                 return false;
	           }
             }
             
             // For CombiPack Child
             if(isChild == 1 )
             {
                 if (document.getElementById(newLeadAI).value == "")
                    {
                        alert("Please give Lead AI Details ");
                        return false;
                    }
                 if (document.getElementById(designCode).value == "")
                    {
                        alert("Please give Design Code Details ");
                        return false;
                    }
                
                if (document.getElementById(UCAGICode).value == "")
                    {
                        alert("Please give UC AGI Code Details ");
                        return false;
                    }
                    
                if (document.getElementById(qty).value == "")
                {
                    alert("Please give Quantity Details ");
                    return false;
                }
               
                if (document.getElementById(configuration).value == "")
                {
                    alert("Please give Configuration/Collation Details ");
                    return false;
                }
                
                if (document.getElementById(UoM).selectedIndex == 0)
                {
                    alert("Please select a UOM value ");
                    return false;
                }
                //start change on 30th May for req no:12
                var IsSynPack =id+"ddlIsSynBrdPackReq";
                  if (document.getElementById(IsSynPack).selectedIndex == 0)
                  {
                     alert("Please select do you require Syngenta branded pack value");
                     return false;
                  }
                 //end
                
                if (document.getElementById(PLS).selectedIndex == 0)
                {
                    alert("Please select a Product Line Seller value ");
                    return false;
                }
                
                 if (document.getElementById(localSourceYes).checked == false)
                {
                    if (document.getElementById(localSourceNo).checked == false)
                    {
                        alert("Please Sourcing Details ");
                        return false;
                    }    
                }
                
                  
                if (document.getElementById(tradeName).value == "")
                {
                    alert("Please give Trade Name Details ");
                    return false;
                }
                
                if (document.getElementById(country).selectedIndex == 0)
                {
                    alert("Please select a Country of Sale value ");
                    return false;
                }
                
                if (document.getElementById(countryPresCode).value == "")
                {
                    alert("Please give Country Presentation Code Details ");
                    return false;
                }   
                    
             }
        }
    }
}

/*********************************************************************************************************************
Function to check Numbers
*********************************************************************************************************************/
function isNumber(s)
{   
 var i; 
  for (i = 0; i < s.length; i++) 
  { 
	// Check that current character is number. 
       var c = s.charAt(i); 
       if (((c < "0") || (c > "9"))) 
			return false; 
  }
 // All characters are numbers. 
 return true;
 } 

/*********************************************************************************************************************
Function to validate Date First Sale
*********************************************************************************************************************/
function fnValidateDateFirstSale(Date)
{
            var num=document.getElementById(firstSaleDate).value;
            var arr=num.split("/");
            var end = arr[1]+"/"+arr[0]+"/"+arr[2];
            var date=CompareDate(end,DateFirstSale);
            if(date==false)
            {
                alert("Date of first sale is too early");
                return false;
            }
}            


/**********************************************************************************************************
Function to Validate Mandatory Fields in SCP_EPT Screen 
***********************************************************************************************************/

function fnValidateSCPScreen()
{
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
            if(document.activeElement.id)
            {
                 if(document.getElementById(document.activeElement.id).disabled == false)
                 {
                    var LastIndex = document.activeElement.id.lastIndexOf('_');
                    var id = document.activeElement.id.substring(0,LastIndex+1);
                    var ffpOutsideEAME = id + "ddlFFP";
                    var ffpCodeSetupGSAP = id + "rdbCodeSetUpGSAP";
                    var ffpCodeSetupERP = id + "rdbCodeSetUpERP";
                    var sapPlantCode = id + "ddlSAPCode";
                    var procurementType = id + "ddlProcType";
                    var ffpMRPControllerName = id + "txtMRPControllerName";
                    var ffpMRPControllerCode = id + "txtMRPControllerCode";
                    var plannedInAPOYes = id + "rdbReleventForAPOYes";
                    var plannedInAPONo = id + "rdbReleventForAPONo";
                    var supplyResponse  = id + "ddlSupplyResponse";
                    var makeToOrder = id + "ddlMakeToOrder"; 
                    var hubPlantCode = id + "ddlGSAPPlantCode";
                    var purchaseNumber1 = id + "txtPurchaseNumber";
                    var purchaseNumber2 = id + "txt2ndPurchaseNumber";
                    var hubPlantCode2 = id + "ddl2ndGSAPPlantCode";
                    var supplyPlant2 = id + "txt2ndSupplyPlant";
                    var MRPName2 = id + "txt2ndMRPControllerName";
                    var MRPCode2 = id + "txt2ndMRPControllercode";
                    var supplyPlant1 = id + "txtSupplyPlant";
                    var MRPName1 = id + "txtHubMRPControllerName";
                    var MRPCode1 = id + "txtHubMRPControllerCode";
                    var SCPComments = id + "txtSCPComments";
                    
                    var LateLabeling = id + "ddlLL";
                    var LLPlantCode = id + "ddlLLSAPCode";
                    var LLprocurementType = id + "ddlLLProcType";
                    var LLMRPControllerName = id + "txtLLMRPControllerName";
                    var LLMRPControllerCode = id + "txtLLMRPControllerCode";
                    var LLplannedInAPOYes = id + "rdbLLReleventForAPOYes";
                    var LLplannedInAPONo = id + "rdbLLReleventForAPONo";
                    var LLsupplyResponse = id + "ddlLLSupplyResponse";
                    
                    if(document.getElementById(ffpOutsideEAME).selectedIndex == 0)
                    {
                        alert("Please give FF&P Outside EAME details");
                        return false;
                    }
                    //Start of the change for Late Labeling by joko wang
                    if(document.getElementById(LateLabeling).selectedIndex == 0)
                    {
                        alert("Please enter Late Labelling details");
                        return false;
                    }
                    
                    if(document.getElementById(LateLabeling).selectedIndex == 1)
                    {
                            if(document.getElementById(LLPlantCode).selectedIndex == 0)
                            {
                                alert("Please enter SAP Plant Code in Late Labelling details");
                                return false;
                            }   
                            if(document.getElementById(LLprocurementType).selectedIndex == 0)
                            {
                                alert("Please enter Procurement Type in Late Labelling details");
                                return false;
                            }  
                            if(document.getElementById(LLMRPControllerName).value == "")
                            {
                                alert("Please enter MRP Controller Name in Late Labelling details");
                                return false;
                            }  
                            if(document.getElementById(LLMRPControllerCode).value == "")
                            {
                                alert("Please enter MRP Controller Code in Late Labelling details");
                                return false;
                            }  
                            if(document.getElementById(LLplannedInAPOYes).checked == false && document.getElementById(LLplannedInAPONo).checked == false)
                            {
                                alert("Please select whether it is Planned in APO or not in Late Labelling details.");
                                return false;
                            }            
                            if(document.getElementById(LLsupplyResponse).selectedIndex == 0)
                            {
                                alert("Please enter Supply Response in Late Labelling details");
                                return false;
                            }                     
                    }
                    //End of the change for Late Labeling by joko wang
                    if(document.getElementById(ffpOutsideEAME).selectedIndex == 1)
                    {
                        if(document.getElementById(ffpCodeSetupGSAP).checked == false && document.getElementById(ffpCodeSetupERP).checked == false)
                        {
                            alert("Please select a Value for System Code SetUp");
                            return false;
                        }
                        else if(document.getElementById(ffpCodeSetupGSAP).checked == true && document.getElementById(ffpCodeSetupERP).checked == false)
                        {
                            if(document.getElementById(sapPlantCode).selectedIndex == 0)
                            {
                                //Start Enhancement 3.3
                                if(document.getElementById(ffpOutsideEAME).selectedIndex == 2)
                                {
                                    
                                }
                                else
                                {
                                    alert("Please give SAP Plant Code details");
                                    return false;
                                }
                                //End Enhancement 3.3
                                //alert("Please give SAP Plant Code details");
                                //return false;
                            }    
                        
                            if(document.getElementById(procurementType).selectedIndex == 0)
                            {
                                if(document.getElementById(ffpOutsideEAME).selectedIndex == 2)
                                {
                                    
                                }
                                else
                                {
                                    alert("Please give Procurement Type details");
                                    return false;
                                }
                            } 
                            
                                   
                            if(document.getElementById(ffpMRPControllerName).value == "")
                            {
                                if(document.getElementById(ffpOutsideEAME).selectedIndex == 2)
                                {
                                    
                                }
                                else
                                {
                                    alert("Please give FF&P Controller Name details");
                                    return false;
                                }
                            }
                            
                            if(document.getElementById(ffpMRPControllerCode).value == "")
                            {
                                if(document.getElementById(ffpOutsideEAME).selectedIndex == 2)
                                {
                                    
                                }
                                else
                                {
                                    alert("Please give FF&P Controller Code details");
                                    return false;
                                }
                            }
                            
                            
                            if(document.getElementById(plannedInAPOYes).checked == false && document.getElementById(plannedInAPONo).checked == false)
                            {
                                alert("Please select whether it is Planned in APO or not.");
                                return false;
                            }
                            
                            if(document.getElementById(supplyResponse).selectedIndex == 0)
                            {
                                if(document.getElementById(ffpOutsideEAME).selectedIndex == 2)
                                {
                                    
                                }
                                else
                                {
                                    alert("Please give Supply Response details");
                                    return false;
                                }
                            } 
                           
                            //start of changed by tod zhang on 26/12/2007
                            /* 
                            if(document.getElementById(makeToOrder).selectedIndex == 0)
                            {
                                alert("Please give Make to Order details");
                                return false;
                            } 
                            */
                             //end of changed by tod zhang on 26/12/2007
                        
                        }        
                     } 
                     else if(document.getElementById(ffpOutsideEAME).selectedIndex == 2)
                     {
                          if(document.getElementById(hubPlantCode).selectedIndex == 0)
                          {
                            alert("Please select a value for Hub Plant Code");
                                return false;
                          }
                     } 
                     
                  
                     if(document.getElementById(supplyPlant2).value != "" || document.getElementById(MRPName2).value != "" || (document.getElementById(MRPCode2).value != "" && document.getElementById(MRPCode2).value != "   ") || document.getElementById(purchaseNumber2).value != "")
                     {
                        if(document.getElementById(hubPlantCode2).selectedIndex == 0)
                          {
                            alert("Please select a value for 2nd Hub Plant Code ");
                                return false;
                          }
                     }    
                     
                     if(document.getElementById(supplyPlant1).value != "" || document.getElementById(MRPName1).value != "" || (document.getElementById(MRPCode1).value != "" && document.getElementById(MRPCode1).value != "   ") || document.getElementById(purchaseNumber1).value != "" )
                     {
                        if(document.getElementById(hubPlantCode).selectedIndex == 0)
                          {
                            alert("Please select a value for 1st Hub Plant Code ");
                                return false;
                          }
                     }  
                     //change by tod zhang on 13/3/2008 for case 1105773-1, add: && document.getElementById(hubPlantCode).options[document.getElementById(hubPlantCode).selectedIndex].text != "NOT APPLICABLE" in line 1858
                     if(document.getElementById(hubPlantCode).selectedIndex != 0 && document.getElementById(hubPlantCode).options[document.getElementById(hubPlantCode).selectedIndex].text != "NOT APPLICABLE")
                     {
                           if(document.getElementById(supplyPlant1).value == "")
                           {
                              alert("Please give supply plant details for 1st Hub Plant Code ");
                                return false;
                           }
                            if(document.getElementById(MRPName1).value == "")
                           {
                              alert("Please give MRP Controller Name for 1st Hub Plant Code ");
                                return false;
                           }
                            if(document.getElementById(MRPCode1).value == "")
                           {
                              alert("Please give MRP Controller Code for 1st Hub Plant Code ");
                                return false;
                           }
                            if(document.getElementById(purchaseNumber1).value == "")
                           {
                              alert("Please give Purchaser Number for 1st Hub Plant Code ");
                                return false;
                           }
                     }        
                   //change by tod zhang on 13/3/2008 for case 1105773-1, add: && document.getElementById(hubPlantCode).options[document.getElementById(hubPlantCode).selectedIndex].text != "NOT APPLICABLE" in line 1882
                     if(document.getElementById(hubPlantCode2).selectedIndex != 0 && document.getElementById(hubPlantCode2).options[document.getElementById(hubPlantCode2).selectedIndex].text != "NOT APPLICABLE")
                     {
                           if(document.getElementById(supplyPlant2).value == "")
                           {
                              alert("Please give supply plant details for 2nd Hub Plant Code ");
                                return false;
                           }
                            if(document.getElementById(MRPName2).value == "")
                           {
                              alert("Please give MRP Controller Name for 2nd Hub Plant Code ");
                                return false;
                           }
                            if(document.getElementById(MRPCode2).value == "")
                           {
                              alert("Please give MRP Controller Code for 2nd Hub Plant Code ");
                                return false;
                           }
                            if(document.getElementById(purchaseNumber2).value == "")
                           {
                              alert("Please give Purchaser Number for 2nd Hub Plant Code ");
                                return false;
                           }
                     }  
                     if(document.getElementById("ctl00$ermsContentPageHeader$txtSCPComments").value.length <= 1000)
	                      return true;	        
	                 else
	                 {
	                       alert("Maximum 1000 letters in the field SCP comments");
	                       return false;
	                 }       
                }             
            }
        }
    }         
}



/**********************************************************************************************************
Function to Validate Mandatory Fields in PFR Screen 
***********************************************************************************************************/

function fnValidatePFRRequest()
{
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
            var LastIndex = document.activeElement.id.lastIndexOf('_');
            var id = document.activeElement.id.substring(0,LastIndex+1);
            var leadAI = id + "txtLeadAI";
            var designCode = id + "txtDesignCode";
            var UCAGICode = id + "txtUCAgiCode";
            var qty = id + "txtQtyOrPackSize";
            var configuration = id + "txtConfig";
            var UoM = id + "ddlUoM";
            var PLS = id + "ddlProductLineSeller";
            var tradeName = id + "txtTradeName";
            var country  = id + "ddlCountryOfSale";
            var countryPresCode = id + "txtCountryPresCode";
            //start code change on 15th May 2008
            var MakeToOrder=id + "ddlMakeToOrder";
            //end
            
                 if(document.getElementById(leadAI).value == "")
                 {
                    alert("Please give LeadAI details");
                    return false;
                 }     
                 
                 if(document.getElementById(designCode).value == "")
                 {
                    alert("Please give DesignCode details");
                    return false;
                 }     
                 
                 if(document.getElementById(UCAGICode).value == "")
                 {
                    alert("Please give UC AGICode details");
                    return false;
                 }     
                
                if (document.getElementById(qty).value == "")
                {
                    alert("Please give Quantity Details ");
                    return false;
                }
               
                if (document.getElementById(configuration).value == "")
                {
                    alert("Please give Configuration/Collation Details ");
                    return false;
                }
                else
                {
                    var Val=document.getElementById(configuration).value;
                        //var ret=isNumber(Val);
                        //if(ret == false)
                       // {
                       //     alert("Configuration should contain only numbers");
                        //    return false;
                       // }
                }
                
                if (document.getElementById(UoM).selectedIndex == 0)
                {
                    alert("Please select a UOM value ");
                    return false;
                }
                if (document.getElementById(MakeToOrder).selectedIndex == 0)
                {
                    alert("Please select a Make To Order value ");
                    return false;
                }
                
                 if (document.getElementById(PLS).selectedIndex == 0)
                {
                    alert("Please select a Product Line Seller value ");
                    return false;
                }
                
                if (document.getElementById(tradeName).value == "")
                {
                    alert("Please give Trade Name Details ");
                    return false;
                }
                
                if (document.getElementById(country).selectedIndex == 0)
                {
                    alert("Please select a Country of Sale value ");
                    return false;
                }
                
                
                 if(document.getElementById(countryPresCode).value == "")
                 {
                    alert("Please give Country Presentation Code details");
                    return false;
                 }     
          }             
    }                    
}
//for save
function fnPFRRequestSaveMandatoryCheck()
{
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
            var LastIndex = document.activeElement.id.lastIndexOf('_');
            var id = document.activeElement.id.substring(0,LastIndex+1);
            var leadAI = id + "txtLeadAI";
            var designCode = id + "txtDesignCode";
            var UCAGICode = id + "txtUCAgiCode";
            var qty = id + "txtQtyOrPackSize";
            var configuration = id + "txtConfig";
            var UoM = id + "ddlUoM";

                 if(document.getElementById(leadAI).value == "")
                 {
                    alert("Please give LeadAI details");
                    return false;
                 }     
                 
                 if(document.getElementById(designCode).value == "")
                 {
                    alert("Please give DesignCode details");
                    return false;
                 }     
                 
                 if(document.getElementById(UCAGICode).value == "")
                 {
                    alert("Please give UC AGICode details");
                    return false;
                 }     
                
                if (document.getElementById(qty).value == "")
                {
                    alert("Please give Quantity Details ");
                    return false;
                }
               
                if (document.getElementById(configuration).value == "")
                {
                    alert("Please give Configuration/Collation Details ");
                    return false;
                }
               
                if (document.getElementById(UoM).selectedIndex == 0)
                {
                    alert("Please select a UOM value ");
                    return false;
                }
        }                
    }                
}
/**********************************************************************************************************
Function to Validate Fields in EPT Screen 
***********************************************************************************************************/
function fnValidateEPTReq(start,type,i)
{
if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
           /*--commented by Tod Zhang on the 2008-7-18 for erms case 1160861-1
           if(document.getElementById("ctl00_ermsContentPageHeader_txtUmbrellaTeam").value=="")
           {
              alert("Umbrella Team text field is a mandatory field");
              return false;
           }
           */
           if(i!=1)
           {
             if(document.getElementById("ctl00_ermsContentPageHeader_ddlLeadAI").selectedIndex==0 && document.getElementById("ctl00_ermsContentPageHeader_txtLeadAI").value=="")
             {                                                                                                               
                alert("LeadAI need to be selected or typed");
                return false;
             }
           }
           /*--commented by Tod Zhang on the 2008-7-18 for erms case 1160861-1
           if(document.getElementById("ctl00_ermsContentPageHeader_txtCategory").value=="")
           {
              alert("Category text field is a mandatory field");
             return false;
           }
           */
           if(document.getElementById("ctl00_ermsContentPageHeader_txtDesignCode").value=="")
           {
              alert("Design Code text field is a mandatory field");
             return false;
           }
           if(document.getElementById("ctl00_ermsContentPageHeader_txtUCAgiCode").value=="")
           {
              alert("Uc Agi Code text field is a mandatory field");
              return false;
           }
           if(document.getElementById("ctl00_ermsContentPageHeader_txtFDes").value=="")
           {
              alert("Formulation Description text field is a mandatory field");
             return false;
           }
           if(document.getElementById("ctl00_ermsContentPageHeader_txtQtyOrPackSize").value=="")
           {
              alert("Quantity/Primary Pack Size text field is a mandatory field");
              return false;
           }
           //start of change by Infosys 2008-08-14
           if(trim(document.getElementById("ctl00_ermsContentPageHeader_txtQtyOrPackSize").value)==0)
           {
              alert("Quantity/Primary Pack Size should not be 0");
              return false;
           }
           //end of change by Infosys
           if(document.getElementById("ctl00_ermsContentPageHeader_txtConfig").value=="")
           {
              alert("Configuration/Collation text field is a mandatory field");
              return false;
           }
              if(document.getElementById("ctl00_ermsContentPageHeader_ddlUoM").selectedIndex==0)
           {
              alert("UoM need to be selected");
              return false;
           }
           if(i!=1)
           {
             if(document.getElementById("ctl00_ermsContentPageHeader_ddlMakeToOrder").selectedIndex==0)
             {
               alert("Make To Order need to be selected");
               return false;
             }
           }
            if(document.getElementById("ctl00_ermsContentPageHeader_ddlProductLineSeller").selectedIndex==0)
           {
              alert("Product line seller need to be selected");
             return false;
           }
           if(document.getElementById("ctl00_ermsContentPageHeader_txtTradeName").value=="")
           {
              alert("Trade Name text field is a mandatory field");
              return false;
           }
         
           if(document.getElementById("ctl00_ermsContentPageHeader_ddlCountryOfSale").selectedIndex==0)
           {
              alert("Country of Sale need to be selected");
             return false;
           }
           //start of change by Infosys 2008-08-14
           if(trim(document.getElementById("ctl00_ermsContentPageHeader_txtCountryPresCode").value)=="")
           {
              document.getElementById("ctl00_ermsContentPageHeader_txtCountryPresCode").value="";
              alert("Country Pres Code text field is a mandatory field");
              return false;
           }
           //end of change by Infosys
           if(document.getElementById("ctl00_ermsContentPageHeader_ddlProductCategory").selectedIndex==0)
           {
              alert("Product Category need to be selected");
              return false;
           }
           if(document.getElementById("ctl00_ermsContentPageHeader_txtFirstSale").value=="")
           {
              alert("Date of 1st Sale text field is a mandatory field");
              return false;
           }
	       //start of change by Infosys 2008-08-14
	       if(document.getElementById("ctl00_ermsContentPageHeader_ddlAncillariesYesNo")!=null && document.getElementById("ctl00_ermsContentPageHeader_txtAncillariesComments")!=null)
	       if(document.getElementById("ctl00_ermsContentPageHeader_ddlAncillariesYesNo").selectedIndex==1 && trim(document.getElementById("ctl00_ermsContentPageHeader_txtAncillariesComments").value)=="")
	       {
	            document.getElementById("ctl00_ermsContentPageHeader_txtAncillariesComments").value="";
	            alert("Please enter comments for Ancillaries/Special Requirements");
	            return false;
	       }
	       //end of change by Infosys
           //start of change by Infosys fro ERMS case 1160861
           if(document.getElementById("ctl00$ermsContentPageHeader$txtComment").value.length > 1000)
	       {
	           alert("Maximum 1000 letters in the field Comment");
	           return false;
	       }		 
	       //end of change by Infosys
           if(trimAll(document.getElementById("ctl00_ermsContentPageHeader_txtRegulatoryContact").value)=="")
           {
              alert("Regulatory Contact text field is a mandatory field");
              return false;
           }
               if(type!=0)
               {
                     var num=document.getElementById("ctl00_ermsContentPageHeader_txtFirstSale").value;
                     var arr=num.split("/");
                     var end = arr[1]+"/"+arr[0]+"/"+arr[2];
                      var date=CompareDate(end,start);
                    if(date==false)
                    {
                           if(confirm("Date of first sale is too early,Do you want to procced?"))
                           {
                             return true;
                           }
                           else
                           {
                             return false;
                           }
                     }
               }
               // document.getElementById("ctl00_ermsContentPageHeader_btnSubmit").disabled=true;
               // document.getElementById("ctl00_ermsContentPageHeader_imgSubmit").disabled=true;
                return true;
        }
      }
     
}
 
 function fnEnableAltLeadAI(txtLeadAI,ddlLeadAI)
 {
  
   var txtLead=document.getElementById(txtLeadAI);
   var ddlLead=document.getElementById(ddlLeadAI);
   if(ddlLead.selectedIndex!=0)
   {
      txtLead.value="";
      txtLead.disabled=true;
   }
   else
   {
     txtLead.value="";
      txtLead.disabled=false;
   }
 }
  
  function fnEnableComments()
  {
  
   var ctrl=document.getElementById("ctl00_ermsContentPageHeader_ddlAncillariesYesNo").selectedIndex;
   if(document.getElementById("ctl00_ermsContentPageHeader_ddlAncillariesYesNo")[ctrl].text=="Yes")
   {
      document.getElementById("ctl00_ermsContentPageHeader_txtAncillariesComments").disabled=false;
   }
   else
   {
    document.getElementById("ctl00_ermsContentPageHeader_txtAncillariesComments").value="";
     document.getElementById("ctl00_ermsContentPageHeader_txtAncillariesComments").disabled=true;
   }
  }
  
 /**********************************************************************************************************
Function to Validate Fields in Search Screen 
***********************************************************************************************************/

    function fnEnable(ctls)
    {  
      var contols = ctls.split(',');
     
      //var LastIndex = document.activeElement.id.lastIndexOf('_');
      var rdbSearchCriteria = document.getElementById(contols[0]);
      var rdbReqNum = document.getElementById(contols[1]);
      var rdbSUorPU = document.getElementById(contols[2]);
      var rdbNSU = document.getElementById(contols[3]);    
       
      var chkConcernsRaised = document.getElementById(contols[4]);
      var id="ctl00_ermsContentPage_";

     if(rdbSearchCriteria.checked==true)
      {
        document.getElementById("ctl00_ermsContentPage_btnSearch").focus();
        chkConcernsRaised.disabled=false;
        document.getElementById(id + "ddlReqType").disabled=false;
        document.getElementById(id + "imgGal").disabled=false;
        document.getElementById(id + "ddlCountry").disabled=false;
        document.getElementById(id + "ddlLeadAI").disabled=false;
        document.getElementById(id + "ddlArea").disabled=false;
//        document.getElementById(id + "ddlSubArea").disabled=false; --Start of the change by joko wang for Hidden the SubArea in 25-Feb-2011
        document.getElementById(id + "ddlStatus").disabled=false;
        document.getElementById(id + "ddlSubStatus").disabled=false;
        document.getElementById(id + "txtReqNumber").disabled=true;
        document.getElementById(id + "txtSUorPU").disabled=true;
        document.getElementById(id + "txtNSU").disabled=true;
        document.getElementById(id + "txtReqNumber").value="";
        document.getElementById(id + "txtSUorPU").value="";
        document.getElementById(id + "txtNSU").value="";
        
      }
      if(rdbReqNum.checked==true)
      {
        
         chkConcernsRaised.disabled=true;
         document.getElementById(id + "ddlReqType").disabled=true;
         document.getElementById(id + "txtOriginator").disabled=true;
         document.getElementById(id + "imgGal").disabled=true;
         document.getElementById(id + "ddlCountry").disabled=true;
         document.getElementById(id + "ddlLeadAI").disabled=true;
         document.getElementById(id + "ddlArea").disabled=true;
//         document.getElementById(id + "ddlSubArea").disabled=true; --Start of the change by joko wang for Hidden the SubArea in 25-Feb-2011
         document.getElementById(id + "ddlStatus").disabled=true;
         document.getElementById(id + "ddlSubStatus").disabled=true;
         document.getElementById(id + "txtReqNumber").disabled=false;
         document.getElementById(id + "txtSUorPU").disabled=true;
         document.getElementById(id + "txtNSU").disabled=true;
         document.getElementById(id + "txtSUorPU").value="";
         document.getElementById(id + "txtNSU").value="";
         chkConcernsRaised.checked=false;
         document.getElementById(id + "txtOriginator").value="";
         document.getElementById(id + "txtReqNumber").focus();
      }
      if(rdbSUorPU.checked==true)
      {
    
        chkConcernsRaised.disabled=true;
        document.getElementById(id + "ddlReqType").disabled=true;
       document.getElementById( id + "txtOriginator").disabled=true;
       document.getElementById(id + "imgGal").disabled=true;
       document.getElementById(id + "ddlCountry").disabled=true;
       document.getElementById(id + "ddlLeadAI").disabled=true;
       document.getElementById(id + "ddlArea").disabled=true;
//       document.getElementById(id + "ddlSubArea").disabled=true; --Start of the change by joko wang for Hidden the SubArea in 25-Feb-2011
       document.getElementById(id + "ddlStatus").disabled=true;
       document.getElementById(id + "ddlSubStatus").disabled=true;
       document.getElementById(id + "txtReqNumber").disabled=true;
       document.getElementById(id + "txtSUorPU").disabled=false;
       document.getElementById(id + "txtNSU").disabled=true;
       document.getElementById(id + "txtReqNumber").value="";
       document.getElementById(id + "txtNSU").value="";
        chkConcernsRaised.checked=false;
       document.getElementById(id + "txtOriginator").value="";
         document.getElementById(id + "txtSUorPU").focus();
      }
      if(rdbNSU.checked==true)
      {
    
        chkConcernsRaised.disabled=true;
        document.getElementById(id + "ddlReqType").disabled=true;
        document.getElementById(id + "txtOriginator").disabled=true;
        document.getElementById(id + "imgGal").disabled=true;
       document.getElementById(id + "ddlCountry").disabled=true;
       document.getElementById(id + "ddlLeadAI").disabled=true;
       document.getElementById(id + "ddlArea").disabled=true;
//       document.getElementById(id + "ddlSubArea").disabled=true; --Start of the change by joko wang for Hidden the SubArea in 25-Feb-2011
       document.getElementById(id + "ddlStatus").disabled=true;
       document.getElementById(id + "ddlSubStatus").disabled=true;
        document.getElementById(id + "txtReqNumber").disabled=true;
        document.getElementById(id + "txtSUorPU").disabled=true;
       document.getElementById(id + "txtNSU").disabled=false;
      document.getElementById(id + "txtReqNumber").value="";
      document.getElementById(id + "txtSUorPU").value="";
      chkConcernsRaised.checked=false;
      document.getElementById(id + "txtOriginator").value="";
      document.getElementById(id + "txtNSU").focus();
       }
    }
    function fnValidateSearch(ctls)
    {
        var returl=document.getElementById(ctls);
        var url = "SearchResults.aspx";
        var id="ctl00_ermsContentPage_";
         if(document.getElementById(id + "rdbReqNum").checked==true)
         {
             var requestNumber =  document.getElementById(id + "txtReqNumber").value;
	         var queryString ="?ReqNumber="+requestNumber;
	         var urlString=url+queryString;
            
             if(requestNumber=="")
             {
               alert("Request Number textbox field cannot be blank");
               document.getElementById(id + "txtReqNumber").focus();
               //returl.value="chk1";
               return false;
             }
             else
             {
                 var ret=isInteger(requestNumber);
                 if(ret == true)
                 {
                     returl.value=urlString;
                 }
                 else
                 {
                  alert("Request Number textbox field should contain only numbers");
                  document.getElementById(id + "txtReqNumber").focus();
                  return false;
                  //returl.value="chk1";
                 }
             }
          }
         else if(document.getElementById(id + "rdbSUorPU").checked==true)
         {
            
	         var SUorPU =  document.getElementById(id + "txtSUorPU").value;
	         var queryString ="?SUorPU="+SUorPU;
	         var urlString=url+queryString;
            
             if(SUorPU=="")
             {
                 alert("SU or PU textbox field cannot be blank");
                 document.getElementById(id + "txtSUorPU").focus();
                 return false;
                 //returl.value="chk2";
             }
              else
             {
                  var ret=isInteger(SUorPU);
                 if(ret == true)
                 {
                    returl.value=urlString;
                 }
                 else
                 {
                  alert("SUorPU textbox field should contain only numbers");
                  document.getElementById(id + "txtSUorPU").focus();
                  return false;
                  //returl.value="chk2";
                 }
             }
          }
         else if(document.getElementById(id + "rdbNSU").checked==true)
         {
            
	         var NSU =  document.getElementById(id + "txtNSU").value;
	         var queryString ="?NSU="+NSU;
	         var urlString=url+queryString;
            
             if(NSU =="")
             {
                 alert("NSU textbox field cannot be blank");
                 document.getElementById(id + "txtNSU").focus();
                 return false;
                 //returl.value="chk3";
             }
             else
             {
                 var ret=isInteger(NSU);
                 if(ret == true)
                 {
                    returl.value=urlString;
                 }
                 else
                 {
                  alert("NSU textbox field should contain only numbers");
                  document.getElementById(id + "txtNSU").focus();
                  return false;
                  //returl.value="chk3";
                 }
             }
          }
          else
          {   
              var req=document.getElementById(id + "ddlReqType").selectedIndex;
              if (document.getElementById(id + "ddlReqType")[req].value!="ALL")
              var reqType=document.getElementById(id + "ddlReqType")[req].value;
              else
              var reqType=0;
              
              if(document.getElementById(id + "txtOriginator").value!="")
              {
              var domain=document.getElementById(id + "hdnDomain").value;
              var user=document.getElementById(id + "hdnUserId").value;
              var originator=domain+"\\"+user;
              }
              else
              {
              var originator="ALL";
              }
              var ctry=document.getElementById(id + "ddlCountry").selectedIndex;
              if (document.getElementById(id + "ddlCountry")[ctry].value!="ALL")
              var country= document.getElementById(id + "ddlCountry")[ctry].value;
              else
              var country=0;
              
              var ldai=document.getElementById(id + "ddlLeadAI").selectedIndex;        
              if (document.getElementById(id + "ddlLeadAI")[ldai].value!="ALL")
              var leadAI= document.getElementById(id + "ddlLeadAI")[ldai].value;
              else
              var leadAI=0;
              
              var ara=document.getElementById(id + "ddlArea").selectedIndex;
              if (document.getElementById(id + "ddlArea")[ara].value!="ALL")
              var area =  document.getElementById(id + "ddlArea")[ara].value;
              else
              var area = 0;  
//Start of the change by joko wang for Hidden the SubArea in 25-Feb-2011
//              var sara= document.getElementById(id + "ddlSubArea").selectedIndex;          
//              if (document.getElementById(id + "ddlSubArea")[sara].value!="ALL")
//              var subArea =  document.getElementById(id + "ddlSubArea")[sara].value;
//              else
//End of the change by joko wang for Hidden the SubArea in 25-Feb-2011
              var subArea = 0;  
              
              var sts=document.getElementById(id + "ddlStatus").selectedIndex;
              if (document.getElementById(id + "ddlStatus")[sts].value!="ALL")
              var status=  document.getElementById(id + "ddlStatus")[sts].value;
              else
              var status= 0;  
               
              var substs=document.getElementById(id + "ddlSubStatus").selectedIndex;
              if (document.getElementById(id + "ddlSubStatus")[substs].value!="ALL")
              var subStatus=  document.getElementById(id + "ddlSubStatus")[substs].value;
              else
              var subStatus = 0;  
               
              var concerns=  document.getElementById(id + "chkConcernsRaised").checked;
              var queryString ="?ReqType="+reqType+"&originator="+originator+"&country="+country+"&leadAI="+leadAI+"&area="+area+"&subarea="+subArea+"&status="+status+"&substatus="+subStatus+"&concerns="+concerns;
              var urlString=url+queryString;
              returl.value=urlString;
          }
    }  
   
 /**********************************************************************************************************
Function to Validate Fields in PackTech Screen 
***********************************************************************************************************/
function fnValidatePackTech(date)
{
    
    if(document.activeElement.id)
    {
       if(document.getElementById(document.activeElement.id).disabled == false)
       {
          if(document.activeElement.id=="ctl00_ermsContentPageHeader_imgSubmitStep1"||document.activeElement.id=="ctl00_ermsContentPageHeader_btnSubmitStep1")
          {
             if(document.getElementById("ctl00_ermsContentPageHeader_txtPackTechName").value=="")
             {
                 alert("Pack Technologist is a mandatory field");
                 return false;
             }
             else if(document.getElementById("ctl00_ermsContentPageHeader_txtESTPackCompDate").value=="")
             {
                alert("EST pack Comp Date text field is a mandatory field");
                 return false;
             }
             else
                 return true;
             
          }
          
          else
          {
             if(document.getElementById("ctl00_ermsContentPageHeader_txtPackTechName").value=="")
             {
                 alert("Pack Technologist is a mandatory field");
                 return false;
             }
           
             if(document.getElementById("ctl00_ermsContentPageHeader_txtESTPackCompDate").value=="")
             {
                alert("EST pack Comp Date text field is a mandatory field");
                 return false;
             }
          
             var chk=document.getElementById("ctl00_ermsContentPageHeader_txtESTWorkInvolved").value;
             var num=isInteger(chk);
             if(num == false)
               {
                    alert("EST Work Involved(Man Hours)textbox field should contain only numbers");
                   return false;
               }
               
          
             //start of change by Tod Zhang on 2008-6-25 for ERMS case 1143583-1
             if(document.getElementById("ctl00$ermsContentPageHeader$txtBSPAgiCode").value!="" && document.getElementById("ctl00$ermsContentPageHeader$txtNSUCode").value=="")
             {
                 alert("Please enter NSU code on the STEP 3.");
                   return false;
             }  
             if(document.getElementById("ctl00$ermsContentPageHeader$txtBSPAgiCode").value=="" && document.getElementById("ctl00$ermsContentPageHeader$txtNSUCode").value!="")
             {
                alert("Please enter BSP Agi Code on the STEP 3.");
                   return false;
             }
             if(document.getElementById("ctl00$ermsContentPageHeader$txtBSPAgiCode").value=="" && document.getElementById("ctl00$ermsContentPageHeader$txtNSUCode").value=="")    
            {
                alert("Please enter BSP Agi Code and NSU Code on the STEP 3");  
                return false;     
             }
             //end of change by Tod Zhang on 2008-6-25 
           
             //Start of change by Infosys for ERMS issue
             if (!fnValidateInteger(document.getElementById("ctl00$ermsContentPageHeader$txtNSUCode").value))
	         {		    
	             alert("Please Enter valid quantity which contain integer for the NSU code");
	             document.getElementById("ctl00$ermsContentPageHeader$txtNSUCode").value = "";
	             document.getElementById("ctl00$ermsContentPageHeader$txtNSUCode").focus();
	             return false;
             }
             //End of change by Infosys for ERMS issue
           
             // Start of change by Infosys for ERMS case 1205124-1 on 7/11/2008
	         if(document.getElementById("ctl00$ermsContentPageHeader$txtPackComments").value.length > 2500)
	         {
	             alert("Maximum 2500 letters in the field PackComments");
	             return false;
	         }		 
	         // End of change by Infosys for ERMS case 1205124-1 on 7/11/2008
	       
             return true;
          }
       }
     }
}
        
        
 function isInteger(s)
 {   
      var i; 
      for (i = 0; i < s.length; i++) 
      { 
            // Check that current character is number. 
            var c = s.charAt(i); 
            if (((c < "0") || (c > "9"))) 
	            return false; 
      }
     // All characters are numbers. 
     return true;        
 } 
 
/**********************************************************************************************************
Function to Validate Fields in New Code/IMC Screen 
***********************************************************************************************************/
      function fnPageRedirect(ctls)
    {  
      //if(confirm('Please ensure that you have selected the correct button as originator of this request.  \nChoose Supply Chain Request if you are working in the EAME Supply Chain & wish to raise a request which is initiated by the EAME Supply Chain.  \nChoose IMC/Country if you are working in an IMC/Country or are raising a request on behalf of an IMC/Country'))
		//{
           var contols = ctls.split(',');
               
          var CodeReqTypePFR = document.getElementById(contols[0]);
          var CodeReqTypeNCI = document.getElementById(contols[1]);
          var CodeRequiredNo= document.getElementById(contols[2]);
          var CodeRequiredYes = document.getElementById(contols[3]);    
          var ret=document.getElementById(contols[4]);   
           if(CodeRequiredYes.checked==true)
           {       
           
            if(CodeReqTypePFR.checked == true)
             {
                ret.value="ProductForResale.aspx";
             }
             else
             {
                 ret.value="OtherRangeRequest.aspx";
             }
           }
            else
             {
                  var url="CoreRange.aspx";
                  var queryString ="?Id=1";
	              var urlString=url+queryString;
                   ret.value=urlString;
             }
        // }
        // else
         //   return false;
   }
   function fnEnableCodeReq(ctls)
   {
   
      var contols = ctls.split(',');
     
      
      var CodeReqTypePFR = document.getElementById(contols[0]);
      var CodeReqTypeNCI = document.getElementById(contols[1]);
      var CodeRequiredNo= document.getElementById(contols[2]);
      var CodeRequiredYes = document.getElementById(contols[3]);    
       
      if(CodeRequiredYes.checked==true)
      {
        CodeReqTypePFR.disabled=false;
        CodeReqTypeNCI.disabled=false;
      }
      else
      {
        CodeReqTypePFR.disabled=true;
        CodeReqTypeNCI.disabled=true;
        CodeReqTypePFR.checked=true;
     }
   }
    /**********************************************************************************************************
Function to Validate Fields in New Code/SupplyChain Screen 
***********************************************************************************************************/
   
    function fnRedirectReq(ctls)
    {
        if(confirm('Please ensure that you have selected the correct button as originator of this request.  \nChoose Supply Chain Request if you are working in the EAME Supply Chain & wish to raise a request which is initiated by the EAME Supply Chain.  \nChoose IMC/Country if you are working in an IMC/Country or are raising a request on behalf of an IMC/Country'))
		{	
		
          var contols = ctls.split(',');
          var id=document.getElementById(contols[0]);
          var ret=document.getElementById(contols[1]);
          if(id.checked==true)
          {
            ret.value="EPTRangeRequest.aspx"; 
          }
          else
          {
             ret.value="CombiPackHome.aspx?id=1";
          }
       }
      else
			return false;
    }
 /**********************************************************************************************************
Function to Validate Fields in New Code Home Screen 
***********************************************************************************************************/
 function fnRedirectRequest(ctls)
    { 
      var contols = ctls.split(',');
           
      var NewReq = document.getElementById(contols[0]);
      var Search = document.getElementById(contols[1]);
      var ret=document.getElementById(contols[2]);
      
      if(NewReq.checked==true)
      {
          ret.value ='NewCodeReq_SupplyChain.aspx';
      }
      else if(Search.checked==true)
      {
          ret.value='Search.aspx';
      }
      else
      {
        alert("One of the option should be selected");
      return false;
      }
    }
    
 /**********************************************************************************************************
Function to Validate Fields in SupplyChain GSCM Screen 
***********************************************************************************************************/

function fnValidateGSCMReq()
{
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
               if(document.getElementById("ctl00_ermsContentPageHeader_ddlGSCMFirstApproval").selectedIndex==0)
               {
                  alert("Global Supply Chain Manager First Approval need to be selected");
                  return false;
               }
               return true;
        }           
    }           
}

function checkBlankValue2()
    {
        var returnvlaue = "";
        var i=0;
        for(i=1;i<=rownum;i++)
        {
           var fieldid1 = "txt_row_"+i+"_1";
           var fieldid2 = "txt_row_"+i+"_2";
           var fieldid3 = "txt_row_"+i+"_3";
           var fieldid4 = "txt_row_"+i+"_4";
           var fieldid5 = "txt_row_"+i+"_5";
           var value1 = document.getElementById(fieldid1).value;
           var value2 = document.getElementById(fieldid2).value;
           var value3 = document.getElementById(fieldid3).value;
           var value4 = document.getElementById(fieldid4).value;
           var value5 = document.getElementById(fieldid5).value;
           
           if(value1 != "" && value2 != "" && value3 != "" && value4 != "" && value5 != "")
           {
                
           }
           else if(value1 == "" && value2 == "" && value3 == "" && value4 == "" && value5 == "")
           {
                
           }
           else
           {
                document.getElementById("ctl00_ermsContentPageHeader_hidMandetory").value = "yes";
           }
        }
    }

 /**********************************************************************************************************
Function to Validate Fields in SupplyChain Request Screen 
***********************************************************************************************************/
function fnValidateSupplyCahinReq(start,type)
{
    checkBlankValue2();
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
           if(document.getElementById("ctl00_ermsContentPageHeader_txtLeadAI").value=="")
           {
              alert("Details for change to made Lead AI text field is a mandatory field");
              return false;
           }
           if(document.getElementById("ctl00_ermsContentPageHeader_txtDateChange").value=="")
           {
              alert("Date Change to be made text field is a mandatory field");
              return false;
           } 
           if(document.getElementById("ctl00_ermsContentPageHeader_txtCurrDesignCode").value=="")
           {
              alert("Current Design Code varient A No. text field is a mandatory field");
              return false;
           }
           if(document.getElementById("ctl00_ermsContentPageHeader_txtNewDesignCode").value=="")
           {
              alert("New Design Code varient A No. text field is a mandatory field");
              return false;
           }
           if(document.getElementById("ctl00_ermsContentPageHeader_hidallxml").value == "") 
           {
               alert("SU Agi Code affected and related fields is mandatory");
               return false;
           }
           if(document.getElementById("ctl00_ermsContentPageHeader_hidMandetory").value == "yes") 
           {
               alert("SU Agi Code affected and related fields are mandatory");
               document.getElementById("ctl00_ermsContentPageHeader_hidMandetory").value = "No"
               return false;
           }
           if(document.getElementById("ctl00_ermsContentPageHeader_txtCurrUCAgiCode").value=="")
           {
              alert("Current Uc Agi Code text field is a mandatory field");
              return false;
           }
           if(document.getElementById("ctl00_ermsContentPageHeader_txtNewUCAgiCode").value=="")
           {
              alert("New Uc Agi Code text field is a mandatory field");
              return false;
           } 
           if(document.getElementById("ctl00_ermsContentPageHeader_txtCurrPack").value=="")
           {
              alert("Current Pack text field is a mandatory field");
              return false;
           }
           if(document.getElementById("ctl00_ermsContentPageHeader_txtNewPack").value=="")
           {
              alert("New Pack text field is a mandatory field");
              return false;
           }
           //start of code change on 16th May 2008
           if(document.getElementById("ctl00_ermsContentPageHeader_ddlMakeToOrder").selectedIndex==0)
             {
               alert("Make To Order need to be selected");
               return false;
             }
           //end
           
           if(document.getElementById("ctl00$ermsContentPageHeader$txtSUAgiCodesAffected").value.length <= 1000)
	        if(document.getElementById("ctl00_ermsContentPageHeader_txtCtryofSalesAffected").value.length <= 1000)
	        if(document.getElementById("ctl00$ermsContentPageHeader$txtBackGrdInfo").value.length <= 1000)
	        {
	           
	        }
	        else 
	        {
	           alert("Maximum 1000 letters in the field BackGrdInfo");
	           return false;
	        }
	        else 
	        {
	           alert("Maximum 1000 letters in the field CtryofSalesAffected");
	            return false;
	        }		 
	       else
	       {
	         alert("Maximum 1000 letters in the field SUAgiCodesAffected");
	         return false;
	        }
           
           if(type!=0)
           {
               var num=document.getElementById("ctl00_ermsContentPageHeader_txtDateChange").value;
               var arr=num.split("/");
               var end = arr[1]+"/"+arr[0]+"/"+arr[2];
               var date=CompareDate(end,start);
               if(date==false)
               {
                   if(confirm("Date change to be made is too early,Do you want to proceed?"))
                   {
                         
                   }
                   else
                   {
                         return false;
                   }
               }
           }
           return true;
        }
    }
}

/*******************************************************************************************************************
Function to Enable/Disable Ancillaries textboxes for New Pack Screen
*****************************************************************************************************************/
function fnEnableDisableAncillariesTxtBox()
{
    var LastIndex = document.activeElement.id.lastIndexOf('_');
    var id = document.activeElement.id.substring(0,LastIndex+1);
    var ancillCommentsDdl = id + "ddlAncillariesYesNo";
    var ancillCommentsTxt = id + "txtAncillariesComments";
    
       
    if (document.getElementById(ancillCommentsDdl).selectedIndex != 1)
    {
        document.getElementById(ancillCommentsTxt).disabled = true;
    }
    else
    {
        document.getElementById(ancillCommentsTxt).disabled = false;
    }
}

/*******************************************************************************************************************
Function to Enable/Disable Sourcing textbox for New Pack Screen
*****************************************************************************************************************/
function fnEnableSourcingTxtBox()
{
    
    var LastIndex = document.activeElement.id.lastIndexOf('_');
    var id = document.activeElement.id.substring(0,LastIndex+1);
    var sourcingYes = id + "rdSourceYes";
    var sourcingTxtBox = id + "txtSourceDetails";
        
       
    if (document.getElementById(sourcingYes).checked == true)
    {
        document.getElementById(sourcingTxtBox).disabled = false;
        document.getElementById(sourcingTxtBox).value = "";
    }
    
}
function fnDisableSourcingTxtBox()
{
    var LastIndex = document.activeElement.id.lastIndexOf('_');
    var id = document.activeElement.id.substring(0,LastIndex+1);
    var sourcingNo = id + "rdSourceNo";
    var sourcingTxtBox = id + "txtSourceDetails";
        
       
    if (document.getElementById(sourcingNo).checked == true)
    {
        document.getElementById(sourcingTxtBox).disabled = true;
        document.getElementById(sourcingTxtBox).value = "";
    }
     
}

/*******************************************************************************************************************
start change on 8/10/2008 for case 1194638-1
Function to check 'Do you require Syngenta Branded Pack?' field for New Pack Screen
*****************************************************************************************************************/
function fnEnableIsSynBrdPackReqDropDown()
{
    if(document.getElementById(document.activeElement.id).selectedIndex == 2)
    {
        if(!confirm("You have asked for a NON Syngenta branded pack (SPAC) - Please make sure this is correct. \nClick on the Help to see details of the differences or click on the Presentation link to see a detailed presentation on Syngenta branded packs"))
            document.getElementById(document.activeElement.id).selectedIndex = 0;
        return true;
     }
}
// end change on 8/10/2008 for case 1194638-1

/*******************************************************************************************************************
Function to Enable/Disable Sourcing GSAP Controls for SCP Screen
*****************************************************************************************************************/
function fnEnableGSAPControls()
{
    
    var LastIndex = document.activeElement.id.lastIndexOf('_');
    var id = document.activeElement.id.substring(0,LastIndex+1);
    var ffpCodeSetupGSAP = id + "rdbCodeSetUpGSAP";
    var ffpCodeSetupERP = id + "rdbCodeSetUpERP";
    var sapPlantCode = id + "ddlSAPCode";
    var procurementType = id + "ddlProcType";
    var ffpMRPControllerName = id + "txtMRPControllerName";
    var ffpMRPControllerCode = id + "txtMRPControllerCode";
    var plannedInAPOYes = id + "rdbReleventForAPOYes";
    var plannedInAPONo = id + "rdbReleventForAPONo";
    var supplyResponse  = id + "ddlSupplyResponse";
    var makeToOrder = id + "ddlMakeToOrder"; 
    
    if(document.getElementById(ffpCodeSetupGSAP).checked == true)
    {
        document.getElementById(sapPlantCode).disabled = false;
        document.getElementById(procurementType).disabled = false;
        document.getElementById(ffpMRPControllerName).disabled = false;
        document.getElementById(ffpMRPControllerCode).disabled = false;
        document.getElementById(plannedInAPOYes).setAttribute("disabled" , false);
        document.getElementById(plannedInAPOYes).parentNode.setAttribute("disabled" , false);
        document.getElementById(plannedInAPONo).setAttribute("disabled" , false);
        document.getElementById(plannedInAPONo).parentNode.setAttribute("disabled" , false);
         document.getElementById(plannedInAPOYes).setAttribute("enabled" , true);
        document.getElementById(plannedInAPOYes).parentNode.setAttribute("enabled" , true);
        document.getElementById(plannedInAPONo).setAttribute("enabled" , true);
        document.getElementById(plannedInAPONo).parentNode.setAttribute("enabled" , true);
        document.getElementById(supplyResponse).disabled = false;
        //document.getElementById(makeToOrder).disabled = false;
        //document.getElementById("ctl00_ermsContentPageHeader_rdbCodeSetUpGSAP").checked = true;
        //document.getElementById("ctl00_ermsContentPageHeader_rdbCodeSetUpERP").checked = false;
        //document.forms["aspnetForm"].ctl00$ermsContentPageHeader$rdbCodeSetUp[0].checked=true;
        //document.forms["aspnetForm"].ctl00$ermsContentPageHeader$rdbCodeSetUp[1].checked=false;
    }
    
    if(document.getElementById(ffpCodeSetupERP).checked == true)
    {
        document.getElementById(sapPlantCode).disabled = true;
        document.getElementById(procurementType).disabled = true;
        document.getElementById(ffpMRPControllerName).disabled = true;
        document.getElementById(ffpMRPControllerCode).disabled = true;
        document.getElementById(plannedInAPOYes).setAttribute("enabled" , false);
        document.getElementById(plannedInAPOYes).setAttribute("disabled" , true);
        document.getElementById(plannedInAPOYes).parentNode.setAttribute("enabled" , false);
        document.getElementById(plannedInAPOYes).parentNode.setAttribute("disabled" , true);
        document.getElementById(plannedInAPONo).setAttribute("enabled" , false);
        document.getElementById(plannedInAPONo).parentNode.setAttribute("enabled" , false);
         document.getElementById(plannedInAPONo).setAttribute("disabled" , true);
        document.getElementById(plannedInAPONo).parentNode.setAttribute("disabled" , true);
        document.getElementById(supplyResponse).disabled = true;
        //document.getElementById(makeToOrder).disabled = true;
        // document.getElementById("ctl00_ermsContentPageHeader_rdbCodeSetUpGSAP").checked = false;
        //document.getElementById("ctl00_ermsContentPageHeader_rdbCodeSetUpERP").checked = true;
        //document.forms["aspnetForm"].ctl00$ermsContentPageHeader$rdbCodeSetUp[1].checked=true;
        //document.forms["aspnetForm"].ctl00$ermsContentPageHeader$rdbCodeSetUp[0].checked=false;
    }
    
    
}

/*******************************************************************************************************************
Function to Enable/Disable Sourcing GSAP & Hub Controls for SCP Screen
*****************************************************************************************************************/
function fnEnableGSAPHubControls()
{
    
    //debugger;
    var LastIndex = document.activeElement.id.lastIndexOf('_');
    var id = document.activeElement.id.substring(0,LastIndex+1);
    var ddlFFP = id + "ddlFFP";
    var ffpCodeSetupGSAP = id + "rdbCodeSetUpGSAP";
    var ffpCodeSetupERP = id + "rdbCodeSetUpERP";
    var sapPlantCode = id + "ddlSAPCode";
    var procurementType = id + "ddlProcType";
    var ffpMRPControllerName = id + "txtMRPControllerName";
    var ffpMRPControllerCode = id + "txtMRPControllerCode";
    var plannedInAPOYes = id + "rdbReleventForAPOYes";
    var plannedInAPONo = id + "rdbReleventForAPONo";
    var supplyResponse  = id + "ddlSupplyResponse";
    var makeToOrder = id + "ddlMakeToOrder"; 
    
    if (document.getElementById(ddlFFP).selectedIndex == 2 )
    {
        
        document.getElementById(ffpCodeSetupGSAP).disabled = false; 
        document.getElementById(ffpCodeSetupGSAP).parentNode.disabled = false;
        
        document.getElementById(ffpCodeSetupERP).disabled = false; 
        document.getElementById(ffpCodeSetupERP).parentNode.disabled = false;
        
        document.getElementById(sapPlantCode).disabled = false;
        document.getElementById(procurementType).disabled = false;
        document.getElementById(ffpMRPControllerName).disabled = false;
        document.getElementById(ffpMRPControllerCode).disabled = false;
        
        document.getElementById(plannedInAPOYes).disabled = false;
        document.getElementById(plannedInAPOYes).parentNode.disabled = false;
        
        document.getElementById(plannedInAPONo).disabled = false;
        document.getElementById(plannedInAPONo).parentNode.disabled = false;
        
        document.getElementById(supplyResponse).disabled = false;
        document.getElementById(makeToOrder).disabled = false;
    }
    else
    {
        document.getElementById(ffpCodeSetupGSAP).disabled = true; 
        document.getElementById(ffpCodeSetupERP).disabled = true; 
        document.getElementById(sapPlantCode).disabled = true;
        document.getElementById(procurementType).disabled = true;
        document.getElementById(ffpMRPControllerName).disabled = true;
        document.getElementById(ffpMRPControllerCode).disabled = true;
        document.getElementById(plannedInAPOYes).disabled = true;
        document.getElementById(plannedInAPONo).disabled = true;
        document.getElementById(supplyResponse).disabled = true;
        document.getElementById(makeToOrder).disabled = true;
    }
}


/*******************************************************************************************************************
Function to Enable/Disable More Data Req Dropdown for RDM Screen
*****************************************************************************************************************/
function fnEnableRDMMoreDataReqDropDown()
{
    var LastIndex = document.activeElement.id.lastIndexOf('_');
    var id = document.activeElement.id.substring(0,LastIndex+1);
    var ddlMoreData = id + "ddlMoreDataReqReason";
    var moreDataYes = id + "rdbMoreDataReqYes";
    var moreDataNo = id + "rdbMoreDataReqNo";
    var img = id + "imgMoreDataRequiredContact";
    var Notes = id + "txtNotes";
    
    if(document.getElementById(moreDataYes).checked == true && document.getElementById(moreDataNo).checked == false)
    {
        document.getElementById(ddlMoreData).disabled = false;
        document.getElementById(img).disabled = false;
        document.getElementById(Notes).disabled = false;
    }
    if(document.getElementById(moreDataNo).checked == true && document.getElementById(moreDataYes).checked == false)
    {
        document.getElementById(ddlMoreData).disabled = true;
        document.getElementById(img).disabled = true;
        document.getElementById(Notes).disabled = true;
    }
}    

/**********************************************************************************************************
Function to Validate Mandatory Fields in CombiPack FormD
***********************************************************************************************************/

function fnValidateCombiPackFormDSave(DateFirstSale, isSubmit)
{
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {    
            var LastIndex = document.activeElement.id.lastIndexOf('_');
            var id = document.activeElement.id.substring(0,LastIndex+1);
            
            var firstSaleDate = id + "txtFirstSale";
            var gridYr = id + "gvYear";
               if(document.getElementById(gridYr).rows[1].childNodes[1].firstChild.value != "" || 
                   document.getElementById(gridYr).rows[1].childNodes[2].firstChild.value != "" ||
                   document.getElementById(gridYr).rows[1].childNodes[3].firstChild.value != "" ||        
                   document.getElementById(gridYr).rows[2].childNodes[1].firstChild.value != "" ||
                   document.getElementById(gridYr).rows[2].childNodes[2].firstChild.value != "" ||
                   document.getElementById(gridYr).rows[2].childNodes[3].firstChild.value != "" )
                   {
                     if (document.getElementById(firstSaleDate).value == "")
                     {
                        //Start of change by Candy on 19/11/2008 for case no:1210204-1
                        alert("Please enter 'Planned Date of First Sale' as you have entered Sales Price or Volumn data.");
                        //End of change by Candy on 19/11/2008 for case no:1210204-1
                       return false;
                    }
                   }
               }

             if(document.getElementById("ctl00_ermsContentPageHeader_hidMandetoryAGI").value == "yes")
             {
                 if(document.getElementById("ctl00_ermsContentPageHeader_txtAGI_Code_Reactivate").value == "")
                 {
                    alert("Please give AGI Code Reactivate Details")
                    return false;
                 }
             }
             if(document.getElementById("ctl00$ermsContentPageHeader$txtMarketing").value.length >1000)
	         {
	                alert("Maximum 1000 letters in the field Marketing");
	                return false;
	         }
	         //Start of change by Infosys for ERMS issue
             if(trim(document.getElementById("ctl00$ermsContentPageHeader$txtCountryPresCode").value)=="")
             {
                    alert("Presentation Code text field is a mandatory field");
                    return false;
             }
     //End of change by Infosys for ERMS issue
	         //Start of change by Infosys for ERMS issue
	      if(document.getElementById(gridYr).rows[1].childNodes[1].firstChild.value != "")
	      {
	         var salePrice=document.getElementById(gridYr).rows[1].childNodes[1].firstChild;
	         if (!fnValidateDecimal(salePrice.value))
	         {		    
			    alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			    salePrice.value = "";
			    salePrice.focus();
			    return false;
		     }
	         parseFloat(salePrice.value)
	         {
		        if(salePrice.value < 0 || salePrice.value > 9999999.99)
		        {		    
			       alert("Please Enter a valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			       salePrice.value = "";
			       salePrice.focus();
			       return false;
		        }
		        
			 }		          
	      }
	      if(document.getElementById(gridYr).rows[1].childNodes[2].firstChild.value != "")
	      {
	         var salePrice=document.getElementById(gridYr).rows[1].childNodes[2].firstChild;
	         if (!fnValidateDecimal(salePrice.value))
	         {		    
			    alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			    salePrice.value = "";
			    salePrice.focus();
			    return false;
		     }
	         parseFloat(salePrice.value)
	         {
		        if(salePrice.value < 0 || salePrice.value > 9999999.99)
		        {		    
			       alert("Please Enter a valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			       salePrice.value = "";
			       salePrice.focus();
			       return false;
		        }
		        
			 }		          
	      }
	      if(document.getElementById(gridYr).rows[1].childNodes[3].firstChild.value != "")
	      {
	         var salePrice=document.getElementById(gridYr).rows[1].childNodes[3].firstChild;
	         if (!fnValidateDecimal(salePrice.value))
	         {		    
			    alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			    salePrice.value = "";
			    salePrice.focus();
			    return false;
		     }
	         parseFloat(salePrice.value)
	         {
		        if(salePrice.value < 0 || salePrice.value > 9999999.99)
		        {		    
			       alert("Please Enter a valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			       salePrice.value = "";
			       salePrice.focus();
			       return false;
		        }
		       
			 }		          
	      }
	      if(document.getElementById(gridYr).rows[2].childNodes[1].firstChild.value != "")
	      {
	         var salePrice=document.getElementById(gridYr).rows[2].childNodes[1].firstChild;
	         if (!fnValidateDecimal(salePrice.value))
	         {		    
			    alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			    salePrice.value = "";
			    salePrice.focus();
			    return false;
		     }
	         parseFloat(salePrice.value)
	         {
		        if(salePrice.value < 0 || salePrice.value > 9999999.99)
		        {		    
			       alert("Please Enter a valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			       salePrice.value = "";
			       salePrice.focus();
			       return false;
		        }
		       
			 }		          
	      }
	      if(document.getElementById(gridYr).rows[2].childNodes[2].firstChild.value != "")
	      {
	         var salePrice=document.getElementById(gridYr).rows[2].childNodes[2].firstChild;
	         if (!fnValidateDecimal(salePrice.value))
	         {		    
			    alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			    salePrice.value = "";
			    salePrice.focus();
			    return false;
		     }
	         parseFloat(salePrice.value)
	         {
		        if(salePrice.value < 0 || salePrice.value > 9999999.99)
		        {		    
			       alert("Please Enter a valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			       salePrice.value = "";
			       salePrice.focus();
			       return false;
		        }
		       
			 }		          
	      }
	      if(document.getElementById(gridYr).rows[2].childNodes[3].firstChild.value != "")
	      {
	         var salePrice=document.getElementById(gridYr).rows[2].childNodes[3].firstChild;
	         if (!fnValidateDecimal(salePrice.value))
	         {		    
			    alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			    salePrice.value = "";
			    salePrice.focus();
			    return false;
		     }
	         parseFloat(salePrice.value)
	         {
		        if(salePrice.value < 0 || salePrice.value > 9999999.99)
		        {		    
			       alert("Please Enter a valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			       salePrice.value = "";
			       salePrice.focus();
			       return false;
		        }
		        
			 }		          
	      }
	      //End of change by Infosys for ERMS issue
    }
}

function fnValidateCombiPackFormD(DateFirstSale, isSubmit)
{
    
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
            var LastIndex = document.activeElement.id.lastIndexOf('_');
            var id = document.activeElement.id.substring(0,LastIndex+1);
           
            var UoM = id + "ddlUOM";
            var country  = id + "ddlCountryOfSale";
            var countryPresCode = id + "txtCountryPresCode";
            var firstSaleDate = id + "txtFirstSale";
            var regContact = id + "txtRegualtory";
            var gridYr = id + "gvYear";
            var localSourceYes = id + "rdSourceYes";
            var localSourceNo = id + "rdSourceNo";
           //start of code change on 16th May 2008
           var makeToOrder = id + "ddlMakeToOrder";
           //end
                if (document.getElementById(UoM).selectedIndex == 0)
                {
                    alert("Please select whether you want UOM as PC(Piece) or not");
                    return false;
                }
             if(document.getElementById("ctl00_ermsContentPageHeader_hidMandetoryAGI").value == "yes")
             {
                 if(document.getElementById("ctl00_ermsContentPageHeader_txtAGI_Code_Reactivate").value == "")
                 {
                    alert("Please give AGI Code Reactivate Details")
                    return false;
                 }
             } 
                
     //Start of change by Infosys for ERMS issue
     if(trim(document.getElementById("ctl00$ermsContentPageHeader$txtCountryPresCode").value)=="")
     {
        alert("Presentation Code text field is a mandatory field");
        return false;
     }
     //End of change by Infosys for ERMS issue 
                if (document.getElementById(makeToOrder).selectedIndex == 0)
                {
                    alert("Make To Order need to be selected");
                    return false;
                }                         
                if (document.getElementById(country).selectedIndex == 0)
                {
                    alert("Please select a Country of Sale value ");
                    return false;
                }
                
                if (document.getElementById(countryPresCode).value == "")
                {
                    alert("Please give Country Presentation Code Details ");
                    return false;
                }
                
                 if (document.getElementById(localSourceYes).checked == false)
                {
                    if (document.getElementById(localSourceNo).checked == false)
                    {
                        alert("Please Sourcing Details ");
                        return false;
                    }    
                }      
                if (document.getElementById(firstSaleDate).value == "")
                {
                    alert("Please give First Sale Date Details ");
                    return false;
                }
                
                
                if (document.getElementById(regContact).value == "")
                {
                    alert("Please give Regulatory Contact Details ");
                    return false;
                }
                
                if(document.getElementById(gridYr).rows[1].childNodes[1].firstChild.value == "" || 
                   document.getElementById(gridYr).rows[1].childNodes[2].firstChild.value == "" ||
                   document.getElementById(gridYr).rows[1].childNodes[3].firstChild.value == "" )        
                {
                    alert("Please give Sales Price Details ");
                    return false;
                }
                    
                if(document.getElementById(gridYr).rows[2].childNodes[1].firstChild.value == "" ||
                   document.getElementById(gridYr).rows[2].childNodes[2].firstChild.value == "" ||
                   document.getElementById(gridYr).rows[2].childNodes[3].firstChild.value == "" )
                {
                    alert("Please give Sales Volume Details ");
                    return false;
                }
                
                if(document.getElementById("ctl00$ermsContentPageHeader$txtMarketing").value.length >1000)
	            {
	                alert("Maximum 1000 letters in the field Marketing");
	                return false;
	            }
	            
	            //Start of change by Infosys for ERMS issue
	      if(document.getElementById(gridYr).rows[1].childNodes[1].firstChild.value != "")
	      {
	         var salePrice=document.getElementById(gridYr).rows[1].childNodes[1].firstChild;
	         if (!fnValidateDecimal(salePrice.value))
	         {		    
			    alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			    salePrice.value = "";
			    salePrice.focus();
			    return false;
		     }
	         parseFloat(salePrice.value)
	         {
		        if(salePrice.value < 0 || salePrice.value > 9999999.99)
		        {		    
			       alert("Please Enter a valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			       salePrice.value = "";
			       salePrice.focus();
			       return false;
		        }
		        
			 }		          
	      }
	      if(document.getElementById(gridYr).rows[1].childNodes[2].firstChild.value != "")
	      {
	         var salePrice=document.getElementById(gridYr).rows[1].childNodes[2].firstChild;
	         if (!fnValidateDecimal(salePrice.value))
	         {		    
			    alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			    salePrice.value = "";
			    salePrice.focus();
			    return false;
		     }
	         parseFloat(salePrice.value)
	         {
		        if(salePrice.value < 0 || salePrice.value > 9999999.99)
		        {		    
			       alert("Please Enter a valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			       salePrice.value = "";
			       salePrice.focus();
			       return false;
		        }
		        
			 }		          
	      }
	      if(document.getElementById(gridYr).rows[1].childNodes[3].firstChild.value != "")
	      {
	         var salePrice=document.getElementById(gridYr).rows[1].childNodes[3].firstChild;
	         if (!fnValidateDecimal(salePrice.value))
	         {		    
			    alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			    salePrice.value = "";
			    salePrice.focus();
			    return false;
		     }
	         parseFloat(salePrice.value)
	         {
		        if(salePrice.value < 0 || salePrice.value > 9999999.99)
		        {		    
			       alert("Please Enter a valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			       salePrice.value = "";
			       salePrice.focus();
			       return false;
		        }
		       
			 }		          
	      }
	      if(document.getElementById(gridYr).rows[2].childNodes[1].firstChild.value != "")
	      {
	         var salePrice=document.getElementById(gridYr).rows[2].childNodes[1].firstChild;
	         if (!fnValidateDecimal(salePrice.value))
	         {		    
			    alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			    salePrice.value = "";
			    salePrice.focus();
			    return false;
		     }
	         parseFloat(salePrice.value)
	         {
		        if(salePrice.value < 0 || salePrice.value > 9999999.99)
		        {		    
			       alert("Please Enter a valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			       salePrice.value = "";
			       salePrice.focus();
			       return false;
		        }
		       
			 }		          
	      }
	      if(document.getElementById(gridYr).rows[2].childNodes[2].firstChild.value != "")
	      {
	         var salePrice=document.getElementById(gridYr).rows[2].childNodes[2].firstChild;
	         if (!fnValidateDecimal(salePrice.value))
	         {		    
			    alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			    salePrice.value = "";
			    salePrice.focus();
			    return false;
		     }
	         parseFloat(salePrice.value)
	         {
		        if(salePrice.value < 0 || salePrice.value > 9999999.99)
		        {		    
			       alert("Please Enter a valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			       salePrice.value = "";
			       salePrice.focus();
			       return false;
		        }
		       
			 }		          
	      }
	      if(document.getElementById(gridYr).rows[2].childNodes[3].firstChild.value != "")
	      {
	         var salePrice=document.getElementById(gridYr).rows[2].childNodes[3].firstChild;
	         if (!fnValidateDecimal(salePrice.value))
	         {		    
			    alert("Please Enter valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			    salePrice.value = "";
			    salePrice.focus();
			    return false;
		     }
	         parseFloat(salePrice.value)
	         {
		        if(salePrice.value < 0 || salePrice.value > 9999999.99)
		        {		    
			       alert("Please Enter a valid quantity which contain decimal digits upto 2 places only for the sales price or volume");
			
			       salePrice.value = "";
			       salePrice.focus();
			       return false;
		        }
		        
			 }		          
	      }
	      //End of change by Infosys for ERMS issue
	            
                 if(isSubmit!=0)
               {
                    
                    var num=document.getElementById(firstSaleDate).value;
                    var arr=num.split("/");
                    var end = arr[1]+"/"+arr[0]+"/"+arr[2];
                    var date=CompareDate(end,DateFirstSale);
                     if(date==false)
                    {
                           if(confirm("Date of first sale is too early,Do you want to procced?"))
                           {
                             return true;
                           }
                           else
                           {
                             return false;
                           }
                     }
               }
        }
    }
}

function isNumber(s)
{   
 var i; 
  for (i = 0; i < s.length; i++) 
  { 
	// Check that current character is number. 
       var c = s.charAt(i); 
       if (((c < "0") || (c > "9"))) 
			return false; 
  }
 // All characters are numbers. 
 return true;
 } 
 
/**********************************************************************************************************
Function to Validate Mandatory Fields in EBM
***********************************************************************************************************/
function fnValidateEBM(approvalStep)
{
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
            var LastIndex = document.activeElement.id.lastIndexOf('_');
            var id = document.activeElement.id.substring(0,LastIndex+1);
            
            var requestApproved = id + "ddlRequestApproved";
            
            if (document.getElementById(requestApproved).selectedIndex == 0)
            {
                alert("Please select a Request Approved value ");
                return false;
            }
            //start of change by Tod Zhang for ERMS issue radio button 'added to Core Range'
            if(approvalStep==1)
            {
                var addToCoreRangeYes = id + "rdbCoreRangeYes";
                var addToCoreRangeNo = id + "rdbCoreRangeNo";
                if(document.getElementById(addToCoreRangeYes)!=null)
                if(document.getElementById(addToCoreRangeYes).checked == false && document.getElementById(addToCoreRangeNo).checked == false && document.getElementById(requestApproved).selectedIndex!=3)
                {
                    alert("Please select whether it is Add To Core Range or not.");
                    return false;
                }
            }
            //end of change by Tod Zhang
         }
    }
}

/**********************************************************************************************************
Function to enable disable textboxes on Selection of a Lead AI from the dropdown
***********************************************************************************************************/
function fnLeadAIChanged()
{
    //debugger;
    var LastIndex = document.activeElement.id.lastIndexOf('_');
    var id = document.activeElement.id.substring(0,LastIndex+1);
    var leadAI = id + "ddlLeadAI";
    var newLeadAI = id + "txtLeadAI";
    
    if (document.getElementById(leadAI).selectedIndex == 0)
    {
        document.getElementById(newLeadAI).disabled = false;
        document.getElementById(newLeadAI).value = "";
    }
    else
    {
        document.getElementById(newLeadAI).value = "";
        document.getElementById(newLeadAI).disabled = true;
    }
}
/*******************************************************************************************************************
For Validating IDS Screen
******************************************************************************************************************/
function fnValidateIDS()
{
//debugger;
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
               if(document.getElementById("ctl00_ermsContentPageHeader_txtCombiDesignCode").value=="")
               {
                  alert("Design Code text field is a mandatory field");
                  return false;
               }
               if(document.getElementById("ctl00_ermsContentPageHeader_txtCombiUCAgiCode").value=="")
               {
                  alert("UC Agi Code text field is a mandatory field");
                  return false;
               }
         }
     }
}
/*********************************************************************************************************************
Function to validate SCTeam Screen for combipack
********************************************************************************************************************/
//start of change by srikanth on 18th July for case no:1158419
//receving one more aurgument
function fnValidateSCTeam(Type,frm)
//end of change by srikanth on 18th July for case no:1158419
{
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
            var Reqtype = document.getElementById(Type);
            
            if(Reqtype.value==4)
            {  
                  var LastIndex = document.activeElement.id.lastIndexOf('_');
                  var id = document.activeElement.id.substring(0,LastIndex+1);
                  var approved=id + "ddlPackagingApproved";
                  var PackTech = id + "ddlPackTech";
                   var dataApproved=id + "ddlDataManagApproved";
                  var dataDate = id + "txtDateOfComp";
                 
                 //start of change by srikanth on 18th July for case no:1158419
                 if(frm==0)
                 {
                     if(document.getElementById(approved).selectedIndex != 0 || document.getElementById("ctl00_ermsContentPageHeader_txtPackagingComments").value!="" )
                     {        
                          if(document.getElementById(PackTech).selectedIndex == 0)
                           {
                              alert("Please select Pack Technologist name");
                              return false;
                           }
                     }
                 }
                 else
                 {
                     if(document.getElementById(dataApproved).selectedIndex != 0 || document.getElementById("ctl00_ermsContentPageHeader_txtDataManagComments").value!="" )
                     {        
                          if(document.getElementById(dataDate).value == "")
                           {
                              alert("Please select EST Date of Completion");
                              return false;
                           }
                     }
                 }
                 //end of change by srikanth on 18th July for case no:1158419
            }
        }
    }
}
/*********************************************************************************************************************
Date code due validation
********************************************************************************************************************/
function Convert(date)
{
// ensure date is in format "dd/mm/yyyy" or "dd/mm/yyyy hh:mm:ss"
    var arr = date.split("/");
    return arr[0]+"/"+arr[1]+"/"+arr[2];    
}
function CompareDate(end,start)
{
    var d_start = new Date(Convert(start)); 
    var d_end = new Date(Convert(end));
    var d_now = new Date();

    // now, you can compare them
    if(d_end<d_start) 
    return false;
   // if((d_end-d_start)/(24*60*60*1000) > 30) return false;
    else
    return true;
}

function fnNPSaveMandatoryCheck(requestType, DateFirstSale, isSubmit, isChild)
{
   debugger;
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
            var LastIndex = document.activeElement.id.lastIndexOf('_');
            var id = document.activeElement.id.substring(0,LastIndex+1);
            var leadAI = id + "ddlLeadAI";
            var newLeadAI = id + "txtLeadAI";
            var designCode = id + "txtDesignCode";
            var UCAGICode = id + "txtUCAgiCode";
            var qty = id + "txtQtyOrPackSize";
            var configuration = id + "txtConfig";
            var UoM = id + "ddlUoM";
            var gridYr = id + "gvYear";
            var firstSaleDate = id + "txtFirstSale";                 
             if(document.getElementById("ctl00_ermsContentPageHeader_hidMandetoryAGI").value == "yes")
             {
                 if(document.getElementById("ctl00_ermsContentPageHeader_txtAGI_Code_Reactivate").value == "")
                 {
                    alert("Please give AGI Code Reactivate Details")
                    return false;
                 }
             }       
               
             // For New Pack
             if((requestType == 2 || requestType == 3) && isChild != 1)
             {
                if(document.getElementById(newLeadAI))
                {
                    if(document.getElementById(leadAI))
                    {                        
                    }
                    else                    
                    {    
                        if(document.getElementById(newLeadAI).value == "")
                        {                    
                            alert("Please give Lead AI Details ");
                            return false; 
                        }                          
                    }
                }
                
                if(document.getElementById(leadAI))
                {
                    if(document.getElementById(leadAI).selectedIndex == 0)
                    {
                        if (document.getElementById(newLeadAI).value == "")
                        {
                            alert("Please give Lead AI Details ");
                            return false;
                        }        
                    }
                }
                     
                if(document.getElementById(designCode))
                {
                if (document.getElementById(designCode).value == "")
                    {
                        alert("Please give Design Code Details ");
                        return false;
                    }
                }
                
                if(document.getElementById(UCAGICode))
                {
                if (document.getElementById(UCAGICode).value == "")
                    {
                        alert("Please give UC AGI Code Details ");
                        return false;
                    }
                }
                if (document.getElementById(qty).value == "")
                {
                    alert("Please give Quantity Details ");
                    return false;
                }
                    
                if (document.getElementById(configuration).value == "")
                {
                    alert("Please give Configuration/Collation Details ");
                    return false;
                }
                
                if (document.getElementById(UoM).selectedIndex == 0)
                {
                    alert("Please select a UOM value ");
                    return false;
                }
                //start change for requirement number 12
                if(requestType ==2)
                {
                  var IsSynPack =id+"ddlIsSynBrdPackReq";
                  if (document.getElementById(IsSynPack).selectedIndex == 0)
                  {
                     alert("Please select do you require Syngenta branded pack value");
                     return false;
                  }
                }
                //end
                if(requestType == 3)
                {
                    if(document.getElementById("ctl00$ermsContentPageHeader$txtMarketing").value.length > 1000)
	                {
	                    alert("Maximum 1000 letters in the field Marketing");
	                    return false;
	                }
                }
                

                
                if(document.getElementById(gridYr).rows[1].childNodes[1].firstChild.value != "" || 
                   document.getElementById(gridYr).rows[1].childNodes[2].firstChild.value != "" ||
                   document.getElementById(gridYr).rows[1].childNodes[3].firstChild.value != "" ||        
                   document.getElementById(gridYr).rows[2].childNodes[1].firstChild.value != "" ||
                   document.getElementById(gridYr).rows[2].childNodes[2].firstChild.value != "" ||
                   document.getElementById(gridYr).rows[2].childNodes[3].firstChild.value != "" )
                   {
                     if (document.getElementById(firstSaleDate).value == "")
                     {
                        //Start of change by Candy on 19/11/2008 for case no:1210204-1
                        alert("Please enter 'Planned Date of First Sale' as you have entered Sales Price or Volumn data.");
                        //End of change by Candy on 19/11/2008 for case no:1210204-1
                        return false;
                    }
                   }
                                
                 if(requestType == 2)
                {
                    if(document.getElementById("ctl00$ermsContentPageHeader$txtMarketing")==null&&document.getElementById("ctl00$ermsContentPageHeader$txtSupliers")==null)
                    {
	                    return true;
                    }
                    else
                    {
                        if(document.getElementById("ctl00$ermsContentPageHeader$txtMarketing").value.length <= 1000)
	                       if(document.getElementById("ctl00$ermsContentPageHeader$txtSupliers").value.length <= 100)
	                              return true;
	                       else 
	                       {
	                                alert("Maximum 100 letters in the field Suppller");
	                                return false;
	                       }		 
	                   else
	                   {
	                       alert("Maximum 1000 letters in the field Marketing");
	                       return false;
	                    }
                     }
                }
                
             }
             
             
             // For CombiPack Child
             if(isChild == 1 )
             {
                 if (document.getElementById(newLeadAI).value == "")
                    {
                        alert("Please give Lead AI Details ");
                        return false;
                    }
                 if (document.getElementById(designCode).value == "")
                    {
                        alert("Please give Design Code Details ");
                        return false;
                    }
                
                if (document.getElementById(UCAGICode).value == "")
                    {
                        alert("Please give UC AGI Code Details ");
                        return false;
                    }
                    
                if (document.getElementById(qty).value == "")
                {
                    alert("Please give Quantity Details ");
                    return false;
                }
               
                if (document.getElementById(configuration).value == "")
                {
                    alert("Please give Configuration/Collation Details ");
                    return false;
                }
                
                if (document.getElementById(UoM).selectedIndex == 0)
                {
                    alert("Please select a UOM value ");
                    return false;
                }
                 //start change on 30th May for req no:12
                var IsSynPack =id+"ddlIsSynBrdPackReq";
                if (document.getElementById(IsSynPack).selectedIndex == 0)
                {
                     alert("Please select do you require Syngenta branded pack value");
                     return false;
                }
                //end
                    
             }
        }     
    }   
}

function fnEPTSaveMandatoryCheck(start,type,i)
{
    if(document.activeElement.id)
    {
         if(document.getElementById(document.activeElement.id).disabled == false)
         {
           if(i!=1)
           {
             if(document.getElementById("ctl00_ermsContentPageHeader_ddlLeadAI").selectedIndex==0 && document.getElementById("ctl00_ermsContentPageHeader_txtLeadAI").value=="")
             {                                                                                                               
                alert("LeadAI need to be selected or typed");
                return false;
             }
           }
           if(document.getElementById("ctl00_ermsContentPageHeader_txtDesignCode").value=="")
           {
              alert("Design Code text field is a mandatory field");
             return false;
           }
           if(document.getElementById("ctl00_ermsContentPageHeader_txtUCAgiCode").value=="")
           {
              alert("Uc Agi Code text field is a mandatory field");
              return false;
           }
           if(document.getElementById("ctl00_ermsContentPageHeader_txtQtyOrPackSize").value=="")
           {
              alert("Quantity/Primary Pack Size text field is a mandatory field");
              return false;
           }
           if(document.getElementById("ctl00_ermsContentPageHeader_txtConfig").value=="")
           {
              alert("Configuration/Collation text field is a mandatory field");
              return false;
           }
           //Start of chagne by Infosys for ERMS issue
           if(trim(document.getElementById("ctl00_ermsContentPageHeader_txtCountryPresCode").value)=="")
           {
              document.getElementById("ctl00_ermsContentPageHeader_txtCountryPresCode").value="";
              alert("Country Pres Code text field is a mandatory field");
              return false;
           }
           if(trim(document.getElementById("ctl00_ermsContentPageHeader_txtQtyOrPackSize").value)==0)
           {
              alert("Quantity/Primary Pack Size should not be 0");
              return false;
           }
           
           if(document.getElementById("ctl00_ermsContentPageHeader_ddlAncillariesYesNo")!=null && document.getElementById("ctl00_ermsContentPageHeader_txtAncillariesComments")!=null)
	       if(document.getElementById("ctl00_ermsContentPageHeader_ddlAncillariesYesNo").selectedIndex==1 && trim(document.getElementById("ctl00_ermsContentPageHeader_txtAncillariesComments").value)=="")
	       {
	            document.getElementById("ctl00_ermsContentPageHeader_txtAncillariesComments").value="";
	            alert("Please enter comments for Ancillaries/Special Requirements");
	            return false;
	       }
           //End of chagne by Infosys for ERMS issue
           if(document.getElementById("ctl00_ermsContentPageHeader_ddlUoM").selectedIndex==0)
           {
              alert("UoM need to be selected");
              return false;
           }
           if (i==1)
           {
                if(document.getElementById("ctl00_ermsContentPageHeader_ddlCountryOfSale").selectedIndex==0)
                {
                     alert("Country of sale need to be selected for copy request");
                        return false;
                }
           }
           //start of change by Infosys for erms case 1157496
           if(document.getElementById("ctl00_ermsContentPageHeader_txtComment").value.length > 1000)
	       {
	           alert("Maximum 1000 letters in the field Comment");
	          return false;
	       }
	       //end of change by Infosys  
              return true; 
        }
    }   
}

function fnNPDisabletxtArea()
{
//debugger;
 if (document.getElementById("ctl00_ermsContentPageHeader_ddlAncillariesYesNo").selectedIndex == 1 )
        document.getElementById("ctl00_ermsContentPageHeader_txtAncillariesComments").disabled = false;
 else
    {
        document.getElementById("ctl00_ermsContentPageHeader_txtAncillariesComments").disabled = true;
        document.getElementById("ctl00_ermsContentPageHeader_txtAncillariesComments").text = "";
    }
}

function trimAll(sString) 
{
    while (sString.substring(0,1) == ' ')
    {
        sString = sString.substring(1, sString.length);
    }
    while (sString.substring(sString.length-1, sString.length) == ' ')
    {
        sString = sString.substring(0,sString.length-1);
    }
 return sString;
} 

function fnUpdateComment(user,dt,id)
{  
    var arr = dt.split("/");
    var date=arr[1]+"/"+arr[0]+"/"+arr[2];    
 var textId=document.getElementById(document.activeElement.id);
 var text = textId.options[textId.selectedIndex].text;
   if(text !='select')
   {   
       var ctl=document.getElementById(id);
       ctl.value=text+"\n"+'Stated by:'+ user + "\n"+'On:'+ date + "\n" +"\n"+ctl.value;
   }
}

function fnAssignSelectedValue(ctl)
{ 
  var hdnValue=document.getElementById(ctl);
  var textId=document.getElementById(document.activeElement.id);
  hdnValue.value= textId.value;
}
//start of change by Tod Zhang
/*
function fnSCTeamSetOutcome(user,dt,id,OutCome,hdnOutCome,txtResolve,by,hdnLocalComment,hdnGlobalComment)
{    
    var arr = dt.split("/");
    var date=arr[1]+"/"+arr[0]+"/"+arr[2];    
    var Comments = document.activeElement.id;
    var hdnValue= document.getElementById(hdnOutCome);
    if(document.getElementById(Comments).value == '17')
    {
        document.getElementById(OutCome).value = '48';
    }
    hdnValue.value=document.getElementById(OutCome).value;
     var textId=document.getElementById(document.activeElement.id);
    var text = textId.options[textId.selectedIndex].text;
   if(text !='select')
   {   
       var ctl=document.getElementById(id);
       var resolve=document.getElementById(txtResolve);
       resolve.value=text+' '+'Stated by:'+ by +"\n"+ user + "\n"+'On:'+ date + "\n" +"\n"+resolve.value;
       document.getElementById(hdnGlobalComment).value=resolve.value;
       ctl.value=text+' '+'Stated by:'+ by +"\n"+user + "\n"+'On:'+ date + "\n" +"\n"+ctl.value;
       document.getElementById(hdnLocalComment).value=ctl.value;
   }
}*/
function fnSCTeamSetOutcome(user,dt,id,OutCome,hdnOutCome,txtResolve,by,hdnLocalComment,hdnGlobalComment,txt1,ddl1,txt2,ddl2)
{    
    var arr = dt.split("/");
    var date=arr[1]+"/"+arr[0]+"/"+arr[2];    
    var Comments = document.activeElement.id;
    var hdnValue= document.getElementById(hdnOutCome);
    if(document.getElementById(Comments).value == '17')
    {
   
        document.getElementById(OutCome).value = '48';

    }
    if(document.getElementById(Comments).value == '18'&&document.getElementById(ddl1).value == '18'&&document.getElementById(ddl2).value == '18')
    {
       if(document.getElementById(txtResolve).value.indexOf('Concern')!=-1||document.getElementById(txt1).value.indexOf('Concern')!=-1||document.getElementById(txt2).value.indexOf('Concern')!=-1)
       {
           document.getElementById(OutCome).value ='49';
       }
       else
       {
           document.getElementById(OutCome).value ='19';
       }
    }
    hdnValue.value=document.getElementById(OutCome).value;
     var textId=document.getElementById(document.activeElement.id);
    var text = textId.options[textId.selectedIndex].text;
   if(text !='select')
   {   
       var ctl=document.getElementById(id);
       var resolve=document.getElementById(txtResolve);
       resolve.value=text+' '+'Stated by:'+ by +"\n"+ user + "\n"+'On:'+ date + "\n" +"\n"+resolve.value;
       document.getElementById(hdnGlobalComment).value=resolve.value;
       //Start of change by for case 1204225 on 19/11/2008
       //ctl.value=text+' '+'Stated by:'+ by +"\n"+user + "\n"+'On:'+ date + "\n" +"\n"+ctl.value;
       ctl.value=text + "\n" +"\n"+ctl.value;
       //End of change by for case 1204225 on 19/11/2008
       //document.getElementById(hdnLocalComment).value=ctl.value;
   }
}
//Start of the change for case IM00142483 by Joko Wang
function fnSCTeamSetOutcome1(user,dt,id,OutCome,hdnOutCome,txtResolve,by,hdnLocalComment,hdnGlobalComment,txt1,ddl1,txt2,ddl2,txt3,ddl3,txt4,ddl4)
{    
    var arr = dt.split("/");
    var date=arr[0]+"/"+arr[1]+"/"+arr[2];    
    var Comments = document.activeElement.id;
    var hdnValue= document.getElementById(hdnOutCome);
    if(document.getElementById(Comments).value == '17')
    {
        document.getElementById(OutCome).value = '48';
    }
    if(document.getElementById(Comments).value == '18'&&document.getElementById(ddl1).value == '18'&&document.getElementById(ddl2).value == '18'&&document.getElementById(ddl3).value == '18'&&document.getElementById(ddl4).value == '18')
    {
       if(document.getElementById(txtResolve).value.indexOf('Concern')!=-1||document.getElementById(txt1).value.indexOf('Concern')!=-1||document.getElementById(txt2).value.indexOf('Concern')!=-1||document.getElementById(txt3).value.indexOf('Concern')!=-1||document.getElementById(txt4).value.indexOf('Concern')!=-1)
       {
           document.getElementById(OutCome).value ='49';
       }
       else
       {
           document.getElementById(OutCome).value ='19';
       }
    }
    hdnValue.value=document.getElementById(OutCome).value;
     var textId=document.getElementById(document.activeElement.id);
    var text = textId.options[textId.selectedIndex].text;
   if(text !='select')
   {   
       var ctl=document.getElementById(id);
       var resolve=document.getElementById(txtResolve);
       resolve.value=text+' '+'Stated by:'+ by +"\n"+ user + "\n"+'On:'+ date + "\n" +"\n"+resolve.value;
       document.getElementById(hdnGlobalComment).value=resolve.value;
//       if(ctl.value == '')
//       {
//            ctl.value=ctl.value  + text+' '+'Stated by:'+ by +"\n"+user + "\n"+'On:'+ date + "\n";
//       }
//       else
//       {
//            ctl.value=ctl.value  +"\n"+"\n" + text+' '+'Stated by:'+ by +"\n"+user + "\n"+'On:'+ date;
//       }       
         ctl.value=text + "\n" +"\n"+ctl.value;
         //document.getElementById(hdnLocalComment).value=ctl.value;
   }
}
//End of the change for case IM00142483 by Joko Wang
//end of change by Tod Zhang

//Start Change for enhancement issue no.1
//hit on enter button should give results 
function fnAddonKeyPress(obj,e)
{
    var imgbt = document.getElementById("ctl00_ermsContentPage_btnSearch");
     if(e.keyCode==13)
      {
         imgbt.click();
         e.returnValue = false;
      }
      else
      {	
         if(obj.value==obj.defaultValue)
         {
            obj.value = "";
         }
      }
}
function fnSetFocusOnSearchButton()
{
var imgbt = document.getElementById("ctl00_ermsContentPage_btnSearch");
imgbt.focus();   
}
//End Change for enhancement

//start code change on 16th May
function fnSCTeamMandatoryChk()
{
    //Start of change for case 1213895 on 20/11/2008
//   var ddl=document.getElementById("ctl00_ermsContentPageHeader_ddlPackRes");
//   
//   if(ddl.selectedIndex==0)
//   {
//       alert("Please select Pack Responsibility");
//       return false;
//   }
   //End of change for case 1213895 on 20/11/2008
   
   // Start change for Approved and Pack Responsibility are mandatory by Candy Wang on 13 Oct 2009
   var LastIndex = document.activeElement.id.lastIndexOf('_');
   var id = document.activeElement.id.substring(0,LastIndex+1);
   
   var ddlApproved = id + "ddlApproved";
   var ddlPackRes = id + "ddlPackRes";
   
   if(document.getElementById(ddlApproved).selectedIndex == 0)
   {
        alert("Approved drop down list is a mandatory field");
        return false;
   }
   
   if(document.getElementById(ddlPackRes).selectedIndex == 0)
   {
        alert("Pack Responsibility drop down list is a mandatory field");
        return false;
   }

   // End change by Candy Wang on 13 Oct 2009
	     
   if(document.getElementById("ctl00$ermsContentPageHeader$txtComments").value.length > 1000)
   {
       alert("Maximum 1000 letters in the field Comments");
       return false;
   }	  
}

function fnSCTeamMandatorySave()
{
   if(document.getElementById("ctl00$ermsContentPageHeader$txtComments").value.length > 1000)
   {
       alert("Maximum 1000 letters in the field Comments");
       return false;
   }
}
//end
//start code change on 29th May
function fnSaveonKeyPress(obj,e)
{
    var imgbt = document.getElementById("ctl00_ermsContentPageHeader_imgSave");
     if(e.keyCode==13)
      {
         imgbt.click();
         e.returnValue = false;
      }
}
//end


function fnValidatePackTechForSave3(isDisableSubmit3)
{
   var NSUCode=document.getElementById("ctl00$ermsContentPageHeader$txtNSUCode");
   var BPSCode=document.getElementById("ctl00$ermsContentPageHeader$txtBSPAgiCode");
   if(NSUCode.value == "" && BPSCode.value == "")
   {
       alert("Please raises NSU code or BPS code.");
       return false;
   }
   if(isDisableSubmit3=="False" && (NSUCode.value == "" || BPSCode.value == ""))
   {
       alert("Please don't remove NSU code or BPS code.");
       return false;
   }
   
}