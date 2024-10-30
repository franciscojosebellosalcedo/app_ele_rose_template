import { IDataVariantModel, IProduct, IProductImagen, IProductModel } from '../../../models/models'
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

  async saveProduct( values: {product: IProduct, listImagen: IProductImagen [], listVariants: IDataVariantModel[]} , token: string) {
    const { listImagen , ...restData} = values.product;
    values.product = restData;
    const response = await this.request.post(this.textUrl, values, token);
    return response
  }

  async search( value : string, token:string){
    const response= await this.request.get(this.textUrl+ `/search/${value}` , token);
    return response;
  }

  async paginateProducts( page: number, itemsPerPage: number, token:string){
    const response= await this.request.get(this.textUrl +`/paginated?page=${page}&limit=${itemsPerPage}`,token);
    return response;
  }

  async changeStatusProduct(product: IProductModel , token:string){
    const text=`${this.textUrl}/${product.status=== true ? 'disable':'enable'}/${product._id}`;
    const response= await this.request.put(text,null,token);
    return response;
  }

  async updateProductById( id: string , values: { product: IProduct, listImagen: IProductImagen [], listVariants: IDataVariantModel[], listRemovedVariants: string[], listRemovedImagens: string[] } , token:string){
    const response= await this.request.put(this.textUrl + `/${id}`, values, token);
    return response;
  }

  async getProducts(token: string) {
    const response = await this.request.get(this.textUrl, token)
    return response
  }

  async getProductById( idProduct: string , token: string) {
    const response = await this.request.get(this.textUrl + `/oneProduct/${idProduct}`, token)
    return response
  }

}
