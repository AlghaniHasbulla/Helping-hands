import React from 'react';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-800">About Helping Hands</h1>

      <section className="mb-8">
        <p>
          Helping Hands is an online charity management platform designed to connect donors with local charity organizations and NGOs in need. Our mission is to make giving easier, transparent, and impactful by providing a seamless way for donors to discover verified donation requests and contribute to causes they care about.
        </p>
      </section>

      <section className="mb-8">
        <p>
          For NGOs and charity organizations, Helping Hands offers a simple and effective way to request donations, manage their funding needs, and keep track of their donation history. Admins oversee the approval process to ensure that all requests are legitimate and meet community standards.
        </p>
      </section>

      <section className="mb-8">
        <p>
          Donors can browse through a curated list of approved donation requests, filter by categories such as food, clothing, education, and medical aid, and make donations securely through the platform. Donors also have access to their donation history and receipts for transparency and record-keeping.
        </p>
      </section>

      <section>
        <p>
          Helping Hands aims to empower communities by bridging the gap between those who want to help and those who need it most. Join us in making a difference, one donation at a time.
        </p>
      </section>
    </div>
  );
};

export default About;
