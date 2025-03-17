import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux/authSlice";
import * as yup from "yup";

function Login() {
  const [input, setInput] = useState({ email: "", password: "", role: "student" });
  const dispatch = useDispatch();
  const loading = useSelector((store) => store.auth.loading);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.open("https://jobhosting-backend.onrender.com/api/v1/user/auth/google", "_self");
  };

  const handleGitHubLogin = () => {
    window.open("https://jobhosting-backend.onrender.com/api/v1/user/auth/github", "_self");
  };

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Note: You have a yup schema reference but it's not defined in this component
      // I'll leave it as is, but you may need to define the schema
      await schema.validate(input, { abortEarly: false });
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, { withCredentials: true });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        error.errors.forEach((err) => toast.error(err));
      } else {
        console.error("Login Error:", error.response?.data || error);
        toast.error(error.response?.data?.message || "Login failed! Please try again.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={submitHandler} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="font-bold text-2xl mb-5 text-center">Login</h1>

        <div className="mb-4">
          <Label className="block mb-1">Email</Label>
          <input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            placeholder="example@gmail.com"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <Label className="block mb-1">Password</Label>
          <input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            placeholder="********"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-5">
          <Label className="block mb-2 font-medium">Select Role</Label>
          <select
            name="role"
            value={input.role}
            onChange={changeEventHandler}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {/* Google Login Button */}
        <Button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg mt-3 mb-3"
        >
          Login with Google
        </Button>

        {/* GitHub Login Button */}
        <Button
          type="button"
          onClick={handleGitHubLogin}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg"
        >
          Login with GitHub
        </Button>

        <div className="mt-3 text-center">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
