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
      "IMAGE_PATH": `${process.env.BUCKET_ACCESS_URL}common/`,
      "Bracket_submission_deadline":"29-May-2021"
       },
    messages = {
      "LOGIN": {
        "SUCCESS": "Logged in successfully",
        "FAILURE": "Invalid Email/Username or Password",
        "NOT_VERIFIED": "Please verify your account",
        "BLOCKED": "Your account is not active yet. Please contact Admin for activation.",
        "NOT_FOUND": "Invalid username or password"
      },
      "SIGNUP": {
        "ALREADY_EXISTS":"Try something different, this username and email already exists",
        "USERNAME_ALREADY_EXISTS": "Try something different, this username already exists",
        "EMAIL_ALREADY_EXISTS": "Try something different, this email already exists",
        "SUCCESS": "Verify your account from the verification link shared on your registered E-mail.",
        "NOT_VERIFIED": "Please verify your account",
        "BLOCKED": "Your account is not active yet, please contact Admin for activation",
        "NOT_FOUND": "No such user found."
      },
      "LOGOUT": {
        "SUCCESSFULL": "Logged out successfully",
        "UNSUCCESSFULL": "Unable to logout"
      },
      "INTERNAL500": "Something went wrong",
      "COMMON_DATA": {
       },
      "FORGOT_PASSWORD": {
        "SUCCESS": "Password updated successfully",
        "FAILURE": "Invalid Username/Password",
        "FOLLOW_EMAIL":"Password Reset link has been sent to your registered Email ID"
      },
      "RESET_TOKEN": {
        "VERIFIED": "Reset token verified",
        "UN_AUTHORIZED": "Unauthorised access",
        "EXPIRED": "Reset token expired",
      },
      "CHANGE_PASSWORD": {
        "PROMT_NEW_PASSWORD": "Please enter a new password, you have already used this password",
        "SUCCESSFUL": "Password changed successfully.",
        "OLD_INCORRECT": "Your old password does not match"
      },
      "USER": {
        "NOT_FOUND": "Not a valid user",
        "PASSWORD_UPDATED": "Password updated successfully",
        "USER_NAME_ALREADY_EXIST": "Try something different, this username already exists",
        "USER_NAME_NOT_EXIST": "Username is available ",
       },
      "DEVICE_TOKEN": {
        "UPDATED": "Device token updated successfully.",
        "CREATED": "Device token created successfully.",
      },
      "MAIL_SUBJECT":{
		    "PASSWORD_RESET":"National Collegiate Rugby | Password RESET",
		    "WELCOME_MAIL":"May Madness Brackets Challenge",
        "INVITEFRIEND":"Join the May Madness Bracket Challenge",
        "CONTACTUS":"National Collegiate Rugby | Contact Us",
        "ACTIVATE_MAIL":"Activate Your Account | National Collegiate Rugby"
      },
      "USER_PROFILE":{
        "SUCCESS":"User found successfully",
        "UNSUCCESSFULL": "User not found",
        "UPDATE_SUCCESS":"Your profile is updated successfully",
        "ALREADY_EXISTS": "This username is already used by someone"
      },
      "USER_BRACKET":{
        "SUCCESS":"You have successfully submitted your bracket",
        "UNSUCCESSFULL": "You have already submitted the bracket",
        "FOUND":"Bracket found successfully",
        "NOTFOUND":"Bracket not found",
        "INVALIDBRACKET":"Invalid Bracket Id"
      },
      "USER_BRACKET_TEAMS":{
        "SUCCESS":"Bracket created successfully",
        "UNSUCCESSFULL": "User already register",
        "FOUND":"Bracket Details Found successfully",
        "NOTFOUND":"Bracket details not found",
        "UPSERT":"Bracket upserted successfully",
        "FETCH":"Bracket data fetched successfully"
      },
      "USER_BRACKET_TEAMS_INCOMPLETE":{
        "FOUND":"Incomplete Bracket Details Found successfully",
        "NOTFOUND":"Bracket details not found",
      },
      "SCORE":{
        "SUCCESS":"Round Wise Score fetched successfully",
        "UNSUCCESSFULL": "Round wise score not found",
        "NOTFOUND":"Bracket details not found",
      },
      "COMMONDATA":{
        "SUCCESS":"Data fetched successfully",
        "UNSUCCESSFULL": "Failed to fetched data",
        "CONTACTUS_SUCCESS":"Thank you for contacting us. We will get back to you as soon as possible",
        "INVITE_SUCCESS":"Your invitation has been sent."
      },
      "RANK":{
        "SUCCESS":"Rank Data fetched successfully",
        "UPDATE":"Leaderboard updated successfully",
        "USERRANK":"Your rank fetched successfully"
      },
      "TIEBREAKER":{
        "SUCCESS":"Winner fetched successfully",
      },
      "GAME":{
        "SUCCESS":"Scores fetched succesfully",
        "BLANK":"No data found",
      }

    }
  return {
    constants: constants,
    messages: messages
  }
}
