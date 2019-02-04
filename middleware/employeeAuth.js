const jwt = require( 'jsonwebtoken' );
const keys = require( '../config/keys' );



function employeeAuth(req, res, next){

  // Extract the json web token
  const token = req.header( 'x-auth-token' );
  if ( !token )
    return res.status( 401 ).send( 'Access denied. No token provided.' );

  // Decode the json web token
  try {

    const decoded = jwt.verify( token, keys.jwtPrivateKey );

    if ( decoded.userType !== 'employee' )
      return res.status( 400 ).send( 'Invalid employee token' );

    req.user = decoded;

    return next();

  } catch (err ){

    return res.status( 400 ).send( 'Invalid token' );

  }//END try/catch

}//END employeeAuth


module.exports = employeeAuth;
