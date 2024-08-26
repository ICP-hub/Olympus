
import React from "react";
import Filetype from "../../../../assets/Logo/Filetype.png";

const NewDocument = ({ cardData }) => {
  console.log("uploadcomponent me data aa rha h", cardData);

  const renderDocuments = (docs, type) => {
    return docs.map((doc, index) => (
      <div
        key={index}
        className="relative flex items-center p-4 rounded-lg mb-4 shadow-md bg-white transition-all duration-300"
      >
        {/* Image Section with Background */}
        <div className="bg-gray-100 w-[180px] px-10 py-4 rounded-lg flex-shrink-0 text-center">
        <div
          className={`ml-4 flex-grow ${type === "private" ? "blur-sm" : ""} transition-all duration-300`}
        >
          <img
            src={Filetype}
            alt="Document Thumbnail"
            className="w-[50px] h-[50px] rounded-lg object-cover mx-auto"
          />
          <a
            href={doc?.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-800 mt-2 block overflow-hidden text-ellipsis whitespace-nowrap text-sm"
            style={{ maxWidth: '100px' }}
          >
            {doc?.link || "No link provided"}
          </a>
        </div>
        </div>

        {/* Details Section */}
        <div
          className={`ml-4 flex-grow ${type === "private" ? "blur-sm" : ""} transition-all duration-300`}
        >
          <div className="flex justify-between">
            <p className="text-lg font-semibold text-gray-900">
              {doc?.title || `Document ${index + 1}`}
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
            This is the description which I am giving right now so please take this description
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
    ));
  };

  return (
    <div className="space-y-6">
      {/* Private Documents Section */}
      <div className="max-w-4xl bg-white">
        {cardData[0][0]?.params?.private_docs && cardData[0][0]?.params?.private_docs.length > 0 ? (
          <div>{renderDocuments(cardData[0][0]?.params?.private_docs[0], "private")}</div>
        ) : (
          <p className="text-gray-500 mt-2">No private documents uploaded.</p>
        )}
      </div>

      {/* Public Documents Section */}
      <div className="max-w-4xl bg-white">
        {cardData[0][0]?.params?.public_docs && cardData[0][0]?.params?.public_docs.length > 0 ? (
          <div>{renderDocuments(cardData[0][0]?.params?.public_docs[0], "public")}</div>
        ) : (
          <p className="text-gray-500 mt-2">No public documents uploaded.</p>
        )}
      </div>
    </div>
  );
};

export default NewDocument;

