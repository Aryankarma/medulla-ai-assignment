"use client"

import { useState } from "react"
import { ImageUpload } from "@/components/editor/image-upload"
import { ImageEditor } from "@/components/editor/image-editor"

export default function EditorPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  if (!uploadedImage) {
    return <ImageUpload onImageUpload={setUploadedImage} />
  }

  return <ImageEditor originalImage={uploadedImage} onBack={() => setUploadedImage(null)} />
}
