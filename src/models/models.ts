// export interface IOrderModel {
//   _id : string
//   clienteId : string
//   total : number
//   direccion : string
//   statusId : string
//   createdAt: Date
//   updatedAt: Date
// }
// export interface IOrder {
//   clienteId : string
//   total : number
// }

// export interface IPartOrderModel{
//   _id : string
//   productId : string
//   amount : number
//   total : number
//   createdAt: Date
//   updatedAt: Date
// }

export interface ITypeSupplierModel {
  _id?: string
  name: string
  status: number | boolean
  createdAt?: Date
  updatedAt?: Date
}
export interface ISupplierModel {
  _id: string
  name: string
  email: string
  phone: string
  typeId: string
  status: boolean
  createdAt?: Date
  updatedAt?: Date
}
export interface ISupplier {
  name: string
  email: string
  phone: string
  typeId: string
  status: number
}

export interface IPaymentShape{
  _id: string
  name:string
  status: boolean
  createdAt: Date
  updatedAt: Date
}
export interface IConditionPayment{
  _id: string
  name:string
  status: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IGrouperClientModel {
  _id: string
  name: string
  phone: string
  clientId: string
  createdAt?: Date
  updatedAt?: Date
  status: number
}
export interface IDataGrouperClientModel {
  grouperClient : IGrouperClientModel
  addressGrouper : IAddresModel[]
}

export interface IMunicipalityModel{
  _id: string
  departament: string
  name: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IDepartamentModel{
  _id: string
  name: string
  region: string
  createdAt?: Date
  updatedAt?: Date
}
export interface IAddresModel{
  _id: string
  entity: number
  entityId: string
  departament: string
  municipality: string
  description: string
  referencePoint: string
  status: number
  createdAt?: Date
  updatedAt?: Date
}

export interface IClient{
  name: string
  phone: string
  status: number
}
export interface IClientModel{
  _id: string
  name: string
  phone: string
  status: boolean
  createdAt: Date
  updatedAt: Date
}

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
  setId: string
  categoryId: string
  price: number
  amount:  number
  existence: number
  cost: number
  status: number

  listImagen?: IProductImagen[]
}
export interface IProductModel{
  _id: string
  name: string
  description: string
  setId: string
  categoryId: string
  price: number
  amount:  number
  existence: number
  cost: number
  status: boolean
  createdAt: Date
  updatedAt: Date

  listImagen ? : IProductImagen []

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
