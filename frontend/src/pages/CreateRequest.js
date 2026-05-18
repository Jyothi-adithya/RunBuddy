import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import MapComponent from '../components/MapComponent';

const CreateRequest = () => {
  const [form, setForm] = useState({ dateTime: '', distance: '', pace: '', notes: '' });
  const [center, setCenter] = useState({ lat: 12.9716, lng: 77.5946 });
  const [meetingLocation, setMeetingLocation] = useState({ lat: 12.9716, lng: 77.5946 });
  const [prefillSourceRunId, setPrefillSourceRunId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { api } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(current);
        setMeetingLocation(current);
      },
      () => {
        // Keep default Bangalore center when geolocation is unavailable.
      }
    );
  }, []);

  useEffect(() => {
    const statePrefill = location.state?.prefill;
    const query = new URLSearchParams(location.search);

    const queryLat = Number(query.get('lat'));
    const queryLng = Number(query.get('lng'));

    const resolvedForm = {
      dateTime: statePrefill?.dateTime ?? query.get('dateTime') ?? '',
      distance: statePrefill?.distance ?? query.get('distance') ?? '',
      pace: statePrefill?.pace ?? query.get('pace') ?? '',
      notes: statePrefill?.notes ?? query.get('notes') ?? ''
    };

    const stateLocation = statePrefill?.meetingLocation;
    const resolvedLocation = stateLocation && stateLocation.lat != null && stateLocation.lng != null
      ? { lat: Number(stateLocation.lat), lng: Number(stateLocation.lng) }
      : (!Number.isNaN(queryLat) && !Number.isNaN(queryLng)
          ? { lat: queryLat, lng: queryLng }
          : null);

    if (resolvedForm.dateTime || resolvedForm.distance || resolvedForm.pace || resolvedForm.notes) {
      setForm(resolvedForm);
    }

    if (resolvedLocation) {
      setMeetingLocation(resolvedLocation);
      setCenter(resolvedLocation);
    }

    const sourceRunId = statePrefill?.sourceRunId ?? query.get('sourceRunId');
    if (sourceRunId) {
      setPrefillSourceRunId(sourceRunId);
    }
  }, [location.search, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/requests', {
        ...form,
        meetingLocation
      });
      toast.success('Request posted. Runners nearby can now respond.');
      navigate('/home');
    } catch (err) {
      toast.error('Failed to post request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rb-shell max-w-2xl">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold">Create Jog Request</h2>
        <p className="mt-2 text-sm text-ink-500">Share your run details and invite nearby runners to join.</p>
      </div>

      {prefillSourceRunId && (
        <Card className="mb-4 border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
          Prefilled from Run #{prefillSourceRunId}. Adjust details if needed and post when ready.
        </Card>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="request-datetime"
            label="Date and time"
            type="datetime-local"
            value={form.dateTime}
            onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
            required
          />

          <Input
            id="request-distance"
            label="Distance (km)"
            type="number"
            placeholder="5"
            value={form.distance}
            onChange={(e) => setForm({ ...form, distance: e.target.value })}
            required
          />

          <Input
            id="request-pace"
            label="Pace (min/km)"
            type="number"
            step="0.1"
            placeholder="6.2"
            value={form.pace}
            onChange={(e) => setForm({ ...form, pace: e.target.value })}
            required
          />

          <Textarea
            id="request-notes"
            label="Notes"
            placeholder="Optional details like meetup point or route preference"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={5}
          />

          <div className="space-y-3">
            <p className="text-sm font-semibold text-ink-700">Select meetup location on map</p>
            <MapComponent
              center={center}
              markers={[]}
              selectedPosition={meetingLocation}
              onMapClick={(position) => setMeetingLocation(position)}
            />
            <p className="text-xs text-ink-500">
              Selected coordinates: {meetingLocation.lat.toFixed(5)}, {meetingLocation.lng.toFixed(5)}
            </p>
          </div>

          <Button type="submit" className="w-full" loading={isSubmitting}>
            {isSubmitting ? 'Posting request...' : 'Post request'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateRequest;