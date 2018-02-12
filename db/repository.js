const Sequelize = require('Sequelize');
const {models} = require('./models/index')(Sequelize);

class Repository {
    constructor(name){
        this.table = models[name];
        this.contextName = name;
    }
    readAll(id){
        if (id !== undefined && this.contextName === 'vehicles') {
            return this.table.findAll(
                {where: {fleetId: id}}
            );
        }
        else
            return this.table.findAll();
    }
    findAllMotions(id){
        return models['motions'].findAll(
                {where: {vehicleId: id}}
        );
    }
    read(id){
        return this.table.findById(id);
    }
    update(data, id){
        return this.table.findById(id)
            .then(findResult =>{
                    if (findResult) {
                        return findResult.update(data);
                    }
                    else
                        return null;
                }
            ).catch(err => console.log(err));

    }
    create(data){
        return this.table.create(data)
            .then(result => result)
            .catch(err => err);
    }

    delete(id){
        return this.table.findById(id)
            .then(findResult =>{
                    if (findResult) {
                        return findResult.destroy();
                    }
                    else
                        return null;
                }
            )
    }
}

module.exports = Repository;
