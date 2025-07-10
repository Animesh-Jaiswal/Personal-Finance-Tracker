const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

exports.setBudget = async (req, res) => {
  const { category, limit } = req.body;

  try {
    let budget = await Budget.findOne({ userId: req.user, category });

    if (budget) {
      budget.limit = limit;
      await budget.save();
    } else {
      budget = new Budget({ userId: req.user, category, limit });
      await budget.save();
    }

    res.json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user });
    res.json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.checkBudgetStatus = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user });
    let alerts = [];

    for (const b of budgets) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const totalSpent = await Expense.aggregate([
        {
          $match: {
            userId: b.userId,
            category: b.category,
            date: { $gte: startOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);

      const spent = totalSpent[0] ? totalSpent[0].total : 0;
      const percent = (spent / b.limit) * 100;

      if (percent >= 80 && percent < 100) {
        alerts.push(
          `Warning: You've spent ${percent.toFixed(
            1
          )}% of your '${b.category}' budget.`
        );
      } else if (percent == 100) {
        alerts.push(
          `Alert: You've spent ${percent.toFixed(
            1
          )}% of your '${b.category}' budget.`
        );
      } else if (percent > 100) {
        alerts.push(
          `Alert: You've exceeded your '${b.category}' budget!`
        );
      }
    }

    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) return res.status(404).json({ msg: 'Budget not found' });

    if (budget.userId.toString() !== req.user)
      return res.status(401).json({ msg: 'Not authorized' });

    budget.category = req.body.category || budget.category;
    budget.limit = req.body.limit || budget.limit;

    await budget.save();

    res.json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) return res.status(404).json({ msg: 'Budget not found' });

    if (budget.userId.toString() !== req.user)
      return res.status(401).json({ msg: 'Not authorized' });

    await budget.deleteOne();

    res.json({ msg: 'Budget deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

