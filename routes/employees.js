const express = require( 'express' );
const lodash = require( 'lodash' );
const bcrypt = require( 'bcrypt' );

// Middleware
const employeeAuth = require( '../middleware/employeeAuth' );
const managerAuth = require( '../middleware/managerAuth' );

// Data Models
const { Employee, validate } = require( '../models/employee' );


const router = express.Router();




// GET employee users
//
router.get( '/', managerAuth, async (req, res) => {

  const employees = await Employee.find().sort( 'name' );
  res.status( 200 ).send( employees );

});//END GET


// GET current employee user
//
router.get( '/me', employeeAuth, async (req, res) => {

  const thisEmployee = await Employee.findById( req.user._id ).select( '-password' );
  res.status( 200 ).send( thisEmployee );

});//END GET


// POST - create new employee user
//
router.post( '/', async (req, res) => {

  // Validate incoming request
  const { error } = validate( req.body );
  if ( error )
    return res.status( 400 ).send( error.details[0].message );
  
  // Check if user already exists
  const existingUser = await Employee.findOne({ email: req.body.email });
  if ( existingUser )
    return res.status( 400 ).send( 'User already registered' );

  // Create new entry
  let employee = new Employee( lodash.pick( req.body, ['name', 'email', 'password', 'isAdmin'] ) );

  // Encrypt the user's password
  const salt = await bcrypt.genSalt( 10 );
  employee.password = await bcrypt.hash( employee.password, salt );

  employee = await employee.save();

  // Create token and send back data
  const token = employee.generateAuthToken();
  const resBody = lodash.pick( employee, ['_id', 'name', 'email', 'isAdmin'] );
  return res.header( 'x-auth-token', token ).send( resBody );

});

// Exports 
//
module.exports = router;
