const cron = require("node-cron");
const models = require("./models");
const connection = models.sequelize;
const helper = require('./helper/common-helper');
const path = require("path");
const fs = require("fs");
const moment = require("moment");
let reminder1_start = "2021-05-11 08:00:00";
let reminder1_end = "2021-05-11 08:50:00";

let reminder2_start = "2021-05-11 08:00:00";
let reminder2_end = "2021-05-11 08:50:00";

let remove_bracket_start = "2021-05-10 11:30:00";
let remove_bracket_end = "2021-05-10 11:31:00";


let date1_start = "2021-05-11 08:00:00";
let date1_end = "2021-05-11 08:50:00";

let date2_start = "2021-05-11 08:00:00";
let date2_end = "2021-05-11 08:50:00";

let date3_start = "2021-05-11 08:00:00";
let date3_end = "2021-05-11 08:50:00";


const sendReminder = async (type) => {
       try {
          let date2 = new Date();
	  let dateTime = moment(date2).format("YYYY-MM-DD HH:mm:ss");
          const sql2 = `select * from cron_history where type="${type}"`;
          const getQueryResult2 = await connection.query(sql2, { type: models.Sequelize.QueryTypes.SELECT });
        
          if(getQueryResult2.length == 0){        
         
         const sql = `select distinct users.firstName as user, users.email from user_breaket_teams ubt inner join user_breakets ubs on ubs.id=ubt.user_bracket_id inner join users on ubs.user_id=users.id where ubt.winner_id is null  group by email;`;
        const getQueryResult = await connection.query(sql, { type: models.Sequelize.QueryTypes.SELECT });
        let template = "Reminder.html";
        if(type == "reminder_two"){
        	template = "Reminder_2nd_day.html";
        }
        for(let row of getQueryResult){
              let to_id = row["email"],
              subject = "Bracket Challenge Reminder",
              template_name = template,
              replacements = {user:row.user, url:process.env.BASE_URL_FRONTEND};
              helper.sendEmail(process.env.mailFrom, to_id, subject, template_name, replacements);        
        }
	let cnt = getQueryResult.length;
	const sql1 = `insert into cron_history values (NULL, "${type}", ${cnt}, "${dateTime}", "${dateTime}")`;
        const getQueryResult1 = await connection.query(sql1, { type: models.Sequelize.QueryTypes.UPDATE });
	return getQueryResult;
       }
       
      } catch (err) {
        console.log("Error in send Reminder" + err);
      }
  };
  
let ScoreCard = async (update_after, type) => {
      try {
	const sql2 = `select * from cron_history where type="${type}"`;
	const getQueryResult2 = await connection.query(sql2, { type: models.Sequelize.QueryTypes.SELECT });

	if(getQueryResult2.length > 0){
		return false;
	}
        let sql = `SELECT tgs.game_id, tgs.bracket_id, tgs.winner_id, tm1.name as t1_name, tgs.team1_score, tm1.thumbnails as t1_thumbnails, tm2.name as t2_name, tgs.team2_score, tm2.thumbnails as t2_thumbnails, tls.name as league_name, tls.gender as gender FROM tournament_games tgs inner join tournament_breakets tbs on tgs.bracket_id=tbs.bracket_id inner join tournament_leagues tls on tbs.subseason_id=tls.current_subseason_id left join tournament_teams tm1 on tm1.team_id=tgs.team_1_id left join tournament_teams tm2 on tm2.team_id=tgs.team_2_id where tgs.winner_id is not null and tgs.team1_score is not null and tgs.team2_score is not null and tgs.updatedAT > "${update_after}" order by tgs.updatedAT desc;`
      const bracketData = await connection.query(sql, { type: models.Sequelize.QueryTypes.SELECT });
      if(bracketData.length > 0){
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
            template_name = template2;
            
            if(type == "day1"){
              subject = "Bracket Challenge: Day 1 Recap";
            }else if(type == "day2"){
               subject = "Bracket Challenge: Day 2 Recap";
            }else if(type == "day3"){
                subject = "Bracket Challenge: Day 3 Recap | Your Final Score";
            }
             
            let userQuery = `select distinct email, firstName, user_id from user_breakets ubs inner join users on users.id= ubs.user_id;`;
            let userData = await connection.query(userQuery, { type: models.Sequelize.QueryTypes.SELECT });
            let date2 = new Date();
	    let dateTime = moment(date2).format("YYYY-MM-DD HH:mm:ss");
            let cnt = userData.length;
            const sql1 = `insert into cron_history values (NULL, "${type}", ${cnt}, "${dateTime}", "${dateTime}")`;
            await connection.query(sql1, { type: models.Sequelize.QueryTypes.UPDATE });
	
            for(let row of userData){
                let rankQuery = `select leaderboards.rank as "rank", score, bracketType from leaderboards where userId=${row["user_id"]} ;`;
                let rankData = await connection.query(rankQuery, { type: models.Sequelize.QueryTypes.SELECT });
                let mensRank = "NA";
                let womensRank = "NA";
                let menSore = 0;
                let womensScore = 0;
                let totalScore = 0;
                for(let rdata of rankData){
                   if(rdata["bracketType"] == "male"){
                        mensRank = rdata["rank"];
                        menSore  = rdata["score"];
                   }else{
                         womensRank = rdata["rank"];
                         womensScore  = rdata["score"];
                   }
                }
                
                
                subject = subject;
                let replacements = { firstName: row["firstName"], url:process.env.BASE_URL_FRONTEND, mensRank, menSore, womensRank, womensScore, totalScore:menSore+womensScore}
            	//helper.sendEmail(process.env.mailFrom, row["email"], subject, template_name, replacements);
            
            }
            
      }
      } catch (err) {
        console.log("Error ScoreCard" + err);
      }
  }

