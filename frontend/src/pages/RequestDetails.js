import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';

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

const RequestDetails = () => {
  const { id } = useParams();
  const { api } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [responses, setResponses] = useState([]);
  const [ownerSummary, setOwnerSummary] = useState(null);
  const [responderSummaries, setResponderSummaries] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/requests/${id}`);
        setRequest(res.data);
        setResponses(res.data.responses || []);

        if (res.data.userId) {
          try {
            const owner = await api.get(`/profiles/${res.data.userId}/summary`);
            setOwnerSummary(owner.data);
          } catch (e) {
            setOwnerSummary(null);
          }
        }

        const responderIds = [...new Set((res.data.responses || []).map((r) => r.responderId).filter(Boolean))];
        if (responderIds.length > 0) {
          const summaryPairs = await Promise.all(
            responderIds.map(async (responderId) => {
              try {
                const summary = await api.get(`/profiles/${responderId}/summary`);
                return [responderId, summary.data];
              } catch (e) {
                return [responderId, null];
              }
            })
          );
          setResponderSummaries(Object.fromEntries(summaryPairs));
        } else {
          setResponderSummaries({});
        }
      } catch (err) {
        toast.error('Request not found');
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id, api, navigate]);

  const respond = async () => {
    setSubmitting(true);
    try {
      await api.post(`/requests/${id}/respond`);
      toast.success('Response sent. Waiting for owner confirmation.');
      const res = await api.get(`/requests/${id}`);
      setResponses(res.data.responses || []);

      const responderIds = [...new Set((res.data.responses || []).map((r) => r.responderId).filter(Boolean))];
      if (responderIds.length > 0) {
        const summaryPairs = await Promise.all(
          responderIds.map(async (responderId) => {
            try {
              const summary = await api.get(`/profiles/${responderId}/summary`);
              return [responderId, summary.data];
            } catch (e) {
              return [responderId, null];
            }
          })
        );
        setResponderSummaries(Object.fromEntries(summaryPairs));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const accept = async (responseId) => {
    await api.put(`/requests/${id}/accept/${responseId}`);
    toast.success('Run scheduled.');
    navigate(`/chat/${request.userId}`);
  };

  const reject = async (responseId) => {
    await api.put(`/requests/${id}/reject/${responseId}`);
    toast.info("Response rejected");
    // Refresh
    const res = await api.get(`/requests/${id}`);
    setResponses(res.data.responses || []);

    const responderIds = [...new Set((res.data.responses || []).map((r) => r.responderId).filter(Boolean))];
    if (responderIds.length > 0) {
      const summaryPairs = await Promise.all(
        responderIds.map(async (responderId) => {
          try {
            const summary = await api.get(`/profiles/${responderId}/summary`);
            return [responderId, summary.data];
          } catch (e) {
            return [responderId, null];
          }
        })
      );
      setResponderSummaries(Object.fromEntries(summaryPairs));
    }
  };

  if (loading) {
    return (
      <div className="rb-shell max-w-3xl space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (!request) return null;

  const statusMeta = getStatusMeta(request.status);

  return (
    <div className="rb-shell max-w-3xl">
      <h1 className="mb-6 text-3xl font-extrabold">Jog Request Details</h1>

      <Card className="mb-8 space-y-2">
        <div>
          <span className={`inline-flex items-center rounded-pill border px-2.5 py-1 text-xs font-semibold ${statusMeta.className}`}>
            {statusMeta.label}
          </span>
        </div>
        <p className="text-lg"><strong>Date and time:</strong> {new Date(request.dateTime).toLocaleString()}</p>
        <p className="text-lg"><strong>Distance:</strong> {request.distance} km</p>
        <p className="text-lg"><strong>Pace:</strong> {request.pace} min/km</p>
        <p className="text-lg"><strong>Notes:</strong> {request.notes || 'No notes'}</p>
        {ownerSummary && (
          <div className="mt-3 rounded-soft border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
            <p className="font-semibold">Hosted by {ownerSummary.displayName}</p>
            <p className="mt-1">
              {ownerSummary.runningLevel || 'Level not set'}
              {ownerSummary.averagePace ? ` • Avg pace ${ownerSummary.averagePace} min/km` : ''}
              {ownerSummary.preferredDistance ? ` • Prefers ${ownerSummary.preferredDistance} km` : ''}
            </p>
          </div>
        )}
      </Card>

      <h2 className="mb-4 text-xl font-bold">Responses ({responses.length})</h2>
      {responses.length === 0 ? (
        <Card className="space-y-3 text-ink-600">
          <p className="font-semibold text-ink-800">No responses yet.</p>
          <p className="text-sm">You can share this run with friends or keep it open while nearby runners discover it.</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="ghost" onClick={() => navigate('/home')}>
              Back to nearby runs
            </Button>
            {request.isOwner && (
              <Button size="sm" onClick={() => navigate('/create-request')}>
                Create another request
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {responses.map((r) => (
            <Card key={r.id} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-ink-900">{responderSummaries[r.responderId]?.displayName || `Runner #${r.responderId}`}</p>
                <p className="text-xs text-ink-500">
                  {responderSummaries[r.responderId]?.runningLevel || 'Level not set'}
                  {responderSummaries[r.responderId]?.averagePace ? ` • Avg pace ${responderSummaries[r.responderId].averagePace} min/km` : ''}
                </p>
                <p className="text-sm text-ink-500">Status: {r.status}</p>
              </div>
              {request.isOwner && r.status === 'PENDING' && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => accept(r.id)}>Accept</Button>
                  <Button size="sm" variant="danger" onClick={() => reject(r.id)}>Reject</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {!request.isOwner && (
        <Button className="mt-6 w-full" onClick={respond} loading={submitting}>
          {submitting ? 'Sending response...' : "I'm interested - respond now"}
        </Button>
      )}
    </div>
  );
};

export default RequestDetails;