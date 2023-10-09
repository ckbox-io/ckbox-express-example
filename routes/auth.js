const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const dbUsers = [
    {
        id: '1',
        role: 'user',
        email: 'user@acme.com',
        password: 'testpwd123',
        name: 'John'
    },
    {
        id: '2',
        role: 'admin',
        email: 'admin@acme.com',
        password: 'testpwd123',
        name: 'Joe'
    },
    {
        id: '3',
        role: 'superadmin',
        email: 'superadmin@acme.com',
        password: 'testpwd123',
        name: 'Alice'
    }
];

passport.use(
    new LocalStrategy({ usernameField: 'email' }, function (
        email,
        password,
        done
    ) {
        const dbUser = dbUsers.find(function (dbUser) {
            return dbUser.email === email && dbUser.password === password;
        });

        if (!dbUser) {
            return done(null, false);
        }

        return done(null, dbUser);
    })
);

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, name: user.name, role: user.role });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

const router = express.Router();

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.post(
    '/login/password',
    passport.authenticate('local', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/login',
        failureMessage: true
    })
);

router.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }

        res.redirect('/');
    });
});

module.exports = router;
