import { IDataGrouperClientModel } from '../../../models/models'
import { FecthRequestModel } from '../../../models/request.model'

export class GrouperClientService {

  private textUrl: string = 'grouperClient'

  public static instance: GrouperClientService

  private request: FecthRequestModel

  constructor() {
    this.request = FecthRequestModel.getInstance()
  }

  public static getInstance() {
    if (!GrouperClientService.instance) {
      GrouperClientService.instance = new GrouperClientService()
    }
    return GrouperClientService.instance
  }

  async saveGrouperClient( values: IDataGrouperClientModel[] , token: string) {
    const response = await this.request.post(this.textUrl, values, token);
    return response
  }

  async getGrouperClientByIdClient( idClient : string , token: string) {
    const response = await this.request.get(this.textUrl + `/groupersByIdClient/${idClient}` , token);
    return response
  }

}
