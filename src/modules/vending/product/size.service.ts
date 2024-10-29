import { FecthRequestModel } from "../../../models/request.model"

export class SizeService {
  private textUrl: string = 'size'

  public static instance: SizeService

  private request: FecthRequestModel

  constructor() {
    this.request = FecthRequestModel.getInstance()
  }

  public static getInstance() {
    if (!SizeService.instance) {
      SizeService.instance = new SizeService()
    }
    return SizeService.instance
  }

  async getAllSize(token: string) {
    const response = await this.request.get(this.textUrl , token);
    return response
  }

}
