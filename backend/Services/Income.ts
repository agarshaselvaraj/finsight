import Income from "../Models/Income";
const add = async (objtoSave: any) => {
    return Income.create(objtoSave);
}
const get = async (criteria: any = {}) => {
    return Income.find(criteria);
}
const deleteIncome = async (criteria: any = {}) => {
    return Income.deleteOne(criteria);
}
const updateIncome = async (criteria: any = {}, dataToSet: any = {}) => {
    return Income.updateOne(criteria, dataToSet)
}
const getOne = async (criteria: any = {}) => {
    return Income.findOne(criteria);
};
export default { add, get, deleteIncome, updateIncome, getOne };