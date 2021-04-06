const roundArray = [1, 2, 3, 4, 5, 6]
async function userBracketDetails(req, option, round) {
    try {
        const sql = `SELECT ncrrugby.user_breaket_teams.game_id,team_id,user_bracket_id,round FROM ncrrugby.user_breaket_teams INNER JOIN ncrrugby.tournament_games ON ncrrugby.user_breaket_teams.game_id=ncrrugby.tournament_games.game_id where ncrrugby.user_breaket_teams.team_id=ncrrugby.tournament_games.` + option + ` and tournament_games.round=` + round + ``;
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
        let userBracketLosserResult = await userBracketDetails(req, option, round)
        let bracketDetailsResult = await liveBracketDetails(req, bracketName)

        const bracketRoundWiseScore = [];

        for (ele of userBracketLosserResult) {
            const userTeamsBracketWinnerList = bracketDetailsResult.filter(el => el.winner_id === ele.team_id)
            if (userTeamsBracketWinnerList.length > 0) {
                for (ele of userTeamsBracketWinnerList) {
                    bracketRoundWiseScore.push({ round: ele.round, score: ele.winner_score });
                }
            }
        }

        bracketRoundWiseScore.sort(sortJSONArrayByKey("round"));
        let score = 0
        let roundWiseScore = []
        let preivousRound = bracketRoundWiseScore && bracketRoundWiseScore.length ? bracketRoundWiseScore[0].round : 0;
        for (i = 0; i < bracketRoundWiseScore.length; i++) {
            const scoreEle = bracketRoundWiseScore[i]
            if (preivousRound == scoreEle.round) {
                score += scoreEle.score
            } else {
                roundWiseScore.push({ "round": preivousRound, score, user_bracket_id: bracketId })
                preivousRound = scoreEle.round
                score = scoreEle.score
            }
            if (i == (bracketRoundWiseScore.length - 1)) roundWiseScore.push({ "round": preivousRound, score, user_bracket_id: bracketId })
        }
        // const sqlQuery = `SELECT sum(winner_score) as score,round,${bracketId} as user_bracket_id FROM ncrrugby.tournament_games inner join tournament_breakets on tournament_games.bracket_id=tournament_breakets.bracket_id inner join tournament_leagues on tournament_breakets.subseason_id=tournament_leagues.current_subseason_id where tournament_leagues.name="${bracketName}" and winner_id IN (SELECT team_id FROM ncrrugby.user_breaket_teams INNER JOIN ncrrugby.tournament_games ON ncrrugby.user_breaket_teams.game_id=ncrrugby.tournament_games.game_id and ncrrugby.user_breaket_teams.team_id=ncrrugby.tournament_games.looser_id inner join user_breakets on user_breakets.id = user_breaket_teams.user_bracket_id where tournament_games.round=${round} and user_id=${userId}) group by round`
        // let roundWiseScore = await req.database.query(sqlQuery, { type: req.database.QueryTypes.SELECT })
        if (!(roundWiseScore && roundWiseScore.length)) roundWiseScore.push({ "round": null, score: null, user_bracket_id: bracketId })
        roundWiseScore = getRoundWiseDetailsInFormat(roundWiseScore)
        return roundWiseScore;
    } catch (e) {
        console.log('e', e)
    }

}
const getRoundWiseDetailsInFormat = async (roundWiseQueryResult) => {
    let scoreRoundFinalArray = [];
    let lastRoundBracketId;
    let roundCounter = 0;
    let differentBracketFlag = false;
    for (let i = 0; i < roundWiseQueryResult.length; i++) {
        let ele = roundWiseQueryResult[i];
        let roundEle = ele;
        differentBracketFlag = false;
        roundCounter++;
        if (!lastRoundBracketId) lastRoundBracketId = ele.user_bracket_id;
        if (lastRoundBracketId != ele.user_bracket_id) {
            differentBracketFlag = true;
            if (roundCounter < roundArray.length) {
                for (let i = roundCounter; i < roundArray.length; i++) {
                    if (i !== ele.round) roundEle = { round: i, user_bracket_id: lastRoundBracketId, score: 0 }
                    else roundEle = ele;
                    scoreRoundFinalArray.push(roundEle)
                }
            }
            roundCounter = 0;
        }
        roundEle = ele;
        if (!(ele.round && ele.score) || (i === (roundWiseQueryResult.length - 1))) {
            let isRoundBracketThere = 0;
            if (!(ele.round && ele.score)) {
                const isRoundAlreadyPresent = roundWiseQueryResult.filter(el => el.user_bracket_id === ele.user_bracket_id && el.round && el.score)
                if (isRoundAlreadyPresent && isRoundAlreadyPresent.length) isRoundBracketThere = true
            }
            if (!isRoundBracketThere) {
                lastRoundBracketId = null;
                if (roundCounter < roundArray.length) {
                    for (let i = roundCounter; i < roundArray.length; i++) {
                        if (i !== ele.round) roundEle = { round: i, user_bracket_id: ele.user_bracket_id, score: 0 }
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
            if (differentBracketFlag) roundCounter++;
            if (roundCounter !== ele.round) {
                if (roundCounter < ele.round) {
                    let roundEle1;
                    for (let i = roundCounter; i < ele.round; i++) {
                        roundCounter++;
                        roundEle1 = { round: i, user_bracket_id: ele.user_bracket_id, score: 0 }
                        scoreRoundFinalArray.push(roundEle1)
                    }
                }
            }
            scoreRoundFinalArray.push(roundEle)
            lastRoundBracketId = ele.user_bracket_id;
        }
    }
    return scoreRoundFinalArray;
};
module.exports = {
    userBracketDetails,
    liveBracketDetails,
    roundWiseScoreDetails,
    getRoundWiseDetailsInFormat
};