const User = require('../models/user');
const {errorHandler} = require('../helpers/dbErrorhandler')

// const  uuidv4 = require('uuidv4');

exports.signup = (req, res) => {
    // console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            console.log("ERROR")
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        user.salt=undefined;
        user.hashed_password=undefined;
        res.json({user})
    })
}