import React,{useCallback} from 'react';
 import Filetype from '../../../../../assets/Logo/Filetype.png';
import { useSelector } from 'react-redux';
import toast, { Toaster } from "react-hot-toast";


const DocumentCard = ({ doc, type ,projectId}) => {
  const actor = useSelector((currState) => currState.actors.actor);

  const sendPrivateDocumentRequest = useCallback(async (project_id) => {
    try {
      const result = await actor.send_private_docs_access_request(project_id);
      console.log("result-in-send-access-private-docs", result);
      if (result) {
        toast.success(result);
      } else {
        toast.error(result);
      }
    } catch (error) {
      console.log("error-in-send-access-private-docs", error);
    }
  }, [actor]);

  return (
    <div
    key={doc.title}
    className="relative flex items-center p-4 rounded-lg mb-4 shadow-md bg-white transition-all duration-300 blur-sm hover:blur-none"
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
    <div className="ml-4 flex-grow transition-all duration-300">
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
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={() => sendPrivateDocumentRequest(projectId)}
        >
          Request Access
        </button>
      </div>
    )}
  </div>
  

  );
};

const DiscoverDocument = ({ projectDetails,projectId }) => {
  console.log('projectDetails',projectDetails)
  const renderDocuments = (docs, type) => {
    return docs.map((doc, index) => (
      <DocumentCard key={index} doc={doc} type={type} projectId={projectId}/>
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
