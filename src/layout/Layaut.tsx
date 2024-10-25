import React, { FC, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { IResponseHttp, IUserModel } from '../models/models'
import { CategoryService } from '../modules/vending/category/category.service'
import { setAllCategories } from '../features/category/categorySlice'

type Props={
  children: React.ReactNode
}

const categoryService: CategoryService = CategoryService.getInstance();

const Layaut: FC<Props> = ({children}) => {

  const user: IUserModel | undefined = useSelector((state: any) => state.user.data);

  const dispatch = useDispatch()

  const getCategories = async () => {
    if (user?.accessToken) {
      try {
        const response: IResponseHttp = await categoryService.getCategories(user.accessToken);
        return response.data
      } catch (error) {
        throw error
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [

          categories

        ] = await Promise.all([ getCategories() ,
        ])

        dispatch(setAllCategories(categories));

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
