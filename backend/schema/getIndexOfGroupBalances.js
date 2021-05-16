module.exports = (userId, groupBalances) => {
    console.log("getIndexOfGroupBalances", userId, groupBalances)
    if (!groupBalances || groupBalances.length == 0 || groupBalances == null){
        return -1
    } else {
        for(i = 0; i < groupBalances.length; i++){
            if(groupBalances[i].userId.equals(userId)){
                return i
            } 
        }
        return -1
    }
}
// exports.getIndexOfGroupBalances = getIndexOfGroupBalances;