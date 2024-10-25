import { base } from "@uploadcare/upload-client"
import { isProduction } from "./config";

//if content character
export const regexIsContentCharacter= /\S/;

export const URL_BASE = isProduction ? "https://app-ele-rose-back-iota.vercel.app/api/ele-rose/" : "http://localhost:5000/api/ele-rose/";

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
