import { Request, Response } from 'express'
import productService from '../services/productService'
import Proizvod from '../entities/Proizvod'
import Slika from '../entities/Slika'

const getAllProducts = async (req: Request, res: Response) => {
  res.send(await productService.getAllProducts())
}

const getProductById = async (req: Request, res: Response) => {
  res.send(
    await productService.getProductById(Number.parseInt(req.params.id, 10)),
  )
}

const updateProductById = async (req: Request, res: Response) => {
  const productId = Number.parseInt(req.params.id, 10)
  const existingProduct = req.body as Proizvod
  res.send(await productService.updateProduct(productId, existingProduct))
}

const createProduct = async (req: Request, res: Response) => {
  const newProduct = req.body as Proizvod
  res.send(await productService.addNewProduct(newProduct))
}

const deleteProductById = async (req: Request, res: Response) => {
  res.send(
    await productService.deleteProductById(Number.parseInt(req.params.id, 10)),
  )
}

const getProductPictures = async (req: Request, res: Response) => {
  const productId = Number.parseInt(req.params.id, 10)
  res.send(await productService.getProductPictures(productId))
}

const addProductPictures = async (req: Request, res: Response) => {
  const productId = Number.parseInt(req.params.id, 10)
  const newPictures = req.body as Slika[]
  res.send(
    await productService.addNewPicturesToExistingProduct(
      productId,
      newPictures,
    ),
  )
}

const updatePictures = async (req: Request, res: Response) => {
  const pictures = req.body as Slika[]
  res.send(
    await productService.updateExistingPicturesInExistingProduct(pictures),
  )
}

const deletePictureById = async (req: Request, res: Response) => {
  res.send(
    await productService.deletePictureById(Number.parseInt(req.params.id, 10)),
  )
}

export {
  getAllProducts,
  getProductById,
  createProduct,
  addProductPictures,
  updateProductById,
  deleteProductById,
  getProductPictures,
  updatePictures,
  deletePictureById,
}
