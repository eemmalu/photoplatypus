"use client"

import { useEffect, useState } from "react"
import { Photo } from "./types/photo"
import { getPhotos, uploadPhoto } from "./lib/api"

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadPhotos() {
      const data = await getPhotos();
      setPhotos(data);
    }

    loadPhotos();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    // If there are no files uploaded, return
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    setUploading(true);
    await uploadPhoto(file);
    setUploading(false);
    const data = await getPhotos();
    setPhotos(data);
  }

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-8">My AI Photo Gallery</h1>
      <div className="mb-6">
        <input type="file" onChange={handleUpload}/>
        {uploading && <p>Uploading...</p>} 
      </div>

      <div className="grid grid-cols-3 gap-6">
        {photos.map(photo => (
          <div key={photo.id} className="border rounded-xl p-2 shadow">
            <img
              src={`http://127.0.0.1:8000/${photo.filepath}`}
              alt={photo.filename}
              className="rounded-lg"
            />
            <p className="text-sm mt-2">{photo.filename}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
