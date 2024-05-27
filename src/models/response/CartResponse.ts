import Racun from '../../entities/Racun'
import ProductResponse from './ProductResponse'
import UserResponse from './UserResponse'

export default class CartResponse {
  cartId!: number

  isProcessed!: boolean | null

  status!: string | null

  total!: number | null

  buyerInformation!: UserResponse

  deliveryInformation!: UserResponse

  invoice!: Racun

  cartProducts!: ProductResponse[]
}
