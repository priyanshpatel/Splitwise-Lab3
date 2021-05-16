var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var mongoose = require( './config/db_config' );
var { frontend_url } = require( './config/config' )
var path = require( 'path' )
var app = express();
var session = require( "express-session" );
var cookieParser = require( "cookie-parser" );
var cors = require( 'cors' );

const PORT = 3001;

//Session management
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( express.static( 'public' ) )
app.use( cors( { origin: frontend_url, credentials: true } ) );
app.use(
    session( {
        key: 'user_id',
        secret: "CMPE_273_Lab_2",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 6000000
        }
    } )
);

const { graphqlHTTP } = require( 'express-graphql' );
let schema = require("./schema/schema")

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true })  ); // Doubt, might have to remove later

app.use( ( req, res, next ) => {
    res.setHeader( 'Access-Control-Allow-Origin', 'http://localhost:3000' );
    res.setHeader( 'Access-Control-Allow-Credentials', 'true' );
    res.setHeader( 'Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE' );
    res.setHeader( 'Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers' );
    res.setHeader( 'Cache-Control', 'no-cache' );
    next();
});

// const signup = require('./modules/signup')
// const login = require('./modules/login')
// const groups = require('./modules/groups')
// const expenses = require('./modules/expenses')
// const activities = require('./modules/activities')
// const profile = require('./modules/profile')
// const dashboard = require('./modules/dashboard')

// app.use('/signup', signup)
// app.use('/login', login)
// app.use('/groups', groups)
// app.use('/expenses', expenses)
// app.use('/activities', activities)
// app.use('/profile', profile)
// app.use('/dashboard', dashboard)

app.use( express.static( "public" ) );

app.use( "/graphql", graphqlHTTP( {
    schema,
    graphiql: true
} ) );


//get index page
app.get( '/', ( req, res ) => {
    res.send( 'Welcome to splitwise' );
} );


app.listen( PORT, () => {
    console.log( "Server listening on port: ", PORT );
} );