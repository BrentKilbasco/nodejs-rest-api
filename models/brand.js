const Joi = require( 'joi' );
const mongoose = require( 'mongoose' );


// Min/max lengths
//
const minStringLen = 3;

const maxNameLen = 255;
const maxDescLen = 1024;



// Declare schema
const brandSchema = new mongoose.Schema({ 
  name: {
    type: String,
    require: true,
    minLength: minStringLen,
    maxLength: maxNameLen,
  },
  description: {
    type: String,
    require: true,
    minLength: minStringLen,
    maxLength: maxDescLen,
  },
});


// Declare model
const Brand = mongoose.model( 'Brand', brandSchema );


// Validate
//
function validateBrand(brand){
  const schema = {
    name: Joi.string().min( minStringLen ).max( maxNameLen ).required(),
    description: Joi.string().min( minStringLen ).max( maxDescLen ).required(),
  };

  return Joi.validate( brand, schema );
}//END validateBrand


// Exports
//
module.exports.Schema = brandSchema;
module.exports.Brand = Brand;
module.exports.validate = validateBrand;
