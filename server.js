
const os = require('os');
const fs = require('fs');

const path = require("path");
const db = require("./src/sqlite.js");


const fastify = require("fastify")({
  logger: false,
  bodyLimit: 10 * 1024 * 1024
});

fastify.register(require('@fastify/multipart'), { attachFieldsToBody: true });


const seo = require("./seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});


fastify.register(require("@fastify/formbody"));


fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

fastify.get("/", async (req, reply) => {
  let params = req.query.raw ? {} : { seo: seo };

  return req.query.raw ? reply.send(params) : reply.view("/src/pages/index.hbs", params);
});

fastify.get("/install", async (req, reply) => {
  let params = req.query.raw ? {} : { seo: seo };

  return req.query.raw ? reply.send(params) : reply.view("/src/pages/install.hbs", params);
});

fastify.post('/', async (req, reply) => {
  let params = req.query.raw ? {} : { seo: seo };
  const status = 200;
  var view = '/src/pages/index.hbs';
    
    if(req.body.mode == "post"){
      if(req.body.un == process.env.run && req.body.pw == process.env.rpw && req.body.pin == process.env.rpin){
        view = '/src/pages/post.hbs';
        var date = new Date();
    var txt = req.body.post;
	  txt = txt.replace(/\n/g, "<br />");
    txt = txt.replace(/;/g, ",");
    txt = txt.replace(/\'/g, "\"");
    date = date.toLocaleString('en-US', { timeZone: 'Australia/Perth' });
    var temp = "R: " + txt + " (Posted on " + date + ")";
    await db.addMessage(temp);
      }else if(req.body.un == process.env.pun && req.body.pw == process.env.ppw && req.body.pin == process.env.ppin){
        view = '/src/pages/post.hbs';
        var date = new Date();
    var txt = req.body.post;
	  txt = txt.replace(/\n/g, "<br />");
    txt = txt.replace(/;/g, ",");
    txt = txt.replace(/\'/g, "\"");
    date = date.toLocaleString('en-US', { timeZone: 'Australia/Perth' });
    var temp = "P: " + txt + " (Posted on " + date + ")";
    await db.addMessage(temp);
      }else if(req.body.un == process.env.eun && req.body.pw == process.env.epw && req.body.pin == process.env.epin){
        view = '/src/pages/post.hbs';
        var date = new Date();
    var txt = req.body.post;
	  txt = txt.replace(/\n/g, "<br />");
    txt = txt.replace(/;/g, ",");
    txt = txt.replace(/\'/g, "\"");
    date = date.toLocaleString('en-US', { timeZone: 'Australia/Perth' });
    var temp = "E: " + txt + " (Posted on " + date + ")";
    await db.addMessage(temp);
      }else{
        //login incorrect
        params.error = "ERROR 403. ACCESS DENIED"
      }
    }else if(req.body.mode == "delete"){
      if(req.body.un == process.env.run && req.body.pw == process.env.rpw && req.body.pin == process.env.rpin){
        view = '/src/pages/del.hbs';
        db.delMessage(req.body.id);
      }else if(req.body.un == process.env.pun && req.body.pw == process.env.ppw && req.body.pin == process.env.ppin){
        view = '/src/pages/del.hbs';
         db.delMessage(req.body.id);       
      }else if(req.body.un == process.env.eun && req.body.pw == process.env.epw && req.body.pin == process.env.epin){
        view = '/src/pages/del.hbs';
         db.delMessage(req.body.id);       
      }else{
        params.error = "ERROR 403. ACCESS DENIED."
      }
    }else if(req.body.mode == "get"){
      if(req.body.un == process.env.run && req.body.pw == process.env.rpw && req.body.pin == process.env.rpin){
        params.error = "";
      view = '/src/pages/get.hbs';
        params.un = process.env.run;
        params.pw = process.env.rpw;
        params.pin = process.env.rpin;
      var dbIn = await db.getMessages();
        var chats = [];
        var ids = [];
        if(dbIn){
          chats = dbIn.map((dbIn) => dbIn.chat); //import chats
          ids = dbIn.map((dbIn) => dbIn.id); //import ids
          
          var sendChats = "";
          var sendIds = "";
          sendChats += chats[chats.length-1];
          for(var i = chats.length-2; i > 1; i--){
            sendChats += ";" + chats[i];
          } //chats now in sendChats, separated by &
          
          sendIds += ids[ids.length-1];
          for(var i = ids.length-2; i > 1; i--){
            sendIds += ";" + ids[i];
          } //ids now in sendIds, separated by &
          
          params.ids = sendIds;
          params.chats = sendChats; //Now sent to page.
        }
      }else if(req.body.un == process.env.pun && req.body.pw == process.env.ppw && req.body.pin == process.env.ppin){
        params.un = process.env.pun;
        params.pw = process.env.ppw;
        params.pin = process.env.ppin;
       params.error = "";
      view = '/src/pages/get.hbs';
      var dbIn = await db.getMessages();
        var chats = [];
        var ids = [];
        if(dbIn){
          chats = dbIn.map((dbIn) => dbIn.chat); //import chats
          ids = dbIn.map((dbIn) => dbIn.id); //import ids
          
          var sendChats = "";
          var sendIds = "";
          sendChats += chats[chats.length-1];
          for(var i = chats.length-2; i > 1; i--){
            sendChats += ";" + chats[i];
          } //chats now in sendChats, separated by &
          
          sendIds += ids[ids.length-1];
          for(var i = ids.length-2; i > 1; i--){
            sendIds += ";" + ids[i];
          } //ids now in sendIds, separated by &
          
          params.ids = sendIds;
          params.chats = sendChats; //Now sent to page.
        } 
      }else if(req.body.un == process.env.eun && req.body.pw == process.env.epw && req.body.pin == process.env.epin){
        params.un = process.env.eun;
        params.pw = process.env.epw;
        params.pin = process.env.epin;
       params.error = "";
      view = '/src/pages/get.hbs';
      var dbIn = await db.getMessages();
        var chats = [];
        var ids = [];
        if(dbIn){
          chats = dbIn.map((dbIn) => dbIn.chat); //import chats
          ids = dbIn.map((dbIn) => dbIn.id); //import ids
          
          var sendChats = "";
          var sendIds = "";
          sendChats += chats[chats.length-1];
          for(var i = chats.length-2; i > 1; i--){
            sendChats += ";" + chats[i];
          } //chats now in sendChats, separated by &
          
          sendIds += ids[ids.length-1];
          for(var i = ids.length-2; i > 1; i--){
            sendIds += ";" + ids[i];
          } //ids now in sendIds, separated by &
          
          params.ids = sendIds;
          params.chats = sendChats; //Now sent to page.
        } 
      }else{
        params.error = "ERROR 403. ACCESS DENIED."
      }
      
    }else if(req.body.mode == "login"){
      //Login
      if(req.body.un == process.env.run && req.body.pw == process.env.rpw && req.body.pin == process.env.rpin){
        //R login
        params.un = process.env.run;
        params.pw = process.env.rpw;
        params.pin = process.env.rpin;
        view = '/src/pages/chatHome.hbs';
        params.name = 'R';
        params.error = "";
      var dbIn = await db.getMessages();
        var chats = [];
        var ids = [];
        if(dbIn){
          chats = dbIn.map((dbIn) => dbIn.chat); //import chats
          ids = dbIn.map((dbIn) => dbIn.id); //import ids
          
          var sendChats = "";
          var sendIds = "";
          sendChats += chats[chats.length-1];
          for(var i = chats.length-2; i > 1; i--){
            sendChats += ";" + chats[i];
          } //chats now in sendChats, separated by &
          
          sendIds += ids[ids.length-1];
          for(var i = ids.length-2; i > 1; i--){
            sendIds += ";" + ids[i];
          } //ids now in sendIds, separated by &
          
          params.ids = sendIds;
          params.chats = sendChats; //Now sent to page.
        }
      }else if(req.body.un == process.env.pun && req.body.pw == process.env.ppw && req.body.pin == process.env.ppin){ //L login
        params.image = '';
        params.un = process.env.pun;
        params.pw = process.env.ppw;
        params.pin = process.env.ppin;
        view = '/src/pages/chatHome.hbs';
        params.name = 'P';
        params.error = "";
      var dbIn = await db.getMessages();
        var chats = [];
        var ids = [];
        if(dbIn){
          chats = dbIn.map((dbIn) => dbIn.chat); //import chats
          ids = dbIn.map((dbIn) => dbIn.id); //import ids
          
          var sendChats = "";
          var sendIds = "";
          sendChats += chats[chats.length-1];
          for(var i = chats.length-2; i > 1; i--){
            sendChats += ";" + chats[i];
          } //chats now in sendChats, separated by &
          
          sendIds += ids[ids.length-1];
          for(var i = ids.length-2; i > 1; i--){
            sendIds += ";" + ids[i];
          } //ids now in sendIds, separated by &
        
          params.ids = sendIds;
          params.chats = sendChats; //Now sent to page.
        }
      }else if(req.body.un == process.env.eun && req.body.pw == process.env.epw && req.body.pin == process.env.epin){ //L login
        params.image = 'https://cdn.glitch.global/6e956837-d71d-4381-b8e8-10bc54d84ceb/unnamed.jpg?v=1709269377610';
        params.un = process.env.eun;
        params.pw = process.env.epw;
        params.pin = process.env.epin;
        view = '/src/pages/chatHome.hbs';
        params.name = 'E';
        params.error = "";
      var dbIn = await db.getMessages();
        var chats = [];
        var ids = [];
        if(dbIn){
          chats = dbIn.map((dbIn) => dbIn.chat); //import chats
          ids = dbIn.map((dbIn) => dbIn.id); //import ids
          
          var sendChats = "";
          var sendIds = "";
          sendChats += chats[chats.length-1];
          for(var i = chats.length-2; i > 1; i--){
            sendChats += ";" + chats[i];
          } //chats now in sendChats, separated by &
          
          sendIds += ids[ids.length-1];
          for(var i = ids.length-2; i > 1; i--){
            sendIds += ";" + ids[i];
          } //ids now in sendIds, separated by &
        
          params.ids = sendIds;
          params.chats = sendChats; //Now sent to page.
        }
      }else{
        //Login fail
        params.error = 'INCORRECT LOGIN DETAILS';
      }
      
    }else if(req.body.mode == 'importChats'){

    }else{
      //checks fail
      params.error = 'ERROR 403. ACCESS DENIED.';
    }
  return req.query.raw ? reply.status(status).send(params) : reply.status(status).view(view, params);
})

fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
    fastify.log.info(`server listening on ${address}`);
  }
);
