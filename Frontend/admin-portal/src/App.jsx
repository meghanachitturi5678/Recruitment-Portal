import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "../components/Home";
import SideDrawer from "../components/Drawer";
import NavBar from "../components/NavBar";
import DataTable from "../components/Positions";
import ApplicationsDataTable from "../components/Applications";
import ForwardedApplication from "../components/ForwardedApplication";
import Templates from "../components/Templates";
import TemplateEditor from "../components/TemplateCompose";
import Dashboard from "../components/Dashboard";
import Employees from "../components/Employees";

import PageNotFound from "./404";
import Cookies from "js-cookie";

const getUserType = () => {
  const cookie = Cookies.get();
  const role = cookie["role"] || "user";
  return role;
};

function App() {
  const pad = 5;

  return (
    <>
      <Router>
        {getUserType() === "user" ? (
          <Home />
        ) : (
          <div style={{ paddingLeft: 250, paddingTop: 50, display: "flex" }}>
            <SideDrawer />
            <NavBar />

            <div style={{ display: "flex" }}>
              <Routes>
                <Route exact path="/" element={<Home />} />
                {getUserType() === "HR" && (
                  <>
                    <Route
                      exact
                      path="/dashboard"
                      element={
                        <div
                          style={{
                            padding: "1em",
                            position: "fixed",
                            top: 50 + pad,
                            left: 250 + pad,
                            bottom: pad,
                            right: pad,
                          }}
                        >
                          <Dashboard />
                        </div>
                      }
                    />

                    <Route
                      exact
                      path="/applications"
                      element={
                        <div
                          style={{
                            padding: "1em",
                            position: "fixed",
                            top: 50 + pad,
                            left: 250 + pad,
                            bottom: pad,
                            right: pad,
                          }}
                        >
                          <ApplicationsDataTable />
                        </div>
                      }
                    />
                  </>
                )}

                {getUserType() === "Head" && (
                  <Route
                    path="/applications/:id"
                    element={
                      <div
                        style={{
                          padding: "1em",
                          position: "fixed",
                          top: 50 + pad,
                          left: 250 + pad,
                          bottom: pad,
                          right: pad,
                        }}
                      >
                        <ForwardedApplication />
                      </div>
                    }
                  />
                )}

                {getUserType() === "HR" && (
                  <>
                    <Route
                      exact
                      path="/positions"
                      element={
                        <div
                          style={{
                            padding: "1em",
                            position: "fixed",
                            top: 50 + pad,
                            left: 250 + pad,
                            bottom: pad,
                            right: pad,
                          }}
                        >
                          <DataTable />
                        </div>
                      }
                    />

                    <Route
                      exact
                      path="/employees"
                      element={
                        <div
                          style={{
                            padding: "1em",
                            position: "fixed",
                            top: 50 + pad,
                            left: 250 + pad,
                            bottom: pad,
                            right: pad,
                          }}
                        >
                          <Employees />
                        </div>
                      }
                    />

                    <Route
                      path="/templates"
                      element={
                        <div
                          style={{
                            padding: "1em",
                            position: "fixed",
                            top: 50 + pad,
                            left: 250 + pad,
                            bottom: pad,
                            right: pad,
                          }}
                        >
                          <Templates />
                        </div>
                      }
                    />

                    <Route
                      path="/templates/add"
                      element={
                        <div
                          style={{
                            padding: "1em",
                            position: "fixed",
                            top: 50 + pad,
                            left: 250 + pad,
                            bottom: pad,
                            right: pad,
                          }}
                        >
                          <TemplateEditor />
                        </div>
                      }
                    />
                  </>
                )}
                <Route exact path="*" element={<PageNotFound />} />
              </Routes>
            </div>
          </div>
        )}
      </Router>
    </>
  );
}

export default App;
