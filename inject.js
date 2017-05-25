// defaul settings

if (localStorage.getItem("IDH_place_for_saving") == null){
	localStorage.setItem("IDH_place_for_saving", "local");
}
if (localStorage.getItem("IDH_language") == null){
		localStorage.setItem("IDH_language", "en");
}
if (localStorage.getItem("IDH_size_box") == null){
	localStorage.setItem("IDH_size_box", "40px");
}
if (localStorage.getItem("IDH_format_file_name") == null){
	localStorage.setItem("IDH_format_file_name", "23");
}
if (localStorage.getItem("IDH_appearance_download") == null){
	localStorage.setItem("IDH_appearance_download", "1");
}
if (localStorage.getItem("IDH_appearance_download_all") == null){
	localStorage.setItem("IDH_appearance_download_all", "1");
}
if (localStorage.getItem("IDH_appearance_preview") == null){
	localStorage.setItem("IDH_appearance_preview", "1");
}
if (localStorage.getItem("IDH_appearance_share") == null){
	localStorage.setItem("IDH_appearance_share", "1");
}
if (localStorage.getItem("IDH_appearance_story_bar") == null) {
  localStorage.setItem("IDH_appearance_story_bar", "1");
}
if (localStorage.getItem("IDH_appearance_dw_all") == null) {
  localStorage.setItem("IDH_appearance_dw_all", "1");
}

function GetBetterSize(uri){
	if (uri.indexOf("/s640x640/") != -1){
		uri = uri.replace("/s640x640/", '/');
	}
    if (uri.indexOf("/s150x150/") != -1){
        uri = uri.replace("/s150x150/", '/');
    }
	if (uri.indexOf("/s320x320/") != -1){
        uri = uri.replace("/s320x320/", '/');
    }
    if (uri.indexOf("/s750x750/") != -1){
        uri = uri.replace("/s750x750/", '/');
    }
	return uri;
}

function downloadURI(uri, name) {
	uri = GetBetterSize(uri);
	var defaultFileNameArray = uri.split('/');
	var defaultFileName = defaultFileNameArray[defaultFileNameArray.length -1].split('.')[0]
	var fileName = "";
	switch (localStorage.getItem("IDH_format_file_name")) {
        case "1":
            fileName = defaultFileName;
            break
        case "12":
            fileName = defaultFileName + "_" + name;
            break
        case "123":
            fileName = defaultFileName + "_" + name + "_" + GetStringDate();
            break
        case "13":
            fileName = defaultFileName + "_" + GetStringDate();
            break
        case "23":
            fileName = name + "_" + GetStringDate();
            break
        case "3":
            fileName = GetStringDate();
            break
        default:
            fileName = name + GetStringDate();
    }
    if (localStorage.getItem("IDH_place_for_saving") == "local"){
		chrome.runtime.sendMessage({greeting: "LocalDownload:" + uri+"'"+fileName+"." +uri.substring(uri.length - 4).split(".")[1]}, function(response) {});
        } else {
		saveToGoogleDrive(uri, fileName+"." +uri.substring(uri.length - 4).split(".")[1])
        }
}

function saveToGoogleDrive(photoUrl,name){
	var my_app = "https://script.google.com/macros/s/AKfycbwVo5ozjjFQ_-PdAgZa_Bw71ujgEsjlCo-1D19ty4-Iad87oCA/exec?folder=InstagramDownloadHelper&url="+photoUrl+"&name="+name;
	var xhr = new XMLHttpRequest();
	try {
	  xhr.open("GET", my_app);
	  xhr.onreadystatechange = handleResponse;
	  xhr.responseType = "text";
	  xhr.send(null);
	  var result = xhr.getAllResponseHeaders();
		if (localStorage.getItem("IDH_language") == "en"){
			$("#modal_win_text").html("Saved To Google Drive");
		} else {
			$("#modal_win_text").html("Сохранено в Google Drive");
		}
		$('#modal_window').show(100);
		$("#modal_window").attr("time", '1');

	} catch(e) 
	{
		console.log(e);
	}
	
	function handleResponse() {
	  if (xhr.readyState == 4) {
		var result = xhr.responseText.split("cajaHtml")[1];
		  //console.log(result);
	  }
	}
}
var NicknameUser = "";
function preView (url){
	url = GetBetterSize(url);
	window.open(url,'_blank');
}

