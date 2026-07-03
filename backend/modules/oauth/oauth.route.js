const passport = require('passport')
const express = require('express')
const oauth = express.Router()
const GoogleStrategy = require('passport-google-oauth20').Strategy

const GoogleController = require('./google.oauth.controller')

const User = require('../users/user.schema') 

oauth.use(passport.initialize())

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL 
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {

                    user = await User.findOne({ email: profile.emails[0].value })

                    if (user) {

                        user.googleId = profile.id;
                        user.avatar = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : user.avatar;
                        await user.save();
                    } else {
    
                        user = new User({
                            googleId: profile.id, 
                            isVerified: true,
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName || 'User',
                            email: profile.emails[0].value,
                            dailyKcalGoal: 2000, 
                            avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined
                        })
                        await user.save()
                    }
                }
                done(null, user)
            } catch (e) {
                done(e, null)
            }
        }
    )
)

oauth.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
}))


oauth.get('/google/callback', passport.authenticate('google', { failureRedirect: '/', session: false }), GoogleController.manageOauthCallback)

module.exports = oauth