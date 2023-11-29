let mysql = require("mysql");
let connData = {
    host : "localhost",
    user : "root",
    password:"",
    database:"ShivamGupta",
};

let mobilesData = [];

    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM mobiles";
    connection.query(sql,function(err,result){
        if(err) console.log("Error in Database",err.message);
        else {
            mobilesData.push(result);
        }
    })

module.exports.mobilesData = mobilesData;
