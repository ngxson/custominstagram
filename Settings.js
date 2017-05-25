// defaul settings

if (localStorage.getItem("IDH_place_for_saving") == null) {
  localStorage.setItem("IDH_place_for_saving", "local");
}
if (localStorage.getItem("IDH_language") == null) {
  localStorage.setItem("IDH_language", "en");
}
if (localStorage.getItem("IDH_size_box") == null) {
  localStorage.setItem("IDH_size_box", "40px");
}
if (localStorage.getItem("IDH_format_file_name") == null) {
  localStorage.setItem("IDH_format_file_name", "23");
}
if (localStorage.getItem("IDH_appearance_download") == null) {
  localStorage.setItem("IDH_appearance_download", "1");
}
if (localStorage.getItem("IDH_appearance_download_all") == null) {
  localStorage.setItem("IDH_appearance_download_all", "1");
}
if (localStorage.getItem("IDH_appearance_preview") == null) {
  localStorage.setItem("IDH_appearance_preview", "1");
}
if (localStorage.getItem("IDH_appearance_share") == null) {
  localStorage.setItem("IDH_appearance_share", "1");
}
if (localStorage.getItem("IDH_appearance_story_bar") == null) {
  localStorage.setItem("IDH_appearance_story_bar", "1");
}
if (localStorage.getItem("IDH_appearance_dw_all") == null) {
    localStorage.setItem("IDH_appearance_dw_all", "1");
}

var totalUsers = 0;

var httpRequest = new XMLHttpRequest();
window.httpRequest = httpRequest;
httpRequest.open('GET', 'https://chrome.google.com/webstore/detail/instag-downloader/jnkdcmgmnegofdddphijckfagibepdlb?hl=ru');
httpRequest.onreadystatechange = function(){
    if (httpRequest.readyState == 4) {
        totalUsers = httpRequest.response.split('Пользователей:')[1].split('"')[0];
        var version = "";
        try {
            var version = chrome.app.getDetails().version;
        } catch (e) {

        }
        //console.log(version);
        $('#app_info').text("Version: " +version+ " /  Users: "+totalUsers);
    }
}
httpRequest.send();

function PopupCenter(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop - 100;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
}

showProperty();

$('#preloaderDonateImage').attr('src',chrome.extension.getURL("loading.gif"));

$("#button_close_message").click(function() {
$('#message_save_data').hide();
    return false;
});

$("#donatePayPal").click(function() {
$('#preloaderDonate').show();
});

$("#radio_language").change(function (){
    setProperty();
    showProperty();
});

$("#getPermission").click(function (){
PopupCenter('https://script.google.com/macros/s/AKfycbwVo5ozjjFQ_-PdAgZa_Bw71ujgEsjlCo-1D19ty4-Iad87oCA/exec', "Instagram download", 400, 450);
//PopupCenter('saveToDrive.html', "Instagram download", 400, 300);
});

$("#placeForSaveing").change(function (){

    if(document.getElementById("driveSave").checked){
    document.getElementById("getPermission").style.pointerEvents="";
    document.getElementById("getPermission").style.color="blue";
    } else {
        //$("#getPermission").hide();
        document.getElementById("getPermission").style.pointerEvents="none";
        document.getElementById("getPermission").style.color="gray";
    }
});
// Choose file name
$("#addtofilenamedefaultformat").change(function (){
    ShowExample(getMaskFileName());
});
$("#addtofilenamenick").change(function (){
    ShowExample(getMaskFileName());
});
$("#addtofilenamedatetime").change(function (){
    ShowExample(getMaskFileName());
});

function getMaskFileName(){
    var mask = "";
    if ($("#addtofilenamedefaultformat").prop("checked")){
        mask+="1";
    }
    if ($("#addtofilenamenick").prop("checked")){
        mask+="2";
    }
    if ($("#addtofilenamedatetime").prop("checked")){
        mask+="3";
    }
    return mask;
}

