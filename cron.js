const cron = require("node-cron");
module.exports = {
  updateGames: (time) => {
    cron.schedule(time, async() => {
      try {
        console.log("Cron run");  
         // some code here
      } catch (err) {
        console.log("error in cron updateTag" );
      }
      
    },
    {
      scheduled: true,
      timezone: "America/Sao_Paulo"
    });
  }  
}
