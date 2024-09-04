import React from "react";
import "./DisplayDetails.css";

const DisplayDetails = ({ details: details }) => {
  const handlePrint = () => {
    window.print();
  };

  const photoUrl = `${import.meta.env.VITE_BACKEND}/apply/${
    details.refID
  }/photo`;
  const resumeUrl = `${import.meta.env.VITE_BACKEND}/apply/${
    details.refID
  }/resume`;

  return (
    <div id="display">
      <h3>Personal Details</h3>
      <div className="frame">
        <img src={photoUrl} alt="Application Photo" />
      </div>
      <div style={{ transform: "translateY(-170px)" }}>
        <div className="colSpan col-count1">
          <div className="rowSpan">
            <label htmlFor="name">
              {" "}
              <strong>Name</strong>: {details.name}
            </label>
            <br />
          </div>

          <div className="rowSpan">
            <label htmlFor="email">
              <strong>Email ID</strong> : {details.email}
            </label>
            <br />
          </div>

          <div className="rowSpan">
            <label htmlFor="phNumber">
              <strong>Phone Number</strong> : {details.phoneNumber}
            </label>
            <br />
          </div>

          <div className="rowSpan">
            <label htmlFor="dob">
              <strong>Date Of Birth</strong> :{" "}
              {new Date(details.dob).toISOString().split("T")[0]}
            </label>
            <br />
          </div>

          <div className="rowSpan">
            <label htmlFor="gender">
              <strong>Gender</strong> : {details.gender}
            </label>
            <br />
          </div>

          <div className="rowSpan">
            <label htmlFor="nationality" required>
              <strong>Nationality</strong> : {details.nationality}
            </label>
            <br />
          </div>

          <div className="rowSpan">
            <label htmlFor="building">
              <strong>Address</strong> : {details.address.building},{" "}
              {details.address.addressLine1}
              {details.addressLine2
                ? `, {details.address.addressLine2}`
                : ""}, {details.address.city}, {details.address.state},{" "}
              {details.address.country}, {details.address.pincode}
            </label>
            <br />
          </div>
        </div>

        <h3>Job Details</h3>
        <div className="colSpan col-count1">
          <div className="rowSpan">
            <label htmlFor="position">
              <strong>Position Applying For</strong> : {details.position}
            </label>
            <br />
          </div>

          <div className="rowSpan">
            <label htmlFor="reasonToHire">
              <strong>Why should we hire you?</strong> : {details.reasonToHire}
            </label>
            <br />
          </div>

          <div className="rowSpan">
            <label htmlFor="pastExperience">
              <strong>Past Experience</strong> : {details.pastExperience}
            </label>
            <br />
          </div>

          <div className="rowSpan">
            <label htmlFor="techExperience">
              <strong>Technical Experience</strong> : {details.techExperience}
            </label>
            <br />
          </div>

          <div className="rowSpan">
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
            <br />
          </div>
        </div>

        <h3>Reference ID : {details.refID} </h3>
        <div className="colSpan col-count1">
          <div className="rowSpan">
            <strong>Note</strong>: Save the reference ID to track the status of
            your application.
            <br />
          </div>
        </div>

        <button onClick={handlePrint} className="no-print">
          Print
        </button>
      </div>
    </div>
  );
};

export default DisplayDetails;
