import db from "../../models";

export const generateCode = async (collectionName, prefix) => {
    const collection = await db[collectionName].find();
    const lastCode = collection.length ? collection[collection.length - 1].purrPetCode : 0;
    if (lastCode === 0) {
        return (prefix + 1).toString();
    }
    const lastNumber = lastCode.slice(prefix.length);
    const newNumber = (parseInt(lastNumber) + 1).toString();
    const newCode = prefix + newNumber;
    return newCode;
}