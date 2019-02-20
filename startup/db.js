const mongoose = require( 'mongoose' );
const winston = require( 'winston' );
const keys = require( '../config/keys' );


async function db() {

  // Connect to mongoDB
  await mongoose.connect( keys.mongoURI, { useNewUrlParser: true } );
  
  const env = process.env.NODE_ENV;
  if ( env !== 'test' ){ 

    const output = `Connecting to MongoDB: ${env || 'dev'} environment.`;
    console.log( output );
    winston.info( output );

  }//END if

}//END db


module.exports = db;