function GetStringDate(){
	var dateNow = new Date();
	return dateNow.getDate()+"_"+(dateNow.getMonth()+1)+"_"+dateNow.getFullYear()+"_"+dateNow.getHours()
		+"_"+dateNow.getMinutes()+"_"+dateNow.getSeconds()+"_"+dateNow.getMilliseconds();
}

function GetNickNamePrivatePages(element){
    var nickname = "";
    try {
        var nickNameInTapePhoto = element.parentNode.parentNode.parentNode.parentNode.parentNode.querySelectorAll('._4zhc5.notranslate._jozwt')[0].getAttribute("title");
        console.log(nickNameInTapePhoto + " - tape photo");
        nickname = nickNameInTapePhoto;
    } catch (e) {
      //console.log("not a type photo")
    }

    try {
        if (nickname == "") {
            var nickNameInTapeSeveralPhoto =
                element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                    .querySelectorAll('._4zhc5.notranslate._jozwt')[0].getAttribute("title");
            //console.log(nickNameInTape + " - tape video");
            nickname = nickNameInTapeSeveralPhoto;
        }
    } catch (e) {
        //console.log("not a type video")
    }

    try {
        if (nickname == "") {
            var nickNameInTapeSeveralPhoto =
                element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                    .querySelectorAll('._4zhc5.notranslate._jozwt')[0].getAttribute("title");
            //console.log(nickNameInTape + " - tape video");
            nickname = nickNameInTapeSeveralPhoto;
        }
    } catch (e) {
        //console.log("not a type video")
    }

    try {
        if (nickname == "") {
            var nickNameInTape =
                element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                    .querySelectorAll('._4zhc5.notranslate._jozwt')[0].getAttribute("title");
            //console.log(nickNameInTape + " - tape video");
            nickname = nickNameInTape;
        }
    } catch (e) {
        //console.log("not a type video")
    }

    try {
        if (nickname == "") {
            var nickNameInTape =
                element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                    .querySelectorAll('._4zhc5.notranslate._jozwt')[0].getAttribute("title");
            //console.log(nickNameInTape + " - tape video2");
            nickname = nickNameInTape;
        }
    } catch (e) {
        //console.log("not a type video2")
    }


	try {
	    if (nickname == ""){
	        nickname =  document.getElementsByClassName("_i572c")[0];
	        if (typeof nickname == "undefined" ){
	            nickname = document.getElementsByClassName("_4zhc5")[0].getAttribute("title");
	        } else {
	            nickname = nickname.getAttribute("title");
	        }
        }
	} catch (e){
		nickname = "icannotknow";
	}
	return nickname;
}

