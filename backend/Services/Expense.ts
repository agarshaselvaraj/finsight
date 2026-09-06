import Expense from "../Models/Expense";
const add = async (objtoSave: any) => {
    return Expense.create(objtoSave);
}
const get = async (criteria: any = {}) => {
    return Expense.find(criteria);
}
const deleteExpense = async (criteria: any = {}) => {
    return Expense.deleteOne(criteria);
}
const updateExpense = async (criteria: any = {}, dataToSet: any = {}) => {
    return Expense.updateOne(criteria, dataToSet)
}
export default { add, get, deleteExpense, updateExpense };