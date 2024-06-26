import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../api/apiService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function SignUpPage() {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      const data = await res.json();
      setSubmitting(false);
      if (res.ok && data.success) {
        navigate('/signin');
      } else {
        setErrors({ errorMessage: data.message || 'Signup failed. Please try again.' });
      }
    } catch (error) {
      setSubmitting(false);
      setErrors({ errorMessage: error.message || 'Signup failed. Please try again.' });
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4">Sign Up</h1>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          gender: ''
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string().email('Invalid email').required('Email is required'),
          password: Yup.string().required('Password is required'),
          gender: Yup.string().required('Gender is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">Name</label>
              <Field type="text" id="name" name="name" className="mt-1 p-2 w-full border rounded" />
              <ErrorMessage name="name" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <Field type="email" id="email" name="email" className="mt-1 p-2 w-full border rounded" />
              <ErrorMessage name="email" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <Field type="password" id="password" name="password" className="mt-1 p-2 w-full border rounded" />
              <ErrorMessage name="password" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Gender</label>
              <div className="mt-1">
                <label className="inline-flex items-center">
                  <Field type="radio" name="gender" value="male" className="form-radio" />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <Field type="radio" name="gender" value="female" className="form-radio" />
                  <span className="ml-2">Female</span>
                </label>
              </div>
              <ErrorMessage name="gender" component="div" className="text-red-500" />
            </div>
            {errors.errorMessage && <div className="text-red-500">{errors.errorMessage}</div>}
            <div className="mb-4">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mr-4" disabled={isSubmitting}>
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </button>
              <Link to="/signin" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300">Sign In</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignUpPage;
