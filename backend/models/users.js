const mongoose = require('mongoose')
let Schema = mongoose.Schema;

let userSchema = new Schema({
    userEmail: { type: String, unique: true },
    userName: String,
    userPassword: String,
    timezone: String,
    currency: String,
    language: String,
    profilePicture: String,
    phoneNumber: String,
    invitedGroups: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    acceptedGroups: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    debts: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    transaction: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
}
    , { collection: 'users' }
)

module.exports = mongoose.model('userSchema', userSchema)