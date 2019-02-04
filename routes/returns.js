const express = require( 'express' );
const Joi = require( 'joi' );

// Middleware
const employeeAuth = require( '../middleware/employeeAuth' );
const validate = require( '../middleware/validate' );

// Data Models
const { Rental } = require( '../models/rental' );
const { Car } = require( '../models/car' );


const router = express.Router();


// POST return
//  - Process a rental record
router.post( '/', [employeeAuth, validate(validateReturn)], async (req, res) => {

  const { customerId, carId } = req.body;

  // Search for specified rental
  let rental = await Rental.lookup( customerId, carId );
  if ( !rental )
    return res.status( 404 ).send( 'Rental record was not found' );

  // If the return date has already been set, return 400
  if ( rental.dateReturned )
    return res.status( 400 ).send( 'Rental already processed' );

  // Set date returned and process rental fee
  rental.return();
  rental = await rental.save();

  // Increase the stock
  await Car.update({ _id: rental.car._id }, {
    $inc: { numberInStock: 1 },
  });

  // Return the return object to the client
  return res.status( 200 ).send( rental );

});//END POST return


// validateReturn()
//  - validate incoming request data
function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    carId: Joi.objectId().required(),
  };

  return Joi.validate( req, schema );
}//END validateReturn


// Exports
//
module.exports = router;
