const express = require('express');
const Sequelize = require('Sequelize');
const router = express.Router();
const Auth = require('./auth');
const secretKey = '78df767a86f78as-67fg87sd6s78f6a-6sd8f6876sd-sd678f68sd6f87';

const vehicles = require('./api/vehicles')();
const fleets = require('./api/fleets')();
const motions = require('./api/motions')();
const auth = require('./api/auth');
const validator = require('./api/validator');

let _auth = new Auth(require('../db/models/index')(Sequelize).models.managers, secretKey);

router.use(/^\/(?!auth).*/, async (req, res, next) =>{
    let authHeader = req.header('Authorization');
    if (authHeader) {
        if(authHeader.split(' ')[0] === 'Bearer'){
            let token = authHeader.split(' ')[1];
            let payload = await _auth.verifyToken(token);
            if (payload) {
                let manager = await _auth.getManagerById(payload.id);
                if (manager) {
                    req.manager = manager.get({raw: true});
                    next();
                }
                else {
                    next({message:'manager does not exist', status: 403});
                }
            }
            else {
                next({message:'invalid token', status: 403});
            }
        }
        else{
            next({message:"It is not be Bearer", status: 403});
        }

    }
    else {
        next({message:'unauthorized access', status: 401});
    }
});
router.use('/auth', auth(_auth));
router.use('/fleets', validator('fleets'), fleets);
router.use('/motions', validator('motions'), motions);
router.use('/vehicles', validator('vehicles'), vehicles);

module.exports = router;
