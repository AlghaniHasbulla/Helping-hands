import React from 'react';

const Contact = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-800">Contact Us</h1>
      <p className="mb-4">
        We would love to hear from you! Please reach out to us with any questions, suggestions, or feedback.
      </p>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Email</h2>
        <p>contact@helpinghands.org</p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Phone</h2>
        <p>+1 (555) 123-4567</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-2">Address</h2>
        <p>123 Charity Lane, Kindness City, CA 90000</p>
      </section>
      <p className="mt-6 italic text-gray-600">
        (This content can be edited later to update contact details or add more ways to connect.)
      </p>
    </div>
  );
};

export default Contact;
