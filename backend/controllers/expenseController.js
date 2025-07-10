const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
  const { amount, category, date, paymentMethod, notes } = req.body;
  try {
    const newExpense = new Expense({
      userId: req.user,
      amount,
      category,
      date,
      paymentMethod,
      notes,
    });

    await newExpense.save();
    res.json(newExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getExpenses = async (req, res) => {
  const { category, paymentMethod, fromDate, toDate } = req.query;

  let query = { userId: req.user };
  if (category) query.category = category;
  if (paymentMethod) query.paymentMethod = paymentMethod;
  if (fromDate || toDate) {
    query.date = {};
    if (fromDate) query.date.$gte = new Date(fromDate);
    if (toDate) query.date.$lte = new Date(toDate);
  }

  try {
    const expenses = await Expense.find(query);
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Not found' });

    if (expense.userId.toString() !== req.user)
      return res.status(401).json({ msg: 'Not authorized' });

    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Not found' });

    if (expense.userId.toString() !== req.user)
      return res.status(401).json({ msg: 'Not authorized' });

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
