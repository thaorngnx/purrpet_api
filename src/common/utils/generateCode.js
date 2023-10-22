import db from "../../models";

export const generateCode = async (collectionName, prefix) => {
    const collection = await db[collectionName].find().sort({ createAt: -1 }).limit(1);
    const lastCode = collection.length > 0 ? collection[0].purrPetCode : "";
    if (!lastCode) return prefix + "1";
    const lastNumber = lastCode.slice(prefix.length);
    const newNumber = (parseInt(lastNumber) + 1).toString();
    const newCode = prefix + newNumber;
    console.log(newCode);
    return newCode;
}