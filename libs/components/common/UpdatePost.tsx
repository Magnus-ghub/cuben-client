import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Box, Stack, Button, TextField, Chip, Avatar, IconButton, Modal, Backdrop, CircularProgress } from '@mui/material';
import useDeviceDetect from '../../../libs/hooks/useDeviceDetect';
import { useReactiveVar, useMutation, useQuery } from '@apollo/client';
import withLayoutMain from '../../../libs/components/layout/LayoutHome';
import { userVar } from '../../../libs/apollo/store';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert, sweetTopSuccessAlert } from '../../../libs/sweetAlert';
import { getJwtToken } from '../../../libs/auth';
import { REACT_APP_API_URL } from '../../../libs/config';
import axios from 'axios';
import { UPDATE_POST } from '../../../libs/apollo/user/mutation';
import { GET_POST } from '../../../libs/apollo/user/query';
import { 
	FileText, 
	Image as ImageIcon, 
	Save, 
	X, 
	AlertCircle,
	Sparkles,
	Edit3,
} from 'lucide-react';
import { Message } from '../../../libs/enums/common.enum';

const UpdatePost: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const { postId } = router.query;
	const editorRef = useRef<Editor>(null);
	const inputRef = useRef<HTMLInputElement>(null); 

	// Modal State
	const [open, setOpen] = useState<boolean>(true);

	// Form State
	const [postTitle, setPostTitle] = useState<string>('');
	const [postContent, setPostContent] = useState<string>('');
	const [postImages, setPostImages] = useState<string[]>([]);
	const [uploadingImages, setUploadingImages] = useState<boolean>(false);
	const [errors, setErrors] = useState({ title: '', content: '' });

	// Dynamic editor height
	const [editorHeight, setEditorHeight] = useState<string>('200px');

	/** APOLLO REQUESTS **/
	const [updatePost, { loading: updateLoading }] = useMutation(UPDATE_POST);

	const {
		loading: getPostLoading,
		data: getPostData,
		error: getPostError,
	} = useQuery(GET_POST, {
		variables: { input: postId },
		fetchPolicy: 'network-only',
		skip: !postId,
		onCompleted: (data) => {
			if (data?.getPost) {
				const post = data.getPost;
				setPostTitle(post.postTitle || '');
				setPostContent(post.postContent || '');
				setPostImages(post.postImages || []);
				
				// Set editor content after a brief delay
				setTimeout(() => {
					if (editorRef.current) {
						editorRef.current.getInstance().setMarkdown(post.postContent || '');
					}
				}, 100);
			}
		},
		onError: (error) => {
			console.error('Error fetching post:', error);
			sweetMixinErrorAlert('Failed to load post data');
		},
	});

	// Monitor content changes for dynamic height
	useEffect(() => {
		const editor = editorRef.current?.getInstance();
		if (!editor) return;

		const updateHeight = () => {
			const markdown = editor.getMarkdown();
			const lines = markdown.split('\n').length;
			
			let newHeight = '200px';
			if (lines > 5) newHeight = '250px';
			if (lines > 10) newHeight = '300px';
			if (lines > 15) newHeight = '350px';
			if (lines > 20) newHeight = '400px';
			
			setEditorHeight(newHeight);
			setPostContent(markdown);
		};

		editor.on('change', updateHeight);

		return () => {
			editor.off('change');
		};
	}, []);

	/** HANDLERS **/
	const handleClose = () => {
		setOpen(false);
		setTimeout(() => {
			router.push('/mypage?category=myPosts');
		}, 300);
	};

	// Multiple image upload (GraphQL multipart, up to 3)
	const uploadImages = async () => {
		try {
			const formData = new FormData();
			const selectedFiles = inputRef.current?.files;

			if (!selectedFiles || selectedFiles.length === 0) return false;
			if (selectedFiles.length > 3) throw new Error('Cannot upload more than 3 images!');
			if (postImages.length + selectedFiles.length > 3) throw new Error('Maximum 3 images total!');

			const numFiles = selectedFiles.length;
			const filesArray = Array(3).fill(null);
			const mapObj: any = {};
			for (let i = 0; i < 3; i++) {
				mapObj[i] = [`variables.files.${i}`];
			}

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) { 
						imagesUploader(files: $files, target: $target)
					}`,
					variables: {
						files: filesArray,
						target: 'post', 
					},
				}),
			);

			formData.append('map', JSON.stringify(mapObj));

			for (let i = 0; i < numFiles; i++) {
				formData.append(i.toString(), selectedFiles[i]);
			}

			const token = getJwtToken();
			if (!token) throw new Error('Please log in to upload images');

			setUploadingImages(true);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL || `${REACT_APP_API_URL}/graphql`}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.data.data?.imagesUploader) {
				throw new Error('Upload failed: No images returned');
			}

			const responseImages = response.data.data.imagesUploader.filter((url: string) => url);

			const newImages = [...postImages, ...responseImages].slice(0, 3);
			setPostImages(newImages);

			await sweetMixinSuccessAlert('Images uploaded successfully!');

			inputRef.current!.value = '';

		} catch (err: any) {
			console.log('err: ', err.message || err);
			await sweetMixinErrorAlert(err.message || 'Upload failed');
			if (inputRef.current) inputRef.current.value = '';
		} finally {
			setUploadingImages(false);
		}
	};

	// Remove image
	const removeImage = (index: number) => {
		const newImages = postImages.filter((_: any, i: number) => i !== index);
		setPostImages(newImages);
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

		setErrors(newErrors);
		return isValid;
	};

	const handleSubmit = async () => {
		try {
			setErrors({ title: '', content: '' });

			if (!validateForm()) {
				return;
			}

			const postContent = editorRef.current?.getInstance().getMarkdown();

			if (!postContent || !postTitle) {
				throw new Error(Message.INSERT_ALL_INPUTS);
			}

			await updatePost({
				variables: {
					input: {
						_id: postId,
						postTitle,
						postContent,
						postImages: postImages,
					},
				},
			});

			await sweetTopSuccessAlert('Post updated successfully', 700);
			setOpen(false);
			setTimeout(() => {
				router.push('/mypage?category=myPosts');
			}, 300);
		} catch (err: any) {
			console.log(err);
			sweetErrorHandling(err).then();
		}
	};

	// Auto-expand title on focus
	const handleTitleFocus = () => {
		const inputElement = document.querySelector('.title-input input') as HTMLInputElement;
		if (inputElement) {
			inputElement.style.fontSize = '18px';
		}
	};

	const handleTitleBlur = () => {
		if (!postTitle) {
			const inputElement = document.querySelector('.title-input input') as HTMLInputElement;
			if (inputElement) {
				inputElement.style.fontSize = '16px';
			}
		}
	};

	if (device === 'mobile') {
		return <div>UPDATE POST MOBILE</div>;
	}

	if (getPostLoading) {
		return (
			<Modal open={open} onClose={handleClose}>
				<Box className="write-post-modal-content">
					<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
						<CircularProgress size={48} />
						<p style={{ marginTop: '16px', color: '#6b7280' }}>Loading post...</p>
					</Stack>
				</Box>
			</Modal>
		);
	}

	if (getPostError) {
		return (
			<Modal open={open} onClose={handleClose}>
				<Box className="write-post-modal-content">
					<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
						<AlertCircle size={48} color="#ef4444" />
						<p style={{ marginTop: '16px', color: '#ef4444' }}>Failed to load post</p>
					</Stack>
				</Box>
			</Modal>
		);
	}

	return (
		<Modal
			open={open}
			onClose={handleClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
				sx: {
					backgroundColor: 'rgba(0, 0, 0, 0.75)',
					backdropFilter: 'blur(8px)',
				}
			}}
			className="write-post-modal"
		>
			<Box className="write-post-modal-content">
				{/* Modal Header */}
				<Box className="modal-header">
					<Box className="header-left">
						<Box className="header-icon edit-mode">
							<Edit3 size={20} />
						</Box>
						<h2>Edit Post</h2>
					</Box>
					<IconButton className="close-btn" onClick={handleClose}>
						<X size={20} />
					</IconButton>
				</Box>

				{/* Scrollable Content */}
				<Box className="modal-body">
					{/* Author Section */}
					<Box className="author-section">
						<Avatar 
							src={user?.memberImage || '/img/profile/defaultUser.svg'} 
							className="author-avatar"
						/>
						<Box className="author-info">
							<h3>{user?.memberNick || 'Anonymous'}</h3>
							<Chip 
								icon={<Edit3 size={12} />}
								label="Editing" 
								size="small"
								className="visibility-chip editing"
							/>
						</Box>
					</Box>

					{/* Title - Dynamic */}
					<Box className="form-group">
						<TextField
							fullWidth
							placeholder="What's on your mind? Give your post a title..."
							value={postTitle}
							onChange={(e) => setPostTitle(e.target.value)}
							onFocus={handleTitleFocus}
							onBlur={handleTitleBlur}
							error={!!errors.title}
							helperText={errors.title}
							className="title-input"
							inputProps={{ maxLength: 100 }}
							variant="standard"
							multiline
							maxRows={3}
						/>
						<Box className="char-counter">
							<span className={postTitle.length > 90 ? 'warning' : ''}>
								{postTitle.length}/100
							</span>
						</Box>
					</Box>

					{/* Editor - Dynamic Height */}
					<Box className={`editor-wrapper ${errors.content ? 'error' : ''}`}>
						<Box className="editor-header">
							<span className="editor-label">Post Content</span>
							<span className="content-counter">
								{postContent.length} characters
							</span>
						</Box>
						<Editor
							ref={editorRef}
							initialValue=" "
							placeholder="Share your thoughts, experiences, or knowledge..."
							previewStyle="vertical"
							height={editorHeight}
							initialEditType="markdown"
							useCommandShortcut={true}
							hideModeSwitch={true}
							toolbarItems={[
								['heading', 'bold', 'italic', 'strike'],
								['hr', 'quote'],
								['ul', 'ol', 'task'],
								['link', 'code', 'codeblock'],
							]}
						/>
					</Box>
					{errors.content && (
						<Box className="error-msg">
							<AlertCircle size={14} />
							<span>{errors.content}</span>
						</Box>
					)}

					{/* Image Upload - Multiple (Gallery Style) */}
					<Box className="form-group images-section">
						<Box className="images-header">
							<label className="form-label">
								<ImageIcon size={16} />
								Post Images (Optional)
							</label>
							<span className="image-counter">
								{postImages.length}/3
							</span>
						</Box>
						
						<Stack className="images-box">
							{/* Gallery */}
							{postImages.length > 0 && (
								<Stack className="gallery-box">
									{postImages.map((image: string, index: number) => (
										<Stack key={index} className="image-box">
											<img src={`${REACT_APP_API_URL}/${image}`} alt={`Post ${index + 1}`} />
											<IconButton 
												className="remove-img-btn"
												onClick={() => removeImage(index)}
												size="small"
											>
												<X size={16} />
											</IconButton>
											{index === 0 && <Chip label="Cover" size="small" className="cover-chip" />}
										</Stack>
									))}
								</Stack>
							)}

							{/* Upload Box */}
							{postImages.length < 3 && (
								<Stack 
									className="upload-box" 
									onClick={() => !uploadingImages && inputRef.current?.click()}
								>
									<ImageIcon size={24} className="upload-icon" />
									<p>{uploadingImages ? 'Uploading...' : 'Add Photos'}</p>
									<span>PNG, JPG (Max 3)</span>
									<input
										ref={inputRef}
										type="file"
										accept="image/jpg, image/jpeg, image/png"
										multiple
										onChange={uploadImages}
										style={{ display: 'none' }}
										id="post-images-upload"
										disabled={uploadingImages}
									/>
								</Stack>
							)}
						</Stack>
					</Box>
				</Box>

				{/* Modal Footer */}
				<Box className="modal-footer">
					<Box className="footer-info">
						{(postTitle || postContent || postImages.length > 0) && (
							<span className="draft-indicator edit-mode">
								● Editing mode
							</span>
						)}
					</Box>
					<Box className="footer-actions">
						<Button
							variant="text"
							className="cancel-btn"
							onClick={handleClose}
							disabled={updateLoading || uploadingImages}
						>
							Cancel
						</Button>
						<Button
							variant="contained"
							className="post-btn update-btn"
							onClick={handleSubmit}
							disabled={updateLoading || uploadingImages || !postTitle.trim()}
							startIcon={updateLoading ? null : <Save size={16} />}
						>
							{updateLoading ? 'Updating...' : 'Update Post'}
						</Button>
					</Box>
				</Box>
			</Box>
		</Modal>
	);
};

export default withLayoutMain(UpdatePost);