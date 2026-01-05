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
			memberWarnings
			memberBlocks
			memberProducts
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
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
			memberWarnings
			memberBlocks
			memberProducts
			memberRank
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
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
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

// LIKE_TARGET_MEMBER removed (backend da kerak emas)

/**************************
 *        PRODUCT        *
 *************************/

export const CREATE_PRODUCT = gql`
	mutation CreateProduct($input: ProductInput!) {
		createProduct(input: $input) {
			_id
			productType
			productStatus
			productLocation
			productAddress
			productTitle
			productPrice
			productViews
			productLikes
			productImages
			productDesc
			memberId
			soldAt
			deletedAt
			createdAt
			updatedAt
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
			productPrice
			productViews
			productLikes
			productImages
			productDesc
			memberId
			soldAt
			deletedAt
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_PRODUCT = gql`
	mutation LikeTargetProduct($productId: String!) {
		likeTargetProduct(productId: $productId) {
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
				memberWarnings
				memberBlocks
				memberProducts
				memberRank
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
			}
		}
	}
`;

export const SAVE_TARGET_PRODUCT = gql`
	mutation SaveTargetProduct($productId: String!) {
		saveTargetProduct(productId: $productId) {
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
				memberWarnings
				memberBlocks
				memberProducts
				memberRank
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
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
			postSaves
			postLikes
			postComments
			memberId
			createdAt
			updatedAt
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
			postSaves
			postLikes
			postComments
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_POST = gql`
	mutation LikeTargetPost($postId: String!) {
		likeTargetPost(postId: $postId) {
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
				memberWarnings
				memberBlocks
				memberProducts
				memberRank
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
			}
		}
	}
`;

export const SAVE_TARGET_POST = gql`
	mutation SaveTargetPost($postId: String!) {
		saveTargetPost(postId: $postId) {
			_id
			postStatus
			postTitle
			postContent
			postImages
			postSaves
			postLikes
			postComments
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
				memberWarnings
				memberBlocks
				memberProducts
				memberRank
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
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
			articleComments
			memberId
			createdAt
			updatedAt
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
			articleComments
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_ARTICLE = gql`
	mutation LikeTargetArticle($articleId: String!) {
		likeTargetArticle(articleId: $articleId) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
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
				memberWarnings
				memberBlocks
				memberProducts
				memberRank
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
			}
		}
	}
`;

export const SAVE_TARGET_ARTICLE = gql`
	mutation SaveTargetArticle($articleId: String!) {
		saveTargetArticle(articleId: $articleId) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
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
				memberWarnings
				memberBlocks
				memberProducts
				memberRank
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
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
				memberWarnings
				memberBlocks
				memberProducts
				memberRank
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
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
				memberWarnings
				memberBlocks
				memberProducts
				memberRank
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
			}
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