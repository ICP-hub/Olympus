import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import { InfinitySpin } from 'react-loader-spinner';
import { useSelector, useDispatch } from 'react-redux';
import { addUserData, removeUserData } from '../features/user/userSlice';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "react-bootstrap/Modal";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function User() {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.user.data);
    const [showEditModal, setShowEditModal] = useState(false);
    const [viewPdf, setViewPdf] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [dialCode, setDialCode] = useState('91');
    const [dotCount, setDotCount] = useState(12);
    const styles = { backgroundColor: "#1E2835", padding: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", borderRadius: "5px" };

    const showData = (val) => {
        if (userData[val] !== undefined && userData[val] !== null && userData[val] !== '' && userData[val] !== '0') {
            return userData[val]
        }
        else {
            return 'No Data'
        }
    }

    const datesFunc = (val) => {
        var date = new Date(val);
        var dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var month = date.getMonth() + 1;
        var mm = month < 10 ? '0' + month : month;
        var yy = date.getFullYear();
        return (yy + '-' + mm + '-' + dd);
    }

    const showToastMessage = (message) => {
        toast.success(message);
    };

    const showErrorToastMessage = (message) => {
        toast.error(message);
    };

    // Add Hackathon form inputs validationSchema and useForm functions
    const validationSchema = yup.object().shape(
        {
            username: yup.string().test('is-non-empty', 'Required', (value) => /\S/.test(value)).required("Required"),
            name: yup.string().test('is-non-empty', 'Required', (value) => /\S/.test(value)).required("Required"),
            country: yup.string().test('is-non-empty', 'Required', (value) => /\S/.test(value)).required("Required"), 
            city: yup.string().test('is-non-empty', 'Required', (value) => /\S/.test(value)).required("Required"),
            dob: yup.string().test('is-non-empty', 'Required', (value) => /\S/.test(value)).required("Required"),
            gender: yup.string().required("Required").oneOf(['male', 'female'], 'invalid'),
            email: yup.string().test('is-non-empty', 'Required', (value) => /\S/.test(value)).required("Required").email("Invalid Email"),
            phone: yup.string().required('Phone number is required').matches(`^[0-9]{${dotCount}}$`, 'Invalid Number'),
            profession: yup.string().required("Required").oneOf(['freelancer', 'professional', 'student'], 'invalid'),
            github: yup.string().test('is-non-empty', 'Required', (value) => /\S/.test(value)).required("Required"),
            institute_name: yup.string().test('is-non-empty', 'Required', (value) => /\S/.test(value)).required("Required"),
            image: yup
                .mixed()
                .test('fileSize', 'File size max 5MB allowed', (value) => {
                    return !value || (value && value.size <= 2 * 1024 * 1024); // 5 MB limit
                })
                .test('fileType', 'Unsupported file format', (value) => {
                    return !value || (value && ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type));
                }),
            resume: yup
                .mixed()
                .test('fileSize', 'File size max 5MB allowed', (value) => {
                    return !value || (value && value.size <= 5 * 1024 * 1024); // 5 MB limit
                })
                .test('fileType', 'Unsupported file format', (value) => {
                    return !value || (value && ['application/pdf'].includes(value.type));
                }),
        }).required();


    const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd, setValue: setValueAdd, watch: watchAdd, control, trigger, formState: { errors: errorsAdd } } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });



    const editModalShow = (item) => {
        setShowEditModal(true)
        resetAdd();
        const int_username = item?.user_username ?? null;
        const int_name = item?.user_name ?? '';
        const int_country = item?.user_country ?? '';
        const int_city = item?.user_city ?? '';
        const int_dob = item?.user_dob ? datesFunc(item?.user_dob) : '';
        const int_gender = item?.user_sex ?? '';
        const int_email = item?.user_mail ?? '';
        const int_phone = item?.user_country_code && item?.user_phone ? `${item?.user_country_code}${item?.user_phone}` : '91';
        const int_profession = item?.user_profession ?? '';
        const int_stack_overflow = item?.user_so ?? '';
        const int_github = item?.user_github ?? '';
        const int_linkedIn = item?.user_linkedIn ?? '';
        const int_skills = item?.user_skills && item?.user_skills.length > 0 ? item?.user_skills[0].trim() : '';
        const int_qualification = item?.user_qualification ?? '';
        const int_institute_name = item?.user_institute_name ?? '';
        const int_degree_status = item?.user_degree_status ?? '';
        const int_passout = item?.user_passoutYear ? datesFunc(item?.user_passoutYear) : '';


        setDialCode(item?.user_country_code)
        setDotCount((item?.user_country_code.toString() + item?.user_phone.toString()).length)
        setValueAdd('username', int_username)
        setValueAdd('name', int_name)
        setValueAdd('country', int_country)
        setValueAdd('city', int_city)
        setValueAdd('dob', int_dob)
        setValueAdd('gender', int_gender)
        setValueAdd('email', int_email)
        setValueAdd('phone', int_phone)
        setValueAdd('profession', int_profession)
        setValueAdd('stack_overflow', int_stack_overflow)
        setValueAdd('github', int_github)
        setValueAdd('linkedIn', int_linkedIn)
        setValueAdd('skills', int_skills)
        setValueAdd('qualification', int_qualification)
        setValueAdd('institute_name', int_institute_name)
        setValueAdd('degree_status', int_degree_status)
        setValueAdd('passout', int_passout)
    };

    const editModalHide = () => {
        setShowEditModal(false);
        resetAdd();
        setDialCode('91');
        setDotCount(12)
    };

    const editUserFunc = async (formData) => {
        let phoneVal = `+${formData.phone.trim()}`.split(`+${dialCode}`)[1];
        const form = new FormData();

        form.append('user_id', userData?.user_id);
        form.append('user_username', formData?.username.trim());
        form.append('user_name', formData?.name.trim());
        form.append('user_country', formData?.country.trim());
        form.append('user_country_code', dialCode);
        form.append('user_city', formData?.city.trim());
        form.append('user_dob', formData?.dob);
        form.append('user_sex', formData?.gender.trim());
        form.append('user_mail', formData?.email.trim());
        form.append('user_phone', phoneVal);
        form.append('user_profession', formData?.profession.trim());
        form.append('user_github', formData?.github.trim());
        form.append('user_institute_name', formData?.institute_name.trim());
        form.append('user_linkedIn', formData?.linkedIn ? formData?.linkedIn.trim() : '');
        form.append('user_so', formData?.stack_overflow ? formData?.stack_overflow.trim() : '');
        form.append('user_skills', formData?.skills ? formData?.skills.trim() : '');
        form.append('user_qualification', formData?.qualification ? formData?.qualification.trim() : '');
        form.append('user_passoutYear', formData?.passout ?? '');
        form.append('user_degree_status', formData?.degree_status ? formData?.degree_status.trim() : '');
        if (watchAdd('image') && watchAdd('image') !== '') { form.append('user_image', watchAdd('image')) } else { };
        if (watchAdd('resume') && watchAdd('resume') !== '') { form.append('user_cv', watchAdd('resume')) } else { };


        setDisableButton(true);
        await fetch(`${process.env.REACT_APP_BACKEND_URL}api/v1/info/user`, {
            method: 'POST',
            headers: { 'Authorisation': `Bearer ${userData?.token}` },
            body: form
        })
            .then((response) => response.json())
            .then((result) => {
                setDisableButton(false);
                editModalHide();
                if (result.status === "success") {
                    showToastMessage(result.message);
                    dispatch(addUserData(result.data));
                } else {
                    showErrorToastMessage(result.message);
                    if (result.tokenValid === false) {
                        dispatch(removeUserData());
                        window.location.reload();
                    }
                }
            }).catch((error) => {
                editModalHide();
                setDisableButton(false);
                console.log(error)
            });

    }

    const submit = (val) => {
        editUserFunc(val);
    }

    // Custom Inputs Generator function
    const modalDivForInputGenerator = useMemo(() => {
        if (showEditModal && showEditModal === true) {
            return ({ divClassNames, labelClassNames, labelName, inputType, inputclassNames, inputPlaceholderText, inputId, errorsType, registerType, errorSpanClassNames, readOnly }) => {
                return (
                    <div className={divClassNames}>
                        <label htmlFor={inputId} className={`${labelClassNames} d-flex mt-2`}>{labelName}</label>
                        <input type={inputType} className={inputclassNames} placeholder={inputPlaceholderText} id={inputId}
                            style={{ border: (errorsType[inputId]?.message) ? "1px solid red" : "1px solid #ced4da" }}
                            {...registerType(inputId)} readOnly={readOnly} />
                        {errorsType[inputId] && <span className={`${errorSpanClassNames} d-flex justify-content-end mt-2`}>{errorsType[inputId].message}</span>}
                    </div>
                )
            };
        };
        return null;
    }, [showEditModal]);

    const handlePhoneChange = (country) => {
        setDialCode(country?.dialCode)
        setDotCount((country?.format.match(/\./g) || []).length);
        setValueAdd('country', country?.name)
        if (country?.dialCode !== dialCode) {
            setValueAdd('phone', country?.dialCode)
            trigger('phone')
        }
    };

    useEffect(() => {
        document.title = "Profile|BlockseBlock"

        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div className='inner-page' style={{ marginTop: "100px" }}>
                <section className="tf-section tf-team-details pt60">
                    <div className="container" >
                        <div className="row" style={{ justifyContent: "center", display: "flex" }}>
                            {windowWidth <= 767 ?
                                <div className="image_wrapper" style={{ justifyContent: "center", display: "flex", flexDirection: "column", }}>
                                    <div className="d-flex justify-content-center user_image">
                                        <img src={userData?.user_image ?? require("../assets/images/groupedimages/team_5.png")} alt="avatar" style={{ borderRadius: "20px", width: 'calc(80% + 1vw)' }} />
                                    </div>
                                </div> : ''}
                            <div className="col-md-9">
                                <div className="d-flex justify-content-between team-details">
                                    {windowWidth > 767 ?
                                        <div className="image_wrapper" style={{ justifyContent: "center", display: "flex", flexDirection: "column" }}>
                                            <div className="d-flex justify-content-center user_image">
                                                <img src={userData?.user_image ?? require("../assets/images/groupedimages/team_5.png")} alt="avatar" style={{ borderRadius: "20px", width: 'calc(80% + 1vw)' }} />
                                            </div>
                                        </div> : ''}
                                    <div className="content" >
                                        <h5 className="user_name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '200px' }}>{userData?.user_name ?? 'No Name'}</h5>
                                        <div className="spacing"></div>
                                        <div className="box">
                                            <h6 className="title">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12.84 8.55061C12.5961 8.30666 12.2002 8.30654 11.9561 8.55061L10.7867 9.72008C10.072 9.4198 8.87915 8.22958 8.57696 7.51035L9.74643 6.34088C9.9905 6.09681 9.9905 5.70106 9.74643 5.457L7.31569 3.02625C7.07182 2.78234 6.67583 2.78219 6.43181 3.02625L5.106 4.3521C4.44853 5.00953 4.3681 6.10384 4.87951 7.43344C6.35294 11.2644 11.8747 15.2613 13.945 13.1911L15.2708 11.8652C15.5149 11.6212 15.5149 11.2254 15.2708 10.9814L12.84 8.55061ZM13.061 12.3072C12.7864 12.5817 12.1164 12.5602 11.3123 12.2509C9.23466 11.4518 6.84759 9.06843 6.04614 6.98472C5.73683 6.1806 5.71527 5.51055 5.98981 5.23598L6.87369 4.3521L8.42051 5.89892L7.53667 6.7828C7.30104 7.01839 7.116 7.47184 7.57272 8.29388C8.24281 9.50004 10.5325 11.742 11.5142 10.7604L12.3981 9.87649L13.9449 11.4233L13.061 12.3072Z" fill="#798DA3" />
                                                    <path d="M15.0002 0H5.00005C3.10459 0 1.5625 1.54209 1.5625 3.43755V13.4377C1.5625 15.3332 3.10459 16.8753 5.00005 16.8753H7.77123L9.46418 19.6968C9.70599 20.0998 10.2928 20.1023 10.536 19.6968L12.229 16.8753H15.0002C16.8957 16.8753 18.4378 15.3332 18.4378 13.4377V3.43755C18.4378 1.54209 16.8957 0 15.0002 0ZM17.1877 13.4377C17.1877 14.6439 16.2064 15.6252 15.0002 15.6252H11.8752C11.6556 15.6252 11.4522 15.7404 11.3392 15.9287L10.0001 18.1605L8.66105 15.9287C8.54808 15.7405 8.34464 15.6252 8.1251 15.6252H5.00005C3.79386 15.6252 2.81252 14.6439 2.81252 13.4377V3.43755C2.81252 2.23132 3.79386 1.25002 5.00005 1.25002H15.0002C16.2064 1.25002 17.1877 2.23132 17.1877 3.43755V13.4377Z" fill="#798DA3" />
                                                </svg>
                                                Contact Details
                                            </h6>
                                            <ul>
                                                <li>
                                                    <span>Email: <span className="color-hover">{userData?.user_mail ?? 'No Data'}</span></span>
                                                </li>
                                                <li>
                                                    <span>Phone: <span className="white">{userData?.user_phone && userData?.user_country_code ? `+${userData?.user_country_code} ${userData?.user_phone}` : 'No Data'}</span></span>
                                                </li>
                                                <li>
                                                    <span>Role: <span className="white">{userData?.role ?? 'No Data'}</span></span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className='edit-button'>
                                        <button onClick={() => {
                                            editModalShow(userData);
                                        }} className="tf-button style2" style={{ position: 'absolute', right: (windowWidth > 767) ? '25%' : '10%' }}>
                                            Edit
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <div className='mt-4'>
                                        <h5>● Personal Details</h5>
                                    </div>
                                    <div>
                                        <ul style={{}}>
                                            <li style={styles}>
                                                <p>USERNAME</p>
                                                <p style={{ color: "#fff" }}>{showData('user_username')}</p>
                                            </li>
                                            <li style={styles}>
                                                <p>NAME</p>
                                                <p style={{ color: "#fff" }}>{showData('user_name')}</p>
                                            </li>
                                            <li style={styles}>
                                                <p>BIRTH DATE</p>
                                                <p style={{ color: "#fff" }}>{(showData('user_dob')) !== 'No Data' ? datesFunc(showData('user_dob')) : 'No Data'}</p>
                                            </li>
                                            <li style={styles}>
                                                <p>GENDER</p>
                                                <p style={{ color: "#fff" }}>{showData('user_sex')}</p>
                                            </li>
                                            <li style={styles}>
                                                <p>COUNTRY</p>
                                                <p style={{ color: "#fff" }}>{showData('user_country')}</p>
                                            </li>
                                            <li style={styles}>
                                                <p>CITY</p>
                                                <p style={{ color: "#fff" }}>{showData('user_city')}</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <div className='mt-4'>
                                        <h5>● Educational Details</h5>
                                    </div>
                                    <div>
                                        <ul style={{}}>
                                            <li style={styles}>
                                                <p>INSTITUTE</p>
                                                <p style={{ color: "#fff" }}>{showData('user_institute_name')}</p>
                                            </li>
                                            <li style={styles}>
                                                <p>QUALIFICATION</p>
                                                <p style={{ color: "#fff" }}>{showData('user_qualification')}</p>
                                            </li>
                                            <li style={styles}>
                                                <p>QUALIFICATION STATUS</p>
                                                <p style={{ color: "#fff" }}>{showData('user_degree_status')}</p>
                                            </li>
                                            <li style={styles}>
                                                <p>QUALIFICATION END / EXPECTED</p>
                                                <p style={{ color: "#fff" }}>{(showData('user_passoutYear')) !== 'No Data' ? datesFunc(showData('user_passoutYear')) : 'No Data'}</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <div className='mt-4'>
                                        <h5>● Professional Details</h5>
                                    </div>
                                    <div>
                                        <ul style={{}}>
                                            <li style={styles}>
                                                <p>PROFESSION</p>
                                                <p style={{ color: "#fff" }}>{showData('user_profession')}</p>
                                            </li>
                                            <li style={styles}>
                                                <p>GITHUB URL</p>
                                                {showData('user_github') !== 'No Data' ?
                                                    <a href={showData('user_github')} rel="noopener noreferrer" target="_blank" title={showData('user_github')}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 640 512" fill='currentColor'><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" /></svg>
                                                    </a>
                                                    :
                                                    <p style={{ color: "#fff" }}>No Data</p>
                                                }
                                            </li>
                                            <li style={styles}>
                                                <p>LINKEDIN URL</p>
                                                {showData('user_linkedIn') !== 'No Data' ?
                                                    <a href={showData('user_linkedIn')} rel="noopener noreferrer" target="_blank" title={showData('user_linkedIn')}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 640 512" fill='currentColor'><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" /></svg>
                                                    </a>
                                                    :
                                                    <p style={{ color: "#fff" }}>No Data</p>
                                                }
                                            </li>
                                            <li style={styles}>
                                                <p>STACK OVERFLOW</p>
                                                {showData('user_so') !== 'No Data' ?
                                                    <a href={showData('user_so')} target="_blank" rel="noopener noreferrer" title={showData('user_so')}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 640 512" fill='currentColor'><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" /></svg>
                                                    </a>
                                                    :
                                                    <p style={{ color: "#fff" }}>No Data</p>
                                                }
                                            </li>
                                            <li style={styles}>
                                                <p>RESUME</p>
                                                {userData?.user_cv ?
                                                    <button className="btnn sub-button tf-button style2 mx-2" onClick={() => setViewPdf(true)}>View</button>
                                                    :
                                                    <p style={{ color: "#fff" }}>No Data</p>
                                                }
                                            </li>
                                            <li style={{ backgroundColor: "#1E2835", padding: "10px", display: "block", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", borderRadius: "5px" }}>
                                                <p>SKILLS</p>
                                                <p style={{ color: "#fff" }} className='text-end'>{userData?.user_skills && userData?.user_skills.length > 0 && userData?.user_skills[0].trim() !== '' ? userData?.user_skills[0].trim() : 'No Data'}</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section >
            </div>

            {/* add, edit modal */}
            <Modal show={showEditModal} className='focused' centered backdrop="static" onHide={editModalHide} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Edit Profile</Modal.Title>
                </Modal.Header>
                <>
                    <form onSubmit={handleSubmitAdd(submit)} >
                        {disableButton === true ?
                            <Modal.Body>
                                <div className="d-flex justify-content-center align-items-center w-100" style={{ height: '60vh' }}>
                                    <InfinitySpin
                                        width='200'
                                        color="#4fa94d"
                                    />
                                </div>
                            </Modal.Body> :
                            <Modal.Body style={{ height: '60vh', overflowY: 'scroll' }}>
                                <label className="my-2 text-uppercase">Personal Information <span className="text-danger">*</span></label>
                                <div className="row">
                                    <div className="col-md-12">
                                        {modalDivForInputGenerator && modalDivForInputGenerator({ divClassNames: 'mb-3', labelClassNames: "form-label", labelName: 'Full Name', inputType: 'text', inputclassNames: 'form-control', inputPlaceholderText: 'your name', inputId: 'name', errorsType: errorsAdd, registerType: registerAdd, errorSpanClassNames: 'text-danger' })}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        {modalDivForInputGenerator && modalDivForInputGenerator({ divClassNames: 'mb-3', labelClassNames: "form-label", labelName: 'User Name', inputType: 'text', inputclassNames: 'form-control', inputPlaceholderText: 'username', inputId: 'username', errorsType: errorsAdd, registerType: registerAdd, errorSpanClassNames: 'text-danger' })}
                                    </div>
                                    <div className="col-md-6">
                                        {modalDivForInputGenerator && modalDivForInputGenerator({ divClassNames: 'mb-3', labelClassNames: "form-label", labelName: 'Email', inputType: 'email', inputclassNames: 'form-control', inputPlaceholderText: 'your email', inputId: 'email', errorsType: errorsAdd, registerType: registerAdd, errorSpanClassNames: 'text-danger', readOnly: true })}
                                    </div>
                                </div>
                                {/* <div className="row"> */}
                                  
                                    {/* <div className="col-md-6">
                                        <label htmlFor='phone' className='form-label mb-3'>Phone <span className='text-danger'>*</span></label>
                                        <Controller
                                            name="phone"
                                            control={control}
                                            render={({ field }) => (
                                                <PhoneInput
                                                    {...field}
                                                    id="phone"
                                                    country={'in'}
                                                    disabled={true}
                                                    value={String(field.value) || ''}
                                                    onChange={(value, country) => {
                                                        field.onChange(value);
                                                        handlePhoneChange(country);
                                                    }}
                                                    disableCountryCode={true}
                                                    enableSearch={true}
                                                    enableLongNumbers={true}
                                                    inputStyle={{ width: '100%', height: '45px', backgroundColor: '#1E2835', border: (errorsAdd?.phone?.message) ? "3px solid red" : '3px solid #CED4DA', color: '#FFFFFF' }}
                                                    dropdownStyle={{ backgroundColor: '#1E2835', width: 'max-content', border: '3px solid #CED4DA', borderRadius: '5px' }}
                                                    searchStyle={{ backgroundColor: '#1E2835', border: '3px solid #CED4DA', borderRadius: '5px' }}
                                                    buttonStyle={{ backgroundColor: '#1E2835', border: '3px solid #CED4DA', borderRadius: '5px' }}
                                                />
                                            )}
                                        />
                                        {errorsAdd?.phone && <span className='text-danger'>{errorsAdd?.phone?.message}</span>}
                                    </div> */}
                                {/* </div> */}
                                <div className="row">
                                    <div className="col-md-6">
                                        {modalDivForInputGenerator && modalDivForInputGenerator({ divClassNames: 'mb-3', labelClassNames: "form-label", labelName: 'Country', inputType: 'text', inputclassNames: 'form-control', inputPlaceholderText: 'country', inputId: 'country', errorsType: errorsAdd, registerType: registerAdd, errorSpanClassNames: 'text-danger', readOnly: true })}
                                    </div>
                                    <div className="col-md-6">
                                        {modalDivForInputGenerator && modalDivForInputGenerator({ divClassNames: 'mb-3', labelClassNames: "form-label", labelName: 'City', inputType: 'text', inputclassNames: 'form-control', inputPlaceholderText: 'city', inputId: 'city', errorsType: errorsAdd, registerType: registerAdd, errorSpanClassNames: 'text-danger' })}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className='mb-3' >
                                            <label htmlFor={`dob`} className='form-label d-flex mt-2'>
                                                Birth Date
                                            </label>
                                            <Controller
                                                name={`dob`}
                                                control={control}
                                                render={({ field }) => (
                                                    <input type="date" id={`dob`} {...field} onChange={(e) => { field.onChange(e.target.value); }} className='form-control'
                                                        style={{ border: errorsAdd?.dob ? '1px solid red' : '1px solid #ced4da' }}
                                                    />
                                                )}
                                            />
                                            {errorsAdd?.dob && (
                                                <span className={`text-danger d-flex justify-content-end mt-2`}>
                                                    {errorsAdd?.dob?.message}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <label htmlFor='gender' className='form-label d-flex mt-2'>Gender</label>
                                            <div className='d-flex'>
                                                <select {...registerAdd('gender')} id="gender" style={{ border: (errorsAdd?.gender?.message) ? '1px solid red' : '1px solid #ced4da' }}>
                                                    <option value="" disabled>Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                </select>
                                            </div>
                                            {errorsAdd?.gender && <span className='text-danger d-flex justify-content-end mt-2'>{errorsAdd?.gender?.message}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='mb-3'>
                                        <div className='d-flex justify-content-between w-100'>

                                            <label htmlFor='image' className='form-label d-flex mt-2'>
                                                Profile Image
                                            </label>
                                            {watchAdd('image') ? <button type="button" className="btn-close" aria-label="Close"
                                                onClick={() => {
                                                    setValueAdd('image', '');
                                                    document.getElementById('image').value = '';
                                                }}></button> : ''}
                                        </div>
                                        <Controller
                                            name="image"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    type="file"
                                                    className='form-control'
                                                    id='image'
                                                    onChange={(e) => {
                                                        field.onChange(e.target.files[0]);
                                                    }}
                                                    accept=".jpg, .jpeg, .png"
                                                    style={{
                                                        borderColor: errorsAdd?.image ? 'red' : '#ced4da', background: '#1E2835',
                                                        color: '#798DA3'
                                                    }}
                                                />
                                            )}
                                        />
                                        {errorsAdd?.image && (
                                            <span className={`text-danger d-flex justify-content-end mt-2`}>
                                                {errorsAdd?.image?.message}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <label className="my-2 text-uppercase">Professional Information <span className="text-danger">*</span></label>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <label htmlFor='profession' className='form-label d-flex mt-2'>Profession</label>
                                            <div className='d-flex'>
                                                <select {...registerAdd('profession')} id="gender" style={{ border: (errorsAdd?.profession?.message) ? '1px solid red' : '1px solid #ced4da' }}>
                                                    <option value="" disabled>Select Profession</option>
                                                    <option value="freelancer">Freelancer</option>
                                                    <option value="professional">Professional</option>
                                                    <option value="student">Student</option>
                                                </select>
                                            </div>
                                            {errorsAdd?.profession && <span className='text-danger d-flex justify-content-end mt-2'>{errorsAdd?.profession?.message}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {modalDivForInputGenerator && modalDivForInputGenerator({ divClassNames: 'mb-3', labelClassNames: "form-label", labelName: 'Stack Overflow', inputType: 'text', inputclassNames: 'form-control', inputPlaceholderText: 'stack overflow url', inputId: 'stack_overflow', errorsType: errorsAdd, registerType: registerAdd, errorSpanClassNames: 'text-danger' })}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        {modalDivForInputGenerator && modalDivForInputGenerator({ divClassNames: 'mb-3', labelClassNames: "form-label", labelName: 'GitHub Url', inputType: 'text', inputclassNames: 'form-control', inputPlaceholderText: 'github url', inputId: 'github', errorsType: errorsAdd, registerType: registerAdd, errorSpanClassNames: 'text-danger' })}
                                    </div>
                                    <div className="col-md-6">
                                        {modalDivForInputGenerator && modalDivForInputGenerator({ divClassNames: 'mb-3', labelClassNames: "form-label", labelName: 'LinkedIn Url', inputType: 'text', inputclassNames: 'form-control', inputPlaceholderText: 'linkedIn url', inputId: 'linkedIn', errorsType: errorsAdd, registerType: registerAdd, errorSpanClassNames: 'text-danger' })}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        {modalDivForInputGenerator && modalDivForInputGenerator({ divClassNames: 'mb-3', labelClassNames: "form-label", labelName: 'Skills', inputType: 'text', inputclassNames: 'form-control', inputPlaceholderText: 'skills', inputId: 'skills', errorsType: errorsAdd, registerType: registerAdd, errorSpanClassNames: 'text-danger' })}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className='mb-3'>
                                            <div className='d-flex justify-content-between w-100'>
                                                <label htmlFor='resume' className='form-label d-flex mt-2'>
                                                    Resume (CV)
                                                </label>
                                                {watchAdd('resume') ? <button type="button" className="btn-close" aria-label="Close"
                                                    onClick={() => {
                                                        setValueAdd('resume', '');
                                                        document.getElementById('resume').value = '';
                                                    }}></button> : ''}
                                            </div>
                                            <Controller
                                                name="resume"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="file"
                                                        className='form-control'
                                                        id='resume'
                                                        onChange={(e) => {
                                                            field.onChange(e.target.files[0]);
                                                        }}
                                                        accept=".pdf"
                                                        style={{
                                                            borderColor: errorsAdd?.resume ? 'red' : '#ced4da', background: '#1E2835',
                                                            color: '#798DA3'
                                                        }}
                                                    />
                                                )}
                                            />
                                            {errorsAdd?.resume && (
                                                <span className={`text-danger d-flex justify-content-end mt-2`}>
                                                    {errorsAdd?.resume?.message}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <label className="my-2 text-uppercase">Educational Information <span className="text-danger">*</span></label>
                                <div className="row">
                                    <div className="col-md-6">
                                        {modalDivForInputGenerator && modalDivForInputGenerator({ divClassNames: 'mb-3', labelClassNames: "form-label", labelName: 'Qualification', inputType: 'text', inputclassNames: 'form-control', inputPlaceholderText: 'Highest Degree/Class', inputId: 'qualification', errorsType: errorsAdd, registerType: registerAdd, errorSpanClassNames: 'text-danger' })}
                                    </div>
                                    <div className="col-md-6">
                                        {modalDivForInputGenerator && modalDivForInputGenerator({ divClassNames: 'mb-3', labelClassNames: "form-label", labelName: 'Institute Name', inputType: 'text', inputclassNames: 'form-control', inputPlaceholderText: 'Institute Name', inputId: 'institute_name', errorsType: errorsAdd, registerType: registerAdd, errorSpanClassNames: 'text-danger' })}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <label htmlFor='degree_status' className='form-label d-flex mt-2'>Status</label>
                                            <div className='d-flex'>
                                                <select {...registerAdd('degree_status')} id="degree_status" style={{ border: (errorsAdd?.degree_status?.message) ? '1px solid red' : '1px solid #ced4da' }}>
                                                    <option value="" disabled>Select Status</option>
                                                    <option value="pursuing">Pursuing</option>
                                                    <option value="passed">Passed</option>
                                                </select>
                                            </div>
                                            {errorsAdd?.degree_status && <span className='text-danger d-flex justify-content-end mt-2'>{errorsAdd?.degree_status?.message}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className='mb-3' >
                                            <label htmlFor={`passout`} className='form-label d-flex mt-2'>
                                                Passing Date
                                            </label>
                                            <Controller
                                                name={`passout`}
                                                control={control}
                                                render={({ field }) => (
                                                    <input type="date" id={`passout`} {...field} onChange={(e) => { field.onChange(e.target.value); }} className='form-control'
                                                        style={{ border: errorsAdd?.passout ? '1px solid red' : '1px solid #ced4da' }}
                                                    />
                                                )}
                                            />
                                            {errorsAdd?.passout && (
                                                <span className={`text-danger d-flex justify-content-end mt-2`}>
                                                    {errorsAdd?.passout?.message}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </Modal.Body>}
                        <Modal.Footer>
                            {disableButton === true ?
                                <button className="btnn sub-button tf-button style2 mx-2" disabled={true}>
                                    Edit
                                </button> :
                                <button className="btnn sub-button tf-button style2 mx-2" type="submit" disabled={disableButton}>
                                    Edit
                                </button>}
                        </Modal.Footer>
                    </form>
                </>
            </Modal >

            <Modal show={viewPdf} className='focused' backdrop="static" onHide={() => setViewPdf(false)} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title className='text-uppercase'>{`curriculum vitae`}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='card mt-4'>
                    <iframe title={userData?.user_cv} width={'100%'} height='580px' src={(userData?.user_cv) ? userData?.user_cv : ''}></iframe>
                </Modal.Body>
            </Modal>
            <Toaster />
        </>
    );
}

export default User;