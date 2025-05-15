import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Database, Lock, Eye, EyeOff, ChevronDown, ChevronUp, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { query } from "./../../../server/src/lib/db"; // Import your PostgreSQL query function
import { sendPasswordResetEmail } from '../lib/email';
import crypto from 'crypto';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoAccount, setShowDemoAccount] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    forgotEmail: '',
    username: '',
    name: '',
    registerEmail: '',
    registerPassword: '',
    confirmPassword: ''
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors = {
      email: email ? '' : 'Email is required',
      password: password ? '' : 'Password is required'
    };
    
    if (email && !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return !Object.values(newErrors).some(error => error);
  };

  const validateRegisterForm = (): boolean => {
    const newErrors = {
      username: registerData.username ? '' : 'Username is required',
      name: registerData.name ? '' : 'Name is required',
      email: registerData.email ? '' : 'Email is required',
      password: registerData.password ? '' : 'Password is required',
      confirmPassword: registerData.confirmPassword ? '' : 'Confirm password is required'
    };
    
    if (registerData.email && !validateEmail(registerData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (registerData.password && registerData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (registerData.password && registerData.confirmPassword && 
        registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await query(
        `SELECT id, username, name, email, is_active 
         FROM users 
         WHERE email = $1 
         AND password_hash = crypt($2, password_hash) 
         AND is_active = true`,
        [email, password]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid email or password');
      }

      const user = result.rows[0];
      
      await query(
        'UPDATE users SET last_login = NOW() WHERE id = $1',
        [user.id]
      );

      if (login) {
        await login(user.email, user.password);
      }
      
      toast.success('Successfully logged in');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Invalid email or password');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rest of the component implementation remains the same...
  // [Previous JSX implementation would go here]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Previous JSX implementation */}
    </div>
  );
};

export default Login;
