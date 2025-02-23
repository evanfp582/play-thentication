/**
* https://auth0.com/docs/customize/actions/explore-triggers/signup-and-login-triggers/login-trigger 
* Handler that will be called during the execution of a PreUserRegistration flow.
*
* @param {Event} event - Details about the context and user that is attempting to register.
* @param {PreUserRegistrationAPI} api - Interface whose methods can be used to change the behavior of the signup.
*/
let HARD_CODED_STRING = "outputted_game_string"

exports.onExecutePreUserRegistration = async (event, api) => {
  if (event.user.email === "fail@gmail.com"){ 

    console.log("You are a failure")
    // api.access.deny('failed', "You have no good car ideas");
    api.validation.error("failed", "erm you are dumb")

  }else {
    console.log("Right this way sir, setting your secret to ", HARD_CODED_STRING)
    api.user.setUserMetadata("game_string", HARD_CODED_STRING)
    // console.log(api.user.user_metadata)
  }
}