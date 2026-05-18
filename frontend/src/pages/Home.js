import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import Select from '../components/ui/Select';

const STATUS_META = {
  OPEN: {
    label: 'Open',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  MATCHED: {
    label: 'Matched',
    className: 'bg-sky-100 text-sky-800 border-sky-200'
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-violet-100 text-violet-800 border-violet-200'
  },
  CLOSED: {
    label: 'Closed',
    className: 'bg-slate-100 text-slate-700 border-slate-200'
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-rose-100 text-rose-800 border-rose-200'
  }
};

const getStatusMeta = (status) => {
  const key = String(status || '').toUpperCase();
  return STATUS_META[key] || {
    label: status || 'Unknown',
    className: 'bg-amber-100 text-amber-800 border-amber-200'
  };
};

const Home = () => {
  const { api, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const demoCenter = { lat: 12.9281, lng: 77.5838 };
  const [center, setCenter] = useState({ lat: 12.9716, lng: 77.5946 });
  const [markers, setMarkers] = useState([]);
  const [runs, setRuns] = useState([]);
  const [radius, setRadius] = useState(5);
  const [debouncedRadius, setDebouncedRadius] = useState(5);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPace: '',
    maxPace: '',
    minDistance: '',
    maxDistance: '',
    runningLevel: '',
    openOnly: true
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedRadius(radius), 450);
    return () => clearTimeout(timeoutId);
  }, [radius]);

  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading) {
        setLoading(false);
      }
      return;
    }

    const fetchNearby = async () => {
      setLoading(true);
      try {
        const users = await api.get(`/search/nearby-users?lat=${center.lat}&lng=${center.lng}&radius=${debouncedRadius}`);
        const params = new URLSearchParams({
          lat: center.lat,
          lng: center.lng,
          radius: debouncedRadius,
          openOnly: String(filters.openOnly)
        });

        if (filters.minPace) {
          params.set('minPace', filters.minPace);
        }
        if (filters.maxPace) {
          params.set('maxPace', filters.maxPace);
        }
        if (filters.minDistance) {
          params.set('minDistance', filters.minDistance);
        }
        if (filters.maxDistance) {
          params.set('maxDistance', filters.maxDistance);
        }
        if (filters.runningLevel) {
          params.set('runningLevel', filters.runningLevel);
        }

        const requests = await api.get(`/search/nearby-requests?${params.toString()}`);
        
        const userMarkers = users.data.map(u => ({
          id: `u-${u.id}`,
          position: { lat: u.location.lat, lng: u.location.lng },
          title: u.fullName,
          details: `${u.runningLevel} • ${u.averagePace} min/km`
        }));
        const reqMarkers = requests.data.map(r => ({
          id: `r-${r.id}`,
          position: { lat: r.meetingLocation.lat, lng: r.meetingLocation.lng },
          title: r.ownerName || 'Jog Request',
          details: `${r.distance} km • ${r.pace} min/km${r.runningLevel ? ` • ${r.runningLevel}` : ''}`,
          isRequest: true
        }));
        const requestRows = requests.data.map(r => ({
          id: r.id,
          distance: r.distance,
          pace: r.pace,
          status: r.status,
          notes: r.notes,
          runningLevel: r.runningLevel,
          ownerName: r.ownerName,
          ownerAveragePace: r.ownerAveragePace,
          meetingLocation: r.meetingLocation,
        }));

        setRuns(requestRows);
        setMarkers([...userMarkers, ...reqMarkers]);
      } catch (e) {
        toast.error('Failed to load map data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchNearby();
  }, [center, debouncedRadius, filters, api, authLoading, user]);

  return (
    <div className="rb-shell">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold md:text-4xl">Runners Nearby</h1>
          <p className="mt-1 text-sm text-ink-500">Discover runners and active jog requests around your location.</p>
        </div>

        <Card className="w-full md:w-[26rem]" strong>
          <label htmlFor="radius" className="mb-2 block text-sm font-semibold text-ink-700">
            Search radius: {radius} km
          </label>
          <input
            id="radius"
            type="range"
            min="1"
            max="10"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-coral-600"
          />
        </Card>
      </div>

      <Card className="mb-6 p-4" strong>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="min-pace" className="block text-sm font-semibold text-ink-700">Min pace (min/km)</label>
            <input
              id="min-pace"
              type="number"
              step="0.1"
              min="1"
              value={filters.minPace}
              onChange={(e) => setFilters((prev) => ({ ...prev, minPace: e.target.value }))}
              className="rb-focus-ring w-full rounded-soft border border-white/70 bg-white/85 px-4 py-3 text-ink-900"
              placeholder="4.5"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="max-pace" className="block text-sm font-semibold text-ink-700">Max pace (min/km)</label>
            <input
              id="max-pace"
              type="number"
              step="0.1"
              min="1"
              value={filters.maxPace}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxPace: e.target.value }))}
              className="rb-focus-ring w-full rounded-soft border border-white/70 bg-white/85 px-4 py-3 text-ink-900"
              placeholder="7.0"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="min-distance" className="block text-sm font-semibold text-ink-700">Min distance (km)</label>
            <input
              id="min-distance"
              type="number"
              step="0.5"
              min="1"
              value={filters.minDistance}
              onChange={(e) => setFilters((prev) => ({ ...prev, minDistance: e.target.value }))}
              className="rb-focus-ring w-full rounded-soft border border-white/70 bg-white/85 px-4 py-3 text-ink-900"
              placeholder="5"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="max-distance" className="block text-sm font-semibold text-ink-700">Max distance (km)</label>
            <input
              id="max-distance"
              type="number"
              step="0.5"
              min="1"
              value={filters.maxDistance}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxDistance: e.target.value }))}
              className="rb-focus-ring w-full rounded-soft border border-white/70 bg-white/85 px-4 py-3 text-ink-900"
              placeholder="15"
            />
          </div>
          <Select
            id="running-level-filter"
            label="Running level"
            value={filters.runningLevel}
            onChange={(e) => setFilters((prev) => ({ ...prev, runningLevel: e.target.value }))}
          >
            <option value="">All levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </Select>
          <div className="flex items-end">
            <label htmlFor="open-only" className="flex w-full cursor-pointer items-center gap-2 rounded-soft border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold text-ink-700">
              <input
                id="open-only"
                type="checkbox"
                checked={filters.openOnly}
                onChange={(e) => setFilters((prev) => ({ ...prev, openOnly: e.target.checked }))}
              />
              Show only open runs
            </label>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden p-3 md:p-4">
        {loading ? (
          <Skeleton className="h-[500px] w-full" />
        ) : (
          <>
            <MapComponent
              center={center}
              markers={markers}
              onMarkerClick={(marker) => {
                if (marker?.isRequest) {
                  navigate(`/request/${String(marker.id).replace('r-', '')}`);
                }
              }}
            />

            {runs.length === 0 && (
              <div className="mt-4 rounded-soft border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">No runs found in this area.</p>
                <p className="mt-1">Try increasing radius, posting a new request, or load Jayanagar demo location.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-soft border border-amber-300 bg-white px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                    onClick={() => setRadius((prev) => Math.min(10, prev + 2))}
                  >
                    Expand radius
                  </button>
                  <button
                    type="button"
                    className="rounded-soft bg-coral-600 px-4 py-2 text-xs font-semibold text-white hover:bg-coral-700"
                    onClick={() => navigate('/create-request')}
                  >
                    Create a run request
                  </button>
                  <button
                    type="button"
                    className="rounded-soft bg-ink-800 px-4 py-2 text-xs font-semibold text-white hover:bg-ink-900"
                    onClick={() => {
                      setCenter(demoCenter);
                      setRadius(10);
                      setDebouncedRadius(10);
                    }}
                  >
                    Load Jayanagar demo runs
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <div className="mt-6">
        <h2 className="text-2xl font-bold">Runs Available</h2>
        <p className="mt-1 text-sm text-ink-500">Select a run to center it on the map or open details.</p>

        {loading ? (
          <div className="mt-4 space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : runs.length === 0 ? (
          <Card className="mt-4 text-sm text-ink-600">No runs available for the current location and radius.</Card>
        ) : (
          <div className="mt-4 grid gap-3">
            {runs.map((run) => {
              const statusMeta = getStatusMeta(run.status);
              return (
                <Card key={run.id} className="p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-base font-semibold text-ink-900">Run #{run.id}</p>
                      <p className="text-sm text-ink-600">{run.distance} km • {run.pace} min/km</p>
                      {run.ownerName && <p className="text-xs text-ink-500">Hosted by: {run.ownerName}</p>}
                      {run.ownerAveragePace && <p className="text-xs text-ink-500">Host avg pace: {run.ownerAveragePace} min/km</p>}
                      {run.runningLevel && <p className="text-xs text-ink-500">Level: {run.runningLevel}</p>}
                      <span className={`mt-2 inline-flex items-center rounded-pill border px-2.5 py-1 text-xs font-semibold ${statusMeta.className}`}>
                        {statusMeta.label}
                      </span>
                      {run.notes && <p className="mt-1 text-sm text-ink-500">{run.notes}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-soft border border-ink-200 px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                        onClick={() => setCenter({ lat: run.meetingLocation.lat, lng: run.meetingLocation.lng })}
                      >
                        Locate on map
                      </button>
                      <button
                        type="button"
                        className="rounded-soft bg-coral-600 px-3 py-2 text-xs font-semibold text-white hover:bg-coral-700"
                        onClick={() => navigate(`/request/${run.id}`)}
                      >
                        View details
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;