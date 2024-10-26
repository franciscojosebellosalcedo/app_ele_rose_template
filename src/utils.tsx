import { base } from "@uploadcare/upload-client"
import { isProduction } from "./config";
import { IDataInputSelect } from "./models/models";

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
