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

//Query to get the Employees schedule by their ID
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


//v2 of creating employee
async function createEmployees(Employee){
    try{
        let pool = await sql.connect(config);
        let employees = await pool.request()
        .query(`INSERT INTO EmployeeDB VALUES
        ('${Employee.FirstName}', 
        '${Employee.LastName}', '${Employee.Email}', 
        '${Employee.PhoneNumber}', '${Employee.PasswordHash}', 
        '${Employee.ImageURL}', ${Employee.IsPractitioner})`)
    } catch(error){
        console.log("erroror :" + error);
    }
}

module.exports = {
    getdata: getdata,
    getEmployeeByID:getEmployeeByID,
    getEmployees:getEmployees,
    createEmployees:createEmployees,
    getEmployeeScheduleByID:getEmployeeScheduleByID,
    getPractitioner:getPractitioner
};