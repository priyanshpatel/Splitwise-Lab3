const graphql = require("graphql");
let bcrypt = require("bcrypt");
let comments = require("../models/comments");
let debts = require("../models/debts");
let expenses = require("../models/expenses");
let groups = require("../models/groups");
let transaction = require("../models/transaction");
let users = require("../models/users");

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
            resolve(parent, args) {
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

                return group.save().then(response => {
                    console.log("Group created successfully", response)
                    groupSaveResponse = response
                    const groupId = response._id
                    let invitedUsersArr = invitedUsersSplit.split(',')

                    users.find({ _id: { $in: invitedUsersArr } })
                    .then(response => {
                        console.log("============invited users=================");
                        console.log(invitedUsersArr);

                        response.forEach(function (user) {
                            console.log("=-=-=-=-=-=-=-=-=-=-=-=", user)
                            users.findByIdAndUpdate({ _id: user._id }
                                , { $push: { invitedGroups: groupId } }, { new: true }
                            ).then(doc => {
                                console.log("successfully updated invited group", doc);

                            }).catch(error => {
                                console.log("error", error);
                                return error
                            })
                        })
                    })

                    users.find({ _id: { $in: args.acceptedUsers } })
                    .then(response => {
                    console.log("============accepted users=================");
                    console.log(args.acceptedUsers);

                    response.forEach(function (user) {
                        users.findByIdAndUpdate({ _id: user._id }
                            , { $push: { acceptedGroups: groupId } }, { new: true }
                        ).then(doc => {
                            console.log("successfully updated accepted group", doc);
                            // return groupSaveResponse
                            return doc
                        }).catch(error => {
                            console.log("error", error);
                        })
                    })
                        
                    }).catch(error => {
                        console.log("error while creating group", error)
                        return error
                    })
                })
            }
        }
    }
})
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

module.exports = schema;