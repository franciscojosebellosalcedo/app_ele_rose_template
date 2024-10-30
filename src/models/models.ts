export interface IDataVariantModel{
  _id: string
  valueVariant: any
  amount: number
  product: string
  typeVariant: string
}

export interface ITypeVariantModel{
  _id: string
  name:string
  status: boolean
  createdAt: Date
  updatedAt: Date
}

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
  haveDiscount: boolean
  typeVariant: string
  cost: number
  haveVariant: boolean
  status: number

  listImagen?: IProductImagen[]
  listVariants?: IDataVariantModel[]
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
  haveDiscount: boolean
  existence: number
  cost: number
  haveVariant: boolean
  typeVariant: string
  status: boolean
  createdAt: Date
  updatedAt: Date

  listImagen ? : IProductImagen []
  listVariants ? : IDataVariantModel []

}

export interface IDataResponsePagination {
	registers: any[]
	totalPages: number
	currentPage: number,
}

export interface ISize{
  name: string
  status: number
}

export interface IColor{
  name: string
  status: number
}

export interface ISizeModel{
  _id: string
  name: string
  status: boolean
  createdAt: Date
  updatedAt: Date
}
export interface IColorModel{
  _id: string
  name: string
  status: boolean
  createdAt: Date
  updatedAt: Date
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
  createdAt: Date
  updatedAt: Date
}
export interface ICategoryModel{
  _id: string
  name: string
  imagen: string
  status: boolean
  createdAt: Date
  updatedAt: Date
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
