var fs = require('fs');
var async = require('async');
var path = require('path');
const {slackUrl, API, token, idYes, idContract, idMoney, idCal, idMaster, idEmail, idNoEmail, idNoResponse, idCall} = require('./token.js');
var slack = require('slack-incoming-webhook');
var sponsors = slack({url: slackUrl});
var Trello = require('node-trello');
var t = new Trello(API, token);
function getList(id, callback) {
    t.get("/1/lists/" + id + "/cards", function(err, data){
        if(err) console.log(id);
        callback(err, data.length);
    })
}
async.parallel([
    async.apply(getList, idYes),
    async.apply(getList, idContract),
    async.apply(getList, idMoney),
    async.apply(getList, idCal),
    async.apply(getList, idMaster),
    async.apply(getList, idEmail),
    async.apply(getList, idNoResponse),
    async.apply(getList, idCall),

], function(err, array){
    if(err) console.error(err);
    console.log(array);
    var yes = array[0] + array[1] + array[2];
    var undone = array[3] + array[4];
    var waiting = array[5] + array[6] + array[7];
    var sum = array.reduce(function(p, c){return p + c});
    var tracking = "Tracking " + sum + " companies";
    var stats = "Stats: we have " + yes / sum * 100 + " percent of companies who have said yes\n" + waiting / sum * 100 + " percent of companies who we are waiting on replies\n" + undone / sum * 100 + " percent of companies we have not emailed";
    sponsors(tracking + "\n" + stats);
});