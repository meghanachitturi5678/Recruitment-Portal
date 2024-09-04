import React from "react";

function PageNotFound() {
    return (
        <div style={{ width: "100%", height: "100%", verticalAlign: "center" }}>
            <div>
                <h1>Oops!</h1>
                <h2>You seem to be lost.</h2>
                <h3>The page you are looking for does not exist.</h3>
                <a href="/">Go to Homepage</a>
            </div>
        </div>
    );
}

export default PageNotFound;