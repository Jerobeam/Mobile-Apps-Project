/**
 * Created by Sebastian on 11.01.2017.
 */
// Initialize app and store it to myApp variable for futher access to its methods
var myApp = new Framework7();

// We need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
var test = "Test";

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

document.addEventListener("deviceready", function () {
    document.getElementById("screenOrientation").innerHTML = screen.orientation.type;
    console.log("Device ready called");
    // Add battery change listener
    window.addEventListener("batterystatus", onBatteryStatus, false);
    // Add device orientation listener
    window.addEventListener('orientationchange', function () {
        console.log('window.orientation : ' + window.orientation);
        document.getElementById("screenOrientation").innerHTML = screen.orientation.type;
        console.log(screen.orientation.type);
    });

    universalLinks.subscribe('eventName', didLaunchAppFromLink);
})

function didLaunchAppFromLink(eventData) {
    alert('Did launch application from the link: ' + eventData.url);
}

function onBatteryStatus(status) {
    console.log("Batterylevel: " + status.level + " | Is Plugged: " + status.isPlugged);
    var progressbar = $$('.demo-progressbar-inline .progressbar');

    myApp.setProgressbar(progressbar, status.level);
    if (status.level <= 10) {
        $$('.progressbar span')[0].style.background = "red"
    } else {
        if (status.isPlugged) {
            $$('.progressbar span')[0].style.background = "lightgreen"
        } else {
            $$('.progressbar span')[0].style.background = "orange"
        }
    }
}

var lat;
var long;
function onOpenMapsPress() {
    //get Geolocation
    navigator.geolocation.getCurrentPosition(function onSuccess(position) {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
    }, function onError() {
        alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    });
    window.open("https://www.google.de/maps/?q=" + this.lat + "," + this.long);
}

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page
    console.log("About opened");
})

function onSendMessagePress() {
    window.plugins.socialsharing.shareViaSMS('My awesome message', null, function (msg) {
        console.log('ok: ' + msg)
    }, function (msg) {
        alert('error: ' + msg)
    });
}

function cameraPressed() {
    console.log("Camera Pressed");

    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI
    });

    function onSuccess(imageURI) {
        var image = document.getElementById('myImage');
        image.src = imageURI;
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

function setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
}

function takePicture(selection) {

    var srcType = Camera.PictureSourceType.CAMERA;
    var options = this.setOptions(srcType);
    var func = this.createNewFileEntry;

    navigator.camera.getPicture(function cameraSuccess(imageUri) {

        this.displayImage(imageUri);
        // You may choose to copy the picture, save it somewhere, or upload.
        func(imageUri);

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}
function displayImage(imgUri) {

    var elem = document.getElementById('imageFile');
    elem.src = "data:image/JPEG;base64," + imgUri;

}
