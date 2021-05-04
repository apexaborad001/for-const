const { exec } = require("child_process");
const resetTournamentGames = async (req, res) => {
  try{
    await new Promise((resolve, reject) => {
      const migrate = exec(
        'npx sequelize-cli db:seed:undo --seed 20210325115904-create_games.js',
        { env: process.env },
        err => (err ? reject(err) : resolve())
      );
    });
    await new Promise((resolve, reject) => {
      exec(
        'npx sequelize-cli db:seed --seed 20210325115904-create_games.js',
        { env: process.env },
        err => (err ? reject(err) : resolve())
      );
      exec(
        'npx sequelize-cli db:seed --seed 20210327164452-create_games.js',
        { env: process.env },
        err => (err ? reject(err) : resolve())
      );
    });
  }catch(e){
    console.log('e',e)
  }
    res.status(req.constants.HTTP_SUCCESS).json({
      code: req.constants.HTTP_SUCCESS,
      status: req.constants.SUCCESS,
      message: "Tournament games reset successfully",
    })
  }
  
  const userBracketReset = async (req, res) => {
    try {
      let email = req.params.email;
      const sql = `delete ubs FROM user_breakets ubs inner join users on ubs.user_id=users.id where users.email="${email}"`;
      const getQueryResult = await req.database.query(sql, { type: req.database.QueryTypes.DELETE })
      res.status(req.constants.HTTP_SUCCESS).json({
        code: req.constants.HTTP_SUCCESS,
        status: req.constants.SUCCESS,
        message: "deleted",
      })
    }
    catch (err) {
      res.status(req.constants.HTTP_SERVER_ERROR).json({
        status: req.constants.ERROR,
        code: req.constants.HTTP_SERVER_ERROR,
        message: req.messages.INTERNAL500 + err
      })
    }
  }
  const userReset = async (req, res) => {
    try {
      let sql1 = `SET FOREIGN_KEY_CHECKS=0;`;
      let getQueryResult1 = await req.database.query(sql1, { type: req.database.QueryTypes.DELETE });
      
      let sql2 = `delete from users where admin = 0`;
      let getQueryResult2 = await req.database.query(sql2, { type: req.database.QueryTypes.DELETE })
      
      let sql3 = `delete from devices;`;
      let getQueryResult3 = await req.database.query(sql3, { type: req.database.QueryTypes.DELETE })
      
      
       let sql4 = `delete from user_images;`;
       let getQueryResult4 = await req.database.query(sql4, { type: req.database.QueryTypes.DELETE })
      
       let sql5 = `delete from user_breakets;`;
       let getQueryResult5 = await req.database.query(sql5, { type: req.database.QueryTypes.DELETE })
       
       let sql = `delete from user_breaket_teams;`;
       let getQueryResult6 = await req.database.query(sql, { type: req.database.QueryTypes.DELETE })
      res.status(req.constants.HTTP_SUCCESS).json({
        code: req.constants.HTTP_SUCCESS,
        status: req.constants.SUCCESS,
        message: "deleted",
        data:{getQueryResult1, getQueryResult2, getQueryResult3, getQueryResult4, getQueryResult5}
      })
    }
    catch (err) {
      res.status(req.constants.HTTP_SERVER_ERROR).json({
        status: req.constants.ERROR,
        code: req.constants.HTTP_SERVER_ERROR,
        message: req.messages.INTERNAL500 + err
      })
    }
  }
  
  module.exports = {
    resetTournamentGames,
    userBracketReset,
    userReset
  }
