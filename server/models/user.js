// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const Joi = require("joi");
// const passwordComplexity = require("joi-password-complexity");

// const userSchema = new mongoose.Schema({
// 	name: { type: String, required: true },
// 	email: { type: String, required: true },
// 	password: { type: String, required: true },
//     role: { 
//         type: String, 
//         enum: ['farmer', 'businessman'], // Only allow these two options
//         required: true 
//         },
// 	img: {type: String},
// 	// appliedSchemes: {type: [String]},
// 	appliedSchemes: [{
// 		type: mongoose.Schema.Types.ObjectId,
// 		ref: 'Scheme' // Reference to the Scheme model
// 	  }],

// });

// userSchema.methods.generateAuthToken = function () {
// 	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
// 		expiresIn: "7d",
// 	});
// 	return token;
// };

// const User = mongoose.model("User", userSchema);

// const validate = (data) => {
// 	const schema = Joi.object({
// 		name: Joi.string().required().label("Name"),
// 		email: Joi.string().email().required().label("Email"),
// 		password: passwordComplexity().required().label("Password"),
//         role: Joi.string().valid('farmer', 'businessman').required().label('Role'),
// 		img: Joi.string().required().label("Img")
// 	});
// 	return schema.validate(data);
// };

// module.exports = { User, validate };


const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['farmer', 'businessman'], // Only allow these two options
        required: true 
        },
	img: {type: String},
	// appliedSchemes: {type: [String]},
	appliedSchemes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Scheme' // Reference to the Scheme model
	  }],
	cart: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Products'
	}]
	  
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("User", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		name: Joi.string().required().label("Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
        role: Joi.string().valid('farmer', 'businessman').required().label('Role'),
		img: Joi.string().required().label("Img")
	});
	return schema.validate(data);
};

module.exports = { User, validate };