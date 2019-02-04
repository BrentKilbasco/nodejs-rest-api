
// Check the current environment
if ( process.env.NODE_ENV === 'production' ){

  // We are in production
  module.exports = require( './prodEnv' );
  
} else if ( process.env.NODE_ENV === 'test' ){

  // We are in test
  module.exports = require( './testEnv' );

} else {

  // We are in development
  module.exports = require( './devEnv' );

}//END if/else



