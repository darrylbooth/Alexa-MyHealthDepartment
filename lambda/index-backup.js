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
//=========================================================================================================================================
'use strict';
var Alexa = require('alexa-sdk'); //Module with tools to make development easier

//var https = require('https');   //Module to ease HTTP requests
var http = require('http');     //Module to ease HTTP requests

const APP_ID           = 'amzn1.ask.skill.5ab4f319-ae41-41b1-b653-13c324026076';
const SKILL_NAME       = 'My Health Department';
const WELCOME_MESSAGE  = 'Welcome. You can ask me to find you health department, check inspection scores, or give food safety tips.';
const HELP_MESSAGE     = 'You can say where is my health department?';
const HELP_REPROMPT    = 'What would you like to do?';
const FALLBACK_MESSAGE = 'Sorry, your request isn\'t one of the things I\'m programmed to do yet. Come back later.';
const STOP_MESSAGE     = 'Goodbye!';
const UNHANDLED_MESSAGE= 'You\'ve reached an unhandled function. Please try again.';

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
    'HoursOfOperation': function () {
        var speechOutput = 'Your health department is open at 7:30AM and closes at 4:30PM, Monday through Friday.';

        this.response
            .speak(speechOutput);
        this.emit(':responseReady');
    },        
    //---------------------------------------------------------------
    // Inspection Score Invent
    //---------------------------------------------------------------    
    'InspectionScoreIntentHandler' : function () {
        var speechOutput = 'No output defined.';
        var facilityName = this.event.request.intent.slots.FacilityName.value; //Extract Facility name
        
        var queryResponse = httpGet(facilityName, 
        
        return;
        lookUpFacility(facilityName, (matchedFacility) => {
            if (matchedFacility == null)
                speechOutput = 'No matches for the facility ' + facilityName
            else
                speechOutput = 'The last routine inspection of ' + facilityName + ' occurred on July 1, 2019. The inspection score was 89.';

            this.response
                .speak(speechOutput).listen('ready')
                .listen('ready'); 
            this.emit(':responseReady');
        });

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

//=========================================================================================================================================
// Handler: Alexa Object
//=========================================================================================================================================
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};



//=========================================================================================================================================
// Module functions
//=========================================================================================================================================



//=========================================================================================================================================
// Function: lookUpFacility
//=========================================================================================================================================
function lookUpFacility(facilityName) {
    var matchedFacility = ['Default_facilitName','Default_activityDate', 'Default_score'];    
    var queryResponse = httpGet(facilityName, pj(queryResponse));
    
    console.log('***** Found '+queryResponse.length + ' records.');
    console.log('*** Selected Facility: '+ queryResponse.result.records[0].FACILITY_NAME + '|' + queryResponse.result.records[0].ACTIVITY_DATE + '|' + queryResponse.result.records[0].SCORE);
    
    matchedFacility[0] = queryResponse.result.records[0].FACILITY_NAME;
    matchedFacility[1] = queryResponse.result.records[0].ACTIVITY_DATE;
    matchedFacility[2] = queryResponse.result.records[0].SCORE;
    
    return(matchedFacility);
}
//=========================================================================================================================================
// Function: httpGet
//=========================================================================================================================================
function httpGet(facilityName, callback) {
    var options = {
        hostname: "www.civicdata.com",
        port: 80,
        path: "/api/action/datastore_search_sql?sql=SELECT%20%22FACILITY_NAME%22,%20%22ACTIVITY_DATE%22,%20%22SCORE%22%20from%20%22f3f78434-23fa-496a-a9f2-76a7b346aad6%22%20WHERE%20%22FACILITY_NAME%22%20LIKE%20%27TACO%20BELL%27",
        method: 'GET'}
        
    console.log('*** HTTP Request options: '+options.hostname+options.path);
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
};

//=========================================================================================================================================
//=========================================================================================================================================

function pj(res) {
    console.log('Got JSON file with :'+res.length +' bytes.');
    var queryResponse = parseJSON(res);
    if (queryResponse.length == 0) {
        console.log('**** Try to Bail with Callback Null');
//      callback(null);
        return;
    }
    return queryResponse;
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