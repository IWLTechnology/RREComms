    function send(){
      sendMessage(document.getElementById('post').value);
      document.getElementById('post').value = '';
    }
    
    
    function getMessages(){
      var oldChats = document.getElementById('chats').value;
      var oldIds = document.getElementById('ids').value;
      var logins = ['', '', '']
      logins[0] = document.getElementById('un').value;
      logins[1] = document.getElementById('pw').value;
      logins[2] = document.getElementById('pin').value;
      submitData('/', '1', [['un', logins[0]], ['pw', logins[1]], ['pin', logins[2]], ['mode', 'get']])
      document.getElementById('iframes').children[0].addEventListener('load', function(){
        document.getElementById('ids').value = document.getElementById('iframes').children[0].contentWindow.document.getElementById('ids').value;
          document.getElementById('chats').value = document.getElementById('iframes').children[0].contentWindow.document.getElementById('chats').value;
          document.getElementById('iframes').innerHTML = '';
          splitMessages();
          if(oldChats != document.getElementById('chats').value){
            if(document.getElementById('toggleSound').innerHTML == 'Mute'){
                message('You got a new message!', 'Open RLComms / Games to see more.')
                createjs.Sound.play("messageIn");
            }
          }
      });
    }
    
    function deleteMessage(id){
      var logins = ['', '', '']
      logins[0] = document.getElementById('un').value;
      logins[1] = document.getElementById('pw').value;
      logins[2] = document.getElementById('pin').value;
      submitData('/', '1', [['un', logins[0]], ['pw', logins[1]], ['pin', logins[2]], ['mode', 'delete'], ['id', id]]);
            document.getElementById('iframes').children[0].addEventListener("load", function(){
              document.getElementById('iframes').innerHTML = '';
          getMessages()
              if(document.getElementById('toggleSound').innerHTML == 'Mute'){
                createjs.Sound.play("messageError");
              }
            })
    }

  
    function sendMessage(message){
      var logins = ['', '', '']
      logins[0] = document.getElementById('un').value;
      logins[1] = document.getElementById('pw').value;
      logins[2] = document.getElementById('pin').value;
      submitData('/', '1', [['un', logins[0]], ['pw', logins[1]], ['pin', logins[2]], ['mode', 'post'], ['post', message]]);
      document.getElementById('iframes').children[0].addEventListener('load', function(){
        document.getElementById('iframes').innerHTML = '';
          getMessages()
        if(document.getElementById('toggleSound').innerHTML == 'Mute'){
          createjs.Sound.play("messageOut");
        }
      })
    }
    
    function splitMessages(){
      document.getElementById('messages').innerHTML = '';
      var chats = document.getElementById('chats').value;
      var ids = document.getElementById('ids').value;
      chats = chats.split(';');
      ids = ids.split(';');
      
      for(var i = 0; i < chats.length; i++){
        var chat = chats[i];
        var id = ids[i];
        document.getElementById('messages').innerHTML += `<div id="chat" class="w3-bar"><span class="w3-bar-item">${chat}</span><span></span><a class="w3-blue w3-btn w3-round-large w3-border w3-border-blue w3-ripple w3-center w3-bar-item" onclick="deleteMessage(${id})">Delete</a></div><br/><br/>`
      }
    }
    
    function logout(){
      window.location.assign('/');
    }
    
    function init(){
      message('RLComms is active!', 'RLComms is active!')
      document.getElementById("enabled").style.display = "block";
      document.getElementById("disabled").style.display = "none";
      splitMessages();
      window.setInterval(function(){
        getMessages();
      }, 1600)
      if (!createjs.Sound.initializeDefaultPlugins()) {
          console.log ("Error loading SoundJS");
          alert('SOUND ERROR - Error Loading SoundJS');
        } else {
          console.log ("Success loading SoundJS");
        	createjs.Sound.addEventListener("fileload", playSound);
          createjs.Sound.alternateExtensions = ["mp3"];
          createjs.Sound.registerSounds(
            [ {id: "messageIn",  src: "messageIn.ogg"},
              {id: "messageOut",  src: "messageOut.ogg"},
            {id: "messageLoad",  src: "messageLoad.ogg"},
            {id: "messageError",  src: "messageError.ogg"} ],
              "//cdn.glitch.global/7fa50741-117a-440b-9131-6b9e1e32b36c/");
        }
      
    }
    
    function submitData(address, id, params){
      var iframe = document.createElement('iframe');
      iframe.style = "";
      iframe.name = 'iframe' + id;
      document.getElementById('iframes').appendChild(iframe);
      
      var form = document.createElement('form');
      form.style = "";
      
      form.action = address;
      form.method = 'POST';
      form.target = iframe.name;
      
      for (var i = 0; i < params.length; i++) {
        var input = document.createElement('input');
        input.type = 'password';
        input.name = params[i][0];
        input.value = params[i][1];
        form.appendChild(input);
      }
      document.getElementById('iframes').appendChild(form);
      form.submit();
    }
  
    
    window.addEventListener("load", init);

      function playSound(ev) {
        console.log("Preloaded:", ev.id, ev.src);
      }
    
    function downloadFile(content, fileName, fileType){ //credit to https://www.therogerlab.com/sandbox/pages/how-to-create-and-download-a-file-in-javascript?s=0ea4985d74a189e8b7b547976e7192ae.7213739ce01001e16cc74602189bfa09
      var file = new File(["\ufeff"+content], fileName, {type: fileType});
      var url = window.URL.createObjectURL(file);
      var a = document.createElement("a");
      a.style = "display: none";
      a.href = url;
      a.download = file.name;
      a.click();
      window.URL.revokeObjectURL(url);
    } 
    
    
    function exportChats(){
      if(document.getElementById('toggleSound').innerHTML == 'Mute'){
        createjs.Sound.play("messageLoad");
      }
      var date = new Date();
      downloadFile(document.getElementById('chats').value, 'RLComms_Exported_Chats_' + date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear() + '_' + date.getHours() + '.' + date.getMinutes() + '.iwltechdata', 'text/encrypted:charset=UTF-8');
    }
    
    function importChats(){
      document.getElementById('enabled').style.display = 'none';
      document.getElementById('importForm').style.display = 'block';
    }
    
    function toggleSound(){
      if(document.getElementById('toggleSound').innerHTML == 'Mute'){
        document.getElementById('toggleSound').innerHTML = 'Unmute';
      }else{
        document.getElementById('toggleSound').innerHTML = 'Mute';
      }
    }

function message(title, message) {
    if (!window.Notification) {
        //alert('Browser does not support notifications.');
    } else {
        // check if permission is already granted
        if (Notification.permission === 'granted') {
            // show notification here
            var notify = new Notification(title, {
                body: message,
                icon: 'https://cdn.glitch.global/7fa50741-117a-440b-9131-6b9e1e32b36c/Logo-Plug-WhiteBG.png?v=1686796219050',
            });
        } else {
            // request permission from user
            Notification.requestPermission().then(function (p) {
                if (p === 'granted') {
                    // show notification here
                    var notify = new Notification(title, {
                body: message,
                icon: 'https://cdn.glitch.global/7fa50741-117a-440b-9131-6b9e1e32b36c/Logo-Plug-WhiteBG.png?v=1686796219050',
            });
                } else {
                    //alert('User blocked notifications.');
                }
            }).catch(function (err) {
                console.error(err);
            });
        }
    }
}