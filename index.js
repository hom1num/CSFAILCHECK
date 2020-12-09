const request = require('request');
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient("mongodb://localhost:27017/");
function rq(param){
    mongoClient.connect(function(err, client){
        const db = client.db("CSFAIL");
        const collection = db.collection("games");
    request(`https://api.cs.fail/crash/get-game/${param}`, function (error, response, body) {
        var startTime = Date.now();
        console.error('error:', error); // Print the error if one occurred
        if(error){
            console.log(`Игра ${param}, не получена`);
        }else{
            console.log(`Игра ${param}, успешно получена`);
        }
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        var q =JSON.parse(body);
        if(q.error_text=="api.crash.no_game"){
            client.close();
            return console.log("Игр больше нет, сбор данных завершен.");
        }
        collection.insertOne(q, function(err, result){
          
            if(err){ 
                return console.log(err);
            }
            console.log(result.ops);
        });
        console.log(`Запрос завершён за ${(Date.now()-startTime)/100}`);
        setTimeout(rq,100,param+1);
      });
      if(err){
        return console.log(err);
    }
});
}
rq(50000);