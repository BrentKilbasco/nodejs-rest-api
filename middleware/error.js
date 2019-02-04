// This error handler catches errors in the request processing pipeline.
// Ignores everything outside the context of express.

const winston = require( 'winston' );

function errorHandler(err, req, res, next) {

  const logObject = {

    level: err.level, 
    message: err.message, 
    stack: err.stack,

  };

  winston.error( err.message, logObject );

  res.status( 500 ).send( 'Something failed. ' + err.message );

}//END errorHandler


module.exports = errorHandler;

