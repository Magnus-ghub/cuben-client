import React, { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import {
    Box,
    Stack,
    Button,
    Chip,
    Avatar,
    IconButton,
    Typography,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputAdornment,
} from '@mui/material';
import { X, Package, Send, Image as ImageIcon, Tag, Info, DollarSign } from 'lucide-react';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { useReactiveVar, useMutation } from '@apollo/client';
import { getJwtToken } from '../../libs/auth';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { userVar } from '../../libs/apollo/store';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../libs/sweetAlert';
import { REACT_APP_API_URL } from '../../libs/config';
import axios from 'axios';
import { CREATE_ARTICLE } from '../../libs/apollo/user/mutation';
import { ArticleInput } from '../../libs/types/article/article.input';
import { ArticleCategory } from '../../libs/enums/article.enum';

interface ArticleInputWithArray extends Omit<ArticleInput, 'articleImage'> {
    articleImage: string[];
}

const AddArticle: NextPage = ({ initialValues, ...props }: any) => {
    const device = useDeviceDetect();
    const user = useReactiveVar(userVar);
    const router = useRouter();
    const inputRef = useRef<any>(null);

    // Form State
    const [insertArticleData, setInsertArticleData] = useState<ArticleInputWithArray>(initialValues);

    /** APOLLO REQUESTS **/
    const [createArticle, { loading }] = useMutation(CREATE_ARTICLE);

    /** HANDLERS **/
    async function uploadImage() {
        try {
            const formData = new FormData();
            const selectedFiles = inputRef.current.files;

            if (selectedFiles.length === 0) return false;
            if (selectedFiles.length > 1) throw new Error('Only one image allowed!');

            // Single file handling
            const filesArray = [null];
            const mapObj: any = { 0: ['variables.files.0'] };

            formData.append(
                'operations',
                JSON.stringify({
                    query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) { 
                        imagesUploader(files: $files, target: $target)
                    }`,
                    variables: {
                        files: filesArray,
                        target: 'article',  // 'product' o'rniga 'article' qildim
                    },
                }),
            );

            formData.append('map', JSON.stringify(mapObj));

            formData.append('0', selectedFiles[0]);

            // AUTH HEADER
            const token = getJwtToken();
            if (!token) throw new Error('Please log in to upload images');

            const response = await axios.post(
                `${process.env.REACT_APP_API_GRAPHQL_URL || `${REACT_APP_API_URL}/graphql`}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'apollo-require-preflight': true,
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!response.data.data?.imagesUploader) {
                throw new Error('Upload failed: No image returned');
            }

            const responseImage = response.data.data.imagesUploader.filter((url: string) => url); 
            console.log('+responseImages: ', responseImage);

            setInsertArticleData({ ...insertArticleData, articleImage: responseImage });

            await sweetMixinSuccessAlert('Image uploaded successfully!');

            inputRef.current.value = ''; // Reset
        } catch (err: any) {
            console.log('err: ', err.message || err);
            await sweetMixinErrorAlert(err.message || 'Upload failed');
            if (inputRef.current) inputRef.current.value = '';
        }
    }

    // Remove image funksiyasi
    const removeImage = (index: number) => {
        const newImages = (Array.isArray(insertArticleData.articleImage) ? insertArticleData.articleImage : []).filter((_, i) => i !== index);
        setInsertArticleData({ ...insertArticleData, articleImage: newImages });
    };

    // Validation
    const doDisabledCheck = () => {
        if (
            insertArticleData.articleTitle === '' ||    // @ts-ignore
            insertArticleData.articleCategory === '' ||  // @ts-ignore
            insertArticleData.articleContent === ''
        ) {
            return true;
        }
        return false;
    };

    const insertArticleHandler = useCallback(async () => {
        try {
            const articleImageString = Array.isArray(insertArticleData.articleImage) && insertArticleData.articleImage.length > 0 
                ? insertArticleData.articleImage[0]  
                : '';

            const submitData = {
                ...insertArticleData,
                articleImage: articleImageString,  
            };

            await createArticle({
                variables: { input: submitData },
            });
            await sweetMixinSuccessAlert('Article has been created successfully');
            router.push('/article'); // Assuming redirect to articles list
        } catch (err: any) {
            sweetErrorHandling(err).then();
        }
    }, [insertArticleData]);

    console.log('+insertArticleData', insertArticleData);

    if (device === 'mobile') {
        return <div>LIST ITEM MOBILE</div>;
    }

    const articleCategory = [
        { value: ArticleCategory.CAREER, label: 'Jobs' },
        { value: ArticleCategory.ANNOUNCEMENTS, label: 'News' },
        { value: ArticleCategory.EVENTS, label: 'Events' },
        { value: ArticleCategory.KNOWLEDGE, label: 'Knowledge' },
    ];

    return (
        <Box className="list-item-page">
            {/* Header */}
            <Box className="page-header">
                <Box className="header-content">
                    <Box className="header-icon">
                        <Package size={24} />
                    </Box>
                    <Box>
                        <Typography variant="h4">Post an Article</Typography>
                        <Typography variant="body2">Share university jobs, news, events, and knowledge</Typography>
                    </Box>
                </Box>
                <IconButton className="close-btn" onClick={() => router.back()}>
                    <X size={20} />
                </IconButton>
            </Box>

            <Stack className="content-wrapper">
                {/* Main Form Card */}
                <Box className="main-form-card">
                    {/* Seller Section */}
                    <Box className="seller-section">
                        <Avatar src={user?.memberImage || '/img/profile/defaultUser.svg'} className="seller-avatar" />
                        <Box className="seller-info">
                            <Typography variant="h6">{user?.memberNick || 'Author'}</Typography>
                            <Typography variant="body2">@{user?.memberNick?.toLowerCase() || 'user'}</Typography>
                        </Box>
                        <Chip icon={<Tag size={14} />} label="Posting on Articles" className="selling-chip" />
                    </Box>

                    {/* Article Category */}
                    <Box className="form-group">
                        <label className="form-label">Article Category</label>
                        <FormControl fullWidth>
                            <Select
                                value={insertArticleData.articleCategory || 'select'}
                                onChange={({ target: { value } }) =>
                                    setInsertArticleData({ ...insertArticleData, articleCategory: value as ArticleCategory })
                                }
                                className="select-input"
                            >
                                <MenuItem disabled value="select">
                                    Select Category
                                </MenuItem>
                                {articleCategory.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                        {type.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Article Title */}
                    <Box className="form-group">
                        <label className="form-label">Article Title</label>
                        <TextField
                            fullWidth
                            placeholder="e.g., Job Opening for Lecturer, University Event Announcement..."
                            value={insertArticleData.articleTitle}
                            onChange={({ target: { value } }) => setInsertArticleData({ ...insertArticleData, articleTitle: value })}
                            className="text-input"
                        />
                    </Box>
                    {/* Description */}
                    <Box className="form-group">
                        <label className="form-label">
                            Content
                            <span className="char-count">{(insertArticleData.articleContent || '').length}/5000</span>
                        </label>
                        <TextField
                            fullWidth
                            rows={2}
                            multiline
                            placeholder="Describe the article: details, requirements, dates..."
                            value={insertArticleData.articleContent || ''}
                            onChange={({ target: { value } }) => setInsertArticleData({ ...insertArticleData, articleContent: value })}
                            className="text-input"
                            inputProps={{ maxLength: 5000 }}
                        />
                    </Box>

                    {/* Image Upload */}
                    <Box className="form-group">
                        <label className="form-label">
                            Article Image (Optional)
                            <span className="char-count">{insertArticleData.articleImage?.length || 0}/1</span>
                        </label>

                        <Stack className="images-box">
                            {/* Upload Box - Kichik card */}
                            <Stack className="upload-box" onClick={() => inputRef.current?.click()}>
                                <ImageIcon size={20} /> {/* Kichikroq icon */}
                                <p>Add Photo</p> {/* Kompakt text */}
                                <input
                                    ref={inputRef}
                                    type="file"
                                    accept="image/jpg, image/jpeg, image/png"
                                    onChange={uploadImage}
                                    style={{ display: 'none' }}
                                    id="article-image-upload"
                                />
                            </Stack>
                            {/* Gallery */}
                            {insertArticleData.articleImage?.length > 0 && (
                                <Stack className="gallery-box">
                                    {insertArticleData.articleImage.map((image: string, index: number) => {
                                        const imagePath: string = `${REACT_APP_API_URL}/${image}`;
                                        return (
                                            <Stack key={index} className="image-box">
                                                <img src={imagePath} alt={`Article ${index + 1}`} />
                                                <IconButton
                                                    className="remove-img-btn" 
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <X size={16} />
                                                </IconButton>
                                                {index === 0 && <Chip label="Cover" size="small" className="cover-chip" />}
                                            </Stack>
                                        );
                                    })}
                                </Stack>
                            )}
                        </Stack>
                    </Box>

                    {/* Submit Button */}
                    <Box className="submit-section">
                        <Button
                            variant="contained"
                            className="submit-btn"
                            startIcon={<Send size={18} />}
                            onClick={insertArticleHandler}
                            disabled={loading || doDisabledCheck()} 
                            fullWidth
                        >
                            {loading ? 'Publishing...' : 'Publish Article'}
                        </Button>
                    </Box>
                </Box>

                {/* Sidebar Tips */}
                <Box className="sidebar-card">
                    <Typography variant="h6">💡 Posting Tips</Typography>
                    <ul>
                        <li>Add a clear cover photo if relevant</li>
                        <li>Be detailed and accurate in content</li>
                        <li>Use appropriate category for visibility</li>
                        <li>Include key dates or contacts</li>
                        <li>Encourage community engagement</li>
                    </ul>

                    <Box className="info-box">
                        <Info size={18} />
                        <Box>
                            <Typography variant="subtitle2">University Guidelines</Typography>
                            <Typography variant="caption">Ensure content aligns with university policies. Promote positive community interaction.</Typography>
                        </Box>
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
};

AddArticle.defaultProps = {
    initialValues: {
        articleTitle: '',
        articleCategory: '',
        articleContent: '',
        articleImage: [],
    },
};

export default withLayoutMain(AddArticle);