const mongoose = require('mongoose')
let Schema = mongoose.Schema;

let groupBalanceSchema = new Schema({
    balance: Number,
    userId: mongoose.Schema.Types.ObjectId,
}, {
    _id: false,
    versionKey: false
})

let groupsSchema = new Schema({
    groupName: { type: String, unique: true },
    createdBy: String,
    createDate: String,
    groupPicture: String,
    acceptedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    invitedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    expenses: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    transaction: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    debts: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    groupBalances: [groupBalanceSchema]
}
    , { collection: 'groups' }
)

module.exports = mongoose.model('groupsSchema', groupsSchema)