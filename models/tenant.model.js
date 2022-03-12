const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
    tenant: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  propType: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  notificationDate: {
    type: String,
    required: true,
  },
  nDay: {
    type: Number,
    required: true,
  },
  nMonth: {
    type: Number,
    required: true,
  },
  nYear: {
    type: Number,
    required: true,
  },
  // createdBy: {
  //   type: Number,
  //   required: true,
  // }
});

module.exports = Tenant = mongoose.model("tenant", tenantSchema);

