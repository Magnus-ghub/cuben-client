import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import {
	Button,
	Stack,
	Typography,
	IconButton,
	Backdrop,
	Pagination,
	Avatar,
	Divider,
	Chip,
	Box,
	Skeleton,
} from '@mui/material';
import {
	DeleteForever as DeleteForeverIcon,
	ThumbUpOffAlt as ThumbUpOffAltIcon,
	ThumbUpAlt as ThumbUpAltIcon,
	Visibility as VisibilityIcon,
	Chat as ChatIcon,
	Edit as EditIcon,
	CalendarMonth as CalendarIcon,
	ArrowBackIosNew as ArrowBackIcon,
} from '@mui/icons-material';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { Messages } from '../../libs/config';
import {
	sweetConfirmAlert,
	sweetErrorHandling,
	sweetMixinErrorAlert,
	sweetMixinSuccessAlert,
} from '../../libs/sweetAlert';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { GET_ARTICLE, GET_COMMENTS } from '../../libs/apollo/user/query';
import { CREATE_COMMENT, LIKE_TARGET_ARTICLE, UPDATE_COMMENT } from '../../libs/apollo/user/mutation';
import { userVar } from '../../libs/apollo/store';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { Article } from '../../libs/types/article/article';
import Link from 'next/link';

