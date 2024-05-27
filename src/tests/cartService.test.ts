import Proizvod from '../entities/Proizvod'
import cartService from '../services/cartService'
import HttpError from '../utils/HttpError'

describe('cartService.checkIsQuantityValid', () => {
  it('should throw Http error if product quantity less then requested', async () => {
    const mockProduct = new Proizvod()
    mockProduct.kolicina = 5
    const mockQuantity = 10
    const t = () => {
      cartService.checkIsQuantityValid(mockProduct, mockQuantity)
    }
    expect(t).toThrow(HttpError)
  })

  it('should not throw Http error if product quantity more then requested', async () => {
    const mockProduct = new Proizvod()
    mockProduct.kolicina = 11
    const mockQuantity = 10
    const t = () => {
      cartService.checkIsQuantityValid(mockProduct, mockQuantity)
    }
    expect(t).not.toThrow(HttpError)
  })

  it('should not throw Http error if product quantity equal then requested', async () => {
    const mockProduct = new Proizvod()
    mockProduct.kolicina = 10
    const mockQuantity = 10
    const t = () => {
      cartService.checkIsQuantityValid(mockProduct, mockQuantity)
    }
    expect(t).not.toThrow(HttpError)
  })
})
