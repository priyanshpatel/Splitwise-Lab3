let frontend_url = "http://localhost:3000"
// let mongodb_string_test = "mongodb+srv://admin:saiyangoku@cluster0.p6nod.mongodb.net/test?authSource=admin&replicaSet=atlas-cbegpg-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
let mongodb_string = "mongodb+srv://admin:saiyangoku@splitwisecluster.idknk.mongodb.net/splitwise_mongo?retryWrites=true&w=majority"
let secret = "CMPE_273_Lab_2"
// let kafka_url = "http://54.153.47.61:2181"

module.exports = {
    frontend_url: frontend_url,
    mongodb_string: mongodb_string,
    secret: secret,
    // kafka_url: kafka_url
}