function ShowExample(mask){

    switch (mask) {
        case "1":
            $("#example_format_file_name").html('Default.jpg');
            break
        case "12":
            $("#example_format_file_name").html('Default_NickName.jpg');
            break
        case "123":
            $("#example_format_file_name").html('Default_NickName_Date.jpg');
            break
        case "13":
            $("#example_format_file_name").html('Default_Date.jpg');
            break
        case "23":
            $("#example_format_file_name").html('NickName_Date.jpg');
            break
        case "3":
            $("#example_format_file_name").html('Date.jpg');
            break
        default:
            $("#example_format_file_name").html('Not a unique name');
    }
    if (mask == "1" || mask == "12" || mask == "123" || mask == "13" || mask == "23" || mask == "3"){
        $("#example_format_file_name").attr('class', '');
        $("#SaveProperty").attr('class', 'btn btn-success');
    } else {
        $("#example_format_file_name").attr('class', 'text-danger');
        $("#SaveProperty").attr('class', 'btn btn-success disabled');
    }
}
function ShowExampleSetChecked(mask){
    if (mask.indexOf("1") != -1){
        $("#addtofilenamedefaultformat").attr("checked", "");
    }
    if (mask.indexOf("2") != -1){
        $("#addtofilenamenick").attr("checked", "");
    }
    if (mask.indexOf("3") != -1){
        $("#addtofilenamedatetime").attr("checked", "");
    }
}

$("#SaveProperty").click(function() {

    setProperty();

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        //console.log(tabs[0].id)
        chrome.tabs.sendMessage(tabs[0].id, { text: "IDH_language:" + localStorage.getItem("IDH_language")});
        chrome.tabs.sendMessage(tabs[0].id, { text: "IDH_size_box:" + localStorage.getItem("IDH_size_box")});
        chrome.tabs.sendMessage(tabs[0].id, { text: "IDH_place_for_saving:" + localStorage.getItem("IDH_place_for_saving")});
        chrome.tabs.sendMessage(tabs[0].id, { text: "IDH_format_file_name:" + localStorage.getItem("IDH_format_file_name")});
        chrome.tabs.sendMessage(tabs[0].id, { text: "IDH_appearance_download:" + localStorage.getItem("IDH_appearance_download")});
        chrome.tabs.sendMessage(tabs[0].id, { text: "IDH_appearance_dw_all:" + localStorage.getItem("IDH_appearance_download_all")});
        chrome.tabs.sendMessage(tabs[0].id, { text: "IDH_appearance_preview:" + localStorage.getItem("IDH_appearance_preview")});
        chrome.tabs.sendMessage(tabs[0].id, { text: "IDH_appearance_share:" + localStorage.getItem("IDH_appearance_share")});
        chrome.tabs.sendMessage(tabs[0].id, { text: "IDH_appearance_story_bar:" + localStorage.getItem("IDH_appearance_story_bar")});
    });
    var now = new Date().getTime();
    while(new Date().getTime() < now + 500){ /* do nothing */ }
    window.close()
});

function setProperty (){
    if ($("#languageEn").is(':checked')){
    localStorage.setItem("IDH_language", "en");
    } else {
    localStorage.setItem("IDH_language", "ru");
    }

    if ($("#localSave").is(':checked')){
    localStorage.setItem("IDH_place_for_saving", "local");
    } else {
    localStorage.setItem("IDH_place_for_saving", "drive");
    }

    if ($("#hoverSizeSmall").is(':checked')){
    localStorage.setItem("IDH_size_box", "40px");
    } else if ($("#hoverSizeDefault").is(':checked')){
    localStorage.setItem("IDH_size_box", "75px");}
    else {
        localStorage.setItem("IDH_size_box", "100px");
    }

    var mask = getMaskFileName();
    if (mask == "1" || mask == "12" || mask == "123" || mask == "13" || mask == "23" || mask == "3"){
        localStorage.setItem("IDH_format_file_name", mask);
    } else {
        localStorage.setItem("IDH_format_file_name", "23");
    }
    // Appearance
    if ($("#appearance_download").prop("checked")){
        localStorage.setItem("IDH_appearance_download", "1");
    } else
    {
       localStorage.setItem("IDH_appearance_download", "0");
    }
    if ($("#appearance_story_bar").prop("checked")){
        localStorage.setItem("IDH_appearance_story_bar", "1");
    } else
    {
       localStorage.setItem("IDH_appearance_story_bar", "0");
    }
    if ($("#appearance_download_all").prop("checked")){
        localStorage.setItem("IDH_appearance_download_all", "1");
    } else
    {
       localStorage.setItem("IDH_appearance_download_all", "0");
    }
    if ($("#appearance_preview").prop("checked")){
        localStorage.setItem("IDH_appearance_preview", "1");
    } else
    {
       localStorage.setItem("IDH_appearance_preview", "0");
    }
    if ($("#appearance_share").prop("checked")){
        localStorage.setItem("IDH_appearance_share", "1");
    } else
    {
       localStorage.setItem("IDH_appearance_share", "0");
    }
};

