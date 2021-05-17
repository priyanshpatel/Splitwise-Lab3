const graphql = require("graphql");
let bcrypt = require("bcrypt");
let comments = require("../models/comments");
let debts = require("../models/debts");
let expenses = require("../models/expenses");
let groups = require("../models/groups");
let transaction = require("../models/transaction");
let users = require("../models/users");
const getIndexOfGroupBalances = require('./getIndexOfGroupBalances');

const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLFloat,
} = graphql;

// schema types

const userType = new GraphQLObjectType({
    name: "user",
    fields: () => ({
        _id: { type: GraphQLID },
        userEmail: { type: GraphQLString },
        userName: { type: GraphQLString },
        userPassword: { type: GraphQLString },
        timezone: { type: GraphQLString },
        currency: { type: GraphQLString },
        language: { type: GraphQLString },
        profilePicture: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        invitedGroups: { type: new GraphQLList(GraphQLString) },
        acceptedGroups: { type: new GraphQLList(GraphQLString) },
        debts: { type: new GraphQLList(GraphQLString) },
        transaction: { type: new GraphQLList(GraphQLString) },
    }),
});

const transactionType = new GraphQLObjectType({
    name: "transaction",
    fields: () => ({
        _id: { type: GraphQLID },
        groupId: { type: GraphQLString },
        groupName: { type: GraphQLString },
        expId: { type: GraphQLString },
        paidByUserId: { type: GraphQLString },
        paidByUserName: { type: GraphQLString },
        paidForUserId: { type: GraphQLString },
        paidForUserName: { type: GraphQLString },
        tranType: { type: GraphQLString },
        amount: { type: GraphQlFloat },
        settleFlag: {
            type: GraphQLString
        },
        settledDate: { type: GraphQLString }
    })
});

const groupBalanceType = new GraphQLObjectType({
    name: "groupBalance",
    fields: () => ({
        // _id: { type: GraphQLID },
        balance: { type: GraphQLString },
        userId: { type: GraphQLString },
    })
});

const groupType = new GraphQLObjectType({
    name: "groups",
    fields: () => ({
        _id: { type: GraphQLID },
        groupName: { type: GraphQLString },
        createdBy: { type: GraphQLString },
        createDate: { type: GraphQLString },
        groupPicture: { type: GraphQLString },
        acceptedUsers: { type: new GraphQLList(GraphQLString) },
        invitedUsers: { type: new GraphQLList(GraphQLString) },
        expenses: { type: new GraphQLList(GraphQLString) },
        transaction: { type: new GraphQLList(GraphQLString) },
        debts: { type: new GraphQLList(GraphQLString) },
        groupBalances: { type: new GraphQLList(groupBalanceType) },
    })
});

const groupListType = new GraphQLObjectType({
    name: "groupListType",
    fields: () => ({
        groups: { type: new GraphQLList(groupType) }
    })
})

const userListType = new GraphQLObjectType({
    name: "userListType",
    fields: () => ({
        users: { type: new GraphQLList(userType) }
    })
})

const expenseType = new GraphQLObjectType({
    name: "expense",
    fields: () => ({
        _id: { type: GraphQLID },
        description: { type: GraphQLString },
        amount: { type: GraphQLString },
        groupId: { type: GraphQLString },
        groupName: { type: GraphQLString },
        paidByUserId: { type: new GraphQLList(GraphQLString) },
        paidByUserName: { type: new GraphQLList(GraphQLString) },
        settledWithUserName: { type: new GraphQLList(GraphQLString) },
        currency: { type: new GraphQLList(GraphQLString) },
        paidByUserGetsBack: { type: new GraphQLList(GraphQLString) },
        eachUserOwes: { type: new GraphQLList(groupBalanceType) },
        settleFlag: {
            type: GraphQLString
        },
        settledWithUserId: { type: GraphQLString },
        transactions: { type: GraphQLString },
    })
});

