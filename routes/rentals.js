const express = require( 'express' );
const mongoose = require( 'mongoose' );
const Fawn = require( 'fawn' );

// Middleware
const validate = require( '../middleware/validate' );
const managerAuth = require( '../middleware/managerAuth' );
const employeeAuth = require( '../middleware/employeeAuth' );
const customerAuth = require( '../middleware/customerAuth' );
const validateObjectId = require( '../middleware/validateObjectId' );

// Data Models
const { Customer } = require( '../models/customer' );
const { Car } = require( '../models/car' );
const { Rental, validate: validateRental } = require( '../models/rental' );


Fawn.init( mongoose );

const router = express.Router();


// GET rentals
//
router.get( '/', customerAuth, async (req, res) => {

  const rentals = await Rental.find().sort( '-dateOut' );
  res.status( 200 ).send( rentals );

});


// GET rentals for customer ID
//
router.get( '/me', customerAuth, async (req, res) => {

  const rentals = await Rental.find({ 'customer._id': req.user._id });
  return res.status( 200 ).send( rentals );

});


// GET rental by ID
//
router.get( '/:id', [employeeAuth, validateObjectId], async (req, res) => {

  const rental = await Rental.findById( req.params.id );
  res.status( 200 ).send( rental );

});


// POST rentals
//  - Create a new rental record
router.post( '/', [customerAuth, validate(validateRental)], async (req, res) => {

  // Find customer
  const customer = await Customer.findById( req.body.customerId );
  if ( !customer )
    return res.status( 400 ).send( 'Invalid customer' );

  // Find car
  const car = await Car.findById( req.body.carId );
  if ( !car )
    return res.status( 400 ).send( 'Invalid car' );

  // Assure there is enough in stock
  if ( car.numberInStock < 1 )
    return res.status( 400 ).send( 'Car not in stock' );

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold,
    },
    car: {
      _id: car._id,
      name: car.name,
      dailyRentalRate: car.dailyRentalRate,
    },
  });

  // Update the db via two-phase commit
  try {

    await new Fawn.Task()
      .save( 'rentals', rental )
      .update( 'cars', { _id: car._id }, {
        $inc: { numberInStock: -1 },
      })
      .run();

    return res.status( 200 ).send( rental );

  } catch (err) {

    return res.status( 500 ).send( 'Woops, something failed. Sorry about that!' );

  }//END try/catch

});


// PUT rentals
//  - Update a rental record by ID
router.put( '/:id', [employeeAuth, validateObjectId], async (req, res) => {

  const newRentalObj = {};

  // Check which data was filled in, and add properties for each
  //  one included
  if ( req.body.customerId ){
    const customer = await Customer.findById( req.body.customerId );
    if ( !customer )
      return res.status( 400 ).send( 'Invalid customer ID' );
    else
      newRentalObj.customer = { 
        _id: customer._id, 
        name: customer.name,
        phone: customer.phone,
      };
  }//END if
 
  if ( req.body.carId ){
    const car = await Car.findById( req.body.carId );
    if ( !car )
      return res.status( 400 ).send( 'Invalid car ID' );
    else
      newRentalObj.car = { 
        _id: car._id, 
        name: car.name,
        dailyRentalRate: car.dailyRentalRate,
      };
  }//END if


  if ( req.body.dateOut ) newRentalObj.dateOut = req.body.dateOut;
  if ( req.body.dateReturned ) newRentalObj.dateReturned = req.body.dateReturned;
  
  if ( req.body.rentalFee !== undefined ) newRentalObj.rentalFee = req.body.rentalFee;

  

  // Find and update
  const rental = await Rental.findByIdAndUpdate( req.params.id, newRentalObj, {
    new: true,
  });
  if ( !rental )
    return res.status( 404 ).send( 'The rental record with the given ID was not found' );

  return res.status( 200 ).send( rental );

});


// DELETE rentals
//
router.delete( '/:id', [managerAuth, validateObjectId], async (req, res) => {

  const rental = await Rental.findByIdAndRemove( req.params.id );
  if ( !rental )
    return res.status( 404 ).send( 'The rental record with the given ID was not found.' );
    
  return res.status( 200 ).send( rental );

});


// Exports
//
module.exports = router;
