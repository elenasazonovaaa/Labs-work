const {Router} = require('express');

module.exports = (auth) =>{

    const router = new Router();

    router.post('/register', async (req, res, next) =>{
        await auth.register(res, req.body, res,next);
    });

    router.post('/login', async (req, res, next) =>{
        await auth.login(res, req.body.email, req.body.password,next);
    });

    return router
};