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
          if(document.getElementById('iframes').children[0].contentWindow.document.getElementById('chats').value != oldChats){
          document.getElementById('ids').value = document.getElementById('iframes').children[0].contentWindow.document.getElementById('ids').value;
          document.getElementById('chats').value = document.getElementById('iframes').children[0].contentWindow.document.getElementById('chats').value;
            document.getElementById('iframes').innerHTML = '';
            if(document.getElementById('toggleSound').innerHTML == 'Mute'){
                message('You got a new message!', 'Open RLComms / Games to see more.')
                createjs.Sound.play("messageIn");
            }
            splitMessages();
          }else{
            document.getElementById('iframes').innerHTML = '';
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
      var id = document.getElementById('ids').value.split(';')
      checkAuthor(id[id.length-1]);
      var name = document.getElementById('name').value;
      message = message + `<input type="text" value="${name}" class="messagePostedBy" style="display: none;">`;
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
    function checkAuthor(id){
      var x = document.getElementById('chat' + id);
      var y = x.innerHTML.split('<input type="text" value="');
      var author = y[1].split('" class="messagePostedBy"')[0];
      alert(author);
      
    }
    function splitMessages(){
      document.getElementById('messages').innerHTML = '';
      var chats = document.getElementById('chats').value;
      var ids = document.getElementById('ids').value;
      chats = chats.split(';');
      ids = ids.split(';');
      var chats2 = [];
      var ids2 = [];
          for(var i = chats.length-1; i > -1; i--){
            chats2.push(chats[i]);
          } //chats now in sendChats, separated by &
          
          for(var i = ids.length-1; i > -1; i--){
            ids2.push(ids[i]);
          } //ids now in sendIds, separated by &
      
      for(var i = 0; i < chats2.length; i++){
        var chat = chats2[i];
        var id = ids2[i];
        document.getElementById('messages').innerHTML += `<div id="chat${id}" class="w3-bar"><span class="w3-bar-item">${chat}</span><span></span><a class="w3-blue w3-btn w3-round-large w3-border w3-border-blue w3-ripple w3-center w3-bar-item" onclick="deleteMessage(${id})">Delete</a></div><br/><br/>`
      }
    }
    
    function logout(){
      window.location.assign('/');
    }
    
    function init(){
      setTimeout(function(){
             document.getElementById("msbtm").click(); 
      }, 100);
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

function image(){
  var source = prompt('Enter the URL of the image to be added to the end of the message you have currently typed:');
  if(source != null){
    if(source.search('data:') == -1){
      document.getElementById('post').value += `<img src="${source}">`;
    }else{
      alert('You cannot use images without a url; they cannot contain data: in it.');
    }
  }
}
function video(){
  var source = prompt('Enter the URL of the video to be added to the end of the message you have currently typed:');
  if(source != null){
    if(source.search('youtube.com') == -1){
       document.getElementById('post').value += `<video controls>
  <source src="${source}" type="video/mp4">
  <source src="${source}" type="video/ogg">
  <source src="${source}" type="video/webm">
  <source src="${source}" type="video/mov">
  Your browser does not support the video tag.
</video>`;
    }else{
      source = source.split('/watch?v=')[1];
      document.getElementById('post').value += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${source}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    }
  }
}
function audio(){
  var source = prompt('Enter the URL of the audio file to be added to the end of the message you have currently typed:');
    if(source != null){
     document.getElementById('post').value += `<audio controls>
  <source src="${source}" type="audio/ogg">
  <source src="${source}" type="audio/mpeg">
  Your browser does not support the audio tag.
</audio>`;
  }
}
function link(){
  var source = prompt('Enter the URL of the link to be added to the end of the message you have currently typed:');
  var txt = prompt('Enter the text to display as the link (leave blank to use the URL as the text):');
  if(source != null){
    if(txt != ''){
     document.getElementById('post').value += `<a href="${source}">${txt}</a>`; 
    }else{
      document.getElementById('post').value += `<a href="${source}">${source}</a>`;
    }
  }
}