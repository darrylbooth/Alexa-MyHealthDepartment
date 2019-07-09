//=========================================================================================================================================
// Lambda Function: myHealthDepartment for Alexa Skill
// Invocation:      Open My Health Department or Ask My Health Department
// Date:            June/July 2019
// Author:          Darryl Booth
// Function:        Where/what is my health department?
//                  What is the inspection score for 'facility name'?
//                  What are some food safety tips
//
//                  Source: http://www.civicdata.com/dataset/elpasocountyinspections/resource/f3f78434-23fa-496a-a9f2-76a7b346aad6
//                  Sample Query: http://www.civicdata.com/api/action/datastore_search_sql?sql=SELECT%20*%20from%20%22f3f78434-23fa-496a-a9f2-76a7b346aad6%22%20WHERE%20%22FACILITY_NAME%22%20LIKE%20%27TACO%20BELL%27
//                  Sample Query: http://www.civicdata.com/api/action/datastore_search_sql?sql=SELECT%20%22FACILITY_NAME%22,%20%22ACTIVITY_DATE%22,%20%22SCORE%22%20from%20%22f3f78434-23fa-496a-a9f2-76a7b346aad6%22%20WHERE%20%22FACILITY_NAME%22%20LIKE%20%27TACO%20BELL%27
//                  Sample Query: http://www.civicdata.com/api/action/datastore_search_sql?sql=SELECT%20%22FACILITY_NAME%22,%20%22ACTIVITY_DATE%22,%20%22SCORE%22%20from%20%22f3f78434-23fa-496a-a9f2-76a7b346aad6%22%20WHERE%20%22FACILITY_NAME%22%20LIKE%20%27BURGER%20KING%25%27%20AND%20%22SERVICE%22=%27REGULAR%20INSPECTION%27
//=========================================================================================================================================
'use strict';
var Alexa = require('alexa-sdk'); //Module with tools to make development easier

//var http = require('http');   //Module to ease HTTP requests
var http = require('http');     //Module to ease HTTP requests
//const dateformat = require('dateformat');

const APP_ID           = 'amzn1.ask.skill.5ab4f319-ae41-41b1-b653-13c324026076';
const SKILL_NAME       = 'My Health Department';
const WELCOME_MESSAGE  = 'Welcome. You can ask me to find your health department, check inspection scores, or give food safety tips.';
const HELP_MESSAGE     = 'You can say where is my health department?';
const HELP_REPROMPT    = 'What would you like to do?';
const FALLBACK_MESSAGE = 'Sorry, your request isn\'t one of the things I\'m programmed to do yet. Come back later.';
const STOP_MESSAGE     = 'Goodbye!';
const UNHANDLED_MESSAGE= 'You\'ve reached an unhandled function. Please try again.';

const tips = [  'Wash hands with soap and water:  Wet hands with clean running water and apply soap. Use warm water if it is available. Rub hands together to make a lather and scrub all parts of the hand for 20 seconds. Rinse hands thoroughly and dry using a clean paper towel. If possible, use a paper towel to turn off the faucet.',
                'Sanitize surfaces: Surfaces should be washed with hot, soapy water. A solution of 1 tablespoon of unscented, liquid chlorine bleach per gallon of water can be used to sanitize surfaces.',
                'Clean sweep refrigerated foods once a week: At least once a week, throw out refrigerated foods that should no longer be eaten. Cooked leftovers should be discarded after 4 days; raw poultry and ground meats, 1 to 2 days.',
                'Keep appliances clean: Clean the inside and the outside of appliances. Pay particular attention to buttons and handles where cross-contamination to hands can occur.',
                'Rinse produce: Rinse fresh vegetables and fruits under running water just before eating, cutting, or cooking. Even if you plan to peel or cut the produce before eating, it is important to thoroughly rinse it first to prevent microbes from transferring from the outside to the inside of the produce.',
                'Separate foods when shopping: Place raw seafood, meat, and poultry in plastic bags. Store them below ready-to-eat foods in your refrigerator.',
                'Separate foods when preparing and serving: Always use a clean cutting board for fresh produce and a separate one for raw seafood, meat, and poultry. Never place cooked food back on the same plate or cutting board that previously held raw food.',
                'Use a food thermometer when cooking: A food thermometer should be used to ensure that food is safely cooked and that cooked food is held at safe temperatures until eaten.',
                'Cook food to safe internal temperatures: One effective way to prevent illness is to check the internal temperature of seafood, meat, poultry, and egg dishes. Cook all raw beef, pork, lamb, and veal steaks, chops, and roasts to a safe minimum internal temperature of 145 °F. For safety and quality, allow meat to rest for at least 3 minutes before carving or eating. Cook all raw ground beef, pork, lamb, and veal to an internal temperature of 160 °F. Cook all poultry, including ground turkey and chicken, to an internal temperature of 165 °F.',
                'Keep foods at safe temperatures: Hold cold foods at 40 °F or below. Keep hot foods at 140 °F or above. Foods are no longer safe to eat when they have been in the danger zone between 40-140 °F for more than 2 hours (1 hour if the temperature was above 90 °F).'];
    
