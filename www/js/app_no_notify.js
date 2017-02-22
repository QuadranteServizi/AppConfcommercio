function init() {
	document.addEventListener("deviceready", deviceReady, true);
  document.addEventListener("offline", onOffline, false);
  document.addEventListener("pause", onPause, false);
	delete init;
}

//Sezione per le notifiche ad Android e iOS

function abilitaNotifiche(){
//vedi template.js per il trigger
        var url='http://www.confcommercioverona.it/app/notify_newdevice.php?deviceid='+device.uuid+'&notifiche=on';
        var ref = window.open(url, '_blank','hidden=yes');
        ref.addEventListener('loadstart', function() {});
        ref.addEventListener('loadstop', function() {});
        ref.addEventListener('exit', function() {}); 
        // close InAppBrowser after 5 seconds
        setTimeout(function() {
           ref.close();
        }, 500);  
}

function disabilitaNotifiche(){
//vedi template.js per il trigger
        var url='http://www.confcommercioverona.it/app/notify_newdevice.php?deviceid='+device.uuid+'&notifiche=off';
        var ref = window.open(url, '_blank','hidden=yes');
        ref.addEventListener('loadstart', function() {});
        ref.addEventListener('loadstop', function() {});
        ref.addEventListener('exit', function() {}); 
        // close InAppBrowser after 5 seconds
        setTimeout(function() {
           ref.close();
        }, 500);  
}


//Funzioni generiche

function deviceReady() {

} 
function onOffline() { 
  window.location.replace("offline.html"); 
}

@Override
public void onPause() {
    super.onPause();
    myCustomWebView.onPause();
     if (typeof document.app.player != "undefined") {
    document.app.player.pauseVideo();
  }
}