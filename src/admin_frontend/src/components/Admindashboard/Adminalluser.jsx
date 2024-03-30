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

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="px-[4%] w-full bg-gray-100 overflow-hidden">
      <div className="w-full bg-gradient-to-r from-purple-900 to-blue-500 text-transparent bg-clip-text text-2xl font-extrabold py-4">
        All Users
      </div>
      <div className="flex flex-row-reverse mb-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="form-input rounded-md px-4 py-1 bg-white text-gray-600 placeholder-gray-600"
          placeholder="Filter..."
          style={{ maxWidth: "200px" }}
        />
      </div>

      {currentUsers.length > 0 ? (
        <div className="flex flex-col bg-white rounded-lg p-4 text-lg overflow-auto mb-8">
          <div className="min-w-[600px]">
            <table className="w-full table-fixed">
              <thead>
                <tr className="text-left text-xl">
                  <th className="w-20 pb-4">Profile</th>
                  <th className="w-1/4 pb-4">Name</th>
                  <th className="w-1/4 pb-4">Role</th>
                  <th className="w-1/4 pb-4">Country</th>
                  <th className="w-1/4 pb-4">Telegram</th>
                </tr>
              </thead>
              <tbody className="text-md text-gray-700">
                {currentUsers.map((user, index) => (
                  <tr key={`${user.fullName}-${user.country}-${index}`}>
                    <td className="py-2 pl-4">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={user.profilePicture}
                        alt="profile"
                      />
                    </td>
                    <td>{user.fullName}</td>
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
        <nav>
          <ul className="flex justify-center gap-2 mt-4 mb-4">
            {pageNumbers.map((number) => (
              <li key={number} className="list-none">
                <button
                  onClick={() => paginate(number)}
                  className="py-2 px-4 rounded-lg text-lg bg-purple-200 hover:bg-purple-400 transition-colors duration-200"
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Adminalluser;
