import React, { FC, useEffect, useState } from 'react'

import { CSpinner } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import "../config"
import { setAllCategories } from '../features/category/categorySlice'
import { setAllClients } from '../features/client/clientSlice'
import { setAllColors } from '../features/color/colorSlice'
import { setAllDepartaments } from '../features/departament/departamentSlice'
import { setAllProducts } from '../features/product/productSlice'
import { setAllSets } from '../features/set/setSlice'
import { setAllSizes } from '../features/size/sizeSlice'
import { setAllTypesVariant } from '../features/typeVariant/typeVariantSlice'
import { DepartamentService } from '../global/services/departament.service'
import { IResponseHttp, IUserModel } from '../models/models'
import { CategoryService } from '../modules/vending/category/category.service'
import { ClientService } from '../modules/vending/client/client.service'
import { ColorService } from '../modules/vending/product/color.service'
import { ProductService } from '../modules/vending/product/product.service'
import { SizeService } from '../modules/vending/product/size.service'
import { TypeVariantService } from '../modules/vending/product/typeVariant.service'
import { SetService } from '../modules/vending/set/set.service'
import { setAllMunicipalities } from '../features/municipality/municipalitySlice'
import { MunicipalityService } from '../global/services/municipality.service'

type Props={
  children: React.ReactNode
}

const categoryService: CategoryService = CategoryService.getInstance();

const setService : SetService = SetService.getInstance();

const productService : ProductService = ProductService.getInstance();

const colorService : ColorService = ColorService.getInstance();

const sizeService : SizeService = SizeService.getInstance();

const typeVariantService : TypeVariantService = TypeVariantService.getInstance();

const clientService : ClientService = ClientService.getInstance();

const departamentService : DepartamentService = DepartamentService.getInstance();

const municipalityService : MunicipalityService = MunicipalityService.getInstance();

const Layaut: FC<Props> = ({children}) => {

  const user: IUserModel | undefined = useSelector((state: any) => state.user.data);

  const [isLoader , setIsLoader] = useState<boolean>(false);

  const dispatch = useDispatch()

  const getProducts = async () => {
    if (user?.accessToken) {
      try {
        const response: IResponseHttp = await productService.getProducts(user.accessToken);
        return response.data
      } catch (error) {
        return []
      }
    }
  }

  const getCategories = async () => {
    if (user?.accessToken) {
      try {
        const response: IResponseHttp = await categoryService.getCategories(user.accessToken);
        return response.data
      } catch (error) {
        return []
      }
    }
  }

  const getSets = async () => {
    if (user?.accessToken) {
      try {
        const response: IResponseHttp = await setService.getSets(user.accessToken);
        return response.data
      } catch (error) {
        return []
      }
    }

  }

  const getColors = async () => {
    if (user?.accessToken) {
      try {
        const response: IResponseHttp = await colorService.getAllColors(user.accessToken);
        return response.data
      } catch (error) {
        return []
      }
    }

  }

  const getSizes = async () => {
    if (user?.accessToken) {
      try {
        const response: IResponseHttp = await sizeService.getAllSize(user.accessToken);
        return response.data
      } catch (error) {
        return []
      }
    }
  }

  const getTypesVariants = async () => {
    if (user?.accessToken) {
      try {
        const response: IResponseHttp = await typeVariantService.getAllTypesVariant(user.accessToken);

        return response.data
      } catch (error) {
        return []
      }
    }
  }

  const getClients = async () => {
    if (user?.accessToken) {
      try {
        const response: IResponseHttp = await clientService.getClients(user.accessToken);
        return response.data
      } catch (error) {
        return []
      }
    }

  }

  const getDepartaments = async () => {
    if (user?.accessToken) {
      try {
        const response: IResponseHttp = await departamentService.getAllDepartaments(user.accessToken);
        return response.data
      } catch (error) {
        return []
      }
    }
  }

  const getMunipalities = async () => {
    if (user?.accessToken) {
      try {
        const response: IResponseHttp = await municipalityService.getAllMunicipalities(user.accessToken);
        return response.data
      } catch (error) {
        return []
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoader(true);
      try {
        const [

          categories, sets , products, colors , sizes , typesVariants, clients, departaments , municipalities

        ] = await Promise.all([ getCategories() , getSets(), getProducts(), getColors() , getSizes(), getTypesVariants(), getClients(),

          getDepartaments(), getMunipalities(),
        ])

        dispatch(setAllCategories(categories));

        dispatch(setAllSets(sets))

        dispatch(setAllProducts(products))

        dispatch(setAllColors(colors))

        dispatch(setAllSizes(sizes))

        dispatch(setAllTypesVariant(typesVariants))

        dispatch(setAllClients(clients))

        dispatch(setAllDepartaments(departaments))

        dispatch(setAllMunicipalities(municipalities))

      } catch (error) {
        console.log(error)
      }
      setIsLoader(false)


    }
    if (user) {
      fetchData()
    } else {
      console.log('not')
    }

  }, [user])
  return <>
    {
      isLoader ?
        <div style={{display:"flex", alignItems: "center", justifyContent:"center"}}><CSpinner color='primary'/></div>
      : children
    }
  </>
}

export default Layaut
