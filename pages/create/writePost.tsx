import React, { useState } from 'react';
import { NextPage } from 'next';
import { Stack, Box, Typography ,TextField, Button, IconButton, Tab, Tabs } from '@mui/material';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import dynamic from 'next/dynamic';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
// const TuiEditor = dynamic(() => import('..community/Teditor'), { ssr: false });


interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

const TabPanel = (props: TabPanelProps) => {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`post-tabpanel-${index}`}
			aria-labelledby={`post-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
		</div>
	);
};

const WritePost: NextPage = () => {
	const device = useDeviceDetect();
	const [tabValue, setTabValue] = useState(0);
	const [postContent, setPostContent] = useState('');
	const [postTitle, setPostTitle] = useState('');
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>('');

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveImage = () => {
		setSelectedImage(null);
		setImagePreview('');
	};

	const handlePost = () => {
		// Post submission logic
		console.log('Posting...', { postTitle, postContent, selectedImage });
	};

	if (device === 'mobile') {
		return <div>WRITE POST MOBILE VERSION</div>;
	}

	return (
		<Stack className="writePost-page">
			<Stack>
				<Typography className="main-title">Write an Article</Typography>
		    <Typography className="sub-title">Feel free to write your ideas!</Typography>
			</Stack>
			
			{/* <div className="writePost-container">
				<div className="writePost-header">
					<h2>Create a Post</h2>
					<p>Share your thoughts with the Cuben community</p>
				</div>

				<div className="writePost-content">
					<Tabs 
						value={tabValue} 
						onChange={handleTabChange} 
						className="writePost-tabs"
					>
						<Tab label="Write Post" />
						<Tab label="Photo/Video" />
						<Tab label="Link" />
					</Tabs>

					<TabPanel value={tabValue} index={0}>
						<div className="writePost-form">
							<TextField
								fullWidth
								placeholder="Give your post a title..."
								variant="outlined"
								className="post-title-input"
								value={postTitle}
								onChange={(e) => setPostTitle(e.target.value)}
							/>
							
							<TextField
								fullWidth
								multiline
								rows={8}
								placeholder="What's on your mind?"
								variant="outlined"
								className="post-content-input"
								value={postContent}
								onChange={(e) => setPostContent(e.target.value)}
							/>

							<div className="post-actions">
								<div className="post-tools">
									<IconButton className="tool-button">
										<MdOutlineImage />
									</IconButton>
									<IconButton className="tool-button">
										<MdOutlineVideocam />
									</IconButton>
									<IconButton className="tool-button">
										<MdOutlineEmojiEmotions />
									</IconButton>
								</div>
								<Button 
									variant="contained" 
									className="post-submit-btn"
									onClick={handlePost}
									disabled={!postTitle || !postContent}
								>
									Post
								</Button>
							</div>
						</div>
					</TabPanel>

					<TabPanel value={tabValue} index={1}>
						<div className="writePost-form">
							<TextField
								fullWidth
								placeholder="Give your post a title..."
								variant="outlined"
								className="post-title-input"
								value={postTitle}
								onChange={(e) => setPostTitle(e.target.value)}
							/>

							<div className="image-upload-area">
								{!imagePreview ? (
									<label htmlFor="image-upload" className="upload-label">
										<MdOutlineImage className="upload-icon" />
										<p>Drag and drop or click to upload</p>
										<input
											id="image-upload"
											type="file"
											accept="image/*,video/*"
											onChange={handleImageSelect}
											style={{ display: 'none' }}
										/>
									</label>
								) : (
									<div className="image-preview">
										<img src={imagePreview} alt="Preview" />
										<IconButton 
											className="remove-image-btn"
											onClick={handleRemoveImage}
										>
											<MdClose />
										</IconButton>
									</div>
								)}
							</div>

							<TextField
								fullWidth
								multiline
								rows={4}
								placeholder="Add a caption... (optional)"
								variant="outlined"
								className="post-content-input"
								value={postContent}
								onChange={(e) => setPostContent(e.target.value)}
							/>

							<div className="post-actions">
								<div className="post-tools"></div>
								<Button 
									variant="contained" 
									className="post-submit-btn"
									onClick={handlePost}
									disabled={!postTitle || !selectedImage}
								>
									Post
								</Button>
							</div>
						</div>
					</TabPanel>

					<TabPanel value={tabValue} index={2}>
						<div className="writePost-form">
							<TextField
								fullWidth
								placeholder="Give your post a title..."
								variant="outlined"
								className="post-title-input"
								value={postTitle}
								onChange={(e) => setPostTitle(e.target.value)}
							/>
							
							<TextField
								fullWidth
								placeholder="Paste a link..."
								variant="outlined"
								className="post-link-input"
							/>

							<TextField
								fullWidth
								multiline
								rows={4}
								placeholder="Add some context... (optional)"
								variant="outlined"
								className="post-content-input"
								value={postContent}
								onChange={(e) => setPostContent(e.target.value)}
							/>

							<div className="post-actions">
								<div className="post-tools"></div>
								<Button 
									variant="contained" 
									className="post-submit-btn"
									onClick={handlePost}
									disabled={!postTitle}
								>
									Post
								</Button>
							</div>
						</div>
					</TabPanel>
				</div>

				<div className="writePost-sidebar">
					<div className="posting-tips">
						<h3>Posting Guidelines</h3>
						<ul>
							<li>Be respectful and kind to others</li>
							<li>Use clear and descriptive titles</li>
							<li>Add relevant tags to your post</li>
							<li>Check for duplicates before posting</li>
							<li>Follow community rules</li>
						</ul>
					</div>
				</div>
			</div> */}
		</Stack>
	);
};

export default withLayoutMain(WritePost);