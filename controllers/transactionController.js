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
    const oldTransaction = await Transaction.findOne({ _id: req.params.id, user_id: req.user._id });

    if (!oldTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const oldAccount = await Account.findById(oldTransaction.account_id);

    if (oldTransaction.type === "Income") {
      oldAccount.current_balance -= oldTransaction.amount;
    } else {
      oldAccount.current_balance += oldTransaction.amount;
    }
    await oldAccount.save();

    const updateTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });

    const newAccount = await Account.findById(updateTransaction.account_id);

    if (updateTransaction.type === "Income") {
      newAccount.current_balance += updateTransaction.amount;
    } else {
      newAccount.current_balance -= updateTransaction.amount;
    }
    await newAccount.save();
    res.status(200).json({ message: "Transaction updated", transaction: updateTransaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const account = await Account.findById(transaction.account_id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (transaction.type === "Income") {
      account.current_balance -= transaction.amount;
    } else {
      account.current_balance += transaction.amount;
    }

    await account.save();

    await transaction.deleteOne();

    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
