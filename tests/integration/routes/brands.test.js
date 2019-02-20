require( '../../helpers/testprep' );
const mongoose = require( 'mongoose' );
const request = require( 'supertest' );

require('events').EventEmitter.defaultMaxListeners = 20;


const { Brand } = require( '../../../models/brand' );
const { Employee } = require( '../../../models/employee' );


const endpoint = '/api/v1/brands';

let server = null;
let brand1 = null;
let brand2 = null;

describe( '/api/v1/brands', () => {


  beforeEach( async () => {
    
    // Open/start server before each test
    server = await require( '../../../startup/startup' ).init();
    
    brand1 = await new Brand({
      name: 'brand1', 
      description: 'desc1',
    }).save();

    brand2 = await new Brand({
      name: 'brand2', 
      description: 'desc2',
    }).save();
    
  });//END beforeEach


  afterEach( async () => {

    // Close server after each test
    await Brand.collection.deleteMany();
    await server.close();
    await mongoose.disconnect();
  
  });//END afterEach


  describe( 'GET /', () => {
    it( 'returns all brands', async () => {
      
      const res = await request( server ).get( endpoint );

      expect( res.status ).toBe( 200 );
      expect( res.body.length ).toBe( 2 );
      expect( res.body.some( el => el.name === 'brand1' ) ).toBeTruthy();
      
    });
  });


  describe( 'GET /:id', () => {
    it( 'returns a brand by the given ID', async () => {

      const res = await request( server ).get( endpoint + '/' + brand1._id );

      expect( res.status ).toBe( 200 );
      expect( res.body ).toHaveProperty( 'name', brand1.name );
      expect( res.body._id.toString() ).toEqual( brand1._id.toString() );

    });

    it( 'returns a 404 error if brand with given ID was not found', async () => {

      const invalidId = new mongoose.Types.ObjectId();
      const res = await request( server ).get( endpoint + '/' + invalidId );

      expect( res.status ).toBe( 404 );

    });

    it( 'returns a 400 error if ID is not a valid objectId', async () => {

      const invalidId = '1234567890';
      const res = await request( server ).get( endpoint + '/' + invalidId );

      expect( res.status ).toBe( 400 );

    });
  });


  describe( 'POST /', () => {
    
    // Helper execution function
    const exec = async (brand, token) => {
      return request( server )
        .post( endpoint )
        .set( 'x-auth-token', token )
        .send({ name: brand, description: 'desc1' });
    };


    it( 'returns 401 if not logged in', async () => {
      // Send valid name but invalid token
      const res = await exec( 'brand', '' );

      expect( res.status ).toBe( 401 );
    });

    it( 'returns 400 if brand is less than 2 characters', async () => {
      // Send valid token and a brand name with less than 2 chars
      const res = await exec( 'b', new Employee().generateAuthToken() );

      expect( res.status ).toBe( 400 );
    });

    it( 'returns 400 if brand is more than 255 characters', async () => {
      // Send valid token and a brand name more than 255 chars
      const brandName = new Array( 260 ).join( 'b' );
      const res = await exec( brandName, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 400 );
    });

    it( 'saves the brand if it is valid', async () => {
      const brandName = 'brand0';
      // Send valid name and valid token
      const res = await exec( brandName, new Employee().generateAuthToken() );
      const brand = await Brand.find({ name: brandName });

      expect( res.status ).toBe( 200 );
      expect( brand ).not.toBeNull();
    });

    it( 'returns the new brand if it is valid', async () => {
      const brandName = 'brand0';
      // Send valid name and valid token
      const res = await exec( brandName, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 200 );
      expect( res.body ).toHaveProperty( '_id' );
      expect( res.body ).toHaveProperty( 'name', brandName );
    });

  });


  describe( 'PUT /:id', () => {

    const exec = async (brandId, token) => {

      const updateBrand = {
        name: 'brand2.1',
        description: 'desc2.1',
      }; 

      return request( server )
        .put( endpoint + '/' + brandId )
        .set( 'x-auth-token', token )
        .send( updateBrand );

    };//END exec

    it( 'updates the brand with the given id', async () => {

      const res = await exec( brand1._id, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 200 );
      expect( res.body ).toHaveProperty( 'name', 'brand2.1' );

    });

    it( 'returns 404 if brand with given id was not found', async () => {

      const id = new mongoose.Types.ObjectId();
      const res = await exec( id, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 404 );

    });
  });


  describe( 'DELETE /:id', () => {

    const exec = async (brandId, token) => {

      return request( server )
        .delete( endpoint + '/' + brandId )
        .set( 'x-auth-token', token )
        .send();

    };//END exec    


    it( 'deletes the brand entry with the given id from the db', async () => {

      const id = brand1._id;
      const res = await exec( id, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 200 );

    });

    it( 'returns 404 if the brand was not found', async () => {

      const id = new mongoose.Types.ObjectId();
      const res = await exec( id, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 404 );

    });

  });

});
