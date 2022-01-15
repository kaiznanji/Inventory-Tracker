const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InventoryItem = new Schema({
    name: { type: String, unique: true, required: true },
    quantity: { type: Number, default: 1 },
    purchaseCost: { type: Number, default: 0},
    tags: [{ type: String }]
});

module.exports = mongoose.model('InventoryItem', InventoryItem);