const geolib = require('geolib');
const Repository = require('../../db/repository');
const {Router} = require('express');

const repository = new Repository('vehicles');

module.exports = function (){
    const router = new Router();

    router.get('/readall', async (req, res, next) =>{
        if (req.manager.super){
            let item = await repository.readAll();
            res.json(item);
        }
        else{
            let item = await repository.readAll(req.manager.fleetId);
            res.json(item);
        }

    });

    router.get('/read/:id', async (req, res, next) =>{
        let item = await repository.read(req.params.id);
        if (item &&(req.manager.super || item.fleetId === req.manager.fleetId)){
            res.json(item);
        }
        else
            next({message: "item not found", status: 404});
    });

    router.post('/create', async (req, res, next) =>{
        let item;
        if (req.manager.super) {
            item = await repository.create(req.body);
        } else {
            req.body.fleetId = req.manager.fleetId;
            item = await repository.create(req.body);
        }
        res.json(item);
    });

    router.put('/update/:id', async (req, res, next) =>{
        let isobj = await repository.read(req.params.id);
        if (isobj && (req.manager.super || isobj.fleetId === req.manager.fleetId)){
            let item = await repository.update(req.body, req.params.id);
            if (item)
                res.json(item);
            else
                next({message: 'invalid update data', status: 404});
        }
        else{
            next({message: "item not found", status: 404});
        }
    });

    router.delete('/delete/:id', async (req, res, next) =>{
        let isobj = await repository.read(req.params.id);
        if (isobj && (req.manager.super || isobj.fleetId === req.manager.fleetId)){
            let item = await repository.delete(req.params.id);
            if (item)
                res.json(item);
            else
                next({message: 'invalid update data', status: 404});
        }
        else{
            next({message: "item not found", status: 404});
        }
    });

    router.get('/milage/:id', async (req, res, next) =>{
        let vehicle = await repository.read(req.params.id);
        if (vehicle && (req.manager.super || vehicle.fleetId === req.manager.fleetId)){
            let items = await repository.findAllMotions(req.params.id);
            let path = geolib.getPathLength(items.map(val => val.latLng));
            res.json(path);
        }
        else{
            next({message: "item not found", status: 404});
        }
    });

    return router;
};
