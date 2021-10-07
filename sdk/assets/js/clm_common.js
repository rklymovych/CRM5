CLMPlayer = {};

CLMPlayer.MessagePost = function(message) {
    parent.postMessage(message, '*');
};

CLMPlayer.updateFeedback = function (type){
    let message = {
        "request": "updateFeedback",
        "params": {"type": type}
    };
    CLMPlayer.MessagePost(JSON.stringify(message));
    //webkit.messageHandlers.nativeCall.postMessage(JSON.stringify(message));
};

CLMPlayer.gotoSlide = function (sequenceId, slideName, animation){
    let message = {
        "request": "gotoSlide",
        "params": {"sequenceId": sequenceId, "slideName": slideName, "animation": animation}
    };
    CLMPlayer.MessagePost(JSON.stringify(message));
    //webkit.messageHandlers.nativeCall.postMessage(JSON.stringify(message));
};

CLMPlayer.goPreviousSequence = function (){
    let message = {
        "request": "goPreviousSequence",
        "params": {}
    };
    CLMPlayer.MessagePost(JSON.stringify(message));
    //webkit.messageHandlers.nativeCall.postMessage(JSON.stringify(message));
};

CLMPlayer.goNextSequence = function (){
    let message = {
        "request": "goNextSequence",
        "params": {}
    };
    CLMPlayer.MessagePost(JSON.stringify(message));
    //webkit.messageHandlers.nativeCall.postMessage(JSON.stringify(message));
};

CLMPlayer.stopTrackingPage = function (){
    let message = {
        "request": "stopTrackingPage",
        "params": {}
    };
    CLMPlayer.MessagePost(JSON.stringify(message));
    //webkit.messageHandlers.nativeCall.postMessage(JSON.stringify(message));
};

CLMPlayer.startTrackingPage = function (pageid){
    let message = {
        "request": "startTrackingPage",
        "params": {"pageid": pageid}
    };
    CLMPlayer.MessagePost(JSON.stringify(message));
    //webkit.messageHandlers.nativeCall.postMessage(JSON.stringify(message));
};

CLMPlayer.saveState= function (state){
    let message = {
        "request": "saveState",
        "params": {"state": state}
    };
    CLMPlayer.MessagePost(JSON.stringify(message));
    //webkit.messageHandlers.nativeCall.postMessage(JSON.stringify(message));
};

CLMPlayer.alert = function (messageText){
    let message = {
        "request": "alert",
        "params": {"msg": messageText}
    };
    CLMPlayer.MessagePost(JSON.stringify(message));
    //webkit.messageHandlers.nativeCall.postMessage(JSON.stringify(message));
};

CLMPlayer.addAction = function (action, detailed_time, from_time, to_time, product_id, page, message_id, slide_order, category, reaction_type, questions_raised, extra_1, extra_2, extra_3, extra_4, extra_5, assets){
    let message = {
        "request": "addAction",
        "params": {
            "action__c" : action,
            "detailedtime__c" : detailed_time,
            "fromtime__c" : from_time,
            "totime__c" : to_time,
            "product__c" : product_id,
            "pageid__c" : page,
            "productmessageexternalid__c" : message_id,
            "slideorder__c" : slide_order,
            "category__c" : category,
            "reaction__c" : reaction_type,
            "questionraised__c" : questions_raised,
            "extra1__c" : extra_1,
            "extra2__c" : extra_2,
            "extra3__c" : extra_3,
            "extra4__c" : extra_4,
            "extra5__c" : extra_5,
            "assets" : assets
        }
    };
    CLMPlayer.MessagePost(JSON.stringify(message));
    //webkit.messageHandlers.nativeCall.postMessage(JSON.stringify(message));
};

/**
 * Event callbacks - ability to register JS functions defined in the presentation slide code, which are being invoked when a respective event occurs on the iOS native interface
 */

CLMPlayer.registeredEvents = {};

CLMPlayer.registerEventListener = function (eventType, funct){
    if(CLMPlayer.registeredEvents[eventType] == null)
        CLMPlayer.registeredEvents[eventType] = [];
    CLMPlayer.registeredEvents[eventType][CLMPlayer.registeredEvents[eventType].length] = funct;
};

CLMPlayer.executeEvent = function (eventType){
    let listeners = CLMPlayer.registeredEvents[eventType];
    if(listeners != null)
        for (let i in listeners)
            listeners[i]();
};

// JS functions to enable / disable swipe listening on portion of the screen

CLMPlayer.defineNoSwipeRegion = function (regionId, x, y, width, height){
    let message = {
        "request": "defineNoSwipeRegion",
        "params": {
            "regionId": regionId,
            "x": x,
            "y": y,
            "width": width,
            "height": height
        }
    };
    CLMPlayer.MessagePost(JSON.stringify(message));
    //webkit.messageHandlers.nativeCall.postMessage(JSON.stringify(message));
};

CLMPlayer.destroyNoSwipeRegion = function (regionId){
    let message = {
        "request": "destroyNoSwipeRegion",
        "params": {"regionId": regionId}
    };
    CLMPlayer.MessagePost(JSON.stringify(message));
    //webkit.messageHandlers.nativeCall.postMessage(JSON.stringify(message));
};

// Add an event listener
document.addEventListener("onCLMPlayerLoaded", function(e) {
    console.log(e.message); // Prints "Example of an event"
});

// Create the event
let eventCLMPlayer = new CustomEvent("onCLMPlayerLoaded", { "message": "CLMPlayer loaded" });

// Dispatch/Trigger/Fire the event
document.dispatchEvent(eventCLMPlayer);
