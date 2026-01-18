import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { 
  Box, 
  Stack, 
  Button, 
  TextField, 
  Chip, 
  Avatar, 
  IconButton, 
  Modal, 
  Backdrop, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import { gql, useReactiveVar, useMutation, useQuery } from '@apollo/client';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { userVar } from '../../libs/apollo/store';
import dynamic from 'next/dynamic';
import '@toast-ui/editor/dist/toastui-editor.css';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert, sweetTopSuccessAlert } from '../../libs/sweetAlert';
import { getJwtToken } from '../../libs/auth';
import { REACT_APP_API_URL } from '../../libs/config';
import axios from 'axios';
import { 
  FileText, 
  Image as ImageIcon, 
  X, 
  AlertCircle,
  Sparkles,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { Message } from '../../libs/enums/common.enum';
import { UPDATE_ARTICLE, UPDATE_POST, UPDATE_PRODUCT } from '../../libs/apollo/user/mutation';

// Dynamic Editor import
const Editor = dynamic(
  () => import('@toast-ui/react-editor').then(mod => mod.Editor),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);

// GET queries (placeholders - adjust fields as per your schema)
const GET_ARTICLE = gql`query GetArticle($id: ID!) { 
  getArticle(_id: $id) { 
    _id 
    articleTitle 
    articleContent 
    articleImage 
    articleCategory 
    articleStatus 
  } 
}`;
const GET_POST = gql`query GetPost($id: ID!) { 
  getPost(_id: $id) { 
    _id 
    postTitle 
    postContent 
    postImages 
    postStatus 
  } 
}`;
const GET_PRODUCT = gql`query GetProduct($id: ID!) { 
  getProduct(_id: $id) { 
    _id 
    productName 
    productDesc 
    productImages 
    productType 
    productStatus 
    productCondition 
    productAddress 
    productPrice 
  } 
}`;

// Enums
enum PostStatus { ACTIVE = 'ACTIVE', DELETE = 'DELETE', BLOCKED = 'BLOCKED' }
enum ArticleStatus { ACTIVE = 'ACTIVE', DELETE = 'DELETE' }
enum ArticleCategory { CAREER = 'CAREER', ANNOUNCEMENTS = 'ANNOUNCEMENTS', KNOWLEDGE = 'KNOWLEDGE', EVENTS = 'EVENTS' }
enum ProductStatus { ACTIVE = 'ACTIVE', RESERVED = 'RESERVED', SOLD = 'SOLD', DELETE = 'DELETE' }
enum ProductType { EDU = 'EDU', TECH = 'TECH', STYLE = 'STYLE', HOME = 'HOME', SERVICE = 'SERVICE', OTHER = 'OTHER' }
enum ProductCondition { NEW = 'NEW', LIKE_NEW = 'LIKE_NEW', GOOD = 'GOOD', USED = 'USED', BAD = 'BAD' }

const UpdateItem: NextPage = () => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const router = useRouter();
  const editorRef = useRef<any>(null); // Type as any for dynamic
  const inputRef = useRef<HTMLInputElement>(null);  

  const { type, id } = router.query as { type: 'post' | 'article' | 'product'; id: string };

  // Modal State
  const [open, setOpen] = useState<boolean>(true);

  // Form State
  const [formData, setFormData] = useState<any>({});
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [initialContent, setInitialContent] = useState<string>(''); // Separate state for editor initialValue

  // Dynamic max images
  const maxImages = type === 'article' ? 1 : 3;

  /** APOLLO REQUESTS - Dynamic */
  let getItemQuery: any, itemKey = '';
  let updateMutation: any;
  switch (type) {
    case 'post':
      getItemQuery = GET_POST;
      updateMutation = UPDATE_POST;
      itemKey = 'getPost';
      break;
    case 'article':
      getItemQuery = GET_ARTICLE;
      updateMutation = UPDATE_ARTICLE;
      itemKey = 'getArticle';
      break;
    case 'product':
      getItemQuery = GET_PRODUCT;
      updateMutation = UPDATE_PRODUCT;
      itemKey = 'getProduct';
      break;
    default:
      router.push('/');
      return null;
  }

  const [updateItem] = useMutation(updateMutation);

  const { loading: fetchLoading, data: itemData, error: fetchError } = useQuery(getItemQuery, {
    variables: { id },
    skip: !id || !type,
    onCompleted: (data) => {
      const item = data[itemKey];
      if (item) {
        const title = item[`${type}Title`] || item[`${type}Name`];
        const content = item[`${type}Content`] || item[`${type}Desc`] || '';
        const imgField = item[`${type}Images`] || (item[`${type}Image`] ? [item[`${type}Image`]] : []);
        setFormData({
          status: item[`${type}Status`] || (type === 'post' ? PostStatus.ACTIVE : type === 'article' ? ArticleStatus.ACTIVE : ProductStatus.ACTIVE),
          category: item[`${type}Category`], // article
          type: item[`${type}Type`], // product
          condition: item[`${type}Condition`],
          title,
          price: item[`${type}Price`] || 0,
          address: item[`${type}Address`] || '',
        });
        setImages(Array.isArray(imgField) ? imgField : imgField.filter(Boolean));
        setInitialContent(content); // Set for initialValue
      }
    },
    onError: (err) => sweetErrorHandling(err),
  });

  // useEffect to set editor content after mount (for dynamic Editor)
  useEffect(() => {
    if (editorRef.current && initialContent && fetchLoading === false) {
      try {
        editorRef.current.getInstance().setMarkdown(initialContent);
      } catch (err) {
        console.warn('Editor not ready yet:', err);
      }
    }
  }, [initialContent, fetchLoading]);

  /** HANDLERS */
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => router.back(), 300);
  };

  const uploadImages = async () => {
    try {
      const formData = new FormData();
      const selectedFiles = inputRef.current?.files;

      if (!selectedFiles || selectedFiles.length === 0) return false;
      if (images.length + selectedFiles.length > maxImages) {
        throw new Error(`Cannot exceed ${maxImages} images!`);
      }

      const numFiles = Math.min(selectedFiles.length, maxImages - images.length);
      const filesArray = Array(maxImages).fill(null);
      const mapObj: any = {};
      for (let i = 0; i < maxImages; i++) {
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
            target: type,  
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
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.data.data?.imagesUploader) {
        throw new Error('Upload failed: No images returned');
      }

      const responseImages = response.data.data.imagesUploader.filter((url: string) => url).slice(0, numFiles);  
      const newImages = [...images, ...responseImages];
      setImages(newImages.slice(0, maxImages));

      await sweetMixinSuccessAlert('Images uploaded successfully!');

      if (inputRef.current) inputRef.current.value = '';  
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
    const newImages = images.filter((_: any, i: number) => i !== index);
    setImages(newImages);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    const title = formData.title?.trim();
    if (!title) {
      newErrors.title = 'Title is required';
      isValid = false;
    } else {
      const maxLen = type === 'article' ? 200 : type === 'product' ? 100 : 500;
      const minLen = 3;
      if (title.length < minLen) {
        newErrors.title = `Title must be at least ${minLen} characters`;
        isValid = false;
      } else if (title.length > maxLen) {
        newErrors.title = `Title must be less than ${maxLen} characters`;
        isValid = false;
      }
    }

    const content = editorRef.current?.getInstance()?.getMarkdown();
    const minContentLen = type === 'product' ? 5 : 3;
    if (!content || content.trim().length < minContentLen) {
      newErrors.content = `Content must be at least ${minContentLen} characters`;
      isValid = false;
    }

    // Product-specific
    if (type === 'product') {
      const price = formData.price;
      if (price === undefined || price === '' || Number(price) < 0) {
        newErrors.price = 'Price must be a positive number';
        isValid = false;
      }
      const address = formData.address?.trim();
      if (!address) {
        newErrors.address = 'Address is required';
        isValid = false;
      } else if (address.length < 3 || address.length > 100) {
        newErrors.address = 'Address must be 3-100 characters';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    try {
      setErrors({});

      if (!validateForm()) return;

      const content = editorRef.current?.getInstance()?.getMarkdown();
      if (!content?.trim()) {
        throw new Error(Message.INSERT_ALL_INPUTS);
      }

      // Construct input based on type and schema
      let input: any = { _id: id };

      switch (type) {
        case 'post':
          input = {
            ...input,
            postStatus: formData.status,
            postTitle: formData.title,
            postContent: content,
            postImages: images,
            ...(formData.status === PostStatus.DELETE ? { deletedAt: new Date().toISOString() } : {}),
            ...(formData.status === PostStatus.BLOCKED ? { blockedAt: new Date().toISOString() } : {}),
          };
          break;
        case 'article':
          input = {
            ...input,
            articleStatus: formData.status,
            articleCategory: formData.category,
            articleTitle: formData.title,
            articleContent: content,
            articleImage: images[0] || null, // Single image
          };
          break;
        case 'product':
          input = {
            ...input,
            productStatus: formData.status,
            productType: formData.type,
            productCondition: formData.condition,
            productAddress: formData.address,
            productName: formData.title,
            productDesc: content,
            productPrice: Number(formData.price),
            productImages: images,
            ...(formData.status === ProductStatus.SOLD ? { soldAt: new Date().toISOString() } : {}),
            ...(formData.status === ProductStatus.DELETE ? { deletedAt: new Date().toISOString() } : {}),
          };
          break;
      }

      await updateItem({ variables: { input } });

      await sweetTopSuccessAlert(`${type.toUpperCase()} updated successfully`, 700);
      setOpen(false);
      setTimeout(() => router.back(), 300);
    } catch (err: any) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  // Dynamic title
  const getTitle = () => `Update ${type.charAt(0).toUpperCase() + type.slice(1)}`;

  // Render dynamic fields
  const renderFields = () => (
    <Stack spacing={2}>
      {/* Title/Name */}
      <TextField
        fullWidth
        label={`${type === 'product' ? 'Product Name' : 'Title'}`}
        value={formData.title || ''}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        error={!!errors.title}
        helperText={errors.title}
        inputProps={{ 
          maxLength: type === 'article' ? 200 : type === 'product' ? 100 : 500 
        }}
        variant="standard"
      />

      {/* Category/Type */}
      {(type === 'article' || type === 'product') && (
        <FormControl fullWidth error={!!errors.category || !!errors.type}>
          <InputLabel>{type === 'article' ? 'Category' : 'Type'}</InputLabel>
          <Select
            value={formData.category || formData.type || ''}
            label={type === 'article' ? 'Category' : 'Type'}
            onChange={(e) => setFormData({ ...formData, [type === 'article' ? 'category' : 'type']: e.target.value })}
          >
            {type === 'article' 
              ? Object.values(ArticleCategory).map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)
              : Object.values(ProductType).map(typ => <MenuItem key={typ} value={typ}>{typ}</MenuItem>)
            }
          </Select>
          {(errors.category || errors.type) && <FormHelperText>{errors.category || errors.type}</FormHelperText>}
        </FormControl>
      )}

      {/* Condition - Product only */}
      {type === 'product' && (
        <FormControl component="fieldset" error={!!errors.condition}>
          <RadioGroup
            value={formData.condition || ''}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
          >
            {Object.values(ProductCondition).map(cond => (
              <FormControlLabel key={cond} value={cond} control={<Radio />} label={cond} />
            ))}
          </RadioGroup>
          {errors.condition && <FormHelperText>{errors.condition}</FormHelperText>}
        </FormControl>
      )}

      {/* Address - Product only */}
      {type === 'product' && (
        <TextField
          fullWidth
          label="Address"
          value={formData.address || ''}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          error={!!errors.address}
          helperText={errors.address}
          inputProps={{ maxLength: 100 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><MapPin size={16} /></InputAdornment> }}
          variant="standard"
        />
      )}

      {/* Price - Product only */}
      {type === 'product' && (
        <TextField
          fullWidth
          label="Price"
          type="number"
          value={formData.price || ''}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          error={!!errors.price}
          helperText={errors.price}
          InputProps={{ startAdornment: <InputAdornment position="start"><DollarSign size={16} /></InputAdornment> }}
          variant="standard"
          inputProps={{ min: 0, step: '0.01' }}
        />
      )}

      {/* Status */}
      <FormControl fullWidth error={!!errors.status}>
        <InputLabel>Status</InputLabel>
        <Select
          value={formData.status || ''}
          label="Status"
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          {type === 'post' 
            ? Object.values(PostStatus).map(stat => <MenuItem key={stat} value={stat}>{stat}</MenuItem>)
            : type === 'article'
            ? Object.values(ArticleStatus).map(stat => <MenuItem key={stat} value={stat}>{stat}</MenuItem>)
            : Object.values(ProductStatus).map(stat => <MenuItem key={stat} value={stat}>{stat}</MenuItem>)
          }
        </Select>
        {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
      </FormControl>

      {/* Images */}
      <Box className="form-group">
        <label className="form-label">
          {type === 'article' ? 'Image' : 'Images'} (Optional)
          <span className="char-count">{images.length}/{maxImages}</span>
        </label>
        <Stack className="images-box">
          {images.length < maxImages && (
            <Stack className="upload-box" onClick={() => inputRef.current?.click()}>
              <ImageIcon size={20} />
              <p>{uploadingImages ? 'Uploading...' : `Add ${type === 'article' ? 'Image' : 'Photos'}`}</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpg, image/jpeg, image/png"
                multiple={type !== 'article'}
                onChange={uploadImages}
                style={{ display: 'none' }}
                id="update-images-upload"
                disabled={uploadingImages}
              />
            </Stack>
          )}

          {/* Gallery */}
          {images.length > 0 && (
            <Stack className="gallery-box">
              {images.map((image: string, index: number) => (
                <Stack key={index} className="image-box">
                  <img src={`${REACT_APP_API_URL}/${image}`} alt={`${type} image ${index + 1}`} />
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
      {/* <Box className={`editor-wrapper ${errors.content ? 'error' : ''}`}>
        <label className="form-label">Content / Description</label>
        <Editor
          ref={editorRef}
          initialValue={initialContent}
          placeholder={`Write your ${type} content here...`}
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
        {errors.content && (
          <Box className="error-msg">
            <AlertCircle size={14} />
            <span>{errors.content}</span>
          </Box>
        )}
      </Box> */}
    </Stack>
  );

  if (device === 'mobile') {
    return <div>UPDATE ITEM MOBILE</div>;
  }

  if (fetchLoading) {
    return (
      <Modal open={open} className="write-post-modal">
        <Box className="write-post-modal-content">
          <Stack alignItems="center" justifyContent="center" height="400px" spacing={2}>
            <p>Loading {type} data...</p>
          </Stack>
        </Box>
      </Modal>
    );
  }

  if (fetchError || !itemData) {
    return (
      <Modal open={open} onClose={handleClose} className="write-post-modal">
        <Box className="write-post-modal-content">
          <Stack alignItems="center" justifyContent="center" height="400px" spacing={2}>
            <AlertCircle size={48} style={{ color: '#f02849' }} />
            <p>Error loading {type}. <Button onClick={handleClose}>Close</Button></p>
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
            <Box className="header-icon">
              <FileText size={20} />
            </Box>
            <h2>{getTitle()}</h2>
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

          {renderFields()}
        </Box>

        {/* Modal Footer */}
        <Box className="modal-footer">
          <Button
            variant="text"
            className="cancel-btn"
            onClick={handleClose}
            disabled={uploadingImages}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="post-btn"
            onClick={handleSubmit}
            disabled={uploadingImages || !formData.title?.trim()}
          >
            {uploadingImages ? 'Updating...' : 'Update'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default withLayoutMain(UpdateItem);