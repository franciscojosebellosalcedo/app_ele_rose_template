import { ICategory, ICategoryModel } from '../../../models/models'
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

  async getCategories(token: string) {
    const response = await this.request.get(this.textUrl, token)
    return response
  }

  async saveCategory( data: ICategory , token: string) {
    const response = await this.request.post(this.textUrl, data, token)
    return response
  }

  async paginateCategory( page: number, itemsPerPage: number, token:string){
    const response= await this.request.get(this.textUrl +`/paginated?page=${page}&limit=${itemsPerPage}`,token);
    return response;
  }

  async search( value : string, token:string){
    const response= await this.request.get(this.textUrl+ `/search/${value}` , token);
    return response;
  }

  async changeStatusCategory(category: ICategoryModel , token:string){
    const text=`${this.textUrl}/${category.status=== true ? 'disable':'enable'}/${category._id}`;
    const response= await this.request.put(text,null,token);
    return response;
  }

  async updateCategoryById(idCategory: string , data: ICategory, token:string){
    const text=`${this.textUrl}/${idCategory}`;
    const response= await this.request.put(text, data , token);
    return response;
  }

}