function addElementsPrivatePage(articles, articleNumber, downloadLink, isPop=false){
	var lengthElemnt = 6;
	if (localStorage.getItem("IDH_appearance_preview") == "1"){lengthElemnt+=40;}
	if (localStorage.getItem("IDH_appearance_download") == "1"){lengthElemnt+=40;}
	if (localStorage.getItem("IDH_appearance_share") == "1"){lengthElemnt+=40;}
	// a:hover
	var iconHoverReciver = document.createElement('div');
	iconHoverReciver.style.zIndex = '55';
	iconHoverReciver.style.height = "40px";
	iconHoverReciver.style.width = lengthElemnt+"px";
	iconHoverReciver.style.position = 'absolute';
	iconHoverReciver.style.right = '10px';
	iconHoverReciver.style.top = '8px';
	iconHoverReciver.style.display = 'inline-block';
	articles[articleNumber].appendChild(iconHoverReciver);

	// download a
	var linkDownload = document.createElement('a');
	linkDownload.onmouseover = function(){
		$(".itemIconsDownload").attr('src', chrome.extension.getURL("save_hover.png"));
	}
	linkDownload.onmouseout = function(){
		$(".itemIconsDownload").attr('src', chrome.extension.getURL("save_32.png"));
	}
	linkDownload.style.height = "40px";
	linkDownload.style.width = "40px";
	linkDownload.style.display = 'inline-block';
	linkDownload.download = downloadLink;
	linkDownload.href = downloadLink;
	linkDownload.onclick = function(e){
		if(isPop){
			downloadURI(e.toElement.getAttribute('download').split("?")[0],
		 NicknameUser);
		} else{
			downloadURI(e.toElement.getAttribute('download').split("?")[0],
		 GetNickNamePrivatePages(e.toElement));
		}
	return false}

	// preview a
	var linkPreview = document.createElement('a');
	linkPreview.onmouseover = function(){
		$(".itemIconsPreview").attr('src', chrome.extension.getURL("preview_hover.png"));
	}
	linkPreview.onmouseout = function(){
		$(".itemIconsPreview").attr('src', chrome.extension.getURL("view_32.png"));
	}
	linkPreview.style.height = "40px";
	linkPreview.style.width = "40px";
	linkPreview.style.display = 'inline-block';
	linkPreview.download = downloadLink;
	linkPreview.href = downloadLink;
	linkPreview.target = "_blank";
	linkPreview.onclick = function(e){
		preView(e.toElement.getAttribute('href'));
		return false}

	// share a
	var linkShare = document.createElement('a');
	linkShare.onmouseover = function(){
		$(".itemIconsShare").attr('src', chrome.extension.getURL('share_hover.png'));
	}
	linkShare.onmouseout = function(){
		$(".itemIconsShare").attr('src', chrome.extension.getURL('share-link.png'));
	}
	linkShare.style.height = "40px";
	linkShare.style.width = "40px";
	linkShare.style.display = 'inline-block';
	linkShare.download = downloadLink;
	linkShare.href = downloadLink;
	linkShare.target = "_blank";
	linkShare.onclick = function(e){
		share(e.toElement.getAttribute('href'));
		return false}

	// span:hover   #####
	var iconHover = document.createElement('span');
	iconHover.style.zIndex = '10';
	if (!isPop){
		iconHover.className = 'iconsToolBar';
	}
	iconHover.style.height = "40px";
	iconHover.style.width = lengthElemnt+"px";
	iconHover.style.position = 'absolute';
	iconHover.style.right = '10px';
	iconHover.style.top = '8px';
	articles[articleNumber].appendChild(iconHover);

	// download img
	var imageDownload = document.createElement('img');
	imageDownload.setAttribute('fileUrl', downloadLink);
	imageDownload.style.marginLeft = '10px';
	imageDownload.className = "itemIconsDownload";
	imageDownload.src = chrome.extension.getURL("save_32.png");

	// preview img
	var imagePreview = document.createElement('img');
	imagePreview.style.marginLeft = '10px';
	imagePreview.className = "itemIconsPreview";
	imagePreview.src = chrome.extension.getURL("view_32.png");

	// share img
	var imageShare = document.createElement('img');
	imageShare.style.marginLeft = '10px';
	imageShare.className = "itemIconsShare";
	imageShare.src = chrome.extension.getURL("share-link.png");

	// appearence
	if (localStorage.getItem("IDH_appearance_preview") == "1"){
		iconHover.appendChild(imagePreview);
		iconHoverReciver.appendChild(linkPreview);
	}
	if (localStorage.getItem("IDH_appearance_share") == "1"){
		iconHover.appendChild(imageShare);
		iconHoverReciver.appendChild(linkShare);
	}
	if (localStorage.getItem("IDH_appearance_download") == "1"){
		iconHover.appendChild(imageDownload);
		iconHoverReciver.appendChild(linkDownload);
	}

		// set attribute marks
		articles[articleNumber].setAttribute('haveElements', '')
	}

