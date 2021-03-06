function init() {
	document.addEventListener("deviceready", deviceReady, true);
  document.addEventListener("offline", onOffline, false); 
	delete init;
}

//Sezione per le notifiche ad Android e iOS

function addNotify(){
    try{ 
        var pushNotification = window.plugins.pushNotification;
        if ( device.platform == 'android' || device.platform == 'Android' ){ 
           pushNotification.register(
           successHandler,
           errorHandler, {
           "senderID":"1073127551296",
           "ecb":"onNotificationGCM"
           });
        }else{
           pushNotification.register(
           tokenHandler, 
           errorHandler, {
           "badge":"true",
           "sound":"true",
           "alert":"true",
           "ecb":"onNotificationAPN"
           });	// required!
        }    
    }catch(err){ 
        txt="There was an error on this page.\n\n"; 
        txt+="Error description: " + err.message + "\n\n"; 
        //alert(txt); 
    }
}

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



function receivedEvent(id) {
            var parentElement = document.getElementById(id);
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');
            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
            console.log('Received Event: ' + id);      
        }
        // result contains any message sent from the plugin call
        function successHandler(result) {
         //   alert('Callback Success! Result = '+result)
        }
        function errorHandler(error) {
            //alert('errorHandler = '+error);
        }
        function tokenHandler(result) {    
          //Quando il token � pronto lo inserisco nel database delle notifiche
          var url='http://www.confcommercioverona.it/app/notify_newdevice.php?deviceid='+device.uuid+'&platform='+device.platform+'&model='+device.model+'&registrationId='+result+'&notifiche='+window.localStorage["notifiche_off"];
          //ricordarsi l'encodeURI per iOS
          var ref = window.open(encodeURI(url), '_blank','hidden=yes');
          ref.addEventListener('loadstart', function() {});
          ref.addEventListener('loadstop', function() {});
          ref.addEventListener('exit', function() {}); 
          // close InAppBrowser after 5 seconds
          setTimeout(function() {
            ref.close();
          }, 500);
        }
        
        function onConfirm(button,id,platform) {
        
          var loc="";
          
          if(id=="rassegna"){
            loc="rassegna-stampa.html";
          }else
          if(id=="commercio"){
            loc="il-commercio-veronese.html";
          }else{
            loc="apri.html?notify_id="+id;
          }
          
          
          if(platform=='android'){
            if(button==2){
              window.location.replace(loc);
            }else{
              window.location.replace("menu.html");  //ricorda che nella schermata di login non ci sono le notifiche
            }
          }else{
            if(button==1){
              window.location.replace(loc);
            }else{
              window.location.replace("menu.html");  //ricorda che nella schermata di login non ci sono le notifiche
            }
          }
        }//onConfirm
    
        // iOS
        function onNotificationAPN(event) {
              
              if (event.alert) {

                  var str = event.alert;
                  var res = str.split("***");   
                
                navigator.notification.confirm(
                    res[0],                             // message
                    function(buttonIndex){
                        onConfirm(buttonIndex, res[1],'ios');
                    },      
                    "Confcommercio Verona",             // title
                    'Si,No'                             // buttonLabels
                ); 

              }    

            if (event.badge) {
                console.log("Set badge on  " + pushNotification);
                pushNotification.setApplicationIconBadgeNumber(this.successHandler, event.badge);
            }
            if (event.sound) {
                var snd = new Media(event.sound);
                snd.play();
            }
            
        }
        //Android
        function onNotificationGCM(e) {
            switch( e.event )
            {
              case 'registered':
                if ( e.regid.length > 0 )
                  {
     
                    //Quando il device � pronto lo inserisco nel database delle notifiche
                    var url='http://www.confcommercioverona.it/app/notify_newdevice.php?deviceid='+device.uuid+'&platform='+device.platform+'&model='+device.model+'&registrationId='+e.regid+'&notifiche='+window.localStorage["notifiche_off"];
                    var ref = window.open(url, '_blank','hidden=yes');
                    ref.addEventListener('loadstart', function() {});
                    ref.addEventListener('loadstop', function() {});
                    ref.addEventListener('exit', function() {}); 
                    // close InAppBrowser after 5 seconds
                    setTimeout(function() {
                      ref.close();
                    }, 500);     
                    //alert("RegistrationId= "+registrationId);
    
                  }
                    break;
    
                    //questo � il comportamento che segue quando viene ricevuta una notifica
                case 'message':
                    // this is the actual push notification. its format depends on the data model from the push server
                    var str = e.message;
                    var res = str.split("***");
    
                        var x="";
                    //On Android 3.0 and later, the buttons will be displayed in reverse order for devices using the Holo theme.
                          
                    navigator.notification.confirm(
                    res[0],                             // message
                    function(buttonIndex){
                        onConfirm(buttonIndex, res[1],'android');
                    },      
                    "Confcommercio Verona",             // title
                    'No,Si'                             // buttonLabels
                );
    
                    break;
    
                case 'error':
                    alert('GCM error = '+e.msg);
                    break;
    
                default:
                    alert('An unknown GCM event has occurred');
                    break;
            }
        }


//Funzioni generiche



function deviceReady() {
  addNotify(); 
} 
function onOffline() { 
  window.location.replace("offline.html"); 
}

