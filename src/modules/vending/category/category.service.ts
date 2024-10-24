import { FecthRequestModel } from '../../../models/request.model'

export class CategoryService {
  private textUrl: string = 'category'

  public static instance: CategoryService

  private request: FecthRequestModel

  constructor() {
    this.request = FecthRequestModel.getInstance()
  }

  public static getInstance() {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService()
    }
    return CategoryService.instance
  }

  async categories(token: string) {
    const response = await this.request.get(this.textUrl, token)
    return response
  }
}
