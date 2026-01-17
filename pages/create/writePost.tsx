import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Box, Stack, Button, TextField, Chip, Avatar, IconButton, Modal, Backdrop } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { useReactiveVar, useMutation } from '@apollo/client';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { userVar } from '../../libs/apollo/store';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert, sweetTopSuccessAlert } from '../../libs/sweetAlert';
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

const WritePost: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const editorRef = useRef<Editor>(null);
	const inputRef = useRef<HTMLInputElement>(null);  

	// Modal State
	const [open, setOpen] = useState<boolean>(true);

	// Form State
	const [postTitle, setPostTitle] = useState<string>('');
	const [postImages, setPostImages] = useState<string[]>([]);  
	const [uploadingImages, setUploadingImages] = useState<boolean>(false);  
	const [errors, setErrors] = useState({ title: '', content: '' });

	/** APOLLO REQUESTS **/
	const [createPost, { loading }] = useMutation(CREATE_POST);

	/** HANDLERS **/
	const handleClose = () => {
		setOpen(false);
		setTimeout(() => {
			router.back();
		}, 300);
	};

	
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
			console.log('+responseImages: ', responseImages);

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
		if (!content || content.trim().length < 10) {
			newErrors.content = 'Content must be at least 10 characters';
			isValid = false;
		}

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

			await createPost({
				variables: {
					input: {
						postTitle,
						postContent,
						postImages: postImages,  
					},
				},
			});

			await sweetTopSuccessAlert('Post is created successfully', 700);
			setOpen(false);
			setTimeout(() => {
				router.push({
					pathname: '/',
					query: {
						category: 'myPosts',
					},
				});
			}, 300);
		} catch (err: any) {
			console.log(err);
			sweetErrorHandling(err).then();
		}
	};

	if (device === 'mobile') {
		return <div>WRITE POST MOBILE</div>;
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
						<Box className="header-icon">
							<FileText size={20} />
						</Box>
						<h2>Create Post</h2>
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
								icon={<Sparkles size={12} />}
								label="Public" 
								size="small"
								className="visibility-chip"
							/>
						</Box>
					</Box>

					{/* Title */}
					<Box className="form-group">
						<TextField
							fullWidth
							placeholder="What's on your mind? Give your post a title..."
							value={postTitle}
							onChange={(e) => setPostTitle(e.target.value)}
							error={!!errors.title}
							helperText={errors.title}
							className="title-input"
							inputProps={{ maxLength: 100 }}
							variant="standard"
						/>
					</Box>

					<Box className="form-group">
						<label className="form-label">
							Post Images (Optional)
							<span className="char-count">{postImages.length}/3</span>
						</label>
						<Stack className="images-box">
							{/* Upload Box */}
							{postImages.length < 3 && (
								<Stack className="upload-box" onClick={() => inputRef.current?.click()}>
									<ImageIcon size={20} />
									<p>{uploadingImages ? 'Uploading...' : 'Add Photos'}</p>
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

							{/* Gallery */}
							{postImages.length > 0 && (
								<Stack className="gallery-box">
									{postImages.map((image: string, index: number) => (
										<Stack key={index} className="image-box">
											<img src={`${REACT_APP_API_URL}/${image}`} alt={`Post ${index + 1}`} />
											<IconButton 
												className="remove-img-btn"
												onClick={() => removeImage(index)}
											>
												<X size={16} />
											</IconButton>
										</Stack>
									))}
								</Stack>
							)}
						</Stack>
					</Box>

					{/* Editor */}
					<Box className={`editor-wrapper ${errors.content ? 'error' : ''}`}>
						<Editor
							ref={editorRef}
							initialValue=" "
							placeholder="Write your post content here..."
							previewStyle="vertical"
							height="300px"
							initialEditType="markdown"
							useCommandShortcut={true}
							hideModeSwitch={true}
							toolbarItems={[
								['heading', 'bold', 'italic'],
								['ul', 'ol'],
								['link', 'code'],
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

				{/* Modal Footer */}
				<Box className="modal-footer">
					<Button
						variant="text"
						className="cancel-btn"
						onClick={handleClose}
						disabled={loading || uploadingImages}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						className="post-btn"
						onClick={handleSubmit}
						disabled={loading || uploadingImages || !postTitle.trim()}
					>
						{loading ? 'Publishing...' : 'Post'}
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default withLayoutMain(WritePost);