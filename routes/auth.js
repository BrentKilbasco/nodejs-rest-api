const express = require( 'express' );
const bcrypt = require( 'bcrypt' );
const Joi = require( 'joi' );

// Middleware 
const validate = require( '../middleware/validate' );

// Data Models
const { Customer } = require( '../models/customer' );
const { Employee } = require( '../models/employee' );

const router = express.Router();



// POST - log customer user in with provided credentials
//
router.post( '/', validate(validateCustomer), async (req, res) => {

  // Check that user exists
  const user = await Customer.findOne({ email: req.body.email });
  if ( !user )
    return res.status( 400 ).send( 'Invalid [email] or password' );

  // Encrypt and compare user's password
  const validPassword = await bcrypt.compare( req.body.password, user.password );
  if ( !validPassword )
    return res.status( 400 ).send( 'Invalid email or [password]' );

  // Send back a token
  const token = user.generateAuthToken();
  return res.status( 200 ).send({ token });

});//END POST



// POST - log employee user in with provided credentials
//
router.post( '/employee', validate(validateEmployee), async (req, res) => {

  // Check that employee exists
  const employee = await Employee.findOne({ email: req.body.email });
  if ( !employee )
    return res.status( 400 ).send( 'Invalid [email] or password' );

  // Encrypt and compare user's password
  const validPassword = await bcrypt.compare( req.body.password, employee.password );
  if ( !validPassword )
    return res.status( 400 ).send( 'Invalid email or [password]' );

  // Send back a token
  const token = employee.generateAuthToken();
  return res.status( 200 ).send({ token });

});//END POST



// Validate incoming customer login request
//
function validateCustomer(req) {
  const schema = {
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  };

  return Joi.validate( req, schema );
}//END validateCustomer


// Validate incoming employee login request 
//
function validateEmployee(req) {
  const schema = {
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  };

  return Joi.validate( req, schema );
}//END validateEmployee


module.exports = router;
