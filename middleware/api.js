const Response = require('../service/response')
var jwt = require('jsonwebtoken');
const { User } = require('../models')

module.exports = {
  apiShopTokenAuth: async (req, res, next) => {
      const token = req.headers.authorization
      if (!token) {
        Response.errorResponseData(res, res.locals.__('authorizationError'), 401)
      } else {
        const tokenData = await jwt.verify(token, 'jhagsdhjasdg')
        if (tokenData) {
              if (tokenData.email) {
                User.findOne({
                  where: {
                    email: tokenData.email,
                  },
                }).then((result) => {
                  if (!result) {
                    return Response.errorResponseData(
                        res,
                        res.locals.__('invalidToken'),
                        401
                    )
                  } else {
                    if (result && result.active === false) {
                      return Response.errorResponseData(
                          res,
                          res.locals.__('accountIsInactive'),
                          401
                      )
                    }
                    if (result && result.role !== 'SHOP') {
                      return Response.errorResponseData(
                          res,
                          res.locals.__('notAuthorized'),
                          401
                      )
                    }
                    if (result && result.dataValues.active === true) {
                      req.user = result.dataValues
                      return next()
                    } else {
                      return Response.errorResponseData(
                          res,
                          res.locals.__('accountBlocked'),
                          401
                      )
                    }
                  }
                })
              } else {
                Response.errorResponseData(res, res.locals.__('invalidToken'), 401)
              }
        } else {
          Response.errorResponseData(res, res.locals.__('invalidToken'), 401)
        }
      }
  },
  apiTokenAuth: async (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
      Response.errorResponseData(res, res.locals.__('authorizationError'), 401)
    } else {
      const tokenData = await jwt.verify(token, 'jhagsdhjasdg')
      if (tokenData) {
            if (tokenData.email) {
              User.findOne({
                where: {
                  email: tokenData.email,
                },
              }).then((result) => {
                if (!result) {
                  return Response.errorResponseData(
                      res,
                      res.locals.__('invalidToken'),
                      401
                  )
                } else {
                  if (result && result.active === false) {
                    return Response.errorResponseData(
                        res,
                        res.locals.__('accountIsInactive'),
                        401
                    )
                  }
                  if (result && result.dataValues.active === true) {
                    req.user = result.dataValues
                    return next()
                  } else {
                    return Response.errorResponseData(
                        res,
                        res.locals.__('accountBlocked'),
                        401
                    )
                  }
                }
              })
            } else {
              Response.errorResponseData(res, res.locals.__('invalidToken'), 401)
            }
      } else {
        Response.errorResponseData(res, res.locals.__('invalidToken'), 401)
      }
    }
},
}
