require( '../../helpers/testprep' );
const request = require( 'supertest' );
const mongoose = require( 'mongoose' );

const { Employee } = require( '../../../models/employee' );
const { Customer } = require( '../../../models/customer' );



const endpoint = '/api/v1/employees';
let server = null;



describe( 'manager/admin employee auth middleware - integration', () => {


  beforeEach( async () => { 
    // Open/start server before each test
    server = await require( '../../../startup/startup' ).init();
  });

  afterEach( async () => { 
    // Close server after each test
    await server.close();
    await mongoose.disconnect();
  });


  const exec = (token) => {
    return request( server )
      .get( endpoint )
      .set( 'x-auth-token', token )
      .send({ });
  };


  // Intended/Happy path
  it( 'returns 200 if valid token provided', async () => {

    let managerEmployee = new Employee();
    managerEmployee.isAdmin = true;

    const res = await exec( managerEmployee.generateAuthToken() );

    expect( res.status ).toBe( 200 );

  });

  // 400 - not manager
  it( 'returns 400 if token not authorized for manager', async () => {

    const res = await exec( new Employee().generateAuthToken() );

    expect( res.status ).toBe( 400 );

  });

  // 400 - not employee
  it( 'returns 400 if token not authorized for employee', async () => {

    const res = await exec( new Customer().generateAuthToken() );

    expect( res.status ).toBe( 400 );

  });

  // 401 - token is empty string
  it( 'returns 401 if token not provided', async () => {

    const res = await exec( '' );

    expect( res.status ).toBe( 401 );

  });

  // 400 - token invalid format
  it( 'returns 400 if token invalid', async () => {

    const res = await exec( '12234567890' );

    expect( res.status ).toBe( 400 );

  });

});

