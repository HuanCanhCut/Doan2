const uploadToCloudinary = async (file, folder, publicId) => {
    const UPLOAD_PRESET = 'real_estate'

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('folder', folder)
    formData.append('public_id', publicId)

    const response = await fetch(`https://api.cloudinary.com/v1_1/dkmwrkngj/image/upload`, {
        method: 'POST',
        body: formData,
    })

    return await response.json()
}

export default uploadToCloudinary
