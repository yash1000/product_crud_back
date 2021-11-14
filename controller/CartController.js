const Response = require("../service/response");
const Transformer = require("object-transformer");
const constant = require("../service/constant");
const cart_transformer = require("../transformers/cart");
const { addCartVal, deleteCartVal } = require("../service/apiValidation");
const { Product, Cart } = require("../models");
const { Op } = require('sequelize')

module.exports = {
  addCart: async (req, res) => {
    const reqParam = req.body;
    addCartVal(reqParam, res, async (validate) => {
      const product = await Product.findOne({
        id: reqParam.id
      })
      if(product && product.qty >= reqParam.qty){
        const cart = await Cart.findOne({
          where:{
            user_id: req.user.id,
            product_id: reqParam.product_id
          }
        })
        if(cart && cart.qty <= product.qty){
          if(reqParam.qty == 0){
            await Cart.destroy({
              where:{
                id:cart.id
              }
            })
          } else {
            await Cart.update({
              qty:reqParam.qty
            },{
              where:{
                id:cart.id
              }
            })
          }
        } else {
          await Cart.create({
            qty:reqParam.qty,
            user_id: req.user.id,
            product_id: reqParam.product_id
          })
        }
        if(reqParam.qty > 0) {
          const updated_cart = await Cart.findOne({
            include: [{
              model: Product,
              where: {
                status: constant.ACTIVE,
              },
              required: true,
              attributes: ['product_name', 'category', 'sub_category', 'description', 'image', 'status', 'price', 'id'],
            }],
            where: {
              user_id: req.user.id,
              product_id: reqParam.product_id
            }
          })
          return Response.successResponseData(
              res,
              new Transformer.Single(
                  updated_cart,
                  cart_transformer.detail
              ).parse(),
              constant.SUCCESS,
              res.locals.__("success")
          );
        } else {
          return Response.successResponseData(
              res,
              [],
              constant.SUCCESS,
              res.locals.__("ItemDeletedSuccessFully")
          );
        }
      } else {
        return Response.successResponseData(
          res,
          [],
          constant.FAIL,
          res.locals.__("productIsOutOfQty")
        );
      }
    });
  },
  deleteCart: async (req, res) => {
    const reqParam = req.body;
    deleteCartVal(reqParam, res, async (validate) => {
      const cart = await Cart.findAll({
        where:{
          id: {
            [Op.in]: reqParam.ids,
          }
        }
      })
      if(cart && cart.length === reqParam.ids.length){
        await Cart.destroy({
          where:{
            id: {
              [Op.in]: reqParam.ids,
            }
          }
        })
        return Response.successResponseData(
            res,
            [],
            constant.SUCCESS,
            res.locals.__("success")
        );
      } else {
        return Response.errorResponseData(
            res,
            res.locals.__("pleaseEnterValidCartId")
        );
      }
    });
  },
  getCart: async (req, res) => {
    const cart = await Cart.findAll({
      include: [{
        model: Product,
        where: {
          status: 1,
        },
        required: true,
        attributes: ['product_name','category','sub_category','description','image','status','price','id'],
      }],
      where:{
        user_id: req.user.id,
      }
    })
    if(cart.length > 0) {
      return Response.successResponseData(
          res,
          new Transformer.List(
              cart,
              cart_transformer.detail
          ).parse(),
          constant.SUCCESS,
          res.locals.__("success")
      );
    } else {
      return Response.successResponseData(
          res,
          [],
          constant.SUCCESS,
          res.locals.__("productIsOutOfQty")
      );
    }
  }
};
