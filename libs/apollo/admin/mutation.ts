import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
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

/**************************
 *        PRODUCT        *
 *************************/

export const UPDATE_PRODUCT_BY_ADMIN = gql`
	mutation UpdateProductByAdmin($input: ProductUpdate!) {
		updateProductByAdmin(input: $input) {
			_id
			productType
			productStatus
			productAddress
			productName
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

export const REMOVE_PRODUCT_BY_ADMIN = gql`
	mutation RemoveProductByAdmin($input: String!) {
		removeProductByAdmin(productId: $input) {
			_id
			productType
			productStatus
			productAddress
			productName
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

/**************************
 *         POST           *
 *************************/

export const UPDATE_POST_BY_ADMIN = gql`
	mutation UpdatePostByAdmin($input: PostUpdate!) {
		updatePostByAdmin(input: $input) {
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

export const REMOVE_POST_BY_ADMIN = gql`
	mutation RemovePostByAdmin($input: String!) {
		removePostByAdmin(postId: $input) {
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

/**************************
 *         ARTICLE        *
 *************************/

export const UPDATE_ARTICLE_BY_ADMIN = gql`
	mutation UpdateArticleByAdmin($input: ArticleUpdate!) {
		updateArticleByAdmin(input: $input) {
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

export const REMOVE_ARTICLE_BY_ADMIN = gql`
	mutation RemoveArticleByAdmin($input: String!) {
		removeArticleByAdmin(articleId: $input) {
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

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
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
 *        NOTICE          *
 *************************/

export const UPDATE_NOTICE_BY_ADMIN = gql`
    mutation UpdateNoticeByAdmin($input: NoticeUpdate!) {
        updateNoticeByAdmin(input: $input) {
            _id
            noticeCategory
            noticeStatus
            noticeTitle
            noticeContent
            memberId
            createdAt
            updatedAt
        }
    }
`;

export const REMOVE_NOTICE_BY_ADMIN = gql`
    mutation RemoveNoticeByAdmin($input: String!) {
        removeNoticeByAdmin(noticeId: $input) {
            _id
            noticeCategory
            noticeStatus
            noticeTitle
            noticeContent
            memberId
            createdAt
            updatedAt
        }
    }
`;

/**************************
 *      NOTIFICATION      *
 *************************/

export const UPDATE_NOTIFICATION_BY_ADMIN = gql`
    mutation UpdateNotificationByAdmin($input: NotificationUpdate!) {
        updateNotificationByAdmin(input: $input) {
            _id
            notificationType
            notificationStatus
            notificationGroup
            notificationTitle
            notificationDesc
            authorId
            receiverId
            productId
            articleId
            createdAt
            updatedAt
        }
    }
`;

export const REMOVE_NOTIFICATION_BY_ADMIN = gql`
    mutation RemoveNotificationByAdmin($input: String!) {
        removeNotificationByAdmin(notificationId: $input) {
            _id
            notificationType
            notificationStatus
            notificationGroup
            notificationTitle
            notificationDesc
            authorId
            receiverId
            productId
            articleId
            createdAt
            updatedAt
        }
    }
`;
