import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';

const Profile = () => {
  const { api, loading: authLoading, user } = useAuth();
  const [profile, setProfile] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const trustSignals = [
    Boolean(profile.fullName),
    Boolean(profile.runningLevel),
    Boolean(profile.averagePace),
    Boolean(profile.preferredDistance),
    Boolean(profile.emergencyContact)
  ];
  const trustScore = Math.round((trustSignals.filter(Boolean).length / trustSignals.length) * 100);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get('/profiles/me');
        setProfile(res.data);
      } catch (err) {
        toast.error('Unable to load your profile right now.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [api, authLoading, user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/profiles/me', profile);
      setEditing(false);
      toast.success('Profile updated successfully.');
    } catch (err) {
      toast.error('Failed to save profile updates.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rb-shell max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold">My Profile</h1>
        {!loading && (
          <Button variant="secondary" size="sm" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        )}
      </div>

      <Card>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : (
          <>
            <div className="mb-7 border-b border-white/60 pb-5">
              <h2 className="text-2xl font-bold">{profile.fullName || 'Runner'}</h2>
              <p className="mt-1 text-sm text-ink-500">Keep your profile up to date so matching becomes more accurate.</p>
            </div>

            {editing ? (
              <div className="space-y-5">
                <Input
                  id="profile-fullName"
                  label="Full name"
                  value={profile.fullName || ''}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="Your full name"
                />
                <Input
                  id="profile-dob"
                  label="Date of birth"
                  type="date"
                  value={profile.dateOfBirth || ''}
                  onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                />
                <Select
                  id="profile-level"
                  label="Running level"
                  value={profile.runningLevel || ''}
                  onChange={(e) => setProfile({ ...profile, runningLevel: e.target.value })}
                >
                  <option value="">Select level</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </Select>
                <Input
                  id="profile-pace"
                  label="Average pace (min/km)"
                  type="number"
                  step="0.1"
                  value={profile.averagePace || ''}
                  onChange={(e) => setProfile({ ...profile, averagePace: e.target.value })}
                  placeholder="6.0"
                />
                <Button className="w-full" onClick={handleSave} loading={saving}>
                  {saving ? 'Saving changes...' : 'Save changes'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 text-base md:text-lg">
                <p><strong>Level:</strong> {profile.runningLevel || 'Not set'}</p>
                <p><strong>Pace:</strong> {profile.averagePace ? `${profile.averagePace} min/km` : 'Not set'}</p>
                <p><strong>Preferred distance:</strong> {profile.preferredDistance ? `${profile.preferredDistance} km` : 'Not set'}</p>

                <Card className="border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
                  <p className="font-semibold">Trust Snapshot</p>
                  <p className="mt-1">Profile completeness: {trustScore}%</p>
                  <p className="mt-1">Privacy level: {profile.privacyLevel || 'APPROXIMATE'}</p>
                  <p className="mt-1">Emergency contact: {profile.emergencyContact ? 'Added' : 'Missing'}</p>
                </Card>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default Profile;