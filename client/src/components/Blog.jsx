import React from 'react';

const Blog = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-800">Helping Hands Blog</h1>
      <p className="mb-4">
        Welcome to the Helping Hands blog, where we share stories, updates, and insights about our charity work and the impact we are making together.
      </p>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Latest News</h2>
        <p>
          Stay informed about upcoming events, new donation campaigns, and success stories from the communities we serve.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Donor Spotlights</h2>
        <p>
          Learn about our generous donors and how their contributions are making a difference.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-2">How You Can Help</h2>
        <p>
          Tips and guides on how to get involved, donate, and support local charities effectively.
        </p>
      </section>
    </div>
  );
};

export default Blog;
