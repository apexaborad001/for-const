const maleRoundArray = [1, 2, 3, 4, 5, 6]
const femaleRoundArray =[1, 2, 3, 4]
async function userBracketDetails(req, option, round,userId) {
    try {
        const sql = `SELECT ncrrugby.user_breaket_teams.game_id,team_id,user_bracket_id,round FROM ncrrugby.user_breaket_teams inner join user_breakets on user_breakets.id = user_breaket_teams.user_bracket_id INNER JOIN ncrrugby.tournament_games ON ncrrugby.user_breaket_teams.game_id=ncrrugby.tournament_games.game_id where ncrrugby.user_breaket_teams.team_id=ncrrugby.tournament_games.${option} and tournament_games.round= ${round} and user_id = ${userId}`;
        const getQueryResult = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
        return getQueryResult
    }
    catch (err) {
        console.log(err)
    }
}

async function liveBracketDetails(req, name) {
    try {
        const sql = `SELECT distinct game_id,winner_id,winner_score,round,tournament_leagues.name from tournament_games inner join tournament_breakets on tournament_games.bracket_id=tournament_breakets.bracket_id inner join tournament_leagues on tournament_breakets.subseason_id=tournament_leagues.current_subseason_id where tournament_leagues.name="` + name + `"`;
        const getQueryResult = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
        return getQueryResult
    }
    catch (err) {
        console.log(err)
    }
}
const sortJSONArrayByKey = (prop) => {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}
async function roundWiseScoreDetails(req, option, round, bracketName, bracketId, userId) {

    try {
        const sqlQuery = `SELECT sum(winner_score) as score,round,${bracketId} as user_bracket_id FROM tournament_games inner join tournament_breakets on tournament_games.bracket_id=tournament_breakets.bracket_id inner join tournament_leagues on tournament_breakets.subseason_id=tournament_leagues.current_subseason_id where tournament_leagues.name="${bracketName}" and winner_id IN (SELECT team_id FROM user_breaket_teams INNER JOIN tournament_games ON user_breaket_teams.game_id=tournament_games.game_id and user_breaket_teams.team_id=tournament_games.looser_id inner join user_breakets on user_breakets.id = user_breaket_teams.user_bracket_id where tournament_games.round=${round} and user_id=${userId}) group by round`
        let roundWiseScore = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT })
        if (!(roundWiseScore && roundWiseScore.length)) roundWiseScore.push({ "round": null, score: null, user_bracket_id: bracketId })
        roundWiseScore = getRoundWiseDetailsInFormat(roundWiseScore)
        return roundWiseScore;
    } catch (e) {
        console.log('e', e)
    }

}
const getRoundWiseDetailsInFormat = async (roundWiseQueryResult,bracketId,gender) => {
    let genderWiseArray
    let scoreRoundFinalArray = [];
    let scoreRoundFinalObject = {};
    let lastRoundBracketName;
    let roundCounter = 0;
    let differentBracketFlag = false;
    if(gender=="female"){
           genderWiseArray =  {"Women_League": {1:{"score":0, "title":"1st ROUND"}, 2:{"score":0, "title":"QUARTERFINALS"}, 3:{"score":0, "title":"SEMI FINALS"}, 4:{"score":0, "title":"National Championship"},  5:{"score":0, "title":"3rd Place"}}, "Survivor_Cup":{1:{"score":0, "title":"QUARTERFINALS"}, 2:{"score":0, "title":"SEMI FINALS"}, 3:{"score":0, "title":"National Championship"},4:{"score":0, "title":"3rd Place"}}, "Champions_Cup":{1:{"score":0, "title":"SEMI FINALS"}, 2:{"score":0, "title":"National Championship"},3:{"score":0, "title":"3rd Place"}}, "Challenge_Cup":{ 1:{"score":0, "title":"SEMI FINALS"}, 2:{"score":0, "title":"National Championship"},3:{"score":0, "title":"3rd Place"}}};
    }
    else{
        genderWiseArray = {"Men_League": {1:{"score":0, "title":"1st ROUND"}, 2:{"score":0, "title":"2nd ROUND"}, 3:{"score":0, "title":"QUARTERFINALS"}, 4:{"score":0, "title":"SEMI FINALS"}, 5:{"score":0, "title":"National Championship"}, 6:{"score":0, "title":"3rd Place"}}, "Survivor_Cup":{1:{"score":0, "title":"2nd ROUND"}, 2:{"score":0, "title":"QUARTERFINALS"}, 3:{"score":0, "title":"SEMI FINALS"}, 4:{"score":0, "title":"National Championship"}, 5:{"score":0, "title":"3rd Place"}}, "Champions_Cup":{1:{"score":0, "title":"QUARTERFINALS"}, 2:{"score":0, "title":"SEMI FINALS"}, 3:{"score":0, "title":"National Championship"}, 4:{"score":0, "title":"3rd Place"}}, "Challenge_Cup":{ 1:{"score":0, "title":"QUARTERFINALS"}, 2:{"score":0, "title":"SEMI FINALS"}, 3:{"score":0, "title":"National Championship"},5:{"score":0, "title":"3rd Place"}}};
    }
    try{
	    for (let i = 0; i < roundWiseQueryResult.length; i++) {
		let ele = roundWiseQueryResult[i];
		
		let tem_le_name = ele.name.replace(" ","_");
		tem_le_name = tem_le_name.replace("'s","");
		console.log(tem_le_name);
		genderWiseArray[tem_le_name][ele["round"]]["score"] = ele.score;
		if(genderWiseArray[tem_le_name][ele["round"]]["title"] == "National Championship"){
			if(genderWiseArray[tem_le_name][ele["round"]]["score"] == 360){
				genderWiseArray[tem_le_name][ele["round"]]["score"] = 240;
				let nround = (ele["round"]+1);
				genderWiseArray[tem_le_name][nround]["score"] = 120;
			}else if(genderWiseArray[tem_le_name][ele["round"]]["score"] == 120){
				genderWiseArray[tem_le_name][ele["round"]]["score"] = 0;
				let nround = (ele["round"]+1);
				genderWiseArray[tem_le_name][nround]["score"] = 120;
			}
		}
		
	    }
	 for(let key in genderWiseArray){
         	scoreRoundFinalObject[key] = Object.values(genderWiseArray[key])
         }
    }catch(err){
    	console.log(err);
    }
    return scoreRoundFinalObject;
};
const tieBreakerResolverFunction=async(req,userBracketId1,userBracketId2)=> {
    try {
        const sql = `SELECT user_breaket_teams.game_id,user_bracket_id,(team1_score+team2_Score) as score,(team1_score+team2_score) as actual_score,abs((team_1_score+team_2_score) - (team1_score+team2_score)) as diff_score FROM user_breaket_teams INNER JOIN tournament_games on tournament_games.game_id=user_breaket_teams.game_id where(team1_score and team2_score) IS NOT NULL and (user_bracket_id=${userBracketId1} or user_bracket_id=${userBracketId2}) order by diff_score limit 1`;
        const getQueryResult = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
        return getQueryResult
    }
    catch (err) {
        console.log(err)
    }
  }

  async function insertUserBracketDetails(req, bracketType,userBracketId) {
    try{
         let sql = `select  tgs.game_id , tgs.team_1_id ,tgs.team_2_id,${userBracketId} as user_bracket_id
        from tournament_leagues tls inner join tournament_breakets tbs on tls.current_subseason_id = tbs.subseason_id inner join tournament_games tgs on 
          tgs.bracket_id = tbs.bracket_id left join tournament_teams tm1 on tm1.team_id=tgs.team_1_id left join tournament_teams tm2 on 
          tm2.team_id=tgs.team_2_id left join winner_brackt_relation wbr on wbr.bracket_id =tgs.bracket_id and wbr.round = tgs.round left join loser_brackt_relation lbr on lbr.bracket_id =tgs.bracket_id and lbr.round = tgs.round
           where tls.gender = "${bracketType}"`;
        const getQueryResult = await req.database.query(sql, { type: req.database.QueryTypes.SELECT })
        await req.models.user_breaket_team.bulkCreate(getQueryResult);

        return getQueryResult
     }catch(err){
         console.log(err);
     }
 };

module.exports = {
    userBracketDetails,
    liveBracketDetails,
    roundWiseScoreDetails,
    getRoundWiseDetailsInFormat,
    tieBreakerResolverFunction,
    insertUserBracketDetails
};
