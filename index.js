'use strict';

// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  json = require('jsonify'),
  translate = require('node-deepl'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()), // creates express http server
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
var
  lang=[];
// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach( entry => {

      // Get the webhook event. entry.messaging is an array, but 
      // will only ever contain one event, so we get index 0
      const webhook_event = entry.messaging[0];
      console.log(webhook_event);
      const { id } = webhook_event.sender;
      webhook_event.message ? handleMessage(id, webhook_event.message) : webhook_event.postback && handlePostback(id, webhook_event.postback);
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "verify_translatotbot";
  
  // Parse params from the webhook verification request
  const { query } = req;
  const mode = query['hub.mode'];
  const token = query['hub.verify_token'];
  const challenge = query['hub.challenge'];

    mode === 'subscribe' && token === VERIFY_TOKEN ? res.status(200).send(challenge) : res.sendStatus(403);
});


// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response,tr_response;
  
  if(received_message.quick_reply){
    console.log("I AM IN");
          response = {
      "text": "You can now write what you want to translate."
    }
    lang[sender_psid]=received_message.quick_reply.payload;
    callSendAPI(sender_psid, response );
  }
  // Check if the message contains text
  else if (received_message.text) {    
    translate(received_message.text, "auto", lang[sender_psid], (err, res) => {
      if(err) {
          console.log(err);
          return;
      }
      console.log('Result: ', res);
      response = {
      "text": `${res}`
    }
        // Sends the response message
  callSendAPI(sender_psid, response);    
  });
  }  
}


// Handles messaging_postbacks events
const handlePostback = (sender_psid, received_postback) => {
  const response = received_postback.payload ? {
    text: "To what language would you like to translate?",
    quick_replies:[
      {
        content_type:"text",
        title:"English",
        payload: "EN"
      },
      {
        content_type:"text",
        title:"Français",
        payload:"FR"
      },
      {
        content_type:"text",
        title:"German",
        payload: "DE"
      },
      {
        content_type:"text",
        title:"Spanish",
        payload:"ES"
      },
      {
        content_type:"text",
        title:"Italian",
        payload:"IT"
      },
      {
        content_type:"text",
        title:"Dutch",
        payload: "NL"
      },
      {
        content_type:"text",
        title:"Polish",
        payload:"PL"
      },
    ]} : null;
  callSendAPI(sender_psid, response);   
}


// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
   // Construct the message body
  const request_body = {
    recipient: { id: sender_psid },
    message: response,
  };
  request({
    uri: "https://graph.facebook.com/v2.6/me/messages",
    qs: { "access_token": PAGE_ACCESS_TOKEN },
    method: "POST",
    json: request_body,
  }, (err, res, body) => !err ? console.log('message sent!') : console.error("Unable to send message:" + err)); 
}


function getNameFromID(sender_psid){
 request({
    uri: `https://graph.facebook.com/v2.6/${sender_psid}`,
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: "GET",
  }, (err, res, body) => {
    if (!err && body) {
      return json.parse(body).first_name;
    } else {
      console.error("Unable to send request:" + err);
    }
  }); 
}
