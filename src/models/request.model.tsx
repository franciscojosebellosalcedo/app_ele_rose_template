import { URL_BASE } from "../utils";

export class FecthRequestModel {
  public static instance: FecthRequestModel;
  private url:string;

  constructor() {
      this.url = URL_BASE;
  }

  public static getInstance() {
      if (!FecthRequestModel.instance){
          FecthRequestModel.instance = new FecthRequestModel();
      }
      return FecthRequestModel.instance;
  }


  private getOption(method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any, token?:string, haveFormData?:boolean, folder?: string ) {
    const _body = haveFormData ? body : JSON.stringify(body);
    const options = {
      method,
      ...(this.getFetchOptions(token, haveFormData, folder))

    };
    return body ? {...options, body: _body } : options ;
  }

  private statusError = ({ status, statusText }:{status:number,statusText:string}) => ({ status, statusText });


  private getFetchOptions(token?: string, haveFormData?:boolean, folder?: string): Record<string, unknown> {
   try {

      let resultOptions: Record<string, unknown> = { 'headers': { 'Content-Type': 'application/json' } };
      if (haveFormData) resultOptions = { 'headers': {} }
      if (token) {
        (resultOptions['headers'] as any)['access-x'] = `bearer ${token}`
      }
      if (token) {
        (resultOptions['headers'] as any)['folder'] = folder
      }
      return resultOptions;
   } catch (error) {
     throw this.handleError(error);
   }
  }

  private async handleResponse(response: any) {
    if (!response.ok) {
      if (response.status === 400 || (response.status >= 400 && response.status < 500)) {
        throw await response.json();
      } else {
        throw this.statusError(response);
      }
    }
    return response.json();
  }

  private handleError(error: any) {
    throw error;
  }

  private async callRequest(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any, token?:string, haveFormData?:boolean, folder?: string) {
    try {
      let options:any = { ...this.getOption(method, body, token, haveFormData, folder) };
      const getResponse = await fetch(url, { ...options });
      const result = await this.handleResponse(getResponse);
      return result;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async handleResponseBlob(response: any) {
    if (!response.ok) {
      if (response.status === 400 || (response.status >= 400 && response.status < 500)) {
        throw await response.blob();
      } else {
        throw this.statusError(response);
      }
    }
    return response.blob();
  }

  private async callRequestBlob(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any, token?: string, haveFormData?:boolean) {
    try {
      let options:any = { ...this.getOption(method, body, token, haveFormData) };
      const getResponse = await fetch(url, { ...options });
      const result = await this.handleResponseBlob(getResponse);
      result.name=getResponse.headers.get("NameFile");
      return {result, status: getResponse.status};
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private getCompleteURL(path:string) {
    return `${this.url}${path}`
  }

  get(path: string,token?:string) {
    const url = this.getCompleteURL(path);
    return this.callRequest(url, 'GET', null,token);
  }

  post(path: string, body:any, token?:string, haveFormData?:boolean, folder?: string ) {
    const url = this.getCompleteURL(path);
    return this.callRequest(url, 'POST', body ?? {}, token, haveFormData, folder);
  }

  put(path: string, body:any, token?:string, haveFormData?:boolean, folder?: string) {
    const url = this.getCompleteURL(path);
    return this.callRequest(url, 'PUT', body ?? {}, token, haveFormData , folder);
  }

  delete(path: string, body?:any, token?:string) {
    const url = this.getCompleteURL(path);
    return this.callRequest(url, 'DELETE', body ?? {}, token);
  }

  getBlob(path:string, token: string, body?:any){
    const url = this.getCompleteURL(path);
    return this.callRequestBlob(url, 'POST',body, token);
  }

  getBlobWithParams(path:string, token: string){
    const url = this.getCompleteURL(path);
    return this.callRequestBlob(url, 'GET', null, token);
  }
}
