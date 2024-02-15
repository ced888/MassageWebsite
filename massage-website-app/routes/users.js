var express = require('express');
const sql = require('../dbFiles/dboperation');
var router = express.Router();




//trying to use put
/*
router.post('/', function(req, res, next) {
  let customer = {...request.body}
  sql.addCustomer(customer).then(result =>{
    response.status(201).json(result);
  })
})
*/
//idk this doesnt Worker


router.route('/id').get((req, res)=>{
  sql.getEmployee(request.params.id).then(result =>{
    res.json(result[0]);
  })
})




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a trying the get function');
});




module.exports = router;
