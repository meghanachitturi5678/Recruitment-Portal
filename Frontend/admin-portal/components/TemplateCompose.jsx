import React, { useState } from "react";
import { TextField, Button, Box, Typography, Checkbox } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate } from "react-router-dom";

import {
  BtnUndo,
  BtnRedo,
  BtnBold,
  BtnItalic,
  BtnStrikeThrough,
  BtnUnderline,
  BtnBulletList,
  BtnNumberedList,
  Separator,
  Editor,
  EditorProvider,
  Toolbar,
} from "react-simple-wysiwyg";

import TemplatePreviewer from "./TemplatePreview";

const baseUrl = import.meta.env.VITE_ADMIN_URL
  ? `${import.meta.env.VITE_ADMIN_URL}`
  : "";
const candPortalUrl = import.meta.env.VITE_CAND_URL
  ? `${import.meta.env.VITE_CAND_URL}`
  : "";

const dummyUserDetails = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@gmail.com",
  phone: "1234567890",
  position: "Software Engineer",
  dob: "01/01/1990",
  status: "Hired",
  reason: "Good candidate",
  pastExperience: "Software Engineer at Microsoft",
  techExperience: "Java, Python, React",
  refID: "123456",

  CANDIDATE_PORTAL: import.meta.env.VITE_CAND_URL,
  ADMIN_PORTAL: import.meta.env.VITE_ADMIN_URL,
};

const TextEditor = ({ text, setTextValue, done, cancel }) => {
  function onChange(e) {
    setTextValue(e.target.value);
  }

  return (
    <div>
      <EditorProvider>
        <Editor
          value={text}
          onChange={onChange}
          style={{ maxHeight: "15vh", overflowY: "auto" }}
          align="left"
        >
          <Toolbar>
            <BtnUndo />
            <BtnRedo />

            <Separator />

            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />

            <Separator />

            <BtnBulletList />
            <BtnNumberedList />
          </Toolbar>
        </Editor>
      </EditorProvider>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          justifyContent: "center",
          marginTop: "15px",
        }}
      >
        <Button variant="contained" onClick={done}>
          Done
        </Button>
        <Button variant="contained" onClick={cancel}>
          Cancel
        </Button>
      </Box>
    </div>
  );
};

const ButtonEditor = ({
  text,
  src,
  setButtonText,
  setButtonSrc,
  done,
  cancel,
  error,
}) => {
  return (
    <div>
      <TextField
        id="button-editor"
        label="Text"
        multiline
        rows={1}
        variant="outlined"
        value={text}
        onChange={(e) => setButtonText(e.target.value)}
        sx={{ mb: "10px", width: "100%" }}
        error={error.buttonText}
        helperText={error.buttonText && "Please enter text"}
      />
      <div style={{ marginBottom: "10px" }}>
        <TextField
          id="button-src"
          label="OnClick link"
          variant="outlined"
          value={src}
          onChange={(e) => setButtonSrc(e.target.value)}
          sx={{ mb: "10px", width: "100%" }}
          error={error.buttonSrc}
          helperText={error.buttonSrc && "Please enter a valid link"}
        />
        <Typography>Remember to enter the absolute URL</Typography>
      </div>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        <Button variant="contained" onClick={done}>
          Done
        </Button>

        <Button variant="contained" onClick={cancel}>
          Cancel
        </Button>
      </Box>
    </div>
  );
};

