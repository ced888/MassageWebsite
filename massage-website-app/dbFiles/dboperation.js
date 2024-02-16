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

//currently set to get all employees in db
async function getEmployees(){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM EmployeeDB");
        return res.recordsets;
    } catch(error){
        console.log("erroror :" + error);
    }
}

//not working yet
async function getEmployee(EmployeeID){
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
    getEmployee:getEmployee,
    getEmployees:getEmployees,
    createEmployees:createEmployees,
};