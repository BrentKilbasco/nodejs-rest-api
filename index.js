const express = require( 'express' );
const winston = require( 'winston' );


// Startup requires
const dbInit = require( './startup/db' );
const routesInit = require( './startup/routes' );
const loggingInit = require( './startup/logging' );
const validationInit = require( './startup/validation' );


const app = express();

// Startup init
loggingInit();
routesInit( app );
dbInit();
validationInit();



// Start listening...
//
const port = process.env.PORT || 3000;
const server = app.listen( port, () => {

  const output = `Listening on port ${port} in ${process.env.NODE_ENV || 'dev'} environment...`;
  winston.info( output );
  console.log( output );

});

module.exports = server;
