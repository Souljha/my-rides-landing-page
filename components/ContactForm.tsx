
import React, { useState } from 'react';

type FormState = {
  name: string;
  surname: string;
  email: string;
  contactNumber: string;
};

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    surname: '',
    email: '',
    contactNumber: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = (): boolean => {
      const newErrors: Partial<FormState> = {};
      if (!formData.name) newErrors.name = 'Name is required.';
      if (!formData.surname) newErrors.surname = 'Surname is required.';
      if (!formData.email) {
          newErrors.email = 'Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid.';
      }
      if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required.';
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
        return;
    }

    setStatus('submitting');
    console.log('Form data submitted:', formData);

    try {
      // Call the Vapi webhook to initiate phone call
      const response = await fetch('/api/zapier-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.name} ${formData.surname}`,
          phone: formData.contactNumber,
          email: formData.email,
          interested_service: 'General Inquiry',
          preferred_time: 'As soon as possible',
          message: 'Contact form submission from landing page'
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Vapi call initiated:', result);
        setStatus('success');
        // Reset form after a delay
        setTimeout(() => {
          setStatus('idle');
          setFormData({ name: '', surname: '', email: '', contactNumber: '' });
        }, 5000);
      } else {
        console.error('Failed to initiate call:', result);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="py-20 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white">Get In Touch</h2>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Have questions or need support? Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-2xl">
          {status === 'success' ? (
            <div className="text-center p-8">
                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h3 className="text-2xl font-bold text-gray-800 mt-4">Thank You!</h3>
              <p className="text-gray-600 mt-2">Riley from My Rides will call you shortly to assist with your inquiry!</p>
            </div>
          ) : status === 'error' ? (
            <div className="text-center p-8">
                <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h3 className="text-2xl font-bold text-gray-800 mt-4">Oops!</h3>
              <p className="text-gray-600 mt-2">Something went wrong. Please try again or contact us directly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary-dark focus:border-primary-dark`} required />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.surname ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary-dark focus:border-primary-dark`} required />
                  {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary-dark focus:border-primary-dark`} required />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="mb-8">
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={`w-full px-4 py-2 border ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary-dark focus:border-primary-dark`} required />
                {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
              </div>
              <div>
                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full bg-primary text-secondary font-bold py-3 px-6 rounded-md text-lg hover:bg-primary-dark transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {status === 'submitting' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactForm;