const cron = require("node-cron");
const models = require("./models");
const connection = models.sequelize;
const helper = require('./helper/common-helper');
const path = require("path");
const fs = require("fs");
const moment = require("moment");
 const sendReminder = async () => {
       try {
        let date2 = new Date();
        let dateTime = moment(date2).format("YYYY-MM-DD HH:mm:ss");
        if(dateTime > "2021-05-07 13:00" && dateTime < "2021-05-07 13:02"){
        
        const sql2 = `select * from cron_history where type="reminder"`;
       const getQueryResult2 = await connection.query(sql2, { type: models.Sequelize.QueryTypes.SELECT });
        
        if(getQueryResult2 == 0){
        
        const sql = `select distinct users.firstName as user, users.email from user_breaket_teams ubt inner join user_breakets ubs on ubs.id=ubt.user_bracket_id inner join users on ubs.user_id=users.id where ubt.winner_id is null or ubt.team_1_id is null or ubt.team_2_id is null group by email`;
       const getQueryResult = await connection.query(sql, { type: models.Sequelize.QueryTypes.SELECT });
       for(let row of getQueryResult){
            let template = "Reminder.html";
              let to_id = row.email,
              subject = "Reminder MAil",
              template_name = template,
              replacements = {user:row.user};
              helper.sendEmail(process.env.mailFrom, "kumarsm2405@gmail.com", subject, template_name, replacements);        
       }
	let cnt = getQueryResult.length;
	const sql1 = `insert into cron_history values (NULL, 'reminder', ${cnt}, "${dateTime}", "${dateTime}")`;
        const getQueryResult1 = await connection.query(sql1, { type: models.Sequelize.QueryTypes.UPDATE });
	
       return getQueryResult;
       }
       }
      } catch (err) {
        console.log("Error in send Reminder" + err);
      }
  };

module.exports = {
  DailyCron: (time) => {
    cron.schedule(time, async() => {
      try {
        //const sql = `select distinct user_bracket_id from user_breaket_teams ubt inner join user_breakets ubs on ubs.id=ubt.user_bracket_id inner join users on ubs.user_id=users.id where ubt.winner_id is null or ubt.team_1_id is null or ubt.team_2_id is null order by user_id`;
        //const getQueryResult = await connection.query(sql, { type: models.Sequelize.QueryTypes.SELECT })
        //console.log("Logs....", getQueryResult);
        sendReminder();
      } catch (err) {
        console.log("Error reschedule notification appointment-" + err);
      } finally {
        
      }
    })
  },
  
  
  ScoreCard: (time) => {
    cron.schedule(time, async() => {
      try {
        let sql = `SELECT tgs.game_id, tgs.bracket_id, tgs.winner_id, tm1.name as t1_name, tgs.team1_score, tm1.thumbnails as t1_thumbnails, tm2.name as t2_name, tgs.team2_score, tm2.thumbnails as t2_thumbnails, tls.name as league_name, tls.gender as gender FROM tournament_games tgs inner join tournament_breakets tbs on tgs.bracket_id=tbs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id left join tournament_teams tm1 on tm1.team_id=tgs.team_1_id left join tournament_teams tm2 on tm2.team_id=tgs.team_2_id where tgs.winner_id is not null and tgs.team1_score is not null and tgs.team2_score is not null order by tgs.bracket_id;`
        const bracketData = await connection.query(sql, { type: models.Sequelize.QueryTypes.SELECT })
     let games = {};
     for (let row of bracketData) {
      let {league_name, game_id, winner_id, t1_name, t1_thumbnails, t2_name, t2_thumbnails, team1_score,team2_score, gender} = row;
      if(games[league_name]){
         games[league_name].push({t1_name, t2_name, team1_score, team2_score})
      }else{
      	games[league_name] = [{t1_name, t2_name, team1_score, team2_score}];
      }
     }
     let strData = getScoreHtml(games);
    
       let template = "Score.html";
       let template2 = "scoretosend.html";
       let template_path = path.join(__dirname, "./", "templates/")
       let html = fs.readFileSync(template_path + template, "utf8");
       html = html.replace("women_cup_score", strData, html);
       fs.writeFileSync(template_path + template2, html);

      
    

          let subject = "Test",
            template_name = template2,
            replacements = { women_cup_score: strData, url:process.env.BASE_URL_FRONTEND};
            helper.sendEmail(process.env.mailFrom, "surendramaurya@mobikasa.com", subject, template_name, replacements);
      
              console.log("mail sent successfulyy");
      } catch (err) {
        console.log("Error reschedule notification appointment-" + err);
      } finally {
        
      }
    })
  },
  
  
    
}










const getScoreHtml = (games)=>{
	let scorep = ` <p
                                  style="
                                    text-align: right;
                                    font-family: MaisonNeue;
                                    font-size: 12px;
                                    font-weight: normal;
                                    display: inline-block;
                                    width: 14%;
                                    float: right;
                                    margin: 0;
                                    font-stretch: normal;
                                    opacity: 0.5;
                                    font-style: normal;
                                    padding: 8px 5px;
                                    line-height: normal;
                                    letter-spacing: normal;
                                    text-align: right;
                                    color: #525252;
                                  "
                                >`;
   let teamp = ` <p
                                  style="
                                    font-family: MaisonNeue;
                                    font-size: 12px;
                                    margin: 0;
                                    font-weight: normal;
                                    font-stretch: normal;
                                    font-style: normal;
                                    padding: 5px;
                                    display: inline-block;
                                    line-height: normal;
                                    width: 50%;
                                    letter-spacing: normal;
                                    color: #333333;
                                  "
                                >`;    
   
    let strData = "";
    for(let key in games){
    	strData += `<table>
                  <tr>
                    <td align="center">
                      <p
                        style="
                          font-family: Montserrat;
                          font-size: 16px;
                          margin: 0;
                          font-weight: 500;
                          font-stretch: normal;
                          font-style: normal;
                          line-height: normal;
                          letter-spacing: 0.33px;
                          color: #0a2f6a;
                          margin-bottom: 5px;
                          margin-top: 10px;
                        "
                      >
                       `+key+`
                      </p>
                    </td>
                  </tr>
                </table>
                             
                `;
           let startstr = `<table>
                  <tbody>
                    <tr class="tabletdrow" style="width: 100%">
                         ` ;
            let endStr = `</tr></tbody></table>` 
           let teamList =  games[key];   
           let gct = 0;
           for(let rowd of teamList){
               if(gct == 0){
                  strData +=startstr;
               }
               gct = gct+1;
               strData +=`<td style="width: 20%" align="center">
                        <table style="width: 100%;box-shadow: 0 3px 16px -4px rgba(0, 0, 0, 0.12);padding: 3px;">
                          <tbody>
                            <tr style=" background-color: rgba(156, 0, 0, 0.15);height: 32px;">
                              <td>
                               
                                `+teamp+`
                                  `+rowd["t1_name"]+`
                                </p>
                                 `+scorep+`
                                  54
                                </p>
                              </td>
                            </tr>
                            <tr style="background-color: #dafad9; height: 32px">
                              <td>
                               
                               `+teamp+`
                                   `+rowd["t2_name"]+`
                                </p>
                                `+scorep+`
                                  56
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>` 
               if(gct == 4){
                  strData +=endStr;
                  gct = 0
               } 
               
              
           }
           if(gct != 0){
                  strData +=endStr;
                  gct = 0
           }
           	
    }
    
    
}




