const express = require( 'express' );

// Middleware
const validateObjectId = require( '../middleware/validateObjectId' );
const employeeAuth = require( '../middleware/employeeAuth' );
const validate = require( '../middleware/validate' );

// Data Models
const { Brand, validate: validateBrand } = require( '../models/brand' );


const router = express.Router();


// GET brands
//  - Returns list of car brands
//
router.get( '/', async (req, res) => {

  const brands = await Brand.find().sort( 'name' );
  return res.status( 200 ).send( brands );

});


// GET brands: by id
//  - Returns car brand by ID
//
router.get( '/:id', validateObjectId, async (req, res) => {
  
  const brand = await Brand.findById( req.params.id );
  if ( !brand )
    return res.status( 404 ).send( 'The brand with the given ID was not found.' );

  return res.status( 200 ).send( brand );

});


// POST brands
//  - Creates new car brand entry
//
router.post( '/', [employeeAuth, validate(validateBrand)], async (req, res) => {

  // Create new brand entry
  let brand = new Brand({
    name: req.body.name,
    description: req.body.description,
  });
  brand = await brand.save();

  // Send new brand entry back to client
  return res.status( 200 ).send( brand );

});


// PUT brands
//  - Update a car brand entry by ID
//
router.put( '/:id', [employeeAuth, validateObjectId, validate(validateBrand)], async (req, res) => {

  // Update entry
  const brand = await Brand.findByIdAndUpdate( req.params.id, {
    name: req.body.name,
    description: req.body.description,
  }, {
    new: true,
  });
  
  if ( !brand )
    return res.status( 404 ).send( 'The brand with the given ID was not found.' );

  // Send back the updated entry to the client
  return res.status( 200 ).send( brand );

});


// DELETE brands
//  - Deletes a car brand entry by ID
//
router.delete( '/:id', [employeeAuth, validateObjectId], async (req, res) => {

  const brand = await Brand.findByIdAndRemove( req.params.id );
  if ( !brand )
    return res.status( 404 ).send( 'The brand with the given ID was not found.' );

  // Return the deleted entry to the client
  return res.status( 200 ).send( brand );

});


// Exports
//
module.exports = router;
