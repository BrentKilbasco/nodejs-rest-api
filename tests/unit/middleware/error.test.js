require( '../../helpers/testprep' );

const errHandler = require( '../../../middleware/error' );

let server = null;


describe( 'error middleware - unit', () => {


  beforeEach( () => { 
    // Open/start server before each test
    server = require( '../../../index' );
  });

  afterEach( async () => { 
    // Close server after each test
    await server.close();
  });




  it( 'returns 500 if error occurs', async () => {

    // Create error object
    const err = {
      level: 'test error level',
      message: 'test error message',
      stack: 'test error stack',
    };

    const res = {
      status: jest.fn().mockReturnValue({ send: jest.fn() }),
    };

    const next = jest.fn();

    errHandler( err, {}, res, next );

    expect( next ).not.toHaveBeenCalled();
    expect( res.status ).toHaveBeenCalled();

  });


});
