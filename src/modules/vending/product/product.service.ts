import { IProduct, IProductImagen } from '../../../models/models'
import { FecthRequestModel } from '../../../models/request.model'

export class ProductService {
  private textUrl: string = 'product'

  public static instance: ProductService

  private request: FecthRequestModel

  constructor() {
    this.request = FecthRequestModel.getInstance()
  }

  public static getInstance() {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService()
    }
    return ProductService.instance
  }

  async saveProduct( values: {product: IProduct, listImagen: IProductImagen []} , token: string) {
    const { listImagen , ...restData} = values.product;
    values.product = restData;
    const response = await this.request.post(this.textUrl, values, token);
    return response
  }

  async getProducts(token: string) {
    const response = await this.request.get(this.textUrl, token)
    return response
  }

}
