const mongoose = require( 'mongoose' );
const winston = require( 'winston' );
const keys = require( '../config/keys' );


function db(){

  // Connect to mongoDB
  mongoose.connect( keys.mongoURI, { useNewUrlParser: true } )
    .then( () => {

      const output = `Connecting to MongoDB: ${process.env.NODE_ENV || 'dev'} environment.`;
      console.log( output );
      winston.info( output );

    });//END then

}//END db


module.exports = db;
