export interface IProductImagen{
  idUpload:string
  imagen: string
  product: string
}

export interface IDataInputSelect{
  label: string
  value: string
}
export interface IProduct{
  name: string
  description: string
  set: string
  category: string
  amount: number
  percentage: number
  realPrice: number
  pricePromotion: number
  available:  number
  existence: number
  cost: number
  haveVariant: boolean
  typeVariant: string
  status: number

  listImagen?: IProductImagen[]
}
export interface IProductModel{
  _id: string
  name: string
  description: string
  set: string
  category: string
  amount: number
  percentage: number
  realPrice: number
  pricePromotion: number
  available:  number
  existence: number
  cost: number
  haveVariant: boolean
  typeVariant: string
  status: boolean

  listImagen ? : IProductImagen []

}

export interface IDataResponsePagination {
	registers: any[]
	totalPages: number
	currentPage: number,
}

export interface ITypeVariant{
  name: string
  status: number
}

export interface IColor{
  name: string
  status: number
}

export interface IColorModel{
  name: string
  status: boolean
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
