import React from "react";
import "./aboutSection.css";
import { Typography, Avatar } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
const About = () => {
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/drue2o0ju/image/upload/v1668245270/avatars/vj9z67nzycyvzdv7xbia.jpg"
              alt="Founder"
            />
            <Typography>Jevin Sutariya</Typography>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/drue2o0ju/image/upload/v1668254879/avatars/bsftiw7q0okufhtc7qpa.jpg"
              alt="Founder"
            />
            <Typography>Pratham Tailor</Typography>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/drue2o0ju/image/upload/v1668254879/avatars/bsftiw7q0okufhtc7qpa.jpg"
              alt="Founder"
            />
            <Typography>Omi Kakadiya</Typography>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Motive</Typography>
            <span>
              This is a sample wesbite made by team memeber @jevin08 @prathamTailor @omiKakadiya. Only with the
              purpose to teach MERN Stack.
            </span>

            <Typography component="h2">Our Brands</Typography>
            <a
              href="/#"
              target="blank"
            >
              <YouTubeIcon className="youtubeSvgIcon" />
            </a>

            <a href="/#" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
