export const getProvince = async () => {
    const response = await fetch('/public/locations/index.json')
    return await response.json()
}

export const getDistrict = async (provinceName) => {
    const provinces = await getProvince()

    const filePath = provinces[provinceName]?.file_path

    const response = await fetch(`/public/${filePath}`)
    const data = await response.json()

    return data.district
}
