/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/

let HARD_CODED_STRING = "outputted_game_string"
exports.onExecutePostLogin = async (event, api) => {

  let apiUrl = "https://catfact.ninja/fact"

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Type assertion to ensure 'response' is recognized as a Response type
    if (!(response instanceof Response)) {
      throw new Error('Expected a Response object');
    }

    // Check if the response is successful (status in 200-299 range)
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response:', data);

  } catch (error) {
    console.error('Error during API call:', error);
  }



  if (event.user.user_metadata.game_string != HARD_CODED_STRING){ 

    console.log("You are an idiot")    
    api.access.deny('Nice job getting the game wrong, idiot. Go back and try again');


  }else {
    console.log("Right this way sir")

  }
}
