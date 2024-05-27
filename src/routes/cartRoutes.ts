import express from 'express'
import {
  getCart,
  getCartById,
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart,
  clearCart,
  purchaseCartById,
} from '../controllers/cartController'
import AuthMiddleware from '../middlewares/authHandler'
import Role from '../models/enums/Role'

const router = express.Router()

// dohvat cije kosarice
router.get(
  '/',
  AuthMiddleware.authenticateJWT,
  AuthMiddleware.authorizeRoles([Role.Admin, Role.User, Role.Manager]),
  getCart,
)
router.get('/:id', getCartById)
router.post('/:id/purchase', purchaseCartById)
// dodavanje proizvoda na kosaricu pomocu product id-a
router.post('/:cartId/products/:productId/add', addProductToCart)
router.put('/:cartId/products/:productId', updateProductQuantity)
router.delete('/:cartId/products/:productId', removeProductFromCart)
// ciscenje kosarice
router.delete('/:cartId/products', clearCart)

export default router
