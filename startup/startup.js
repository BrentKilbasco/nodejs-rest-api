const express = require( 'express' );
const winston = require( 'winston' );


// Startup requires
const dbInit = require( './db' );
const routesInit = require( './routes' );
const loggingInit = require( './logging' );
const validationInit = require( './validation' );


const init = async () => {

  const app = express();

  // Startup init
  loggingInit();
  routesInit( app );
  await dbInit();
  validationInit();


  // Start listening...
  //
  const port = process.env.PORT || 3000;
  const server = app.listen( port, () => {

    const env = process.env.NODE_ENV;    
    if ( env !== 'test' ) {

      const output = `Listening on port ${port} in ${env || 'dev'} environment...`;
      winston.info( output );
      console.log( output );

    }//END if

  });

  return server;

};//END init


module.exports = {
  init,
};
