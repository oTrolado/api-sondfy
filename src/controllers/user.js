const User = require('../models/user')();
const md5 = require('md5');
//senha: md5(req.body.senha + global.SALT_KEY)
let controller = {}

controller.login = (req, res) => {
    try {
        const user = req.params.user;
        const password = md5(req.body.password + global.SALT_KEY);
        User.findOne({user:user}).exec().then(
            (user) => {
                if(!user){
                    res.sendStatus(404);
                } else if( user.password == password ){
                    res.json(user).status(200).end();
                } else {
                    res.sendStatus(403);
                }
            }
        );

    } catch(e){
        res.send(500).send(e);
        throw e;
    }
}

controller.singin = (req, res) => {
    User.findOne({user:req.body.user}).exec().then(
        (user) => {
            if(user){
                res.sendStatus(403);
            } else {
                try{
        
                    User.create({
                        name: req.body.name,
                        user: req.body.user,
                        password: md5(req.body.password + global.SALT_KEY)
                    });
                    res.sendStatus(201);
            
                } catch(e){
                    res.status(500).send(e);
                    throw e;
                }
            }
        }
    );
}

controller.getPlaylists = (req, res) => {
    let user = req.params.user;
    User.findOne({user:user}).exec().then(
        (user) => {
            if(user){
                res.json(user.playlists).sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        }
    );
}

controller.savePlaylist = (req, res) => {
    let _id = req.params.id;
    playlist = req.body.playlist;
    User.findOne({_id:_id}).exec().then(
        (user) => {
            if(user){
                user.playlists.push(JSON.stringify(req.body.playlist));
                User.findOneAndUpdate({_id:_id}, user).exec().then(
                    (user) => {
                        if(user){
                            res.sendStatus(200);
                        } else {
                            res.sendStatus(404);
                        }
                    },
                    (erro) => {
                        console.error(erro);
                        res.json(erro).sendStatus(400);
                    }
                );
            } else {
                res.sendStatus(404);
            }
        }
    );
}

controller.deletePlaylist = (req, res) => {
    let _id = req.body._id;
    let title = req.body.title;
    User.findById(_id).exec().then(
        (user) => {
            if(user){
                for(i = 0; i < user.playlists.length; i++){
                    let pl = JSON.parse(user.playlists[i]);
                    if(pl.title == title){
                        user.playlists.splice(i, 1);
                    }
                }
                User.findByIdAndUpdate(_id, user).exec().then(
                    (user) => {
                        if(user){
                            res.sendStatus(200);
                        } else {
                            res.sendStatus(404);
                        }
                    },
                    (erro) => {
                        console.error(erro);
                        res.json(erro).sendStatus(400);
                    }

                );
            } else {
                res.sendStatus(400);
            }
        }
    );
}

module.exports = controller; 