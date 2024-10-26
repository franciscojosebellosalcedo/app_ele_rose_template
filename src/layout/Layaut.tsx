import React, { FC, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { IResponseHttp, IUserModel } from '../models/models'
import { CategoryService } from '../modules/vending/category/category.service'
import { setAllCategories } from '../features/category/categorySlice'
import "../config"
import { SetService } from '../modules/vending/set/set.service'
import { setAllSets } from '../features/set/setSlice'
import { ProductService } from '../modules/vending/product/product.service'
import { setAllProducts } from '../features/product/productSlice'

type Props={
  children: React.ReactNode
}

const categoryService: CategoryService = CategoryService.getInstance();

const setService : SetService = SetService.getInstance();

const productService : ProductService = ProductService.getInstance();

const Layaut: FC<Props> = ({children}) => {

  const user: IUserModel | undefined = useSelector((state: any) => state.user.data);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [

          categories, sets , products,

        ] = await Promise.all([ getCategories() , getSets(), getProducts()
        ])

        dispatch(setAllCategories(categories));

        dispatch(setAllSets(sets))

        dispatch(setAllProducts(products))

      } catch (error) {
        console.log(error)
      }
    }
    if (user) {
      fetchData()
    } else {
      console.log('not')
    }
  }, [])
  return <>{children}</>
}

export default Layaut
