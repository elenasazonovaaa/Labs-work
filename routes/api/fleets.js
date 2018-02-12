const Repository = require('../../db/repository');
const {Router} = require('express');

const repository = new Repository('fleets');

module.exports = () => {
    const router = new Router();

    router.get('/readall', async (req, res, next) =>{
        if(req.manager.super){
            let items = await repository.readAll();
            res.json(items);
        }
        else{
            next({message:'only for superManager', status: 403});
        }
    });

    router.get('/read(/:id)?', async (req, res, next) =>{
        if (req.manager.super) {
            let item = await repository.read(req.params.id);
            if (item)
                res.json(item);
            else
                next({message: "item not found", status: 404});
        }
        else{
            let item = await repository.read(req.manager.fleetId);
            if (item)
                res.json(item);
            else
                next({message: "item not found", status: 404});
        }
    });

    router.post('/create', async (req, res, next) =>{
        if (req.manager.super){
            let item = await repository.create(req.body);
            res.json(item);
        }
        else{
            next({message: 'only for superManager', status: 403});
        }
    });

    router.put('/update/:id', async (req, res, next) =>{
        if(req.manager.super){
            let item = await repository.update(req.body, req.params.id);
            if (item)
                res.json(item);
            else
                next({message: "item not found", status: 404});
        }
        else{
            next({message: 'only for superManager', status: 403});
        }
    });

    router.delete('/delete/:id', async (req, res, next) =>{
        if (req.manager.super){
            let item = await repository.delete(req.params.id);
            if (item)
                res.json(item);
            else
                next({message: "item not found", status: 404});
        }
        else{
            next({message: 'only for superManager', status: 403});
        }
    });


    return router;
};