const debtType = new GraphQLObjectType({
    name: "debt",
    fields: () => ({
        _id: { type: GraphQLID },
        groupId: { type: GraphQLString },
        userId1: { type: GraphQLString },
        userId2: { type: GraphQLString },
        amount: { type: GraphQLFloat },
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // get Profile
        viewProfile: {
            type: userType,
            args: {
                userId: {
                    type: GraphQLString
                },
            },
            resolve(parent, args) {
                console.log("In viewProfile " + args.userId)
                return users.findOne(
                    { _id: args.userId }
                ).then(doc => {
                    return doc
                }).catch(error => {
                    return error
                })
            }

        },

        // Group Search
        groupSearch: {
            type: groupListType,
            args: {
                userId: {
                    type: GraphQLString
                },
                keyword: {
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                const userId = args.userId
                const userInput = args.keyword

                try {
                    let groupSchemaDoc = await groups.find(
                        {
                            $and: [
                                { acceptedUsers: { $in: userId } },
                                { groupName: { $regex: ".*" + userInput + ".*" } }
                            ]
                        },
                        {
                            groupName: 1
                        }
                    )
                    // res.status(200).send(groupSchemaDoc)
                    console.log(groupSchemaDoc)
                    return { groups: groupSchemaDoc }
                } catch (error) {
                    console.log("Error while searching groups", error)
                    // res.status(500).send(error)
                    return error
                }
            }
        },

        // Group User Search
        groupUserSearch: {
            type: userListType,
            args: {
                userId: {
                    type: GraphQLString
                },
                keyword: {
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                const userInput = args.keyword
                const doc = await users.find(
                    {
                        $and: [
                            {
                                $or: [{
                                    userName: { $regex: ".*" + userInput + ".*" }
                                },
                                { userEmail: { $regex: ".*" + userInput + ".*" } }
                                ]
                            },
                            {
                                _id: { $ne: args.userId }
                            }
                        ]
                    },
                    {
                        userEmail: 1,
                        userName: 1
                    }
                )
                console.log(doc)
                return { users: doc }
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // User Login
        userLogin: {
            type: userType,
            args: {
                email: {
                    type: GraphQLString
                },
                userPassword: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log("In user login " + args.email)
                return users.findOne({ userEmail: args.email }).then(doc => {
                    if (bcrypt.compareSync(args.userPassword, doc.userPassword)) {
                        let payload = {
                            _id: doc._id,
                            userEmail: doc.userPassword,
                            userName: doc.userName
                        }
                        console.log("login successfull", payload)
                        return doc
                    } else {
                        return "invalid credentials"
                    }
                }).catch(error => {
                    console.log("User Not Found", error)
                    return error
                })
            },
        },

        //User Signup
        userSignup: {
            type: userType,
            args: {
                userName: {
                    type: GraphQLString
                },
                userEmail: {
                    type: GraphQLString
                },
                userPassword: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log("In user signup", args)

                let user = new users({
                    userEmail: args.userEmail,
                    userName: args.userName,
                    userPassword: bcrypt.hashSync(args.userPassword, 10),
                    timezone: "",
                    currency: "",
                    language: "",
                    profilePicture: ""
                })

                return user.save().then(response => {
                    console.log("Sign up successful", response)
                    return response
                }).catch(error => {
                    console.log("error while signing up", error)
                    return error
                })
            }
        },

        // Update Profile
        updateProfile: {
            type: userType,
            args: {
                userId: { type: GraphQLString },
                userName: { type: GraphQLString },
                userEmail: { type: GraphQLString },
                phoneNumber: { type: GraphQLString },
                currency: { type: GraphQLString },
                timezone: { type: GraphQLString },
                language: { type: GraphQLString },
                profilePicture: { type: GraphQLString }
            },
            resolve(parent, args) {
                console.log("In user update profile", args)

                // let imagePath = null;

                // if (req.file) {
                //     imagePath = req.file.path.substring(req.file.path.indexOf("/") + 1);
                // }
                // console.log("Inside update profile post");

                return users.updateOne(
                    { _id: args.userId },
                    {
                        $set: {
                            userName: args.userName,
                            userEmail: args.userEmail,
                            phoneNumber: args.phoneNumber,
                            currency: args.currency,
                            timezone: args.timezone,
                            language: args.language,
                            // profilePicture: imagePath
                        }
                    }
                ).then(response => {
                    console.log("Profile updated", response)
                }).catch(error => {
                    console.log("Error while updating profile", error)
                    return error
                })
            }
        },

        // Create Group
        createGroup: {
            type: groupType,
            args: {
                groupName: { type: GraphQLString },
                createdBy: { type: GraphQLString },
                groupPicture: { type: GraphQLString },
                acceptedUsers: { type: new GraphQLList(GraphQLString) },
                invitedUsers: { type: new GraphQLList(GraphQLString) }
            },
            async resolve(parent, args) {
                console.log("In create group", args)
                const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
                let groupSaveResponse = null;
                // let imagePath = null;
                // if (req.file) {
                //     imagePath = req.file.path.substring(req.file.path.indexOf("/") + 1);
                // }

                let invitedUsersSplit = args.invitedUsers + ''

                let group = new groups({
                    groupName: args.groupName,
                    createdBy: args.createdBy,
                    createDate: ts,
                    // groupPicture: imagePath,
                    acceptedUsers: args.acceptedUsers,
                    invitedUsers: invitedUsersSplit.split(',')
                })
                try{
                let response = await group.save()
                console.log("Group created successfully", response)
                groupSaveResponse = response
                const groupId = response._id
                let invitedUsersArr = invitedUsersSplit.split(',')

                response = await users.find({ _id: { $in: invitedUsersArr } })
                console.log("============invited users=================");
                console.log(invitedUsersArr);
                response.forEach(async function (user) {
                    console.log("=-=-=-=-=-=-=-=-=-=-=-=", user)
                try{    
                    let doc =  await users.findByIdAndUpdate({ _id: user._id }
                        , { $push: { invitedGroups: groupId } }, { new: true }
                    )
                    console.log("successfully updated invited group", doc);
                    }
                    catch(error){
                        console.log(error)
                        return error
                    }  
                })

                response = await users.find({ _id: { $in: args.acceptedUsers } })
                      
                console.log("============accepted users=================");
                console.log(args.acceptedUsers);

                response.forEach(async function (user) {
                    try{
                    let doc = await users.findByIdAndUpdate({ _id: user._id }
                        , { $push: { acceptedGroups: groupId } }, { new: true }
                    )
                    console.log("successfully updated accepted group", doc);
                    return {group: groupSaveResponse}
                    }
                    catch(error){
                        console.log(error)
                        return error
                    }
                })
            }
            catch(error) {
                console.log("error while creating group", error)
                return error
            }
////////////
                // return group.save().then(response => {
                //     console.log("Group created successfully", response)
                //     groupSaveResponse = response
                //     const groupId = response._id
                //     let invitedUsersArr = invitedUsersSplit.split(',')

                //     users.find({ _id: { $in: invitedUsersArr } })
                //         .then(response => {
                //             console.log("============invited users=================");
                //             console.log(invitedUsersArr);

                //             response.forEach(function (user) {
                //                 console.log("=-=-=-=-=-=-=-=-=-=-=-=", user)
                //                 users.findByIdAndUpdate({ _id: user._id }
                //                     , { $push: { invitedGroups: groupId } }, { new: true }
                //                 ).then(doc => {
                //                     console.log("successfully updated invited group", doc);

                //                 }).catch(error => {
                //                     console.log("error", error);
                //                     return error
                //                 })
                //             })
                //         })

                //     users.find({ _id: { $in: args.acceptedUsers } })
                //         .then(response => {
                //             console.log("============accepted users=================");
                //             console.log(args.acceptedUsers);

                //             response.forEach(function (user) {
                //                 users.findByIdAndUpdate({ _id: user._id }
                //                     , { $push: { acceptedGroups: groupId } }, { new: true }
                //                 ).then(doc => {
                //                     console.log("successfully updated accepted group", doc);
                //                     return groupSaveResponse
                //                     // return doc
                //                 }).catch(error => {
                //                     console.log("error", error);
                //                 })
                //             })

                //         }).catch(error => {
                //             console.log("error while creating group", error)
                //             return error
                //         })
                // })
            }
        },

        // Add Expense
        addExpense: {
            type: groupType,
            args: {
                description: { type: GraphQLString },
                amount: { type: GraphQLString },
                groupId: { type: GraphQLString },
                paidByUserId: { type: GraphQLString },
                currency: { type: GraphQLString },
                comments: { type: GraphQLString },
                userId: { type: GraphQLString },
            },
            async resolve(parent, args) {
                // let transaction = null
                let expId = null
                let groupMembers = []
                let tranType = 3
                let transactionList = []
                let tranIdList = []
                let expenseList = []
                let debtList = []

                let expense = new expenses({
                    description: args.description,
                    amount: args.amount,
                    groupId: args.groupId,
                    paidByUserId: args.userId,
                    currency: args.currency,
                    comments: args.comments
                })

                try {
                    let userNameDoc = await users.findOne({ _id: args.userId }, { userName: 1 })
                    expense.paidByUserName = userNameDoc.userName

                    let groupSchemaDoc = await groups.findOne({ _id: args.groupId })
                    expense.groupName = groupSchemaDoc.groupName
                    groupMembers = groupSchemaDoc.acceptedUsers

                    expense.paidByUserGetsBack = (args.amount - (args.amount / groupMembers.length)).toFixed(2)
                    expense.eachUserOwes = (args.amount / groupMembers.length).toFixed(2)

                    let expenseResponse = await expense.save()
                    console.log("Expense added successfully", expenseResponse)
                    expId = expenseResponse._id
                    expenseList.push(expId)

                    console.log(groupSchemaDoc)
                    console.log(groupMembers)

                    let groupBalances = groupSchemaDoc.groupBalances

                    for (const member of groupMembers) {
                        let settleFlag = 'N'
                        if (member == args.userId) {
                            tranType = 3
                            settleFlag = 'Y'
                        } else {
                            tranType = 6
                        }
                        let groupMembersNameDoc = await users.findOne({ _id: member }, { userName: 1 })
                        //Create Transactions
                        transaction_ = new transaction({
                            groupId: args.groupId,
                            expId: expId,
                            paidByUserId: args.userId,
                            paidForUserId: member,
                            tranType: tranType,
                            amount: (args.amount / groupMembers.length).toFixed(2),
                            settleFlag: settleFlag,
                            groupName: groupSchemaDoc.groupName,
                            paidByUserName: userNameDoc.userName,
                            paidForUserName: groupMembersNameDoc.userName
                        })
                        let transactionResponse = await transaction_.save()
                        console.log("transaction added successfully ", transactionResponse)

                        // Create a list of transaction ids
                        tranIdList.push(transactionResponse._id)

                        // Add transaction ids to user schema for users except paid by user
                        if (member != args.userId) {
                            let userSchemaUpdTran = await users.updateOne(
                                { _id: member },
                                { $push: { transaction: transactionResponse._id } }
                            )
                            console.log("Transactions added successfully to paidfor user schema")
                        }

                        // Update debts
                        let updGroupBalance = null
                        let groupBalanceIndex = null

                        if (member == args.userId) {
                            console.log("Index of paidbyuser", getIndexOfGroupBalances(member, groupBalances))
                            groupBalanceIndex = getIndexOfGroupBalances(member, groupBalances)
                            if (groupBalanceIndex == -1) {
                                updGroupBalance = {
                                    balance: (args.amount - (args.amount / groupMembers.length)).toFixed(2),
                                    userId: member
                                }
                                //push newgroupBalance
                                groupSchemaDoc.groupBalances.push(updGroupBalance)
                            } else {
                                updGroupBalance = {
                                    balance: parseFloat(groupBalances[groupBalanceIndex].balance) + parseFloat((args.amount - (args.amount / groupMembers.length)).toFixed(2)),
                                    userId: member
                                }
                                groupSchemaDoc.groupBalances[groupBalanceIndex] = updGroupBalance
                                //Update groupBalance of that particuler user
                            }
                        } else {
                            groupBalanceIndex = getIndexOfGroupBalances(member, groupBalances)
                            console.log("Index of paidforuser", getIndexOfGroupBalances(member, groupBalances))

                            if (groupBalanceIndex == -1) {
                                updGroupBalance = {
                                    balance: 0 - (args.amount / groupMembers.length).toFixed(2),
                                    userId: member
                                }
                                //save newgroupBalance
                                groupSchemaDoc.groupBalances.push(updGroupBalance)
                            } else {
                                updGroupBalance = {
                                    balance: groupBalances[groupBalanceIndex].balance - (args.amount / groupMembers.length).toFixed(2),
                                    userId: member
                                }
                                groupSchemaDoc.groupBalances[groupBalanceIndex] = updGroupBalance
                                //Update groupBalance of that particuler user
                            }

                            let userId1 = null
                            let userId2 = null
                            let debtAmount = null
                            if (args.userId < member) {
                                userId1 = args.userId
                                userId2 = member
                                debtAmount = (args.amount / groupMembers.length).toFixed(2)
                            } else if (args.userId > member) {
                                userId1 = member
                                userId2 = args.userId
                                debtAmount = 0 - (args.amount / groupMembers.length).toFixed(2)
                            }

                            let debtSchemaDoc = await debts.findOne({
                                $and: [
                                    {
                                        $and: [
                                            { userId1: userId1 },
                                            { userId2: userId2 }
                                        ]
                                    },
                                    { groupId: args.groupId }
                                ]
                            })
                            console.log("debtSchema FindOne", debtSchemaDoc)

                            if (debtSchemaDoc == null) {
                                let debt = new debts({
                                    groupId: args.groupId,
                                    userId1: userId1,
                                    userId2: userId2,
                                    amount: debtAmount
                                })
                                let debtSaveRes = await debt.save()
                                console.log("Debts saved successfully", debtSaveRes)
                                console.log("DEBTS", debtSaveRes._id)

                                debtList.push(debtSaveRes._id)

                                let userDebtUpdRes = await users.updateOne(
                                    { _id: userId1 },
                                    { $push: { debts: debtSaveRes._id } }
                                )
                                console.log("Debts successully added to user 1", userDebtUpdRes)

                                userDebtUpdRes = await users.updateOne(
                                    { _id: userId2 },
                                    { $push: { debts: debtSaveRes._id } }
                                )
                                console.log("Debts successfully added to user 2", userDebtUpdRes)

                                let groupDebtUpdRes = await groups.updateOne(
                                    { _id: args.groupId },
                                    { $push: { debts: debtSaveRes._id } }
                                )
                                console.log("Debts successfully added to Group", groupDebtUpdRes)
                            } else {
                                let debtSchemaUpd = await debts.updateOne({ groupId: args.groupId, userId1: userId1, userId2: userId2 }, { $inc: { amount: debtAmount } })
                                console.log("Debt updated successfully", debtSchemaUpd)
                            }
                        }
                    }
                    console.log("After foreach")
                    console.log("tranid list", tranIdList)
                    console.log("expense list", expenseList)

                    //Save expense id to groups
                    groupSchemaDoc.expenses.push(...expenseList)

                    //Save transactions to groups
                    groupSchemaDoc.transaction.push(...tranIdList)

                    // Update groupbalances
                    let groupBalancesSave = await groupSchemaDoc.save()
                    console.log("Groupbalances, expense, transaction saved successfully", groupBalancesSave)

                    let expenseSchemaDoc = await expenses.findOne({ _id: expId })
                    expenseSchemaDoc.transactions.push(...tranIdList)
                    let expenseSchemaSave = await expenseSchemaDoc.save()
                    console.log("Transactions successfully added to expense", expenseSchemaSave)

                    // Add transaction ids to user schema for paid by user
                    let userSchemaUpdTran = await users.updateOne(
                        { _id: args.userId },
                        { $push: { transaction: tranIdList } }
                    )
                    console.log("Transactions added successfully to paidBy user schema")

                    return expId

                } catch (error) {
                    console.log("Error while adding expense ", error)
                    return error
                }
            }
        },

        // Accept Reject Group Invite
        acceptRejectInvite: {
            type: groupType,
            args: {
                groupId: {
                    type: GraphQLString
                },
                userId: {
                    type: GraphQLString
                },
                flag: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log("In Accept Reject Invite", args)
                const groupId = args.groupId;
                const userId = args.userId;
                const flag = args.flag; //A: accept invite, R: reject invite 
                let pendingUserIndex = null;
                if (args.flag == 'A') {
                    groups.updateOne({ _id: args.groupId, invitedUsers: mongoose.Types.ObjectId(args.userId) }, { $pull: { invitedUsers: args.userId }, $push: { acceptedUsers: args.userId } }).then(doc => {
                        console.log("Member moved from pending to accepted", doc)

                        users.updateOne({ _id: args.userId, invitedGroups: mongoose.Types.ObjectId(args.groupId) }, { $pull: { invitedGroups: args.groupId }, $push: { acceptedGroups: args.groupId } }).then(doc => {
                            console.log("Group moved from pending to accepted", doc)
                            // res.status(200).send(doc)
                            return doc
                        }).catch(error => {
                            console.log("1111111111Error while moving group from pending to accepted1111111111", error)
                            // res.status(500).send(error)
                            return error
                        })

                    }).catch(error => {

                        console.log("22222222222Error while moving member from pending to accepted22222222222", error)
                        // res.status(500).send(error)
                        return error
                    })

                } else if (args.flag == 'R') {
                    groups.updateOne({ _id: args.groupId, invitedUsers: args.userId }, { $pull: { invitedUsers: args.userId } }).then(doc => {
                        console.log("Member moved from pending to accepted", doc)
                        users.updateOne({ _id: args.userId, invitedGroups: args.groupId }, { $pull: { invitedGroups: args.groupId } }).then(doc => {
                            console.log("Group moved from pending to accepted", doc)
                            // res.send(200).send(doc)
                            return doc
                        }).catch(error => {
                            console.log("Error while moving group from pending to accepted", error)
                            // res.status(500).send(error)
                            return error
                        })
                    }).catch(error => {
                        console.log("Error while moving user from pending to accepted", error)
                        // res.status(500).send(error)
                        return error
                    })
                } else if (args.flag == 'L') {
                    groups.updateOne({ _id: args.groupId, acceptedUsers: args.userId }, { $pull: { acceptedUsers: args.userId } }).then(doc => {
                        console.log("Member moved from pending to accepted", doc)
                        users.updateOne({ _id: args.userId, acceptedGroups: args.groupId }, { $pull: { acceptedGroups: args.groupId } }).then(doc => {
                            console.log("Group moved from pending to accepted", doc)
                            // res.send(200).send(doc)
                            return doc
                        }).catch(error => {
                            console.log("Error while moving group from pending to accepted", error)
                            // res.status(500).send(error)
                            return error
                        })
                    }).catch(error => {
                        console.log("Error while moving user from pending to accepted", error)
                        // res.status(500).send(error)
                        return error
                    })
                }
            }
        },

        // Settle Up
        settleUp: {
            type: userType,
            args: {
                userId: {
                    type: GraphQLString
                },
                userId1: {
                    type: GraphQLString
                },
                userId2: {
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                let userId1 = args.userId1
                let userId2 = args.userId2
                let userId = args.userId
                let swap = null

                if (userId2 < userId1) {
                    swap = userId1
                    userId1 = userId2
                    userId2 = swap
                }

                try {
                    // Get debts
                    let debtSchemaDoc = await debts.find({
                        $and: [
                            { userId1: userId1 },
                            { userId2: userId2 }
                        ]
                    })
                    console.log("debtSchema find", debtSchemaDoc)

                    // Update groupBalances pertaining to every debt
                    for (const debt of debtSchemaDoc) {
                        groupSchemaDoc = await groups.findOne(
                            { _id: debt.groupId }
                        )
                        const groupBalanceIndexUser1 = getIndexOfGroupBalances(userId1, groupSchemaDoc.groupBalances)
                        const groupBalanceIndexUser2 = getIndexOfGroupBalances(userId2, groupSchemaDoc.groupBalances)

                        if (debt.amount < 0) {
                            groupSchemaDoc.groupBalances[groupBalanceIndexUser1].balance = groupSchemaDoc.groupBalances[groupBalanceIndexUser1].balance + Math.abs(debt.amount)
                            groupSchemaDoc.groupBalances[groupBalanceIndexUser2].balance = groupSchemaDoc.groupBalances[groupBalanceIndexUser2].balance - Math.abs(debt.amount)
                        } else {
                            groupSchemaDoc.groupBalances[groupBalanceIndexUser1].balance = groupSchemaDoc.groupBalances[groupBalanceIndexUser1].balance - Math.abs(debt.amount)
                            groupSchemaDoc.groupBalances[groupBalanceIndexUser2].balance = groupSchemaDoc.groupBalances[groupBalanceIndexUser2].balance + Math.abs(debt.amount)
                        }
                        console.log("updated groupBalances", groupSchemaDoc.groupBalances)

                        // Insert into expenses
                        let expense = new expenses({
                            description: 'settle up',
                            amount: Math.abs(debt.amount),
                            groupId: debt.groupId,
                            paidByUserId: (debt.amount < 0) ? userId1 : userId2,
                            currency: '$',
                            settleFlag: 'Y',
                            transactions: [],
                            settledWithUserId: [(debt.amount < 0) ? userId2 : userId1]
                        })

                        let paidByUserIdData = (debt.amount < 0) ? userId1 : userId2
                        let settledWithUserIdData = (debt.amount < 0) ? userId2 : userId1
                        let paidByUserNameRes = await users.findOne({ _id: paidByUserIdData })
                        let groupNameRes = await users.findOne({ _id: debt.groupId })
                        let settledWithUserNameRes = await users.findOne({ _id: settledWithUserIdData })

                        expense.paidByUserName = paidByUserNameRes.userName
                        expense.settledWithUserName = settledWithUserNameRes.userName
                        expense.groupName = groupNameRes.groupName

                        let expenseResponse = await expense.save()
                        console.log("expense added successfully ", expenseResponse)

                        //Insert into transaction
                        let transaction = new transaction({
                            groupId: debt.groupId,
                            expId: expenseResponse._id,
                            paidByUserId: (debt.amount < 0) ? userId1 : userId2,
                            paidForUserId: (debt.amount < 0) ? userId2 : userId1,
                            tranType: 0,
                            amount: Math.abs(debt.amount),
                            settleFlag: 'Y'
                        })
                        let transactionResponse = await transaction.save()
                        console.log("transaction added successfully ", transactionResponse)

                        // Add transaction id to expenses
                        expenseResponse.transactions.push(transactionResponse._id)
                        let expenseSave = await expense.save()
                        console.log("transaction id successfully added to expense", expenseSave)

                        debt.amount = 0
                        let debtSave = await debt.save()
                        console.log("debt amount updated", debtSave)
                    }

                    // Change settle flag in transaction
                    let tranSchemaUpd = await transaction.updateMany(
                        {
                            $and: [
                                {
                                    $or: [
                                        { paidByUserId: userId1 },
                                        { paidForUserId: userId1 }
                                    ]
                                },
                                {
                                    $or: [
                                        { paidByUserId: userId2 },
                                        { paidForUserId: userId2 }
                                    ]
                                }
                            ]
                        },
                        { $set: { settleFlag: 'Y' } }
                    )
                    console.log("Settled flag successfully changed in transaction schema", tranSchemaUpd)
                    let groupSchemaUpd = await groupSchemaDoc.save()
                    console.log("Group Balances updated successfully", groupSchemaUpd)

                    return ({ message: "Settle up successful" })
                } catch (error) {
                    console.log("Settle up failed", error)
                    return error
                }
            }
        }

    }
})
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

module.exports = schema;