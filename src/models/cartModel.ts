import Kosarica from '../entities/Kosarica'

// Cart klasa nam treba da bi pratili stanje kosarice
// a posto se ona dinamicki generira jer nemamo gotov JSON
// onda je bolje da je kreiramo sa klasom i rijeci new pri exportu
class Cart extends Kosarica {
  public get products() {
    return this.proizvodKupacs.map((pk) => {
      const product = pk.proizvod
      product.updateQuantityAndPrice(pk.kolicina, pk.cijena)
      return product
    })
  }
}

export default Cart
