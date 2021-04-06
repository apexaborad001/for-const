'use strict'
module.exports = (req) => {
  req.BASE_URL_FRONTEND = `https://staging.maymadness7s.com/`;
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
        "ALREADY_EXISTS": "Username already used.",
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
        "FOLLOW_EMAIL":"Please check the email sent to your email ID."
      },
      "RESET_TOKEN": {
        "VERIFIED": "Reset token verified.",
        "UN_AUTHORIZED": "Unauthorized access.",
        "EXPIRED": "Reset token expired.",
      },
      "CHANGE_PASSWORD": {
        "PROMT_NEW_PASSWORD": "Please enter a new password, you have already used this password.",
        "SUCCESSFUL": "Password change successfully.",
        "OLD_INCORRECT": "Incorrect old password."
      },
      "USER": {
        "NOT_FOUND": "Not a valid user",
        "PASSWORD_UPDATED": "Password successfully updated.",
       },
      "DEVICE_TOKEN": {
        "UPDATED": "Device token updated successfully.",
        "CREATED": "Device token created successfully.",
      },
      "MAIL_SUBJECT":{
		    "PASSWORD_RESET":"NcrRugby | Forgot Password",
		    "WELCOME_MAIL":"NcrRugby | Welcome Aboard",
        "INVITEFRIEND":"NcrRugby | May Madness 7s Rugby",
        "CONTACTUS":"NcrRugby | CONTACTUS",
        "ACTIVATE_MAIL":"NcrRugby | Activate Your Account"
      },
      "USER_PROFILE":{
        "SUCCESS":"User found successfully",
        "UNSUCCESSFULL": "User not found",
        "UPDATE_SUCCESS":"User profile updated successfully",
        "ALREADY_EXISTS": "Username already used"
      },
      "USER_BRACKET":{
        "SUCCESS":"Bracket created successfully",
        "UNSUCCESSFULL": "You already register a bracket",
        "FOUND":"Bracket found successfully",
        "NOTFOUND":"Bracket not found"
      },
      "USER_BRACKET_TEAMS":{
        "SUCCESS":"Bracket created successfully",
        "UNSUCCESSFULL": "User already register",
        "FOUND":"Bracket Details Found successfully",
        "NOTFOUND":"Bracket Details Not Found",
        "UPSERT":"Breaket upserted successfully",
      },
      "SCORE":{
        "SUCCESS":"Round Wise Score fetched successfully",
        "UNSUCCESSFULL": "Round wise score not found",
      },
      "COMMONDATA":{
        "SUCCESS":"Data fetched successfully",
        "UNSUCCESSFULL": "Failed to fetched data",
        "CONTACTUS_SUCCESS":"Thank you for contacting us.",
        "INVITE_SUCCESS":"Your invite send successfully"
      },
      "RANK":{
        "SUCCESS":"Rank Data fetched successfully"
      }

    }
  return {
    constants: constants,
    messages: messages
  }
}
