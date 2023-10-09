const express = require('express');
const jwt = require('jsonwebtoken');

const CKBOX_ENVIRONMENT_ID = process.env.CKBOX_ENVIRONMENT_ID;
const CKBOX_ACCESS_KEY = process.env.CKBOX_ACCESS_KEY;

const router = express.Router();

router.get('/api/ckbox', function (req, res, next) {
    const user = req.user;

    if (user && user.role) {
        const payload = {
            aud: CKBOX_ENVIRONMENT_ID,
            sub: user.id,
            auth: {
                ckbox: {
                    role: user.role
                }
            }
        };

        const result = jwt.sign(payload, CKBOX_ACCESS_KEY, {
            algorithm: 'HS256',
            expiresIn: '1h'
        });

        res.send(result);
    } else {
        next({ message: 'Unauthenticated user', status: 401 });
    }
});

const PUBLIC_URL = process.env.PUBLIC_URL;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/ckeditor', ensureLoggedIn(), function (req, res) {
    res.render('ckeditor', {
        name: req.user.name,
        tokenUrl: `${PUBLIC_URL}/api/ckbox`
    });
});

router.get('/file-picker', ensureLoggedIn(), function (req, res) {
    res.render('file-picker', {
        name: req.user.name,
        tokenUrl: `${PUBLIC_URL}/api/ckbox`
    });
});

router.get('/inline', ensureLoggedIn(), function (req, res) {
    res.render('inline', {
        name: req.user.name,
        tokenUrl: `${PUBLIC_URL}/api/ckbox`
    });
});

module.exports = router;
