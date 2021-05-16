var mongoose = require( 'mongoose' );
var { mongodb_string } = require( './config' )

mongoose.connect( mongodb_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useMongoClient: true
}, error => {
    if ( error ) {
        console.log( "Error Connecting to MongoDB" );
    } else {
        console.log( "Connected to MongoDB" );
    }
} )

module.exports = {
    mongoose
}