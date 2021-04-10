const route = require('express').Router()
const StudentController = require('../controller/StudentController')
const connect = require('connect')
const formidableMiddleware = require('express-formidable')

const authMiddleware = (() => {
    const chain = connect()
    ;[formidableMiddleware()].forEach((middleware) => {
        chain.use(middleware)
    })
    return chain
})()

route.post('/add-edit-student', StudentController.addEditStudent)
route.get('/get-student', StudentController.getStudent)
route.get('/get-student/:id', StudentController.getOneStudent)
route.get('/download-student', StudentController.downloadStudent)
route.get('/import-student', authMiddleware, StudentController.importStudent)


module.exports = route