function showProperty() {

ShowExample(localStorage.getItem("IDH_format_file_name"));
ShowExampleSetChecked(localStorage.getItem("IDH_format_file_name"));

if (localStorage.getItem("IDH_language") == "en"){
    $("#settings").text("Settings");
    $("#getPermission").text("Permission for using Google Drive");
    $("#panel_language").text("Language");
    $("#panel_storage_to_save").text("Save Media To");
    $("#local_save").html('<input type="radio" name="optionsRadios2" id="localSave" value="local">Local Storage');
    $("#panel_size_hover_box").text("Icons Hover Box Size");
    $("#text_message").text("Saving Changes Will Reload The Page");
    $("#SaveProperty").text("Save");
    $("#label_saved_file_name_format").text("Saved File Name Includes");
    $("#example_format_file_name_lb").text("Ex.: ");
    $("#languageEn").prop('checked', true)
    $("#label_appearance").text("Show These Buttons");

} else {
    $("#settings").text("Настройки");
    $("#getPermission").text("Разрешение на использование Google Drive");
    $("#panel_language").text("Язык");
    $("#panel_storage_to_save").text("Место Для Сохранения");
    $("#local_save").html('<input type="radio" name="optionsRadios2" id="localSave" value="local">Локально');
    $("#panel_size_hover_box").text("Размер Окна Наведения");
     $("#text_message").text(' Сохранение Изменений Перезагрузит Страницу');
    $("#SaveProperty").text("Сохранить");
    $("#label_saved_file_name_format").text("Имя Сохраняемого Файла Состоит Из");
    $("#example_format_file_name_lb").text("Пр.: ");
    $("#languageRu").prop('checked', true);
    }

if (localStorage.getItem("IDH_size_box") == "40px"){
    $("#hoverSizeSmall").prop('checked', true);
} else if (localStorage.getItem("IDH_size_box") == "75px") {
    $("#hoverSizeDefault").prop('checked', true);
} else {
    $("#hoverSizeLarge").prop('checked', true);
    }

if (localStorage.getItem("IDH_place_for_saving") == "local"){
    $("#localSave").prop('checked', true);
    try {
        document.getElementById("getPermission").style.pointerEvents="none";
    document.getElementById("getPermission").style.color="gray";
    } catch (e) {}

} else  {
    $("#driveSave").prop('checked', true);
}
    // Appearance
    if (localStorage.getItem("IDH_appearance_download")== "1"){
        $("#appearance_download").attr("checked", "");
    }
    if (localStorage.getItem("IDH_appearance_preview")== "1"){
        $("#appearance_preview").attr("checked", "");
    }
    if (localStorage.getItem("IDH_appearance_share")== "1"){
        $("#appearance_share").attr("checked", "");
    }
    if (localStorage.getItem("IDH_appearance_download_all")== "1"){
        $("#appearance_download_all").attr("checked", "");
    }
    if (localStorage.getItem("IDH_appearance_story_bar")== "1"){
        $("#appearance_story_bar").attr("checked", "");
    }
};

