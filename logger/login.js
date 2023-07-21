const req = require('express/lib/request');
const res = require('express/lib/response');

function log1 (req,res,next) {
    console.log('badreddine aziz');
    next();
};

module.exports = log1;