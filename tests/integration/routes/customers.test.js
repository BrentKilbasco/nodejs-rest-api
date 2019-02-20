require( '../../helpers/testprep' );
const mongoose = require( 'mongoose' );
const request = require( 'supertest' );

require('events').EventEmitter.defaultMaxListeners = 20;

const { Style } = require( '../../../models/style' );
const { Customer } = require( '../../../models/customer' );
const { Employee } = require( '../../../models/employee' );



const endpoint = '/api/v1/customers';
let server = null;

describe( '/api/v1/customers', () => {


  beforeEach( async () => {
    // Open/start server before each test
    server = await require( '../../../startup/startup' ).init();
    await Customer.collection.insertOne({
      name: 'joe bob', 
      email: 'joebob@hotmale.com',
      password: '123456',
      phone: '555-5555',
      isGold: false, 
    });
  });

  afterEach( async () => {
    // Close server after each test
    await Customer.collection.deleteMany();
    await server.close();
    await mongoose.disconnect();
  });


  describe( 'GET /', () => {
    it( 'returns all customers if logged in', async () => {

      const res = await request( server )
        .get( endpoint )
        .set( 'x-auth-token', new Employee().generateAuthToken() );

      expect( res.status ).toBe( 200 );
      expect( res.body.length ).toBe( 1 );
      expect( res.body.some( el => el.name === 'joe bob' ) ).toBeTruthy();
      
    });

    it( 'returns 401 if not logged in as employee', async () => {

      const res = await request( server ).get( endpoint );

      expect( res.status ).toBe( 401 );

    });
  });


  describe( 'GET /me', () => {
    it( 'returns logged in customer data', async () => {

      const newCustomer = {
        name: 'jill jen', 
        email: 'jilljen@hotfemale.com',
        password: '123456',
        phone: '555-5556',
        isGold: false, 
      };

      const res = await request( server )
        .get( endpoint + '/me' )
        .set( 'x-auth-token', new Customer(newCustomer).generateAuthToken() );

      expect( res.status ).toBe( 200 );

    });
    
    it( 'returns 400 if not logged in as customer', async () => {

      const res = await request( server )
        .get( endpoint + '/me' )
        .set( 'x-auth-token', new mongoose.Types.ObjectId() );

      expect( res.status ).toBe( 400 );

    });
  });


  describe( 'POST /', () => {

    let customer = {
      name: 'jill jen', 
      email: 'jilljen@hotfemale.com',
      password: '123456',
      phone: '555-5556',
      isGold: false, 
    };   


    const exec = () => {

      return request( server )
        .post( endpoint )
        .send( customer );

    };


    it( 'creates a new customer entry', async () => {

      const res = await exec();

      expect( res.status ).toBe( 200 );        

    });

    it( 'returns 400 if user already registered', async () => {

      await exec();

      const res = await exec();

      expect( res.status ).toBe( 400 );

    });

    it( 'returns 400 if name not provided', async () => {

      customer.name = undefined;

      const res = await exec();

      expect( res.status ).toBe( 400 );

    });

    it( 'returns 400 if email not provided', async () => {

      customer.email = undefined;

      const res = await exec();

      expect( res.status ).toBe( 400 );

    });

    it( 'returns 400 if password not provided', async () => {

      customer.password = undefined;

      const res = await exec();

      expect( res.status ).toBe( 400 );

    });
  });



});
