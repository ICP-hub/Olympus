// Simulate a call to Dropbox or other service that can
// return an image as an ArrayBuffer.
var XMLHttpRequest = require("xhr2");
var fs = require("fs");
var xhr = new XMLHttpRequest();

// Use JSFiddle logo as a sample image to avoid complicating
// this example with cross-domain issues.
xhr.open(
  "GET",
  "https://storage.googleapis.com/mining_devs/Mentors/Profile_Sarah%20(1).png",
  true,
);

// Ask for the result as an ArrayBuffer.
xhr.responseType = "arraybuffer";

xhr.onload = function (e) {
  // Obtain a blob: URL for the image data.
  // var arrayBufferView = new Uint8Array(this.response);
  // console.log('arrayBufferView', arrayBufferView)
  // var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
  // var urlCreator = window.URL || window.webkitURL;
  // var imageUrl = urlCreator.createObjectURL(blob);
  // var img = document.querySelector("#photo");
  // img.src = imageUrl;

  /** Get image from link above */
  var arrayBufferView = new Uint8Array(this.response);
  var image = "{";
  for (i = 0; i < arrayBufferView.length; i++) {
    image = image + arrayBufferView[i].toString() + ";";
  }
  image = image + "}";
  console.log(image);

  /* Get Image from array */
  // var arr = [] //fill array here
  // var arrayBufferView = new Uint8Array(arr);
  // fs.writeFile('mentor18.jpg', arrayBufferView, err => { console.log('error') });
};

xhr.send();
