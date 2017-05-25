var displayPageAction = function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        
        if (tab.url.match("^https?://(www\.)?instagram.com*")) {
            chrome.pageAction.show(tabId);
        }
    }
};

chrome.tabs.onUpdated.addListener(displayPageAction);
/*
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if ((request).search("googleDrive") != -1){

    console.log(request);
    localStorage.setItem("googleDriveUrlContent", (request.greeting).substring(12));
    }
});
*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      try {
          if ((request.greeting).search("LocalDownload") != -1){
              var options = request.greeting.substring(14);
              chrome.downloads.download({
                  url: options.split("'")[0],
                  filename: options.split("'")[1]
              });
          }
      } catch (e) {

      }
});


////

var instagramCookies = {};
var DOMAIN_URL = "https://www.instagram.com";

loadCookies();

function loadCookies() {
  getCookies(function(cookies) {
    instagramCookies = cookies;
  });
}

function getCookies(callback) {
  var cookieToReturn = {};
  chrome.cookies.get({url: DOMAIN_URL, name: 'ds_user_id'}, function(cookie) {
    if(cookie) { cookieToReturn.ds_user_id = cookie.value; }
    chrome.cookies.get({url: DOMAIN_URL, name: 'sessionid'}, function(cookie) {
      if(cookie) { cookieToReturn.sessionid = cookie.value; }
      if(callback) {
        callback(cookieToReturn);
      }
    });
  });
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(info) {
    var headers = info.requestHeaders;
    var shouldInjectHeaders = true;

    if(!(instagramCookies.ds_user_id && instagramCookies.sessionid)) {
      shouldInjectHeaders = false;
    }

    if(shouldInjectHeaders) {
      for (var i = 0; i < headers.length; i++) {
        var header = headers[i];
        if(header.name.toLowerCase() == 'x-requested-with') {
          shouldInjectHeaders = false;
        }
      }
    }

    if(shouldInjectHeaders) {
      headers.push({name:"x-ig-capabilities",value:"3w=="});
      for (var i = 0; i < headers.length; i++) {
        var header = headers[i];
        if(header.name.toLowerCase() == 'referer') {
          if(header.value.search("https://www.instagram.com/") == -1) {
            shouldInjectHeaders = false;
          }
        }
        if (header.name.toLowerCase() == 'user-agent' && shouldInjectHeaders) {
          header.value = 'Instagram 9.0.2 (iPhone7,2; iPhone OS 9_3_3; en_US; en-US; scale=2.00; 750x1334) AppleWebKit/420+';
        }
        if (header.name.toLowerCase() == 'cookie' && shouldInjectHeaders) {
          var cookies = header.value;

          cookies = "ds_user_id=" + instagramCookies.ds_user_id + "; sessionid=" + instagramCookies.sessionid + ";";
          + cookies;
          header.value = cookies;
        }
      }
    }

    return {requestHeaders: headers};
  },
  {
    urls: [
      "*://*.instagram.com/api/*"
    ],
    types: ["xmlhttprequest"]
  },
  ["blocking", "requestHeaders"]
);


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request === "loadStories") {
            getCookies(function(cookies) {
                instagramCookies = cookies;
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    //console.log(tabs[0].id)
                    chrome.tabs.sendMessage(tabs[0].id, JSON.stringify(cookies));
                });
            });
        }
    });