import Expense from "../Models/Expense";
const add = async (objtoSave: any) => {
    return Expense.create(objtoSave);
}
const get = async (criteria: any = {}) => {
    if (criteria.month) {
        const [year, month] = criteria.month.split('-');
        const startdate = new Date(Number(year), Number(month) - 1, 1);
        const enddate = new Date(Number(year), Number(month), 1);
        delete criteria.month;
        criteria.date = {
            $gte: startdate,
            $lt: enddate
        };


    }
    return Expense.find(criteria).populate("category");
}
const deleteExpense = async (criteria: any = {}) => {
    return Expense.deleteOne(criteria);
}
const updateExpense = async (criteria: any = {}, dataToSet: any = {}) => {
    return Expense.updateOne(criteria, dataToSet)
}
export default { add, get, deleteExpense, updateExpense };