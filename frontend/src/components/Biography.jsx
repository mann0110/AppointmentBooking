import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <p>Biography</p>
          <h3>Who We Are</h3>
          <p>
            Neelam Hospital is a state-of-the-art healthcare facility committed to delivering excellence in medical services. With a team of highly skilled professionals, we provide compassionate and personalized care to patients from all walks of life.Our hospital is equipped with modern technology and innovative medical practices, ensuring the highest standards of diagnosis, treatment, and recovery. At Neelam Hospital, we prioritize patient well-being, offering a wide range of specialized services tailored to individual needs.
          </p>
          <p>We are all in 2024!</p>
          <p>We are working on a MERN STACK PROJECT.</p>
          <p>
            We believe in creating a nurturing environment that fosters health and healing. Whether you’re visiting for routine care or advanced medical procedures, our dedicated staff ensures your journey towards better health is seamless and comfortable.

At Neelam Hospital, your health is our mission.
          </p>
          <p>Lorem ipsum dolor sit amet!</p>
          <p>Coding is fun!</p>
        </div>
      </div>
    </>
  );
};

export default Biography;
