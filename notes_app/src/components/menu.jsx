import React, { useState, useEffect } from 'react';
import { FolderIcon, StarIcon, PlusIcon, TrashIcon, ArchiveIcon, FileIcon, X as XIcon, Undo2 as UndoIcon } from 'lucide-react';

const Menu = () => {
    const [selectedItem, setSelectedItem] = useState('Personal');
    const [recentNotes, setRecentNotes] = useState([]);
    const [folders, setFolders] = useState([]);
    const [deletedFolders, setDeletedFolders] = useState([]); // Trash state
    const [newFolderName, setNewFolderName] = useState('');
    const [isAddingFolder, setIsAddingFolder] = useState(false);
    const [editingFolder, setEditingFolder] = useState(null);

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedNotes = JSON.parse(localStorage.getItem('recentNotes')) || [];
        const savedFolders = JSON.parse(localStorage.getItem('folders')) || [
            { id: 1, title: 'Personal' },
            { id: 2, title: 'Work' }
        ];
        const savedDeletedFolders = JSON.parse(localStorage.getItem('deletedFolders')) || [];

        setRecentNotes(savedNotes);
        setFolders(savedFolders);
        setDeletedFolders(savedDeletedFolders);
    }, []);

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('recentNotes', JSON.stringify(recentNotes));
    }, [recentNotes]);

    useEffect(() => {
        if (folders.length > 0) {
            localStorage.setItem('folders', JSON.stringify(folders));
        }
    }, [folders]);

    useEffect(() => {
        localStorage.setItem('deletedFolders', JSON.stringify(deletedFolders));
    }, [deletedFolders]);

    // CRUD operations for folders
    const addFolder = (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;

        const newFolder = {
            id: Date.now(),
            title: newFolderName
        };
        setFolders([...folders, newFolder]);
        setNewFolderName('');
        setIsAddingFolder(false);
    };

    const updateFolder = (id, newTitle) => {
        if (!newTitle.trim()) return;
        setFolders(folders.map(folder =>
            folder.id === id ? { ...folder, title: newTitle } : folder
        ));
        setEditingFolder(null);
    };

    const deleteFolder = (id) => {
        const folderToDelete = folders.find(folder => folder.id === id);
        if (!folderToDelete) return;

        if (window.confirm('Are you sure you want to delete this folder?')) {
            // Move folder to trash instead of deleting permanently
            setDeletedFolders([...deletedFolders, folderToDelete]);
            setFolders(folders.filter(folder => folder.id !== id));

            // If the deleted folder was selected, reset selection
            if (selectedItem === folderToDelete.title) {
                setSelectedItem('Personal');
            }
        }
    };

    const restoreFolder = (id) => {
        const folderToRestore = deletedFolders.find(folder => folder.id === id);
        if (!folderToRestore) return;

        setFolders([...folders, folderToRestore]);
        setDeletedFolders(deletedFolders.filter(folder => folder.id !== id));
    };

    // CRUD operations for notes
    const addNote = () => {
        const newNote = {
            id: Date.now(),
            title: 'New Note',
            date: new Date().toISOString()
        };
        setRecentNotes([newNote, ...recentNotes].slice(0, 3)); // Keep only 3 recent notes
    };

    return (
        <div className="w-64 h-screen bg-gray-900 text-gray-400 p-4">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-6">
                <span className="text-xl font-semibold text-white">Nowted</span>
            </div>

            {/* New Note Button */}
            <button
                onClick={addNote}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-lg p-2 mb-6 flex items-center justify-center space-x-2"
            >
                <PlusIcon size={20} />
                <span>New Note</span>
            </button>

            {/* Recents Section */}
            <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2">Recents</h2>
                <ul>
                    {recentNotes.map(note => (
                        <li key={note.id} className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                            <FileIcon size={16} />
                            <span className="text-sm">{note.title}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Folders Section */}
            <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2 flex items-center">
                    <span>Folders</span>
                    <button
                        onClick={() => setIsAddingFolder(true)}
                        className="ml-auto text-gray-500 hover:text-gray-300"
                    >
                        <PlusIcon size={16} />
                    </button>
                </h2>

                {/* Add New Folder Form */}
                {isAddingFolder && (
                    <form onSubmit={addFolder} className="mb-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                placeholder="Folder name"
                                className="bg-gray-800 text-white text-sm rounded px-2 py-1 flex-1"
                                autoFocus
                            />
                            <button type="submit" className="text-green-500 hover:text-green-400">
                                <PlusIcon size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAddingFolder(false)}
                                className="text-red-500 hover:text-red-400"
                            >
                                <XIcon size={16} />
                            </button>
                        </div>
                    </form>
                )}

                <ul>
                    {folders.map(folder => (
                        <li
                            key={folder.id}
                            className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
                                selectedItem === folder.title ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
                            }`}
                        >
                            <div className="flex-1 flex items-center space-x-2" onClick={() => setSelectedItem(folder.title)}>
                                <FolderIcon size={16} />
                                <span className="text-sm">{folder.title}</span>
                            </div>
                            <button
                                onClick={() => deleteFolder(folder.id)}
                                className="text-gray-500 hover:text-red-400"
                            >
                                <TrashIcon size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Trash Section */}
            {deletedFolders.length > 0 && (
                <div>
                    <h2 className="text-sm font-semibold mb-2">Trash</h2>
                    <ul>
                        {deletedFolders.map(folder => (
                            <li key={folder.id} className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg">
                                <FolderIcon size={16} />
                                <span className="text-sm">{folder.title}</span>
                                <button
                                    onClick={() => restoreFolder(folder.id)}
                                    className="text-green-500 hover:text-green-400 ml-auto"
                                >
                                    <UndoIcon size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Menu;
