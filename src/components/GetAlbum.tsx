import getAllAlbums from '@/actions/client/albums'
import React from 'react'

type album = {
    _id: string,
    images: {
        url: string,
    }
}

const GetAlbum = async () => {

    const album = await getAllAlbums()
    const immgArray = album.map((albums) => albums.images[0].url)
  return (
    <div style={{
        width: '500px',
        height: '500px'
    }}><img src={immgArray} alt="" /></div>
  )
}

export default GetAlbum