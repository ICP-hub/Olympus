import React from "react";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { LanguageIcon } from "../../UserRegistration/DefaultLink";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaTelegram,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaReddit,
  FaTiktok,
  FaSnapchat,
  FaWhatsapp,
  FaMedium,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

// PROJECT REGISTER COMPONENT (STEP 5)
const ProjectRegister5 = ({ isOpen, onClose, onBack }) => {
  // INITIALIZE FORM HOOKS AND METHODS
  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    clearErrors,
    setError,
    control,
    watch,
  } = useFormContext();

  // INITIALIZE FIELD ARRAY HOOK FOR SOCIAL LINKS
  const { fields, append, remove } = useFieldArray({
    control,
    name: "social_link",
    defaultValues: [{ link: "" }], // Ensure at least one empty field at start
  });

  // FUNCTION TO GET THE LOGO BASED ON THE URL DOMAIN
  const getLogo = (url) => {
    try {
      const domain = new URL(url).hostname.split(".").slice(-2).join(".");
      const size = "size-8";
      const icons = {
        "linkedin.com": <FaLinkedin className={`text-blue-600 ${size}`} />,
        "twitter.com": <FaTwitter className={`text-blue-400 ${size}`} />,
        "github.com": <FaGithub className={`text-gray-700 ${size}`} />,
        "telegram.com": <FaTelegram className={`text-blue-400 ${size}`} />,
        "facebook.com": <FaFacebook className={`text-blue-400 ${size}`} />,
        "instagram.com": <FaInstagram className={`text-pink-950 ${size}`} />,
        "youtube.com": <FaYoutube className={`text-red-600 ${size}`} />,
        "reddit.com": <FaReddit className={`text-orange-500 ${size}`} />,
        "tiktok.com": <FaTiktok className={`text-black ${size}`} />,
        "snapchat.com": <FaSnapchat className={`text-yellow-400 ${size}`} />,
        "whatsapp.com": <FaWhatsapp className={`text-green-600 ${size}`} />,
        "medium.com": <FaMedium className={`text-black ${size}`} />,
      };
      return icons[domain] || <LanguageIcon />;
    } catch (error) {
      return <LanguageIcon />;
    }
  };

  return (
    <>
      {/* PROMOTION VIDEO LINK INPUT */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Promotion video link
        </label>
        <input
          type="text"
          {...register("promotional_video")}
          className={`border border-[#CDD5DF] rounded-md shadow-sm
                                             ${
                                               errors?.promotional_video
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder="https://"
          defaultValue=""
        />
        {errors?.promotional_video && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.promotional_video?.message}
          </span>
        )}
      </div>

      {/* TOKENOMICS INPUT */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Tokenomics</label>
        <input
          type="text"
          {...register("token_economics")}
          className={`border border-[#CDD5DF] rounded-md shadow-sm 
                                             ${
                                               errors?.token_economics
                                                 ? "border-red-500 "
                                                 : "border-[#737373]"
                                             } text-gray-900 placeholder-gray-500  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder="https://"
          defaultValue=""
        />
        {errors?.token_economics && (
          <span className="mt-1 text-sm text-red-500 font-bold flex justify-start">
            {errors?.token_economics?.message}
          </span>
        )}
      </div>

      {/* SOCIAL LINKS INPUT WITH ADD/REMOVE FUNCTIONALITY */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Links</label>
        <div className="relative">
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-center mb-4 border-b pb-2">
              <Controller
                name={`links[${index}].link`}
                control={control}
                defaultValue="" // Ensure there’s an initial value
                render={({ field, fieldState }) => (
                  <div className="flex items-center w-full">
                    <div className="flex items-center space-x-2 w-full">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                        {field.value && getLogo(field.value)}
                      </div>
                      <input
                        type="text"
                        placeholder="Enter your social media URL"
                        className={`p-2 border ${
                          fieldState.error
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md w-full`}
                        {...field} // Spread the field props, which include value and onChange
                      />
                    </div>
                  </div>
                )}
              />
              {/* REMOVE LINK BUTTON */}
              <button
                type="button"
                onClick={() => remove(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          {/* ADD NEW LINK BUTTON */}
          <button
            type="button"
            onClick={() => append({ social_link: "" })}
            className="flex items-center p-1 text-[#155EEF]"
          >
            <FaPlus className="mr-1" /> Add Another Link
          </button>
        </div>
      </div>
    </>
  );
};

export default ProjectRegister5;
