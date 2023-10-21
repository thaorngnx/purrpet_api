
export default class Exception extends Error {
    static CATEGORY_EXIST = 'Category already exists';
    static CATEGORY_NOT_FOUND = 'Category not found';
    static NOT_FOUND_PRODUCT = 'Product not found';
    constructor(message, validatorErrors = {}) {
        super(message); // call constructor of parent class(Error)
        console.log(message);
        this.validatorErrors = validatorErrors;
    }
}
