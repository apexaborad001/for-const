const cron = require("node-cron");
module.exports = {
  updateGames: (time) => {
    cron.schedule(time, async() => {
      try {
 
         // some code here
      } catch (err) {
        console.log("error in cron updateTag" );
      }
    });
  }  
}
