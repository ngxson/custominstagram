var zip;
var countCurList = 0;
var all_media_files = 0;
var downloaded_media_files = 0;
var output = [];
var isFinish = false;
var type_download="";
var nuiCaption = [];

function GetStringDate(){
    var dateNow = new Date();
    return dateNow.getDate()+"_"+(dateNow.getMonth()+1)+"_"+dateNow.getFullYear()+"_"+dateNow.getHours()
        +"_"+dateNow.getMinutes()+"_"+dateNow.getSeconds()+"_"+dateNow.getMilliseconds();
}

function createZipObject(data, cap, type, start, end){
    zip = JSZip();
    countCurList = data.length;
    var count = 0;
    for (var i=0;i<data.length;i++){
        count+=1;
        getBlob(data[i], cap[i], i, type, start, end);
    }
}

function ResetProgress(){
    all_media_files = 0;
    downloaded_media_files = 0;
    document.getElementById("downloaded_media_files").innerHTML = 0;
    document.getElementById("all_media_files").innerHTML = 0;
    document.getElementById("my_progress_bar").style.width = 0;
    document.getElementById("progress_bar_donload_media").style.display = 'none';
    output = [];
}
function getBlob(url, cap, last, type, start, end){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var defaultFileNameArray = url.split('/');
            var ending = "."+url.substring(url.length - 4).split(".")[1]
            //var defaultFileName = pad(last, 5)+"_"+defaultFileNameArray[defaultFileNameArray.length -1].split('.')[0] + ending
            var defaultFileName = pad(last, 5)+"_"+ cap + ending
            zip.file(defaultFileName, xhr.response, {base64: true});
            countCurList-=1;
            downloaded_media_files++;
            document.getElementById("downloaded_media_files").innerHTML = downloaded_media_files;
            document.getElementById("my_progress_bar").style.width = (downloaded_media_files/(all_media_files/100))+'%';
            if (countCurList == 0) {
				//zip.file(".captions.txt", nuiCaption);
                zip.generateAsync({type: "blob"}).then(function (content) {
                    saveAs(content, type+'_from_'+start+'_to_'+end+'_'+window.location["pathname"].replace("/", "").replace("/", "") + GetStringDate()+".zip");
                    ResetProgress();
                });
            }
        }
    };
    xhr.send();
}
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
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