const TemplateEditor = () => {
  const navigate = useNavigate();
  const [emailContent, setEmailContent] = useState("");
  const [elements, setElements] = useState([]);
  const [mode, setMode] = useState(0); // 0: main, 1: text, 2: button
  const [dummyUser, setDummyUser] = useState(true);

  const [templateName, setTemplateName] = useState("");
  const [templateSubject, setTemplateSubject] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const [tempElement, setTempElement] = useState(null);
  const [error, setError] = useState({
    templateName: false,
    templateSubject: false,
    templateDescription: false,

    buttonText: false,
    buttonSrc: false,
    textValue: false,
  });

  const handleTextAdd = () => {
    const newElement = {
      id: elements.length,
      tagName: "text",
      attributes: {
        data: "",
      },
    };

    setTempElement(newElement);
    setMode(1);
  };

  const handleButtonAdd = () => {
    const newElement = {
      id: elements.length,
      tagName: "button",
      attributes: {
        data: "",
        src: "",
      },
    };

    setTempElement(newElement);
    setMode(2);
  };

  const displayContent = () => {
    const temp = [...elements];
    if (validateData(false)) temp.push(tempElement);
    console.log(elements);
    console.log(temp);

    const emailContent = temp
      .map((element) => {
        if (element.tagName === "text") {
          return `<text data="${element.attributes.data}" />`;
        } else if (element.tagName === "button") {
          return `<button src="${element.attributes.src}" data="${element.attributes.data}" />`;
        }
      })
      .join("\n");

    const taggedContent = emailContent
      .replace(/<br>/g, "--br--")
      .replace(/<b>/g, "--bo--")
      .replace(/<i>/g, "--it--")
      .replace(/<\/b>/g, "--ld--")
      .replace(/<\/i>/g, "--al--");

    setEmailContent(taggedContent);
    console.log(emailContent);
  };

  const handleCancel = () => {
    setMode(0);
    setTempElement(null);
    displayContent();
  };

  const validateData = () => {
    if (tempElement === null) return false;

    if (tempElement.tagName === "text" && tempElement.attributes.data === "") {
      setError({ ...error, textValue: true });
      return false;
    } else setError({ ...error, textValue: false });

    if (
      tempElement.tagName === "button" &&
      tempElement.attributes.data === ""
    ) {
      setError({ ...error, buttonText: true });
      return false;
    } else setError({ ...error, buttonText: false });

    if (tempElement.tagName === "button" && tempElement.attributes.src === "") {
      setError({ ...error, buttonSrc: true });
      return false;
    } else setError({ ...error, buttonSrc: false });

    return true;
  };

  const handleDone = () => {
    if (!validateData()) {
      return;
    }

    if (tempElement) {
      const updatedElements = [...elements];
      updatedElements.push(tempElement);
      setElements(updatedElements);
      setTempElement(null);
    }

    displayContent();
    setMode(0);
  };

  const handleTextValueChange = (value) => {
    const updatedElement = { ...tempElement };
    updatedElement.attributes.data = value;
    setTempElement(updatedElement);

    displayContent();
  };

  const handleButtonTextChange = (value) => {
    const updatedElement = { ...tempElement };
    updatedElement.attributes.data = value;
    setTempElement(updatedElement);

    displayContent();
  };

  const handleButtonSrcChange = (value) => {
    const updatedElement = { ...tempElement };
    updatedElement.attributes.src = value;
    setTempElement(updatedElement);

    displayContent();
  };

  const handleBold = () => {
    const updatedElement = { ...tempElement };
    updatedElement.attributes.data =
      updatedElement.attributes.data + "<b>Bold Text</b>";
    setTempElement(updatedElement);

    displayContent();
  };

  const handleItalic = () => {
    const updatedElement = { ...tempElement };
    updatedElement.attributes.data =
      updatedElement.attributes.data + "<i>Italic Text</i>";
    setTempElement(updatedElement);

    displayContent();
  };

  const handleNewline = () => {
    const updatedElement = { ...tempElement };
    updatedElement.attributes.data = updatedElement.attributes.data + "<br>";
    setTempElement(updatedElement);

    displayContent();
  };

  const saveTemplate = () => {
    if (!validateData()) {
      setAlertMessage("Please fill all the fields!");
      setAlertSeverity("error");
      setAlertOpen(true);

      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND}/templates/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: templateName,
        desc: templateDescription,
        subject: templateSubject,
        content: emailContent,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setAlertMessage("Email Template added successfully!");
        setAlertSeverity("success");
        setAlertOpen(true);
        navigate("/templates");
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlertMessage("Failed to add new template!");
        setAlertSeverity("error");
        setAlertOpen(true);
      });
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div
        style={{
          height: "15%",
          width: "100%",
          alignItems: "flex-end",
          marginBottom: "-50px",
        }}
      >
        <h1>Add Template</h1>
      </div>

      <div
        style={{
          height: "80%",
          width: "100%",
          orientation: "horizontal",
          display: "flex",
          gap: "10px",
        }}
      >
        <div style={{ width: "50%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "10px",
            }}
          >
            <Box>
              <Typography variant="h6">Template Editor</Typography>

              <TextField
                id="template-name"
                label="Template Name"
                variant="outlined"
                sx={{ width: "100%", mb: "10px" }}
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                error={error.templateName}
                helperText={
                  error.templateName && "Please enter a template name"
                }
              />

              <TextField
                id="template-description"
                label="Template Description"
                multiline
                rows={2}
                variant="outlined"
                sx={{ width: "100%", mb: "10px" }}
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                error={error.templateDescription}
                helperText={
                  error.templateDescription &&
                  "Please enter a template description"
                }
              />

              <TextField
                id="template-subject"
                label="Email Subject"
                variant="outlined"
                sx={{ width: "100%" }}
                value={templateSubject}
                onChange={(e) => setTemplateSubject(e.target.value)}
                error={error.templateSubject}
                helperText={
                  error.templateSubject && "Please enter email subject"
                }
              />
            </Box>

            <Typography variant="h6" align="left">
              Email Content
            </Typography>

            {mode == 0 && (
              <>
                <Button
                  variant="contained"
                  onClick={handleTextAdd}
                  disabled={mode !== 0}
                >
                  Add Text
                </Button>

                <Button
                  variant="contained"
                  onClick={handleButtonAdd}
                  disabled={mode !== 0}
                >
                  Add Button
                </Button>
              </>
            )}

            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dummyUser}
                    onChange={(e) => setDummyUser(e.target.checked)}
                  />
                }
                label="Use dummy user details"
              />

              <div>
                <Typography align="left">
                  {Object.keys(dummyUserDetails).map((key, index) => {
                    return key + ", ";
                  })}
                </Typography>
              </div>
            </div>

            <Button
              variant="contained"
              onClick={saveTemplate}
              disabled={
                emailContent === "" ||
                templateName === "" ||
                templateDescription === "" ||
                templateSubject === ""
              }
            >
              Save Template
            </Button>
          </Box>

          <Box sx={{ padding: "10px", paddingTop: "10px" }}>
            {mode === 1 && (
              <TextEditor
                text={tempElement.attributes?.data || ""}
                setTextValue={handleTextValueChange}
                handleBold={handleBold}
                handleItalic={handleItalic}
                handleNewline={handleNewline}
                done={handleDone}
                cancel={handleCancel}
                error={error}
              />
            )}

            {mode === 2 && (
              <ButtonEditor
                text={tempElement.attributes?.data || ""}
                src={tempElement.attributes?.src || ""}
                setButtonText={handleButtonTextChange}
                setButtonSrc={handleButtonSrcChange}
                done={handleDone}
                cancel={handleCancel}
                error={error}
              />
            )}
          </Box>
        </div>

        <div style={{ width: "50%" }}>
          <div style={{}}>
            <Typography variant="h6">Email Preview</Typography>

            <div
              style={{
                border: "1px solid black",
                padding: "10px",
                maxHeight: "85vh",
                overflowY: "auto",
              }}
              id="email-preview"
            >
              {dummyUser && (
                <TemplatePreviewer
                  subject={templateSubject}
                  emailText={emailContent}
                  user={dummyUserDetails}
                />
              )}
              {!dummyUser && (
                <TemplatePreviewer
                  subject={templateSubject}
                  emailText={emailContent}
                  user={null}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
