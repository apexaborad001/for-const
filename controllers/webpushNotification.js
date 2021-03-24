const { Op } = require('sequelize');
// const { notificationSubscriptions } = include("models");
const webpush = require('web-push')

// const { res.send } = require('common/response');

process.env.PUBLIC_VAPID_KEY = "BOFqCABdqdsh8SPrs4JrqRzmGKE9K2KwMk6Jq3WMl3f2bFgpCb4Syy0pb8X0jwH9lwRKrogRZCg7cQTvrSEgVpI";
process.env.PRIVATE_VAPID_KEY = "ytFPyBAA8YuUUCbQODeGCmT-Y81GTWQ6NdZzsv3ByzQ";
process.env.SUBJECT = "mailto:developers@example.com"


webpush.setVapidDetails(process.env.SUBJECT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);

const subscribe = async (req, res) => {
    let resMeta = {};
    console.log('in subscribe')
    try {
        const endpoint = req.body.endpoint;
        const auth_key = JSON.stringify(req.body.keys);
        const user_id = req.body.userId;
        const token = req.body.token;
        // let results;
        const results = await req.models.notificationSubscriptions.findOne({ where: { [Op.and]: [{ user_id: user_id }, { token: token }], endpoint: endpoint } }) // notificationSubscriptions.findOne({ where: { $or: [{ user_id: user_id }, { token: token }], endpoint: endpoint } });
        console.log('results', results)
        if (!results) {
            let data = {
                endpoint: endpoint,
                auth_key: auth_key,
                user_id: user_id,
                token: token,
                status: 1
            }
            await req.models.notificationSubscriptions.create(data);
        }
        resMeta.statusCode = req.constants.HTTP_SUCCESS;
        resMeta.status = req.constants.SUCCESS;
        resMeta.message = "Subscription updated successfully";
        resMeta.data = {};
        return res.json(resMeta);
    } catch (error) {
        resMeta.statusCode = req.constants.HTTP_SERVER_ERROR;
        resMeta.status = req.constants.ERROR;
        resMeta.message = req.messages.INTERNAL500;
        resMeta.error = error;
        console.log(error)
        return res.json(resMeta);
    }
}

const sendNotification = async (req, res) => {
    try {
        let resMeta = {};
        let endpoint = req.body.endpoint;
        let user_id=req.decoded.user_id
        let notification_title = req.body.title || req.query.title;
        let notification_message = req.body.message || req.query.message;
        const results = await req.models.notificationSubscriptions.findAll({ where:{ [Op.and]: [{ user_id: user_id },{ endpoint: endpoint }],status: 1}});
        console.log(results)
        for (let row of results) {
            let subscription = { endpoint: row['endpoint'], keys: JSON.parse(row['auth_key']) };
            const payload = JSON.stringify({
                title: notification_title,
                body: notification_message,
                userId: row["user_id"],
                token: row["token"]
            });

            webpush.sendNotification(subscription, payload)
                .then(result => console.log(result))
                .catch(e => console.log(e.stack))

        }

        resMeta.statusCode = req.constants.HTTP_SUCCESS;
        resMeta.status = req.constants.SUCCESS;
        resMeta.message = "Notification send successfully";
        resMeta.data = {};
        const rr = res;
        return res.json(resMeta);

    } catch (error) {
        resMeta.statusCode = req.constants.HTTP_SERVER_ERROR;
        resMeta.status = req.constants.ERROR;
        resMeta.message = req.messages.INTERNAL500;
        resMeta.error = error;
        return res.json(resMeta);
    }
}
const unSubscribe = async (req, res) => {
    try {
        let user_id=req.decoded.user_id
        let endpoint = req.body.endpoint;
        const findUser = await req.models.notificationSubscriptions.findAll({ where: {  user_id: user_id }});
        console.log(findUser)
        if(findUser)        
        {
        const results = await req.models.notificationSubscriptions.update({ status: "0"},{where: { [Op.and]: [{ user_id: user_id },{ endpoint: endpoint }]}});
        if(results)
        {
            console.log(results)
        res.status(req.constants.HTTP_SUCCESS).send({
            code: req.constants.HTTP_SUCCESS,
            status: req.constants.SUCCESS,
            message: "unsubscribe successful"
        }) }
    else{
        res.status(req.constants.HTTP_SERVER_ERROR).send({
          code: req.constants.HTTP_SERVER_ERROR,
          status: req.constants.ERROR,
          message: "failed to unsubscribe"
          })
      }
    } 
    else{
        res.status(req.constants.HTTP_NOT_FOUND).send({
            code: req.constants.HTTP_NOT_FOUND,
            status: req.constants.ERROR,
            message: "User not subscribe to any service"
            })
    }
}
    catch (error) {
        res.status(req.constants.HTTP_SERVER_ERROR).json({
            status: req.constants.ERROR,
            code: req.constants.HTTP_SERVER_ERROR,
            message: req.messages.INTERNAL500 + err
    })
}
}
module.exports = {
    subscribe,
    sendNotification,
    unSubscribe
}
