const Response = require("../service/response");
const Transformer = require("object-transformer");
const constant = require("../service/constant");
const product_transformer = require("../transformers/product");
const { addEditProduct } = require("../service/apiValidation");
const { Product, Cart } = require("../models");
const fs = require("fs");

module.exports = {
  addEditProduct: async (req, res) => {
    const reqParam = req.body;
    addEditProduct(reqParam, res, async (validate) => {
      if (reqParam.id) {
        await Product.findOne({
          where: {
            id: reqParam.id,
          },
        }).then(async (d) => {
          if (!d) {
            return Response.successResponseData(
              res,
              [],
              constant.SUCCESS,
              res.locals.__("productDoesNotExist")
            );
          } else {
            const temp_product = {
              product_name: reqParam.product_name,
              category: reqParam.category,
              sub_category: reqParam.sub_category,
              description: reqParam.description,
              status: reqParam.status,
              price: reqParam.price,
              qty: reqParam.qty
            }
            if(reqParam.image) {
              const type = reqParam.image.split(';')[0].split('/')[1];
              const searchValue = `data:image/${type};base64`
              const base64Data = reqParam.image.replace(
                  searchValue,
                  ""
              );
              const image_name = `${new Date().getTime()}.${type}`;
              await fs.writeFile(
                  `./public/${image_name}`,
                  base64Data,
                  "base64",
                  function (err) {
                    console.log(err);
                  }
              );
              temp_product.image = image_name
            }
            await Product.update(
                temp_product,
              {
                where: {
                  id: reqParam.id,
                },
              }
            );
            const product = await Product.findOne({
              where: {
                id: reqParam.id,
              },
            });
            return Response.successResponseData(
              res,
              new Transformer.Single(
                product,
                product_transformer.detail
              ).parse(),
              constant.SUCCESS,
              res.locals.__("success")
            );
          }
        });
      } else {
        const temp_product = {
          product_name: reqParam.product_name,
          category: reqParam.category,
          sub_category: reqParam.sub_category,
          description: reqParam.description,
          status: 1,
          qty: reqParam.qty,
          price: reqParam.price,
        }
        if(reqParam.image) {
          const type = reqParam.image.split(';')[0].split('/')[1];
          const searchValue = `data:image/${type};base64`
          const base64Data = reqParam.image.replace(
              searchValue,
              ""
          );
          const image_name = `${new Date().getTime()}.${type}`;
          await fs.writeFile(
              `./public/${image_name}`,
              base64Data,
              "base64",
              function (err) {
                console.log(err);
              }
          );
          temp_product.image = image_name
        }
        const product = await Product.create(temp_product);
        return Response.successResponseData(
          res,
          new Transformer.Single(product, product_transformer.detail).parse(),
          constant.SUCCESS,
          res.locals.__("success")
        );
      }
    });
  },
  getProducts: async (req, res) => {
    const products = await Product.findAndCountAll();
    if (products.count > 0) {
      return Response.successResponseData(
        res,
        new Transformer.List(products.rows, product_transformer.detail).parse(),
        constant.SUCCESS,
        res.locals.__("success"),
        {
          count: products.count,
        }
      );
    } else {
      return Response.successResponseData(
        res,
        [],
        constant.SUCCESS,
        res.locals.__("productDoesNotExist")
      );
    }
  },
  deleteProduct:async (req,res) => {
    const reqParam = req.params;
    if (reqParam.id) {
      const product = await Product.findOne({
        where: {
          id: reqParam.id,
        },
      });
      if (product) {
        const cart = await Cart.findAndCountAll({
          where:{
            product_id:product.id
          }
        })
        if(cart.count > 0){
          return Response.errorResponseData(
              res,
              res.locals.__('canNotDeleteItisincart'),
          )
        } else {
          await Product.destroy({
            where: {
              id: product.id
            }
          })
          return Response.successResponseData(
              res,
              [],
              constant.SUCCESS,
              res.locals.__("success")
          );
        }
      } else {
        return Response.successResponseData(
            res,
            [],
            constant.SUCCESS,
            res.locals.__("productDoesNotExist")
        );
      }
    } else {
      return Response.successResponseData(
          res,
          [],
          constant.SUCCESS,
          res.locals.__("productDoesNotExist")
      );
    }
  },
  getOneProducts: async (req, res) => {
    const reqParam = req.params;
    console.log(reqParam);
    if (reqParam.id) {
      const product = await Product.findOne({
        where: {
          id: reqParam.id,
        },
      });
      if (product) {
        return Response.successResponseData(
          res,
          new Transformer.Single(product, product_transformer.detail).parse(),
          constant.SUCCESS,
          res.locals.__("success")
        );
      } else {
        return Response.successResponseData(
          res,
          [],
          constant.SUCCESS,
          res.locals.__("productDoesNotExist")
        );
      }
    } else {
      return Response.successResponseData(
        res,
        [],
        constant.SUCCESS,
        res.locals.__("productDoesNotExist")
      );
    }
  },
};
