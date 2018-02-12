const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class Auth {

    constructor(repo, secretKey){
        this.model = repo;
        this.sercretKey = secretKey;
        this.tokenExpiresIn = "55m";
    }

    async register(res, body,next){
        try {
            let data = await this.model.create(body);
            res.json(data);
        }
        catch (err) {
            next({message: "Bad register data", status: 400});
        }
    }

    async login(res, email, password,next){
        let user = await this.isAccountExist(email, password);
        if (user) {
            let token = jwt.sign(
                {id: user.id, email},
                this.sercretKey,
                {expiresIn: this.tokenExpiresIn});
            res.json(token);
        }
        next({message:"Wrong login or password", status: 409});
    }

    async isAccountExist(email, password){
        let user = await this.model.find({where: {email}});
        if (user) {
            if (await bcrypt.compare(password, user.get({raw: true}).password))
                return user;
        }
        return;
    }

    async verifyToken(token){
        try {
            return await jwt.verify(token, this.sercretKey);
        } catch (err) {
            return;
        }
    }

    async getManagerById(id){
        return await this.model.find({where: {id}});
    }
}

module.exports = Auth;