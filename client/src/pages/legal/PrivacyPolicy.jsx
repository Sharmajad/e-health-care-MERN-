import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold text-teal-600 mb-6">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-8">Last Updated: May 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
          <p className="text-gray-600 leading-relaxed">
            Welcome to Svasthya Connect. We are committed to protecting your personal and medical information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li><strong>Personal Identity:</strong> Name, age, gender, and contact details.</li>
            <li><strong>Health Data:</strong> Medical history, symptoms, and uploaded medical reports.</li>
            <li><strong>Location:</strong> Used to find nearby hospitals and emergency services in Jharkhand.</li>
            <li><strong>Account Data:</strong> Login credentials and appointment history.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">3. How We Use Your Data</h2>
          <p className="text-gray-600 leading-relaxed">
            Your data is used to provide AI-powered health recommendations, facilitate doctor appointments, and improve our emergency response services. We do not sell your personal health information to third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Data Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement industry-standard encryption and security measures to protect your data. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Contact Us</h2>
          <p className="text-gray-600">
            If you have questions about this policy, contact us at sharmajad@gmail.com or visit our office in Jamshedpur, Jharkhand.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
