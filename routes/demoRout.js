const ex = require('express')
const rout = ex.Router
const controllar = require('../controllers/demoContorller')
const {valid} = require('express-validator')

rout.get('/', controllar.getDemo)
rout.post('/',
valid('input',"").Alpha(),
)
module.exports = rout