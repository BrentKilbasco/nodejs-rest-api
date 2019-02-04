const express = require( 'express' );

const auth = require( '../routes/auth' );
const cars = require( '../routes/cars' );
const styles = require( '../routes/styles' );
const brands = require( '../routes/brands' );
const rentals = require( '../routes/rentals' );
const returns = require( '../routes/returns' );
const employees = require( '../routes/employees' );
const customers = require( '../routes/customers' );
const errHandler = require( '../middleware/error' );


function routesInit(app){

  const path = '/api/v1';

  app.use( express.json() );


  app.use( path + '/auth', auth );
  app.use( path + '/cars', cars );
  app.use( path + '/styles', styles );
  app.use( path + '/brands', brands );
  app.use( path + '/rentals', rentals );
  app.use( path + '/returns', returns );
  app.use( path + '/employees', employees );
  app.use( path + '/customers', customers );

  // Register the error handler last so we can pass exceptions
  //  to it via next()
  app.use( errHandler );
  


}//END routesInit



module.exports = routesInit;
