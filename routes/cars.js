const express = require( 'express' );

// Middleware
const validateObjectId = require( '../middleware/validateObjectId' );
const employeeAuth = require( '../middleware/employeeAuth' );
const validate = require( '../middleware/validate' );

// Data Models
const { Car, validate: validateCar } = require( '../models/car' );
const { Style } = require( '../models/style' );
const { Brand } = require( '../models/brand' );


const router = express.Router();



// GET cars
//  - Returns full list of cars
//
router.get( '/', async (req, res) => {

  const cars = await Car.find().sort( 'name' );
  res.status( 200 ).send( cars );

});//END GET



// GET cars
//  - Returns car entry specified by ID
//
router.get( '/:id', validateObjectId, async (req, res) => {

  const car = await Car.findById( req.params.id );
  if (!car )
    return res.status( 404 ).send( 'The car with the given ID was not found.' );

  // Return car obj
  return res.status( 200 ).send( car );

});//END GET



// POST cars
//  - Create new car entry
//
router.post( '/', [employeeAuth, validate(validateCar)], async (req, res) => {

  // Find the style
  const style = await Style.findById( req.body.styleId );
  if ( !style )
    return res.status( 400 ).send( 'Invalid style' );

  // Find the brand
  const brand = await Brand.findById( req.body.brandId );
  if ( !brand )
    return res.status( 400 ).send( 'Invalid brand' );

  // Create the entry
  let car = new Car({
    name: req.body.name,
    description: req.body.description,
    style: {
      _id: style._id,
      name: style.name,
    },
    brand: {
      _id: brand._id,
      name: brand.name,
    },    
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  car = await car.save();

  // Return new car entry to client
  return res.status( 200 ).send( car );

});//END POST



// PUT cars
//  - Updates a car entry specified by ID
//
router.put( '/:id', [employeeAuth, validateObjectId], async (req, res) => {

  const newCarObj = {};

  // Check which data was filled in, and add properties for each
  //  one included
  if ( req.body.name ) newCarObj.name = req.body.name;
  if ( req.body.description ) newCarObj.description = req.body.description;    
  if ( req.body.numberInStock ) newCarObj.numberInStock = req.body.numberInStock;
  if ( req.body.dailyRentalRate ) newCarObj.dailyRentalRate = req.body.dailyRentalRate;
  
  // Look for the style ID
  if ( req.body.styleId ){
    const style = await Style.findById( req.body.styleId );
    if ( !style )
      return res.status( 400 ).send( 'Invalid style ID' );
    else
      newCarObj.style = { _id: style._id, name: style.name };
  }//END if

  // Look for the brand ID
  if ( req.body.brandId ){
    const brand = await Brand.findById( req.body.brandId );
    if ( !brand )
      return res.status( 400 ).send( 'Invalid brand ID' );
    else
      newCarObj.brand = { _id: brand._id, name: brand.name };
  }//END if

  // Find and update
  const car = await Car.findByIdAndUpdate( req.params.id, newCarObj, {
    new: true, // Specify we want the new record returned
  });

  if ( !car )
    return res.status( 404 ).send( 'The car with the given ID was not found.' );

  // Return new car object to client
  return res.status( 200 ).send( car );

});//END PUT



// DELETE cars
//  - Deletes a car entry specified by ID
//
router.delete( '/:id', [employeeAuth, validateObjectId], async (req, res) => {

  const car = await Car.findByIdAndRemove( req.params.id );
  if ( !car )
    return res.status( 404 ).send( 'The car with the given ID was not found.' );

  // Return the deleted record
  return res.status( 200 ).send( car );

});//END DELETE



module.exports = router;

