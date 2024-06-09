import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import uint8ArrayToBase64 from "../../../../IcpAccelerator_frontend/src/components/Utils/uint8ArrayToBase64";
import { OutSideClickHandler } from "../../../../IcpAccelerator_frontend/src/components/hooks/OutSideClickHandler";
import { projectFilterSvg } from "../Utils/AdminData/SvgData";
import NoDataCard from "../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard";
import { principalToText } from "../Utils/AdminData/saga_function/blobImageToUrl";
import { useNavigate } from "react-router-dom";
import NoData from "../../../../IcpAccelerator_frontend/assets/images/file_not_found.png";
import DeleteModel from "../../../../IcpAccelerator_frontend/src/models/DeleteModel";
import { Principal } from "@dfinity/principal";
import toast from "react-hot-toast";

const Adminalluser = () => {
  const actor = useSelector((currState) => currState.actors.actor);
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOption, setFilterOption] = useState("Users");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [principalId, setPrincipalId] = useState(null);

  const handleOpenDeleteModal = (id) => {
    setPrincipalId(id);
    setDeleteModalOpen(true);
  };

  const handleClose = () => {
    setDeleteModalOpen(false);
    setPrincipalId(null);
  };

  const handleDelete = async () => {
    const covertedPrincipal = await Principal.fromText(principalId);
    console.log("principalId ==>>>", covertedPrincipal);
    setIsSubmitting(true);
    let result = [];
    try {
      switch (filterOption) {
        case "Users":
          result = await actor.delete_user_using_principal(covertedPrincipal);
          break;
        case "Mentors":
          result = await actor.delete_mentor_using_principal(covertedPrincipal);
          break;
        case "Projects":
          result = await actor.delete_project_using_principal(
            covertedPrincipal
          );
          break;
        case "Investors":
          result = await actor.delete_vc_using_principal(covertedPrincipal);
          break;
        default:
          result = [];
      }

      if (result) {
        setIsSubmitting(false);
        toast.success(result);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log("error-in-handleDelete", error);
      setIsSubmitting(false);
    }
  };

  const itemsPerPage = 10;
  const dropdownRef = useRef(null);
  OutSideClickHandler(dropdownRef, () => setIsPopupOpen(false));

  const fetchData = useCallback(async () => {
    let data = [];
    try {
      switch (filterOption) {
        case "Users":
          data = await actor.get_total_approved_list_with_user_data();
          break;
        case "Mentors":
          data = await actor.mentor_profile_edit_awaiting_approval();
          break;
        case "Projects":
          data = await actor.project_update_awaiting_approval();
          break;
        case "Investors":
          data = await actor.vc_profile_edit_awaiting_approval();
          break;
        default:
          data = [];
      }
      if (filterOption === "Users") {
        const userProcessedData = [];
        data.forEach((item) => {
          console.log("datasssss", data);
          let principal = "";
          if (data && data?.[0]?.[1]?.principal) {
            principal = principalToText(data?.[0]?.[1]?.principal);
          } else if (data && data?.[0]?.[0]) {
            principal = principalToText(data?.[0]?.[0]);
          }
          const userDetails = item[1];
          const profilePictureBase64 = userDetails.user_data.profile_picture[0]
            ? uint8ArrayToBase64(userDetails.user_data.profile_picture[0])
            : null;

          userDetails.approved_type.forEach((type) => {
            if (type === "user") {
              userProcessedData.push({
                approvedType: type,
                fullName: userDetails.user_data.full_name.trim(),
                country: userDetails.user_data.country,
                telegram: userDetails.user_data.telegram_id[0],
                profilePictureURL: profilePictureBase64,
                principalId: principal,
              });
            }
          });
        });
        setAllData(userProcessedData);
      } else {
        const processedData = data.map((item, index) => {
          console.log("data", data);

          const updatedInfo = item[1]?.updated_info || {};

          let principal = "";
          if (data && data?.[0]?.[1]?.principal) {
            principal = principalToText(data?.[0]?.[1]?.principal);
          } else if (data && data?.[0]?.[0]) {
            principal = principalToText(data?.[0]?.[0]);
          }

          const profilePicture =
            uint8ArrayToBase64(updatedInfo.user_data?.profile_picture[0]) ||
            uint8ArrayToBase64(updatedInfo[0].user_data?.profile_picture[0]) ||
            uint8ArrayToBase64(updatedInfo.project_logo);

          const commonData = {
            fullName: (
              updatedInfo.user_data?.full_name ||
              updatedInfo[0].user_data?.full_name ||
              "No Name"
            ).trim(),
            country:
              updatedInfo.user_data?.country ||
              updatedInfo[0].user_data?.country ||
              "No Country",
            profilePictureURL: profilePicture,
            telegram:
              updatedInfo.user_data?.telegram_id ||
              updatedInfo[0].user_data?.telegram_id ||
              "N/A",
            hub:
              updatedInfo?.preferred_icp_hub?.[0] ||
              updatedInfo?.[0]?.preferred_icp_hub ||
              updatedInfo?.[0]?.preferred_icp_hub?.[0] ||
              "N/A",
            principalId: principal,
            index: index + 1,
          };

          return commonData;
        });
        setAllData(processedData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setAllData([]);
    }
  }, [actor, filterOption]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  let filteredData;
  filteredData = allData.filter((item) => {
    const fullName = item.fullName?.toLowerCase() || "";
    const country = item.country?.toLowerCase() || "";
    return (
      fullName.includes(filter.toLowerCase()) ||
      country.includes(filter.toLowerCase())
    );
  });
  filteredData = React.useMemo(
    () =>
      allData.filter(
        (user) =>
          user.fullName.toLowerCase().includes(filter.toLowerCase()) ||
          user.approvedType.toLowerCase().includes(filter.toLowerCase()) ||
          user.country.toLowerCase().includes(filter.toLowerCase())
      ),
    [filter, allData]
  );

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      prev < Math.ceil(filteredData.length / itemsPerPage) ? prev + 1 : prev
    );
  };

  const handleRowClick = (principalId) => {
    const routePath =
      filterOption === "Users"
        ? "/userupdate"
        : filterOption === "Mentors"
        ? "/userProfileMentorUpdate"
        : filterOption === "Investors"
        ? "/userProfileInvestorUpdate"
        : "/userProfileProjectUpdate";
    navigate(routePath, { state: principalId });
  };

  // New logic for rendering pagination numbers
  const renderPaginationNumbers = () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const maxPageNumbers = 10;
    const startPage =
      Math.floor((currentPage - 1) / maxPageNumbers) * maxPageNumbers + 1;
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-full text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all ${
            currentPage === i
              ? "bg-gray-900 text-white"
              : "hover:bg-gray-900/10 active:bg-gray-900/20"
          }`}
          type="button"
        >
          <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            {i}
          </span>
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="px-[4%] py-[3%] w-full bg-gray-100">
      <div className="flex justify-end mb-4">
        <div className="relative flex items-center max-w-xs bg-white rounded-xl">
          <input
            type="text"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="form-input rounded-xl px-4 py-2 bg-white text-gray-600 placeholder-gray-600 placeholder-ml-4 max-w-md"
            placeholder="Search..."
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-5 h-5 absolute right-2 text-gray-600"
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
        </div>
      </div>

      <div className="flex justify-end mb-4 items-center w-full">
        <div
          className="w-full bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-xl md:text-3xl font-extrabold py-4 
       font-fontUse"
        >
          All Updates
        </div>{" "}
        <div
          className="border-2 border-blue-900 p-1 w-auto  font-bold rounded-md text-blue-900 px-2 capitalize"
          style={{ whiteSpace: "nowrap" }}
        >
          {filterOption}
        </div>
        <div className="flex items-center justify-between ml-2">
          <div className="flex justify-end gap-4 relative " ref={dropdownRef}>
            <div
              className="cursor-pointer"
              onClick={() => setIsPopupOpen((curr) => !curr)}
            >
              {projectFilterSvg}
              {isPopupOpen && (
                <div className="absolute w-[250px] mt-4 top-full right-0 bg-white shadow-md rounded-lg border border-gray-200 p-3 z-10">
                  <ul className="flex flex-col">
                    <li>
                      <button
                        className="border-[#9C9C9C] w-[230px]  hover:text-indigo-800 border-b-2 py-2 px-4 focus:outline-none text-base flex justify-start font-fontUse"
                        onClick={() => {
                          setFilterOption("Users");
                        }}
                      >
                        All Users
                      </button>
                    </li>
                    <li>
                      <button
                        className="border-[#9C9C9C] w-[230px]  hover:text-indigo-800 border-b-2 py-2 px-4 focus:outline-none text-base flex justify-start font-fontUse"
                        onClick={() => {
                          setFilterOption("Projects");
                        }}
                      >
                        Projects
                      </button>
                    </li>
                    <li>
                      <button
                        className="border-[#9C9C9C] w-[230px]  hover:text-indigo-800 border-b-2 py-2 px-4 focus:outline-none text-base flex justify-start font-fontUse"
                        onClick={() => setFilterOption("Mentors")}
                      >
                        Mentors
                      </button>
                    </li>
                    
                    <li>
                      <button
                        className="border-[#9C9C9C] w-[230px]  hover:text-indigo-800 border-b-2 py-2 px-4 focus:outline-none text-base flex justify-start font-fontUse"
                        onClick={() => setFilterOption("Investors")}
                      >
                        Investors
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>{" "}
      </div>

      {currentData.length > 0 ? (
        <div className="flex flex-col bg-white rounded-lg p-8 text-lg overflow-auto mb-8">
          <div className="min-w-[600px]">
            <table className="w-full table-fixed">
              <thead className="border-b-2 border-gray-300">
                <tr className="text-left text-xl font-fontUse uppercase">
                  <th className="w-24 pb-2">S.No</th>
                  <th className="w-1/4 pb-2">Name</th>
                  <th className="w-1/4 pb-2">
                    {filterOption && filterOption === "Users" ? "Role" : "Hub"}
                  </th>
                  <th className="w-1/4 pb-2">Country</th>
                  <th className="w-1/4 pb-2">Telegram</th>
                  <th className="w-1/4 pb-2">Action</th>
                </tr>
              </thead>
              <tbody className="text-base text-gray-700 font-fontUse">
                {currentData.map((user, index) => (
                  <tr
                    key={`${user.fullName}-${user.country}-${index}`}
                    className="hover:bg-gray-100 cursor-pointer mt-1"
                  >
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="py-2 ">
                      <div className="flex items-center">
                        <img
                          className="w-10 h-10 rounded-full border-black border-2 p-1"
                          src={user.profilePictureURL}
                          alt="Profile"
                        />
                        <div className="ml-2">{user.fullName}</div>
                      </div>
                    </td>
                    <td>
                      {filterOption === "Users" ? user.approvedType : user.hub}
                    </td>
                    <td>{user.country}</td>
                    <td className="truncate max-w-xs">
                      {user.telegram ? (
                        <a
                          href={`https://t.me/${user.telegram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:text-blue-900"
                        >
                          {user.telegram}
                        </a>
                      ) : (
                        <p>N/A</p>
                      )}
                    </td>
                    <td>
                      <button
                        className="p-2 bg-white rounded-lg border-2 border-gray-300 hover:bg-gray-300"
                        onClick={() => handleRowClick(user.principalId)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          className="size-4 text-green-500"
                          fill="currentColor"
                        >
                          <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                        </svg>
                      </button>
                      <button
                        className="p-2 bg-white rounded-lg border-2 border-gray-300 hover:bg-gray-300"
                        onClick={() => handleOpenDeleteModal(user.principalId)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-4 text-red-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <NoDataCard image={NoData} desc={"No data yet"} />
      )}

      {currentData.length > 0 && (
        <div className="flex items-center gap-4 justify-center mb-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-full select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              ></path>
            </svg>
            Previous
          </button>
          {renderPaginationNumbers()}
          <button
            onClick={handleNext}
            disabled={
              currentPage === Math.ceil(filteredData.length / itemsPerPage)
            }
            className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-full select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              ></path>
            </svg>
          </button>
        </div>
      )}
      {isDeleteModalOpen && (
        <DeleteModel
          onClose={handleClose}
          title={`Delete ${filterOption}`}
          heading={`Are you sure to delete this ${filterOption}`}
          onSubmitHandler={handleDelete}
          isSubmitting={isSubmitting}
          Id={principalId}
        />
      )}
    </div>
  );
};

export default Adminalluser;
