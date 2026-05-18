import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await signup(username, email, password);
      navigate('/home');
    } catch (err) {
      setError('Signup failed. Try a different email or username.');
      toast.error("Signup failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rb-shell flex min-h-[calc(100vh-76px)] items-center justify-center">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-extrabold">Create your account</h2>
            <p className="text-sm text-ink-500">Build your runner profile and connect nearby.</p>
          </div>

          <Input
            id="signup-username"
            label="Username"
            placeholder="runner_name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input
            id="signup-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="signup-password"
            label="Password"
            type="password"
            placeholder="Create a secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={error}
          />

          <Button type="submit" className="w-full" loading={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Signup;