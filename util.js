const Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function userBreaketLosser(req,option,round) { 
    try{
    const sql = `SELECT ncrrugby.user_breaket_teams.game_id,team_id,user_bracket_id,round FROM ncrrugby.user_breaket_teams INNER JOIN ncrrugby.tournament_games ON ncrrugby.user_breaket_teams.game_id=ncrrugby.tournament_games.game_id where ncrrugby.user_breaket_teams.team_id=ncrrugby.tournament_games.` + option +` and tournament_games.round=` + round +``;
    const getQueryResult =await req.database.query(sql,{ type: req.database.QueryTypes.SELECT })
    return getQueryResult
    }
catch(err){
console.log(err)
}}

async function cupDetails(req,name) { 
    try{
    const sql = `SELECT distinct game_id,winner_id,winner_score,round,tournament_leagues.name from tournament_games inner join tournament_breakets on tournament_games.bracket_id=tournament_breakets.bracket_id inner join tournament_leagues on tournament_breakets.subseason_id=tournament_leagues.current_subseason_id where tournament_leagues.name="` + name +`"`;
    const getQueryResult =await req.database.query(sql,{ type: req.database.QueryTypes.SELECT })
    return getQueryResult
    }
catch(err){
console.log(err)
}
}
function GetSortOrder(prop) {    
    return function(a, b) {    
    if (a[prop] > b[prop]) {    
            return 1;    
        } else if (a[prop] < b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
}  
async function cupWiseScoreDetails(req,option,round,cupName){
    var userBreaketLosserResult= await userBreaketLosser(req,option,round)
        var cupDetailsResult=await cupDetails(req,cupName)
        
        const cupScore=[];
        
        for(ele of userBreaketLosserResult)
         {
            const isPresentInSurvivor = cupDetailsResult.filter(el=>el.winner_id ===ele.team_id )
            if(isPresentInSurvivor.length>0)
            {
                for (ele of isPresentInSurvivor){
                   cupScore.push({round:ele.round,score:ele.winner_score});
                }
            }
        }
         console.log(cupScore)
         
   
    cupScore.sort(GetSortOrder("round"));    
     
         let score=0
         let roundWiseScore=[]
         let perivousRound=cupScore[0].round
         for (i=0;i<cupScore.length;i++){
             const scoreEle=cupScore[i]
             if(perivousRound==scoreEle.round){
                score+=scoreEle.score
                if(i==(cupScore.length-1))roundWiseScore.push({"round":perivousRound,score})
             }else{
                roundWiseScore.push({"round":perivousRound,score})
                perivousRound=scoreEle.round
                score=scoreEle.score
                if(i==(cupScore.length-1))roundWiseScore.push({"round":perivousRound,score})
             }
         }
         console.log(roundWiseScore)
         return roundWiseScore;
        
}

module.exports = {
    userBreaketLosser:userBreaketLosser,
    cupDetails:cupDetails,
    cupWiseScoreDetails:cupWiseScoreDetails
  };