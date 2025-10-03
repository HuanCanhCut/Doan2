export const getProvince = async () => {
    const response = await fetch('/locations/index.json')
    return await response.json()
}

export const getDistrict = async (provinceName) => {
    const provinces = await getProvince()

    const filePath = provinces[provinceName]?.file_path

    const response = await fetch(filePath)
    const data = await response.json()

    return data.district
}
