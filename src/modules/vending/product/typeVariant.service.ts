import { FecthRequestModel } from "../../../models/request.model"

export class TypeVariantService {
  private textUrl: string = 'typeVariant'

  public static instance: TypeVariantService

  private request: FecthRequestModel

  constructor() {
    this.request = FecthRequestModel.getInstance()
  }

  public static getInstance() {
    if (!TypeVariantService.instance) {
      TypeVariantService.instance = new TypeVariantService()
    }
    return TypeVariantService.instance
  }

  async getAllTypesVariant(token: string) {
    const response = await this.request.get(this.textUrl , token);
    return response
  }

}
