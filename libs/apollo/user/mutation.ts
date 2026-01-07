import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
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
			memberPoints
			memberFollowings
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
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
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
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
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
`;

/**************************
 *        PRODUCT        *
 *************************/

export const CREATE_PRODUCT = gql`
	mutation UpdateProduct($input: ProductUpdate!) {
		updateProduct(input: $input) {
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
			productSaves
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
	}
`;

export const UPDATE_PRODUCT = gql`
	mutation UpdateProduct($input: ProductUpdate!) {
		updateProduct(input: $input) {
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
			productSaves
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
	}
`;

export const LIKE_TARGET_PRODUCT = gql`
	mutation LikeTargetProduct($input: String!) {
		likeTargetProduct(productId: $input) {
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
		}
	}
`;

export const SAVE_TARGET_PRODUCT = gql`
	mutation SaveTargetProduct($input: String!) {
		saveTargetProduct(productId: $input) {
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
			productSaves
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

/**************************
 *         POST           *
 *************************/

export const CREATE_POST = gql`
	mutation CreatePost($input: PostInput!) {
		createPost(input: $input) {
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
			meLiked {
				liked
				saved
			}
			meSaved {
				liked
				saved
			}
		}
	}
`;

export const UPDATE_POST = gql`
	mutation UpdatePost($input: PostUpdate!) {
		updatePost(input: $input) {
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
		}
	}
`;

export const LIKE_TARGET_POST = gql`
	mutation LikeTargetPost($input: String!) {
		likeTargetPost(postId: $input) {
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
		}
	}
`;

export const SAVE_TARGET_POST = gql`
	mutation SaveTargetPost($input: String!) {
		saveTargetPost(postId: $input) {
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
		}
	}
`;

/**************************
 *         ARTICLE        *
 *************************/

export const CREATE_ARTICLE = gql`
	mutation CreateArticle($input: ArticleInput!) {
		createArticle(input: $input) {
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

export const UPDATE_ARTICLE = gql`
	mutation UpdateArticle($input: ArticleUpdate!) {
		updateArticle(input: $input) {
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
		}
	}
`;

export const LIKE_TARGET_ARTICLE = gql`
	mutation LikeTargetArticle($input: String!) {
		likeTargetArticle(articleId: $input) {
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
		}
	}
`;

export const SAVE_TARGET_ARTICLE = gql`
	mutation SaveTargetArticle($input: String!) {
		saveTargetArticle(articleId: $input) {
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
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
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

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;
