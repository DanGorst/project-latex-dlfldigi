'use strict';

var invalidTimeStringMessage = "Invalid time string passed to decoder";

function decodeTelemetryData (base64data, telemetryKeys)    {
    if (base64data === null)    {
        throw "Cannot decode null data";
    }
    if (telemetryKeys === null) {
        throw "Cannot decode data with null keys";
    }
    
    var buffer = new Buffer(base64data, 'base64');
    var decodedDataStringWithChecksum = buffer.toString();
    // Split the string to separate out the checksum at the end
    var decodedDataString = decodedDataStringWithChecksum.split('*')[0];
    // The data is comma-separated, so get the individual values
    var telemetryArray = decodedDataString.split(',');
    
    if (telemetryArray.length != telemetryKeys.length)  {
        throw "Data doesn't match the keys passed in from the schema";
    }
    
    // Now match up the values with the associated keys in the telemetry schema
    var telemetryInfo = {};
    for (var i = 0; i < telemetryKeys.length; ++i) {
        telemetryInfo[telemetryKeys[i]] = telemetryArray[i];
    }
    
    return telemetryInfo;
}

function convertDateString(dateString) {
    var timeComponents = dateString.split(':');
    if (timeComponents.length != 3) {
        throw invalidTimeStringMessage + ': ' + dateString;
    }
    
    var numericTimeComponents = [];
    for (var i = 0; i < timeComponents.length; ++i) {
        var num = parseInt(timeComponents[i]);
        if (isNaN(num) || num < 0) {
            throw invalidTimeStringMessage + ': ' + dateString;
        }
        numericTimeComponents[i] = num;
    }
    if (numericTimeComponents[0] > 23
       || numericTimeComponents[1] > 59
       || numericTimeComponents[2] > 59) {
        throw invalidTimeStringMessage + ': ' + dateString;
    }
    
    // Our string only contains a time, not a date. For now, we're just using
    // today's date
    var date = new Date();
    date.setHours(numericTimeComponents[0]);
    date.setMinutes(numericTimeComponents[1]);
    date.setSeconds(numericTimeComponents[2]);
    return date;
}

module.exports = {
    decodeTelemetryData: decodeTelemetryData,
    convertDateString: convertDateString,
    invalidTimeStringMessage: invalidTimeStringMessage
}