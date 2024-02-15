var express = require('express');
var router = express.Router();
const sql = require('../dbFiles/dboperation');
const dboperation = require('../dbFiles/dboperation');
Employee = require('../dbFiles/employee');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//test connection
router.get('/testconnect', function(req, res, next){
  sql.getdata();
  res.render('index', { title: 'Expressdeeznuts' });
});

router.get('/employees', function (req, res, next){
  sql.getEmployees().then((result) => {
    res.json(result[0]);
  })
})

//to test create employee function
//let why = new Employee(999, 'Why', 'Not', 'lol@gmail.com', '389748923', 'nothing', 'nowhere', '0');
//console.log(why);
//dboperation.createEmployees(why);

module.exports = router;
