require( '../../helpers/testprep' );
const mongoose = require( 'mongoose' );
const request = require( 'supertest' );
const jwt = require( 'jsonwebtoken' );

const validateObjectId = require( '../../../middleware/validateObjectId' );
const { Customer } = require( '../../../models/customer' );
const { Employee } = require( '../../../models/employee' );



const endpoint = '/api/v1/auth';
let server = null;




describe( endpoint, () => {


  describe( 'POST /', () => {

    let customer = null;
    let customerName = 'joe bob';
    let customerEmail = 'joebob@hotmale.com';
    let customerPassword = '123456';

    beforeEach( async () => {

      // Start server before each test
      server = require( '../../../index' );

      customer = {
        name: customerName, 
        email: customerEmail,
        password: customerPassword,
        phone: '555-5555',
        isGold: false, 
      };

      const res = await request( server )
        .post( '/api/v1/customers' )
        .send( customer );

      expect( res.status ).toBe( 200 );

    });//END beforeEach
  
    afterEach( async () => {
      // Close server after each test
      await Customer.collection.deleteMany();
      await server.close();
    });//END afterEach


    const exec = () => {
      return request( server )
        .post( endpoint )
        .send( {
          email: customerEmail, 
          password: customerPassword,
        });
    };


    it( 'returns 200 if crendentials are valid', async () => {

      const res = await exec();

      expect( res.status ).toBe( 200 );

    });

    it( 'returns valid JSON web token if credentials are valid', async () => {

      const res = await exec();

      expect( res.status ).toBe( 200 );
      expect( res.body ).toHaveProperty( 'token' );

    });

    it( 'returns 400 if email is invalid', async () => {

      customerEmail = 'boondock@saints.com';

      const res = await exec();

      expect( res.status ).toBe( 400 );

    });

    it( 'returns 400 if password is invalid', async () => {

      customerPassword = 'invalidationizational';

      const res = await exec();

      expect( res.status ).toBe( 400 );

    });

  });



  describe( 'POST /employee', () => {

    let employee = null;
    let employeeName = 'jan jen';
    let employeeEmail = 'janje@hotfemale.com';
    let employeePassword = '123456';

    const manager = {
      name: 'toot', 
      email: 'toot@tootsville.com',
      password: 'tootsalot',
      isAdmin: true, 
    };


    beforeEach( async () => {

      // Start server before each test
      server = require( '../../../index' );

      employee = {
        name: employeeName, 
        email: employeeEmail,
        password: employeePassword,
        isAdmin: false, 
      };

      const res = await request( server )
        .post( '/api/v1/employees' )
        .send( employee );

      expect( res.status ).toBe( 200 );

    });//END beforeEach
  
    afterEach( async () => {
      // Close server after each test
      await Employee.collection.deleteMany();
      await server.close();
    });//END afterEach


    const exec = () => {

      return request( server )
        .post( endpoint + '/employee' )
        .send( {
          email: employeeEmail, 
          password: employeePassword,
        });

    };//END exec


    it( 'returns 200 if crendentials are valid', async () => {

      const res = await exec();

      expect( res.status ).toBe( 200 );

    });

    it( 'returns valid JSON web token if credentials are valid', async () => {

      const res = await exec();

      expect( res.status ).toBe( 200 );
      expect( res.body ).toHaveProperty( 'token' );

    });

    it( 'returns 400 if email is invalid', async () => {

      employeeEmail = 'boondock@saints.com';

      const res = await exec();

      expect( res.status ).toBe( 400 );

    });

    it( 'returns 400 if password is invalid', async () => {

      employeePassword = 'invalidationization';

      const res = await exec();

      expect( res.status ).toBe( 400 );

    });

  });

});

