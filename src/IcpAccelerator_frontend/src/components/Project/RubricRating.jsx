import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { rubric_table_data } from "./ProjectDetails/projectRatingsRubrics";
import { useDispatch, useSelector } from "react-redux";
import { Line } from "rc-progress";
import { star } from "../Utils/Data/SvgData";

const RubricRating = ({ data }) => {
  if (!data) {
    return null;
  }
  const navigate = useNavigate();
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const actor = useSelector((currState) => currState.actors.actor);
  const [ratingDone, setRatingDone] = useState(null);
  const [rating, setRating] = useState(1);
  const [onSelectLevel, setonSelectLevel] = useState(
    Array(rubric_table_data.length).fill(0)
  );
  const [sendingData, setSendingData] = useState([]);
  const [showSubmit, setShowSubmit] = useState(false);

  const handleNext = () => {
    console.log("rating 25 ==>", rating);
    console.log("onSelectLevel 26==>", onSelectLevel);
    if (rating === 8) {
      setShowSubmit(true);
    } else {
      setRating(rating + 1);
    }
  };
  const handleBack = () => {
    if (showSubmit === true) {
      setShowSubmit(false);
      setRating(rating - 1);
    } else {
      setRating(rating - 1);
    }
  };
  const handleLevelSelect = (index) => {
    const updatedLevels = [...onSelectLevel];
    updatedLevels[rating - 1] = index + 1;
    setonSelectLevel(updatedLevels);
  };
  const handleSubmit = () => {
    // Your submission logic here
    console.log("Form submitted:", sendingData);
    let argument = {
      project_id: data?.uid,
      current_role: userCurrentRoleStatusActiveRole,
      ratings: sendingData,
    };
    if (
      userCurrentRoleStatusActiveRole &&
      userCurrentRoleStatusActiveRole !== "user"
    ) {
      handleAddRating(argument);
    } else {
      toast.error("No Authorization !!");
    }
  };

  const fetchMyRatings = async (val) => {
    console.log("val", val);
    await actor
      .get_ratings_by_principal(val?.uid)
      .then((result) => {
        console.log("result-in-get_ratings_by_principal", result);
        if (result && result?.Ok.length > 0) {
          setRatingDone(true);
          // navigate('/')
        } else {
          setRatingDone(false);
          // navigate('/')
        }
      })
      .catch((error) => {
        console.log("error-in-get_ratings_by_principal", error);
        setRatingDone(false);
        // navigate('/')
      });
  };
  useEffect(() => {
    if (actor && data) {
      fetchMyRatings(data);
    } else {
      navigate("/");
    }
  }, [actor]);
  return (
    <section className="bg-gray-100 w-full h-full lg1:px-[4%] py-[2%] px-[5%]">
      {ratingDone ? (
        <div className="container">
          <h1>Rating already Done</h1>
          {/* <RubricRatingExt /> */}
        </div>
      ) : (
        <div className="container">
          <div className="flex justify-center items-center flex-row m-auto mb-[50px]">
            {rubric_table_data.map((item, i) => (
              <React.Fragment key={item.id}>
                <div className="relative">
                  <div
                    className={`w-[30px] h-[30px] rounded-full ${
                      rating >= item.id
                        ? "bg-[#4A3AFF] text-white"
                        : "bg-[#D9E6FF]"
                    } flex justify-center items-center text-sm flex-shrink-0`}
                  >
                    {item.id}
                  </div>
                </div>
                {item.id === rubric_table_data.length ? (
                  ""
                ) : (
                  <div className="h-[4px] w-full flex-shrink bg-[#D9E6FF] mx-4">
                    {console.log(rubric_table_data.length)}{" "}
                    <div
                      className={`h-full duration-500 mr-auto ${
                        rating > item.id
                          ? "w-[100%] bg-[#4A3AFF]"
                          : "w-0 bg-[#D9E6FF]"
                      }`}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mix-blend-darken bg-[#B9C0F3] text-gray-800 my-4 rounded shadow-md w-full mx-auto p-8">
            <div className="flex items-center justify-between cursor-pointer">
              <h2 className="text-lg font-semibold text-white underline text-nowrap">
                {rubric_table_data?.[rating - 1].title}
              </h2>
              <div className="mx-4 flex items-center w-full">
                {console.log("onSelectLevel 139line ===> ", onSelectLevel)}
                <Line
                  strokeWidth={0.5}
                  percent={Number(Math.round((onSelectLevel * 100) / 9))}
                  strokeColor="white"
                  className="line-horizontal"
                />
                <div className="text-white text-[15px] font-normal font-fontUse ml-2">
                  {Math.round((onSelectLevel * 100) / 9)}%
                </div>
                {star}
              </div>
            </div>
            <div>
              <p className="pr-24">
                Asia 30 under 30 honorees. PANY was established PANONY was
                established in March 2018 with operations in Greater China,
                South Korea and the U.S. Both founders are Forbes Asia 30 under
                30 honorees. PANY was establishedPANONY was established in March
                2018 with operations in Greater China, South Korea and the U.S.
                Both founders are Forbes Asia 30 under 30 honorees. PANY was
                established
              </p>
              <div className=" mb-2 pt-0">
                <ul className="mb-4 space-y-1 cursor-pointer">
                  {rubric_table_data[rating].levels.map((val, index) => {
                    return (
                      <li className="flex py-4 items-center" key={index}>
                        <div className="w-11/12">
                          <div
                            className={`flex justify-between items-center py-2 w-full text-white`}
                          >
                            <div className="flex">
                              <span className="font-bold text-lg">
                                {index + 1}.
                              </span>
                              <p className="font-bold text-lg ml-1">
                                {val?.title}
                              </p>
                            </div>
                            <div className="text-end">
                              <input
                                type="radio"
                                id={`consent_${index}`}
                                name="consent_levels"
                                value={index}
                                onChange={() => handleLevelSelect(index)}
                                checked={index + 1 === onSelectLevel[rating]}
                              />
                            </div>
                          </div>
                          <p className="text-sm text-white px-5">{val?.desc}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="px-4 pt-0">
              <div className="flex justify-end gap-2 border-t">
                {rating > 1 && (
                  <button
                    type="button"
                    className="font-bold rounded-md my-2 bg-indigo-600 font-fontUse text-center text-white uppercase text-[0.625rem] md:text-[0.64375rem] lg:text-[0.65625rem] xl:text-[0.78125rem] px-6 py-2 top-[6.5rem] sm4:top-[10.5rem] xxs1:top-[8.5rem] ss2:top-[7.5rem] text-wrap"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                )}
                {!showSubmit && (
                  <button
                    type="button"
                    className="font-bold rounded-md my-2 bg-indigo-600 font-fontUse text-center text-white uppercase text-[0.625rem] md:text-[0.64375rem] lg:text-[0.65625rem] xl:text-[0.78125rem] px-6 py-2 top-[6.5rem] sm4:top-[10.5rem] xxs1:top-[8.5rem] ss2:top-[7.5rem] text-wrap"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                )}
                {showSubmit && (
                  <button
                    type="button"
                    className="font-bold rounded-md my-2 bg-indigo-600 font-fontUse text-center text-white uppercase text-[0.625rem] md:text-[0.64375rem] lg:text-[0.65625rem] xl:text-[0.78125rem] px-6 py-2 top-[6.5rem] sm4:top-[10.5rem] xxs1:top-[8.5rem] ss2:top-[7.5rem] text-wrap"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RubricRating;