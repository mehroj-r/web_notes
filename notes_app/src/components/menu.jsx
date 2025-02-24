import React, { useState } from 'react';
import { FolderIcon, StarIcon, PlusIcon, TrashIcon, ArchiveIcon, FileIcon } from 'lucide-react';

const Menu = () => {
    const [selectedItem, setSelectedItem] = useState('Personal');

    const recentNotes = [
        { id: 1, title: 'Reflection on the Month of June' },
        { id: 2, title: 'Project proposal' },
        { id: 3, title: 'Travel itinerary' }
    ];

    const folders = [
        { id: 1, title: 'Personal' },
        { id: 2, title: 'Work' },
        { id: 3, title: 'Travel' },
        { id: 4, title: 'Events' },
        { id: 5, title: 'Finances' }
    ];

    return (
        <div className="w-64 h-screen bg-gray-900 text-gray-400 p-4">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-6">
                <span className="text-xl font-semibold text-white">Nowted</span>
            </div>

            {/* New Note Button */}
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-lg p-2 mb-6 flex items-center justify-center space-x-2">
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
                    <button className="ml-auto text-gray-500 hover:text-gray-300">
                        <PlusIcon size={16} />
                    </button>
                </h2>
                <ul>
                    {folders.map(folder => (
                        <li
                            key={folder.id}
                            className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
                                selectedItem === folder.title ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
                            }`}
                            onClick={() => setSelectedItem(folder.title)}
                        >
                            <FolderIcon size={16} />
                            <span className="text-sm">{folder.title}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* More Section */}
            <div>
                <h2 className="text-sm font-semibold mb-2">More</h2>
                <ul>
                    <li className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                        <StarIcon size={16} />
                        <span className="text-sm">Favorites</span>
                    </li>
                    <li className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                        <TrashIcon size={16} />
                        <span className="text-sm">Trash</span>
                    </li>
                    <li className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                        <ArchiveIcon size={16} />
                        <span className="text-sm">Archived Notes</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Menu;