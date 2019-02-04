const express = require( 'express' );

// Middleware
const validateObjectId = require( '../middleware/validateObjectId' );
const employeeAuth = require( '../middleware/employeeAuth' );
const validate = require( '../middleware/validate' );

// Data Models
const { Style, validate: validateStyle } = require( '../models/style' );


const router = express.Router();


// GET styles
//  - Returns list of car styles
//
router.get( '/', async (req, res) => {

  const styles = await Style.find().sort( 'name' );
  return res.status( 200 ).send( styles );

});


// GET styles: by id
//  - Returns car style by ID
//
router.get( '/:id', validateObjectId, async (req, res) => {
  
  const style = await Style.findById( req.params.id );
  if ( !style )
    return res.status( 404 ).send( 'The style with the given ID was not found.' );

  return res.status( 200 ).send( style );

});


// POST styles
//  - Creates new car style entry
//
router.post( '/', [employeeAuth, validate(validateStyle)], async (req, res) => {

  // Create new style entry
  let style = new Style({
    name: req.body.name,
    description: req.body.description,
  });
  style = await style.save();

  // Send new style entry back to client
  return res.status( 200 ).send( style );

});


// PUT styles
//  - Update a car style entry by ID
//
router.put( '/:id', [employeeAuth, validateObjectId, validate(validateStyle)], async (req, res) => {

  // Update entry
  const style = await Style.findByIdAndUpdate( req.params.id, {
    name: req.body.name,
    description: req.body.description,
  }, {
    new: true,
  });
  
  if ( !style )
    return res.status( 404 ).send( 'The style with the given ID was not found.' );

  // Send back the updated entry to the client
  return res.status( 200 ).send( style );
  
});


// DELETE styles
//  - Deletes a car style entry by ID
//
router.delete( '/:id', [employeeAuth, validateObjectId], async (req, res) => {

  const style = await Style.findByIdAndRemove( req.params.id );
  if ( !style )
    return res.status( 404 ).send( 'The style with the given ID was not found.' );

  // Return the deleted entry to the client
  return res.status( 200 ).send( style );

});


// Exports
//
module.exports = router;
