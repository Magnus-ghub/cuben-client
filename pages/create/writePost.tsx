import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import {
  Box,
  Stack,
  Button,
  Chip,
  Avatar,
  IconButton,
  Modal,
  Backdrop,
} from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { useReactiveVar, useMutation } from '@apollo/client';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { userVar } from '../../libs/apollo/store';
import { sweetErrorHandling, sweetTopSuccessAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';

import { getJwtToken } from '../../libs/auth';
import { REACT_APP_API_URL } from '../../libs/config';
import axios from 'axios';
import { CREATE_POST } from '../../libs/apollo/user/mutation';

import {
  Image as ImageIcon,
  X,
  Sparkles,
  Bold,
  Italic,
  Link as LinkIcon,
} from 'lucide-react';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

const WritePost: NextPage = () => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState<boolean>(true);
  const [postTitle, setPostTitle] = useState<string>('');
  const [postImages, setPostImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);

  const [createPost, { loading }] = useMutation(CREATE_POST);

  // Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'editor-paragraph',
          },
        },
        heading: false,
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Placeholder.configure({
        placeholder: "What's on your mind?",
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap-content',
      },
    },
  });

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => router.back(), 300);
  };

  const uploadImages = async () => {
    try {
      const formData = new FormData();
      const selectedFiles = inputRef.current?.files;

      if (!selectedFiles || selectedFiles.length === 0) return;
      if (selectedFiles.length > 3) throw new Error('Maximum 3 images at once');
      if (postImages.length + selectedFiles.length > 3)
        throw new Error('Maximum 3 images total');

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
          variables: { files: filesArray, target: 'post' },
        })
      );
      formData.append('map', JSON.stringify(mapObj));

      for (let i = 0; i < numFiles; i++) {
        formData.append(i.toString(), selectedFiles[i]);
      }

      const token = getJwtToken();
      if (!token) throw new Error('Please log in');

      setUploadingImages(true);

      const res = await axios.post(
        `${process.env.REACT_APP_API_GRAPHQL_URL || `${REACT_APP_API_URL}/graphql`}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'apollo-require-preflight': true,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const uploaded = res.data.data?.imagesUploader?.filter(Boolean) || [];
      const newImages = [...postImages, ...uploaded].slice(0, 3);
      setPostImages(newImages);

      inputRef.current!.value = '';
    } catch (err: any) {
      console.error(err);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setPostImages(postImages.filter((_, i) => i !== index));
  };

  // Convert editor content to plain text with line breaks preserved
  const getContentAsText = (): string => {
    if (!editor) return '';
    
    const html = editor.getHTML();
    
    // Remove all HTML tags but keep line breaks
    const text = html
      .replace(/<\/p>/g, '\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    return text;
  };

  // Convert plain text to simple HTML paragraphs
  const textToHtml = (text: string): string => {
    if (!text) return '';
    
    return text
      .split('\n')
      .filter(line => line.trim())
      .map(line => `<p>${line.trim()}</p>`)
      .join('');
  };

  const handleSubmit = async () => {
    if (!editor) return;

    const titleTrimmed = postTitle.trim();
    const contentText = getContentAsText();

    if (!titleTrimmed || titleTrimmed.length < 5) {
      await sweetErrorHandling({ message: 'Title must be at least 5 characters' });
      titleInputRef.current?.focus();
      return;
    }

    if (!contentText) {
      await sweetErrorHandling({ message: 'Please write something' });
      editor.commands.focus();
      return;
    }

    try {
      // Convert to clean HTML
      const htmlContent = textToHtml(contentText);

      // Images are optional - can be empty array
      await createPost({
        variables: {
          input: {
            postTitle: titleTrimmed,
            postContent: htmlContent,
            postImages: postImages.length > 0 ? postImages : [],
          },
        },
      });

      await sweetTopSuccessAlert('Post created successfully!', 700);
      setOpen(false);
      setTimeout(() => {
        router.push({ pathname: '/', query: { category: 'myPosts' } });
      }, 300);
    } catch (err) {
      sweetErrorHandling(err);
    }
  };

  if (device === 'mobile') {
    return <div>MOBILE VERSION (Tiptap coming soon)</div>;
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: { backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' },
      }}
      className="write-post-modal"
    >
      <Box className="write-post-modal-content">
        {/* Header */}
        <Box className="post-modal-header">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={user?.memberImage || '/img/profile/defaultUser.svg'} 
              sx={{ width: 40, height: 40 }} 
            />
            <Box>
              <Box sx={{ fontSize: '15px', fontWeight: 600, color: '#050505' }}>
                {user?.memberNick || 'You'}
              </Box>
              <Chip
                icon={<Sparkles size={12} />}
                label="Public"
                size="small"
                sx={{ 
                  height: 20,
                  fontSize: '12px',
                  mt: 0.3,
                  background: '#e7f3ff', 
                  color: '#1877f2', 
                  fontWeight: 600,
                  '& .MuiChip-icon': { marginLeft: '4px' }
                }}
              />
            </Box>
          </Box>
          <IconButton 
            onClick={handleClose} 
            sx={{ 
              bgcolor: '#f0f2f5', 
              width: 36,
              height: 36,
              '&:hover': { bgcolor: '#e4e6eb' } 
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>

        {/* Body */}
        <Box className="post-modal-body">
          {/* Title Input */}
          <input
            ref={titleInputRef}
            type="text"
            placeholder="Add a title..."
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="title-input"
          />

          {/* Editor with Toolbar */}
          <Box className="editor-container">
            {/* Simple Toolbar */}
            {editor && (
              <Box className="editor-toolbar">
                <IconButton 
                  size="small" 
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive('bold') ? 'active' : ''}
                  title="Bold"
                >
                  <Bold size={18} />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive('italic') ? 'active' : ''}
                  title="Italic"
                >
                  <Italic size={18} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    const url = window.prompt('Enter the URL:');
                    if (url) editor.chain().focus().setLink({ href: url }).run();
                  }}
                  className={editor.isActive('link') ? 'active' : ''}
                  title="Add Link"
                >
                  <LinkIcon size={18} />
                </IconButton>
              </Box>
            )}
            
            <EditorContent editor={editor} />
          </Box>

          {/* Images */}
          {postImages.length > 0 && (
            <Box className="images-preview">
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                {postImages.map((img, idx) => (
                  <Box key={idx} className="image-item">
                    <img
                      src={`${REACT_APP_API_URL}/${img}`}
                      alt="preview"
                    />
                    <IconButton
                      size="small"
                      className="remove-btn"
                      onClick={() => removeImage(idx)}
                    >
                      <X size={16} />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box className="post-modal-footer">
          <Box 
            onClick={() => !uploadingImages && inputRef.current?.click()}
            className="add-to-post"
          >
            <Box sx={{ fontSize: '15px', fontWeight: 600, color: '#050505' }}>
              Add to your post
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton 
                size="small"
                disabled={uploadingImages || postImages.length >= 3}
                sx={{ 
                  color: postImages.length >= 3 ? '#bcc0c4' : '#45bd62',
                  '&:hover': { bgcolor: 'rgba(69, 189, 98, 0.1)' }
                }}
              >
                <ImageIcon size={24} />
              </IconButton>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png"
                multiple
                hidden
                onChange={uploadImages}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || uploadingImages || !postTitle.trim() || !editor?.getText().trim()}
            fullWidth
            className="post-button"
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default withLayoutMain(WritePost);