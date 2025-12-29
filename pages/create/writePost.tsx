import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Box, Stack, Button, TextField, MenuItem, Select, FormControl, Chip, Avatar, IconButton } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { useReactiveVar, useMutation } from '@apollo/client';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { userVar } from '../../libs/apollo/store';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { sweetErrorHandling, sweetTopSuccessAlert } from '../../libs/sweetAlert';
import { getJwtToken } from '../../libs/auth';
import { REACT_APP_API_URL } from '../../libs/config';
import axios from 'axios';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { CREATE_BOARD_ARTICLE } from '../../libs/apollo/user/mutation';
import { 
	FileText, 
	Image as ImageIcon, 
	Send, 
	X, 
	AlertCircle,
	Sparkles,
} from 'lucide-react';

const WritePost: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const editorRef = useRef<Editor>(null);

	// Form State
	const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(BoardArticleCategory.CAREER);
	const [articleTitle, setArticleTitle] = useState<string>('');
	const [articleImage, setArticleImage] = useState<string>('');
	const [uploadingImage, setUploadingImage] = useState<boolean>(false);

	// Validation State
	const [errors, setErrors] = useState({
		title: '',
		content: '',
		category: '',
	});

	/** APOLLO REQUESTS **/
	const [createBoardArticle, { loading }] = useMutation(CREATE_BOARD_ARTICLE);

	/** HANDLERS **/
	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file = event.target.files?.[0];
			if (!file) return;

			if (file.size > 5 * 1024 * 1024) {
				await sweetErrorHandling(new Error('Image size should be less than 5MB'));
				return;
			}

			setUploadingImage(true);

			const formData = new FormData();
			formData.append('image', file);

			const token = getJwtToken();
			const response = await axios.post(`${REACT_APP_API_URL}/upload`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${token}`,
				},
			});

			setArticleImage(response.data.url);
			await sweetTopSuccessAlert('Image uploaded successfully!', 2000);
		} catch (err: any) {
			await sweetErrorHandling(err);
		} finally {
			setUploadingImage(false);
		}
	};

	const validateForm = (): boolean => {
		const newErrors = { title: '', content: '', category: '' };

		if (!articleTitle.trim()) {
			newErrors.title = 'Title is required';
		} else if (articleTitle.length < 5) {
			newErrors.title = 'Title must be at least 5 characters';
		} else if (articleTitle.length > 100) {
			newErrors.title = 'Title must be less than 100 characters';
		}

		const content = editorRef.current?.getInstance().getMarkdown();
		if (!content || content.trim().length < 10) {
			newErrors.content = 'Content must be at least 10 characters';
		}

		if (!articleCategory) {
			newErrors.category = 'Please select a category';
		}

		setErrors(newErrors);
		return !newErrors.title && !newErrors.content && !newErrors.category;
	};

	const handleSubmit = async () => {
		try {
			if (!validateForm()) return;

			const articleContent = editorRef.current?.getInstance().getMarkdown();

			await createBoardArticle({
				variables: {
					input: {
						articleCategory,
						articleTitle,
						articleContent,
						articleImage,
					},
				},
			});

			await sweetTopSuccessAlert('Post created successfully!', 2000);
			router.push('/community');
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (device === 'mobile') {
		return <div>WRITE POST MOBILE</div>;
	}

	const categories = [
		{ value: BoardArticleCategory.COMMUNITY, label: '💬 General Discussion' },
		{ value: BoardArticleCategory.MARKET, label: '💻 Technology' },
		{ value: BoardArticleCategory.CAREER, label: '🌟 Lifestyle' },
		{ value: BoardArticleCategory.EVENTS, label: '✈️ Travel' },
		{ value: BoardArticleCategory.KNOWLEDGE, label: '🍕 Food & Cooking' },
		{ value: BoardArticleCategory.HELP, label: '📚 Education' },
	];

	return (
		<Box className="write-post-page">
			{/* Header */}
			<Box className="page-header">
				<Box className="header-content">
					<Box className="header-icon">
						<FileText size={24} />
					</Box>
					<Box>
						<h1>Create a Post</h1>
						<p>Share your thoughts with the community</p>
					</Box>
				</Box>
				<IconButton className="close-btn" onClick={() => router.back()}>
					<X size={20} />
				</IconButton>
			</Box>

			<Stack className="content-wrapper">
				{/* Main Form Card */}
				<Box className="main-form-card">
					{/* Author Section */}
					<Box className="author-section">
						<Avatar 
							src={user?.memberImage || '/img/profile/defaultUser.svg'} 
							className="author-avatar"
						/>
						<Box className="author-info">
							<h3>{user?.memberNick || 'Anonymous'}</h3>
							<p>@{user?.memberNick?.toLowerCase() || 'user'}</p>
						</Box>
						<Chip 
							icon={<Sparkles size={14} />}
							label="Posting to Community" 
							className="posting-chip"
						/>
					</Box>

					{/* Category */}
					<Box className="form-group">
						<label className="form-label">
							<span className="emoji">📁</span>
							Select Category
						</label>
						<FormControl fullWidth error={!!errors.category}>
							<Select
								value={articleCategory}
								onChange={(e) => setArticleCategory(e.target.value as BoardArticleCategory)}
								className="category-select"
							>
								{categories.map((cat) => (
									<MenuItem key={cat.value} value={cat.value}>
										{cat.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						{errors.category && (
							<Box className="error-msg">
								<AlertCircle size={14} />
								<span>{errors.category}</span>
							</Box>
						)}
					</Box>

					{/* Title */}
					<Box className="form-group">
						<label className="form-label">
							<span className="emoji">✏️</span>
							Post Title
							<span className="char-count">{articleTitle.length}/100</span>
						</label>
						<TextField
							fullWidth
							placeholder="What's on your mind? Give your post an interesting title..."
							value={articleTitle}
							onChange={(e) => setArticleTitle(e.target.value)}
							error={!!errors.title}
							helperText={errors.title}
							className="title-input"
							inputProps={{ maxLength: 100 }}
						/>
					</Box>

					{/* Image Upload */}
					<Box className="form-group">
						<label className="form-label">
							<span className="emoji">🖼️</span>
							Cover Image (Optional)
						</label>
						
						{articleImage ? (
							<Box className="image-preview">
								<img src={`${REACT_APP_API_URL}/${articleImage}`} alt="Cover" />
								<IconButton 
									className="remove-img-btn"
									onClick={() => setArticleImage('')}
								>
									<X size={16} />
								</IconButton>
							</Box>
						) : (
							<Box className="upload-area">
								<input
									type="file"
									accept="image/*"
									onChange={handleImageUpload}
									style={{ display: 'none' }}
									id="image-upload"
									disabled={uploadingImage}
								/>
								<label htmlFor="image-upload" className="upload-label">
									<ImageIcon size={32} />
									<p>{uploadingImage ? 'Uploading...' : 'Click to upload cover image'}</p>
									<span>PNG, JPG up to 5MB</span>
								</label>
							</Box>
						)}
					</Box>

					{/* Editor */}
					<Box className="form-group">
						<label className="form-label">
							<span className="emoji">📝</span>
							Post Content
						</label>
						<Box className={`editor-container ${errors.content ? 'error' : ''}`}>
							<Editor
								ref={editorRef}
								initialValue=" "
								placeholder="Write your post content here..."
								previewStyle="vertical"
								height="400px"
								initialEditType="markdown"
								useCommandShortcut={true}
								hideModeSwitch={false}
								toolbarItems={[
									['heading', 'bold', 'italic', 'strike'],
									['hr', 'quote'],
									['ul', 'ol', 'task'],
									['table', 'link', 'code'],
								]}
							/>
						</Box>
						{errors.content && (
							<Box className="error-msg">
								<AlertCircle size={14} />
								<span>{errors.content}</span>
							</Box>
						)}
					</Box>

					{/* Submit Button */}
					<Box className="submit-section">
						<Button
							variant="contained"
							className="submit-btn"
							startIcon={<Send size={18} />}
							onClick={handleSubmit}
							disabled={loading || uploadingImage}
							fullWidth
						>
							{loading ? 'Publishing...' : 'Publish Post'}
						</Button>
					</Box>
				</Box>

				{/* Sidebar Tips */}
				<Box className="sidebar-card">
					<h3>📌 Writing Tips</h3>
					<ul>
						<li>Use a clear and engaging title</li>
						<li>Break content into paragraphs</li>
						<li>Add images for visual appeal</li>
						<li>Use markdown for formatting</li>
						<li>Proofread before publishing</li>
					</ul>
				</Box>
			</Stack>
		</Box>
	);
};

export default withLayoutMain(WritePost);