const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ProjectSchema = new mongoose.Schema({
  projectname: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  projectcity: {
    type: String,
    required: true,
  },
  projectstate: {
    type: String,
    required: true,
  },
  engineer: {
    type: String,
    required: true,
  },
});

ProjectSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    this.password = passwordHash;
    next();
  });
});
// cb is the "done" function from passport.js
ProjectSchema.methods.ComparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    else {
      if (!isMatch) return cb(null, isMatch);
      return cb(null, this);
    }
  });
};

module.exports = mongoose.model("Project", ProjectSchema);
