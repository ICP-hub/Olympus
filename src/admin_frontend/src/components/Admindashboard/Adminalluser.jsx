import React, { useEffect, useState } from "react";
import NoDataCard from "../../../../IcpAccelerator_frontend/src/components/Mentors/Event/NoDataCard";
import { useSelector } from "react-redux";
import uint8ArrayToBase64 from "../../../../IcpAccelerator_frontend/src/components/Utils/uint8ArrayToBase64";

const Adminalluser = () => {
  const actor = useSelector((currState) => currState.actors.actor);

  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const getAlluser = async () => {
      try {
        const rawData = await actor.get_total_approved_list_with_user_data();
        const processedData = [];

        // console.log("rawData =>", rawData);
        rawData.forEach((item) => {
          const userDetails = item[1];
          const profilePictureBase64 = userDetails.user_data.profile_picture[0]
            ? uint8ArrayToBase64(userDetails.user_data.profile_picture[0])
            : null;

          userDetails.approved_type.forEach((type) => {
            processedData.push({
              approvedType: type,
              fullName: userDetails.user_data.full_name.trim(),
              country: userDetails.user_data.country,
              telegramId: userDetails.user_data.telegram_id[0],
              profilePicture: profilePictureBase64,
            });
          });
        });
        setAllData(processedData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    getAlluser();
  }, [actor]);

  const filteredUsers = React.useMemo(
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
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      prev < Math.ceil(filteredUsers.length / itemsPerPage) ? prev + 1 : prev
    );
  };

  return (
    <div className="px-[4%] py-[3%] w-full bg-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-full bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-3xl font-extrabold py-4 
       font-fontUse"
        >
          All Users
        </div>

        <div className="relative flex items-center max-w-xs">
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

      {currentUsers.length > 0 ? (
        <div className="flex flex-col bg-white rounded-lg p-8 text-lg overflow-auto mb-8">
          <div className="min-w-[600px]">
            <table className="w-full table-fixed">
              <thead className="border-b-2 border-gray-300">
                <tr className="text-left text-xl font-fontUse uppercase">
                  <th className="w-24 pb-2">S.No</th>
                  <th className="w-1/4 pb-2">Name</th>
                  <th className="w-1/4 pb-2">Role</th>
                  <th className="w-1/4 pb-2">Country</th>
                  <th className="w-1/4 pb-2">Telegram</th>
                </tr>
              </thead>
              <tbody className="text-base text-gray-700 font-fontUse">
                {currentUsers.map((user, index) => (
                  <tr key={`${user.fullName}-${user.country}-${index}`}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="py-2 pl-4">
                      <div className="flex items-center">
                        <img
                          className="w-10 h-10 rounded-full border-black border-2 p-1"
                          src={user.profilePicture}
                          alt="profile"
                        />
                        <div className="ml-2">{user.fullName}</div>
                      </div>
                    </td>
                    <td>{user.approvedType}</td>
                    <td>{user.country}</td>
                    <td className="truncate max-w-xs">
                      <a
                        href={user.telegramId}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900"
                      >
                        {user.telegramId}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <NoDataCard />
      )}

      {currentUsers.length > 0 && (
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
          {Array.from(
            { length: Math.ceil(filteredUsers.length / itemsPerPage) },
            (_, i) => i + 1
          ).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-full text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all ${
                currentPage === number
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-900/10 active:bg-gray-900/20"
              }`}
              type="button"
            >
              <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                {number}
              </span>
            </button>
          ))}
          <button
            onClick={handleNext}
            disabled={
              currentPage === Math.ceil(filteredUsers.length / itemsPerPage)
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
    </div>
  );
};

export default Adminalluser;
