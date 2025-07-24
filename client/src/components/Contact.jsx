import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just simulate successful submission
    setSubmitted(true);
    // Future: send formData to backend API
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-800">Contact Us</h1>
      {!submitted ? (
        <>
          <p className="mb-4">
            We would love to hear from you! Please reach out to us with any questions, suggestions, or feedback.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
            <div>
              <label htmlFor="name" className="block mb-1 font-semibold">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-1 font-semibold">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </>
      ) : (
        <p className="text-green-600 font-semibold">Thank you for contacting us! We will get back to you soon.</p>
      )}
    </div>
  );
};

export default Contact;
