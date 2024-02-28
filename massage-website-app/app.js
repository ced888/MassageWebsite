var createError       = require('http-errors');
var express           = require('express');
var path              = require('path');
var cookieParser      = require('cookie-parser');
var logger            = require('morgan');
var cors              = require('cors');

var paymentRoute = require("./routes/payment");

var router = express.Router();
const sql = require('./dbFiles/dboperation');
//idk if i need the 2 below
const Employee = require('./dbFiles/employee');
const Booking = require('./dbFiles/booking');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




//testing to see if it works
app.get('/', (req, res) => {
  res.send('Hello home!!')
})

//testing to see if path works
app.get('/api', function(req, res) {
  console.log('called');
  res.send({result: 'go away'})
});

//testing to see if it can connect to sql
app.get('/testconnect', function(req, res, next){
  sql.getdata();
  res.render('index', { title: 'Expressdeeznuts' });
});

//testing the get employee function
app.get('/employees', function (req, res, next){
  sql.getEmployees().then((result) => {
    res.json(result[0]);
  })
})

//testing the get practitioner function
app.get('/prac', function (req, res, next){
  sql.getPractitioner().then((result)=> {
    res.json(result[0]);
  })
})


//testing to get employee by id
app.get('/employees/:id', function (req, res, next) {
  sql.getEmployeeByID(req.params.id)
  .then(user=> res.json(user))
  .catch(next);
})

//testing to get employee schedule by id
app.get('/employees/sched/:id', function (req, res, next) {
  sql.getEmployeeScheduleByID(req.params.id)
  .then(user=> res.json(user))
  .catch(next);
})


//show list of bookings
app.get('/lol', function (req,res,next){
  sql.getBookings().then((result)=> {
    res.json(result[0]);
  })
})

//creating booking from postman
app.post('/lolx', function (req, res, next) {
  console.log(req.body);
  sql.createBooking(req.body)
  .then(() => res.json({message: 'Booking Created'}))
  .catch(next);
})

//create employee from postman
app.post('/lolxd', function (req, res, next) {
  console.log(req.body);
  sql.createEmployee(req.body)
  .then(() => res.json({message: 'Employee Created'}))
  .catch(next);
})

app.get('/aa', function (req,res,next){
  sql.getMassageType().then((result)=> {
    res.json(result[0]);
  })
})

//testing to get massageprice from massage type
app.get('/aa/:id', function (req, res,next) {
  
  sql.getMassagePrice(req.params.id)
  .then(user=> res.json(user))
  .catch(next);
  
})


app.get('/bb', function (req, res, next){
  let Start = '2024-04-17 13:15:00';
  let duration = 30;
  sql.getPracFromTime(Start, duration)
  .then((result)=> {
    res.json(result);
  })
})

app.use("/payment", paymentRoute);

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
//to test create employee function
let why = new Employee(999, 'Why', 'Not', 'lol@gmail.com', '389748923', 'nothing', 'nowhere', '0');
console.log(why);
//sql.createEmployees(why);
*/

//to test create booking function
/*
let book1 = new Booking(69, 4, 7, 8, '2024-03-01 13:00:00', 60, '2024-03-05 13:00:00', '2024-03-05 14:00:00', 60.99, 'IDK', '0');
console.log(book1);
*/
//sql.createBooking(book1);

/*
app.listen(3001, ()=> {
  console.log('Node API app is running on port 3001')
})
*/

//app.listen(API_PORT, () => console.log(`listening on port ${API_PORT}`))



module.exports = app;
