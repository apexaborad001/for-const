const resetTournamentGames = async (req, res) => {

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
  
    // await   exec("npx sequelize-cli db:seed:undo --seed 20210325115904-create_games.js")
    // await exec("npx sequelize-cli db:seed --seed 20210325115904-create_games.js")
    // await exec("npx sequelize-cli db:seed --seed 20210327164452-create_games.js")
  
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
  
  module.exports = {
    resetTournamentGames,
    userBracketReset
  }