export default async function getAllAlbums() {
    const res = await fetch('  http://localhost:3000/api/albums', {
      method: 'GET',
      cache: 'force-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { tags: ['Albums'] },
    });
  
    return res.json().then((response) => response.albums);
  }