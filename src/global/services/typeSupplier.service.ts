import { ITypeSupplierModel } from "../../models/models"
import { FecthRequestModel } from "../../models/request.model"

export class TypeSupplierService {

  private textUrl: string = 'typeSupplier'

  public static instance: TypeSupplierService

  private request: FecthRequestModel

  constructor() {
    this.request = FecthRequestModel.getInstance()
  }

  public static getInstance() {
    if (!TypeSupplierService.instance) {
      TypeSupplierService.instance = new TypeSupplierService()
    }
    return TypeSupplierService.instance
  }

  async getAllTypesSupplier(token: string) {
    const response = await this.request.get(this.textUrl , token);
    return response
  }

  async createTypeSupplier( data : ITypeSupplierModel , token: string ){
    const response = await this.request.post(this.textUrl , data , token );
    return response;
  }

}
