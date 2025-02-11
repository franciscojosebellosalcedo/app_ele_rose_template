import { ICategory, ICategoryModel, ISupplier, ISupplierModel } from '../../../models/models'
import { FecthRequestModel } from '../../../models/request.model'

export class SupplierService {
  private textUrl: string = 'supplier'

  public static instance: SupplierService

  private request: FecthRequestModel

  constructor() {
    this.request = FecthRequestModel.getInstance()
  }

  public static getInstance() {
    if (!SupplierService.instance) {
      SupplierService.instance = new SupplierService()
    }
    return SupplierService.instance
  }

  async getSuppliers(token: string) {
    const response = await this.request.get(this.textUrl, token)
    return response
  }

  async getSupplierById(  idSupplier: string , token: string) {
    const response = await this.request.get(this.textUrl + `/${idSupplier}`, token)
    return response
  }

  async createSupplier( data: ISupplier , token: string) {
    const response = await this.request.post(this.textUrl, data, token)
    return response
  }

  async paginateSupplier( page: number, itemsPerPage: number, token:string){
    const response= await this.request.get(this.textUrl +`/supplier/paginated?page=${page}&limit=${itemsPerPage}`,token);
    return response;
  }

  async search( value : string, token:string){
    const response= await this.request.get(this.textUrl+ `/search/${value}` , token);
    return response;
  }

  async changeStatusSupplier( supplier: ISupplierModel , token:string){
    const text=`${this.textUrl}/${supplier.status=== true ? 'disable':'enable'}/${supplier._id}`;
    const response= await this.request.put(text,null,token);
    return response;
  }

  async updateSupplierById(idSupplier: string , data: ISupplier, token:string){
    const text=`${this.textUrl}/${idSupplier}`;
    const response= await this.request.put(text, data , token);
    return response;
  }

}
