
  var db = require('mysql2-promise')();
 
  db.configure({
    "host": "127.0.0.1",
    "user": "root",
    "password": "Diva@1234",
    "database": "taskschema",
  });

  module.exports=db