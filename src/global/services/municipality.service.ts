import { FecthRequestModel } from "../../models/request.model"

export class MunicipalityService {
  private textUrl: string = 'municipality'

  public static instance: MunicipalityService

  private request: FecthRequestModel

  constructor() {
    this.request = FecthRequestModel.getInstance()
  }

  public static getInstance() {
    if (!MunicipalityService.instance) {
      MunicipalityService.instance = new MunicipalityService()
    }
    return MunicipalityService.instance
  }

  async getAllMunicipalities(token: string) {
    const response = await this.request.get(this.textUrl , token);
    return response
  }

}
