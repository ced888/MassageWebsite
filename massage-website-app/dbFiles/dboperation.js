var config            = require('./dbconfig');
const sql             = require('mssql');
var bcrypt            = require('bcrypt');


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


//v2 of creating employee 
async function createEmployee(Employee, User){
    try{
        console.log(Employee);
        console.log(User);
        let pool = await sql.connect(config);
        let employees = await pool.request()
        .query(`INSERT INTO EmployeeDB (FirstName, LastName, Email, PhoneNumber, ImageURL, IsPractitioner) VALUES
        (
        '${Employee.FirstName}', 
        '${Employee.LastName}',
        '${Employee.Email}', 
        '${Employee.PhoneNumber}',
        '${Employee.ImageURL}',
        ${Employee.IsPractitioner}
        )`)

        //let pool2 = await sql.connect(config);
        let user = await pool.request()
        .query(`INSERT INTO UserDB VALUES
        (
        '${User.Email}',
        '${User.PasswordHash}', 
        ${User.IsAdmin}
        )`)
    } catch(error){
        console.log("erroror111 from creating:" + error);
    }
}

//v2 of creating employee 
async function createCustomer(Customer, User){
    try{
        console.log(Customer);
        console.log(User);
        console.log(User.PasswordHash);
        User.PasswordHash = await bcrypt.hash(User.PasswordHash,10);
        console.log(User.PasswordHash);

        let pool = await sql.connect(config);

        let user = await pool.request()
        .query(`INSERT INTO UserDB VALUES
        (
        '${User.Email}',
        '${User.PasswordHash}', 
        ${User.IsAdmin}
        )`)
        
        let customer = await pool.request()
        .query(`INSERT INTO CustomerDB (FirstName, LastName, Email, PhoneNumber) VALUES
        (
        '${Customer.FirstName}', 
        '${Customer.LastName}',
        '${Customer.Email}', 
        '${Customer.PhoneNumber}'
        )`)

        //let pool2 = await sql.connect(config);

    } catch(error){
        console.log("erroror111 from creating:" + error);
    }
}

//v2 of creating employee 
async function createCustomer(Customer, User){
    try{
        User.PasswordHash = await bcrypt.hash(User.PasswordHash,10);
        let pool = await sql.connect(config);
        let user = await pool.request()
        .query(`INSERT INTO UserDB VALUES
        (
        '${User.Email}',
        '${User.PasswordHash}', 
        ${User.IsAdmin},
        '${User.UserType}'
        )`)
        
        let customer = await pool.request()
        .query(`INSERT INTO CustomerDB (FirstName, LastName, Email, PhoneNumber) VALUES
        (
        '${Customer.FirstName}', 
        '${Customer.LastName}',
        '${Customer.Email}', 
        '${Customer.PhoneNumber}'
        )`)

        //let pool2 = await sql.connect(config);

    } catch(error){
        console.log("erroror111 from creating:" + error);
    }
}

async function getUser(Email){
    try{
        let pool = await sql.connect(config);
        let User = await pool.request()
        .input('inputEmail', sql.NVarChar,Email)
        .query('exec GetUserData "'+Email+'"');
        return User.recordset;
    }catch(error){
        console.log("eerroorr:" + error);
    }
    
}

