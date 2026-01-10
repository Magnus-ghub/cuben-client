import { gql } from '@apollo/client';

/**************************
 * MEMBER         *
 *************************/

export const GET_AGENTS = gql`
	query GetAgents($input: AgentsInquiry!) {
		getAgents(input: $input) {
			list {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberProducts
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
				memberPosts
				meLiked {
					liked
					saved
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER = gql`
	query GetMember($input: String!) {
		getMember(memberId: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberProducts
			memberArticles
			memberPosts
			memberFollowers
			memberFollowings
			memberPoints
			memberLikes
			memberViews
			memberComments
			memberRank
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
			meLiked {
				liked
				saved
			}
			meFollowed {
				followingId
				followerId
				myFollowing
			}
		}
	}
`;

/**************************
 * PRODUCT        *
 *************************/

export const GET_PRODUCT = gql`
	query GetProduct($input: String!) {
		getProduct(productId: $input) {
			_id
			productType
			productStatus
			productLocation
			productAddress
			productTitle
			productDesc
			productPrice
			productViews
			productLikes
			productSaves
			productImages
			productCondition
			memberId
			isSold
			soldAt
			deletedAt
			createdAt
			updatedAt
			memberData {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberProducts
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			meLiked {
				liked
				saved
			}
		}
	}
`;

export const GET_PRODUCTS = gql`
	query GetProducts($input: ProductsInquiry!) {
		getProducts(input: $input) {
			list {
				_id
				productType
				productStatus
				productLocation
				productAddress
				productTitle
				productDesc
				productPrice
				productViews
				productLikes
				productSaves
				productImages
				productCondition
				memberId
				isSold
				soldAt
				deletedAt
				createdAt
				updatedAt
				meLiked {
					liked
					saved
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberPosts
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
			list {
				_id
				productType
				productStatus
				productLocation
				productAddress
				productTitle
				productDesc
				productPrice
				productViews
				productLikes
				productImages
				productCondition
				memberId
				isSold
				soldAt
				deletedAt
				createdAt
				updatedAt
				meLiked {
					liked
					saved
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberPosts
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
					meLiked {
						liked
						saved
					}
					meFollowed {
						followingId
						followerId
						myFollowing
					}
				}
				productSaves
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_SAVED_PRODUCTS = gql`
	query GetSavedProducts($input: OrdinaryInquiry!) {
		getSavedProducts(input: $input) {
			list {
				_id
				productType
				productStatus
				productLocation
				productAddress
				productTitle
				productDesc
				productPrice
				productViews
				productLikes
				productSaves
				productImages
				productCondition
				memberId
				isSold
				soldAt
				deletedAt
				createdAt
				updatedAt
				meLiked {
					liked
					saved
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberPosts
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITE_PRODUCTS = gql`
	query GetLikedProducts($input: OrdinaryInquiry!) {
		getLikedProducts(input: $input) {
			list {
				_id
				productType
				productStatus
				productLocation
				productAddress
				productTitle
				productDesc
				productPrice
				productViews
				productLikes
				productSaves
				productImages
				productCondition
				memberId
				isSold
				soldAt
				deletedAt
				createdAt
				updatedAt
				meLiked {
					liked
					saved
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberPosts
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
					meLiked {
						liked
						saved
					}
					meFollowed {
						followingId
						followerId
						myFollowing
					}
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 * POST           *
 *************************/

export const GET_POST = gql`
	query GetPost($input: String!) {
		getPost(postId: $input) {
			_id
			postStatus
			postTitle
			postContent
			postImages
			postLikes
			postComments
			memberId
			createdAt
			updatedAt
			postSaves
			meLiked {
				liked
				saved
			}
			meSaved {
				liked
				saved
			}
			memberData {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberProducts
				memberPosts
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
				meLiked {
					liked
					saved
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
		}
	}
`;

export const GET_POSTS = gql`
	query GetPosts($input: PostsInquiry!) {
		getPosts(input: $input) {
			list {
				_id
				postStatus
				postTitle
				postContent
				postImages
				postLikes
				postSaves
				postComments
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberPosts
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
					meLiked {
						liked
						saved
					}
					meFollowed {
						followingId
						followerId
						myFollowing
					}
				}
				meLiked {
					liked
					saved
				}
				meSaved {
					liked
					saved
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_SAVED_POSTS = gql`
	query GetSavedPosts($input: PostsInquiry!) {
		getSavedPosts(input: $input) {
			list {
				_id
				postStatus
				postTitle
				postContent
				postImages
				postLikes
				postComments
				postSaves
				memberId
				createdAt
				updatedAt
				meLiked {
					liked
					saved
				}
				meSaved {
					liked
					saved
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberPosts
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITE_POSTS = gql`
	query GetLikedPosts($input: PostsInquiry!) {
		getLikedPosts(input: $input) {
			list {
				_id
				postStatus
				postTitle
				postContent
				postImages
				postLikes
				postComments
				postSaves
				memberId
				createdAt
				updatedAt
				meLiked {
					liked
					saved
				}
				meSaved {
					liked
					saved
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberPosts
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
					meLiked {
						liked
						saved
					}
					meFollowed {
						followingId
						followerId
						myFollowing
					}
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 * ARTICLE        *
 *************************/

export const GET_ARTICLE = gql`
	query GetArticle($input: String!) {
		getArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleSaves
			articleComments
			memberId
			createdAt
			updatedAt
			meLiked {
				liked
				saved
			}
			memberData {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberProducts
				memberPosts
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
		}
	}
`;

export const GET_ARTICLES = gql`
	query GetArticles($input: ArticlesInquiry!) {
		getArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleSaves
				articleComments
				memberId
				createdAt
				updatedAt
				meLiked {
					liked
					saved
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberPosts
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_SAVED_ARTICLES = gql`
	query GetSavedArticles($input: AllArticlesInquiry!) {
		getSavedArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleSaves
				articleComments
				memberId
				createdAt
				updatedAt
				meLiked {
					liked
					saved
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberPosts
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITE_ARTICLES = gql`
	query GetLikedArticles($input: AllArticlesInquiry!) {
		getLikedArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleSaves
				articleComments
				memberId
				createdAt
				updatedAt
				meLiked {
					liked
					saved
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberPosts
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 * COMMENT                *
 *************************/

export const GET_COMMENTS = gql`
	query ($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberPosts
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 * FOLLOW        *
 *************************/

export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
    getMemberFollowers(input: $input) {
        list {
            _id
            followingId
            followerId
            createdAt
            updatedAt
            meLiked {
                liked
                saved
            }
            meFollowed {
                followingId
                followerId
                myFollowing
            }
            followerData {
                _id
                memberType
                memberStatus
                memberAuthType
                memberPhone
                memberNick
                memberFullName
                memberImage
                memberAddress
                memberDesc
                memberProducts
                memberPosts
                memberArticles
                memberFollowers
                memberFollowings
                memberPoints
                memberLikes
                memberViews
                memberComments
                memberRank
                memberWarnings
                memberBlocks
                deletedAt
                createdAt
                updatedAt
                accessToken
                meLiked {
                    liked
                    saved
                }
                meFollowed {
                    followingId
                    followerId
                    myFollowing
                }
            }
        }
        metaCounter {
            total
        }
    }
}
`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					liked
					saved
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followingData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProducts
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
					memberPosts
					meLiked {
						liked
						saved
					}
					meFollowed {
						followingId
						followerId
						myFollowing
					}
				}
			}
			metaCounter {
				total
			}
		}
	}
`;
