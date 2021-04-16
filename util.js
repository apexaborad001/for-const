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
    let scoreRoundFinalObject = [];
    let lastRoundBracketName;
    let roundCounter = 0;
    let differentBracketFlag = false;
    if(gender=="female"){
        genderWiseArray=femaleRoundArray
    }
    else{
        genderWiseArray=maleRoundArray
    }
    for (let i = 0; i < roundWiseQueryResult.length; i++) {
        let ele = roundWiseQueryResult[i];
        let roundEle = ele;
        differentBracketFlag = false;
        roundCounter++;
        if (!lastRoundBracketName) lastRoundBracketName = ele.name
        if (lastRoundBracketName != ele.name) {
            differentBracketFlag = true;
            if (roundCounter < genderWiseArray.length) {
                for (let i = roundCounter; i < genderWiseArray.length; i++) {
                    if (i !== ele.round) roundEle = { round: i, user_bracket_id: bracketId, score: 0 ,name:lastRoundBracketName}
                    // else roundEle = ele;
                    scoreRoundFinalArray.push(roundEle)
                }
            }
            roundCounter = 1;
        }
        roundEle = ele;
        if (!(ele.round && ele.score) || (i === (roundWiseQueryResult.length - 1))) {
            let isRoundBracketThere = 0;
            if (!(ele.round && ele.score)) {
                const isRoundAlreadyPresent = roundWiseQueryResult.filter(el => el.user_bracket_id === ele.user_bracket_id && el.round && el.score)
                if (isRoundAlreadyPresent && isRoundAlreadyPresent.length) isRoundBracketThere = true
            }
            if (!isRoundBracketThere) {
                lastRoundBracketName=null;
                if (roundCounter < genderWiseArray.length) {
                    for (let i = roundCounter; i < genderWiseArray.length; i++) {
                        if (i !== ele.round) roundEle = { round: i, user_bracket_id: ele.user_bracket_id, score: 0 ,name:ele.name}
                        else roundEle = ele;
                        scoreRoundFinalArray.push(roundEle)
                    }
                }
                roundCounter = 0;
            }
            else {
                --roundCounter;
            }
        }
        else {
            if (differentBracketFlag) roundCounter=1;
            if (roundCounter !== ele.round) {
                if (roundCounter < ele.round) {
                    let roundEle1;
                    for (let i = roundCounter; i < ele.round; i++) {
                        roundCounter++;
                        roundEle1 = { round: i, user_bracket_id: ele.user_bracket_id, score: 0,name:ele.name }
                        scoreRoundFinalArray.push(roundEle1)
                    }
                }
            }
            scoreRoundFinalArray.push(roundEle)
            lastRoundBracketName = ele.name;
        }
    }
    return scoreRoundFinalArray;
};
const tieBreakerResolverFunction=async(req,userBracketId1,userBracketId2)=> {
    try {
        const sql = `SELECT user_breaket_teams.game_id,user_bracket_id,(team1_score+team2Score) as score,(team1_score+team2_score) as actual_score,abs((team1_score+team2_score) - (team1Score+team2Score)) as diff_score FROM user_breaket_teams INNER JOIN tournament_games on tournament_games.game_id=user_breaket_teams.game_id where(team1Score and team2Score) IS NOT NULL and (user_bracket_id=${userBracketId1} or user_bracket_id=${userBracketId2}) order by diff_score limit 1`;
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