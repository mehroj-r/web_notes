const EmptyPlaceholder = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
            <div className="flex flex-col items-center">
                <div className="border border-gray-500 p-4 rounded-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-12 h-12 text-gray-400"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 12h-15m0 0l6-6m-6 6l6 6"
                        />
                    </svg>
                </div>
                <h2 className="mt-4 text-xl font-semibold">Select a note to view</h2>
                <p className="mt-2 text-gray-400 text-center max-w-md">
                    Choose a note from the list on the left to view its contents, or create a new note to add to your collection.
                </p>
            </div>
        </div>
    );
};

export default EmptyPlaceholder;