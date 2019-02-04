require( 'express-async-errors' );
const winston = require( 'winston' );


// Require winston mongoDB integration if not in test env
// if ( process.env.NODE_ENV !== 'test' )
//   require( 'winston-mongodb' );


module.exports = function logging() {

  // Store logs locally
  winston.add( new winston.transports.File({ filename: 'logs/logfile.log' }) );

  // Add mongoDB transport if not in test env
  // if ( process.env.NODE_ENV !== 'test' ){
  //   winston.add( new winston.transports.MongoDB({  
  //     db: keys.mongoURI,
  //     level: 'error',
  //   }) );
  // }//END if  


  // Set uncaught exception handler
  process.on( 'uncaughtException', (ex) => {

    const logObject = {
      level: 'error',
      message: ex.message,
      stack: ex.stack,
    };

    winston.error( ex.message, ex );
    console.log( 'UNCAUGHT EXCEPTION: ', logObject );
    process.exit( 1 );

  });


  // Set unhandled promise rejection
  process.on( 'unhandledRejection', (ex) => {

    throw ex;

  });

};//END logging

