export default function selectObject(array, key, value) {
    const selectObj = array.map(item => {
        return {
            value: item[key],
            label: item[value]
        }
    })
    return selectObj || []
}