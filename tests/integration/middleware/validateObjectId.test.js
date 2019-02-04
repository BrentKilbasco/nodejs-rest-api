require( '../../helpers/testprep' );
const mongoose = require( 'mongoose' );

const validateObjectId = require( '../../../middleware/validateObjectId' );



describe( 'validate object ID - integration', () => {

  it( 'calls next() if valid object ID', () => {

    const next = jest.fn();
    const req = {
      params: {
        id: new mongoose.Types.ObjectId(),
      },
    };

    validateObjectId( req, {}, next );

    expect( next ).toHaveBeenCalled();

  });

});
