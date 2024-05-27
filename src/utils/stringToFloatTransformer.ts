/* eslint-disable class-methods-use-this */
export default class StringToFloatTransformer {
  to(data: number): number {
    return data
  }

  from(data: string): number {
    return parseFloat(data)
  }
}