const ToastViewerComponent = dynamic(() => import('../../libs/components/community/TViewer'), { ssr: false });

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ArticleDetail: NextPage = ({ initialInput }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleId = query?.id as string;
	const user = useReactiveVar(userVar);
	const [comment, setComment] = useState<string>('');
	const [wordsCnt, setWordsCnt] = useState<number>(0);
	const [comments, setComments] = useState<Comment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({
		...initialInput,
		search: { commentRefId: articleId },
	});
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
	const [article, setArticle] = useState<Article>(null);

	/** APOLLO REQUESTS **/
	const { loading: articleLoading, refetch: articleRefetch } = useQuery(GET_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: { input: articleId },
		skip: !articleId,
		onCompleted: (data) => {
			console.log('Article data received:', data);
			setArticle(data?.getBoardArticle || data?.getArticle);
		},
		onError: (error) => {
			console.error('Article fetch error:', error);
		},
	});

	const { loading: getCommentsLoading, refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		skip: !articleId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			setComments(data?.getComments?.list || []);
			setTotal(data?.getComments?.metaCounter?.[0]?.total || 0);
		},
	});

	const [likeTargetArticle] = useMutation(LIKE_TARGET_ARTICLE);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	/** LIFECYCLES **/
	useEffect(() => {
		if (articleId) {
			console.log('Article ID:', articleId);
			setSearchFilter({ ...searchFilter, search: { commentRefId: articleId } });

			// Refetch both article and comments
			articleRefetch({ input: articleId })
				.then((result) => {
					console.log('Refetch result:', result);
					if (result?.data) {
						const fetchedArticle = result.data.getBoardArticle || result.data.getArticle;
						console.log('Parsed article:', fetchedArticle);
						setArticle(fetchedArticle);
					}
				})
				.catch((err) => console.error('Refetch error:', err));

			getCommentsRefetch({ input: { ...searchFilter, search: { commentRefId: articleId } } });
		}
	}, [articleId]);

	/** HANDLERS **/
	const handleCreateComment = async () => {
		if (!comment || wordsCnt > 100) return;
		try {
			if (!user._id) throw new Error(Messages.error2);
			await createComment({
				variables: {
					input: {
						commentGroup: CommentGroup.ARTICLE,
						commentRefId: articleId,
						commentContent: comment,
					},
				},
			});
			setComment('');
			setWordsCnt(0);
			await getCommentsRefetch({ input: { ...searchFilter, page: 1 } });
			await articleRefetch();
			sweetMixinSuccessAlert('Comment added!');
		} catch (error: any) {
			sweetErrorHandling(error.message);
		}
	};

	const handleUpdateComment = async (id: string, status?: CommentStatus) => {
		try {
			if (updatedCommentWordsCnt > 100) return;
			if (status && !(await sweetConfirmAlert('Delete comment?'))) return;
			await updateComment({
				variables: {
					input: {
						_id: id,
						...(updatedComment && { commentContent: updatedComment }),
						...(status && { commentStatus: status }),
					},
				},
			});
			setOpenBackdrop(false);
			setUpdatedComment('');
			setUpdatedCommentWordsCnt(0);
			await getCommentsRefetch({ input: searchFilter });
			sweetMixinSuccessAlert(status === CommentStatus.DELETE ? 'Deleted!' : 'Updated!');
		} catch (err: any) {
			sweetMixinErrorAlert(err.message);
		}
	};

	const updateCommentInputHandler = (value: string) => {
		if (value.length > 100) return;
		setUpdatedCommentWordsCnt(value.length);
		setUpdatedComment(value);
	};

	const paginationHandler = (e: any, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const isLiked = article?.meLiked?.[0]?.myFavorite || article?.meLiked?.liked || false;

	if (device === 'mobile') return <div>MOBILE VIEW NOT IMPLEMENTED</div>;

	// Loading Skeleton Component
	const LoadingSkeleton = () => (
		<Stack className="loading-skeleton">
			<Stack className="skeleton-article-card">
				<Stack className="skeleton-header">
					<Skeleton variant="rectangular" width={100} height={30} className="skeleton-title" />
					<Stack className="skeleton-actions">
						<Skeleton variant="circular" width={20} height={20} />
						<Skeleton variant="circular" width={20} height={20} />
					</Stack>
				</Stack>
				<Skeleton variant="text" width="80%" height={50} className="skeleton-text" />
				<Skeleton variant="text" width="100%" height={20} className="skeleton-text" />
				<Skeleton variant="text" width="100%" height={20} className="skeleton-text" />
				<Skeleton variant="text" width="60%" height={20} className="skeleton-text" />
				<Divider />
				<Skeleton variant="rectangular" width="100%" height={300} className="skeleton-content" />
			</Stack>
		</Stack>
	);

	return (
		<Stack id="article-detail-page" className="detail-page">
			{/* Modern Header with Gradient */}
			<Box className="header-gradient">
				<div className="container">
					<Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} className="back-button">
						Back to Articles
					</Button>
				</div>
			</Box>
			<div className="container">
				<Stack className="main-wrapper">
					{/* Left Side: Article Content */}
					<Stack className="left-column">
						<Stack className="article-section">
							{articleLoading ? (
								<LoadingSkeleton />
							) : article && article._id ? (
								<Stack className="article-card">
									{/* Decorative corner accent */}
									<Box className="decorative-accent" />
									<Stack className="article-header">
										<Chip label={article?.articleCategory} className="category-chip" />
										<Stack className="meta-info">
											<Stack className="meta-item">
												<VisibilityIcon fontSize="small" />
												<Typography variant="body2" className="meta-text">
													{article?.articleViews}
												</Typography>
											</Stack>
											<Stack className="meta-item">
												<CalendarIcon fontSize="small" />
												<Typography variant="body2" className="meta-text">
													<Moment format="MMM DD, YYYY">{article?.createdAt}</Moment>
												</Typography>
											</Stack>
										</Stack>
									</Stack>
									<Typography variant="h3" className="article-title">
										{article?.articleTitle}
									</Typography>
									<Divider />
									<Box className="article-content">
										<ToastViewerComponent markdown={article?.articleContent} />
									</Box>
								</Stack>
							) : (
								<Stack className="not-found-card">
									<Typography variant="h4" className="not-found-title">
										🔍 Article Not Found
									</Typography>
									<Typography variant="body1" className="not-found-description">
										The article you're looking for doesn't exist or has been removed.
									</Typography>
									<Typography variant="caption" className="not-found-id">
										Article ID: {articleId || 'Not provided'}
									</Typography>
									<Button variant="contained" onClick={() => router.push('/article')} className="back-to-list-button">
										Back to Articles
									</Button>
								</Stack>
							)}
						</Stack>
						{/* Discussions Section - Full width below, right side empty */}
						{article && article._id && (
							<Stack className="comments-section">
								<Typography variant="h5" className="comments-title">
									<ChatIcon /> Discussions ({total})
								</Typography>

								<Stack className="comment-input-section">
									<Avatar src={`${process.env.REACT_APP_API_URL}/${user?.memberImage}`} className="user-avatar" />
									<Stack className="comment-input-wrapper">
										<textarea
											placeholder="Share your thoughts..."
											value={comment}
											onChange={(e) => {
												const val = e.target.value;
												if (val.length > 100) return;
												setWordsCnt(val.length);
												setComment(val);
											}}
											className="comment-textarea"
										/>
										<Stack className="comment-input-footer">
											<Typography variant="caption" className={`words-counter ${wordsCnt > 100 ? 'error' : ''}`}>
												{wordsCnt}/100 characters
											</Typography>
											<Button
												variant="contained"
												onClick={handleCreateComment}
												disabled={wordsCnt === 0 || wordsCnt > 100}
												className="post-comment-button"
											>
												Post Comment
											</Button>
										</Stack>
									</Stack>
								</Stack>
								{getCommentsLoading && comments.length === 0 ? (
									<Stack className="comments-loading">
										{[1, 2, 3].map((i) => (
											<Stack key={i} className="comment-skeleton">
												<Skeleton variant="circular" width={40} height={40} />
												<Stack className="skeleton-comment-content">
													<Skeleton variant="text" width="30%" />
													<Skeleton variant="text" width="100%" />
													<Skeleton variant="text" width="80%" />
												</Stack>
											</Stack>
										))}
									</Stack>
								) : (
									<Stack className="comments-list">
										{comments.map((item) => (
											<Stack key={item._id} className="comment-item">
												<Avatar
													src={`${process.env.REACT_APP_API_URL}/${item.memberData?.memberImage}`}
													className="comment-avatar"
												/>
												<Box className="comment-content">
													<Stack className="comment-header">
														<Typography variant="subtitle2" className="comment-author">
															{item.memberData?.memberNick}
														</Typography>
														<Typography variant="caption" className="comment-time">
															<Moment fromNow>{item.createdAt}</Moment>
														</Typography>
													</Stack>
													<Typography variant="body2" className="comment-text">
														{item.commentContent}
													</Typography>

													{item.memberId === user._id && (
														<Stack className="comment-actions">
															<IconButton
																size="small"
																className="action-button edit"
																onClick={() => {
																	setUpdatedCommentId(item._id);
																	setUpdatedComment(item.commentContent || '');
																	setUpdatedCommentWordsCnt(item.commentContent?.length || 0);
																	setOpenBackdrop(true);
																}}
															>
																<EditIcon fontSize="small" />
															</IconButton>
															<IconButton
																size="small"
																color="error"
																className="action-button delete"
																onClick={() => handleUpdateComment(item._id, CommentStatus.DELETE)}
															>
																<DeleteForeverIcon fontSize="small" />
															</IconButton>
														</Stack>
													)}
												</Box>
											</Stack>
										))}
										{total > searchFilter.limit && (
											<Stack className="pagination-section">
												<Pagination
													count={Math.ceil(total / searchFilter.limit)}
													page={searchFilter.page}
													shape="rounded"
													color="primary"
													onChange={paginationHandler}
													className="custom-pagination"
												/>
											</Stack>
										)}
									</Stack>
								)}
							</Stack>
						)}
					</Stack>

					{/* Right Side: Member (Author) & Need Help - Side by side */}
					{articleLoading ? (
						<Stack className="side-sections">
							<Skeleton variant="rectangular" height={200} className="skeleton-author-card" />
							<Skeleton variant="rectangular" height={150} className="skeleton-support-card" />
						</Stack>
					) : article && article._id ? (
						<Stack className="side-sections">
							<Stack className="author-card">
								<Avatar
									src={`${process.env.REACT_APP_API_URL}/${article?.memberData?.memberImage}`}
									className="author-avatar-large"
								/>
								<Typography variant="h6" className="author-name">
									{article?.memberData?.memberNick}
								</Typography>
								<Typography variant="body2" className="author-role">
									Article Author
								</Typography>
								<Button
									variant="outlined"
									fullWidth
									onClick={() => router.push(`/member?memberId=${article?.memberData?._id}`)}
									className="view-profile-button"
								>
									View Profile
								</Button>
							</Stack>
							<Link href={"/cs?tab=contact"} className="support-card">
								<Typography variant="subtitle1" className="support-title">
									📞 Need Help?
								</Typography>
								<Typography variant="body2" className="support-description">
									Have questions about this article? Contact the author or leave a comment below.
								</Typography>
								<Button variant="contained" fullWidth className="contact-support-button">
									Contact Support
								</Button>
							</Link>
						</Stack>
					) : null}
				</Stack>
			</div>
			{/* Edit Comment Modal */}
			<Backdrop open={openBackdrop} className="edit-backdrop">
				<Stack className="edit-modal">
					<Typography variant="h6" className="edit-title">
						✏️ Edit Comment
					</Typography>
					<textarea
						value={updatedComment}
						onChange={(e) => updateCommentInputHandler(e.target.value)}
						className="edit-textarea"
					/>
					<Stack className="edit-footer">
						<Typography variant="caption" className={`words-counter ${updatedCommentWordsCnt > 100 ? 'error' : ''}`}>
							{updatedCommentWordsCnt}/100
						</Typography>
						<Stack className="edit-actions">
							<Button onClick={() => setOpenBackdrop(false)} className="cancel-button">
								Cancel
							</Button>
							<Button
								variant="contained"
								onClick={() => handleUpdateComment(updatedCommentId)}
								disabled={updatedCommentWordsCnt === 0 || updatedCommentWordsCnt > 100}
								className="save-button"
							>
								Save Changes
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</Backdrop>
		</Stack>
	);
};

ArticleDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutMain(ArticleDetail);
