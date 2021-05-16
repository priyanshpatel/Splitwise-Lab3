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
            type: GraphQLString,
            defaultValue: "N"
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
    fields: () =>({
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
    fields: () =>({
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
            type: GraphQLString,
            defaultValue: "N"
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

    }
})
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

module.exports = schema;