const cron = require("node-cron");
const request = require('request');

const today = Date.now();
console.log(JSON.stringify(today))

const dbdate = new Date('2021-03-25T05:26:15.231Z');
const dbdate2 = new Date('2021-03-25T09:26:15.231Z');
const dbdate3 = new Date('2021-03-25T11:26:15.231Z');
let data=[
{
  "api":"http://localhost:3000/hello_world",
  "callApiAt":dbdate,
  "status":1
},
{
"api":"http://localhost:3000/hello_world2",
"callApiAt":dbdate2,
"status":1
},
{
  "api":"http://localhost:3000/hello_world3",
  "callApiAt":dbdate3,
  "status":1
}]
module.exports = {
  updateGames: (time) => {
    cron.schedule(time, async() => {
      var a=data
        try {
        for(let key of a){ 
         if(today >= key.callApiAt && key.status==1){
          request(key.api, { json: true }, (err, res, body) => {
          if (err){ 
            return console.log(err); 
          }
          console.log(body);
          key.status=0
          console.log(a)
  
          });    
          }

        }
        }
        catch (err){
              console.log("error in cron updateTag" );
        }
    },
    {
      scheduled: true,
      timezone: "America/Sao_Paulo"
    });
  }  
}
