import React, { useEffect, useState, useRef } from "react";
import { Country, State, City } from "country-state-city";
import "./App.css";
import Modal from "../components/Modal";
import DisplayDetails from "../components/DisplayDetails";

import axios from "axios";

function App() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    const isValid = validateCurrentStep();
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const [positions, setPositions] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchPositions() {
      try {
        const resp = await fetch(`${import.meta.env.VITE_BACKEND}/positions`);
        const data = await resp.json();
        setPositions(data.filter(item => item.status === 'Open'));
      } catch (error) {}
    }
    fetchPositions();
  }, []);

  const handleRoleSelect = (event) => {
    setSelectedRole(event.target.value);
    formData.position = event.target.value;
    const position = positions.find(
      (pos) => pos.roleName === event.target.value
    );
    setSelectedPosition(position);
    handleChange(event);
  };

  const handleViewDetails = () => {
    formData.position = selectedRole;
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setCurrentStep(2);
    setShowModal(false);
  };

  const [formData, setFormData] = useState({
    countryCode: "91",
    nationality: "indian",
    country: "India",
  });

  const [errors, setErrors] = useState({});

  const validateCurrentField = (field, value) => {
    let error = "";
    if (field != "photo" && field != "resume" && (!value || !value.trim())) {
      switch (field) {
        case "firstName":
          error = "First Name is required";
          break;
        case "lastName":
          error = "Last Name is required";
          break;
        case "email":
          error = "Email is required";
          break;
        case "phNumber":
          error = "Phone Number is required";
          break;
        case "dob":
          error = "DOB is required";
          break;
        case "gender":
          error = "Gender is required";
          break;
        case "nationality":
          error = "Nationality is required";
          break;
        case "building":
          error = "Building is required";
          break;
        case "addressLine1":
          error = "Address Line is required";
          break;
        case "city":
          error = "City is required";
          break;
        case "state":
          error = "State is required";
          break;
        case "country":
          error = "Country is required";
          break;
        case "pincode":
          error = "Pincode is required";
          break;
        case "position":
          error = "Position is required";
          break;
        case "reasonToHire":
          error = "This field is required";
          break;
        case "pastExperience":
          error = "This field is required";
          break;
        case "techExperience":
          error = "This field is required";
          break;
        default:
          break;
      }
      return error;
    }
    if (field === "email" && !/\S+@\S+\.\S+/.test(value)) {
      error = "Email is invalid";
    }
    if (field === "phNumber" && !/^\d+$/.test(value)) {
      error = "Phone Number is invalid";
    }
    if (field === "pincode" && !/^\d+$/.test(value)) {
      error = "Pincode is invalid";
    }
    if (field === "photo" && !value) {
      error = "Photo is required";
    }
    if (field === "resume" && !value) {
      error = "Resume is required";
    }

    return error;
  };

  const areAllValuesEmpty = (obj) => {
    for (const key in obj) {
      if (obj[key].trim() !== "") {
        return false;
      }
    }
    return true;
  };

  const validateCurrentStep = () => {
    const validationErrors = {};
    switch (currentStep) {
      case 1:
        validationErrors.firstName = validateCurrentField(
          "firstName",
          formData.firstName
        );
        validationErrors.lastName = validateCurrentField(
          "lastName",
          formData.lastName
        );
        validationErrors.email = validateCurrentField("email", formData.email);
        validationErrors.phNumber = validateCurrentField(
          "phNumber",
          formData.phNumber
        );
        validationErrors.dob = validateCurrentField("dob", formData.dob);
        validationErrors.gender = validateCurrentField(
          "gender",
          formData.gender
        );
        validationErrors.nationality = validateCurrentField(
          "nationality",
          formData.nationality
        );
        validationErrors.building = validateCurrentField(
          "building",
          formData.building
        );
        validationErrors.addressLine1 = validateCurrentField(
          "addressLine1",
          formData.addressLine1
        );
        validationErrors.city = validateCurrentField("city", formData.city);
        validationErrors.state = validateCurrentField("state", formData.state);
        validationErrors.country = validateCurrentField(
          "country",
          formData.country
        );
        validationErrors.pincode = validateCurrentField(
          "pincode",
          formData.pincode
        );

        setErrors(validationErrors);
        if (
          areAllValuesEmpty(errors) &&
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phNumber &&
          formData.dob &&
          formData.gender &&
          formData.nationality &&
          formData.building &&
          formData.addressLine1 &&
          formData.city &&
          formData.state &&
          formData.country &&
          formData.pincode
        ) {
          return true;
        } else {
          return false;
        }
      case 2:
        validationErrors.position = validateCurrentField(
          "position",
          formData.position
        );
        validationErrors.reasonToHire = validateCurrentField(
          "reasonToHire",
          formData.reasonToHire
        );
        validationErrors.pastExperience = validateCurrentField(
          "pastExperience",
          formData.pastExperience
        );
        validationErrors.techExperience = validateCurrentField(
          "techExperience",
          formData.techExperience
        );
        setErrors(validationErrors);
        if (
          areAllValuesEmpty(errors) &&
          formData.position &&
          formData.reasonToHire &&
          formData.pastExperience &&
          formData.techExperience
        ) {
          return true;
        } else {
          return false;
        }
      case 3:
        validationErrors.photo = validateCurrentField("photo", formData.photo);
        validationErrors.resume = validateCurrentField(
          "resume",
          formData.resume
        );
        setErrors(validationErrors);
        if (areAllValuesEmpty(errors) && formData.photo && formData.resume) {
          return true;
        } else {
          return false;
        }
      default:
        return true;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    const error = validateCurrentField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    if (name == "country") {
      handleCountryChange(e.target.value);
    }
  };

  const [resumePreview, setResumePreview] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleFileChange = (e) => {
    const { name, value } = e.target;
    const file = e.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: file,
    }));
    const error = validateCurrentField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    switch (name) {
      case "photo":
        handlePhotoChange(e);
        break;
      case "resume":
        handleResumeChange(e);
        break;
      default:
        break;
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setResumePreview(URL.createObjectURL(file));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoPreview(URL.createObjectURL(file));
  };

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [defaultCountry, setDefaultCountry] = useState("India");

  const handleCountryChange = async (countryName) => {
    const cEntry = countries.find((entry) => entry.name == countryName);
    const countryCode = cEntry ? cEntry.isoCode : null;
    try {
      const statesData = await State.getStatesOfCountry(countryCode);
      setStates(statesData);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesData = await Country.getAllCountries();
        setCountries(countriesData);
        await handleCountryChange(defaultCountry);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, [defaultCountry, countries]);

  const [response, setResponse] = useState(null);

  const handleSubmit = async () => {
    const isValid = validateCurrentStep();
    if (isValid) {
      const userDetails = new FormData();
      userDetails.append("firstName", formData.firstName);
      userDetails.append(
        "middleName",
        formData.middleName == undefined ? "" : formData.middleName
      );
      userDetails.append("lastName", formData.lastName);
      userDetails.append("email", formData.email);
      userDetails.append("countryCode", "+" + formData.countryCode);
      userDetails.append("phNumber", formData.phNumber);
      userDetails.append("dob", formData.dob);
      userDetails.append("gender", formData.gender);
      userDetails.append("nationality", formData.nationality);

      userDetails.append("building", formData.building);
      userDetails.append("addressLine1", formData.addressLine1);
      userDetails.append(
        "addressLine2",
        formData.addressLine2 == undefined ? "" : formData.addressLine2
      );
      userDetails.append("city", formData.city);
      userDetails.append("state", formData.state);
      userDetails.append("country", formData.country);
      userDetails.append("pincode", formData.pincode);

      userDetails.append("position", formData.position);
      userDetails.append("reasonToHire", formData.reasonToHire);
      userDetails.append("pastExperience", formData.pastExperience);
      userDetails.append("techExperience", formData.techExperience);

      userDetails.append("photo", formData.photo);
      userDetails.append("resume", formData.resume);

      const headers = { "Content-Type": "multipart/form-data" };
      await axios
        .post(`${import.meta.env.VITE_BACKEND}/apply/add`, userDetails, {
          headers: headers,
        })
        .then((resp) => {
          setResponse(resp);
          setCurrentStep(4);
        })
        .catch((error) => {
          setResponse(error.response.data);
        });
    }
  };

  return (
    <div id="mainContainer">
      <img src="/iiit-logo.png" alt="IIIT Hyderabad" className="logo" />
      <a href="/track">
        {" "}
        <button style={{ top: "10px", right: "10px", position: "absolute" }}>
          Track application
        </button>
      </a>

      <h1> JOB APPLICATION</h1>
      <div className="container">
        {!response && (
          <div className="content">
            <div
              style={{
                width: "100%",
                height: "2.5rem",
                backgroundColor: "#ccc",
              }}
            >
              <div
                className="progressBar no-print"
                style={{
                  width: `${(currentStep / 3) * 100}%`,
                }}
              ></div>
              <div className="stepContainer no-print">
                <div>Step 1</div>
                <div>Step 2</div>
                <div>Step 3</div>
              </div>
            </div>

            <form>
              <div
                id="form1"
                style={{ display: currentStep === 1 ? "block" : "none" }}
                className={`formSection ${currentStep === 1 ? "active" : ""}`}
              >
                <h3>PERSONAL DETAILS</h3>
                <div className="colSpan col-count3">
                  <div className="rowSpan">
                    <label htmlFor="firstName">
                      First name <span className="mandatoryField">*</span>{" "}
                    </label>
                    <br />
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      required
                      value={formData.firstName ? formData.firstName : ""}
                      onChange={handleChange}
                    />
                    {errors.firstName && (
                      <span className="errorText"> {errors.firstName}</span>
                    )}
                  </div>
                  <div className="rowSpan">
                    <label htmlFor="middleName">Middle name</label> <br />
                    <input
                      type="text"
                      className="form-control"
                      id="middleName"
                      name="middleName"
                      placeholder="Doe"
                      onChange={handleChange}
                      value={formData.middleName ? formData.middleName : ""}
                    />
                  </div>
                  <div className="rowSpan">
                    <label htmlFor="lastName">
                      Last name <span className="mandatoryField">*</span>
                    </label>
                    <br />
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      placeholder="Smith"
                      required
                      value={formData.lastName ? formData.lastName : ""}
                      onChange={handleChange}
                    />
                    {errors.lastName && (
                      <span className="errorText"> {errors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="colSpan col-count2">
                  <div className="rowSpan">
                    <label htmlFor="email">
                      Email ID <span className="mandatoryField">*</span>
                    </label>
                    <br />
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="xyz@example.com"
                      required
                      value={formData.email ? formData.email : ""}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <span className="errorText"> {errors.email}</span>
                    )}
                  </div>
                  <div className="rowSpan">
                    <label htmlFor="phNumber">
                      Phone Number <span className="mandatoryField">*</span>
                    </label>{" "}
                    <br />
                    <select
                      className="form-control"
                      id="countryCode"
                      name="countryCode"
                      placeholder="+91"
                      required
                      value={formData.countryCode ? formData.countryCode : ""}
                      onChange={handleChange}
                      style={{
                        width: `${
                          formData.countryCode.split(":")[0].length * 10 + 30
                        }px`,
                      }}
                    >
                      <option value="">-- Select --</option>
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.phonecode}>
                          {country.phonecode}: {country.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="form-control"
                      id="phNumber"
                      name="phNumber"
                      placeholder="99999 99999"
                      required
                      value={formData.phNumber ? formData.phNumber : ""}
                      onChange={handleChange}
                      style={{
                        width: `calc(99% - ${
                          formData.countryCode.split(":")[0].length * 10 + 30
                        }px)`,
                      }}
                    />
                    {errors.phNumber && (
                      <span className="errorText"> {errors.phNumber}</span>
                    )}
                  </div>
                </div>
                <div className="colSpan col-count3">
                  <div className="rowSpan">
                    <label htmlFor="dob">
                      Date Of Birth <span className="mandatoryField">*</span>{" "}
                    </label>
                    <br />
                    <input
                      type="date"
                      className="form-control"
                      id="dob"
                      name="dob"
                      required
                      value={formData.dob ? formData.dob : ""}
                      onChange={handleChange}
                    />
                    {errors.dob && (
                      <span className="errorText"> {errors.dob}</span>
                    )}
                  </div>
                  <div className="rowSpan">
                    <label htmlFor="gender">
                      Gender <span className="mandatoryField">*</span>{" "}
                    </label>{" "}
                    <br />
                    <select
                      id="gender"
                      name="gender"
                      required
                      value={formData.gender ? formData.gender : ""}
                      onChange={handleChange}
                    >
                      <option value="">-- Select --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && (
                      <span className="errorText"> {errors.gender}</span>
                    )}
                  </div>
                  <div className="rowSpan">
                    <label htmlFor="nationality" required>
                      Nationality <span className="mandatoryField">*</span>
                    </label>
                    <br />
                    <select
                      id="nationality"
                      name="nationality"
                      required
                      value={
                        formData.nationality ? formData.nationality : "Indian"
                      }
                      onChange={handleChange}
                    >
                      <option value="">-- Select --</option>
                      <option value="afghan">Afghan</option>
                      <option value="albanian">Albanian</option>
                      <option value="algerian">Algerian</option>
                      <option value="american">American</option>
                      <option value="andorran">Andorran</option>
                      <option value="angolan">Angolan</option>
                      <option value="antiguans">Antiguans</option>
                      <option value="argentinean">Argentinean</option>
                      <option value="armenian">Armenian</option>
                      <option value="australian">Australian</option>
                      <option value="austrian">Austrian</option>
                      <option value="azerbaijani">Azerbaijani</option>
                      <option value="bahamian">Bahamian</option>
                      <option value="bahraini">Bahraini</option>
                      <option value="bangladeshi">Bangladeshi</option>
                      <option value="barbadian">Barbadian</option>
                      <option value="barbudans">Barbudans</option>
                      <option value="batswana">Batswana</option>
                      <option value="belarusian">Belarusian</option>
                      <option value="belgian">Belgian</option>
                      <option value="belizean">Belizean</option>
                      <option value="beninese">Beninese</option>
                      <option value="bhutanese">Bhutanese</option>
                      <option value="bolivian">Bolivian</option>
                      <option value="bosnian">Bosnian</option>
                      <option value="brazilian">Brazilian</option>
                      <option value="british">British</option>
                      <option value="bruneian">Bruneian</option>
                      <option value="bulgarian">Bulgarian</option>
                      <option value="burkinabe">Burkinabe</option>
                      <option value="burmese">Burmese</option>
                      <option value="burundian">Burundian</option>
                      <option value="cambodian">Cambodian</option>
                      <option value="cameroonian">Cameroonian</option>
                      <option value="canadian">Canadian</option>
                      <option value="cape verdean">Cape Verdean</option>
                      <option value="central african">Central African</option>
                      <option value="chadian">Chadian</option>
                      <option value="chilean">Chilean</option>
                      <option value="chinese">Chinese</option>
                      <option value="colombian">Colombian</option>
                      <option value="comoran">Comoran</option>
                      <option value="congolese">Congolese</option>
                      <option value="costa rican">Costa Rican</option>
                      <option value="croatian">Croatian</option>
                      <option value="cuban">Cuban</option>
                      <option value="cypriot">Cypriot</option>
                      <option value="czech">Czech</option>
                      <option value="danish">Danish</option>
                      <option value="djibouti">Djibouti</option>
                      <option value="dominican">Dominican</option>
                      <option value="dutch">Dutch</option>
                      <option value="east timorese">East Timorese</option>
                      <option value="ecuadorean">Ecuadorean</option>
                      <option value="egyptian">Egyptian</option>
                      <option value="emirian">Emirian</option>
                      <option value="equatorial guinean">
                        Equatorial Guinean
                      </option>
                      <option value="eritrean">Eritrean</option>
                      <option value="estonian">Estonian</option>
                      <option value="ethiopian">Ethiopian</option>
                      <option value="fijian">Fijian</option>
                      <option value="filipino">Filipino</option>
                      <option value="finnish">Finnish</option>
                      <option value="french">French</option>
                      <option value="gabonese">Gabonese</option>
                      <option value="gambian">Gambian</option>
                      <option value="georgian">Georgian</option>
                      <option value="german">German</option>
                      <option value="ghanaian">Ghanaian</option>
                      <option value="greek">Greek</option>
                      <option value="grenadian">Grenadian</option>
                      <option value="guatemalan">Guatemalan</option>
                      <option value="guinea-bissauan">Guinea-Bissauan</option>
                      <option value="guinean">Guinean</option>
                      <option value="guyanese">Guyanese</option>
                      <option value="haitian">Haitian</option>
                      <option value="herzegovinian">Herzegovinian</option>
                      <option value="honduran">Honduran</option>
                      <option value="hungarian">Hungarian</option>
                      <option value="icelander">Icelander</option>
                      <option value="indian">Indian</option>
                      <option value="indonesian">Indonesian</option>
                      <option value="iranian">Iranian</option>
                      <option value="iraqi">Iraqi</option>
                      <option value="irish">Irish</option>
                      <option value="israeli">Israeli</option>
                      <option value="italian">Italian</option>
                      <option value="ivorian">Ivorian</option>
                      <option value="jamaican">Jamaican</option>
                      <option value="japanese">Japanese</option>
                      <option value="jordanian">Jordanian</option>
                      <option value="kazakhstani">Kazakhstani</option>
                      <option value="kenyan">Kenyan</option>
                      <option value="kittian and nevisian">
                        Kittian and Nevisian
                      </option>
                      <option value="kuwaiti">Kuwaiti</option>
                      <option value="kyrgyz">Kyrgyz</option>
                      <option value="laotian">Laotian</option>
                      <option value="latvian">Latvian</option>
                      <option value="lebanese">Lebanese</option>
                      <option value="liberian">Liberian</option>
                      <option value="libyan">Libyan</option>
                      <option value="liechtensteiner">Liechtensteiner</option>
                      <option value="lithuanian">Lithuanian</option>
                      <option value="luxembourger">Luxembourger</option>
                      <option value="macedonian">Macedonian</option>
                      <option value="malagasy">Malagasy</option>
                      <option value="malawian">Malawian</option>
                      <option value="malaysian">Malaysian</option>
                      <option value="maldivan">Maldivan</option>
                      <option value="malian">Malian</option>
                      <option value="maltese">Maltese</option>
                      <option value="marshallese">Marshallese</option>
                      <option value="mauritanian">Mauritanian</option>
                      <option value="mauritian">Mauritian</option>
                      <option value="mexican">Mexican</option>
                      <option value="micronesian">Micronesian</option>
                      <option value="moldovan">Moldovan</option>
                      <option value="monacan">Monacan</option>
                      <option value="mongolian">Mongolian</option>
                      <option value="moroccan">Moroccan</option>
                      <option value="mosotho">Mosotho</option>
                      <option value="motswana">Motswana</option>
                      <option value="mozambican">Mozambican</option>
                      <option value="namibian">Namibian</option>
                      <option value="nauruan">Nauruan</option>
                      <option value="nepalese">Nepalese</option>
                      <option value="new zealander">New Zealander</option>
                      <option value="ni-vanuatu">Ni-Vanuatu</option>
                      <option value="nicaraguan">Nicaraguan</option>
                      <option value="nigerien">Nigerien</option>
                      <option value="north korean">North Korean</option>
                      <option value="northern irish">Northern Irish</option>
                      <option value="norwegian">Norwegian</option>
                      <option value="omani">Omani</option>
                      <option value="pakistani">Pakistani</option>
                      <option value="palauan">Palauan</option>
                      <option value="panamanian">Panamanian</option>
                      <option value="papua new guinean">
                        Papua New Guinean
                      </option>
                      <option value="paraguayan">Paraguayan</option>
                      <option value="peruvian">Peruvian</option>
                      <option value="polish">Polish</option>
                      <option value="portuguese">Portuguese</option>
                      <option value="qatari">Qatari</option>
                      <option value="romanian">Romanian</option>
                      <option value="russian">Russian</option>
                      <option value="rwandan">Rwandan</option>
                      <option value="saint lucian">Saint Lucian</option>
                      <option value="salvadoran">Salvadoran</option>
                      <option value="samoan">Samoan</option>
                      <option value="san marinese">San Marinese</option>
                      <option value="sao tomean">Sao Tomean</option>
                      <option value="saudi">Saudi</option>
                      <option value="scottish">Scottish</option>
                      <option value="senegalese">Senegalese</option>
                      <option value="serbian">Serbian</option>
                      <option value="seychellois">Seychellois</option>
                      <option value="sierra leonean">Sierra Leonean</option>
                      <option value="singaporean">Singaporean</option>
                      <option value="slovakian">Slovakian</option>
                      <option value="slovenian">Slovenian</option>
                      <option value="solomon islander">Solomon Islander</option>
                      <option value="somali">Somali</option>
                      <option value="south african">South African</option>
                      <option value="south korean">South Korean</option>
                      <option value="spanish">Spanish</option>
                      <option value="sri lankan">Sri Lankan</option>
                      <option value="sudanese">Sudanese</option>
                      <option value="surinamer">Surinamer</option>
                      <option value="swazi">Swazi</option>
                      <option value="swedish">Swedish</option>
                      <option value="swiss">Swiss</option>
                      <option value="syrian">Syrian</option>
                      <option value="taiwanese">Taiwanese</option>
                      <option value="tajik">Tajik</option>
                      <option value="tanzanian">Tanzanian</option>
                      <option value="thai">Thai</option>
                      <option value="togolese">Togolese</option>
                      <option value="tongan">Tongan</option>
                      <option value="trinidadian or tobagonian">
                        Trinidadian or Tobagonian
                      </option>
                      <option value="tunisian">Tunisian</option>
                      <option value="turkish">Turkish</option>
                      <option value="tuvaluan">Tuvaluan</option>
                      <option value="ugandan">Ugandan</option>
                      <option value="ukrainian">Ukrainian</option>
                      <option value="uruguayan">Uruguayan</option>
                      <option value="uzbekistani">Uzbekistani</option>
                      <option value="venezuelan">Venezuelan</option>
                      <option value="vietnamese">Vietnamese</option>
                      <option value="welsh">Welsh</option>
                      <option value="yemenite">Yemenite</option>
                      <option value="zambian">Zambian</option>
                      <option value="zimbabwean">Zimbabwean</option>
                    </select>
                    {errors.nationality && (
                      <span className="errorText"> {errors.nationality}</span>
                    )}
                  </div>
                </div>

                <div className="colSpan col-count1">
                  <div className="rowSpan">
                    <label htmlFor="building">
                      Building <span className="mandatoryField">*</span>
                    </label>
                    <br />
                    <input
                      type="text"
                      className="form-control"
                      id="building"
                      name="building"
                      placeholder="123 Main Street"
                      required
                      value={formData.building ? formData.building : ""}
                      onChange={handleChange}
                    />
                    {errors.building && (
                      <span className="errorText"> {errors.building}</span>
                    )}
                  </div>
                  <div className="rowSpan">
                    <label htmlFor="addressLine1">
                      Address Line 1 <span className="mandatoryField">*</span>
                    </label>
                    <br />
                    <input
                      type="text"
                      className="form-control"
                      id="addressLine1"
                      name="addressLine1"
                      placeholder="Apt 456"
                      required
                      value={formData.addressLine1 ? formData.addressLine1 : ""}
                      onChange={handleChange}
                    />
                    {errors.addressLine1 && (
                      <span className="errorText"> {errors.addressLine1}</span>
                    )}
                  </div>
                  <div className="rowSpan">
                    <label htmlFor="addressLine2">Address Line 2</label>
                    <br />
                    <input
                      type="text"
                      className="form-control"
                      id="addressLine2"
                      name="addressLine2"
                      placeholder="Suburbville"
                      onChange={handleChange}
                      value={formData.addressLine2 ? formData.addressLine2 : ""}
                    />
                  </div>
                </div>

                <div className="colSpan col-count4">
                  <div className="rowSpan">
                    <label htmlFor="city">
                      City <span className="mandatoryField">*</span>{" "}
                    </label>
                    <br />
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      placeholder="Hyderabad"
                      required
                      value={formData.city ? formData.city : ""}
                      onChange={handleChange}
                    />
                    {errors.city && (
                      <span className="errorText"> {errors.city}</span>
                    )}
                  </div>
                  <div className="rowSpan">
                    <label htmlFor="state">
                      State <span className="mandatoryField">*</span>
                    </label>{" "}
                    <br />
                    <select
                      className="form-control"
                      id="state"
                      name="state"
                      required
                      value={formData.state ? formData.state : ""}
                      onChange={handleChange}
                    >
                      <option value="">-- Select --</option>
                      {states.map((state) => (
                        <option key={state.isoCode} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <span className="errorText"> {errors.state}</span>
                    )}
                  </div>
                  <div className="rowSpan">
                    <label htmlFor="country">
                      Country <span className="mandatoryField">*</span>
                    </label>{" "}
                    <br />
                    <select
                      className="form-control"
                      id="country"
                      name="country"
                      required
                      value={formData.country ? formData.country : ""}
                      onChange={handleChange}
                    >
                      <option value="">-- Select --</option>
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <span className="errorText"> {errors.country}</span>
                    )}
                  </div>
                  <div className="rowSpan">
                    <label htmlFor="pincode">
                      Pincode <span className="mandatoryField">*</span>
                    </label>{" "}
                    <br />
                    <input
                      type="text"
                      className="form-control"
                      id="pincode"
                      name="pincode"
                      placeholder="500032"
                      required
                      value={formData.pincode ? formData.pincode : ""}
                      onChange={handleChange}
                    />
                    {errors.pincode && (
                      <span className="errorText"> {errors.pincode}</span>
                    )}
                  </div>
                </div>
              </div>

              <Modal show={showModal} onClose={handleCloseModal}>
                {selectedPosition && (
                  <div className="position-details">
                    <p className="role-name">
                      <strong>{selectedPosition.roleName}</strong>
                    </p>
                    <p>
                      <strong>Description:</strong>
                      <br />
                      {selectedPosition.description
                        .split("\n")
                        .map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))}
                    </p>

                    <p>
                      <strong>Type:</strong>
                      <br />
                      {selectedPosition.type.split("\n").map((line, index) => (
                        <span key={index}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>

                    <p>
                      <strong>Requirements:</strong>
                      <br />
                      {selectedPosition.requirements
                        .split("\n")
                        .map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))}
                    </p>

                    <p>
                      <strong>Responsibilities:</strong>
                      <br />
                      {selectedPosition.responsibilities
                        .split("\n")
                        .map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))}
                    </p>

                    <p>
                      <strong>Salary:</strong>
                      <br />
                      {selectedPosition.salary}
                    </p>

                    <p>
                      <strong>Hiring Duration:</strong>
                      <br />
                      {selectedPosition.hiringDuration}
                    </p>

                    <p>
                      <strong>Start Date:</strong>
                      <br />
                      {selectedPosition.startDate.split("T")[0]}
                    </p>

                    <p>
                      <strong>End Date:</strong>
                      <br />
                      {selectedPosition.endDate.split("T")[0]}
                    </p>

                    <p>
                      <strong>Advertisement Number:</strong>
                      <br />
                      {selectedPosition.advtNo}
                    </p>
                  </div>
                )}
              </Modal>
              <div
                id="form2"
                style={{ display: currentStep === 2 ? "block" : "none" }}
                className={`formSection ${currentStep === 2 ? "active" : ""}`}
              >
                <h3>JOB DETAILS</h3>
                <div className="colSpan col-count3">
                  <div className="rowSpan">
                    <label htmlFor="position">
                      Position Applying For{" "}
                      <span className="mandatoryField">*</span>{" "}
                    </label>
                    <br />
                    <select
                      id="position"
                      name="position"
                      onChange={handleRoleSelect}
                      required
                      value={formData.position ? formData.position : ""}
                    >
                      <option value="">Select Role</option>
                      {positions.map((position) => (
                        <option key={position._id} value={position.roleName}>
                          {position.roleName}
                        </option>
                      ))}
                    </select>

                    {errors.position && (
                      <span className="errorText"> {errors.position}</span>
                    )}
                  </div>
                  <div
                    className="rowSpan"
                    style={{ display: "flex", alignItems: "flex-end" }}
                  >
                    {formData.position && (
                      <button
                        onClick={handleViewDetails}
                        disabled={!selectedPosition}
                        type="button"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>

                <div className="colSpan col-count1">
                  <div className="rowSpan">
                    <label htmlFor="reasonToHire">
                      Why should we hire you?{" "}
                      <span className="mandatoryField">*</span>
                    </label>
                    <br />
                    <textarea
                      rows="4"
                      id="reasonToHire"
                      className="form-control"
                      name="reasonToHire"
                      placeholder="Tell us why we should hire you (in 150-200 words). Highlight your skills, experiences, and motivations."
                      required
                      value={formData.reasonToHire ? formData.reasonToHire : ""}
                      onChange={handleChange}
                    ></textarea>
                    {errors.reasonToHire && (
                      <span className="errorText"> {errors.reasonToHire}</span>
                    )}
                  </div>
                  <div className="rowSpan">
                    <label htmlFor="pastExperience">
                      Past Experience <span className="mandatoryField">*</span>
                    </label>
                    <br />
                    <textarea
                      rows="4"
                      id="pastExperience"
                      className="form-control"
                      name="pastExperience"
                      placeholder="Describe your past work experiences. Include your roles, responsibilities, and achievements."
                      required
                      value={
                        formData.pastExperience ? formData.pastExperience : ""
                      }
                      onChange={handleChange}
                    ></textarea>
                    {errors.pastExperience && (
                      <span className="errorText">
                        {" "}
                        {errors.pastExperience}
                      </span>
                    )}
                  </div>
                  <div className="rowSpan">
                    <label htmlFor="techExperience">
                      Technical Experience{" "}
                      <span className="mandatoryField">*</span>
                    </label>
                    <br />
                    <textarea
                      rows="4"
                      id="techExperience"
                      className="form-control"
                      name="techExperience"
                      placeholder="Detail your technical experience. Include any specific technologies or tools you've used, projects you've worked on, and your contributions."
                      required
                      value={
                        formData.techExperience ? formData.techExperience : ""
                      }
                      onChange={handleChange}
                    ></textarea>
                    {errors.techExperience && (
                      <span className="errorText">
                        {" "}
                        {errors.techExperience}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div
                id="form3"
                className={`formSection ${currentStep === 3 ? "active" : ""}`}
                style={{ display: currentStep === 3 ? "block" : "none" }}
              >
                <h3>FILE UPLOAD</h3>
                <div className="colSpan col-count2">
                  <div className="rowSpan">
                    <label htmlFor="photo">
                      Photo <span className="mandatoryField">*</span>
                    </label>
                    <br />
                    <input
                      type="file"
                      className="form-control"
                      id="photo"
                      accept=".png"
                      name="photo"
                      onChange={handleFileChange}
                    />
                    {errors.photo && (
                      <span className="errorText"> {errors.photo}</span>
                    )}
                    {photoPreview && (
                      <img
                        src={photoPreview}
                        alt="Photo Preview"
                        width="100%"
                        style={{ maxHeight: "400px" }}
                      />
                    )}
                  </div>
                  <div className="rowSpan">
                    <label htmlFor="resume">
                      Resume <span className="mandatoryField">*</span>
                    </label>
                    <br />
                    <input
                      type="file"
                      className="form-control"
                      id="resume"
                      accept=".pdf"
                      name="resume"
                      onChange={handleFileChange}
                    />
                    {resumePreview && (
                      <iframe
                        src={resumePreview}
                        style={{ width: "100%" }}
                        title="Resume Preview"
                      ></iframe>
                    )}
                    {errors.resume && (
                      <span className="errorText"> {errors.resume}</span>
                    )}
                  </div>
                </div>
              </div>

              {currentStep > 1 && (
                <button type="button" onClick={handleBack} className="no-print">
                  Back
                </button>
              )}

              {currentStep < 3 && (
                <button type="button" onClick={handleNext} className="no-print">
                  Next
                </button>
              )}

              {currentStep == 3 && (
                <button
                  onClick={handleSubmit}
                  type="button"
                  className="no-print"
                >
                  Submit
                </button>
              )}
            </form>
          </div>
        )}

        {response && (
          <div>
            {response.status != 200 ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "2rem",
                  }}
                >
                  <p className="errorText">{response}</p>
                </div>
              </>
            ) : (
              currentStep === 4 && <DisplayDetails details={response.data} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
