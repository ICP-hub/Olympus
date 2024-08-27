// import React from 'react';

// const documents = [
//     {
//         title: 'Demo video',
//         description: 'Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.',
//         type: 'video',
//         fileName: '',
//         fileSize: ''
//     },
//     {
//         title: 'Whitepaper',
//         description: 'Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.',
//         type: 'pdf',
//         fileName: 'whitepaper.pdf',
//         fileSize: '150KB'
//     },
//     {
//         title: 'Pitch deck',
//         description: 'Est malesuada ac elit gravida vel aliquam nec. Arcu pelle ntesque convallis quam feugiat non viverra massa fringilla.',
//         type: 'pdf',
//         fileName: 'pitchdeck.pdf',
//         fileSize: '300KB'
//     }
// ];

// const DocumentCard = ({ doc }) => {
//     console.log("sara daa aa ra h",doc.private_docs[0][0].title)
//     console.log("sara daa aa ra h",doc.public_docs[0][0].title)
//     console.log("sara daa aa ra h",doc.private_docs[0][0].link)
//     console.log("sara daa aa ra h",doc.public_docs[0][0].link)

//     return (
//         <div className="flex items-center p-4 bg-white shadow-sm rounded-lg mb-4">
//             <div className="w-[22rem] h-[6rem] flex items-center justify-center bg-purple-100 rounded-lg mr-4">
//                 <div className="flex flex-col items-center justify-center">
//                     <div className="">
//                         {doc.type === 'video' ? (
//                             <svg
//                                 className="w-8 h-8 text-purple-500"
//                                 fill="currentColor"
//                                 viewBox="0 0 20 20"
//                                 xmlns="http://www.w3.org/2000/svg"
//                             >
//                                 <path
//                                     fillRule="evenodd"
//                                     d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm11 5.382L9 13V7l6 1.382z"
//                                     clipRule="evenodd"
//                                 ></path>
//                             </svg>
//                         ) : (
//                             <svg
//                                 className="w-8 h-8 text-red-500"
//                                 fill="currentColor"
//                                 viewBox="0 0 20 20"
//                                 xmlns="http://www.w3.org/2000/svg"
//                             >
//                                 <path
//                                     fillRule="evenodd"
//                                     d="M10 2a1 1 0 00-.707.293l-7 7A1 1 0 003 10h1v5a1 1 0 001 1h10a1 1 0 001-1v-5h1a1 1 0 00.707-1.707l-7-7A1 1 0 0010 2zM9 5v2H5v2h4v2h2V9h4V7h-4V5H9z"
//                                     clipRule="evenodd"
//                                 ></path>
//                             </svg>
//                         )}
//                     </div>
//                     <div className="">
//                         {doc.fileName && (
//                             <div className="">
//                                 <a
//                                     href="#"
//                                     className="text-blue-500 flex items-center"
//                                 >
//                                     <div className="flex flex-col items-center justify-center">
//                                     <span className='text-xs'>{doc.fileName}</span>
//                                     <span className="ml-2 text-xs text-gray-400">{doc.fileSize}</span>
//                                     </div>
//                                 </a>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//             <div className="flex-grow">
//                 <h4 className="text-base font-semibold text-gray-900 mb-2">{doc.title}</h4>
//                 <p className="text-gray-600 text-xs">{doc.description}</p>

//             </div>
//         </div>
//     );
// };

// const DiscoverDocument = ({projectDetails}) => {
//     return (
//         <div className="border border-gray-200 shadow-lg rounded-xl bg-white p-6">
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
//                 <a href="#" className="text-blue-500 text-sm font-medium">View all documents</a>
//             </div>
//             {documents.map((doc, idx) => (
//                 <DocumentCard key={idx} doc={projectDetails} />
//             ))}
//         </div>
//     );
// };

// export default DiscoverDocument;
import React from 'react';
// import Filetype from '../../../../assets/Logo/Filetype.png';
 import Filetype from '../../../../../assets/Logo/Filetype.png';


const DocumentCard = ({ doc, type }) => {
  return (
    <div
      key={doc.title}
      className="relative flex items-center p-4 rounded-lg mb-4 shadow-md bg-white transition-all duration-300"
    >
      {/* Image Section with Background */}
      <div className="bg-gray-100 w-[180px] px-10 py-4 rounded-lg flex-shrink-0 text-center">
        <img
          src={Filetype}
          alt="Document Thumbnail"
          className="w-[50px] h-[50px] rounded-lg object-cover mx-auto"
        />
        <a
          href={doc.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-800 mt-2 block overflow-hidden text-ellipsis whitespace-nowrap text-sm"
          style={{ maxWidth: '100px' }}
        >
          {doc.link || "No link provided"}
        </a>
      </div>

      {/* Details Section */}
      <div
        className={`ml-4 flex-grow ${type === "private" ? "blur-sm" : ""} transition-all duration-300`}
      >
        <div className="flex justify-between">
          <p className="text-lg font-semibold text-gray-900">
            {doc.title || `Document`}
          </p>
          <button
            className={`rounded-lg px-2 text-sm ${
              type === "public"
                ? "bg-[#ECFDF3] border-2 border-[#ABEFC6] text-[#067647]"
                : "bg-[#FFFAEB] border-2 border-[#F5E1A4] text-[#A37E00]"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </div>
        <p className="text-gray-600 mt-3">
          {doc.description || "This is the description which I am giving right now so please take this description"}
        </p>
      </div>

      {/* Request Access Button for Private Documents */}
      {type === "private" && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Request Access
          </button>
        </div>
      )}
    </div>
  );
};

const DiscoverDocument = ({ projectDetails }) => {
  const renderDocuments = (docs, type) => {
    return docs.map((doc, index) => (
      <DocumentCard key={index} doc={doc} type={type} />
    ));
  };

  return (
    <div className="space-y-3 mt-3">
        <h2 className="text-xl font-semibold text-gray-900 mb-4"> Documents</h2>
      {/* Private Documents Section */}
      <div className="max-w-4xl bg-white p-3  ">
        {/* <h2 className="text-xl font-semibold text-gray-900 mb-4">Private Documents</h2> */}
        {projectDetails.private_docs && projectDetails.private_docs.length > 0 ? (
          renderDocuments(projectDetails.private_docs[0], "private")
        ) : (
        //   <p className="text-gray-500 mt-2">No private documents uploaded.</p>
          <p className="text-gray-500 mt-2"></p>
        )}
      </div>

      {/* Public Documents Section */}
      <div className="max-w-4xl bg-white p-3 ">
        {/* <h2 className="text-xl font-semibold text-gray-900 mb-4">Public Documents</h2> */}
        {projectDetails.public_docs && projectDetails.public_docs.length > 0 ? (
          renderDocuments(projectDetails.public_docs[0], "public")
        ) : (
        //   <p className="text-gray-500 mt-2">No public documents uploaded.</p>
          <p className="text-gray-500 mt-2"></p>
        )}
      </div>
    </div>
  );
};

export default DiscoverDocument;

