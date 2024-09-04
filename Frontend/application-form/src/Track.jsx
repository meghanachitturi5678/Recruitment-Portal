import React, { useState, useEffect } from "react";

const TrackApplication = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [track, setTrack] = useState("");

  const handleTrack = async () => {
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND}/track/${track}`
      );
      const data = await resp.json();

      if (resp.status === 200) {
        setResponse(data);
      } else {
        setError(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    }
  };

  return (
    <div id="mainContainer">
      <img src="/iiit-logo.png" alt="IIIT Logo" className="logo" />

      <h1>Track Application</h1>

      <div
        style={{
          display: "block",
          margin: "15px",
          padding: "15px",
          width: "60vw",
          height: "70vh",
          overflowY: "auto",
          overflowX: "hidden",
          minWidth: "320px",
          borderRadius: "15px",
          boxShadow: "0px 0px 50px rgba(0, 0, 0, 0.2)",
        }}
      >
        {!(response || error) && (
          <div>
            <input
              type="text"
              value={track}
              style={{ maxWidth: "250px" }}
              id="track"
              onChange={(e) => setTrack(e.target.value)}
              placeholder="Enter your reference ID"
            />
            <button onClick={handleTrack} style={{ margin: "10px" }}>
              Track
            </button>
          </div>
        )}

        {(response || error) && (
          <div>
            {error && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "2rem",
                  }}
                >
                  <p className="errorText">{error}</p>
                </div>
              </>
            )}

            {response && (
              <div>
                <p>
                  Application submitted on {response.submittedAt.split("T")[0]}
                </p>

                <h3>Personal Details</h3>
                <div className="colSpan col-count1">
                  <div className="rowSpan">
                    <label>
                      <strong>Name:</strong> {response.name}
                    </label>
                  </div>
                  <div className="rowSpan">
                    <label>
                      <strong>Email ID:</strong> {response.email}
                    </label>
                  </div>
                  <div className="rowSpan">
                    <label>
                      <strong>Phone Number:</strong> {response.phoneNumber}
                    </label>
                  </div>
                </div>
                <h3>Job Details</h3>
                <div className="colSpan col-count1">
                  <div className="rowSpan">
                    <label>
                      <strong>Position:</strong> {response.position}
                    </label>
                  </div>
                  <div className="rowSpan">
                    <label>
                      <strong>Description:</strong> {response.description}
                    </label>
                  </div>
                  <div className="rowSpan">
                    <label>
                      <strong>Type:</strong> {response.type}
                    </label>
                  </div>
                  <div className="rowSpan">
                    <label>
                      <strong>Requirements:</strong> {response.requirements}
                    </label>
                  </div>
                  <div className="rowSpan">
                    <label>
                      <strong>Responsibilities:</strong>{" "}
                      {response.responsibilities}
                    </label>
                  </div>
                  <div className="rowSpan">
                    <label>
                      <strong>Salary:</strong> {response.salary}
                    </label>
                  </div>
                </div>

                <h3>Application Status: {response.status}</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackApplication;
