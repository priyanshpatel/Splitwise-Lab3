const mongoose = require('mongoose')
let Schema = mongoose.Schema;

let debtSchema = new Schema({
    groupId: mongoose.Schema.Types.ObjectId,
    userId1: mongoose.Schema.Types.ObjectId,
    userId2: mongoose.Schema.Types.ObjectId,
    amount: Number
}
    , {
        collection: 'debts',
        versionKey: false
    }
)

module.exports = mongoose.model('debtSchema', debtSchema)