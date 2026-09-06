import User from "../Models/User";
const add = async (objtoSave: any) => {
    return User.create(objtoSave);
}
const get = async (criteria: any = {}) => {
    return User.find(criteria);
}
export default { add, get };