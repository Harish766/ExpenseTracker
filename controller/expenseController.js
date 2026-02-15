const Expense = require('../models/expenseModel');
exports.addExpense = async(req,res)=>{
     try {
    const { title, amount, category, type, date } = req.body;
    const expense = await Expense.create({
        title,
        amount,
        category,
        type,
        date,
        user:req.user._id
    });
    res.status(201).json({
      status: 'success',
      data: expense
    });
}catch(err){
     res.status(400).json({
      status: 'fail',
      message: err.message
    });
}
};
exports.getExpense = async(req,res)=>{
    try {
        const expenses = await Expense.find({user:req.user._id})
        .sort({date:-1});
        res.status(200).json({
            status:'success',
            results:expenses.length,
            data:expenses
        });
    } catch (err) {
        res.status(400).json({
            status:'fail',
            message:err.message
        });
    }
};
exports.updateExpense = async(req,res)=>{
    try {
        const expense = await Expense.findById(req.params.id);
        if(!expense){
            return res.status(404).json({
                message:'Expense Not Found'
            });
        }
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to update this expense'
      });
    }
    const updatedExpense = await Expense.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new:true,
            runValidators:true
        }
    );
    res.status(200).json({
      status: 'success',
      data: updatedExpense
    });
    } catch (err) {
         res.status(400).json({
            status:'failed to Update!!!',
            message:err.message
        });
    }
}
exports.deleteExpense = async(req,res)=>{
    try {
        const expense = await Expense.findById(req.params.id);
        if(!expense){
            return res.status(404).json({
                message:'Expense not found'
            });
        }
        if(expense.user.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message:'Not authorized to delete this expense'
            });
        }
        await Expense.findByIdAndDelete(req.params.id);
          res.status(200).json({
          status: 'success',
          message: 'Expense deleted'
    });     
    } catch (err) {
         res.status(400).json({
            status:'failed to Delete!!!',
            message:err.message
        });
    }
}
exports.getMonthlySummary = async(req,res)=>{
    try {
        const now = new Date();

        const startOfMonth  = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );
        const endOfMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,59,59
        );
     const summary = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    summary.forEach(item => {
      if (item._id === "income") {
        totalIncome = item.total;
      } else if (item._id === "expense") {
        totalExpense = item.total;
      }
    });

    res.status(200).json({
      status: "success",
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    });       
    } catch (err) {
        res.status(400).json({
      status: "fail",
      message: err.message
    });
    }
};
exports.getCategoryBreakdown = async (req, res) => {
  try {
    const breakdown = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          type: "expense"
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    const formatted = breakdown.map(item => ({
      category: item._id,
      total: item.total
    }));

    res.status(200).json({
      status: "success",
      data: formatted
    });

  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message
    });
  }
};
