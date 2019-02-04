
const Joi = require('joi');


module.exports = function validation(){

  Joi.objectId = require( 'joi-objectid' )( Joi );

};

