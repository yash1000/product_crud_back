const { User } = require("../models");
const Response = require("../service/response");
const Transformer = require("object-transformer");
const constant = require("../service/constant");
const user_transformer = require("../transformers/user");
const { addUser, singInUser } = require("../service/apiValidation");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');

module.exports = {
  signUp: async (req, res) => {
    const reqParam = req.body;
    addUser(reqParam, res, async (validate) => {
        await User.findOne({
            where:{
                email:reqParam.email
            }
        }).then(async (d) => {
            if(d){
                return Response.errorResponseData(
                    res,
                    res.locals.__('userAlredyExist'),
                )
            } else {
                const saltRounds = 10;
                const bycrpt_pass = await bcrypt.hash(reqParam.password, saltRounds);
                const user = await User.create({
                    email:reqParam.email,
                    name: reqParam.name,
                    role: reqParam.role,
                    password: bycrpt_pass,
                    username: reqParam.name,
                    language: reqParam.language,
                    currency: reqParam.currency,
                    active: 1
                })
                return Response.successResponseData(
                    res,
                    new Transformer.Single(user, user_transformer.detail).parse(),
                    constant.SUCCESS,
                    res.locals.__('success'),
                )
            }
        })
    })
  },
  signIn: async (req, res) => {
    const reqParam = req.body;
    singInUser(reqParam, res, async (validate) => {
        await User.findOne({
            where:{
                email:reqParam.email
            }
        }).then(async (d) => {
            if(d){
                const pass_check = await bcrypt.compare(reqParam.password, d.password);
                if(pass_check){
                    const token = await jwt.sign({ email: d.email }, process.env.JWT_SECRET);
                    d.token = token
                    return Response.successResponseData(
                        res,
                        new Transformer.Single(d, user_transformer.detail).parse(),
                        constant.SUCCESS,
                        res.locals.__('success'),
                    )
                } else {
                    return Response.errorResponseData(
                        res,
                        res.locals.__('wrongCred'),
                    )
                }
            } else {
                return Response.errorResponseData(
                    res,
                    res.locals.__('useDoesNotExist'),
                )
            }
        })
    })
  },
};
