import classificationObject from "./classification.object";

export const findInClassification = (key: string) => {
    const classKeys: string[] = Object.keys(classificationObject)
    let keyFound: string | boolean = false
    classKeys.every(classKey => {
        if (classificationObject[classKey].includes(key)) {
            keyFound = classKey
            return false
        }
        return true
    })
    return keyFound
}