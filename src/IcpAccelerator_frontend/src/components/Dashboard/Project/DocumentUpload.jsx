import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import LinkIcon from "@mui/icons-material/Link";
import React, { useState } from "react";
import DocumentModal from "./DocumentModal";
import Nodata from "./Nodata";
import { useLocation } from "react-router-dom";

export function DocumentItem ({data}) {
  const [isOpen, setIsOpen] = useState(false);
  const [documentdata, setDocumentdata] = useState([]);
  const message = {
    message1: "You haven't posted any Document yet",
    message2: "Any assets used in document will live here.",
    message3: "Start creating by uploading your files.",
    button: "Create a new Document",
  };
  const location = useLocation();
  //  const ProjectId = location.state.projectId;
  const ProjectId = data
   console.log("console vala principal",ProjectId)
  return (
    <div className="flex justify-center flex-col items-stretch space-x-4 mb-6 pb-6">
     

      <div className="flex justify-center items-center">
        {documentdata.length > 0 && (
          <div className="flex justify-end">
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={() => setIsOpen(true)}
            >
              + Add new Document
            </button>
            {isOpen && <DocumentModal setIsOpen={setIsOpen} isOpen={isOpen} ProjectId = {ProjectId}  />}
          </div>
        )}
        {documentdata.length === 0 ? (
          <Nodata message={message} setIsOpen={setIsOpen} isOpen={isOpen} ProjectId = {ProjectId}/>
        ) : (
          " Document data will render here"
        )}
      </div>
    </div>
  );
}
