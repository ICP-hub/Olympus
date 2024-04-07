
import React, { useEffect, useState } from "react";
import ReactSlider from "react-slider";
import Astro from "../../../assets/images/AstroLeft.png";
import { alertCircle } from "../Utils/Data/SvgData";
import { Line } from "rc-progress";
import { star } from "../Utils/Data/SvgData";
import { rubric_table_data } from "./ProjectDetails/projectRatingsRubrics";
import ConsentForm from "../../models/ConsentForm";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom"
import RubricRatingExt from "./RubricRatingExt";

const ProjectRatings = ({ data }) => {
  if (!data) {
    return null;
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userCurrentRoleStatusActiveRole = useSelector(
    (currState) => currState.currentRoleStatus.activeRole
  );
  const [ratingDone, setRatingDone] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 8;
  const [showSubmit, setShowSubmit] = useState(null);
  const [sliderValues, setSliderValues] = useState({
    Team: 0,
    ProblemAndVision: 0,
    ValueProp: 0,
    Product: 0,
    Market: 0,
    BusinessModel: 0,
    Scale: 0,
    Exit: 0,
  });

  const [sliderValuesProgress, setSliderValuesProgress] = useState({
    Team: 0,
    ProblemAndVision: 0,
    ValueProp: 0,
    Product: 0,
    Market: 0,
    BusinessModel: 0,
    Scale: 0,
    Exit: 0,
  });

  const [selectedValue, setSelectedValue] = useState(0)

  const [sendingData, setSendingData] = useState([
    {
      level_number: 1,
      level_name: 'Team',
      rating: 35,
      sub_level_number: 4,
      sub_level: 'Validating an Investable Market',
    },
    {
      level_number: 2,
      level_name: 'Problem and Vision',
      rating: 35,
      sub_level_number: 3,
      sub_level: 'Setting the Vision',
    },
    {
      level_number: 3,
      level_name: 'Value Prop',
      rating: 35,
      sub_level_number: 1,
      sub_level: 'Solidifying the Value Proposition',
    },
    {
      level_number: 4,
      level_name: 'Product',
      rating: 35,
      sub_level_number: 6,
      sub_level: 'Moving Beyond Early Adopters',
    },
    {
      level_number: 5,
      level_name: 'Market',
      rating: 35,
      sub_level_number: 2,
      sub_level: 'Exit in Sight',
    },
    {
      level_number: 6,
      level_name: 'Business Model',
      rating: 35,
      sub_level_number: 8,
      sub_level: 'Establishing the Founding Team',
    },
    {
      level_number: 7,
      level_name: 'Scale',
      rating: 35,
      sub_level_number: 7,
      sub_level: 'Moving Beyond Early Adopters',
    },
    {
      level_number: 8,
      level_name: 'Exit',
      rating: 35,
      sub_level_number: 3,
      sub_level: 'Validating an Investable Market',
    },
  ]);


  const [sendingDataTwo, setSendingDataTwo] = useState([
    {
      level_number: 1,
      level_name: 'Team',
      rating: 35,
      sub_level_number: 5,
      sub_level: 'Validating an Investable Market',
    },
    {
      level_number: 2,
      level_name: 'Problem and Vision',
      rating: 35,
      sub_level_number: 5,
      sub_level: 'Setting the Vision',
    },
    {
      level_number: 3,
      level_name: 'Value Prop',
      rating: 35,
      sub_level_number: 5,
      sub_level: 'Solidifying the Value Proposition',
    },
    {
      level_number: 4,
      level_name: 'Product',
      rating: 35,
      sub_level_number: 5,
      sub_level: 'Moving Beyond Early Adopters',
    },
    {
      level_number: 5,
      level_name: 'Market',
      rating: 35,
      sub_level_number: 5,
      sub_level: 'Exit in Sight',
    },
    {
      level_number: 6,
      level_name: 'Business Model',
      rating: 35,
      sub_level_number: 5,
      sub_level: 'Establishing the Founding Team',
    },
    {
      level_number: 7,
      level_name: 'Scale',
      rating: 35,
      sub_level_number: 5,
      sub_level: 'Moving Beyond Early Adopters',
    },
    {
      level_number: 8,
      level_name: 'Exit',
      rating: 35,
      sub_level_number: 5,
      sub_level: 'Validating an Investable Market',
    },
  ]);

  // const [sendingData, setSendingData] = useState([
  //   {
  //     level_number: 1,
  //     level_name: 'Team',
  //     rating: 0,
  //     sub_level_number: 0,
  //     sub_level: '',
  //   },
  //   {
  //     level_number: 2,
  //     level_name: 'Problem and Vision',
  //     rating: 0,
  //     sub_level_number: 0,
  //     sub_level: '',
  //   },
  //   {
  //     level_number: 3,
  //     level_name: 'Value Prop',
  //     rating: 0,
  //     sub_level_number: 0,
  //     sub_level: '',
  //   },
  //   {
  //     level_number: 4,
  //     level_name: 'Product',
  //     rating: 0,
  //     sub_level_number: 0,
  //     sub_level: '',
  //   },
  //   {
  //     level_number: 5,
  //     level_name: 'Market',
  //     rating: 0,
  //     sub_level_number: 0,
  //     sub_level: '',
  //   },
  //   {
  //     level_number: 6,
  //     level_name: 'Business Model',
  //     rating: 0,
  //     sub_level_number: 0,
  //     sub_level: '',
  //   },
  //   {
  //     level_number: 7,
  //     level_name: 'Scale',
  //     rating: 0,
  //     sub_level_number: 0,
  //     sub_level: '',
  //   },
  //   {
  //     level_number: 8,
  //     level_name: 'Exit',
  //     rating: 0,
  //     sub_level_number: 0,
  //     sub_level: '',
  //   },
  // ]);


  const actor = useSelector((currState) => currState.actors.actor);

  // useEffect(() => {
  //   (async () => {
  //     if (actor) {
  //       console.log('actor', actor)
  //       const rating = await actor.update_rating_api(sendingData);
  //       console.log('rating', rating)
  //     }
  //   })();
  // }, [dispatch, actor]);
  const sliderKeys = [
    "Team",
    "ProblemAndVision",
    "ValueProp",
    "Product",
    "Market",
    "BusinessModel",
    "Scale",
    "Exit",
  ];

  const handleSliderChange = (index, value) => {
    setSelectedValue(value);
    const key = sliderKeys[index];
    const newSliderValues = { ...sliderValues, [key]: value };
    setSliderValues(newSliderValues);
    const newSliderValuesProgress = {
      ...sliderValuesProgress,
      [key]: value === 9 ? 100 : Math.floor((value / 9) * 100),
    };
    setSliderValuesProgress(newSliderValuesProgress);
  };

  const handleAddRating = async (params) => {
    console.log('add rubric rating')
    if (actor) {
      // let argument =
      // {
      //   rating,
      //   message: ratingDescription,
      //   project_id: data?.uid,
      // current_role: "project",
      // }


      await actor.update_rating(params)
        .then((result) => {
          console.log('result-in-update_rating', result)
          // if (result) {
          //   handleRatingCloseModal();
          //   toast.success('review added successfully')
          // } else {
          //   handleRatingCloseModal();
          //   toast.error('something got wrong')
          // }
        })
        .catch((error) => {
          console.log('error-in-update_rating', error)
          // toast.error('something got wrong')
          // handleRatingCloseModal();
        })
    }
  }

  // level_name: String,
  // level_number: u32,
  // sub_level: String,
  // sub_level_number: u32,
  // rating: f64,

  // project_id: String, 
  // current_role: String, 
  // ratings: Vec<Rating>,

  const handleSubmit = () => {
    // Your submission logic here
    console.log("Form submitted:", sendingData);
    let argument = {
      project_id: data?.uid,
      current_role: userCurrentRoleStatusActiveRole,
      ratings: sendingData
    }
    if (userCurrentRoleStatusActiveRole && userCurrentRoleStatusActiveRole !== "user") {
      handleAddRating(argument)
    } else {
      toast.error("No Authorization !!")
    }
  };

  // const handleSubmitTwo = () => {
  //   // Your submission logic here
  //   console.log("Form submitted:", sendingData);
  //   let argument = {
  //     project_id: data?.uid,
  //     current_role: userCurrentRoleStatusActiveRole,
  //     ratings: sendingDataTwo
  //   }
  //   handleAddRating(argument)
  //   // Reset form or navigate to next page
  //   // setCurrentStep(0);
  // };

  const customStyles = `
  .slider-mark::after {
    content: attr(data-label);
    position: absolute;
    top: -2rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    white-space: nowrap;
    font-size: 0.75rem;
    color: #fff;
    padding: 0.2rem 0.4rem; 
    border-radius: 0.25rem;
  }
`;

  const [agreedWithRating, setAgreedWithRating] = useState(false);
  const [showConsentForm, setShowConsentForm] = useState(false);

  const handleNext = () => {
    setShowConsentForm(true);
  };

  // const handlePrevious = () => {
  //   setCurrentStep((prevStep) => prevStep - 1);
  //   setSelectedValue(0);
  // };

  const appendSendDataFunc = (name, step) => {
    let sendingArray = [...sendingData]
    const foundObject = sendingArray.find(item => item.level_name === name);
    const foundIndex = sendingArray.findIndex(item => item.level_name === name);
    if (foundObject && foundIndex !== -1) {
      sendingArray[foundIndex].sub_level = rubric_table_data[currentStep].levels[step].title;
      sendingArray[foundIndex].sub_level_number = step + 1;
    }
    setSendingData(sendingArray);
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }else{
      setShowSubmit(true)
    }
    setShowConsentForm(false);
    setSelectedValue(0);
  };



  const fetchMyRatings = async (val) => {
    await actor.get_ratings_by_principal(val?.uid)
      .then((result) => {
        console.log('result-in-get_ratings_by_principal', result)
        if (result && result?.Ok.length > 0) {
          setRatingDone(true);
          // navigate('/')
        } else {
          setRatingDone(false);
          // navigate('/')
        }
      })
      .catch((error) => {
        console.log('error-in-get_ratings_by_principal', error)
        setRatingDone(false);
        // navigate('/')
      })
  }
  useEffect(() => {
    if (actor && data) {
      fetchMyRatings(data);
    } else {
      navigate('/')
    }
  }, [actor]);

  return (
    <section className="bg-gray-100 w-full h-full lg1:px-[4%] py-[2%] px-[5%]">
      {ratingDone ? 
      <div className="container">
        <h1>Rating already Done</h1>
        {/* <RubricRatingExt /> */}
      </div>
        : <div className="container">
          {/* Render only the current step */}
          {currentStep < totalSteps && (
            <div className="mix-blend-darken bg-[#B9C0F3] text-gray-800 my-4 rounded shadow-md w-full mx-auto p-8">
              <div className="flex items-center justify-between p-4 cursor-pointer">
                <h2 className="text-lg font-semibold text-white text-nowrap">
                  {rubric_table_data?.[currentStep].title}
                </h2>
                <div className="mx-4 flex items-center w-full">
                  <Line
                    strokeWidth={0.5}
                    percent={Number(Math.round((sliderValues[sliderKeys[currentStep]] + 1) * 100 / 9))}
                    strokeColor="white"
                    className="line-horizontal"
                  />
                  <div className="text-white text-[15px] font-normal font-fontUse ml-2">
                    {Math.round((sliderValues[sliderKeys[currentStep]] + 1) * 100 / 9)}%
                  </div>
                  {star}
                </div>
              </div>
              <div className="transition-all duration-200 max-h-screen">
                <div className="p-4">
                  <div className="text-white text-sm font-normal font-fontUse">
                    {rubric_table_data[currentStep].description}
                  </div>
                  {/* Your slider and other content here */}
                  <div className="text-white text-lg font-bold font-fontUse mb-2">
                    Rate {rubric_table_data[currentStep].title.toUpperCase()} on scale of 9
                  </div>
                  <div className="relative my-8">
                    <style dangerouslySetInnerHTML={{ __html: customStyles }} />
                    <ReactSlider
                      className="bg-gradient-to-r from-white to-blue-500 h-1 rounded-md w-full"
                      marks
                      markClassName="slider-mark bg-purple-800 rounded-md h-1 w-1"
                      min={0}
                      max={8}
                      thumbClassName="absolute bg-white w-12 h-12 flex items-center justify-center rounded-full shadow-md -top-2"
                      trackClassName="h-1 rounded"
                      value={sliderValues[sliderKeys[currentStep]]}
                      onChange={(value) => handleSliderChange(currentStep, value)}
                      renderThumb={(props, state) => (
                        <div {...props} className="-top-2 rounded-full">
                          <div className="w-5 h-5 rounded-full bg-white"></div>

                        </div>
                      )}
                      renderMark={({ key, style }) => {
                        let level_title = rubric_table_data[currentStep].levels[key].title;
                        let level_desc = rubric_table_data[currentStep].levels[key].desc;
                        return (
                          <div key={key}
                            className="slider-mark bg-transparent rounded-md h-1 w-1"
                            style={{ ...style, left: `${(93.5 / 8) * key}%`, top: "0px" }}>
                            <div className="flex flex-row text-white items-center space-x-1 relative -top-8 justify-between">
                              <span>Level</span>
                              <span>{key + 1}</span>
                              <div className="relative group">
                                <span className="cursor-pointer">{alertCircle}</span>
                                <div className="absolute hidden group-hover:block bg-transparent text-white p-2 rounded-lg shadow-lg min-w-[250px] -left-14 -top-[6.95rem] z-20 h-32 drop-shadow-sm backdrop-blur-lg border-white border-2 overflow-hidden">
                                  <div className="relative z-10 p-2">
                                    <div className="font-bold text-black text-sm">
                                      {level_title}
                                    </div>
                                    <div className="py-1">
                                      <div className="line-clamp-3 overflow-y-scroll">
                                        {level_desc}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>)
                      }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            {/* {currentStep > 0 && (
            <button onClick={handlePrevious}
              type="button"
              className="font-bold text-white bg-blue-500 hover:bg-blue-600  focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4">
              Back
            </button>
          )} */}
            {!showSubmit  && (
              <button onClick={handleNext}
                type="button"
                className="ml-3 font-bold text-white bg-blue-500 hover:bg-blue-600  focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4">
                Next
              </button>
            )}
            {showSubmit && (
              <button onClick={handleSubmit}
                type="button"
                className="ml-3  font-bold text-white bg-blue-500 hover:bg-blue-600  focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md w-auto sm:w-auto px-5 py-2 text-center mb-4">
                Submit
              </button>
            )}
          </div>

        </div>}
      {showConsentForm && (
        <ConsentForm
          isModalOpen={showConsentForm}
          onClose={() => setShowConsentForm(false)}
          onSubmitHandler={(name, step) => appendSendDataFunc(name, step)}
          main_level={rubric_table_data[currentStep]}
          selected_level={selectedValue}
        />
      )}
      <Toaster />
    </section>
  );
};

export default ProjectRatings;
