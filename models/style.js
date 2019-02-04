const Joi = require( 'joi' );
const mongoose = require( 'mongoose' );


// Min/max lengths
//
const minStringLen = 3;
const maxNameLen = 255;
const maxDescLen = 1024;



// Declare schema
const styleSchema = new mongoose.Schema({ 
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
const Style = mongoose.model( 'Style', styleSchema );


// Validate
//
function validateStyle(style){
  const schema = {
    name: Joi.string().min( minStringLen ).max( maxNameLen ).required(),
    description: Joi.string().min( minStringLen ).max( maxDescLen ).required(),
  };

  return Joi.validate( style, schema );
}//END validateStyle


// Exports
//
module.exports.Schema = styleSchema;
module.exports.Style = Style;
module.exports.validate = validateStyle;
