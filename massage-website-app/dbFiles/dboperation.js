var config = require('./dbconfig');
const sql = require('mssql');


//function to see if app is connected to db
async function getdata() {
    try {
        let pool = await sql.connect(config);
        console.log("sql server connected...");
    } catch (error){
        console.log(" errrorr:" + error);
    }
}

//Select all Employees
async function getEmployees(){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM EmployeeDB");
        return res.recordsets;
    } catch(error){
        console.log("erroror :" + error);
    }
}

//Select all Practitioners
async function getPractitioner(){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM EmployeeDB where isPractitioner = 'True'");
        return res.recordsets;
    } catch(error){
        console.log("erroror :" + error);
    }
}

//not working yet
//edit: oh now it works if it takes the link/employees/id
async function getEmployeeByID(EmployeeID){
    try{
        let pool = await sql.connect(config);
        let employee = await pool.request()
        .input('input_parameter', sql.Int, EmployeeID)
        .query("SELECT * FROM EmployeeDB where EmployeeID = @input_parameter");
        return employee.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

//Query to get the Employees full working schedule by their ID
async function getEmployeeScheduleByID(EmployeeID){
    try{
        let pool = await sql.connect(config);
        let employee = await pool.request()
        .input('input_parameter', sql.Int, EmployeeID)
        .query("SELECT * FROM EmployeeDB E INNER JOIN ScheduleDay S ON E.EmployeeID = S.EmployeeID where E.EmployeeID = @input_parameter");
        return employee.recordsets;
    }
    catch(error){
        console.log(error);
    }
}


//v2 of creating employee not working yet (only works by manually putting it, not post)
async function createEmployee(Employee){
    try{
        let pool = await sql.connect(config);
        let employees = await pool.request()
        .query(`INSERT INTO EmployeeDB VALUES
        (
        '${Employee.FirstName}', 
        '${Employee.LastName}',
        '${Employee.Email}', 
        '${Employee.PhoneNumber}',
        '${Employee.PasswordHash}', 
        '${Employee.ImageURL}',
        ${Employee.IsPractitioner}
        )`)
    } catch(error){
        console.log("erroror111 :" + error);
    }
}

async function getBookings(){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM BookingDB");
        return res.recordsets;
    } catch(error){
        console.log("erroror :" + error);
    }
}

//works now
async function createBooking(Booking){
    try{
        let pool = await sql.connect(config);
        let bookings = await pool.request()
        .query(`INSERT INTO BookingDB VALUES
        (${Booking.CustomerID}, ${Booking.EmployeeID},
        ${Booking.MassageTypeID}, '${Booking.DateCreated}',
        ${Booking.DurationInMins}, '${Booking.StartDateTime}',
        '${Booking.EndDateTime}', ${Booking.PriceTotal},
        '${Booking.Status}', ${Booking.IsPaid})`)
    } catch(error){
        console.log("erroror :" + error);
    }
}

//get all massage types
async function getMassageType(){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM MassageTypeDB");
        return res.recordsets;
    } catch(error){
        console.log("erroror :" + error);
    }
}

async function getMassagePrice(MassageTypeID){
    try{
        let pool = await sql.connect(config);
        let massagetype = await pool.request()
        .input('input_parameter', sql.Int, MassageTypeID)
        .query("SELECT * FROM MassagePriceDB where MassageTypeID = @input_parameter");
        return massagetype.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

//get get the practitioner from the time slot
//input is user and duration 
//checks to see where working duration the booking time then check for conflicts
async function getPracFromTime(Start, Duration){
    try{
        
        let pool = await sql.connect(config);

        const result = await pool.request()
        .query('exec GetAvailableEmployee "'+Start+'", '+Duration+'');
        return result.recordset;
        }
    catch(error){
        console.log(error);
    }
}


module.exports = {
    getdata:getdata,
    getEmployeeByID:getEmployeeByID,
    getEmployees:getEmployees,
    createEmployee:createEmployee,
    getEmployeeScheduleByID:getEmployeeScheduleByID,
    getPractitioner:getPractitioner,
    createBooking:createBooking,
    getBookings:getBookings,
    getMassageType:getMassageType,
    getMassagePrice:getMassagePrice,

    getPracFromTime:getPracFromTime
};