export interface IDataResponsePagination {
	registers: any[]
	totalPages: number
	currentPage: number,
}


export interface ICategory{
  name: string
  imagen: string
  status: number
}
export interface ISet{
  name: string
  imagen: string
  status: number
}

export interface ISetModel{
  _id: string
  name: string
  imagen: string
  status: boolean
}
export interface ICategoryModel{
  _id: string
  name: string
  imagen: string
  status: boolean
}

export interface IUserModel {
  refressToken: string,
  accessToken: string ,
  user: {
    _id: string,
    email: string,
    name: string,
  },
}

export interface IResponseHttp{
  status: number
  message: string
  response: boolean
  data: any
}

export interface IDataLogin {
  email: string
  password: string
}
