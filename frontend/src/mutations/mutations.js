import { gql } from 'apollo-boost';

const userLogin = gql`
mutation userLogin($email: String, $userPassword: String){
    userLogin(email:$email, userPassword:$userPassword){
        _id,
        userName,
        userEmail
    }
  }
`;
const userSignUpMutation = gql`
    mutation userSignUp($userName: String, $userEmail: String, $userPassword: String){
        userSignUp(userName: $userName, userEmail: $userEmail, userPassword: $userPassword){
            _id,
            userName,
            userEmail
        }
    }
`;

const updateProfileMutation = gql`
    mutation updateProfile(
        $userId:String,   
        $userName:String,
        $userEmail:String,
        $phoneNumber:String,
        $currency:String,
        $timezone:String,
        $language:String,
        $profilePicture:String,
    ){
        updateUserProfile(  userName:$userName,   
                            userEmail:$userEmail,
                            phoneNumber:$phoneNumber,
                            currency:$currency,
                            timezone:$timezone,
                            language:$language,
                            profilePicture:$profilePicture,
                        ){
            _id,
        userName,
        userEmail
        }
    }
`;

const createGroupMutation = gql`
    mutation createGroup(
        $groupName:String,   
        $createdBy:String,
        $groupPicture:String,
        $acceptedUsers:[String],
        $invitedUsers:[String],
    ){
        createGroup(        groupName:$groupName,   
                            createdBy:$createdBy,
                            groupPicture:$groupPicture,
                            acceptedUsers:$acceptedUsers,
                            invitedUsers:$invitedUsers,
                        ){
            email
        }
    }
`;



const addExpenseMutation = gql`
mutation placeOrder(
    $description:String,
    $amount:String,
    $groupId:String,
    $paidByUserId:String,
    $currency:[String],
    $comments: String,
    $userId: String,
    )
{
    addExpense(
        description:$description,
        amount:$amount,
        groupId:$groupId,
        paidByUserId:$paidByUserId,
        currency:$currency,
        comments:$comments,
        userId:$userId
    )  
{
        _id
        
}
}
`;

const acceptRejectInviteMutation = gql`
mutation acceptRejectInvite($groupId: String, $userId: String, $flag: String){
    acceptRejectInvite(groupId:$groupId, userId:$userId, flag:$flag){
        _id,
    }
  }
`;
const settleUpMutation = gql`
    mutation settleUp($userId: String, $userId1: String, $userId2: String){
        restaurantSignUp(userId: $userId, userId1: $userId1, userId2: $userId2){
            _id
        }
    }
`;

// const addDishMutation = gql`
//     mutation addDish(
//         $restaurantID: String, $dishName: String, $dishIngrediants: String, $dishPrice: String, $dishDescription: String, $dishCategory: String){
//         addDish(restaurantID:$restaurantID, dishName:$dishName, dishIngrediants:$dishIngrediants, dishPrice:$dishPrice, dishDescription:$dishDescription, dishCategory:$dishCategory){
//             dishes{
//                        dishName
//                     }
//         }
//     }
// `;

// const editDishMutation = gql`
//     mutation editDish(
//         $restaurantID: String, $dishID:String,$dishName: String, $dishIngrediants: String, $dishPrice: String, $dishDescription: String, $dishCategory: String){
//             editDish(restaurantID:$restaurantID, dishID:$dishID,dishName:$dishName, dishIngrediants:$dishIngrediants, dishPrice:$dishPrice, dishDescription:$dishDescription, dishCategory:$dishCategory){
//                 dishes{
//                     dishName
//                  }
//         }
//     }
// `;

// const updateOrderStatusMutation = gql`
//     mutation updateOrderStatus(
//         $orderID: String, $orderStatus:String){
//             updateOrderStatus(orderID:$orderID, orderStatus:$orderStatus){
//                 dishes{
//                     dishName
//                  }
//         }
//     }
// `;

// const addReviewMutation = gql`
//     mutation addReview(
//         $restaurantID: String, $userID: String, $headline: String, $reviewText: String, $ratings: String, $restaurantName: String, $reviewerName: String, $date: String){
//             addReview(restaurantID:$restaurantID, userID:$userID, headline:$headline, reviewText:$reviewText, ratings:$ratings, restaurantName:$restaurantName,reviewerName:$reviewerName,date:$date){
//            reviewText
//         }
//     }
// `;

// export { addReviewMutation, updateOrderStatusMutation, userLogin, addDishMutation, editDishMutation, userSignUpMutation, restaurantLogin, restaurantSignUpMutation, updateUserProfileMutation, placeOrderMutation, updateRestaurantProfile };

export { userLogin, userSignUpMutation, updateProfileMutation, createGroupMutation, addExpenseMutation, acceptRejectInviteMutation, settleUpMutation };