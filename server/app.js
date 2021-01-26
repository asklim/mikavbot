const createError = require( 'http-errors' );
const express = require( 'express' );
const path = require( 'path' );
const cookieParser = require( 'cookie-parser' );
const morgan = require( 'morgan' );

const { icwd } = require( './helpers/serverconfig' );
//const icwd = require( 'fs' ).realpathSync( process.cwd());


require( './run-bot.js' );


const { 
    createConns,
    databasesShutdown, } = require( './databases' );

createConns();


const indexRouter = require( './routes/index' );
const usersRouter = require( './routes/users' );

const app = express();

// view engine setup
app.set( 'views', path.join(__dirname, 'views' ));
app.set( 'view engine', 'ejs' );

let morganTemplate = [
    '[:date[web]]', ':status',  
    //':remote-addr', ':remote-user',
    ':method :url :response-time[0] ms - :res[content-length]'
].join(' ');
app.use( morgan( morganTemplate ));

app.use( express.json());
app.use( express.urlencoded({ extended: false }));
app.use( cookieParser());
app.use( express.static( `${icwd}/public` ));

app.use( '/', indexRouter );
//app.use( '/api', apiRouter );
app.use( '/users', usersRouter );

// catch 404 and forward to error handler
app.use( function(req, res, next ) {

    next( createError( 404 ), req, res );
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use( function( err, req, res, _next ) {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = { 

    app,
    databasesShutdown,
};
