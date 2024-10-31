import { FecthRequestModel } from "../../models/request.model"

export class DepartamentService {
  private textUrl: string = 'departament'

  public static instance: DepartamentService

  private request: FecthRequestModel

  constructor() {
    this.request = FecthRequestModel.getInstance()
  }

  public static getInstance() {
    if (!DepartamentService.instance) {
      DepartamentService.instance = new DepartamentService()
    }
    return DepartamentService.instance
  }

  async getAllDepartaments(token: string) {
    const response = await this.request.get(this.textUrl , token);
    return response
  }

}
