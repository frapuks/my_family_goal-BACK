import bcrypt from 'bcrypt';
import { userDatamapper } from "../datamappers/index.js";
import { security } from "../services/security.js";
import { schemas } from "../services/validation.js";

const userController = {
    async signin(req, res){
        const form = req.body;
        const email = form.email;
        const password = form.password;

        try {
            // validation
            await schemas.connect.validateAsync(form);

            // find user with email
            const user = await userDatamapper.findByEmailWithPassword(email);
            if(!user) throw new Error('No user found');
            
            // check password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (user && !isValidPassword) throw new Error('Invalid Password');

            // récupère les infos du user à transmettre
            const userConnected = await userDatamapper.findById(user.id);
            
            // create token jwt
            const token = security.createToken(user);

            return res.json({"user" : userConnected, token});
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },
    
    async signup(req, res){
        const form = req.body;
        const saltRounds = parseInt(process.env.SALT_ROUNDS);

        try {
            // validation
            await schemas.createUser.validateAsync(form);

            // hash password
            const hash = await bcrypt.hash(form.password, saltRounds);
            form.password = hash;

            // Check if email already exist
            const emailFound = await userDatamapper.findEmail(form.email);
            if(emailFound) throw new Error('Email already exist');

            // Check if pseudo already exist
            const pseudoFound = await userDatamapper.findByPseudo(form.pseudo);
            if(pseudoFound) throw new Error('Pseudo already exist');
            
            // create user in DB
            const user = await userDatamapper.create(form);
            if(!user) throw new Error('Impossible to create user');

            // create token jwt
            const token = security.createToken(user);

            return res.json({user, token});
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },
    
    async get(req, res){
        const userId = parseInt(req.params.userId);

        try {
            // validation
            await schemas.reqParams.validateAsync(userId);

            // Find user
            const user = await userDatamapper.findById(userId);

            return res.json(user);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },
    
    async update(req, res){
        const userId = parseInt(req.params.userId);
        const form = req.body;
        const saltRounds = parseInt(process.env.SALT_ROUNDS);

        try {
            // validation
            await schemas.reqParams.validateAsync(userId);
            await schemas.updateUser.validateAsync(form);

            // get user & password
            const currentUser = await userDatamapper.findByIdWithPassword(userId);
            const isValidPassword = await bcrypt.compare(form.password, currentUser.password);
            if (currentUser && !isValidPassword) throw new Error('Invalid Password');

            // hash new password
            const hash = await bcrypt.hash(form.newPassword, saltRounds);
            form.newPassword = hash;

            // update user
            const user = await userDatamapper.update(form, userId);
            if(!user) throw new Error('Impossible to update user');

            // create token jwt
            const token = security.createToken(user);

            return res.json({user, token});
        } catch (error) {
            return res.status(500).json(error.message);            
        }
    },

    async delete(req, res){
        const userId = parseInt(req.params.userId);
        
        try {
            // validation
            await schemas.reqParams.validateAsync(userId);

            // delete user
            const linesCount = await userDatamapper.delete(userId);
            if(linesCount === 0) throw new Error(`Cannot delete user with id = ${userId}`);

            res.json(`Count of lines deleted : ${linesCount}`);
        } catch (error) {
            return res.status(500).json(error.message);            
        }
    }
}

export {userController};