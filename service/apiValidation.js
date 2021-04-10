const Joi = require('@hapi/joi')
const Response = require('./response')
const Helper = require('./Helper')

module.exports = {
    addStudent: (req, res, callback) => {
        const schema = Joi.object({
            id:Joi.number().optional(),
            email: Joi.string()
                .email({ tlds: { allow: false } })
                .max(250)
                .required(),
            department:Joi.string().max(50).required(),
            first_name:Joi.string().max(50).required(),
            middle_name:Joi.string().max(50).required(),
            last_name:Joi.string().max(50).required(),
            city:Joi.string().max(50).required(),
            address:Joi.string().max(250).required(),
            mobile:Joi.string().max(15).required(),
        })
        const { error } = schema.validate(req)
        if (error) {
            return Response.validationErrorResponseData(
                res,
                res.__(Helper.validationMessageKey('studentValidation', error))
            )
        }
        return callback(true)
    },
}
