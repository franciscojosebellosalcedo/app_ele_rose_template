import { IDataLogin } from "./models/models"
import { FecthRequestModel } from "./models/request.model"

export class UserService {
  private textUrl: string = 'user'

  public static instance: UserService

  private request: FecthRequestModel

  constructor() {
    this.request = FecthRequestModel.getInstance()
  }

  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  async login(values: IDataLogin) {
    const response = await this.request.post(this.textUrl + "/login", values);
    return response
  }

}
