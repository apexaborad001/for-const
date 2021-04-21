const express = require('express');
require('dotenv').config();
process.env.fromId = `NCRRUGBY <${process.env.mailFrom}>`;
process.env.BUCKET_NAME = "ncrrugbyuat";
const compression = require('compression');
//const xFrameOptions = require('x-frame-options');
//const helmet = require('helmet')
const path = require('path');
var fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const api_routes = require("./routes/api");
const models = require("./models");
const dbSwitch = require("./middlewares/databaseSwitch");
const checkAppVersion = require("./middlewares/checkAppVersion");
const conRelease = require("./middlewares/releaseConnection");
let logger = require("./helper/logger-helper")
var mung = require('express-mung');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const cron=require('./cron.js')

const cors = require('cors')
//const cron = require("./cron");
const app = express();
app.use(cors());
app.use(function(req, res, next) {
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
  //isSubdoamin = hostname.split(".").length > 2 ? true : false;
  //req.isSubDomain = isSubdoamin;
  req.subDomain = hostname.split(".")[0];
  next();
});
// 

//app.use(xFrameOptions());
//app.use(helmet());
//app.use(helmet.noSniff());
app.use(compression());
app.use(fileUpload());

app.use('/logs', express.static("logs"));
//app.use('/api/v1/docs', express.static("docs"));
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/assets', express.static("public"));
app.engine('html', require('ejs').renderFile);  

app.get('/pdfdemo', function(req, res) {
  res.render(__dirname + '/test.html', {
    string: 'random_value',
    other: 'value'
  });
});

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

app.use('/api/v1', dbSwitch, api_routes);

app.get('/hello_world', (req,res)=>{
  res.send('Hello World');
})

app.get('/hello_world2', (req,res)=>{
  res.send('Hello data 2');
})

app.get('/hello_world3', (req,res)=>{
  res.send('Hello data 3');
})

//end middlewares
//connection checking
models.sequelize.authenticate()
  .then(async() => {
    try {
      let con = models.sequelize;
      await con.query(`SET sql_mode = ""`);
      //await con.close();
      let port = process.env.SERVER_PORT ? process.env.SERVER_PORT : 3000;
      app.listen(port, () => {
        console.log(`started1 on port  ${port}`); 
        //cron.updateGames('*/10 * * * * * ');
      });
    } catch (err) {
      console.log("cannot catch connection");
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
