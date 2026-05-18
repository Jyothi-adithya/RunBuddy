import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

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

const RunHistory = () => {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [postingRunId, setPostingRunId] = useState(null);

  const toDateTimeLocal = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
  };

  const buildRepostQuery = (run) => {
    const params = new URLSearchParams();
    params.set('sourceRunId', String(run.id));
    params.set('distance', String(run.distance ?? ''));
    params.set('pace', String(run.pace ?? ''));
    params.set('notes', String(run.notes ?? ''));
    params.set('dateTime', toDateTimeLocal(run.dateTime));
    if (run.meetingLocation?.lat != null) {
      params.set('lat', String(run.meetingLocation.lat));
    }
    if (run.meetingLocation?.lng != null) {
      params.set('lng', String(run.meetingLocation.lng));
    }
    return params.toString();
  };

  const toApiDateTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      const fallback = new Date(Date.now() + 24 * 60 * 60 * 1000);
      return fallback.toISOString().slice(0, 19);
    }
    return new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 19);
  };

  const duplicateAndPost = async (run) => {
    const confirmed = window.confirm(`Create a new run by duplicating Run #${run.id}?`);
    if (!confirmed) {
      return;
    }

    setPostingRunId(run.id);
    try {
      const payload = {
        dateTime: toApiDateTime(run.dateTime),
        distance: run.distance,
        pace: run.pace,
        notes: run.notes || '',
        meetingLocation: run.meetingLocation || { lat: 12.9716, lng: 77.5946 }
      };

      await api.post('/requests', payload);
      toast.success('Run duplicated and posted successfully.');

      const params = new URLSearchParams({ limit: '40' });
      if (statusFilter) {
        params.set('status', statusFilter);
      }
      const refreshed = await api.get(`/search/run-history?${params.toString()}`);
      setRuns(refreshed.data || []);
    } catch (err) {
      toast.error('Unable to duplicate and post this run right now.');
    } finally {
      setPostingRunId(null);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: '40' });
        if (statusFilter) {
          params.set('status', statusFilter);
        }

        const res = await api.get(`/search/run-history?${params.toString()}`);
        setRuns(res.data || []);
      } catch (err) {
        toast.error('Unable to load run history right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [api, statusFilter]);

  const totals = runs.reduce(
    (acc, run) => {
      const statusKey = String(run.status || '').toUpperCase();
      acc.total += 1;
      if (statusKey === 'OPEN') {
        acc.open += 1;
      }
      if (statusKey === 'COMPLETED') {
        acc.completed += 1;
      }
      if (statusKey === 'CLOSED') {
        acc.closed += 1;
      }
      return acc;
    },
    { total: 0, open: 0, completed: 0, closed: 0 }
  );

  return (
    <div className="rb-shell max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold">Run History</h1>
        <p className="mt-1 text-sm text-ink-500">Review your previous and upcoming requests in one timeline.</p>
      </div>

      <Card className="mb-4 p-4" strong>
        <div className="grid gap-3 md:grid-cols-2">
          <Select
            id="history-status-filter"
            label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="MATCHED">Matched</option>
            <option value="COMPLETED">Completed</option>
            <option value="CLOSED">Closed</option>
            <option value="CANCELLED">Cancelled</option>
          </Select>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <div className="rounded-soft border border-white/70 bg-white/70 p-3 text-center">
              <p className="text-xs font-semibold text-ink-500">Total</p>
              <p className="text-lg font-extrabold text-ink-900">{totals.total}</p>
            </div>
            <div className="rounded-soft border border-emerald-200 bg-emerald-50 p-3 text-center">
              <p className="text-xs font-semibold text-emerald-700">Open</p>
              <p className="text-lg font-extrabold text-emerald-900">{totals.open}</p>
            </div>
            <div className="rounded-soft border border-violet-200 bg-violet-50 p-3 text-center">
              <p className="text-xs font-semibold text-violet-700">Completed</p>
              <p className="text-lg font-extrabold text-violet-900">{totals.completed}</p>
            </div>
            <div className="rounded-soft border border-slate-200 bg-slate-50 p-3 text-center">
              <p className="text-xs font-semibold text-slate-700">Closed</p>
              <p className="text-lg font-extrabold text-slate-900">{totals.closed}</p>
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : runs.length === 0 ? (
        <Card className="text-center text-ink-600">
          <p className="font-semibold text-ink-800">No run history yet.</p>
          <p className="mt-1 text-sm">Create your first run request to start building activity here.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {runs.map((run) => {
            const statusMeta = getStatusMeta(run.status);
            return (
              <Card key={run.id} className="p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-ink-900">Run #{run.id}</p>
                    <p className="text-sm text-ink-600">
                      {run.distance} km • {run.pace} min/km • {new Date(run.dateTime).toLocaleString()}
                    </p>
                    {run.notes && <p className="mt-1 text-sm text-ink-500">{run.notes}</p>}
                  </div>
                  <span className={`inline-flex items-center rounded-pill border px-2.5 py-1 text-xs font-semibold ${statusMeta.className}`}>
                    {statusMeta.label}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/request/${run.id}`)}
                  >
                    View details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      const query = buildRepostQuery(run);
                      navigate(`/create-request?${query}`, {
                        state: {
                          prefill: {
                            sourceRunId: run.id,
                            distance: run.distance ?? '',
                            pace: run.pace ?? '',
                            notes: run.notes ?? '',
                            dateTime: toDateTimeLocal(run.dateTime),
                            meetingLocation: run.meetingLocation || null
                          }
                        }
                      });
                    }}
                  >
                    Repost similar run
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    loading={postingRunId === run.id}
                    disabled={postingRunId !== null && postingRunId !== run.id}
                    onClick={() => duplicateAndPost(run)}
                  >
                    {postingRunId === run.id ? 'Posting duplicate...' : 'Duplicate + Post'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RunHistory;
