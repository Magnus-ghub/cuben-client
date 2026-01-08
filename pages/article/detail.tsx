import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { 
    Button, Stack, Typography, IconButton, 
    Backdrop, Pagination, Avatar, Divider, Chip, Box 
} from '@mui/material';
import { 
    DeleteForever as DeleteForeverIcon, 
    ThumbUpOffAlt as ThumbUpOffAltIcon, 
    ThumbUpAlt as ThumbUpAltIcon, 
    Visibility as VisibilityIcon, 
    Chat as ChatIcon, 
    Edit as EditIcon, 
    CalendarMonth as CalendarIcon,
    ArrowBackIosNew as ArrowBackIcon
} from '@mui/icons-material';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { Messages } from '../../libs/config';
import { 
    sweetConfirmAlert, sweetErrorHandling, sweetMixinErrorAlert, 
    sweetMixinSuccessAlert, sweetTopSmallSuccessAlert 
} from '../../libs/sweetAlert';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { GET_ARTICLE, GET_COMMENTS } from '../../libs/apollo/user/query';
import { CREATE_COMMENT, LIKE_TARGET_ARTICLE, UPDATE_COMMENT } from '../../libs/apollo/user/mutation';
import { userVar } from '../../libs/apollo/store';
import withLayoutMain from '../../libs/components/layout/LayoutHome';

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
    const [wordsCnt, setWordsCnt] = useState<number>(0); // MODIFIED: Word limit qo'shildi
    const [comments, setComments] = useState<Comment[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({ ...initialInput, search: { commentRefId: articleId } });
    const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
    const [updatedComment, setUpdatedComment] = useState<string>('');
    const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
    const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0); // MODIFIED: Edit uchun word count
    const [boardArticle, setBoardArticle] = useState<any>();

    /** APOLLO REQUESTS **/
    const { refetch: boardArticlesRefetch } = useQuery(GET_ARTICLE, {
        fetchPolicy: 'network-only',
        variables: { input: articleId },
        skip: !articleId,
        onCompleted: (data) => setBoardArticle(data?.getBoardArticle),
    });

    const {
        loading: getCommentsLoading, // MODIFIED: Loading state qo'shildi
        refetch: getCommentsRefetch,
    } = useQuery(GET_COMMENTS, {
        fetchPolicy: 'cache-and-network',
        variables: { input: searchFilter },
        skip: !articleId,
        notifyOnNetworkStatusChange: true,
        onCompleted: (data) => {
            setComments(data?.getComments?.list || []);
            setTotal(data?.getComments?.metaCounter?.[0]?.total || 0);
        },
    });

    const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_ARTICLE);
    const [createComment] = useMutation(CREATE_COMMENT);
    const [updateComment] = useMutation(UPDATE_COMMENT);

    /** LIFECYCLES – MODIFIED: articleId o'zgarganda refetch */
    useEffect(() => {
        if (articleId) {
            setSearchFilter({ ...searchFilter, search: { commentRefId: articleId } });
            boardArticlesRefetch({ input: articleId });
            getCommentsRefetch({ input: searchFilter });
        }
    }, [articleId]);

    /** HANDLERS **/
    const handleLike = async () => {
        try {
            if (!user._id) throw new Error(Messages.error2);
            await likeTargetBoardArticle({ variables: { input: articleId } });
            await boardArticlesRefetch();
            sweetTopSmallSuccessAlert('Liked!', 500);
        } catch (err: any) {
            sweetMixinErrorAlert(err.message);
        }
    };

    const handleCreateComment = async () => {
        if (!comment || wordsCnt > 100) return; // MODIFIED: Word limit check
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
            await getCommentsRefetch({ input: { ...searchFilter, page: 1 } }); // MODIFIED: Pagination reset
            await boardArticlesRefetch();
            sweetMixinSuccessAlert('Comment added!');
        } catch (error: any) {
            sweetErrorHandling(error.message);
        }
    };

    const handleUpdateComment = async (id: string, status?: CommentStatus) => {
        try {
            if (updatedCommentWordsCnt > 100) return; // MODIFIED: Edit word limit
            if (status && !(await sweetConfirmAlert('Delete comment?'))) return; // MODIFIED: Confirm for delete

            await updateComment({
                variables: {
                    input: { 
                        _id: id, 
                        ...(updatedComment && { commentContent: updatedComment }),
                        ...(status && { commentStatus: status })
                    }
                }
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

    const updateCommentInputHandler = (value: string) => { // MODIFIED: Word count handler
        if (value.length > 100) return;
        setUpdatedCommentWordsCnt(value.length);
        setUpdatedComment(value);
    };

    const paginationHandler = (e: any, value: number) => { // MODIFIED: Comments pagination tiklandi
        setSearchFilter({ ...searchFilter, page: value });
    };

    if (device === 'mobile') return <div>MOBILE VIEW NOT IMPLEMENTED</div>;

    return (
        <Stack id="opportunity-detail-page" sx={{ bgcolor: '#f4f7f9', pb: '100px' }}>
            {/* Header / Breadcrumb */}
            <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #e0e0e0', py: 2, mb: 4 }}>
                <div className="container">
                    <Button 
                        startIcon={<ArrowBackIcon />} 
                        onClick={() => router.back()}
                        sx={{ color: '#666', textTransform: 'none' }}
                    >
                        Back to Opportunities
                    </Button>
                </div>
            </Box>

            <div className="container">
                <Stack direction="row" spacing={4}>
                    {/* Left Side: Article Content */}
                    <Stack spacing={3} sx={{ flex: 1 }}>
                        <Stack sx={{ bgcolor: '#fff', p: 4, borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Chip 
                                    label={boardArticle?.articleCategory} 
                                    color="primary" 
                                    sx={{ fontWeight: 700, borderRadius: '8px' }} 
                                />
                                <Stack direction="row" spacing={2} color="#999">
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <VisibilityIcon fontSize="small" />
                                        <Typography variant="caption">{boardArticle?.articleViews}</Typography>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <CalendarIcon fontSize="small" />
                                        <Typography variant="caption">
                                            <Moment format="MMM DD, YYYY">{boardArticle?.createdAt}</Moment>
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>

                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, color: '#1a1a1a' }}>
                                {boardArticle?.articleTitle}
                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                            <Box className="article-content" sx={{ minHeight: '300px' }}>
                                <ToastViewerComponent markdown={boardArticle?.articleContent} />
                            </Box>

                            <Stack direction="row" justifyContent="center" mt={5}>
                                <Button
                                    variant={boardArticle?.meLiked?.[0]?.myFavorite ? "contained" : "outlined"}
                                    color="primary"
                                    onClick={handleLike}
                                    startIcon={boardArticle?.meLiked?.[0]?.myFavorite ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                                    sx={{ borderRadius: '30px', px: 4, py: 1.5, fontWeight: 700 }}
                                >
                                    Helpful ({boardArticle?.articleLikes})
                                </Button>
                            </Stack>
                        </Stack>

                        {/* Comments Section – MODIFIED: Word limit va pagination qo'shildi */}
                        <Stack sx={{ bgcolor: '#fff', p: 4, borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                                Discussions ({total})
                            </Typography>
                            
                            <Stack direction="row" spacing={2} mb={4}>
                                <Avatar src={`${process.env.REACT_APP_API_URL}/${user?.memberImage}`} />
                                <Stack sx={{ flex: 1, position: 'relative' }}>
                                    <textarea
                                        placeholder="Add to the discussion..."
                                        value={comment}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val.length > 100) return; // MODIFIED: Limit
                                            setWordsCnt(val.length);
                                            setComment(val);
                                        }}
                                        style={{ 
                                            width: '100%', padding: '15px', borderRadius: '12px', 
                                            border: '1px solid #ddd', minHeight: '80px', fontFamily: 'inherit' 
                                        }}
                                    />
                                    <Stack direction="row" justifyContent="space-between" mt={1}>
                                        <Typography variant="caption" color="textSecondary">{wordsCnt}/100</Typography>
                                        <Button 
                                            variant="contained" 
                                            onClick={handleCreateComment}
                                            disabled={wordsCnt === 0 || wordsCnt > 100} // MODIFIED: Disable if invalid
                                            sx={{ borderRadius: '8px', textTransform: 'none' }}
                                        >
                                            Post Comment
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Stack>

                            {getCommentsLoading ? (
                                <Typography>Loading comments...</Typography>
                            ) : (
                                <Stack spacing={3}>
                                    {comments.map((item) => (
                                        <Stack key={item._id} direction="row" spacing={2}>
                                            <Avatar src={`${process.env.REACT_APP_API_URL}/${item.memberData?.memberImage}`} />
                                            <Box sx={{ flex: 1, bgcolor: '#f8f9fa', p: 2, borderRadius: '12px' }}>
                                                <Stack direction="row" justifyContent="space-between">
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                        {item.memberData?.memberNick}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        <Moment fromNow>{item.createdAt}</Moment>
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="body2" sx={{ mt: 1, color: '#444' }}>
                                                    {item.commentContent}
                                                </Typography>
                                                
                                                {item.memberId === user._id && (
                                                    <Stack direction="row" spacing={1} mt={1}>
                                                        <IconButton size="small" onClick={() => {
                                                            setUpdatedCommentId(item._id);
                                                            setUpdatedComment(item.commentContent || '');
                                                            setUpdatedCommentWordsCnt(item.commentContent?.length || 0);
                                                            setOpenBackdrop(true);
                                                        }}>
                                                            <EditIcon fontSize="inherit" />
                                                        </IconButton>
                                                        <IconButton size="small" color="error" onClick={() => handleUpdateComment(item._id, CommentStatus.DELETE)}>
                                                            <DeleteForeverIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </Stack>
                                                )}
                                            </Box>
                                        </Stack>
                                    ))}
                                    {total > searchFilter.limit && ( // MODIFIED: Pagination faqat kerak bo'lganda
                                        <Stack className="pagination-box">
                                            <Pagination
                                                count={Math.ceil(total / searchFilter.limit)}
                                                page={searchFilter.page}
                                                shape="circular"
                                                color="primary"
                                                onChange={paginationHandler}
                                            />
                                        </Stack>
                                    )}
                                </Stack>
                            )}
                        </Stack>
                    </Stack>

                    {/* Right Side: Author Info & Actions */}
                    <Stack spacing={3} sx={{ width: '320px' }}>
                        <Stack sx={{ bgcolor: '#fff', p: 3, borderRadius: '20px', textAlign: 'center' }}>
                            <Avatar 
                                src={`${process.env.REACT_APP_API_URL}/${boardArticle?.memberData?.memberImage}`}
                                sx={{ width: 80, height: 80, mx: 'auto', mb: 2, border: '4px solid #f0f0f0' }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {boardArticle?.memberData?.memberNick}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" mb={2}>
                                Opportunity Provider
                            </Typography>
                            <Button 
                                variant="outlined" 
                                fullWidth 
                                onClick={() => router.push(`/member?memberId=${boardArticle?.memberData?._id}`)}
                                sx={{ borderRadius: '10px' }}
                            >
                                View Profile
                            </Button>
                        </Stack>

                        <Stack sx={{ bgcolor: '#2c3e50', p: 3, borderRadius: '20px', color: '#fff' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                                Need Help?
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                                If you have questions regarding this opportunity, feel free to contact the provider or comment below.
                            </Typography>
                            <Button variant="contained" color="secondary" fullWidth sx={{ borderRadius: '10px' }}>
                                Contact Support
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </div>

            {/* Edit Comment Backdrop – MODIFIED: Word count qo'shildi */}
            <Backdrop open={openBackdrop} sx={{ zIndex: 99, color: '#fff' }}>
                <Stack sx={{ bgcolor: '#fff', p: 4, borderRadius: '15px', width: '400px' }} spacing={3}>
                    <Typography variant="h6" color="textPrimary">Edit Comment</Typography>
                    <textarea 
                        value={updatedComment}
                        onChange={(e) => updateCommentInputHandler(e.target.value)}
                        style={{ width: '100%', padding: '10px', height: '100px', borderRadius: '8px' }}
                    />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="textSecondary">{updatedCommentWordsCnt}/100</Typography>
                        <Stack direction="row" spacing={2}>
                            <Button onClick={() => setOpenBackdrop(false)}>Cancel</Button>
                            <Button 
                                variant="contained" 
                                onClick={() => handleUpdateComment(updatedCommentId)}
                                disabled={updatedCommentWordsCnt === 0 || updatedCommentWordsCnt > 100}
                            >
                                Save
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