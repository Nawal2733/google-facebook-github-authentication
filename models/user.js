const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    provider_id:{
        type: String
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    photo:{
        type: String
    },
    profileUrl: {
        type: String
    },
    provider:{
        type: String
    }

});

// userSchema.methods.generateAuthToken = function () {
//     const token = jwt.sign({
//         _id: this._id
//     }, config.get('jwtPrivateKey'));
//     return token;
// }

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(1).max(255).required().email(),
        password: Joi.string().min(1).max(255).required(),
        cpassword: Joi.string().min(1).max(255).required() || cpassword === password,

    };
    return Joi.validate(user, schema);
}


exports.User = User;
exports.validate = validateUser;