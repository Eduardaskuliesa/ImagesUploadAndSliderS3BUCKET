export default async function uploadFileToS3(file, preSignedUrl) {
    try{
        const response = await fetch(preSignedUrl,{
            method: 'PUT',
            headers:{
                'Content-Type': 'multipart/form-data',
            },
            body: file
        });
        
        if(response.ok) {
            console.log('Upload successful')
            return true
        }else{
            console.error('Upload failed', response.statusText)
            return false
        }
    }catch(err){
        console.error('Error uploading file', err)
        return false
    }
  }