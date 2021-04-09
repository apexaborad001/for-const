const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const helper = require('../helper/common-helper');
const logger = require('../helper/logger-helper');
const userBracketTeams = require('../models/user_breakets');

const getCommonData = async (req, res) => {
    try {
        const getCountries = `SELECT id, name FROM countries`
        const getRoles = `SELECT id,role FROM roles`
        const getStates = `SELECT id, name FROM states`

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

const inviteFriends = async (req, res) => {
    try { 
        let userData = await req.models.user.findOne({
            where: {
                id: req.decoded.user_id
             }
        });
        let template = "InviteFriends.html";
          let to_id = req.body.mail_to,
            subject = req.messages.MAIL_SUBJECT.INVITEFRIEND,
            template_name = template,
            comment = req.body.comment,
            replacements = { user: userData.firstName+" "+userData.lastName, comment: comment, url:req.BASE_URL_FRONTEND};
            for(ele of to_id){
                helper.sendEmail(process.env.mailFrom, ele, subject, template_name, replacements);
            }
        res.status(req.constants.HTTP_SUCCESS).json({
            code: req.constants.HTTP_SUCCESS,
            status: req.constants.SUCCESS,
            message: req.messages.COMMONDATA.INVITE_SUCCESS
        })
    }catch (err) {
        logger.log('Score', req, err, 'user_breaket_team', req.decoded.user_id);
        res.status(req.constants.HTTP_SERVER_ERROR).json({
            status: req.constants.ERROR,
            code: req.constants.HTTP_SERVER_ERROR,
            message: req.messages.INTERNAL500 + err
        })
    }
};

const contactUs = async (req, res) => {
    try {
         let template = "ContactUS.html";
          let to_id = process.env.SUPPORT_MAIL,
            subject = req.messages.MAIL_SUBJECT.CONTACTUS,
            firstName = req.body.firstName,
            lastName = req.body.lastName || "",
            template_name = template,
            message = req.body.message,
            replacements = { user: firstName+" "+lastName,  message: message, url:req.BASE_URL_FRONTEND};
            helper.sendEmail(process.env.mailFrom, to_id, subject, template_name, replacements);

        res.status(req.constants.HTTP_SUCCESS).json({
            code: req.constants.HTTP_SUCCESS,
            status: req.constants.SUCCESS,
            message: req.messages.COMMONDATA.CONTACTUS_SUCCESS
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
    getCommonData,
    inviteFriends,
    contactUs
}