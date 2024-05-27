import CartProduct from './cartProductInterface'

// interface koristen da bi mogli kreirati klasu Cart
interface ICart {
  id: number
  products: CartProduct[]
  total: number
  discountedTotal: number
  userId: number
  totalProducts: number
  totalQuantity: number
}

export default ICart