//=========================================================================================================================================
//Handler/Intents
//=========================================================================================================================================
const handlers = {
    //Welcome Message
    'LaunchRequest': function () {
        const speechOutput = WELCOME_MESSAGE;
        
        this.response.speak(speechOutput).listen('ready');
        this.emit(':responseReady');        
        },
    //---------------------------------------------------------------
    // Address Intent
    //---------------------------------------------------------------    
    'AddressIntentHandler' : function () {
        var speechOutput = 'Your health department is located at 1675 W. Garden of the Gods Rd. Suite 2044 in Colorado Springs, Colorado';

        this.response
            .speak(speechOutput);
        this.emit(':responseReady');           
        },
    //---------------------------------------------------------------
    // Hours of Operation Intent
    //---------------------------------------------------------------      
    'HoursOfOperationIntentHandler': function () {
        var speechOutput = 'Your health department is open at 7:30 AM and closes at 4:30 PM, Monday through Friday.';

        this.response
            .speak(speechOutput);
        this.emit(':responseReady');
    },        
    //---------------------------------------------------------------
    // Inspection Score Intent
    //---------------------------------------------------------------    
    'InspectionScoreIntentHandler': function () {
        var speechOutput = 'No output defined.';
        var facilityName = this.event.request.intent.slots.FacilityName.value.toUpperCase(); //Extract Facility name

        console.log('InspectionScoreIntentHandler facilityName is '+facilityName);

        lookUpInspection(facilityName, (InspectionScores) => {

            console.log('About to report on facility: ' + InspectionScores.FACILITY_NAME);


            if (isEmpty(InspectionScores))
                speechOutput = 'No matches for the facility ' + InspectionScores.FACILITY_NAME;
            else {
                var activityDate = new Date(InspectionScores.ACTIVITY_DATE);

                speechOutput = 'The most recent inspection score for ' + InspectionScores.FACILITY_NAME + ' is '+ String(100 - InspectionScores.SCORE) + '. The inspection was conducted on '+activityDate.toDateString()+'.';
            }

            this.response
                .speak(speechOutput).listen('ready')
                .listen('ready'); 
            this.emit(':responseReady');              
        });
    },
    //---------------------------------------------------------------
    // Food Safety Tip Intent
    //---------------------------------------------------------------      
    'FoodSafetyTipIntentHandler' : function (){
        // Get a random tip
        const tipIndex = Math.floor(Math.random() * tips.length);
        const randomTip = tips[tipIndex];

        // Create speech output
        const speechOutput = randomTip;
        this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), randomTip);        
    },
    
    //---------------------------------------------------------------  
    // Built-in Intents
    //---------------------------------------------------------------  
    'AMAZON.FallbackIntent': function () {
        const speechOutput = FALLBACK_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        const speechOutput = STOP_MESSAGE;
        
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        const speechOutput = STOP_MESSAGE;
        
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        const speechOutput = UNHANDLED_MESSAGE;
        
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        const speechOutput = STOP_MESSAGE;
        
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.RepeatIntent': function () { 
        const speechOutput = STOP_MESSAGE;
        
        this.response.speak(speechOutput);
        this.emit(':responseReady');         
    } 
};

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

//=========================================================================================================================================
// Function: lookUpInspection
//=========================================================================================================================================
function lookUpInspection(queryValue, callback) {
    console.log('lookUpInspection queryValue is '+queryValue);
    httpGet(queryValue, (res) => {
        console.log('Got JSON file with :'+res.length +' bytes.');
        var queryResponse = parseJSON(res);
        console.log('Parsed JSON: '+queryResponse);
        if (queryResponse.length == 0) {
            console.log('**** Try to bail with Callback Null');
            callback(null);
            return;
        }
        console.log('*** Selected Facility: '+ queryResponse.result.records[0].FACILITY_NAME + '|' + queryResponse.result.records[0].ACTIVITY_DATE + '|' + queryResponse.result.records[0].SCORE);

        callback(queryResponse.result.records[0]);
        });
}

//=========================================================================================================================================
// Function: httpGet
//=========================================================================================================================================
function httpGet(queryValue, callback) {
    var options = {
        hostname: "www.civicdata.com",
        port: 80,
        path: encodeURI("/api/action/datastore_search_sql?sql=SELECT \"FACILITY_NAME\", \"ACTIVITY_DATE\", \"SCORE\" from \"f3f78434-23fa-496a-a9f2-76a7b346aad6\" WHERE \"FACILITY_NAME\" LIKE '"+queryValue+"%' AND \"SERVICE\"='REGULAR INSPECTION' AND \"PROGRAM_DESCRIPTION\" LIKE 'RESTAURANT%' ORDER BY \"FACILITY_NAME\", \"ACTIVITY_DATE\" DESC"),
        method: 'GET'};

    console.log('httpGet say queryValue is '+queryValue);
    console.log('*** http Request options: '+options.hostname+options.path);
    console.log('*** Getting HTTP Stream');  
    const req = http.request(options, (res) => {
        var responseString = '';
    
        res.setEncoding('utf8');

        res.on('data', chunk => {
            console.log('### chunking data');
            responseString = responseString + chunk;  
        });
        
        //If we get an error
        req.on('error', (e) => {
            console.error(e);
        });
        
        req.on('close', (e) => {
            console.log('*** Closing HTTP Connection');
            callback(responseString);
        })
    });
    req.end();
    console.log('*** Leaving httpGet');  
}

//=========================================================================================================================================
// Function: parseJSON
//=========================================================================================================================================
function parseJSON(text) {
    console.log('*** Starting JSON Conversion');
    var myObj = JSON.parse(text);
    console.log('*** Finished with JSON Conversion');
    return myObj;
}

//=========================================================================================================================================
// Handlers: Alexa Object
//=========================================================================================================================================
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
