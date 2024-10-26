import { ISet, ISetModel } from '../../../models/models'
import { FecthRequestModel } from '../../../models/request.model'

export class SetService {
  private textUrl: string = 'set';

  public static instance: SetService

  private request: FecthRequestModel

  constructor() {
    this.request = FecthRequestModel.getInstance()
  }

  public static getInstance() {
    if (!SetService.instance) {
      SetService.instance = new SetService()
    }
    return SetService.instance
  }

  async getSets(token: string) {
    const response = await this.request.get(this.textUrl, token)
    return response
  }

  async saveSet( data: ISet , token: string) {
    const response = await this.request.post(this.textUrl, data, token)
    return response
  }

  async paginateSet( page: number, itemsPerPage: number, token:string){
    const response= await this.request.get(this.textUrl +`/set/paginated?page=${page}&limit=${itemsPerPage}`,token);
    return response;
  }

  async search( value : string, token:string){
    const response= await this.request.get(this.textUrl+ `/search/${value}` , token);
    return response;
  }

  async changeStatusSet(category: ISetModel , token:string){
    const text=`${this.textUrl}/${category.status=== true ? 'disable':'enable'}/${category._id}`;
    const response= await this.request.put(text,null,token);
    return response;
  }

  async updateSetById(idCategory: string , data: ISet, token:string){
    const text=`${this.textUrl}/${idCategory}`;
    const response= await this.request.put(text, data , token);
    return response;
  }

}
