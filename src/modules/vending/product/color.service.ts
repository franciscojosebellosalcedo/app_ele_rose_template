import { FecthRequestModel } from "../../../models/request.model"

export class ColorService {
  private textUrl: string = 'color'

  public static instance: ColorService

  private request: FecthRequestModel

  constructor() {
    this.request = FecthRequestModel.getInstance()
  }

  public static getInstance() {
    if (!ColorService.instance) {
      ColorService.instance = new ColorService()
    }
    return ColorService.instance
  }

  async getAllColors(token: string) {
    const response = await this.request.get(this.textUrl , token);
    return response
  }

}
