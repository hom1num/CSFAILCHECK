const request = require('request');
const MongoClient = require("mongodb").MongoClient;
function rq(param){
    var mongoClient = new MongoClient("mongodb://localhost:27017/",{ useUnifiedTopology: true });
    mongoClient.connect(function(err, client){
        var db = client.db("CSFAIL");
        var collection = db.collection("games");
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
            client.close();
            setTimeout(rq,200,param+1);
        });
        console.log(`Запрос завершён за ${(Date.now()-startTime)/100}`);
      });
      if(err){
        client.close();
        return console.log(err);
    }
});
}
rq(53412);