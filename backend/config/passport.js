let passport = require('passport');
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let users = require('../models/users');
let { secret } = require('./config');

function auth() {
    let opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret
    };
    console.log("inside passport");
    passport.use(
        new JwtStrategy(opts, (jwt_payload, callback) => {
            const userId = jwt_payload._id;
            users.findById(userId, (err, results) => {
                if (err) {
                    return callback(err, false);
                }
                if (results) {
                    callback(err, results);
                }
                else {
                    callback(null, false);
                }
            })
        })
    )
};

exports.auth = auth;
exports.checkAuth = passport.authenticate('jwt', { session: false })