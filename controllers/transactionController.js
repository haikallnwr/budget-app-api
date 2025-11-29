const Transaction = require("../models/transaction");
const Account = require("../models/account");

exports.createTransaction = async (req, res) => {
  try {
    const { account_id, category_id, type, amount, description, date } = req.body;
    const newTransaction = new Transaction({
      user_id: req.user._id,
      account_id,
      category_id,
      type,
      amount,
      description,
      date,
    });
    await newTransaction.save();

    //automatic update balance
    const account = await Account.findById(account_id);
    if (type === "Income") {
      account.current_balance += parseFloat(amount);
    } else {
      account.current_balance -= parseFloat(amount);
    }
    await account.save();

    res.status(201).json({ message: "Transaction successfully created", transaction: newTransaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.find({ user_id: req.user._id }).populate("category_id", "name type").populate("account_id", "name").sort({ createdAt: -1 });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    })
      .populate("category_id", "name type")
      .populate("account_id", "name");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id }, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction updated", transaction: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
