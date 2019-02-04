const Joi = require( 'joi' );
const mongoose = require( 'mongoose' );


const brandModel = require( './brand' );
const styleModel = require( './style' );


const minNameLen = 1;
const maxNameLen = 255;

const minDescLen = 0;
const maxDescLen = 1024;

const minNumberValue = 0;
const maxNumberValue = 1000000;


// Declare schema 
const carSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    require: true,
    minLength: minNameLen,
    maxLength: maxNameLen,
  },
  description: {
    type: String,
    trim: true,
    require: true,
    minLength: minDescLen,
    maxLength: maxDescLen,
  },
  brand: {
    type: brandModel.Schema,
    required: true,
  },
  style: {
    type: styleModel.Schema,
    required: true,
  },
  numberInStock: {
    type: Number,
    min: minNumberValue,
    max: maxNumberValue,
    default: 0,
  },
  dailyRentalRate: {
    type: Number,
    min: minNumberValue,
    max: maxNumberValue,
    default: 0,
  },
});


// Validate incoming request 
//
function validateCar(car){
  const schema = {
    name: Joi.string().min( minNameLen ).max( maxNameLen ).required(),
    description: Joi.string().min( minDescLen ).max( maxDescLen ).required(),
    brandId: Joi.objectId().required(),
    styleId: Joi.objectId().required(),
    numberInStock: Joi.number().min( minNumberValue ).max( maxNumberValue ),
    dailyRentalRate: Joi.number().min( minNumberValue ).max( maxNumberValue ),
  };

  return Joi.validate( car, schema );
}//END validate


// Declare data model
const Car = mongoose.model( 'Car', carSchema );


// Exports
module.exports.Schema = carSchema;
module.exports.Car = Car;
module.exports.validate = validateCar;
