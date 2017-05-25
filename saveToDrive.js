var urlContent = localStorage.getItem("googleDriveUrlContent");
var array = urlContent.split("/");
//console.log(array[array.length -1 ]);

gapi.savetodrive.render('savetodrive-div', {
      src: localStorage.getItem("googleDriveUrlContent"),
      filename: "dfg",
      sitename: 'Instagram Downloader '
    });