var imbusy = false;

function AddElements(){

/*
	var story_bar = document.getElementById("trayContainer");
	if(story_bar == null){
		injectPswpContainer();
		loadStories();
	}*/
	addModalWindow();
	articles = document.body.querySelectorAll('._8ab8k._j5hrx._pieko');
	if (articles.length == 0){
		articles = document.body.querySelectorAll('._jjzlb');
        try{
            ava = document.body.querySelectorAll('._o0ohn');
            if (ava.length != 0) {
                if (ava[0].getAttribute('haveElements') != '') {
                    urlava = ava[0].childNodes[0].getAttribute('src');
                    if(urlava == null){
                        urlava = ava[0].childNodes[0].childNodes[0].childNodes[0].getAttribute('src');
                    }
                addElementsPrivatePage(ava, 0, urlava);
                }
            }
        } catch (e){}

        try{
            ava = document.body.querySelectorAll('._o0ohn');
            if (ava.length != 0) {
                if (ava[0].getAttribute('haveElements') != '') {
                    urlava = ava[0].childNodes[0].getAttribute('src');
                    if(urlava == null){
                        urlava = ava[0].childNodes[0].childNodes[0].getAttribute('src');
                    }
                addElementsPrivatePage(ava, 0, urlava);
                }
            }
        } catch (e){}

		for (var articleNumber in articles) {
			try{
				// private page PHOTO
				var articleChilds = articles[articleNumber].childNodes;
				downloadLink = articleChilds[0].getAttribute('src');
				if (articles[articleNumber].getAttribute('haveElements') != '') {
					addElementsPrivatePage(articles, articleNumber, downloadLink);
				} else {
					if(articles[articleNumber].childNodes[articles[articleNumber].childNodes.length - 2].childNodes[0].getAttribute('download') != downloadLink){
						//console.log("+");
						addElementsPrivatePage(articles, articleNumber, downloadLink);
					}
				}

			} catch (e) {
			}
		}
		articles = document.body.querySelectorAll('._2tomm');
		for (var articleNumber in articles) {
			try {
				// private page MOVE
				if (articles[articleNumber].getAttribute('haveElements') != '') {
					var articleChilds = articles[articleNumber].childNodes;
					downloadLink = articleChilds[0].getAttribute('src');

					addElementsPrivatePage(articles, articleNumber, downloadLink);
				}
			} catch (e) {
			}
		}
	}
/*
	else{
	for (var articleNumber in articles) {
		try {
			// MAIN PAGE
			if (articles[articleNumber].getAttribute('haveElements') != '') {

				var articleChilds = articles[articleNumber].childNodes;
				var imageWithUrl = articleChilds[1].getElementsByTagName('img')[0];
				var moveWithUrl = articleChilds[1].getElementsByTagName('video')[0];
				if (typeof moveWithUrl !== "undefined"){
					download_link = moveWithUrl.getAttribute('src');
				} else
				{
					download_link = imageWithUrl.getAttribute('src');
				}
				articles[articleNumber].setAttribute('haveElements', '');

                // preview
				var iconLook = document.createElement('a');
				iconLook.innerHTML = '';
				iconLook.style.marginRight = '10px';
				iconLook.setAttribute("data-toggle", "tooltip");
				if (localStorage.getItem("IDH_language") == "en"){
				iconLook.setAttribute("title", "Preview");
				} else {
				iconLook.setAttribute("title", "Предпросмотр");
				}
				iconLook.href = download_link;
				iconLook.target = '_blank';
				iconLook.onmouseover = function(){
					$(".itemIconsPreview").attr('src', chrome.extension.getURL("preview_hover.png"));
				}
				iconLook.onmouseout = function(){
					$(".itemIconsPreview").attr('src', chrome.extension.getURL("view_32.png"));
				}

				var imageLook = document.createElement('img');
				imageLook.src = chrome.extension.getURL("view_32.png");
				imageLook.className = "itemIconsPreview";
				iconLook.appendChild(imageLook);
				if (localStorage.getItem("IDH_appearance_preview") == "1"){
					articleChilds[0].appendChild(iconLook);
				}

				// share
				var iconShare = document.createElement('a');
				iconShare.innerHTML = '';
				iconShare.style.marginRight = '10px';

				iconShare.setAttribute("data-toggle", "tooltip");
				if (localStorage.getItem("IDH_language") == "en"){
				iconShare.setAttribute("title", "Share");
				} else {
				iconShare.setAttribute("title", "Поделиться");
				}
				iconShare.onclick = function(e){
					share(e.toElement.getAttribute('download'));
					return false}
				iconShare.download = download_link;
				iconShare.href = download_link;
				iconShare.onmouseover = function(){
					$(".itemIconsShare").attr('src', chrome.extension.getURL('share_hover.png'));
				}
				iconShare.onmouseout = function(){
					$(".itemIconsShare").attr('src', chrome.extension.getURL('share-link.png'));
				}

				var imageShare = document.createElement('img');
				imageShare.className = "itemIconsShare";
				imageShare.src = chrome.extension.getURL("share-link.png");
				imageShare.setAttribute("download", download_link);

				iconShare.appendChild(imageShare);
				if (localStorage.getItem("IDH_appearance_share") == "1"){
					articleChilds[0].appendChild(iconShare);
				}

				// google drive save
                // local save
				var iconDownload = document.createElement('a');
				iconDownload.innerHTML = '';
				iconDownload.style.marginRight = '10px';

				iconDownload.setAttribute("data-toggle", "tooltip");
				if (localStorage.getItem("IDH_language") == "en"){
				iconDownload.setAttribute("title", "Save");
				} else {
				iconDownload.setAttribute("title", "Сохранить");
				}
				iconDownload.onclick = function(e){
					downloadURI(e.toElement.getAttribute('download').split("?")[0],
						e.path[2].getElementsByClassName("_4zhc5")[0].getAttribute("title"));
					return false}
				iconDownload.download = download_link;
				iconDownload.href = download_link;

				iconDownload.onmouseover = function(){
					$(".itemIconsDownload").attr('src', chrome.extension.getURL("save_hover.png"));
				}
				iconDownload.onmouseout = function(){
					$(".itemIconsDownload").attr('src', chrome.extension.getURL("save_32.png"));
				}

				var imageDownload = document.createElement('img');
				imageDownload.className = "itemIconsDownload";
				imageDownload.src = chrome.extension.getURL("save_32.png");
				imageDownload.setAttribute("download", download_link);

				iconDownload.appendChild(imageDownload);
				if (localStorage.getItem("IDH_appearance_download") == "1"){
					articleChilds[0].appendChild(iconDownload);
				}

				var postTime = articleChilds[0].childNodes[2];
				articleChilds[0].appendChild(postTime);
			}
		} catch (exc) {

		}
	}
	}*/
}

