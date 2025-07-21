const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const citySchema = new mongoose.Schema({
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'states', required: true }, // Reference to state
    name: { type: String, required: true, trim: true }, // City name (e.g., "Mumbai")
    code: { type: String, required: true, unique: true, trim: true }, // City code (e.g., "mumbai")
    isDeleted: { type: Boolean, default: false }, // Soft delete flag
}, { timestamps: true });
citySchema.plugin(mongoosePaginate);
citySchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('cities', citySchema);