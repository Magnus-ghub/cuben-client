import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Box, Stack, Button, TextField, Chip, Avatar, IconButton } from '@mui/material';
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
import { CREATE_POST } from '../../libs/apollo/user/mutation';
import { 
	FileText, 
	Image as ImageIcon, 
	Send, 
	X, 
	AlertCircle,
	Sparkles,
} from 'lucide-react';
import { Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';

const WritePost: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const editorRef = useRef<Editor>(null);

	// Form State
	const [postTitle, setPostTitle] = useState<string>('');
	const [postImage, setPostImage] = useState<string>('');
	const [uploadingImage, setUploadingImage] = useState<boolean>(false);
	const [errors, setErrors] = useState({ title: '', content: '' });

	/** APOLLO REQUESTS **/
	const [createPost, { loading }] = useMutation(CREATE_POST);

	/** HANDLERS **/
	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file = event.target.files?.[0];
			if (!file) return;

			// Check file type
			const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
			if (!validTypes.includes(file.type)) {
				await sweetErrorHandling(new Error('Please upload only JPG, PNG or WEBP images'));
				return;
			}

			if (file.size > 10 * 1024 * 1024) {
				await sweetErrorHandling(new Error('Image size should be less than 10MB'));
				return;
			}

			setUploadingImage(true);

			const formData = new FormData();
			formData.append('file', file); // Changed from 'image' to 'file'
			formData.append('type', 'post'); // Add upload type

			const token = getJwtToken();
			
			// Remove Content-Type header - let browser set it with boundary
			const response = await axios.post(`${REACT_APP_API_URL}/upload`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			// Check response structure
			if (response.data && response.data.url) {
				setPostImage(response.data.url);
				await sweetTopSuccessAlert('Image uploaded successfully!', 2000);
			} else if (response.data) {
				// Handle different response formats
				const imageUrl = response.data.imageUrl || response.data.path || response.data;
				setPostImage(imageUrl);
				await sweetTopSuccessAlert('Image uploaded successfully!', 2000);
			}
			
			// Reset input
			event.target.value = '';
		} catch (err: any) {
			console.error('Upload error:', err);
			console.error('Error response:', err.response?.data);
			
			const errorMessage = err.response?.data?.message || 
			                     err.response?.data?.error || 
			                     err.message || 
			                     'Failed to upload image';
			
			await sweetErrorHandling(new Error(errorMessage));
		} finally {
			setUploadingImage(false);
		}
	};

	const validateForm = (): boolean => {
		const newErrors = { title: '', content: '' };
		let isValid = true;

		if (!postTitle.trim()) {
			newErrors.title = 'Title is required';
			isValid = false;
		} else if (postTitle.length < 5) {
			newErrors.title = 'Title must be at least 5 characters';
			isValid = false;
		} else if (postTitle.length > 100) {
			newErrors.title = 'Title must be less than 100 characters';
			isValid = false;
		}

		const content = editorRef.current?.getInstance().getMarkdown();
		if (!content || content.trim().length < 10) {
			newErrors.content = 'Content must be at least 10 characters';
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleSubmit = async () => {
		try {
			// Clear previous errors
			setErrors({ title: '', content: '' });

			// Validate form
			if (!validateForm()) {
				return;
			}

			const postContent = editorRef.current?.getInstance().getMarkdown();

			if (!postContent || !postTitle) {
				throw new Error(Message.INSERT_ALL_INPUTS);
			}

			await createPost({
				variables: {
					input: {
						postTitle,
						postContent,
						postImage,
					},
				},
			});

			await sweetTopSuccessAlert('Post is created successfully', 700);
			await router.push({
				pathname: '/',
				query: {
					category: 'myPosts',
				},
			});
		} catch (err: any) {
			console.log(err);
			sweetErrorHandling(err).then();
		}
	};

	if (device === 'mobile') {
		return <div>WRITE POST MOBILE</div>;
	}

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

					{/* Title */}
					<Box className="form-group">
						<label className="form-label">
							<span className="emoji">✏️</span>
							Post Title
							<span className="char-count">{postTitle.length}/100</span>
						</label>
						<TextField
							fullWidth
							placeholder="What's on your mind? Give your post an interesting title..."
							value={postTitle}
							onChange={(e) => setPostTitle(e.target.value)}
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
						
						{postImage ? (
							<Box className="image-preview">
								<img src={`${REACT_APP_API_URL}/${postImage}`} alt="Cover" />
								<IconButton 
									className="remove-img-btn"
									onClick={() => setPostImage('')}
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
									<span>PNG, JPG up to 10MB</span>
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