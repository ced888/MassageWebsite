var createError       = require('http-errors');
var express           = require('express');
var path              = require('path');
var cookieParser      = require('cookie-parser');
var logger            = require('morgan');
var cors              = require('cors');

var paymentRoute = require("./routes/payment");

var router = express.Router();
const sql = require('./dbFiles/dboperation');
const emailz = require('./dbFiles/email');

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




//function to test if it will connect to sql
app.get('/testconnect', function(req, res, next){
  sql.getdata();
  res.render('index', { title: 'Expressdeez' });
});

//Get list of all employees
app.get('/employees', function (req, res, next){
  sql.getEmployees().then((result) => {
    res.json(result[0]);
  })
})

//Get list of all practitioners
app.get('/employees/prac', function (req, res, next){
  sql.getPractitioner().then((result)=> {
    res.json(result[0]);
  })
})


//Get employee by their id
//Need EmployeeID as input
app.get('/employees/:id', function (req, res, next) {
  sql.getEmployeeByID(req.params.id)
  .then(user=> res.json(user))
  .catch(next);
})

//Get Employees schedule from EmployeeID
//Need EmployeeID as input
app.get('/employees/sched/:id', function (req, res, next) {
  sql.getEmployeeScheduleByID(req.params.id)
  .then(user=> res.json(user))
  .catch(next);
})


//Get list of all bookings
app.get('/bookings', function (req,res,next){
  sql.getBookings().then((result)=> {
    res.json(result[0]);
  })
})

app.get('/bookings/:id', function (req,res,next){
  sql.getBooking(req.params.id)
  .then(user=> res.json(user))
  .catch(next);
})

//Create booking
//Need booking details as input
app.post('/createbooking', function (req, res, next) {
  sql.createBooking(req.body)
  .then(() => res.json({message: 'Booking Created'}))
  .catch(next);
})

//Create employee
//Need employee details as input
app.post('/createemployee', function (req, res, next) {
  sql.createEmployee(req.body.Employee, req.body.User)
  .then(() => res.json({message: 'Employee Created'}))
  .catch(next);
})

app.post('/createemployeeold', function (req, res, next) {
  sql.createEmployeeOLD(req.body)
  .then(() => res.json({message: 'Employee Created'}))
  .catch(next);
})

//Create customer
app.post('/createcustomer', function (req, res, next) {
  sql.createCustomer(req.body.Customer, req.body.User)
  .then(() => res.json({message: 'Customer Created'}))
  .catch(next);
})

/*
//login
// not working yet
app.get('/login', (req,res) => {
  console.log(req.body);
  const user = sql.login(req.body)
  .then(() => res.json({message: 'Login'}))
  .catch(next);
})
*/

//Get list of all massage types
app.get('/massagetype', function (req,res,next){
  sql.getMassageType().then((result)=> {
    res.json(result[0]);
  })
})

//Get list of the massage price per duration of massage type
//Need MassagetypeID as input
app.get('/massagetype/:id', function (req, res,next) {
  sql.getMassagePrice(req.params.id)
  .then(user=> res.json(user))
  .catch(next);
  
})

//Get all available practitioner from this time slot
//Need Date and Duration as input
app.get('/getavailprac/:date/:duration', function (req, res, next){
  sql.getPracFromTime(req.params.date, req.params.duration)
  .then((result)=> {
    res.json(result);
  })
})

//Get all bookings of the customers past, present, and future bookings
app.get('/customer/bookings/:id', function (req, res, next){
  sql.getCustomerBookings(req.params.id)
  .then((result)=>{
    res.json(result);
  })
})

//Delete a booking by its id
app.delete('/delbooking/:id', function (req, res, next){
  sql.deleteBooking(req.params.id)
  .then((result)=>{
    res.json(result);
  })
})

//Reschedule a booking with the id and new date
app.put('/reschedule/:id/:date', function (req, res, next){
  sql.reschedule(req.params.id, req.params.date)
  .then((result)=>{
    res.json(result);
  })
})

//update the current status of the booking whether its done or called or in progress
app.put('/bookingstatus/:id/:status', function (req, res, next){
  sql.updateStatus(req.params.id, req.params.status)
  .then((result)=>{
    res.json(result);
  })
})

//update the booking to display whether its paid or not
app.put('/bookingpaidstatus/:id/:paidstatus', function (req, res, next){
  sql.updatePAID(req.params.id, req.params.paidstatus)
  .then((result)=>{
    res.json(result);
  })
})

//emailz().catch(console.error);

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



module.exports = app;
