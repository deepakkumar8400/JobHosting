import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: '',
    role: '',
  });
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate('/');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Login
          </h1>

          {/* Email Input */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </Label>
            <RadioGroup
              value={input.role}
              onValueChange={(value) => setInput({ ...input, role: value })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recruiter" id="recruiter" />
                <Label htmlFor="recruiter">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Login'
            )}
          </Button>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;