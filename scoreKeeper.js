'use strict';

var goodCount = 0;
var badCount = 0;

function good() {
    ++goodCount;
}

function bad() {
    ++badCount;
}

function successRate() {
    var total = goodCount + badCount;
    if (total === 0) {
        return 0;
    }
    else {
        return (goodCount / total);
    }
}

module.exports = {
    good: good,
    bad: bad,
    successRate: successRate
}