var createError       = require('http-errors');
var express           = require('express');
var path              = require('path');
var cookieParser      = require('cookie-parser');
var logger            = require('morgan');

var paymentRoute = require("./routes/payment");

const cors              = require('cors');
var bcrypt            = require('bcrypt');

var session           = require('express-session');
//del below if it doesnt work (used to store the users login into a table in the database)
//var config          = require('./dbFiles/dbconfig');
//var MssqlStore      = require('mssql-session-store')(session);

var router = express.Router();

const sql = require('./dbFiles/dboperation');
const emailz = require('./dbFiles/email');
const { exist } = require('joi');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const TWELVE_HOURS = 1000 * 60 * 60 * 12
const testtime = 1000 * 60

const {
  PORT = 3000,
  NODE_env = 'development',
  SESS_NAME = 'sid',
  SESS_SECRET = 'hahaha6969',
  SESS_LifeTime = TWELVE_HOURS
} = process.env

const IN_PROD  = NODE_env === 'production'
/*
var options = {
  connection: config,
}
*/

app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  //store: new MssqlStore(options),
  //userID: "undefined",
  cookie: {
    maxAge: SESS_LifeTime,
    sameSite: true,
    secure: process.env.NODE_ENV === 'production',
  }
}))

app.use(cors({ origin: 'http://localhost:5000', credentials: true }));

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
  console.log(req.body.Customer);
  console.log(req.body.User);
  const existing = sql.login(req.body.User)
  .then(existing =>{
    if (existing.length != 0){
      return res.json("Fail");
    } else{
      sql.createCustomer(req.body.Customer, req.body.User)
         .then(() => res.json({message: 'Customer Created'}))
         .catch(next);
    }
})
})

//function to log in
app.post('/login', function (req,res,next){
  console.log(req.body);
  const user = sql.login(req.body)
  .then(async user=> {
    if (user.length > 0){
      const isValid = await bcrypt.compare(req.body.PasswordHash, user[0].PasswordHash);
      if (isValid === true){
        console.log("user = " + user[0].UserID);
        req.session.userid = user[0].UserID;
        console.log("req = " + req.session.userid);
        console.log("sesh = " + req.sessionID);
        /*
        req.session.save(function(err) {
          req.session.user = user[0].UserID;
        })
        */
        
        return res.json("Success")
      } else{
        return res.json("Fail")
      }
    } else {
      return res.json("Fail")
    }
  })
  .catch(next);
})

//logout
app.post('/logout', (req, res) =>{
  req.session.destroy(err =>{
    if (err) {
      return res.json("Fail")
    }
    res.clearCookie(SESS_NAME);
    return res.json("Success")
  })
})

const isAuthenticated = (req, res, next) => {
  if (req.session.userid) {
    console.log("hi");
    next();
  } else {
    console.log('bye');
    res.status(401).json({ message: "Unauthorized" });
  }
};

//check auth
app.get('/checkauth', isAuthenticated, (req, res) =>{
  res.json({authenticated:true});
})

app.get('/getuser', (req, res)=>{
  console.log(req.session.user);
  sql.getUser(req.session.userid).then((result)=> {
    res.json(result[0]);
  })
})
  
app.get('/', (req, res) =>{
  const {userID} = req.session
})

const redirectHome = (req, res, next) =>{
  if (req.session.user) {
    res.redirect('/')
  } else {
    next()
  }
}

//Get list of all massage types
app.get('/massagetype', function (req,res,next){
  sql.getMassageType().then((result)=> {
    res.json(result[0]);
  })
})

//Get list of the massage price per duration of massage type
//Need MassagetypeID as input
app.get('/massageprice/:id/:duration', function (req, res,next) {
  sql.getMassagePrice(req.params.id, req.params.duration)
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
app.get('/customer/bookings/:email', function (req, res, next){
  sql.getCustomerBookings(req.params.email)
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