function share(text){
	text  = GetBetterSize(text);
	function selectElementText(element) {
    if (document.selection) {
      var range = document.body.createTextRange();
      range.moveToElementText(element);
      range.select();
    } else if (window.getSelection) {
      var range = document.createRange();
      range.selectNode(element);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  }
  var element = document.createElement('DIV');
  element.textContent = text;
  document.body.appendChild(element);
  selectElementText(element);
  document.execCommand('copy');
  element.remove();
try{
	if (localStorage.getItem("IDH_language") == "en"){
		$("#modal_win_text").html("Link Copied to Clipboard");
	} else {
		$("#modal_win_text").html("Cсылка скопирована в буфер");
	}
	$('#modal_window').show(100);
	$("#modal_window").attr("time", '1');
}
	catch (exc) {}
}
function changeValueLocalStorage(msg, localVariableName, lengthString){
	if ((msg.text).search(localVariableName) != -1 && localStorage.getItem(localVariableName) != (msg.text).substring(lengthString)){
        	localStorage.setItem(localVariableName, (msg.text).substring(lengthString));
			//console.log("message - " + (msg.text).substring(lengthString));
        }
}
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text) {
		changeValueLocalStorage(msg, "IDH_language", 13);
		changeValueLocalStorage(msg, "IDH_place_for_saving", 21);
		changeValueLocalStorage(msg, "IDH_format_file_name", 21);
		changeValueLocalStorage(msg, "IDH_appearance_download", 24);
		changeValueLocalStorage(msg, "IDH_appearance_dw_all", 22);
		changeValueLocalStorage(msg, "IDH_appearance_preview", 23);
		changeValueLocalStorage(msg, "IDH_appearance_share", 21);
		changeValueLocalStorage(msg, "IDH_appearance_story_bar", 25);

		console.log("Reload")
		window.location.reload()
    }
	if (msg.greeting == "hello")
      sendResponse({farewell: "goodbye"});
});

