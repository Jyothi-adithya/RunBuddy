import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError('Invalid credentials. Please verify your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rb-shell flex min-h-[calc(100vh-76px)] items-center justify-center">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-extrabold">Welcome Back</h2>
            <p className="text-sm text-ink-500">Sign in and find your next run partner.</p>
          </div>

          <Input
            id="login-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="login-password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={error}
          />

          <Button type="submit" className="w-full" loading={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;