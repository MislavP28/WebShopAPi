/* eslint-disable prefer-destructuring */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
import fs from 'fs'
import { parse } from 'csv'
import path from 'path'
import Proizvod from '../entities/Proizvod'
import FileImportTracker from '../entities/FileImportTracker'

export default class ProductImporter {
  static async loadAllProducts(): Promise<void> {
    if (!process.env.IMPORTS_FOLDER_PATH) {
      console.log('import folder not a path')
      return
    }
    const allFilePathsInDirectory = (
      await fs.promises.readdir(process.env.IMPORTS_FOLDER_PATH, {
        withFileTypes: true,
      })
    )
      .filter((file) => file.isFile() && file.name.split('.').pop() === 'csv')
      .map((file) => file.name)
    try {
      for await (const fileName of allFilePathsInDirectory) {
        const alreadyImported = await FileImportTracker.exists({
          where: {
            name: fileName,
          },
        })

        if (alreadyImported) continue

        const parser = await fs
          .createReadStream(
            path.join(process.env.IMPORTS_FOLDER_PATH, fileName),
            'utf8',
          )
          .pipe(
            parse({
              // CSV options if any
              delimiter: ',',
            }),
          )
        for await (const record of parser) {
          const proizvod =
            ProductImporter.ConvertCSVRecordToProizvodEntity(record)
          await proizvod.save()
        }
        const importTracker = new FileImportTracker()
        importTracker.name = fileName
        await importTracker.save()
        console.log(`Imported file: ${fileName}`)
      }
    } catch (err) {
      console.log(err)
    }
  }

  private static ConvertCSVRecordToProizvodEntity(record: string[]): Proizvod {
    const product = new Proizvod()
    product.imeProizvoda = record[0]
    product.proizvodjac = record[1]
    product.opis = record[2]
    product.cijena = Number.parseFloat(record[3])
    product.kolicina = Number.parseInt(record[4], 10)
    return product
  }
}
