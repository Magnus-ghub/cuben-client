import React, { useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Box, Stack } from '@mui/material';


interface TViewerProps {
	markdown?: string;
	html?: string;
	className?: string;
}

const TViewer: React.FC<TViewerProps> = ({ markdown, html, className }) => {
	const editor = useMemo(() => {
		if (!markdown && !html) return null;

		return useEditor({
			extensions: [
				StarterKit.configure({
					heading: {
						levels: [1, 2, 3, 4, 5, 6],
					},
					codeBlock: {
						languageClassPrefix: 'language-',
					},
				}),
				Link.configure({
					openOnClick: true,
					autolink: true,
				}),
				Image.configure({
					allowBase64: true,
				}),
			],
			content: html || markdown || '',
			editable: false, // Read-only mode
		});
	}, [markdown, html]);

	if (!editor) {
		return (
			<Stack sx={{ background: 'white', mt: '30px', borderRadius: '10px' }}>
				<Box component={'div'} sx={{ m: '40px' }}>
					<p>No content to display</p>
				</Box>
			</Stack>
		);
	}

	return (
		<Stack 
			sx={{ background: 'white', mt: '30px', borderRadius: '10px' }}
			className={`tviewer-container ${className || ''}`}
		>
			<Box component={'div'} sx={{ m: '40px' }} className="tviewer-content">
				<EditorContent editor={editor} className="tiptap-viewer" />
			</Box>
		</Stack>
	);
};

export default TViewer;