const deleteOldBracket = async (type) => {
       try {
         const sql3 = `select * from cron_history where type="${type}"`;
	const getQueryResult2 = await connection.query(sql3, { type: models.Sequelize.QueryTypes.SELECT });

	if(getQueryResult2.length > 0){
		return false;
	} 
        const sql = `select distinct user_bracket_id from user_breaket_teams ubt inner join user_breakets ubs on ubs.id=ubt.user_bracket_id inner join users on ubs.user_id=users.id where ubt.winner_id is null`;
        const getQueryResult = await connection.query(sql, { type: models.Sequelize.QueryTypes.SELECT })
        for(let row of getQueryResult){
                      let row_id= row["user_bracket_id"];
        	      const sql = `delete from user_breaket_teams where user_bracket_id="${row_id}"`;
     		      await connection.query(sql, { type: connection.QueryTypes.DELETE });
     		      
     		      const sql2 = `delete from user_breakets where id="${row_id}"`;
     		      await connection.query(sql2, { type: connection.QueryTypes.DELETE });
        }
         let date2 = new Date();
	 let dateTime = moment(date2).format("YYYY-MM-DD HH:mm:ss");
         let cnt = getQueryResult.length;
         const sql1 = `insert into cron_history values (NULL, "${type}", ${cnt}, "${dateTime}", "${dateTime}")`;
         await connection.query(sql1, { type: models.Sequelize.QueryTypes.UPDATE });       
      } catch (err) {
        console.log("Error in send Reminder" + err);
      }
 }

let SendRecap = async (update_after, type) => {
      try {
	const sql2 = `select * from cron_history where type="${type}"`;
	const getQueryResult2 = await connection.query(sql2, { type: models.Sequelize.QueryTypes.SELECT });

	if(getQueryResult2.length > 0){
		return false;
	}
        let subject = "";
        let template_name = "";
            
            if(type == "day1"){
              subject = "Bracket Challenge: Day 1 Recap";
              template_name = "WelcomeemailbracketDay1.html";
            }else if(type == "day2"){
               subject = "Bracket Challenge: Day 2 Recap";
               template_name = "WelcomeemailbracketDay2.html";
            }else if(type == "day3"){
                subject = "Bracket Challenge: Day 3 Recap | Your Final Score";
                template_name = "WelcomeemailbracketDay3.html";
            }
             
            let userQuery = `select distinct email, firstName, user_id from user_breakets ubs inner join users on users.id= ubs.user_id;`;
            let userData = await connection.query(userQuery, { type: models.Sequelize.QueryTypes.SELECT });
            let date2 = new Date();
	    let dateTime = moment(date2).format("YYYY-MM-DD HH:mm:ss");
	    let cnt = userData.length;
            const sql1 = `insert into cron_history values (NULL, "${type}", ${cnt}, "${dateTime}", "${dateTime}")`;
            await connection.query(sql1, { type: models.Sequelize.QueryTypes.UPDATE });
	    subject = subject;
	    for(let row of userData){
            	let replacements = { firstName: row["firstName"], view_brackets:process.env.BASE_URL_FRONTEND+"create-brackets", leaderboards:process.env.BASE_URL_FRONTEND+"leader-board-main/mens"}
            	helper.sendEmail(process.env.mailFrom, row["email"], subject, template_name, replacements);
            }
      } catch (err) {
        console.log("Error SendRecap" + err);
      }
  }
module.exports = {
  DailyCron: (time) => {
    cron.schedule(time, async() => {
      try {
	let date2 = new Date();
	let dateTime = moment(date2).format("YYYY-MM-DD HH:mm:ss");
	//let dateTime = moment(date2).tz("Asia/Kokata").format("YYYY-MM-DD HH:mm:ss");
	if(dateTime > reminder1_start && dateTime < reminder1_end){
            sendReminder("reminder_one");
        }
        if(dateTime > reminder2_start && dateTime < reminder2_end){
              sendReminder("reminder_two");
        }
        
        if(dateTime > remove_bracket_start && dateTime < remove_bracket_end){
               deleteOldBracket("delete_bracket");
        }     
        
        if(dateTime > date1_start && dateTime < date1_end){
               //ScoreCard("2021-05-09", "day1");
               SendRecap("2021-05-09", "day1");
        }
        
        if(dateTime > date2_start && dateTime < date2_end){
               //ScoreCard(date1_start, "day2");
                SendRecap(date1_start, "day2");
        }
        
        if(dateTime > date3_start && dateTime < date3_end){
               //ScoreCard(date2_start, "day3");
               SendRecap(date2_start, "day3");
        }
        
        
      } catch (err) {
        console.log("Error reschedule cron-" + err);
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
    return strData;
    
}




