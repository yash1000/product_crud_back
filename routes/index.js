const route = require('express').Router()
const UserController = require('../controller/UserController')
const ProductController = require('../controller/ProductController')
const CartController = require('../controller/CartController')
const connect = require('connect')
// const formidableMiddleware = require('express-formidable')
const { apiShopTokenAuth, apiTokenAuth } = require('../middleware/api')

const authShopMiddleware = (() => {
    const chain = connect();
    [apiShopTokenAuth].forEach((middleware) => {
      chain.use(middleware)
    })
    return chain
  })()
const authMiddleware = (() => {
    const chain = connect();
    [apiTokenAuth].forEach((middleware) => {
      chain.use(middleware)
    })
    return chain
  })()

//   const authMiddlewareWithFormidable = (() => {
//     const chain = connect()
//     ;[formidableMiddleware(), apiTokenAuth].forEach((middleware) => {
//       chain.use(middleware)
//     })
//     return chain
//   })()
route.post('/sign-up', UserController.signUp)
route.post('/sign-in', UserController.signIn)
route.post('/add-edit-product', authShopMiddleware, ProductController.addEditProduct)
route.get('/get-products', authMiddleware, ProductController.getProducts)
route.get('/product/:id', authMiddleware, ProductController.getOneProducts)
route.post('/add-cart', authMiddleware, CartController.addCart)
route.get('/get-cart', authMiddleware, CartController.getCart)
route.post('/delete-cart', authMiddleware, CartController.deleteCart)
route.delete('/delete-product/:id', authMiddleware, ProductController.deleteProduct)


module.exports = route

