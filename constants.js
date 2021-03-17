'use strict'
module.exports = (req) => {
  req.BASE_URL_FRONTEND = `https://knownowadmin.mobikasa.net/`;
  req.BASE_URL = `${req.protocol}://${req.hostname}/`; // Get set url
  let constants = {
      "SALT_ROUND": 10,
      "SUCCESS": true,
      "ERROR": false,
      "HTTP_SUCCESS": 200, // Success
      "HTTP_ACCEPTED": 202, // Accepted but not processed successfully
      "HTTP_BAD_REQUEST": 400, // Bad Request URI or Field missing or not valid
      "HTTP_FORBIDDEN": 403, // Unauthorized access or no premission
      "HTTP_NOT_FOUND": 404, // Not Found
      "HTTP_ALREADY_EXISTS": 409, // User already exist
      "HTTP_ALREADY_CANCELLED": 412, // Appointment alreayd cancelled
      "HTTP_SERVER_ERROR": 500, // Server Error
      "HTTP_OTP_REDIRECT": 405, // Redirect to OTP verification,
      "HTTP_NOT_EXISTS": 401, // Not exist
      "HTTP_PROFILE_REDIRECT": 408,
      "LOGOUT_USER": 413,
      "PENDING": 0,
      "ACTIVE": 1,
      "BLOCKED": 2,
      "DEACTIVE": 3,
      "USER_STATUS": {
        "ACTIVE": 1,
        "DEACTIVE": 0
      },
      "IS_DELETED": 1, // Is record deleted
      "LIMITS": {
        
      },
      "is_debug": 1,
      //"DEBUG_TYPE": "email",
      "DEBUG_TYPE": "database", // email, database/ both
      "temp_base_path": "public/temp/",
      "user_images_base_path": "public/uploads/",
      "profile_image_path": "/profile_images",
      "image_type_allowed": ['.png', '.jpeg', '.bmp', '.jpg'],
      "upload_type_allowed": ['.png', '.pdf', '.jpeg', '.jpg', '.bmp'],
      "TEMP_LIVE_URL": `${req.BASE_URL}assets/temp/`,
      "COMMON_IMAGE_PATH": `${process.env.BUCKET_ACCESS_URL}`,
      "IMAGE_PATH": `${process.env.BUCKET_ACCESS_URL}common/`
       },
    messages = {
      "LOGIN": {
        "SUCCESS": "Logged in successfully.",
        "FAILURE": "Invalid username or password.",
        "NOT_VERIFIED": "Please verify your account.",
        "BLOCKED": "Your account is not active yet. Please contact Admin for activation.",
        "NOT_FOUND": "No such user found."
      },
      "SIGNUP": {
        "ALREADY_EXISTS": "Username already used in successfully.",
        "SUCCESS": "Account created successfully.",
        "NOT_VERIFIED": "Please verify your account.",
        "BLOCKED": "Your account is not active yet. Please contact Admin for activation.",
        "NOT_FOUND": "No such user found."
      },
      "LOGOUT": {
        "SUCCESSFULL": "Logged out successfully.",
        "UNSUCCESSFULL": "Failed to logout."
      },
      "INTERNAL500": "Something went wrong.",
      "COMMON_DATA": {
       },
      "FORGOT_PASSWORD": {
        "SUCCESS": "Password update successfully",
        "FAILURE": "Invalid userName/Password",
      },
      "CHANGE_PASSWORD": {
        "PROMT_NEW_PASSWORD": "Please enter a new password, you have already used this password.",
        "SUCCESSFUL": "Password change successfully.",
        "OLD_INCORRECT": "Incorrect old password."
      },
      "DEVICE_TOKEN": {
        "UPDATED": "Device token updated successfully.",
        "CREATED": "Device token created successfully.",
      },
      "MAIL_SUBJECT":{
		
      }

    }
  return {
    constants: constants,
    messages: messages
  }
}
