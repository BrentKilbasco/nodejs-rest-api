require( '../../helpers/testprep' );
const request = require( 'supertest' );

const { Customer } = require( '../../../models/customer' );



let server = null;



describe( 'customer auth middleware - integration', () => {


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
      .get( '/api/v1/rentals' )
      .set( 'x-auth-token', token )
      .send({ });
  };


  // Intended/Happy path
  it( 'returns 200 if valid token provided', async () => {

    const res = await exec( new Customer().generateAuthToken() );

    expect( res.status ).toBe( 200 );

  });

  // Error path
  it( 'returns 401 if token not provided', async () => {

    const res = await exec( '' );

    expect( res.status ).toBe( 401 );

  });

  // Error path
  it( 'returns 400 if token invalid', async () => {

    const res = await exec( '12234567890' );

    expect( res.status ).toBe( 400 );

  });


});

