const {Router} = require('express');

module.exports = (models) =>{

    const router = new Router();

    router.get('/readall/:id', async (req, res, next) =>{
        if(req.params.id !== undefined && Number.isInteger(req.params.id))
            next();
        else
            next({message: "bad ID value", status: 400})
    });

    router.use('/create', async (req, res, next) =>{
        switch (models) {
            case "fleets": {
                req.body.name !== undefined ? next() : next({message: "bad value", status: 400});
                break;
            }
            case "vehicles": {
                req.body.name !== undefined && Number.isInteger((req.body.fleetId)) ? next() : next({message: "bad value", status: 400});
                break;
            }
            case "motions": {
                req.body.latitude !== undefined && req.body.longitude !== undefined
                && req.body.time !== undefined && Number.isInteger(parseInt(req.body.vehicleId))
                    ? next() : next({message: "bad value", status: 400});
                break;
            }
        }
    });
    router.use('/update/(:id)?', async (req, res, next) =>{
        switch (models) {
            case "fleets": {
                req.body.name !== undefined ? next() : next({message: "bad value", status: 400});
                break;
            }
            case "vehicles": {
                req.body.name !== undefined && Number.isInteger(+req.params.id) ? next() : next({message: "bad value", status: 400});
                break;
            }
            case "motions": {
                req.body.latitude !== undefined && req.body.longitude !== undefined
                && req.body.time !== undefined && Number.isInteger(parseInt(req.body.vehicleId))
                    ? next() : next({message: "bad value", status: 400});
                break;
            }
        }
    });
    return router;
};