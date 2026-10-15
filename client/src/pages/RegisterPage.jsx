import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validatePassword } from '../utils/passwordValidation';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Real-time password evaluation
  const { valid, rules } = validatePassword(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!valid) {
      setError('Please satisfy all password security requirements before registering.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      await register({ name, email, password });
      navigate('/login', {
        state: { message: 'Account created successfully! Please sign in.' },
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Your Account</h2>

      {error && (
        <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 py-1.5 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
          />
        </div>

        {/* Password Input & Checklist */}
        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 py-1.5 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
          />

          {/* Live Checklist */}
          <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-100">
            <p className="text-xs font-semibold text-gray-600 mb-2">Password Requirements:</p>
            <div className="space-y-1 text-xs">
              <ChecklistItem isMet={rules.minLength} label="At least 8 characters long" />
              <ChecklistItem isMet={rules.hasUpper} label="At least one uppercase letter (A-Z)" />
              <ChecklistItem isMet={rules.hasLower} label="At least one lowercase letter (a-z)" />
              <ChecklistItem isMet={rules.hasNumber} label="At least one number (0-9)" />
              <ChecklistItem isMet={rules.hasSpecial} label="At least one special character (!@#\$%...)" />
            </div>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 py-1.5 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !valid}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium transition-colors"
        >
          {submitting ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

function ChecklistItem({ isMet, label }) {
  return (
    <div className={`flex items-center gap-2 ${isMet ? 'text-teal-700 font-medium' : 'text-gray-500'}`}>
      <span
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] text-white font-bold ${
          isMet ? 'bg-teal-600' : 'bg-gray-300'
        }`}
      >
        {isMet ? '✓' : '✕'}
      </span>
      <span>{label}</span>
    </div>
  );
}