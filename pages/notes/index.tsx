import React, { useState, useEffect } from 'react';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { Box, Stack, Typography, IconButton, TextField, InputAdornment, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import CloseIcon from '@mui/icons-material/Close';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

const NOTE_COLORS = [
  { name: 'Default', value: '#ffffff' },
  { name: 'Red', value: '#fee2e2' },
  { name: 'Orange', value: '#fed7aa' },
  { name: 'Yellow', value: '#fef3c7' },
  { name: 'Green', value: '#d1fae5' },
  { name: 'Blue', value: '#dbeafe' },
  { name: 'Purple', value: '#e9d5ff' },
  { name: 'Pink', value: '#fce7f3' },
];

const STORAGE_KEY = 'cuben_notes';

function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '', color: '#ffffff' });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [colorPickerAnchor, setColorPickerAnchor] = useState<null | HTMLElement>(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      saveNotes();
    }
  }, [notes]);

  const loadNotes = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedNotes = JSON.parse(stored);
        setNotes(parsedNotes);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNotes = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const createNote = () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      color: newNote.color,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '', color: '#ffffff' });
    setIsCreating(false);
  };

  const updateNote = (noteId: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ));
    setEditingNote(null);
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    handleMenuClose();
  };

  const togglePin = (note: Note) => {
    updateNote(note.id, { isPinned: !note.isPinned });
  };

  const changeNoteColor = (note: Note, color: string) => {
    updateNote(note.id, { color });
    setColorPickerAnchor(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, note: Note) => {
    setAnchorEl(event.currentTarget);
    setSelectedNote(note);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNote(null);
  };

  const handleEditNote = () => {
    if (selectedNote) {
      setEditingNote(selectedNote);
      handleMenuClose();
    }
  };

  const handleDeleteNote = () => {
    if (selectedNote) {
      deleteNote(selectedNote.id);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);

  return (
    <div className="notes-page-container">
      {/* Header */}
      <Stack className="notes-header">
        <Box className="header-content">
          <Box className="header-left">
            <StickyNote2Icon className="header-icon" />
            <Box>
              <Typography className="header-title">My Notes</Typography>
              <Typography className="header-subtitle">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'} · Saved locally
              </Typography>
            </Box>
          </Box>
          <button className="create-note-btn" onClick={() => setIsCreating(true)}>
            <AddIcon />
            <span>New Note</span>
          </button>
        </Box>
      </Stack>

      {/* Search Bar */}
      <Box className="search-container">
        <TextField
          fullWidth
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Create/Edit Note Modal */}
      {(isCreating || editingNote) && (
        <Box className="note-modal-overlay" onClick={() => {
          setIsCreating(false);
          setEditingNote(null);
        }}>
          <Box className="note-modal" onClick={(e) => e.stopPropagation()}>
            <Box className="modal-header">
              <Typography className="modal-title">
                {editingNote ? 'Edit Note' : 'Create New Note'}
              </Typography>
              <IconButton onClick={() => {
                setIsCreating(false);
                setEditingNote(null);
              }}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box className="modal-content">
              <input
                type="text"
                placeholder="Title"
                className="note-title-input"
                value={editingNote ? editingNote.title : newNote.title}
                onChange={(e) => {
                  if (editingNote) {
                    setEditingNote({ ...editingNote, title: e.target.value });
                  } else {
                    setNewNote({ ...newNote, title: e.target.value });
                  }
                }}
              />
              <textarea
                placeholder="Take a note..."
                className="note-content-input"
                value={editingNote ? editingNote.content : newNote.content}
                onChange={(e) => {
                  if (editingNote) {
                    setEditingNote({ ...editingNote, content: e.target.value });
                  } else {
                    setNewNote({ ...newNote, content: e.target.value });
                  }
                }}
              />
              <Box className="modal-footer">
                <Box className="color-picker-mini">
                  {NOTE_COLORS.slice(0, 5).map((color) => (
                    <Box
                      key={color.value}
                      className="color-dot"
                      style={{ background: color.value }}
                      onClick={() => {
                        if (editingNote) {
                          setEditingNote({ ...editingNote, color: color.value });
                        } else {
                          setNewNote({ ...newNote, color: color.value });
                        }
                      }}
                    />
                  ))}
                </Box>
                <button
                  className="save-note-btn"
                  onClick={() => {
                    if (editingNote) {
                      updateNote(editingNote.id, {
                        title: editingNote.title,
                        content: editingNote.content,
                        color: editingNote.color,
                      });
                    } else {
                      createNote();
                    }
                  }}
                >
                  {editingNote ? 'Update' : 'Create'}
                </button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Notes Grid */}
      <Stack className="notes-content">
        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <Box className="notes-section">
            <Typography className="section-title">📌 Pinned</Typography>
            <Box className="notes-grid">
              {pinnedNotes.map((note) => (
                <Box
                  key={note.id}
                  className="note-card"
                  style={{ backgroundColor: note.color }}
                >
                  <Box className="note-header">
                    <Typography className="note-title">{note.title || 'Untitled'}</Typography>
                    <Box className="note-actions">
                      <IconButton size="small" onClick={() => togglePin(note)}>
                        <PushPinIcon className="pin-icon pinned" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, note)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography className="note-content">{note.content}</Typography>
                  <Typography className="note-date">
                    {new Date(note.updatedAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Other Notes */}
        {unpinnedNotes.length > 0 && (
          <Box className="notes-section">
            <Typography className="section-title">
              {pinnedNotes.length > 0 ? 'Other Notes' : 'All Notes'}
            </Typography>
            <Box className="notes-grid">
              {unpinnedNotes.map((note) => (
                <Box
                  key={note.id}
                  className="note-card"
                  style={{ backgroundColor: note.color }}
                >
                  <Box className="note-header">
                    <Typography className="note-title">{note.title || 'Untitled'}</Typography>
                    <Box className="note-actions">
                      <IconButton size="small" onClick={() => togglePin(note)}>
                        <PushPinOutlinedIcon className="pin-icon" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, note)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography className="note-content">{note.content}</Typography>
                  <Typography className="note-date">
                    {new Date(note.updatedAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <Box className="empty-state">
            <StickyNote2Icon className="empty-icon" />
            <Typography className="empty-title">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </Typography>
            <Typography className="empty-subtitle">
              {searchQuery
                ? 'Try different keywords'
                : 'Click "New Note" to create your first note'}
            </Typography>
          </Box>
        )}
      </Stack>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditNote}>
          <EditIcon fontSize="small" style={{ marginRight: 8 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={(e) => setColorPickerAnchor(e.currentTarget)}>
          <ColorLensIcon fontSize="small" style={{ marginRight: 8 }} />
          Change Color
        </MenuItem>
        <MenuItem onClick={handleDeleteNote} style={{ color: '#ef4444' }}>
          <DeleteOutlineIcon fontSize="small" style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Color Picker Menu */}
      <Menu
        anchorEl={colorPickerAnchor}
        open={Boolean(colorPickerAnchor)}
        onClose={() => setColorPickerAnchor(null)}
      >
        <Box className="color-picker-menu">
          {NOTE_COLORS.map((color) => (
            <Box
              key={color.value}
              className="color-option"
              style={{ backgroundColor: color.value }}
              onClick={() => {
                if (selectedNote) {
                  changeNoteColor(selectedNote, color.value);
                }
              }}
            >
              <span>{color.name}</span>
            </Box>
          ))}
        </Box>
      </Menu>
    </div>
  );
}

export default withLayoutMain(NotesPage);