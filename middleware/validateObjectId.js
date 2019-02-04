const mongoose = require( 'mongoose' );


function validateObjectId(req, res, next) {

  if ( !mongoose.Types.ObjectId.isValid( req.params.id ) )
    return res.status( 400 ).send( 'Invalid Object ID' );

  else
    return next();

}//END validateObjectId


module.exports = validateObjectId;
