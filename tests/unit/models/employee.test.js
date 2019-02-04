const mongoose = require( 'mongoose' );
const jwt = require( 'jsonwebtoken' );

// Data Models
const { Employee } = require( '../../../models/employee' );

const keys = require( '../../../config/keys' );



describe( 'employee.generateAuthToken()', () => {

  it( 'returns a valid JSON web token', () => {

    const userDataObject = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: false,
    };

    const employee = new Employee( userDataObject );
    const token = employee.generateAuthToken();
    const decoded = jwt.verify( token, keys.jwtPrivateKey );

    expect( token ).toBeTruthy();
    expect( decoded ).toMatchObject( userDataObject );

  });

});
