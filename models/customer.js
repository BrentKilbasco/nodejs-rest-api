const Joi = require( 'joi' );
const mongoose = require( 'mongoose' );
const jwt = require( 'jsonwebtoken' );
const keys = require( '../config/keys' );


const minNameLen = 2;
const maxNameLen = 255;

const minEmailLen = 3;
const maxEmailLen = 255;

const minPasswordLen = 6;
const maxPasswordLen = 1024;

const minPhoneNumLen = 7;
const maxPhoneNumLen = 255;


// Declare Schema
const customerSchema = new mongoose.Schema({
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
  phone: {
    type: String,
    required: true,
  },
  isGold: {
    type: Boolean,
    required: true,
  },
});


// generateAuthToken()
//
customerSchema.methods.generateAuthToken = function _genAuthToken() {

  return jwt.sign({ _id: this._id, isGold: this.isGold, userType: 'customer' }, keys.jwtPrivateKey );

};


const Customer = mongoose.model( 'Customer', customerSchema );



// validateCustomer()
//
function validateCustomer(customer){
  
  const schema = {

    name: Joi.string().min( minNameLen ).max( maxNameLen ).required(),
    email: Joi.string().email().max( maxEmailLen ).required(),
    password: Joi.string().min( minPasswordLen ).max( maxPasswordLen ).required(),
    phone: Joi.string().min( minPhoneNumLen ).max( maxPhoneNumLen ).required(),
    isGold: Joi.bool().required(),
  };
  
  return Joi.validate( customer, schema );

}//END validateCustomer


// Exports
//
module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
