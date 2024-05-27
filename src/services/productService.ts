/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
import { IsNull } from 'typeorm'
import Proizvod from '../entities/Proizvod'
import Slika from '../entities/Slika'
import IProduct from '../models/interfaces/productInterface'
import products from '../models/productsModel'
import HttpError from '../utils/HttpError'
import ProductResponse from '../models/response/ProductResponse'

class ProductService {
  private products: IProduct[] = products

  async getAllProducts(): Promise<ProductResponse[]> {
    return (
      await Proizvod.find({
        relations: {
          slikas: true,
        },
        where: {
          deletedAt: IsNull(),
        },
      })
    ).map((p) => p.toProductResponse())
  }

  async getProductById(id: number): Promise<Proizvod> {
    const foundProduct = await Proizvod.findOne({
      relations: {
        slikas: true,
      },
      where: {
        proizvodId: id,
      },
    })
    if (!foundProduct)
      throw new HttpError(404, `Product with id ${id} not found`)
    return foundProduct
  }

  async updateProduct(
    productId: number,
    existingProduct: Proizvod,
  ): Promise<Proizvod> {
    const product = await this.getProductById(productId)
    product.updateExistingProduct(existingProduct)
    return product.save()
  }

  async deleteProductById(id: number): Promise<Proizvod> {
    const product = await this.getProductById(id)
    product.deletedAt = new Date()
    return product.save()
  }

  async addNewProduct(product: Proizvod): Promise<Proizvod> {
    const proizvod = Proizvod.create(product)
    await proizvod.save()
    if (proizvod.slikas && proizvod.slikas.length > 0)
      return this.addNewPicturesToExistingProduct(
        proizvod.proizvodId,
        proizvod.slikas,
      )
    return proizvod
  }

  async getProductPictures(productId: number): Promise<Slika[]> {
    const product = await this.getProductById(productId)
    return product.slikas
  }

  async addNewPicturesToExistingProduct(
    productId: number,
    newPictures: Slika[],
  ): Promise<Proizvod> {
    const product = await this.getProductById(productId)
    for await (const picture of newPictures) {
      const newPictureEntity = Slika.create(picture)
      newPictureEntity.proizvod = product
      await newPictureEntity.save()
    }
    return this.getProductById(productId)
  }

  async updateExistingPicturesInExistingProduct(
    updatePictures: Slika[],
  ): Promise<Slika[]> {
    const updatedPictures = new Array<Slika>()
    for await (const picture of updatePictures) {
      const existingPicture = await Slika.findOne({
        where: {
          slikaId: picture.slikaId,
        },
      })
      if (existingPicture) {
        existingPicture.isThumbnail = picture.isThumbnail
        existingPicture.link = picture.link
        existingPicture.naziv = picture.naziv
        existingPicture.opis = picture.opis
        existingPicture.proizvodId = picture.proizvodId
        updatedPictures.push(await existingPicture.save())
      }
    }
    return updatedPictures
  }

  async deletePictureById(id: number): Promise<Slika | void> {
    const existingPicture = await Slika.findOne({
      where: {
        slikaId: id,
      },
    })
    if (existingPicture) {
      return existingPicture.remove()
    }
    return undefined
  }
}

export default new ProductService()
