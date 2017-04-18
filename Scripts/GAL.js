var strUserInfo = "";
var CountofUsers = 0;
var istart;
var iStartingIndex = 0;
var iEndingIndex = 0;
var strResult = "";
var strFirstName = "";
var strLastName = "";
var strMail = "";
var strUserId = "";
var strDomainname = "";
var strTel1 = "";
var strTel2 = "";
var strMobile = "";
var strTitle = "";

function PickAdd(txtDisplayName, txtUserFName, txtUserLName, txtTitle, txtRegion, txtCountry, hdnMail, hdnUserId) {
    //window.open("UserPicker/modal.html?Select Users");
    //strUserInfo = null;
    strUserInfo = window.showModalDialog("../UserPicker/modal.html", "ab.xbap?rand=" + new Date().getTime(), "dialogHeight:450px; dialogWidth:800px; resizable:no; scroll:no; status:no;");
    //var path = application.getRealPath(request.getRequestURI());
    //alert(path);
    //alert(strUserInfo);
    strUserInfo = strUserInfo.split('"').join("");

    //Display message if no id selected 
    var index = strUserInfo.indexOf("msDS-PrincipalName", 0);
    if (index == -1) {
        alert("No Id Selected..!");
        return;
    }

    //Count no of id's selected     
    var CountofUsers = 0;
    while (index > 0) {
        CountofUsers = CountofUsers + 1;
        index = strUserInfo.indexOf("msDS-PrincipalName", index + 1);
    }

    //Exit function, if morethan 1 user details selected 
    if (CountofUsers > 1) {
        alert("You cannot choose multiple users. Please choose only one user to proceed.");
        return;
    }

    //facsimiletelephonenumber
    //Result("facsimiletelephonenumber:");
    //strTel2 = strResult;

    //First name
    Result("givenName:");
    strFirstName = strResult;

    //Email
    Result("mail:");
    strMail = strResult;

    //strMobile
    //Result("mobile:");
    //strMobile = strResult;

    //domain
    Result("msDS-PrincipalName:");
    strDomainname = strResult.split("\\")[0];

    //UserId 
    Result("sAMAccountName:");
    strUserId = strResult;

    //Last name: 
    Result("sn:");
    strLastName = strResult;

    //telephonenumber
    //Result("telephonenumber:");
    //strTel1 = strResult;

    //title
    Result("title:");
    strTitle = strResult;
    //document.getElementById("txtCurEmpyDisp").innerText = strFirstName + " " + strLastName;
    //document.getElementById(txtUserLName).innerText = strLastName;
    //document.getElementById(txtUserFName).innerText = strFirstName;
    //document.getElementById(hdnMail).innerText = strMail;
    //document.getElementById(hdnUserId).innerText = strUserId;

    txtUserLName = strLastName;
    txtUserFName = strFirstName;
    hdnMail = strMail;
    hdnUserId = strUserId;

    var userDetails = { "UserId": strUserId, "FirstName": strFirstName, "LastName": strLastName, "Email": strMail, "Domain": strDomainname }

    return userDetails;
}
//Function to finding specific information of selected id 
function Result(SearchString) {
    strResult = "";
    iStartingIndex = strUserInfo.indexOf(SearchString, 0);
    if (iStartingIndex !== -1) {
        strUserInfo = strUserInfo.substring(iStartingIndex, strUserInfo.length);
        iEndingIndex = strUserInfo.indexOf(",", 0);
        strResult = strUserInfo.substring(SearchString.length, iEndingIndex);
    }
    return strResult;
}

