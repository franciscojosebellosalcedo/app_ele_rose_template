import { IClient, IClientModel } from '../../../models/models'
import { FecthRequestModel } from '../../../models/request.model'

export class ClientService {
  private textUrl: string = 'client'

  public static instance: ClientService

  private request: FecthRequestModel

  constructor() {
    this.request = FecthRequestModel.getInstance()
  }

  public static getInstance() {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService()
    }
    return ClientService.instance
  }

  async saveClient( values: IClient, token: string) {
    const response = await this.request.post(this.textUrl, values, token);
    return response
  }

  async changeStatusClient( client: IClientModel , token:string ){
    const text=`${this.textUrl}/${client.status=== true ? 'disable':'enable'}/${client._id}`;
    const response= await this.request.put(text,null,token);
    return response;
  }

  async search( value : string, token:string){
    const response= await this.request.get(this.textUrl+ `/search/${value}` , token);
    return response;
  }

  async paginateClients( page: number, itemsPerPage: number, token:string){
    const response= await this.request.get(this.textUrl +`/client/paginated?page=${page}&limit=${itemsPerPage}`,token);
    return response;
  }

  async updateClientById( id: string , values: IClient , token:string){
    const response= await this.request.put(this.textUrl + `/${id}`, values, token);
    return response;
  }

  async getClients(token: string) {
    const response = await this.request.get(this.textUrl, token)
    return response
  }

  async getClientById( idClient: string , token: string) {
    const response = await this.request.get(this.textUrl + `/oneClient/${idClient}`, token)
    return response
  }

}
