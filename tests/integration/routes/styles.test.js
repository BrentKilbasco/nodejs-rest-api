require( '../../helpers/testprep' );
const mongoose = require( 'mongoose' );
const request = require( 'supertest' );

const { Style } = require( '../../../models/style' );
const { Employee } = require( '../../../models/employee' );


const endpoint = '/api/v1/styles';

let server = null;
let style1 = null;
let style2 = null;

describe( '/api/v1/styles', () => {


  beforeEach( async () => {
    
    // Start server before each test
    server = require( '../../../index' );
    
    style1 = await new Style({
      name: 'style1', 
      description: 'desc1',
    }).save();

    style2 = await new Style({
      name: 'style2', 
      description: 'desc2',
    }).save();
    
  });//END beforeEach


  afterEach( async () => {

    // Close server after each test
    await Style.collection.deleteMany();
    await server.close();
  
  });//END afterEach


  describe( 'GET /', () => {
    it( 'returns all styles', async () => {
      
      const res = await request( server ).get( endpoint );

      expect( res.status ).toBe( 200 );
      expect( res.body.length ).toBe( 2 );
      expect( res.body.some( el => el.name === 'style1' ) ).toBeTruthy();
      
    });
  });


  describe( 'GET /:id', () => {
    it( 'returns a style by the given ID', async () => {

      const res = await request( server ).get( endpoint + '/' + style1._id );

      expect( res.status ).toBe( 200 );
      expect( res.body ).toHaveProperty( 'name', style1.name );
      expect( res.body._id.toString() ).toEqual( style1._id.toString() );

    });

    it( 'returns a 404 error if style with given ID was not found', async () => {

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
    const exec = async (style, token) => {
      return request( server )
        .post( endpoint )
        .set( 'x-auth-token', token )
        .send({ name: style, description: 'desc1' });
    };


    it( 'returns 401 if not logged in', async () => {
      // Send valid name but invalid token
      const res = await exec( 'style', '' );

      expect( res.status ).toBe( 401 );
    });

    it( 'returns 400 if style is less than 2 characters', async () => {
      // Send valid token and a style name with less than 2 chars
      const res = await exec( 'b', new Employee().generateAuthToken() );

      expect( res.status ).toBe( 400 );
    });

    it( 'returns 400 if style is more than 255 characters', async () => {
      // Send valid token and a style name more than 255 chars
      const styleName = new Array( 260 ).join( 'b' );
      const res = await exec( styleName, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 400 );
    });

    it( 'saves the style if it is valid', async () => {
      const styleName = 'style0';
      // Send valid name and valid token
      const res = await exec( styleName, new Employee().generateAuthToken() );
      const style = await Style.find({ name: styleName });

      expect( res.status ).toBe( 200 );
      expect( style ).not.toBeNull();
    });

    it( 'returns the new style if it is valid', async () => {
      const styleName = 'style0';
      // Send valid name and valid token
      const res = await exec( styleName, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 200 );
      expect( res.body ).toHaveProperty( '_id' );
      expect( res.body ).toHaveProperty( 'name', styleName );
    });

  });


  describe( 'PUT /:id', () => {

    const exec = async (styleId, token) => {

      const updateStyle = {
        name: 'style2.1',
        description: 'desc2.1',
      }; 

      return request( server )
        .put( endpoint + '/' + styleId )
        .set( 'x-auth-token', token )
        .send( updateStyle );

    };//END exec

    it( 'updates the style with the given id', async () => {

      const res = await exec( style1._id, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 200 );
      expect( res.body ).toHaveProperty( 'name', 'style2.1' );

    });

    it( 'returns 404 if style with given id was not found', async () => {

      const id = new mongoose.Types.ObjectId();
      const res = await exec( id, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 404 );

    });
  });


  describe( 'DELETE /:id', () => {

    const exec = async (styleId, token) => {

      return request( server )
        .delete( endpoint + '/' + styleId )
        .set( 'x-auth-token', token )
        .send();

    };//END exec    


    it( 'deletes the style entry with the given id from the db', async () => {

      const id = style1._id;
      const res = await exec( id, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 200 );

    });

    it( 'returns 404 if the style was not found', async () => {

      const id = new mongoose.Types.ObjectId();
      const res = await exec( id, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 404 );

    });

  });

});
