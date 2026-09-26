import User from "../Models/User";
const add = async (objtoSave: any) => {
    return User.create(objtoSave);
}
const get = async (criteria: any = {}, selectPassword = false) => {
    const query = User.find(criteria);
    if (selectPassword) {
        query.select("+password");
    }
    return query;
}
export default { add, get };