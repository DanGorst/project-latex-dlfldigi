describe("Telemetry decoder", function() {
	var decoder = require("../telemetryDecoder");

 	it("correctly decodes a valid string with a matching set of keys", function() {
        var result = decoder.decodeTelemetryData("JCRsYXRleCw1NC4yLDIuNTY=", ["project_name", "latitude", "longitude"]);
    	expect(result).toEqual({project_name: "$$latex", latitude: "54.2", longitude: "2.56"});
  	});
    
    it("throws exception if passed a null string", function() {
        expect(function() { decoder.decodeTelemetryData(null, []) }).toThrow("Cannot decode null data");
    });
    
    it("throws exception if passed null keys", function()   {
        expect(function() { decoder.decodeTelemetryData("", null) }).toThrow("Cannot decode data with null keys");
    });
    
    it("throws exception if passed empty string and empty set of keys", function()   {
        expect(function() { decoder.decodeTelemetryData("", []) }).toThrow("Data doesn't match the keys passed in from the schema");
    });
    
    it("throws exception if passed keys length doesn't match data length", function()   {
        expect(function() { decoder.decodeTelemetryData("", ["someKey", "anotherKey"]) }).toThrow("Data doesn't match the keys passed in from the schema");
        expect(function() { decoder.decodeTelemetryData("JCRsYXRleCw1NC4yLDIuNTY=", ["someKey", "anotherKey"]) }).toThrow("Data doesn't match the keys passed in from the schema");
    });
    
    it("converts a valid time string to a date object", function() {
        var actual = decoder.convertDateString("12:30:15");
        // Both the decoder and the expected date are running on local time. In the UK this could be either BST or GMT, which will affect the hours value of the date
        var expected = new Date();
        expected.setHours(12);
        expected.setMinutes(30);
        expected.setSeconds(15);
        
        expect(actual instanceof Date).toBe(true);
        expect(actual.getHours()).toEqual(expected.getHours());
        expect(actual.getMinutes()).toEqual(expected.getMinutes());
        expect(actual.getSeconds()).toEqual(expected.getSeconds());
    });
    
    it("throws exception if invalid time string is passed in", function() {
        expect(function() { decoder.convertDateString("invalid") }).toThrow(decoder.invalidTimeStringMessage + ': invalid');
    });
    
    it("throws exception if invalid time string is passed in with right kind of format, but letters instead of numbers", function() {
        expect(function() { decoder.convertDateString("aa:bb:cc") }).toThrow(decoder.invalidTimeStringMessage + ': aa:bb:cc');
    });
    
    it("throws exception if invalid time string is passed in with values out of range for a time", function() {
        expect(function() { decoder.convertDateString("55:99:88") }).toThrow(decoder.invalidTimeStringMessage + ': 55:99:88');
    });
    
    it("throws exception if invalid time string is passed in with hours just out of range", function() {
        expect(function() { decoder.convertDateString("24:00:12") }).toThrow(decoder.invalidTimeStringMessage + ': 24:00:12');
    });
    
    it("throws exception if invalid time string is passed in with minutes just out of range", function() {
        expect(function() { decoder.convertDateString("12:60:12") }).toThrow(decoder.invalidTimeStringMessage + ': 12:60:12');
    });
    
    it("throws exception if invalid time string is passed in with seconds just out of range", function() {
        expect(function() { decoder.convertDateString("11:00:60") }).toThrow(decoder.invalidTimeStringMessage + ': 11:00:60');
    });
    
    it("throws exception if invalid time string is passed in with negative values", function() {
        expect(function() { decoder.convertDateString("-11:00:10") }).toThrow(decoder.invalidTimeStringMessage + ': -11:00:10');
    });
});