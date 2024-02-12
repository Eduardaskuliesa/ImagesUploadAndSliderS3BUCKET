"use client"

import React from "react";
import { useState } from "react";

import { getSignedULR } from "@/utils/getSignedUrl";
import uploadFileToS3 from "@/actions/client/album";


const UploadFormData = (
    ) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [images, setImages] = useState<FileList | null>(null);

    const [statusMessage, setStatusMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleImage = (e:React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            setImages(e.target.files)
        }
      }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        if(images?.length === 0){
            setStatusMessage('No files selected')
            return
        }

        setStatusMessage("creating")


        if(images){
            const formData = new FormData();
            // Append to form data
            formData.append('name', name);
            formData.append('date', date)
            for(let i = 0; i < images.length; i++){
                formData.append('file', images[i])
            };
            // Create presigned
            try{
                const response = await fetch('api/albums', {
                    method: 'POST',
                    body: formData
                });
                if(response.ok) {
                    console.log('Pre Signed Urls generated:' , response)
                    setStatusMessage('createdPreUrls')
                }

                const data = await response.json()
                const preSignedUrls = data.response
                console.log(preSignedUrls)
                

               for (let i = 0; i < images.length; i ++){
                const image = images[i];
                const { url } = preSignedUrls[i]
                const succes = await uploadFileToS3(image, url)
                if(!succes) {
                    throw new Error('baba')
                }
               }

               setStatusMessage('congratz')
            } catch(err) {
                console.error('Error in catch', err)
            };
        };
    };


    return (
        <>
          <form onSubmit={handleSubmit} className="flex center justify-center flex-col max-w-[400px] min-h-[400px] space-y-4 rounded-xl bg-white text-black p-4">
          {statusMessage && (
          <p className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 mb-4 rounded relative">
            {statusMessage}
          </p>
           )}
            <label>
                <input
                 className="ring-1 mt-2 ring-gray-400 w-full
                 rounded-md px-4 py-2 outline-none focus:ring-4 focus:ring-red-300"
                 placeholder="name"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 type="text" />
                 
            </label>
            <label className="">
                <input
                 className="ring-1 mt-2 ring-gray-400 w-full
                 rounded-md px-4 py-2 outline-none focus:ring-4 focus:ring-red-300"
                 placeholder="date"
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
                 type="text" />
                 
            </label>
            <label className="">
                <input
                 className="ring-1 mt-2 ring-gray-400 w-full
                 rounded-md px-4 py-2 outline-none focus:ring-4 focus:ring-red-300"
                 type="file"
                 name="media"
                 onChange={handleImage}
                 multiple
                 accept="image/jpeg, image/png"
                  />
            </label>
            <button type="submit" className="m-6 bg-red-900 text-white disabled:bg-gray-300 disabled:text-black font-bold
            rounded-lg px-6 py-2 hover:bg-transparent hover:text-red-900 border border-red-900 duration-300
            uppercase text-sm">
               stumti
            </button>
          </form>
        </>
    )
}

export default UploadFormData