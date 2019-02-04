const mongoose = require( 'mongoose' );
const Joi = require( 'joi' );
const jwt = require( 'jsonwebtoken' );
const keys = require( '../config/keys' );


const minNameLen = 2;
const maxNameLen = 255;

const minEmailLen = 3;
const maxEmailLen = 255;

const minPasswordLen = 6;
const maxPasswordLen = 1024;




// Declare Schema
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: minNameLen,
    maxLength: maxNameLen,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minLength: minEmailLen,
    maxLength: maxEmailLen,
  },
  password: {
    type: String,
    required: true,
    minLength: minPasswordLen,
    maxLength: maxPasswordLen,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});


// generateAuthToken()
//
employeeSchema.methods.generateAuthToken = function _genAuthToken(){

  return jwt.sign({ _id: this._id, isAdmin: this.isAdmin, userType: 'employee' }, keys.jwtPrivateKey );

};//END generateAuthToken


const Employee = mongoose.model( 'Employee', employeeSchema );



// Validate incoming request data
//
function validateEmployee(employee){
  const schema = {
    name: Joi.string().min( minNameLen ).max( maxNameLen ).required(),
    email: Joi.string().email().max( maxEmailLen ).required(),
    password: Joi.string().min( minPasswordLen ).max( maxPasswordLen ).required(),
    isAdmin: Joi.bool().required(),
  };

  return Joi.validate( employee, schema );
}//END validateEmployee


// Exports
//
module.exports.Employee = Employee;
module.exports.validate = validateEmployee;
