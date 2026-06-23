import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { api } from '../../utils/api';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        setError(null);
        setLoading(true);
        const res = await api.post('/user/login', values);
        localStorage.setItem('token', res.token);
        dispatch(login(res.data));
        navigate('/');
      } catch (err) {
        setError(err.message || 'Login failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-xl border border-red-100 font-medium">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div className="relative">
          <label className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-1.5 block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              className={`w-full bg-gray-50 border ${formik.touched.email && formik.errors.email ? 'border-red-400' : 'border-gray-200'} rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
              {...formik.getFieldProps('email')}
            />
          </div>
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-xs mt-1 ml-1">{formik.errors.email}</div>
          ) : null}
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] uppercase tracking-widest text-primary font-semibold block">Password</label>
            <Link to="/forgot-password" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-primary transition-colors font-medium">Forgot?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className={`w-full bg-gray-50 border ${formik.touched.password && formik.errors.password ? 'border-red-400' : 'border-gray-200'} rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
              {...formik.getFieldProps('password')}
            />
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-xs mt-1 ml-1">{formik.errors.password}</div>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-4 rounded-xl font-semibold tracking-widest uppercase text-xs hover:bg-primary-dk shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={16} />
      </button>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          New to Veadya?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">Create Account</Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