function getAllSourceMedia(cursor, type, start, end) {
    document.getElementById("progress_bar_donload_media").style.display = '';
    var url = "https://www.instagram.com"+window.location["pathname"]+"?max_id="+cursor;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send(null);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4){
            var doc = new DOMParser().parseFromString( xhr.response, "text/html");
            var a = doc.getElementsByTagName('script');
            for (var k = 0; k < a.length; k++) {
                if (a[k].innerText.indexOf("_sharedData") != -1) {
                    var i = a[k].innerText.slice(20).slice(0, -1);
                    break;
                }
            }

            var jsondata = JSON.parse(i);
            var currentData = jsondata.entry_data.ProfilePage[0].user.media;

            for (var i = 0; i < currentData.nodes.length; i++) {
				
				
				var caption = "";
				if (currentData.nodes[i].caption)
					caption = currentData.nodes[i].caption
						.replace(/[^A-Za-z 0-9 \.,!@#\$%\^&\*\(\)-_=\+;:\}\{\[\]`~]*/g, '')
						.replace(/\n/g, " ").replace(/[\/\\\?\:\*\<\>\|\"\']/g, "")
						.replace(/follow (\@|\#)9gag/gi, "").replace(/(\@|\#)[a-z0-9_\-\.]+/gi, "")
						.replace(/gagmobile/gi, "")
						.replace(/- -/g, "")
						.replace(/  /g, " ")
						.substring(0,256-4-5);
						
                if (type == "all") {
                    if (currentData.nodes[i].is_video) {
                        output.push(GetVideoUrl(currentData.nodes[i].code));
						nuiCaption.push(caption);
						all_media_files += 1;
                    } else {
                        if (currentData.nodes[i].__typename == "GraphSidecar") {
                            var medias = GetMediaFromGraphSidecar(currentData.nodes[i].code);
                            //for (var j = 0; j < medias.length; j++) {
                            for (var j = 0; j < 1; j++) {
                                if (medias[j].node.is_video) {
                                    output.push(GetBetterSize(medias[j].node.video_url));
									nuiCaption.push(caption);
                                    all_media_files += 1;
                                } else {
                                    output.push(GetBetterSize(medias[j].node.display_url));
									nuiCaption.push(caption);
                                    all_media_files += 1;
                                }
                            }
                        } else {
                            output.push(GetBetterSize(currentData.nodes[i].display_src.split("?")[0]));
							nuiCaption.push(caption);
							all_media_files += 1;
                        }
                    }
                }
                /*if (type == "photo") {
                    if (currentData.nodes[i].is_video) {
                    } else {
                        if (currentData.nodes[i].__typename == "GraphSidecar") {
                            var medias = GetMediaFromGraphSidecar(currentData.nodes[i].code);
                            for (var j = 0; j < medias.length; j++) {
                                if (medias[j].node.is_video) {
                                } else {
                                    output.push(GetBetterSize(medias[j].node.display_url));
                                    all_media_files += 1;
                                }
                            }
                        } else {
                            output.push(GetBetterSize(currentData.nodes[i].display_src.split("?")[0]));
                            all_media_files += 1;
                        }
                    }
                }
                if (type == "video") {
                    if (currentData.nodes[i].is_video) {
                        output.push(GetVideoUrl(currentData.nodes[i].code));
                        all_media_files += 1;
                    } else{

                    if (currentData.nodes[i].__typename == "GraphSidecar") {
                            var medias = GetMediaFromGraphSidecar(currentData.nodes[i].code);
                            for (var j = 0; j < medias.length; j++) {
                                if (medias[j].node.is_video) {
                                    output.push(GetBetterSize(medias[j].node.video_url));
                                    all_media_files += 1;
                                }
                            }
                        }
                    }
                }*/
                document.getElementById("all_media_files").innerHTML = all_media_files;
            }
            if (currentData.page_info.has_next_page && all_media_files <= end) {
                getAllSourceMedia(currentData.page_info.end_cursor, type, start, end);

            } else {
                if(start==1)
                    start = 0;
                var newOutput = output.slice(start, end);
				var newCaption = nuiCaption.slice(start, end);
                if (newOutput.length > 0) {
                    document.getElementById("all_media_files").innerHTML = newOutput.length;
                    createZipObject(newOutput, newCaption, type, start, parseInt(start) + newOutput.length);
                } else
                {
                    ResetProgress();
                }
            }
        }
    }
}

function GetMediaFromGraphSidecar(code) {
    var url = "https://www.instagram.com/p/"+code+"/?hl=en";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send(null);
    var doc = new DOMParser().parseFromString( xhr.response, "text/html");
    var a = doc.getElementsByTagName('script');
    for (var k = 0; k < a.length; k++) {
        if (a[k].innerText.indexOf("_sharedData") != -1) {
            var i = a[k].innerText.slice(20).slice(0, -1);
            break;
        }
    }
    var jsondata = JSON.parse(i);
    //console.log(jsondata);
	//var caption = "";
	//if (jsondata.entry_data.PostPage[0].graphql.shortcode_media.edge_media_to_caption.edges.length > 0)
	//	caption = jsondata.entry_data.PostPage[0].graphql.shortcode_media.edge_media_to_caption.edges[0].node.text
	//		.replace(/\n/g, " ").replace(/\/\\\?\:\*\<\>\|\"\'/g, "")
	//		.replace(/follow (\@|\#)9gag/gi, "").replace(/\@[a-z0-9_-\.]/gi, "");
    return jsondata.entry_data.PostPage["0"].graphql.shortcode_media.edge_sidecar_to_children.edges;
}

function GetVideoUrl(code) {
    var url = "https://www.instagram.com/p/"+code+"/?hl=en";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send(null);
    var doc = new DOMParser().parseFromString( xhr.response, "text/html");
    var a = doc.getElementsByTagName('script');
    for (var k = 0; k < a.length; k++) {
        if (a[k].innerText.indexOf("_sharedData") != -1) {
            var i = a[k].innerText.slice(20).slice(0, -1);
            break;
        }
    }
    var jsondata = JSON.parse(i);
    //console.log(jsondata);
    return jsondata.entry_data.PostPage["0"].graphql.shortcode_media.video_url;
}

function GetNextUrls(cursor) {
    var url = "https://www.instagram.com"+window.location["pathname"]+"?max_id="+cursor;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send(null);
    var doc = new DOMParser().parseFromString( xhr.response, "text/html");
    var a = doc.getElementsByTagName('script');
    for (var k = 0; k < a.length; k++) {
        if (a[k].innerText.indexOf("_sharedData") != -1) {
            var i = a[k].innerText.slice(20).slice(0, -1);
            break;
        }
    }
    var jsondata = JSON.parse(i);
    //console.log(jsondata);
    return jsondata;

}

function AddDownloadAllButtons() {
    var userInfoPanel = document.getElementsByClassName("_de9bg")[0];
    if (typeof userInfoPanel !== "undefined"){
        if (userInfoPanel.getAttribute('haveElements') != ''){
            userInfoPanel.setAttribute('haveElements', '');

            var panelForButtons = document.createElement('p');
            panelForButtons.style.marginTop = '20px';
            // ALL
            var downloadAllContentButton = document.createElement('a');
            downloadAllContentButton.className = "btn btn-default active";
            downloadAllContentButton.innerHTML = "Download All";
            downloadAllContentButton.onmouseover = function(){
                downloadAllContentButton.style.backdropColor = "white";
            }
            downloadAllContentButton.onmouseout = function(){
                downloadAllContentButton.className = "btn btn-default active";
            }
            downloadAllContentButton.onclick = function(e){
                openWindPop('all');
            }
            panelForButtons.appendChild(downloadAllContentButton);
            // Photo
            var downloadAllPhotosButton = document.createElement('a');
            downloadAllPhotosButton.className = "btn btn-default active";
            downloadAllPhotosButton.innerHTML = "Download Photos";
            downloadAllPhotosButton.style.marginLeft = '15px';
            downloadAllPhotosButton.onclick = function(e){
                openWindPop('photo');
            }
            panelForButtons.appendChild(downloadAllPhotosButton);
            // Video
            var downloadAllVideosButton = document.createElement('a');
            downloadAllVideosButton.className = "btn btn-default active";
            downloadAllVideosButton.innerHTML = "Download Videos";
            downloadAllVideosButton.style.marginLeft = '15px';
            downloadAllVideosButton.onclick = function(e){
                openWindPop('video');
            }
            panelForButtons.appendChild(downloadAllVideosButton);

            userInfoPanel.appendChild(panelForButtons);

            var panelForProgress = document.createElement('p');
            panelForProgress.style.display = 'none';
            panelForProgress.style.marginTop = '20px';
            panelForProgress.style.width = "445px";
            panelForProgress.id = "progress_bar_donload_media";

            var panelForProgressText = document.createElement('h3');
            panelForProgressText.innerHTML = "<span id='downloaded_media_files'>0</span> / <span id='all_media_files'>0</span>"

            panelForProgress.appendChild(panelForProgressText);

            var progress = document.createElement('div');
            progress.className = "progress progress-striped active";
            progress.style.top = "5px";

            var progressBar = document.createElement('div');
            progressBar.className = "progress-bar";
            progressBar.id = "my_progress_bar";
            progressBar.style.width = "0%";

            progress.appendChild(progressBar);
            panelForProgress.appendChild(progress);
            userInfoPanel.appendChild(panelForProgress);

            var modal_warning_pop_up = document.createElement('div');
            modal_warning_pop_up.id = "modal_warning_pop_up";
            modal_warning_pop_up.className = "modal";
            modal_warning_pop_up.innerHTML = htmlModal
            document.body.appendChild(modal_warning_pop_up);
        }
    }
}

function openWindPop(type){
    type_download= type;
    var innerTextElem = ''
    document.getElementById('pop_to_val').value = '';
    var postsCount = document.getElementsByClassName('_bkw5z')[0].innerHTML
    document.getElementById('pop_to_val').value = postsCount.replace(',', '');
    $('#modal_warning_pop_up').modal('show');
    if(type == "video") {
        innerTextElem = "Download Videos";
    }
    if(type == "all") {
        innerTextElem = "Download All";
    }
    if(type == "photo") {
        innerTextElem = "Download Photos";
    }
    document.getElementById('header_download_content_popup').innerText = innerTextElem;
    document.getElementById('CloseImage').src = localStorage.getItem("button_close");

    if (localStorage.getItem("IDH_language") == "en"){
        document.getElementById('text_for_users').innerHTML = `
        <p>Introducing enhanced Download All Media Functionality. </p>
        <p>Now you can choose how much content to download without crashes!</p>
        <hr>
        <p>This functionality helps you download content from the pages that have more than 1k+ media content.</p>
        <p>Simply input the files' range into 'From' - 'To' fields and download the amount of media You want! </p>
        <hr>
        <p>We really appreciate all the feedback we are getting, so make sure to leave a feedback <a target="_blank" style="color: #299CDF;" href="https://chrome.google.com/webstore/detail/instagram-downloader/jnkdcmgmnegofdddphijckfagibepdlb/reviews?hl=en">here</a></p>
        <hr>
                `
        } else {
            document.getElementById('text_for_users').innerHTML = `
                        <p>Представляем новую функциональность Download All Media.  </p>
        <p>Теперь можно управлять количеством скачиваемого контента без зависаний! </p>
        <hr>
        <p>Пользователи, которые качали большие количества данных (более 1,000) теперь могут выбрать количество скачиваемого материала. </p>
        <p>Просто введите диапазон файлов для скачки в поля "с" (from) - "по" (to) и наслаждайтесь процессом! </p>
        <hr>
        <p>Нам очень важны ваши отзывы, поэтому большая просьба оставлять их <a target="_blank" style="color: #299CDF;" href="https://chrome.google.com/webstore/detail/instagram-downloader/jnkdcmgmnegofdddphijckfagibepdlb/reviews?hl=ru">здесь</a></p>
        <hr>
        `
    }
    //console.log(localStorage.getItem("IDH_language"));
}


var htmlModal = `
<div class='modal-dialog'>
<div class='modal-content'>
<div class='modal-header' style="background-color: #ededed; border-radius: 6px;">

<div class="row" style="display: inline">
  <div class="col-xs-11">
  <h4 class='modal-title' id="header_download_content_popup">Warning</h4>
  </div>
  <div class="col-xs-1">
  <button type='button' class='close' data-dismiss='modal' aria-hidden='true'><img id="CloseImage"></button>
  </div>
</div>
</div>
<div class='modal-body'>
<div id="text_for_users" style="line-height: 1.3;">

</div>

<div class="row" style="display: inline">
  <div class="col-xs-6">
    <div class="input-group">
      <span class="input-group-addon">
        From
      </span>
      <input type="text" class="form-control" name="pop_from_val" value="1" id="pop_from_val">
    </div>
  </div>
  <div class="col-xs-6">
    <div class="input-group">
      <span class="input-group-addon">
        To
      </span>
      <input type="text" class="form-control" name="pop_to_val" id="pop_to_val">
    </div>
  </div>
</div>
</div>

<div class='modal-footer'>
<div class="row" style="display: inline">
<div class="col-xs-4"></div>
  <div class="col-xs-4">
  <button onclick='mod_go()' type='button' class='btn btn-primary' style="background-color: #299CDF;">OK</button>
  </div>
</div>

</div>
</div>
</div>
</div>`


function mod_go(){
    $('#modal_warning_pop_up').modal('hide');
    getAllSourceMedia("",type_download, document.getElementById('pop_from_val').value, document.getElementById('pop_to_val').value);

}
if (localStorage.getItem("IDH_appearance_dw_all") == 1){
    var myVar4 = setInterval(function () {
        AddDownloadAllButtons()
    }, 700);
}


