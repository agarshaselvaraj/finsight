import Category from "../Models/Category";
const add = async (objtoSave: any) => {
    return Category.create(objtoSave);
}
const get = async (criteria: any = {}) => {
    return Category.find(criteria);
}
const deleteCategory = async (criteria: any = {}) => {
    return Category.updateOne(
        criteria,
        {
            $set: {
                isActive: false
            }
        }
    );
};
const updateCategory = async (criteria: any = {}, dataToSet: any = {}) => {
    return Category.updateOne(criteria, dataToSet)
}
export default { add, get, deleteCategory, updateCategory };