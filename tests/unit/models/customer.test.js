const mongoose = require( 'mongoose' );
const jwt = require( 'jsonwebtoken' );

// Data Models
const { Customer } = require( '../../../models/customer' );

const keys = require( '../../../config/keys' );



describe( 'customer.generateAuthToken()', () => {

  it( 'returns a valid JSON web token', () => {

    const userDataObject = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isGold: true,
    };

    const customer = new Customer( userDataObject );
    const token = customer.generateAuthToken();
    const decoded = jwt.verify( token, keys.jwtPrivateKey );

    expect( token ).toBeTruthy();
    expect( decoded ).toMatchObject( userDataObject );

  });

});
