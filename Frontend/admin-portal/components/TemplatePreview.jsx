import React from "react";
import { Typography } from "@mui/material";
import { Button, Container, Img, Text, Hr } from "@react-email/components";
import { renderToString } from "react-dom/server";

import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

const socials = {
  facebook: "https://www.facebook.com/IIITH",
  twitter: "https://twitter.com/iiit_hyderabad",
  youtube: "https://www.youtube.com/channel/UCzCMyBy0VRoQBF8x-TsXTnQ",
  linkedin: "https://www.linkedin.com/school/49275/admin/",
  instagram: "https://www.instagram.com/iiit.hyderabad/",
};

const container = {
  margin: "0 auto",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  textAlign: "left",
  whiteSpace: "pre-line",
  fontFamily: "Arial, sans-serif",
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center",
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};

const social_logo = {
  width: "30px",
  height: "30px",
  margin: "5px",
};

const getEmailText = (params, template, html = false) => {
  const replaceCurlyBraces = (text, params) => {
    return text.replace(/\{([^}]+)\}/g, (_, match) => {
      if (params.hasOwnProperty(match)) return params[match];
      return `{${match}}`;
    });
  };

  let emailText = template;
  emailText = replaceCurlyBraces(emailText, params)
    .replaceAll('data=""', 'data=" "')
    .replaceAll('src=""', 'src=" "')
    .replaceAll("<div>--br--</div>", "--br--")
    .replaceAll('<div style="text-align: left;">--br--</div>', "--br--")
    .replaceAll("<div><ul>", "<ul>")
    .replaceAll("<div><ol>", "<ol>")
    .replaceAll("<div>", "--br--")
    .replaceAll("</div>", "")
    .replaceAll("<b>", "--bo--")
    .replaceAll("</b>", "--ld--")
    .replaceAll("<i>", "--it--")
    .replaceAll("</i>", "--al--")
    .replaceAll("<br>", "--br--")
    .replaceAll("<br/>", "--br--")
    .replaceAll("<strong>", "--bo--")
    .replaceAll("</strong>", "--ld--")
    .replaceAll("<em>", "--it--")
    .replaceAll("</em>", "--al--")
    .replaceAll("<p>", "--br--")
    .replaceAll("</p>", "")
    .replaceAll("<strike>", "--st--")
    .replaceAll("</strike>", "--ke--")
    .replaceAll("<u>", "--un--")
    .replaceAll("</u>", "--nu--")
    .replaceAll("<li>", "--li--")
    .replaceAll("</li>", "--il--")
    .replaceAll("<ul>", "--ul--")
    .replaceAll("</ul>", "--lu--")
    .replaceAll("<ol>", "--ol--")
    .replaceAll("</ol>", "--lo--");

  const getTagswithAttributes = (text) => {
    const htmlTagRegex = /<(\w+)\s*([^>]*)\s*\/?>/g;
    const htmlTagsWithAttributes = text.matchAll(htmlTagRegex);
    const tags = [];

    for (const match of htmlTagsWithAttributes) {
      const tagName = match[1];
      const attributes = match[2].trim();
      const attributePairs = attributes.match(
        /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g
      );
      const attributeMap = {};

      if (attributePairs)
        attributePairs.forEach((pair) => {
          const [name, value] = pair.split("=");
          attributeMap[name] = value.replace(/["']/g, ""); // Remove quotes from attribute values
        });
      tags.push({ tagName, attributes: attributeMap });
    }
    return tags;
  };

  const tags = getTagswithAttributes(emailText);

  const validateTags = (tags) => {
    const allowedTags = ["text", "button"];
    const allowedAttributes = {
      text: ["data", "style"],
      button: ["src", "data"],
    };

    for (const tag of tags) {
      if (!allowedTags.includes(tag.tagName)) {
        console.error(`Tag ${tag.tagName} is not allowed.`);
        return false;
      }

      const allowedAttrs = allowedAttributes[tag.tagName];
      for (const attr in tag.attributes) {
        if (!allowedAttrs.includes(attr)) {
          console.error(
            `Attribute ${attr} is not allowed for tag ${tag.tagName}.`
          );
          return false;
        }
      }
    }

    return true;
  };

  if (!validateTags(tags)) {
    alert("Invalid tags. Please check console for more details. Exiting.");
    throw "Invalid tags. Exiting.";
  }

  const newLines = (tags) => {
    return tags.map((tag) => {
      if (tag.attributes.data) {
        tag.attributes.data = tag.attributes.data
          .replace(/--br--/g, "\n")
          .replace(/--bo--/g, "<b>")
          .replace(/--ld--/g, "</b>")
          .replace(/--it--/g, "<i>")
          .replace(/--al--/g, "</i>")
          .replace(/--st--/g, "<strike>")
          .replace(/--ke--/g, "</strike>")
          .replace(/--un--/g, "<u>")
          .replace(/--nu--/g, "</u>")
          .replace(/--li--/g, "<li>")
          .replace(/--il--/g, "</li>")
          .replace(/--ul--/g, "<ul>")
          .replace(/--lu--/g, "</ul>")
          .replace(/--ol--/g, "<ol>")
          .replace(/--lo--/g, "</ol>");
      }
      return tag;
    });
  };

  newLines(tags);
  const replaceDetails = (tags) => {
    const replacedTags = tags.map((tag) => {
      const index = tags.indexOf(tag);
      if (tag.tagName === "text")
        return (
          <Text
            key={index}
            style={paragraph}
            dangerouslySetInnerHTML={{ __html: tag.attributes.data }}
          ></Text>
        );
      else if (tag.tagName === "button")
        return (
          <Button key={index} style={button} href={tag.attributes.src}>
            {" "}
            {tag.attributes.data}{" "}
          </Button>
        );
    });
    return replacedTags;
  };

  const finalEmailText = () => {
    return (
      <Container style={{ ...container, height: "70%" }}>
        <Img
          src={`${import.meta.env.VITE_IIIT_LOGO}`}
          width="220"
          height="100"
          alt="IIIT Logo"
          style={logo}
        />

        {replaceDetails(tags)}

        <Hr style={hr} />
        <Container style={{ justifyContent: "center", alignItems: "center", textAlign: "center"}}>
          <Text style={{ ...footer, justifyContent: "center" }}>
            IIIT Hyderabad, Gachibowli, Hyderabad, Telangana, India - 500032
          </Text>
          <Container style={{ justifyContent: "center" }}>
            <a href={socials.facebook} style={{ color: "#8898aa" }}>
              <FacebookIcon style={social_logo} />
            </a>

            <a href={socials.twitter} style={{ color: "#8898aa" }}>
              <XIcon style={social_logo} />
            </a>

            <a href={socials.youtube} style={{ color: "#8898aa" }}>
              <YouTubeIcon style={social_logo} />
            </a>

            <a href={socials.linkedin} style={{ color: "#8898aa" }}>
              <LinkedInIcon style={social_logo} />
            </a>

            <a href={socials.instagram} style={{ color: "#8898aa" }}>
              <InstagramIcon style={social_logo} />
            </a>
          </Container>
          <Container style={{ justifyContent: "center" }}>
            <a href="https://www.iiit.ac.in/" style={{ color: "#3b5998" }}>
              www.iiit.ac.in
            </a>
          </Container>
        </Container>
      </Container>
    );
  };

  const finalText = finalEmailText();
  if (html) return renderToString(finalText);

  return finalText;
};

const TemplatePreviewer = ({ user, emailText, subject }) => {
  const emailPrettyText = getEmailText({ ...user }, emailText);
  const RenderedEmail = () => (
    <div style={{ height: "80%" }}>
      <Typography
        variant="h6"
        align="left"
        style={{ marginLeft: "30px", marginTop: "30px" }}
      >
        <b>Subject: </b> {subject}
      </Typography>

      {emailPrettyText}
    </div>
  );

  return <RenderedEmail />;
};

export default TemplatePreviewer;
export { getEmailText };