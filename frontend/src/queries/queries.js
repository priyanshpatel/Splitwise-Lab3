import { gql } from 'apollo-boost';


const viewProfile = gql`
query viewProfile($userId: String){
  viewProfile(userId:$userId){
      _id,
      userName,
      userEmail,
      timezone,
      currency,
      language,
      profilePicture,
      phoneNumber,
      transaction,
      detbs,
      invitedGroups,
      acceptedGroups,
    }
  }
`;

const groupSearch = gql`
query groupSearch($userId: String, $keyword: String){
  groupSearch(userId:$userId, keyword:$keyword){
      _id,
      groupName,
    }
  }
`;

const groupUserSearch = gql`
query groupUserSearch($userId: String, $keyword: String){
  groupUserSearch(userId:$userId, keyword:$keyword){
              _id,
             userName
             }
    }
  }
`;

// const getRestaurantProfileByID = gql`
// query getRestaurantProfileByID($restaurantID: String){
//     getRestaurantProfileByID(restaurantID:$restaurantID){
//               _id,
//              name,
//              email,
//              location,
//              contact,
//              description,
//              timing,
//              restaurantType,
             
//     }
//   }
// `;

// const getAllRestaurants = gql`
// query getAllRestaurants{
//     getAllRestaurants{
//         _id,
//             name,
//              email,
//              location,
//              contact,
//              description,
//              contact,
//              timing,
//              restaurantType,
//              dishes{
//                dishID,
//                dishName,
//                dishPrice,
//                dishCategory,
//                dishIngrediants,
//                dishDescription
//              }
//     }
//   }
// `;

// const getOrdersByUserID = gql`
// query getOrdersByUserID($userID: String){
//     getOrdersByUserID(userID:$userID){
//             _id,
//              userID,
//              restaurantID
//              cancelled
//              orderDate,
//              orderStatus,
//              orderMethod,
//              dishes{
//                 dishID,
//                    dishName,
//                    dishPrice,
//                    dishCategory,
//                    dishIngrediants,
//                    dishDescription
//              }
         
//     }
//   }
// `;

// const getOrdersByRestaurantID = gql`
// query getOrdersByRestaurantID($restaurantID: String){
//     getOrdersByRestaurantID(restaurantID:$restaurantID){
//             _id,
//              userID,
//              restaurantID
//              cancelled
//              orderDate,
//              orderStatus,
//              orderMethod,
//              dishes{
//                 dishID,
//                    dishName,
//                    dishPrice,
//                    dishCategory,
//                    dishIngrediants,
//                    dishDescription
//              }
         
//     }
//   }
// `;

// const getReviewByUserID = gql`
// query getReviewByUserID($userID: String){
//     getReviewByUserID(userID:$userID){
//              userID
//            restaurantID,
//            headline,
//            reviewText,
//            date,
//            ratings,
//            reviewerName,
//           restaurantName,
         
//     }
//   }
// `;

// const getReviewByRestaurantID = gql`
// query getReviewByRestaurantID($restaurantID: String){
//     getReviewByRestaurantID(restaurantID:$restaurantID){
//              userID
//            restaurantID,
//            headline,
//            reviewText,
//            date,
//            ratings,
//            reviewerName,
//            restaurantName,
         
//     }
//   }
// `;


// export { getReviewByUserID, getReviewByRestaurantID, getUserProfileByID, getOrdersByRestaurantID, getUserProfile, getAllRestaurants, getRestaurantProfile, getOrdersByUserID, getRestaurantProfileByID };

export { viewProfile, groupSearch, groupUserSearch };