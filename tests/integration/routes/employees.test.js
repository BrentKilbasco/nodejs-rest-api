require( '../../helpers/testprep' );
const mongoose = require( 'mongoose' );
const request = require( 'supertest' );


const { Customer } = require( '../../../models/customer' );
const { Employee } = require( '../../../models/employee' );



const endpoint = '/api/v1/employees';
let server = null;

describe( '/api/v1/employees', () => {

  let employee = {
    name: 'jill jen', 
    email: 'jilljen@hotfemale.com',
    password: '123456',
    isAdmin: false, 
  };   

  let manager = {
    name: 'john jen', 
    email: 'john@hotfemale.com',
    password: '123456',
    isAdmin: true,
  };


  beforeEach( async () => {
    // Start server before each test
    server = require( '../../../index' );
    await Employee.collection.insertOne({
      name: 'megan gert', 
      email: 'meg@hotmale.com',
      password: '123456',
      phone: '553-5555',
      isAdmin: false,
    });
  });

  afterEach( async () => {
    // Close server after each test
    await Employee.collection.deleteMany();
    await server.close();
  });


  describe( 'GET /', () => {
    it( 'returns all employees if logged in as manager/admin', async () => {

      const res = await request( server )
        .get( endpoint )
        .set( 'x-auth-token', new Employee(manager).generateAuthToken() );

      expect( res.status ).toBe( 200 );
      expect( res.body.length ).toBe( 1 );
      expect( res.body.some( el => el.name === 'megan gert' ) ).toBeTruthy();
      
    });

    it( 'returns 401 if not logged in as employee', async () => {

      const res = await request( server ).get( endpoint );

      expect( res.status ).toBe( 401 );

    });
  });


  describe( 'GET /me', () => {
    it( 'returns logged in employee data', async () => {

      const res = await request( server )
        .get( endpoint + '/me' )
        .set( 'x-auth-token', new Employee(employee).generateAuthToken() );

      expect( res.status ).toBe( 200 );

    });
    
    it( 'returns 400 if not logged in as employee', async () => {

      const res = await request( server )
        .get( endpoint + '/me' )
        .set( 'x-auth-token', new mongoose.Types.ObjectId() );

      expect( res.status ).toBe( 400 );

    });
  });


  describe( 'POST /', () => {

    const exec = async () => {
      return request( server )
        .post( endpoint )
        .set( 'x-auth-token', new Employee( manager ).generateAuthToken() )
        .send( employee );
    };


    it( 'creates a new employee entry if logged in as manager/admin', async () => {

      const res = await exec();
      expect( res.status ).toBe( 200 );        

    });

    it( 'returns 400 if employee already registered', async () => {

      await exec();

      const res = await exec();
      expect( res.status ).toBe( 400 );

    });

    it( 'returns 400 if name not provided', async () => {

      employee.name = undefined;

      const res = await exec();
      expect( res.status ).toBe( 400 );

    });

    it( 'returns 400 if email not provided', async () => {

      employee.email = undefined;

      const res = await exec();
      expect( res.status ).toBe( 400 );

    });

    it( 'returns 400 if password not provided', async () => {

      employee.password = undefined;

      const res = await exec();
      expect( res.status ).toBe( 400 );

    });
  });

});
