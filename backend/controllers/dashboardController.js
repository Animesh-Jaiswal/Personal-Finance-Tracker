const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

exports.getDashboardData = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const expenses = await Expense.find({
      userId: req.user,
      date: { $gte: startOfMonth },
    });

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    // 🔑 Sum category budgets
    const budgets = await Budget.find({ userId: req.user });
    const monthlyBudget = budgets.reduce((sum, b) => sum + b.limit, 0);

    const percentUsed =
      monthlyBudget > 0 ? ((totalSpent / monthlyBudget) * 100).toFixed(1) : 0;

    const categoryTotals = {};
    const paymentTotals = {};

    expenses.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
      paymentTotals[e.paymentMethod] = (paymentTotals[e.paymentMethod] || 0) + e.amount;
    });

    const topCategory = Object.keys(categoryTotals).reduce(
      (a, b) => (categoryTotals[a] > categoryTotals[b] ? a : b),
      ''
    );

    const topPayments = Object.entries(paymentTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([method, total]) => ({ method, total }));

    const pieChart = Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total,
    }));

    const lineChart = {};
    expenses.forEach(e => {
      const day = e.date.toISOString().split('T')[0];
      lineChart[day] = (lineChart[day] || 0) + e.amount;
    });

    const lineChartData = Object.entries(lineChart).map(([date, total]) => ({
      date,
      total,
    }));

    res.json({
      totalSpent,
      topCategory,
      topPayments,
      pieChart,
      lineChartData,
      monthlyBudget,
      percentUsed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
