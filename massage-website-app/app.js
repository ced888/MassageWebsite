var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users.js');

var app = express();

/*
//adding SSMS stuff

const sql = require("mssql");

const config = {
    server: "massagecapstone-server.database.windows.net",
    port: 3301,
    user: "massagecapstone-server-admin",
    password: "CedLyn321",
    database: "massagecapstone-database",

    options: {
        enableArithAbort: true,
    },
    connectionTimeout: 150000,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
};

sql.on('error', err => {
  console.log(err.message)
})

async function getDBCustomerAsyncFunction(){
  try{
      let pool = await sql.connect(config)
      let result1 = await pool.request().query('select * from CustomerDB')
      console.log(result1)
      sql.close()
  } catch (error) {
      console.log(err.message);
      sql.close();
  }
}
//end of adding ssms

//routes
app.get('/', (req, res) => {
  res.send('Hello NODE API!!')
})
*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/*
app.listen(3001, ()=> {
  console.log('Node API app is running on port 3001')
})
*/



module.exports = app;