AddElements();

var myVar = setInterval(function () {
    $(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
    AddElements()}, 700);

var closeModal = setInterval(function () {
	try {
		if ($("#modal_window").attr("time") == "2"){
			$("#modal_window").attr("time", '0');
			$("#modal_window").hide();
		}
		if ($("#modal_window").attr("time") == "1"){
			$("#modal_window").attr("time", '2');
		}
	} catch (ex){

	}
}, 2000);

// modal window save to drive
var modalWindow = document.createElement('div');
modalWindow.style.position = "fixed";
modalWindow.style.top = "5%";
modalWindow.style.right = "4%";
modalWindow.innerHTML = '<div style="display: none" class="alert alert-dismissible alert-success" id="modal_window" time="0" style="z-index: 9999"><button style="position: absolute" type="button" class="close" data-dismiss="alert">&times;</button><strong id="modal_win_text"></strong></div>'

var windowAdded = false;

function addModalWindow(){
	try {
		if (!windowAdded){
			document.body.appendChild(modalWindow);
			windowAdded = true;
		}
	} catch (e){

	}
}
// add inject_download_all.js internal script to available access to the `window`
function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}
injectScript(chrome.extension.getURL("bootstrap/js/jquery-2.1.3.mini.js"), 'body');
injectScript(chrome.extension.getURL('savejs/jszip-utils.js'), 'body');
injectScript(chrome.extension.getURL('savejs/jszip.js'), 'body');
injectScript(chrome.extension.getURL('savejs/FileSaver.js'), 'body');
injectScript(chrome.extension.getURL('inject_download_all.js'), 'body');

injectScript(chrome.extension.getURL("bootstrap/js/bootstrap.min.js"), 'body');
localStorage.setItem("button_close", chrome.extension.getURL("button_close.png"));


////
var API_BASE = "https://i.instagram.com/api/v1/feed/";
var INSTAGRAM_FEED_CLASS_NAME = "_qj7yb";
var INSTAGRAM_USER_IMAGE_CLASS_NAME = "_8gpiy _r43r5";


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var instagramCookies = JSON.parse(request);
    if((instagramCookies.ds_user_id && instagramCookies.sessionid)) {
      var instagramFeed = document.getElementsByClassName(INSTAGRAM_FEED_CLASS_NAME)[0];
      var instagramUserImage = document.getElementsByClassName(INSTAGRAM_USER_IMAGE_CLASS_NAME)[0];
      if(instagramFeed) {
        getStories(instagramFeed);
      }
      if(instagramUserImage) {
        getUserStory(instagramUserImage);
      }
    }
  });

function loadStories() {
  chrome.runtime.sendMessage('loadStories');
}