//old version of creating employee back when password was in employee table and userDB wasnt made yet
async function createEmployeeOLD(Employee){
    try{
        let pool = await sql.connect(config);
        let employees = await pool.request()
        .query(`INSERT INTO EmployeeDB (FirstName, LastName, Email, PhoneNumber, PasswordHash, ImageURL, IsPractitioner) VALUES
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
        console.log("erroror111 from creating:" + error);
    }
}

async function registerUser(Email, PasswordHash, IsAdmin, UserType){
    try{
        //let PasswordHash1 = await bcrypt.hash(PasswordHash,10);
        //console.log(PasswordHash1)
        let pool = await sql.connect(config);
        const result = await pool.request()
        .query('exec RegisterUserOnly "'+Email+'", '+PasswordHash+', '+IsAdmin+', '+UserType+'');
        return result.recordset;
        }
    catch(error){
        console.log(error);
    }
}



//function to try to log in
//also used to check for existing email during signup
async function login(Login){
    try{
        let pool = await sql.connect(config);
        let user = await pool.request()
        .input('inputEmail', sql.NVarChar, Login.Email)
        .query('SELECT * FROM UserDB WHERE Email = @inputEmail');
        return user.recordset;
    } catch(error){
        console.log("login error:" + error);
    }
}

async function checkCustomerEmail(Email){
    try{
        let pool = await sql.connect(config);
        let user = await pool.request()
        .input('inputEmail', sql.NVarChar, Email)
        .query('SELECT * FROM CustomerDB WHERE Email = @inputEmail');
        return user.recordset;
    } catch(error){
        console.log("login error:" + error);
    }
}

//gets all the bookings that exist
async function getBookings(){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query(`
        Select BookingID ,b.CustomerID ,b.EmployeeID ,b.MassageTypeID, mt.MassageType, e.FirstName as 'PFirstName', e.LastName as 'PLastName', DateCreated,DurationInMins,StartDateTime,EndDateTime,PriceTotal,Status,IsPaid
        from BookingDB b, CustomerDB c, EmployeeDB e, MassageTypeDB mt
        WHERE b.CustomerID = c.CustomerID AND b.EmployeeID = e.EmployeeID AND b.MassageTypeID = mt.MassageTypeID`);
        return res.recordsets;
    } catch(error){
        console.log("erroror :" + error);
    }
}

//get the singular booking from id
async function getBooking(BookingID){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request()
        .input('inputID', sql.Int, BookingID)
        .query("SELECT * FROM BookingDB WHERE BookingID = @inputID");
        return res.recordset;
    } catch(error){
        console.log("error:" + error);
    }
}

async function getUsersBookings(Email){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request()
        .input('inputEmail', sql.NVarChar, Email)
        .query("SELECT * FROM BookingDB B INNER JOIN CustomerDB C ON C.CustomerID = B.CustomerID INNER JOIN UserDB U ON C.UserID = U.UserID WHERE U.Email = @inputEmail");
        return res.recordset;
    } catch(error){
        console.log("error:" + error);
    }
}

//creates the booking into the database
async function createBooking(Booking){
    try{
        let pool = await sql.connect(config);
        let bookings = await pool.request()
        .query(`INSERT INTO BookingDB OUTPUT INSERTED.BookingID VALUES
        (${Booking.CustomerID}, ${Booking.EmployeeID},
        ${Booking.MassageTypeID}, '${Booking.DateCreated}',
        ${Booking.DurationInMins}, '${Booking.StartDateTime}',
        '${Booking.EndDateTime}', ${Booking.PriceTotal},
        '${Booking.Status}', ${Booking.IsPaid})`);
        let pk = bookings.recordset[0].BookingID;
        console.log(pk);
        return pk;
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

async function getMassagePrice(MassageTypeID, Duration){
    try{
        let pool = await sql.connect(config);
        let massagetype = await pool.request()
        .input('input_massageTypeId', sql.Int, MassageTypeID)
        .input('input_duration', sql.Int, Duration )
        .query("SELECT MT.MassageType, DurationInMin, Price FROM MassagePriceDB MP INNER JOIN MassageTypeDB MT ON MT.MassageTypeID = MP.MassageTypeID where MP.MassageTypeID = @input_massageTypeId AND MP.DurationInMin = @input_duration");
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
async function getCustomerBookings(Email){
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
        .input('input1', sql.NVarChar, Email)
        .query('Select C.FirstName, C.LastName, C.Email, E.FirstName as EFirstName, E.LastName as ELastName, M.MassageType, B.StartDateTime, B.DurationInMins, B.PriceTotal FROM CustomerDB C INNER JOIN BookingDB B ON C.CustomerID = B.CustomerID INNER JOIN EmployeeDB E ON E.EmployeeID = B.EmployeeID INNER JOIN MassageTypeDB M ON B.MassageTypeID = M.MassageTypeID where C.Email = @input1');
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

//update the paid status of the booking
//input is bookingID and whether it is paid off or not (i.e True or False)
async function updatePAID(BookingID, PaidStatus){
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
        .input('inputID', sql.Int, BookingID)
        .input('inputPStatus', sql.Bit, PaidStatus)
        .query('UPDATE BookingDB SET IsPaid = @inputPStatus WHERE BookingID = @inputID');
        return result.recordset;
    } catch (error){
        console.log(error);
    }
}

//update the status of the booking
//input is bookingID and status (i.e. in progress or done or cancelled)
async function updateStatus(BookingID, Status){
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
        .input('inputID', sql.Int, BookingID)
        .input('inputStatus', sql.NVarChar, Status)
        .query('UPDATE BookingDB SET Status = @inputStatus WHERE BookingID = @inputID');
        return result.recordset;
    } catch (error){
        console.log(error);
    }
}

async function hashPassword(Password){
    try{
        const hash = await bcrypt.hash(Password, 10);
        console.log(hash);
        return hash;
    } catch (error){
        console.log(error);
    }
}

async function inputRefreshToken(User, RefreshToken){
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
        .input('inputUser', sql.Int, User)
        .input('inputRToken', sql.NVarChar, RefreshToken)
        .query('INSERT INTO RefreshTokens (UserID, Token) VALUES (@inputUser, @inputRToken)')
        return result.recordset;
    } catch(error){
        console.log(error);
    }
    
}

async function findRefreshToken(RefreshToken){
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
        .input('inputRToken', sql.NVarChar, RefreshToken)
        .query("SELECT * FROM RefreshTokens WHERE Token = @inputRToken")
        return result.recordset;
    } catch(error){
        console.log(error);
    }
}

async function deleteRefreshToken(RefreshToken){
    try{
        let pool = await sql.connect(config);
        let result = await pool.request()
        .input('inputRToken', sql.NVarChar, RefreshToken)
        .query("DELETE FROM RefreshTokens WHERE Token = @inputRToken")
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
    registerUser:registerUser,
    checkCustomerEmail:checkCustomerEmail,

    createBooking:createBooking,
    getBookings:getBookings,
    getCustomerBookings:getCustomerBookings,
    getBooking:getBooking,
    getUsersBookings:getUsersBookings,

    getMassageType:getMassageType,
    getMassagePrice:getMassagePrice,

    getPracFromTime:getPracFromTime,
    deleteBooking:deleteBooking,

    reschedule:reschedule,

    updatePAID:updatePAID,
    updateStatus:updateStatus,

    createEmployeeOLD:createEmployeeOLD,
    createCustomer:createCustomer,
    login:login,
    hashPassword:hashPassword,
    getUser:getUser,

    inputRefreshToken:inputRefreshToken,
    findRefreshToken:findRefreshToken,
    deleteRefreshToken:deleteRefreshToken
};