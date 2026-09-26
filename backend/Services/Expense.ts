import mongoose from "mongoose";
import Expense from "../Models/Expense";
import Category from "../Models/Category";
const add = async (objtoSave: any) => {
    return Expense.create(objtoSave);
}
const count = async (criteria: any = {}) => {
    if (criteria.month) {
        const [year, month] = criteria.month.split("-");

        const startdate = new Date(Number(year), Number(month) - 1, 1);
        const enddate = new Date(Number(year), Number(month), 1);

        delete criteria.month;

        criteria.date = {
            $gte: startdate,
            $lt: enddate,
        };
    }

    return Expense.countDocuments(criteria);
};
const get = async (criteria: any = {}) => {
    const skip = Number(criteria.skip) || 0;
    const limit = Number(criteria.limit) || 10;
    delete criteria.skip;
    delete criteria.limit;
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
    return Expense.find(criteria).populate("category").skip(skip).limit(limit);
}
const deleteExpense = async (criteria: any = {}) => {
    return Expense.deleteOne(criteria);
}
const updateExpense = async (criteria: any = {}, dataToSet: any = {}) => {
    return Expense.updateOne(criteria, dataToSet)
}
const ExpenseSummary = async (criteria: any = {}) => {
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
    if (criteria.userId && typeof criteria.userId === "string") {
        criteria.userId = new mongoose.Types.ObjectId(criteria.userId);
    }
    return Expense.aggregate([
        { $match: criteria },
        {
            $facet: {
                totalExpense: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$amount" }
                        }
                    }
                ],
                categoryBreakdown: [
                    {
                        $group: {
                            _id: "$category",
                            total: { $sum: "$amount" }
                        }
                    },
                    {
                        $lookup: {
                            from: "categories",
                            localField: "_id",
                            foreignField: "_id",
                            as: "category"
                        }
                    },
                    {
                        $unwind: "$category"
                    },
                    {
                        $project: {
                            _id: 0,
                            categoryId: "$_id",
                            name: "$category.name",
                            color: "$category.color",
                            total: 1
                        }
                    }
                ]
            }
        }
    ]);
}
const weeklyTrends = async (criteria: any = {}) => {
    const selectedDate = new Date(criteria.week);
    const StartDate = new Date(selectedDate);
    const day = StartDate.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    StartDate.setDate(StartDate.getDate() + diff);
    StartDate.setHours(0, 0, 0, 0);
    const endDate = new Date(StartDate);
    endDate.setDate(endDate.getDate() + 7);
    const expenses = await Expense.aggregate([{
        $match: {
            userId: new mongoose.Types.ObjectId(criteria.userId),
            date: {
                $gte: StartDate,
                $lt: endDate,
            },
        },

    },
    {
        $group: {
            _id: {
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$date",
                },
            },
            total: { $sum: "$amount" },
        },
    }, {
        $sort: { _id: 1 },
    },]);
    const weeklyData = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(StartDate);
        date.setDate(StartDate.getDate() + i);

        const dateString = date.toISOString().split("T")[0];

        const expense = expenses.find((item) => item._id === dateString);

        weeklyData.push({
            day: date.toLocaleDateString("en-US", { weekday: "short" }),
            date: dateString,
            expense: expense ? expense.total : 0,
        });
    }

    return weeklyData;

}
export default { add, get, deleteExpense, updateExpense, ExpenseSummary, count, weeklyTrends };