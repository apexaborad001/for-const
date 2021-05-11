const express = require('express');
require('dotenv').config();
process.env.fromId = `NCRRUGBY <${process.env.mailFrom}>`;
//process.env.BUCKET_NAME = "ncrrugbyuat";
const compression = require('compression');
var fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const api_routes = require("./routes/api");
const userRoutes = require("./routes/user");
const webpushNotificationsRoutes = require("./routes/webpushNotifications");
const userBracketRoutes = require("./routes/userBracket");
const leaderboardRoutes = require("./routes/leaderboard");
const resetDatabaseRoutes = require("./routes/resetDatabase");

const models = require("./models");
const dbSwitch = require("./middlewares/databaseSwitch");
let logger = require("./helper/logger-helper")
var mung = require('express-mung');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

const cors = require('cors')
const app = express();
const cron = require("./cron");
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, device_token, access_token,device_type, language");
  res.header("Access-Control-Expose-Headers", "Origin, X-Requested-With, Content-Type, Accept, device_token, access_token,device_type, language");
  res.header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'  *")
  next();
});
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use((req, res, next) => {
  let hostname = req.hostname;
  let isSubdoamin = false;
  req.subDomain = hostname.split(".")[0];
  next();
});

app.use(compression());
app.use(fileUpload());
const baseUrl = '/api/v1';
app.use('/logs', express.static("logs"));
app.use(`${baseUrl}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/assets', express.static("public"));
app.engine('html', require('ejs').renderFile);


app.use(mung.json(function transform(body, req, res, next) {
  let name = req.url;
  let response = body;
  if (req.constants.is_debug) {
    if (req.decoded && req.decoded.user_id) {
      logger.log(name, req, response, 'user', req.decoded.user_id, true);
    } else {
      logger.log(name, req, response, 'guest', 0, true);
    }
  }
}));

app.use(baseUrl, dbSwitch, api_routes);
app.use(baseUrl, dbSwitch, resetDatabaseRoutes);

app.use(`${baseUrl}/manage-user`, dbSwitch, userRoutes);
app.use(`${baseUrl}/notifications`, dbSwitch, webpushNotificationsRoutes);
app.use(`${baseUrl}/manage-user-bracket`, dbSwitch, userBracketRoutes);
app.use(`${baseUrl}/leaderboard`, dbSwitch, leaderboardRoutes);


//end middlewares
//connection checking
models.sequelize.authenticate()
  .then(async () => {
    try {
      let con = models.sequelize;
      await con.query(`SET sql_mode = ""`);
     // await con.query(`SET global sql_mode = ""`);
      //await con.close();
      let port = process.env.SERVER_PORT ? process.env.SERVER_PORT : 3000;
      app.listen(port, () => {
        console.log(`started1 on port  ${port}`);
        //cron.DailyCron('10 * * * * * ');
      });
    } catch (err) {
      console.log("cannot catch connection", err);
    }
  })
  .catch((err) => {
    console.log("cannot connect to mysql" + err);
  });
//connection checking ends

//Middleware to check if something went wrong
app.use((err, req, res, next) => {
  if (err) {
    res.send(err);
  }

})


const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, p) => {
  unhandledRejections.set(p, reason);
});
process.on('rejectionHandled', (p) => {
  unhandledRejections.delete(p);
});
