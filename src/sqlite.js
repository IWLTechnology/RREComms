
const fs = require("fs");


const dbFile = "./.data/choices.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;

dbWrapper
  .open({
    filename: dbFile,
    driver: sqlite3.Database
  })
  .then(async dBase => {
    db = dBase;

    try {
      if (!exists) {
        await db.run(
          "CREATE TABLE Chats (id INTEGER PRIMARY KEY AUTOINCREMENT, chat TEXT)"
        );
        await db.run(
          "INSERT INTO Chats (chat) VALUES ('SYSTEM: DO NOT DELETE THIS MESSAGE! WELCOME TO THE NEW RLCOMMS/GAMES WITH POSTING, DELETING AND NEW MESSAGE SOUND EFFECTS! NEW GAMES WILL COME IN THIS PAGE SOON! This page now automatically deletes, posts and checks for messages. The security level is now slightly higher and you do not need to enter your login details before posting. This page does not redirect you to a different page either, and every action is completed in 800ms when the page is awake, messages are checked for every 1600ms. When the messages are loaded, only the messages part changes, not the whole page. This means that the messages you are typing in do not get cleared when the messages are checked for. Also, you can now type the ; character but the apostrophe and quote marks will be removed from your messages.')"
        );
        await db.run(
          "INSERT INTO Chats (chat) VALUES ('SYSTEM: DO NOT DELETE THIS MESSAGE! WELCOME TO THE NEW RLCOMMS/GAMES WITH POSTING, DELETING AND NEW MESSAGE SOUND EFFECTS! NEW GAMES WILL COME IN THIS PAGE SOON! This page now automatically deletes, posts and checks for messages. The security level is now slightly higher and you do not need to enter your login details before posting. This page does not redirect you to a different page either, and every action is completed in 800ms when the page is awake, messages are checked for every 1600ms. When the messages are loaded, only the messages part changes, not the whole page. This means that the messages you are typing in do not get cleared when the messages are checked for. Also, you can now type the ; character but the apostrophe and quote marks will be removed from your messages.')"
        );
      } else {

      }
    } catch (dbError) {
      console.error(dbError);
    }
  });

module.exports = {
  

  
  getMessages: async () => {
    try {
      return await db.all("SELECT * from Chats");
    } catch (dbError) {
      console.error(dbError);
    }
  },

  
  delMessage: async message => {
    try {
      await db.run(
          "DELETE FROM Chats WHERE id = " + message
        );
    } catch (dbError) {
      console.error(dbError);
    }
  },
  
  delAMessages: async message => {
    try {
      await db.run(
          "DROP TABLE Chats"
        );
      await db.run(
          "CREATE TABLE Chats (id INTEGER PRIMARY KEY AUTOINCREMENT, chat TEXT)"
        );
      await db.run(
          "INSERT INTO Chats (chat) VALUES ('SYSTEM: DO NOT DELETE THIS MESSAGE! WELCOME TO THE NEW RLCOMMS/GAMES WITH POSTING, DELETING AND NEW MESSAGE SOUND EFFECTS! NEW GAMES WILL COME IN THIS PAGE SOON! This page now automatically deletes, posts and checks for messages. The security level is now slightly higher and you do not need to enter your login details before posting. This page does not redirect you to a different page either, and every action is completed in 800ms when the page is awake, messages are checked for every 1600ms. When the messages are loaded, only the messages part changes, not the whole page. This means that the messages you are typing in do not get cleared when the messages are checked for. Also, you can now type the ; character but the apostrophe and quote marks will be removed from your messages.')"
        );
      await db.run(
          "INSERT INTO Chats (chat) VALUES ('SYSTEM: DO NOT DELETE THIS MESSAGE! WELCOME TO THE NEW RLCOMMS/GAMES WITH POSTING, DELETING AND NEW MESSAGE SOUND EFFECTS! NEW GAMES WILL COME IN THIS PAGE SOON! This page now automatically deletes, posts and checks for messages. The security level is now slightly higher and you do not need to enter your login details before posting. This page does not redirect you to a different page either, and every action is completed in 800ms when the page is awake, messages are checked for every 1600ms. When the messages are loaded, only the messages part changes, not the whole page. This means that the messages you are typing in do not get cleared when the messages are checked for. Also, you can now type the ; character but the apostrophe and quote marks will be removed from your messages.')"
        );
    } catch (dbError) {
      console.error(dbError);
    }
  },
  
  addMessage: async data => {
    try {
      return await db.all("INSERT INTO Chats (chat) VALUES (" + "'" + data + "'" + ")");
      
    } catch (dbError) {
      // Database connection error
      console.error(dbError);
    }
  },
};
