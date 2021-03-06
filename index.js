'use strict';


const Xray = require('x-ray');


const internals = {};


module.exports = internals.Probables = {};


internals.Probables.get = function (day, callback) {

    const url = `http://mlb.mlb.com/news/probable_pitchers/index.jsp?c_id=mlb&date=${day}`;
    const scope = 'div#mc';
    const selector = {
        pitchers: ['div.pitcher@pid'],
        names: ['div.pitcher h5 a'],
        throws: ['div.pitcher h5 span'],
        teams: ['div.pitcher@tid'],
        games: ['div.pitcher@gid'],
        startTimes: ['div.pitcher@local_time'],
        easternTimes: ['div.pitcher@eastern_time'],
        timezones: ['div.pitcher@local_time_zone']
    };

    const x = Xray();
    x(url, scope, selector)((err, result) => {

        if (err) {
            return callback(err);
        }

        const matchups = internals.convertResult(result);
        return callback(null, matchups);
    });
};


internals.convertResult = function (result) {

    const matchups = [];

    const pitchers = result.pitchers;
    const teams = result.teams;
    const names = result.names;
    const throws = result.throws;

    for (let i = 0; i < pitchers.length; i += 2) {
        const j = i + 1;
        const matchup = {
            id: result.games[i],
            startTime: result.startTimes[i],
            easternTime: result.easternTimes[i],
            timezone: result.timezones[i],
            teams: {
                away: teams[i],
                home: teams[j]
            },
            pitchers: {
                away: {
                    id: pitchers[i],
                    name: names[i],
                    throws: throws[i]
                },
                home: {
                    id: pitchers[j],
                    name: names[j],
                    throws: throws[j]
                }
            }
        };

        matchups.push(matchup);
    }

    return matchups;
};
