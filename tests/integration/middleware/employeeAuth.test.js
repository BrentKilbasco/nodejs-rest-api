require( '../../helpers/testprep' );
const request = require( 'supertest' );

const { Employee } = require( '../../../models/employee' );
const { Customer } = require( '../../../models/customer' );



let server = null;



describe( 'employee auth middleware - integration', () => {


  beforeEach( () => { 
    // Open/start server before each test
    server = require( '../../../index' );
  });

  afterEach( async () => { 
    // Close server after each test
    await server.close();
  });


  const exec = (token) => {
    return request( server )
      .get( '/api/v1/customers' )
      .set( 'x-auth-token', token )
      .send({ });
  };


  // Intended/Happy path
  it( 'returns 200 if valid token provided', async () => {

    const res = await exec( new Employee().generateAuthToken() );

    expect( res.status ).toBe( 200 );

  });

  // 400 - not employee
  it( 'returns 400 if token not authorized for employee', async () => {

    const res = await exec( new Customer().generateAuthToken() );

    expect( res.status ).toBe( 400 );

  });
  
  // 400 - token is empty string
  it( 'returns 401 if token not provided', async () => {

    const res = await exec( '' );

    expect( res.status ).toBe( 401 );

  });

  // 400 - token in invalid format
  it( 'returns 400 if token invalid', async () => {

    const res = await exec( '12234567890' );

    expect( res.status ).toBe( 400 );

  });


});

