const Repository = require('../../db/repository');
const {Router} = require('express');

const repository = new Repository('motions');
const repositoryVehicles = new Repository('vehicles');

module.exports = function (){
    const router = new Router();

    router.post('/create', async (req, res, next) =>{
        let motion = req.body;
        let vehicle = await repositoryVehicles.read(motion.vehicleId);
        if(vehicle && (req.manager.super || vehicle.fleetId === req.manager.fleetId)){
            let item = await repository.create(req.body);
            res.json(item);
        }
        else{
            next({message: 'error in create motion', status: 403});
        }

    });

    return router;
};