function getUserStory(instagramUserImage) {
  var sharedData = JSON.parse($('html')[0].outerHTML.split("window._sharedData = ")[1].split(";</script>")[0]);
  var userId = sharedData['entry_data']['ProfilePage'][0]['user']['id'];

  return getStory(userId).then(function(story) {
    if(story.items.length > 0) {
      $(instagramUserImage).addClass('unseenStoryItem');
      $(instagramUserImage).addClass('instagramUserImage');

      instagramUserImage.addEventListener("click", function() {
        showImageGallery(story.items);
      });
    }
  }, function(error) {
    console.log("Error loading Story for user: " + JSON.stringify(error));
  });
}

function getStories(instagramFeed) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", API_BASE + "reels_tray/", true);
  xhr.withCredentials = true;
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if(xhr.status == 200) {
        injectStoryTray(JSON.parse(xhr.responseText), instagramFeed);
      }
    }
  }
  xhr.send();
}

function getStory(userId) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", API_BASE + "user/" + userId + "/reel_media/", true);
    xhr.withCredentials = true;
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.statusText);
        }
      }
    }
    xhr.send();
  });
}

function injectPswpContainer() {
  var pswpContainer = document.createElement("div");
  pswpContainer.setAttribute("id", "pswpContainer");
  document.body.appendChild(pswpContainer);
}


function injectStoryTray(response, instagramFeed) {
  var trayContainer = document.createElement("div");
  trayContainer.setAttribute("id", "trayContainer");
	if(localStorage.getItem("IDH_appearance_story_bar")=="0"){
		trayContainer.style.display("none");
	}

  //trayContainer.setAttribute("class", "container modern-skin");

  var tray = response["tray"];

	var carousel = document.createElement('div');
	  carousel.setAttribute('class', 'carousel slide');
	  carousel.setAttribute('data-ride', 'carousel');
	  carousel.id = 'myCarousel';

	var colSld = parseInt(tray.length/5);
	if (colSld*5 != tray.length) colSld++;
	for (var slideSl=0; slideSl <= colSld; slideSl++ ){
		var divInner = document.createElement('div');
		divInner.setAttribute("class", "carousel-inner");
		divInner.setAttribute("role", 'listbox');

		var divInnerItem = document.createElement('div');
		if (slideSl==0){
			divInnerItem.setAttribute("class", "item active");
		} else {
			divInnerItem.setAttribute("class", "item");
		}
		divInner.appendChild(divInnerItem);
		carousel.appendChild(divInner)
	}

  for(var i = 0; i < tray.length; i++) {

    var trayItem = tray[i];

    (function(trayItem) {

      var user = trayItem['user'];
      var picture = user['profile_pic_url'];

      var trayItemContainer = document.createElement('div');
      trayItemContainer.style.display = 'inline-flex';
      trayItemContainer.style.marginLeft = '5px';
      trayItemContainer.style.marginRight = '5px';
      trayItemContainer.style.marginBottom = '15px';

      var trayItemImage = document.createElement('img');
      trayItemImage.setAttribute("id", "trayItemImage" + i);
      trayItemImage.width = 64;
      trayItemImage.height = 64;
      trayItemImage.setAttribute("class", ((trayItem.items) ? "unseenStoryItem" : "seenStoryItem") + " trayItemImage");
      trayItemImage.src = picture.replace("http://", "https://");
      trayItemImage.title = user.username;

      trayItemImage.addEventListener("click", function() {
        if(trayItem.items) {
          showImageGallery(trayItem.items);
        } else {
          return getStory(trayItem.id).then(function(story) {
            showImageGallery(story.items);
          }, function(error) {
            alert("There was an error trying to load this person's Story.");
            console.log("Error loading Story for user: " + JSON.stringify(error));
          });
        }
      });

      var trayItemUsername = document.createElement('span');
		if(user.username.length > 12){
			trayItemUsername.textContent = user.username.substring(0, 10) + "...";
		} else {
			trayItemUsername.textContent = user.username;
		}

      trayItemUsername.style.marginTop = '10px';
      trayItemUsername.style.fontSize = '14px';

      if(trayItem.items) {
        trayItemUsername.style.color = '#262626';
      } else {
        trayItemUsername.style.color = '#a0a0a0';
      }

      trayItemContainer.appendChild(trayItemImage);
      trayItemContainer.appendChild(trayItemUsername);

      trayContainer.appendChild(trayItemContainer);

    })(trayItem);

  }

  instagramFeed.insertBefore(trayContainer, instagramFeed.childNodes[0]);
}

