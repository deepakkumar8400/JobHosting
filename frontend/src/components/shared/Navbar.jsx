import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

// Reusable NavLink Component
const NavLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-gray-700 hover:text-gray-900 transition-colors duration-300"
    >
      {children}
    </Link>
  </li>
);

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate('/');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        {/* Brand Logo */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Job<span className="text-[#F83002]">Portal</span>
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {user && user.role === 'recruiter' ? (
              <>
                <NavLink to="/admin/companies">Companies</NavLink>
                <NavLink to="/admin/jobs">Jobs</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/jobs">Jobs</NavLink>
                <NavLink to="/browse">Browse</NavLink>
              </>
            )}
          </ul>

          {/* Auth Buttons or User Avatar */}
          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline" className="hover:bg-gray-100">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage src={user?.profile?.profilePhoto} alt="Profile" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user?.profile?.profilePhoto} alt="Profile" />
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-gray-800">{user?.fullname}</h4>
                      <p className="text-sm text-gray-500">{user?.profile?.bio}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {user && user.role === 'student' && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link to="/profile" className="flex items-center gap-2">
                          <User2 className="w-4 h-4" />
                          <span>View Profile</span>
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={logoutHandler}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;