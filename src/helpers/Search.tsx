import CIcon from "@coreui/icons-react";

import { cilSearch } from "@coreui/icons";
import { FC, useEffect, useState } from "react";
import { regexIsContentCharacter } from "../utils";
import { CButton, CSpinner } from "@coreui/react";

type Props ={
  handlerResetSearch: Function
  handlerSearch: Function
  placeholder: string
  isLoaderGet: boolean
}

const Search : FC<Props> = ({
  handlerResetSearch,
  placeholder,
  handlerSearch,
  isLoaderGet
}) => {

  const [value, setValue] = useState<string>("");

  const [isDisabled , setIsDisabled] = useState<boolean>(false);

  const handlerInputSearch = (value : string)=>{

    if(regexIsContentCharacter.test(value)){

      setIsDisabled(false);

    }else{

      setIsDisabled(true);
      handlerResetSearch();

    }
    setValue(value);

  }

  const handleFormKeyPress = (e: any) => {

    if(regexIsContentCharacter.test(value)){

      if (e.key === 'Enter') {
        e.stopPropagation();
        e.preventDefault();
        handlerSearch(value)
      }

    }

  };

  useEffect(() => {

    window.addEventListener("keydown", handleFormKeyPress);

    return () => {
      window.removeEventListener("keydown", handleFormKeyPress);
    };
  }, [value]);

  useEffect(()=>{

    if(regexIsContentCharacter.test(value)){

      setIsDisabled(false);

    }else{

      setIsDisabled(true);

    }

  },[value])

  return (
    <div className="d-flex align-items-center mb-3 mb-sm-0 " style={{ marginRight: '30px' }}>
      <div className="input-group">
        <input
          type="search"
          onInput={(e)=>handlerInputSearch(e.currentTarget.value)}
          className="form-control form-control-solid w-250px"
          placeholder={placeholder}
          value={value}
        />

        <CButton
        title="Buscar"
        style={{ border: '.3px solid #007bff' }}
        disabled = {isDisabled}
        onClick={(e)=>{
          e.preventDefault()
          handlerSearch(value);
        }}
        className="btn btn-icon btn-icon-primary ms-2">
          {
            isLoaderGet ?
              <CSpinner color="primary"/>
            :
            <CIcon icon={cilSearch} />
          }

        </CButton>

      </div>
    </div>
  )
}

export default Search;