function getPswpElement(callback) {
  if($('#pswp').length) {
    callback(document.getElementById('pswp'));
  } else {
    $("#pswpContainer").load(chrome.extension.getURL("html/photoswipe.html"), function() {
      callback(document.getElementById('pswp'));
    });
  }
}

function showImageGallery(storyItems) {

  getPswpElement(function(pswpElement) {
    var slides = [];

    storyItems.map((storyItem, i) => {

      if(storyItem['video_versions']) {

        var video = storyItem['video_versions'][0];

		var videoContainer = document.createElement('div');
        var storyVideo = document.createElement('video');
        var source = document.createElement("source");
        storyVideo.setAttribute("controls", true);
        if(i === 0) { storyVideo.setAttribute("autoplay", true); }
        source.src = video['url'];
        storyVideo.appendChild(source);

		  var myDiv = document.createElement("div");
		  myDiv.id = "MyDivId";
		  myDiv.style.position = "absolute";
		  myDiv.style.top = "50px";
		  myDiv.style.right = "0px";
		  myDiv.style.width = "120px";
		  myDiv.style.display = "inline";

		  addElementsPrivatePage([myDiv],0, video['url'], true);
		  videoContainer.appendChild(storyVideo);
		  videoContainer.appendChild(myDiv);

        $(storyVideo).addClass('videoStoryItem');
        $(storyVideo).addClass('pswp__video active');
        $(storyVideo).css('position', 'absolute');
        slides.push({
          html: videoContainer,
          storyItem: storyItem
        });
      } else {
        var image = storyItem['image_versions2']['candidates'][0];
        var url = image['url'].replace("http://", "https://");
        slides.push({
          src: url,
          msrc: url,
          w: image['width'],
          h: image['height'],
          storyItem: storyItem
        });
      }
    });

    var options = {
      closeOnScroll: false,
      shareEl: false
    };

    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, slides, options);

    gallery.listen('afterChange', function() {
		var sliders = document.getElementsByClassName('pswp__img');
		for (var x=0;x<sliders.length;x++){
			var myDiv2 = document.createElement("div");
		  myDiv2.style.position = "absolute";
		  myDiv2.style.top = "50px";
		  myDiv2.style.right = "0px";
		  myDiv2.style.width = "120px";
		  myDiv2.style.display = "inline";
			addElementsPrivatePage([myDiv2],0, sliders[x].getAttribute('src'), true);
			sliders[x].parentNode.parentNode.appendChild(myDiv2);
		}
		NicknameUser = gallery.currItem.storyItem['user']['username'];
      $('.storyAuthorImage').attr("src", gallery.currItem.storyItem['user']['profile_pic_url']);
      $('.storyAuthorUsername').text(gallery.currItem.storyItem['user']['username'] + " - " + moment.unix(gallery.currItem.storyItem['taken_at']).fromNow());
    });

    gallery.listen('beforeChange', function() {
      var currItem = $(gallery.currItem.container);

      $('.pswp__video').removeClass('active');
      var currItemIframe = currItem.find('.pswp__video').addClass('active');

      $('.pswp__video').each(function() {
        if (!$(this).hasClass('active')) {
          $(this)[0].pause();
          $(this)[0].currentTime = 0;
        } else {
          $(this)[0].play();
        }
      });
    });

    gallery.listen('close', function() {
      $('.pswp__video').each(function() {
        $(this)[0].pause();
      });
    });

    gallery.init();

  });

}


var myVarStory = setInterval(function () {
    $(document).ready(function () {
       if (document.location.pathname.length==1 & document.getElementById("trayContainer") == null){
		   injectPswpContainer();
		   loadStories();
	   }
    });}, 1000);
