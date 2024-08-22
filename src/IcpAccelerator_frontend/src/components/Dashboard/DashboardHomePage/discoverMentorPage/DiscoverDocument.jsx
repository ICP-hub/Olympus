import React from 'react';

const documents = [
    {
        title: 'Demo video',
        description: 'Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.',
        type: 'video',
        fileName: '',
        fileSize: ''
    },
    {
        title: 'Whitepaper',
        description: 'Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.',
        type: 'pdf',
        fileName: 'whitepaper.pdf',
        fileSize: '150KB'
    },
    {
        title: 'Pitch deck',
        description: 'Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.',
        type: 'pdf',
        fileName: 'pitchdeck.pdf',
        fileSize: '300KB'
    }
];

const DocumentCard = ({ doc }) => {
    return (
        <div className="flex items-center p-4 bg-white shadow-sm rounded-lg mb-4">
            <div className="w-[22rem] h-[6rem] flex items-center justify-center bg-purple-100 rounded-lg mr-4">
                <div className="flex flex-col items-center justify-center">
                    <div className="">
                        {doc.type === 'video' ? (
                            <svg
                                className="w-8 h-8 text-purple-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm11 5.382L9 13V7l6 1.382z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        ) : (
                            <svg
                                className="w-8 h-8 text-red-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 2a1 1 0 00-.707.293l-7 7A1 1 0 003 10h1v5a1 1 0 001 1h10a1 1 0 001-1v-5h1a1 1 0 00.707-1.707l-7-7A1 1 0 0010 2zM9 5v2H5v2h4v2h2V9h4V7h-4V5H9z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        )}
                    </div>
                    <div className="">
                        {doc.fileName && (
                            <div className="">
                                <a
                                    href="#"
                                    className="text-blue-500 flex items-center"
                                >
                                    <div className="flex flex-col items-center justify-center">
                                    <span className='text-xs'>{doc.fileName}</span>
                                    <span className="ml-2 text-xs text-gray-400">{doc.fileSize}</span>
                                    </div>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex-grow">
                <h4 className="text-base font-semibold text-gray-900 mb-2">{doc.title}</h4>
                <p className="text-gray-600 text-xs">{doc.description}</p>

            </div>
        </div>
    );
};

const DiscoverDocument = () => {
    return (
        <div className="border border-gray-200 shadow-lg rounded-xl bg-white p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
                <a href="#" className="text-blue-500 text-sm font-medium">View all documents</a>
            </div>
            {documents.map((doc, idx) => (
                <DocumentCard key={idx} doc={doc} />
            ))}
        </div>
    );
};

export default DiscoverDocument;
