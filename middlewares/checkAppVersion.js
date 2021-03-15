checkAppVersion = async(req, res, next) => {
    
    let app_version = req.headers.app_version || '';
    let device_type = req.headers.device_type || '';

    let existingVersion = await req.models.appSettings.findOne();
    //console.log(existingVersion);
    if(existingVersion){
        let androidVersion = existingVersion.androidVersion || '1.0' ;
        let iosVersion = existingVersion.iosVersion || '1.9';

        if(device_type == 'android'){
            if(app_version < androidVersion){
                return res.status(400).send({
                    status: false,
                    code: 419,
                    message: "Android version not matched.",
                    androidUrl : `${process.env.ANDROID_URL}`
                });
                
            }else{
                next();
            }
        }  else if(device_type == 'ios'){
            if(app_version < iosVersion){
                return res.status(400).send({
                    status: false,
                    code: 419,
                    message: "ios version not matched.",
                    iosUrl : `${process.env.IOS_URL}`
                });
            }else{
                next();
            }
        }else{
            next();
        }
    }else{
        next();
    }
    
}
module.exports = checkAppVersion;