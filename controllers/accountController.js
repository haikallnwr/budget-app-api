const Account = require("../models/account");

exports.getAccount = async (req, res) => {
  try {
    const account = await Account.find({ user_id: req.user._id });
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const { name, type, init_balance } = req.body;
    const account = new Account({
      user_id: req.user._id,
      name,
      type,
      init_balance,
      current_balance: init_balance,
      isDefault: false,
    });
    await account.save();

    res.status(201).json({ message: "Account successfuly created", account: account });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!account) {
      return res.status(404).json({ message: "Account not foud" });
    }

    if (account.isDefault) {
      if (req.body.name || req.body.type) {
        return res.status(400).json({ message: "Default account cannot be edited" });
      }
    }

    const updated = await Account.findByIdAndUpdate(account._id, req.body, { new: true });
    res.status(201).json({ message: "Account updated", account: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (account.isDefault) {
      return res.status(400).json({ message: "Default account cannot be deleted" });
    }
    await account.deleteOne();

    res.status(200).json({ message: "Account successfuly deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
