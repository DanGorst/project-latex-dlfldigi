describe("Score Keeper", function() {
	var scoreKeeper = require("../scoreKeeper");
    
    it("returns a rate of 0 if no good or bad results have been seen", function() {
        expect(scoreKeeper.successRate()).toEqual(0);
  	});
    
    it("keeps track of the current success rate", function() {
        scoreKeeper.bad();
        expect(scoreKeeper.successRate()).toEqual(0);
        scoreKeeper.good();
        expect(scoreKeeper.successRate()).toEqual(0.5);
        scoreKeeper.good();
        scoreKeeper.good();
        expect(scoreKeeper.successRate()).toEqual(0.75);
  	});
});