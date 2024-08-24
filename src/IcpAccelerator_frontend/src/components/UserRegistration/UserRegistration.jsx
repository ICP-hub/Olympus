import Layer1 from "../../../assets/Logo/Layer1.png";
import AboutcardSkeleton from "../LatestSkeleton/AbourcardSkeleton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useState,useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ThreeDots } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import { Principal } from "@dfinity/principal";
import { useSelector } from "react-redux";
import RegisterForm1 from "./RegisterForm1";
import RegisterForm2 from "./RegisterForm2";
import RegisterForm3 from "./RegisterForm3";
import { validationSchema } from "./userValidation";

const UserRegistration = () => {
  const [index, setIndex] = useState(0);
  const [imageData, setImageData] = useState(null);
const [getAllData,setGetAllData]=useState([]);
  const actor = useSelector((currState) => currState.actors.actor);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
    defaultValues: {
      full_name: "",
      email: "",
      links: [{ link: "" }],
      openchat_user_name: "",
      bio: "",
      country: "",
      domains_interested_in: "",
      type_of_profile: "",
      reasons_to_join_platform: "",
      image: null,
    },
  });
  const {
    handleSubmit,
    trigger,
    getValues,
    formState: { isSubmitting },
    watch
  } = methods;

  const formFields = {
    0: ["full_name", "openchat_user_name"],
    1: ["email"],
    2: [
      "image",
      "reasons_to_join_platform",
      "bio",
      "domains_interested_in",
      "type_of_profile",
      "country",
      "links"
    ],
  };

 

  const handleNext = async () => {
    const fieldsToValidate = formFields[index];
    const isValid = await trigger(fieldsToValidate);
    console.log('isValid',isValid)
    if (isValid) {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleBack = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
    }
  };

  // const getData=watch();

  useEffect(() => {
    const subscription = watch((value) => {
      setGetAllData(value);
    });
    // Clean up the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, [watch, setGetAllData]);

  console.log('imageData',imageData)
  const onSubmitHandler = async (data) => {
    console.log(data);
    if (actor) {
      const userData = {
        full_name: data?.full_name || "",
        email: data?.email ? [data.email] : [],
        social_links: data?.links ? [data.links.map(val => ({ link: val?.link ? [val.link] : [] }))] : [], 
        openchat_username: data?.openchat_user_name ? [data.openchat_user_name] : [],
        bio: data?.bio ? [data.bio] : [],
        country: data?.country || "",
        area_of_interest: data?.domains_interested_in || "",
        type_of_profile: data?.type_of_profile ? [data.type_of_profile] : [],
        reason_to_join: data?.reasons_to_join_platform
          ? [data.reasons_to_join_platform.split(",").map((val) => val.trim())]
          : [], 
        profile_picture: imageData ? [imageData] : [],
      };
  
      try {
        await actor.register_user(userData).then((result) => {
          console.log('result', result)
          if (result && result.includes("User registered successfully with ID")) {
            toast.success("Registered as a User");
            window.location.href = "/dashboard"; 
          } else {
            toast.error("Something went wrong");
          }
        });
      } catch (error) {
        toast.error(error.message); 
        console.error("Error sending data to the backend:", error);
        window.location.href = "/"; 
      }
      
    } else {
      toast.error("Please signup with internet identity first");
      window.location.href = "/";
    }
  };
  
  
  

  const onErrorHandler = (val) => {
    console.log("error", val);
  };
  return (
    <>
      <FormProvider {...methods}>

        <div className="bg-[#FFF4ED] min-h-screen flex items-center justify-center overflow-hidden">
          <div className="container mx-auto">
            <div className="py-12 flex items-center justify-center rounded-xl">
              <div className="bg-white shadow-xl rounded-2xl flex w-full max-w-6xl">
                <div className="w-1/2 p-10">
                  <img src={Layer1} alt="logo" className="flex justify-start w-1/3" loading="lazy" />
                  <h2 className="text-[#364152] text-sm  font-semibold mb-2 mt-16 ">
                    Step {index + 1} of 3
                  </h2>

                  <form
                    onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}
                  >
                    {index === 0 && <RegisterForm1 />}
                    {index === 1 && <RegisterForm2 />}
                    {index === 2 && <RegisterForm3 setImageData={setImageData}/>}

                    {/* Other form steps */}
                    <div className="flex justify-between mt-8">
                      <button
                        type="button"
                        className="py-2 px-4 text-gray-600 rounded hover:text-black border-gray-300 border-2"
                        onClick={handleBack}
                        disabled={index === 0}
                      >
                         <ArrowBackIcon
                            fontSize="medium"
                            className="mr-2"
                          />
                        Back
                      </button>
                      {index === 2 ? (
                        <button
                          type="submit"
                          className="py-2 px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 border-2 border-[#B2CCFF]"
                        >
                          {isSubmitting ? (
                            <ThreeDots
                              visible={true}
                              height="35"
                              width="35"
                              color="#FFFEFF"
                              radius="9"
                              ariaLabel="three-dots-loading"
                              wrapperStyle={{}}
                            />
                          ) : (
                            "Submit"
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="py-2 px-4 bg-[#D1E0FF] text-white rounded hover:bg-blue-600 border-2 border-[#B2CCFF] flex items-center"
                          onClick={handleNext}
                        >
                          Continue
                          <ArrowForwardIcon
                            fontSize="medium"
                            className="ml-2"
                          />
                        </button>
                      )}
                    </div>
                  </form>
                </div>
                <AboutcardSkeleton getAllData={getAllData}/>
              </div>
            </div>
          </div>
        </div>
      </FormProvider>
      <Toaster />
    </>
  );
};

export default UserRegistration;
