require( '../../helpers/testprep' );
const mongoose = require( 'mongoose' );
const request = require( 'supertest' );

const { Car } = require( '../../../models/car' );
const { Style } = require( '../../../models/style' );
const { Brand } = require( '../../../models/brand' );
const { Customer } = require( '../../../models/customer' );
const { Employee } = require( '../../../models/employee' );



const endpoint = '/api/v1/cars';
let server = null;

describe( endpoint, () => {

  let newBrand;
  let newStyle;
  let newCar;


  beforeEach( async () => {
    // Start server before each test
    server = require( '../../../index' );

    // Create a brand
    //
    newBrand = await new Brand({
      name: 'brand1',
      description: 'the brand name 1',
    }).save();

    // Create a style
    //
    newStyle = await new Style({
      name: 'style1',
      description: 'the style 1',
    }).save();

    // Create a car
    //
    newCar = await new Car({
      name: 'dynomight',
      description: 'a strong baby',
      brand: {
        _id: newBrand._id,
        name: newBrand.name,
      },
      style: {
        _id: newStyle._id,
        name: newStyle.name,
      },
      numberInStock: 10,
      dailyRentalRate: 90,
    }).save();

  });

  afterEach( async () => {
    // Clean up the db
    await Style.collection.deleteMany();
    await Brand.collection.deleteMany();
    await Car.collection.deleteMany();
    // Close server after each test
    await server.close();
  });


  describe( 'GET /', () => {
    it( 'returns all cars', async () => {

      const res = await request( server ).get( endpoint );

      expect( res.status ).toBe( 200 );
      expect( res.body.length ).toBe( 1 );
      expect( res.body.some( el => el.name === 'dynomight' ) ).toBeTruthy();      

    });
  });


  describe( 'GET /:id', () => {
    it( 'returns car by id if valid car id', async () => {

      const res = await request( server ).get( `${endpoint}/${newCar._id}` );

      expect( res.status ).toBe( 200 );

    });

    it( 'returns 404 if car was not found', async () => {

      const invalidId = new mongoose.Types.ObjectId();
      const res = await request( server ).get( `${endpoint}/${invalidId}` );

      expect( res.status ).toBe( 404 );

    });
  });  


  describe( 'POST /', () => {

    // Create a car
    //
    const getPostCar = () => {
      return {
        name: 'dynomight',
        description: 'powerful and mighty vehicle',
        brandId: newBrand._id.toString(),
        styleId: newStyle._id.toString(),
        numberInStock: 10,
        dailyRentalRate: 90,
      };
    };


    const exec = (postCar, token) => {
      return request( server )
        .post( endpoint )
        .set( 'x-auth-token', token )
        .send( postCar );
    };


          
    it( 'creates new car entry if logged in as employee', async () => {

      const res = await exec( getPostCar(), new Employee().generateAuthToken() );

      expect( res.status ).toBe( 200 );

    });

    it( 'returns 400 if brand with given ID was not found', async () => {

      const postCar = getPostCar();
      postCar.brandId = new mongoose.Types.ObjectId();

      const res = await exec( postCar, new Employee().generateAuthToken() );
      
      expect( res.status ).toBe( 400 );

    });

    it( 'returns 400 if style with given ID was not found', async () => {

      const postCar = getPostCar();
      postCar.styleId = new mongoose.Types.ObjectId();

      const res = await exec( postCar, new Employee().generateAuthToken() );
      
      expect( res.status ).toBe( 400 );

    });



  });


  describe( 'PUT /:id', () => {

    const getUpdateCarId = () => {
      return newCar._id;  
    };

    // Create a car
    //
    const getPutCar = () => {
      return {
        name: 'dynomite',
        description: 'powerful and mighty vehicle',
        brandId: newBrand._id.toString(),
        styleId: newStyle._id.toString(),
        numberInStock: 10,
        dailyRentalRate: 100,
      };
    };


    const exec = (carId, putCar, token) => {
      return request( server )
        .put( `${endpoint}/${carId}` )
        .set( 'x-auth-token', token )
        .send( putCar );
    };

    
    it( 'updates an existing car entry if logged in as employee', async () => {

      const putCar = getPutCar();
      const res = await exec( getUpdateCarId(), putCar, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 200 );      
      expect( res.body ).toHaveProperty( 'name', putCar.name );

    });

    it( 'returns 404 if given car was not found', async () => {

      const putCar = getPutCar(); 
      const carId = new mongoose.Types.ObjectId();

      const res = await exec( carId, putCar, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 404 );

    });

    it( 'returns 400 if given brand was not found', async () => {

      const putCar = getPutCar(); 
      putCar.brandId = new mongoose.Types.ObjectId();

      const res = await exec( getUpdateCarId(), putCar, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 400 );

    });

    it( 'returns 400 if given style was not found', async () => {

      const putCar = getPutCar(); 
      putCar.styleId = new mongoose.Types.ObjectId();

      const res = await exec( getUpdateCarId(), putCar, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 400 );

    });    
  });

  describe( 'DELETE /', () => {

    const exec = (carId, token) => {
      return request( server )
        .delete( `${endpoint}/${carId}` )
        .set( 'x-auth-token', token )
        .send();
    };


    it( 'deletes car if id is valid and logged in as employee', async () => {

      const res = await exec( newCar._id, new Employee().generateAuthToken() );

      const car = await Car.findById( newCar._id );

      expect( res.status ).toBe( 200 );
      expect( car ).toBeFalsy();

    });

    it( 'returns 200 if record successfully deleted', async () => {

      const res = await exec( newCar._id, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 200 );

    });

    it( 'returns deleted record if successful', async () => {

      const res = await exec( newCar._id, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 200 );
      expect( res.body ).toHaveProperty( 'name', newCar.name );

    });

    it( 'returns 404 if car with given id was not found', async () => {

      const carId = new mongoose.Types.ObjectId();
      const res = await exec( carId, new Employee().generateAuthToken() );

      expect( res.status ).toBe( 404 );

    });

  });

});
