import { Photo } from "../types/photo"

export async function getPhotos(): Promise<Photo[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/photos")

    if (!res.ok) {
      throw new Error("Failed to fetch photos")
    }

    const data = await res.json()
    return data.photos
  } catch (error) {
    console.error("Error fetching photos:", error)
    return []
  }
}

export async function uploadPhoto(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  try {
    await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    })
  } catch (error) {
    console.error("Error uploading photo:", error)
  }
}