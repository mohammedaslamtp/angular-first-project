const express = require('express')
const route = express.Router()
const adminController = require('../controllers/admin_controller')

route.get('/', adminController.ad_home)
route.get('/userDetails', adminController.userDetails)
route.get('/costumers',adminController.costumers)

route.post('/login',adminController.login)
route.post('/create/user', adminController.createUser)
route.put('/update/user_data', adminController.updateUser)

route.delete('/delete/user',adminController.deleteUser)

module.exports = route