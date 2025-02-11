import { base } from "@uploadcare/upload-client"
import { isProduction } from "./config";
import { IDataInputSelect } from "./models/models";
import imageCompression from 'browser-image-compression';
import { CSSProperties } from "react";

// get item register
export const getRegisterById = <T,> (list : Array<T> , field : keyof T, value : any) : T | undefined =>{

  return list.find( (item) => item[field] === value);

}

// styles element absolut button
export const stylesElementAbsolute: CSSProperties = {
  position: 'absolute',
  top: 14,
  right: -8,
  height: 28,
  width: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: '#3498db',
  zIndex: 99
}

// compress file image
export const compressImage = async (file: any) => {

  const options = { maxSizeMB: 0.8 , maxWidthOrHeight: 800, useWebWorker: true, initialQuality: 0.7 };
  const compressedFile = await imageCompression(file, options);

  const renamedFile = new File([compressedFile], file.name, { type: compressedFile.type });

  return renamedFile;

}

// format date
export const formatDate = (dateString : string) => {

  if (dateString) {

    const [datePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-');

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

  } else {

    return "";

  }
}

// formated date short
export const formatDateShort = (date: Date | string | undefined) => {

  if(date){

    let formattedDay : any = null;
    let formattedMonth : any = null;
    let formattedYear : any = null;

    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

    if(typeof date === "object"){

      formattedDay  = date.getDate();
      formattedMonth  = months[date.getMonth()];
      formattedYear  = date.getFullYear() % 100;

      if (formattedDay < 10) {
        formattedDay = '0' + formattedDay;
      }

      if (formattedYear < 10) {
        formattedYear = '0' + formattedYear;
      }

    }else{

      const [year, month, day] = date.split('-').map(Number);

      formattedDay = day;
      formattedYear= year % 100;
      formattedMonth = months[month - 1];

      if (formattedDay < 10) {
        formattedDay = '0' + formattedDay;
      }

      if (formattedYear < 10) {
        formattedYear = '0' + formattedYear;
      }

      return `${formattedDay}-${formattedMonth}-${year}`;
    }

  }

  return `${""}-${""}-${""}`;


}

//if content character
export const regexIsContentCharacter= /\S/;

export const colorRedInfoInput = "#FF6666";

export const URL_BASE = isProduction ? "https://app-ele-rose-back.vercel.app/api/ele-rose/" : "http://localhost:5000/api/ele-rose/";

export const convertFileToBase64 = async (file: any) => {
  const promise = new Promise((resolve, reject) => {
    var reader = new FileReader()
    reader.onload = function (event) {
      resolve(event.target ? event.target.result : null)
    }
    reader.onerror = function (error) {
      reject(error)
    }
    reader.readAsDataURL(file)
  })

  return await promise
}

// format price
export const formatPrice = (price: number) => {

  let formattedPrice = price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  formattedPrice = formattedPrice.replace(/,/g, '.');

  return formattedPrice;
}


// upload files to uploadcare
export const handleSubmitFileUploadcare = async (imagenSelected: any) => {

  try {
    const result = await base(imagenSelected, {
      publicKey: "56c704ce776c0acebcfd",
      store: 'auto',
      metadata: {
        subsystem: 'uploader',
        description: 'file uploaded from React app'
      }
    });

    return result.file;

  } catch (error) {

    return  ""

  }
};

// create options input select
export const getOptionsInputSelect = <T,> (list: T[], propValue: keyof T , propLabel: Array<keyof T> ) : IDataInputSelect[] =>{

  const options : IDataInputSelect[] = [];

  if(list && list.length > 0){
    for (let index = 0; index < list.length; index++) {

      const item: any = list[index];

      let label : any = "";

      for (let j = 0; j < propLabel.length; j++) {

        const prop: any = propLabel[j];

        label += `${item[prop]} `;

      }

      const data : IDataInputSelect = {
        label: label,
        value: item[propValue]
      }

      options.push(data);

    }
  }

  return options;

}
