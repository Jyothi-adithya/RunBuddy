import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';

const Settings = () => {
  const { api } = useAuth();
  const [privacy, setPrivacy] = useState('APPROXIMATE');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/profiles/me');
        setPrivacy(res.data.privacyLevel);
        setEmergencyContact(res.data.emergencyContact || '');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [api]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      await api.put('/profiles/me', { privacyLevel: privacy, emergencyContact });
      toast.success('Settings saved.');
    } catch (err) {
      toast.error('Unable to save settings right now.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rb-shell max-w-2xl">
      <h1 className="mb-6 text-3xl font-extrabold">Settings</h1>

      <Card className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            <Select
              id="privacy"
              label="Location privacy"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
            >
              <option value="EXACT">Show exact location</option>
              <option value="APPROXIMATE">Show approximate location (recommended)</option>
            </Select>

            <Input
              id="emergency-contact"
              label="Emergency contact"
              type="tel"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="+91 98765 43210"
            />

            <Button className="w-full" onClick={saveSettings} loading={saving}>
              {saving ? 'Saving settings...' : 'Save settings'}
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default Settings;