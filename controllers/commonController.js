const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const helper = require('../helper/common-helper');
const logger = require('../helper/logger-helper');
const userBracketTeams = require('../models/user_breakets');

const getCommonData = async (req, res) => {
    try {
        const getCountries = `SELECT * FROM countries`
        const getRoles = `SELECT id,role FROM roles`
        const getStates = `SELECT * FROM states`

        const getCountriesData = await req.database.query(getCountries, {
            raw: true,
            model: userBracketTeams,
            mapToModel: false
        })
        const getRolesData =await req.database.query(getRoles, {
            raw: true,
            model: userBracketTeams,
            mapToModel: false
        })
        const getStatesData =await  req.database.query(getStates, {
            raw: true,
            model: userBracketTeams,
            mapToModel: false
        })

        res.status(req.constants.HTTP_SUCCESS).json({
            code: req.constants.HTTP_SUCCESS,
            status: req.constants.SUCCESS,
            message: req.messages.COMMONDATA.SUCCESS,
            data: { getCountriesData, getRolesData, getStatesData },
        })
    }
    catch (err) {
        logger.log('Score', req, err, 'user_breaket_team', req.decoded.user_id);
        res.status(req.constants.HTTP_SERVER_ERROR).json({
            status: req.constants.ERROR,
            code: req.constants.HTTP_SERVER_ERROR,
            message: req.messages.INTERNAL500 + err
        })
    }
};

module.exports = {
    getCommonData
}