const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const joi=require("joi")
const passwordComplexity=require("joi-password-complexity")
const userSchema=new mongoose.Schema({
    username:{type: String,require:true},
    email:{type: String,require:true},
    password:{type: String,require:true},
    verified:{type:Boolean,default:false}
})
userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("user", userSchema);

// const validate = (data) => {
// 	const schema = joi.object({
// 		username: joi.string().required().label("User name"),
// 		email: joi.string().email().required().label("Email"),
// 		password: passwordComplexity().required().label("Password"),
// 	});
// 	return schema.validate(data);
// };

module.exports = { User };