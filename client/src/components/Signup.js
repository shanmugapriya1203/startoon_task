import React, { useState } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { BASE_URL } from '../api/apiService';
function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: ''
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()


  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok && data.success) {
        navigate('/signin');
      } else {
        setErrorMessage(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message || 'Signup failed. Please try again.');
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 p-2 w-full border rounded" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 w-full border rounded" />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 p-2 w-full border rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Gender</label>
          <div className="mt-1">
            <label className="inline-flex items-center">
              <input type="radio" className="form-radio" name="gender" value="male" onChange={handleChange} />
              <span className="ml-2">Male</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input type="radio" className="form-radio" name="gender" value="female" onChange={handleChange} />
              <span className="ml-2">Female</span>
            </label>
          </div>
        </div>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        <div className="mb-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mr-4" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <Link to="/signin" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300">Sign In</Link>
        </div>
      </form>
    </div>
  );
}

export default SignUpPage;

