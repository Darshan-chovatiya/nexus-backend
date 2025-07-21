const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const stateSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Name of the state or union territory
    code: { type: String, required: true, unique: true }, // Code for the state or union territory
    isDeleted: { type: Boolean, default: false }, // Soft delete flag
}, { timestamps: true });
stateSchema.plugin(mongoosePaginate);
stateSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('states', stateSchema);