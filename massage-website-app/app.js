require('dotenv').config;

var createError       = require('http-errors');
var express           = require('express');
var path              = require('path');
var cookieParser      = require('cookie-parser');
var logger            = require('morgan');

var paymentRoute = require("./routes/payment");

const cors            = require('cors');
var bcrypt            = require('bcrypt');
const jwt             = require('jsonwebtoken')

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

app.get('/bookingsbyemployee/:EmployeeID', function (req,res,next){
  sql.getBookingByPractitioner(req.params.EmployeeID)
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
  const existuser = sql.login(req.body.User)
  .then(existuser =>{
    //if there is already existing user with that email
    if (existuser.length != 0){
      return res.json("Fail");
    } else{
      const existcust = sql.checkCustomerEmail(req.body.User.Email).then(existcust =>{
        //if there is already existing customer with that email
        if (existcust.length !=0){
          sql.registerUser(req.body.User.Email, req.body.User.PasswordHash, req.body.User.IsAdmin, req.body.User.UserType)
          .then(() =>res.json({message: 'User Created'}))
          .catch(next);
        } else{
          sql.createCustomer(req.body.Customer, req.body.User)
          .then(() => res.json({message: 'Customer Created'}))
          .catch(next);
        }
      })
      
    }
})
})

app.post('/createuser', function (req,res,next) {
  const existing = sql.checkCustomerEmail(req.body.User.Email).then(existing => {
    if (existing.length !=0){
      sql.registerUser(req.body.Email, req.body.PasswordHash, req.body.IsAdmin, req.body.UserType)
      .then(() =>res.json({message: 'User Created'}))
      .catch(next);
    } else{

    }
  })
})

function authenticateToken(req,res,next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

function generateAccessToken(user){
  return jwt.sign({ UserID:user.UserID, Email:user.Email, IsAdmin:user.IsAdmin }, process.env.ACCESS_TOKEN_SECRET, { expiresIn:'6h'})
}

function generateRefreshToken(user){
  return jwt.sign({ UserID:user.UserID, Email:user.Email, IsAdmin:user.IsAdmin }, process.env.REFRESH_TOKEN_SECRET, { expiresIn:'12h'})
}

// trying jwt req.body is [email, passwordhash]
app.post('/login', function (req,res,next){
  //check login credentials
  const user = sql.login(req.body)
  .then(async user=> {
    if (user.length > 0){
      loginuser = user[0]
      const isValid = await bcrypt.compare(req.body.PasswordHash, user[0].PasswordHash);
      if (isValid === true){
        const accessToken = generateAccessToken(loginuser)
        const refreshToken = generateRefreshToken(loginuser)
        console.log(refreshToken)
        sql.inputRefreshToken(loginuser.UserID, refreshToken)
        res.json({ userID:loginuser.UserID, userEmail:loginuser.Email, IsAdmin:loginuser.IsAdmin, accessToken: accessToken, refreshToken:refreshToken})
        
      } else{
        return res.json("Fail")
      }
    } else {
      return res.json("Fail")
    }
  })
  .catch(next);
})

app.post("/refresh", (req,res)=>{
  const refreshToken = req.body.token
  if (!refreshToken) return res.status(401).json("You are not authenticated.")
  const rtoken = sql.findRefreshToken(refreshToken).then((rtoken) =>{
    if (rtoken.length == 0){
      return res.sendStatus(403)
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
      err && console.log(err);
      console.log(user)

      sql.deleteRefreshToken(refreshToken).then(()=>{
        
        const newaccessToken = generateAccessToken(user)
        const newrefreshToken = generateRefreshToken(user)
        sql.inputRefreshToken(user.UserID, newrefreshToken)
        res.status(200).json({
          accessToken:newaccessToken,
          refreshToken:newrefreshToken
        });
      })
    })
})
})

app.post("/logout", authenticateToken, (req,res) =>{
  console.log(req.body)
  const refreshToken = req.body.token;
  sql.deleteRefreshToken(refreshToken).then(() =>{
    res.sendStatus(200);
})
  })

app.get('/getUserHistory', authenticateToken, (req,res)=>{
  sql.getUsersBookings(req.user.Email).then((result)=>{
    res.json(result);
  })
})
//
/*refresh token
app.post('/token', (req,res) =>{
  const refreshToken = req.body.token

})
*/

app.get('/posts', authenticateToken, (req, res) =>{
  sql.getUser(req.user.Email).then((result)=> {
    res.json(result);
  })
})

app.post('/getUser', authenticateToken, (req,res)=>{
  sql.getUser(req.body.Email).then((result)=>{
    res.json(result)
  })
})

app.get('/', (req, res) =>{
  const {userID} = req.session
})

/*
const redirectHome = (req, res, next) =>{
  if (req.session.user) {
    res.redirect('/')
  } else {
    next()
  }
}
*/

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
