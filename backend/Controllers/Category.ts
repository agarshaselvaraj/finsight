import { Request, Response } from 'express';
import CategoryService from '../Services/Category';

const add = async (req: Request, res: Response) => {
    try {
        const { name, color } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (!name || !color) {
            return res.status(400).json({
                message: "Name and color are required"
            });
        }

        const isSystem = false;
        const data = await CategoryService.add({ name, color, isSystem, userId });
        return res.status(201).json({ message: "New Category Created", data: data })
    }
    catch (error) {
        return res.status(500).json({ message: "Category not created" })
    }


}
const get = async (req: Request, res: Response) => {
    try {
        const UserId = req.user?.userId;
        if (!UserId) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const data = await CategoryService.get({ $or: [{ userId: UserId }, { isSystem: true }] });
        return res.status(200).json({ message: "Categories fetched Successfully", data: data });
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to fetch Categories" });
    }



}
const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: " Category Id is required" })
    }
    try {
        const data = await CategoryService.deleteCategory({ _id: id, userId: req.user?.userId, isSystem: false });
        if (!data) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json({ message: "Category deleted successfully" })
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to delete category" });
    }

}
const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, color } = req.body;
    if (!id) {
        return res.status(400).json({ message: " Category Id is required" })
    }
    try {
        if (!name && !color) {
            return res.status(400).json({
                message: "Name or color is required"
            });
        }

        const data = await CategoryService.updateCategory({
            _id: id,
            userId: req.user?.userId,
            isSystem: false
        },
            {
                name,
                color
            })
        return res.status(200).json({ message: "Category Updated Successfully", data })
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: "Failed to Update category" });
    }

}
export default { add, get, deleteCategory, updateCategory };