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
        let res = await pool.request()
        .query("SELECT EmployeeID, FirstName, LastName, Email, PhoneNumber, isPractitioner FROM EmployeeDB");
        return res.recordsets;
    } catch(error){
        console.log("erroror :" + error);
    }
}

//Select all Practitioners
async function getPractitioner(){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request()
        .query("SELECT EmployeeID, FirstName, LastName, Email, PhoneNumber FROM EmployeeDB where isPractitioner = 'True'");
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
        .query("SELECT EmployeeID, FirstName, LastName, Email, PhoneNumber, isPractitioner FROM EmployeeDB where EmployeeID = @input_parameter");
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
        .query("SELECT E.EmployeeID, E.FirstName, E.LastName, E.Email, E.PhoneNumber, E.isPractitioner, S.StartDateTime, S.EndDateTime FROM EmployeeDB E INNER JOIN ScheduleDay S ON E.EmployeeID = S.EmployeeID where E.EmployeeID = @input_parameter");
        return employee.recordsets;
    }
    catch(error){
        console.log(error);
    }
}


//v2 of creating employee not working yet
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

async function getMassageType(){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request()
        .query("SELECT MassageTypeID, MassageType, MassageDescription FROM MassageTypeDB");
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
        .query("SELECT MT.MassageType, DurationInMin, Price FROM MassagePriceDB MP INNER JOIN MassageTypeDB MT ON MT.MassageTypeID = MP.MassageTypeID where MP.MassageTypeID = @input_parameter");
        return massagetype.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

//get the practitioner from the time slot
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

//Get customer bookings past and future
//Input is CustomerID
async function getCustomerBookings(CustomerID){
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
        .input('input1', sql.Int, CustomerID)
        .query('Select C.FirstName, C.LastName, E.FirstName as EFirstName, E.LastName as ELastName, M.MassageType, B.StartDateTime, B.DurationInMins, B.PriceTotal FROM CustomerDB C INNER JOIN BookingDB B ON C.CustomerID = B.CustomerID INNER JOIN EmployeeDB E ON E.EmployeeID = B.EmployeeID INNER JOIN MassageTypeDB M ON B.MassageTypeID = M.MassageTypeID where C.CustomerID = @input1');
        return result.recordset;
    } catch (error){
        console.log(error);
    }
}

//Rescheduling a booking
//input is booking id and new start date
async function reschedule(BookingID, newStart){
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
        .input('inputBooking', sql.Int, BookingID)
        .input('inputNewStart',sql.SmallDateTime, newStart)
        .query('UPDATE BookingDB SET StartDateTime = @inputNewStart, EndDateTime = DATEADD(MINUTE, DurationInMins, @inputNewStart) WHERE BookingID = @inputBooking');
        return result.recordset;
    } catch (error){
        console.log(error);
    }
}

//Delete a booking
//Input is BookingID
async function deleteBooking(BookingID){
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
        .input('input1', sql.Int, BookingID)
        .query('DELETE FROM BookingDB WHERE BookingID = @input1');
        return result.recordset;
    } catch(error){
        console.log(error);
    }
}





module.exports = {
    getdata:getdata,
    getEmployeeByID:getEmployeeByID,
    getEmployees:getEmployees,
    getEmployeeScheduleByID:getEmployeeScheduleByID,
    getPractitioner:getPractitioner,
    createEmployee:createEmployee,
    createBooking:createBooking,
    getBookings:getBookings,
    getMassageType:getMassageType,
    getMassagePrice:getMassagePrice,
    getCustomerBookings:getCustomerBookings,
    getPracFromTime:getPracFromTime,
    deleteBooking:deleteBooking,

    reschedule:reschedule
};