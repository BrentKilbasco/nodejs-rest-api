const express = require( 'express' );
const lodash = require( 'lodash' );
const bcrypt = require( 'bcrypt' );

// Middleware
const customerAuth = require( '../middleware/customerAuth' );
const employeeAuth = require( '../middleware/employeeAuth' );

// Data Models
const { Customer, validate } = require( '../models/customer' );


const router = express.Router();


// GET customer users
//
router.get( '/', employeeAuth, async (req, res) => {

  const users = await Customer.find().sort( '-name' );
  res.status( 200 ).send( users );

});//END GET


// GET current customer user
//
router.get( '/me', customerAuth, async (req, res) => {

  const thisUser = await Customer.findById( req.user._id ).select( '-password' );
  res.status( 200 ).send( thisUser );

});//END GET


// POST - create new customer user
//
router.post( '/', async (req, res) => {

  // Validate incoming request
  const { error } = validate( req.body );
  if ( error )
    return res.status( 400 ).send( error.details[0].message );
  
  // Check if customer already exists
  const existingCustomer = await Customer.findOne({ email: req.body.email });
  if ( existingCustomer )
    return res.status( 400 ).send( 'User already registered' );

  // Create customer entry
  let customer = new Customer( lodash.pick( req.body, ['name', 'email', 'password', 'phone', 'isGold'] ) );

  // Encrypt password
  const salt = await bcrypt.genSalt( 10 );
  customer.password = await bcrypt.hash( customer.password, salt );

  customer = await customer.save();

  // Send back a token in the header, and user data in body, but omit the password
  const token = customer.generateAuthToken();
  const resBody = lodash.pick( customer, ['_id', 'name', 'email', 'phone', 'isGold'] );
  
  return res.header( 'x-auth-token', token ).send( resBody );

});


// Exports 
//
module.exports = router;
