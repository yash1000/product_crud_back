const Joi = require('@hapi/joi')
const Response = require('./response')
const Helper = require('./Helper')

module.exports = {
    addUser: (req, res, callback) => {
        const schema = Joi.object({
            email: Joi.string()
                .email({ tlds: { allow: false } })
                .max(250)
                .required(),
            name:Joi.string().max(50).required(),
            role:Joi.string().max(50).required(),
            userName:Joi.string().max(50).required(),
            password:Joi.string().max(50).required(),
            language:Joi.string().max(250).required(),
            currency:Joi.string().max(15).required(),
        })
        const { error } = schema.validate(req)
        if (error) {
            return Response.validationErrorResponseData(
                res,
                res.__(Helper.validationMessageKey('userValidation', error))
            )
        }
        return callback(true)
    },
    singInUser: (req, res, callback) => {
        const schema = Joi.object({
            email: Joi.string()
                .email({ tlds: { allow: false } })
                .max(250)
                .required(),
            password:Joi.string().max(50).required(),
        })
        const { error } = schema.validate(req)
        if (error) {
            return Response.validationErrorResponseData(
                res,
                res.__(Helper.validationMessageKey('userSignInValidation', error))
            )
        }
        return callback(true)
    },
    addEditProduct: (req, res, callback) => {
        const schema = Joi.object({
            id: Joi.number().optional(),
            product_name: Joi.string().max(50).required(),
            category:Joi.string().max(50).required(),
            sub_category:Joi.string().max(50).required(),
            price:Joi.number().required(),
            description:Joi.string().max(1500).required(),
            image:Joi.string().optional(),
            status:Joi.required(),
            qty:Joi.number().required(),
        })
        const { error } = schema.validate(req)
        if (error) {
            return Response.validationErrorResponseData(
                res,
                res.__(Helper.validationMessageKey('productValidation', error))
            )
        }
        return callback(true)
    },
    addCartVal: (req, res, callback) => {
        const schema = Joi.object({
            qty: Joi.number().required(),
            product_id: Joi.number().max(50).required(),
        })
        const { error } = schema.validate(req)
        if (error) {
            return Response.validationErrorResponseData(
                res,
                res.__(Helper.validationMessageKey('cartValidation', error))
            )
        }
        return callback(true)
    },
    deleteCartVal: (req, res, callback) => {
        const schema = Joi.object({
            ids: Joi.array().required(),
        })
        const { error } = schema.validate(req)
        if (error) {
            return Response.validationErrorResponseData(
                res,
                res.__(Helper.validationMessageKey('cartValidation', error))
            )
        }
        return callback(true)
    },
}
