var createError       = require('http-errors');
var express           = require('express');
var path              = require('path');
var cookieParser      = require('cookie-parser');
var logger            = require('morgan');
var cors              = require('cors');

var router = express.Router();
const sql = require('./dbFiles/dboperation');

var app = express();

app.get('/api', function(req, res) {
  console.log('called');
  res.send({result: 'go away'})
});

app.get('/', (req, res) => {
  res.send('Hello home!!')
})

app.get('/hello', (req, res) => {
  res.send('Hello NODE API!!')
})

app.get('/testconnect', function(req, res, next){
  sql.getdata();
  res.render('index', { title: 'Expressdeeznuts' });
});

app.get('/employees', function (req, res, next){
  sql.getEmployees().then((result) => {
    res.json(result[0]);
  })
})

app.get('/prac', function (req, res, next){
  sql.getPractitioner().then((result)=> {
    res.json(result[0]);
  })
})

//trying to get employee by id
app.get('/employees/:id', function (req, res,next) {
  sql.getEmployeeScheduleByID(req.params.id)
  .then(user=> res.json(user))
  .catch(next);
})

//to test create employee function
/*
let why = new Employee(999, 'Why', 'Not', 'lol@gmail.com', '389748923', 'nothing', 'nowhere', '0');
console.log(why);
sql.createEmployees(why);
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let client;
let session;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


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

//app.listen(API_PORT, () => console.log(`listening on port ${API_PORT}`))



module.exports = app;
