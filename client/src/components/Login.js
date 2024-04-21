import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../api/apiService';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../Redux/user/userSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function LoginPage() {
  const { loading, error: errorMessage } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      dispatch(signInStart());
      const res = await fetch(`${BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      const data = await res.json();

      if (res.ok && data.access_token) {
        dispatch(signInSuccess(data));
        navigate('/');
      } else {
        dispatch(signInFailure(data.message || 'Sign in failed'));
      }
    } catch (error) {
      dispatch(signInFailure('An error occurred'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4">Sign In</h1>
      {errorMessage && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          {errorMessage}
        </div>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="max-w-md mx-auto">
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
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mr-4" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <Link to="/signup" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300">Sign Up</Link>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default LoginPage;
