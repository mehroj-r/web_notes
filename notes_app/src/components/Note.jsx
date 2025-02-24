import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Note = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [content, setContent] = useState([]);
  const [fontSize, setFontSize] = useState(16);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedRange, setSelectedRange] = useState(null);
  const editorRef = useRef(null);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      try {
        const parsedNotes = JSON.parse(storedNotes);
        setNotes(parsedNotes);
        
        // Find note by ID from URL parameter
        if (noteId) {
          const foundNote = parsedNotes.find(note => note.note_id.toString() === noteId);
          if (foundNote) {
            setCurrentNote(foundNote);
            // Convert the content string to array by paragraphs
            setContent(foundNote.content.split(/\n\n|(?<=\.)\s+(?=[A-Z])/).filter(p => p.trim()));
          } else {
            // If note with ID not found, redirect to notes list
            navigate('/notes');
          }
        }
      } catch (e) {
        console.error('Error parsing notes from localStorage:', e);
        // Initialize with empty array if parsing fails
        setNotes([]);
      }
    }
  }, [noteId, navigate]);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  // Safely apply styling to selection
  const applyStyleToSelection = (style, value) => {
    const selection = window.getSelection();
    
    if (selection.rangeCount > 0) {
      try {
        document.execCommand('styleWithCSS', false, true);
        
        // Check if we need to toggle off the style
        const parentNode = selection.anchorNode.parentNode;
        if (parentNode.style && 
           ((style === 'fontWeight' && parentNode.style.fontWeight === 'bold') ||
            (style === 'fontStyle' && parentNode.style.fontStyle === 'italic') ||
            (style === 'textDecoration' && parentNode.style.textDecoration === 'underline'))) {
          // Toggle off the style
          if (style === 'fontWeight') document.execCommand('bold', false);
          if (style === 'fontStyle') document.execCommand('italic', false);
          if (style === 'textDecoration') document.execCommand('underline', false);
        } else {
          // Apply the style
          if (style === 'fontWeight') document.execCommand('bold', false);
          if (style === 'fontStyle') document.execCommand('italic', false);
          if (style === 'textDecoration') document.execCommand('underline', false);
          if (style === 'fontSize') document.execCommand('fontSize', false, value);
        }
      } catch (e) {
        console.error('Error applying style:', e);
      }
    }
  };

  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setFontSize(newSize);
    
    // Map font size to 1-7 range that execCommand expects
    const sizeMap = {
      12: 1,
      14: 2,
      16: 3,
      18: 4,
      20: 5,
      24: 6,
    };
    
    applyStyleToSelection('fontSize', sizeMap[newSize] || 3);
  };

  const handleFormat = (format) => {
    if (format === 'bold') {
      applyStyleToSelection('fontWeight', 'bold');
    } else if (format === 'italic') {
      applyStyleToSelection('fontStyle', 'italic');
    } else if (format === 'underline') {
      applyStyleToSelection('textDecoration', 'underline');
    }
  };

  const handleLinkClick = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && !selection.isCollapsed) {
      setSelectedRange(selection.getRangeAt(0).cloneRange());
      setIsLinkDialogOpen(true);
    }
  };

  const handleAddLink = () => {
    if (selectedRange && linkUrl) {
      try {
        // First select the previously stored range
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(selectedRange);
        
        // Create the link using execCommand
        document.execCommand('createLink', false, linkUrl);
        
        // Find the created link and add target="_blank"
        const links = editorRef.current.querySelectorAll('a');
        links.forEach(link => {
          if (link.href === linkUrl || link.href === window.location.origin + linkUrl) {
            link.target = '_blank';
            link.className = 'text-blue-400 hover:underline cursor-pointer';
            
            // Add click event handler to make links work
            link.addEventListener('click', (e) => {
              e.preventDefault();
              if (e.target.href) {
                window.open(e.target.href, '_blank');
              }
            });
          }
        });
        
        setIsLinkDialogOpen(false);
        setLinkUrl('');
        setSelectedRange(null);
      } catch (e) {
        console.error('Error creating link:', e);
      }
    }
  };

  const handleContentChange = (e) => {
    const newContent = e.target.innerText.split('\n\n').filter(p => p.trim());
    setContent(newContent);
    
    // Update the current note in state
    if (currentNote) {
      const updatedNote = {
        ...currentNote,
        content: newContent.join('\n\n')
      };
      
      setCurrentNote(updatedNote);
      
      // Update notes array with the modified note
      const updatedNotes = notes.map(note => 
        note.note_id === currentNote.note_id ? updatedNote : note
      );
      
      setNotes(updatedNotes);
    }
  };

  // Make sure any links in the editor are clickable
  const setupLinkHandlers = () => {
    if (editorRef.current) {
      const links = editorRef.current.querySelectorAll('a');
      links.forEach(link => {
        link.className = 'text-blue-400 hover:underline cursor-pointer';
        link.addEventListener('click', (e) => {
          e.preventDefault();
          if (e.target.href) {
            window.open(e.target.href, '_blank');
          }
        });
      });
    }
  };

  // Set up link handlers after component mounts
  useEffect(() => {
    setupLinkHandlers();
  }, []);

  // Function to save the current note
  const saveNote = () => {
    if (currentNote) {
      // Join the content array into a string
      const contentString = content.join('\n\n');
      
      // Create updated note object
      const updatedNote = {
        ...currentNote,
        content: contentString,
        lastModified: new Date().toISOString()
      };
      
      // Update notes array
      const updatedNotes = notes.map(note => 
        note.note_id === currentNote.note_id ? updatedNote : note
      );
      
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }
  };

  // Function to create a new note
  const createNewNote = () => {
    // Generate a new ID (use timestamp or uuid in a real app)
    const newId = Date.now();
    
    const newNote = {
      note_id: newId,
      title: "New Note",
      content: "Start writing your note here...",
      created: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setCurrentNote(newNote);
    setContent(["Start writing your note here..."]);
    
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    
    // Navigate to the new note URL
    navigate(`/notes/${newId}`);
  };

  // Get formatted date for display
  const getFormattedDate = () => {
    if (currentNote && currentNote.lastModified) {
      const date = new Date(currentNote.lastModified);
      return date.toLocaleDateString('en-GB');
    }
    return new Date().toLocaleDateString('en-GB');
  };

  return (
    <div className="max-w-3xl mx-auto bg-zinc-900 text-gray-200 min-h-screen p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            {currentNote ? currentNote.title : "No Note Selected"}
          </h1>
          <div className="flex gap-2">
            <button 
              className="text-gray-400 hover:text-gray-200 px-2 py-1"
              onClick={createNewNote}
            >
              + New
            </button>
            <button 
              className="text-gray-400 hover:text-gray-200 px-2 py-1"
              onClick={saveNote}
            >
              Save
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>📅</span>
            <span>Date</span>
            <span className="ml-8">{getFormattedDate()}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>📁</span>
            <span>Folder</span>
            <span className="ml-6 text-blue-400">Personal</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 border-b border-gray-700 pb-3">
          <select className="bg-transparent text-gray-400 outline-none">
            <option>Paragraph</option>
          </select>
          <select 
            className="bg-transparent text-gray-400 outline-none w-16"
            value={fontSize}
            onChange={handleFontSizeChange}
          >
            {[12, 14, 16, 18, 20, 24].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <div className="flex gap-3 text-gray-400">
            <button 
              className="hover:text-gray-200 font-bold px-2 py-1"
              onClick={() => handleFormat('bold')}
            >B</button>
            <button 
              className="hover:text-gray-200 italic px-2 py-1"
              onClick={() => handleFormat('italic')}
            >I</button>
            <button 
              className="hover:text-gray-200 underline px-2 py-1"
              onClick={() => handleFormat('underline')}
            >U</button>
            <button 
              className="hover:text-gray-200 px-2 py-1"
              onClick={handleLinkClick}
            >🔗</button>
            <button className="hover:text-gray-200 px-2 py-1">⊞</button>
          </div>
        </div>

        {/* Editable Content */}
        {currentNote ? (
          <div 
            ref={editorRef}
            className="space-y-4 leading-relaxed outline-none"
            contentEditable={true}
            onInput={handleContentChange}
            suppressContentEditableWarning={true}
            onClick={setupLinkHandlers}
          >
            {content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No note selected or create a new note to get started.</p>
          </div>
        )}

        {/* Link Dialog */}
        {isLinkDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-zinc-800 rounded-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add Link</h3>
                <button 
                  onClick={() => setIsLinkDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <input
                type="url"
                placeholder="Enter URL..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full bg-zinc-700 text-gray-200 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddLink();
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsLinkDialogOpen(false)}
                  className="px-4 py-2 rounded bg-zinc-700 text-gray-200 hover:bg-zinc-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLink}
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Add Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Note;