import { IAddresModel } from "../../models/models"
import { FecthRequestModel } from "../../models/request.model"

export class AddressService {
  private textUrl: string = 'address'

  public static instance: AddressService

  private request: FecthRequestModel

  constructor() {
    this.request = FecthRequestModel.getInstance()
  }

  public static getInstance() {
    if (!AddressService.instance) {
      AddressService.instance = new AddressService()
    }
    return AddressService.instance
  }

  async saveListAddress( listAddress: IAddresModel[] , token: string) {
    const response = await this.request.post(this.textUrl, listAddress , token);
    return response
  }

  async getAllAddressByEntityAndEntityId (entity: number , entityId: string , token : string){
    const response = await this.request.get(this.textUrl + `/${entity}/${entityId}`, token );
    return response;
  }

}
