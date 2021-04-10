const {Student,Department} = require('../models')
const Response = require('../service/response')
const Transformer = require('object-transformer')
const { Op } = require('sequelize')
const Helper = require('../service/helper')
const constant = require('../service/constant')
const stringify = require('csv-stringify')
const student_transformer = require('../transformers/student')
const {addStudent} = require('../service/apiValidation')
const moment = require('moment')
const neatCsv = require('neat-csv')
const path = require('path')
const fs = require('fs')

module.exports = {
    getOneStudent:async (req,res) => {
        const reqParam = req.params
        await Student.findOne({
            include:[{
                model:Department
            }],
            where:{
                id:reqParam.id
            }
        }).then((d) => {
            if(d){
                d.department = d.Department.name
                return Response.successResponseData(
                    res,
                    new Transformer.Single(d, student_transformer.detail).parse(),
                    constant.SUCCESS,
                    res.locals.__('success'),
                )
            } else {
                return Response.successResponseData(
                    res,
                    [],
                    constant.SUCCESS,
                    res.locals.__('noDataFound')
                )
            }
        })
    },
    addEditStudent:async (req,res) => {
        const reqParam = req.body
        addStudent(reqParam, res, async (validate) => {
            if(reqParam.id){
                const student = await Student.findOne({
                    include:[{
                       model:Department
                    }],
                    where:{
                        id:reqParam.id
                    }
                })
                if(student){
                    const mobile_exist = await Student.findOne({
                        where:{
                            mobile:reqParam.mobile,
                            id:{
                                [Op.ne]:reqParam.id
                            }
                        }
                    })
                    if(!mobile_exist) {
                        Department.update({
                            name: reqParam.department
                        }, {
                            where: {
                                id: student.Department.id
                            }
                        }).then((d) => {
                            Student.update({
                                department_id: d.id,
                                first_name: reqParam.first_name,
                                last_name: reqParam.last_name,
                                middle_name: reqParam.middle_name,
                                city: reqParam.city,
                                address: reqParam.address,
                                email: reqParam.email,
                                mobile: +reqParam.mobile
                            }, {
                                where: {
                                    id: reqParam.id
                                }
                            }).then(() => {
                                return Response.successResponseWithoutData(
                                    res,
                                    res.locals.__('studentUpdatedSuccessfully'),
                                    constant.SUCCESS,
                                )
                            }).catch((e) => {
                                console.log(e)
                                return Response.errorResponseData(
                                    res,
                                    res.__('internalError'),
                                    constant.INTERNAL_SERVER
                                )
                            })
                        }).catch((e) => {
                            console.log(e)
                            return Response.errorResponseData(
                                res,
                                res.__('internalError'),
                                constant.INTERNAL_SERVER
                            )
                        })
                    } else {
                        return Response.successResponseWithoutData(
                            res,
                            res.locals.__('mobileAlreadyExist'),
                            constant.FAIL,
                        )
                    }
                } else {
                    return Response.successResponseWithoutData(
                        res,
                        res.locals.__('studentAlreadyExistWithThisNumber'),
                        constant.FAIL,
                    )
                }
            } else {
                Student.findOne({
                    where: {
                        mobile: reqParam.mobile
                    }
                }).then(async (response) => {
                    if (response) {
                        return Response.successResponseWithoutData(
                            res,
                            res.locals.__('studentNotExist'),
                            constant.FAIL,
                        )
                    } else {
                        Department.create({
                            name:reqParam.department
                        }).then((d)=> {
                            console.log(d)
                            Student.create({
                                department_id:d.id,
                                first_name: reqParam.first_name,
                                last_name: reqParam.last_name,
                                middle_name: reqParam.middle_name,
                                city: reqParam.city,
                                address: reqParam.address,
                                email: reqParam.email,
                                mobile: +reqParam.mobile
                            }).then(() => {
                                return Response.successResponseWithoutData(
                                    res,
                                    res.locals.__('success'),
                                    constant.SUCCESS,
                                )
                            }).catch((e) => {
                                console.log(e)
                                return Response.errorResponseData(
                                    res,
                                    res.__('internalError'),
                                    constant.INTERNAL_SERVER
                                )
                            })
                        }).catch((e) => {
                            console.log(e)
                            return Response.errorResponseData(
                                res,
                                res.__('internalError'),
                                constant.INTERNAL_SERVER
                            )
                        })
                    }
                })
            }

        })
    },
    getStudent:async (req,res) =>{
        await Student.findAll(
            {
                include:[{
                    model:Department
                }]
            }
        ).then((response) => {
            if(response.length > 0) {
                for(let student of response){
                    student.department = student.Department.name
                }
                return Response.successResponseData(
                    res,
                    new Transformer.List(response, student_transformer.detail).parse(),
                    constant.SUCCESS,
                    res.locals.__('success'),
                )
            } else {
                return Response.successResponseData(
                    res,
                    [],
                    constant.SUCCESS,
                    res.locals.__('noDataFound')
                )
            }
        })
    },
    downloadStudent: async (req,res) => {
        await Student.findAll({
            include:[{
                model:Department
            }]
        }).then((response) => {
            let dataArr = []
            if (response.length > 0) {
                response.map((student) => {
                    dataArr.push({
                        "First_name": student.first_name,
                        "Middle_name": student.middle_name,
                        "Last_name": student.last_name,
                        "Address": student.address,
                        "City": student.city,
                        "Mobile": student.mobile,
                        "Email": student.email,
                        "Department": student.Department.name,
                    })
                })
                res.setHeader('Content-Type', 'text/csv')
                res.setHeader(
                    'Content-Disposition',
                    'attachment; filename="' + 'download-' + Date.now() + '.csv"'
                )
                res.setHeader('Cache-Control', 'no-cache')
                res.setHeader('Pragma', 'no-cache')
                stringify(dataArr, { header: true }).pipe(res)
            } else {
                return Response.successResponseData(
                    res,
                    [],
                    constant.SUCCESS,
                    res.locals.__('noDataFound')
                )
            }
        })
    },
    importStudent:async (req,res) => {
        if (req.files.file && req.files.file.size > 0) {
            await Helper.excelValidation(req, res, req.files.file)
        } else {
            return Response.errorResponseWithoutData(
                res,
                res.__('fileIsRequired'),
                constant.BAD_REQUEST
            )
        }
        const fileName = `${moment().unix()}${path.extname(req.files.file.name)}`
        const fileUpload = await Helper.uploadFiles(
            req.files.file,
            'student',
            fileName
        )

        fs.readFile(fileUpload, async (err, data) => {
            if (err) {
                return Response.errorResponseWithoutData(
                    res,
                    res.__('fileIsRequired'),
                    constant.BAD_REQUEST
                )
            }
            const rows = await neatCsv(data)

            for (const record of rows) {
                const existing_student = await Student.findOne({
                    where:{
                        mobile:record.Mobile
                    }
                })
                if(!existing_student){
                    Department.create({
                        name:record.Department
                    }).then((d)=> {
                        Student.create({
                            department_id:d.id,
                            first_name: record.First_name,
                            last_name: record.Last_name,
                            middle_name: record.Middle_name,
                            city: record.City,
                            address: record.Address,
                            email: record.Email,
                            mobile: +record.Mobile
                        }).catch((e) => {
                            console.log(e)
                            return Response.errorResponseData(
                                res,
                                res.__('internalError'),
                                constant.INTERNAL_SERVER
                            )
                        })
                    }).catch((e) => {
                        console.log(e)
                        return Response.errorResponseData(
                            res,
                            res.__('internalError'),
                            constant.INTERNAL_SERVER
                        )
                    })
                }
            }
        })
        return Response.successResponseWithoutData(
            res,
            res.locals.__('dateUploadSuccess'),
            constant.SUCCESS
        )
    }
}
