import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

const BASE_POLL_MS = 5000;
const MAX_BACKOFF_MS = 30000;

const STATUS_META = {
  connecting: {
    label: 'Connecting',
    className: 'border-amber-200 bg-amber-50 text-amber-900'
  },
  online: {
    label: 'Live',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-900'
  },
  reconnecting: {
    label: 'Reconnecting',
    className: 'border-sky-200 bg-sky-50 text-sky-900'
  },
  offline: {
    label: 'Offline',
    className: 'border-rose-200 bg-rose-50 text-rose-900'
  }
};

const dedupeNotifications = (items) => {
  const bucket = new Map();
  (items || []).forEach((item) => {
    bucket.set(item.id, item);
  });
  return [...bucket.values()].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const inferNotificationAction = (notification) => {
  const text = String(notification?.content || '').toLowerCase();

  if (text.includes('chat') || text.includes('message')) {
    return { label: 'Open chats', path: '/history' };
  }
  if (text.includes('accepted') || text.includes('response') || text.includes('request') || text.includes('run')) {
    return { label: 'Open run history', path: '/history' };
  }
  if (text.includes('profile')) {
    return { label: 'Open profile', path: '/profile' };
  }
  return { label: 'Open home', path: '/home' };
};

const Notifications = () => {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [nextRetryMs, setNextRetryMs] = useState(BASE_POLL_MS);

  const pollTimerRef = useRef(null);
  const inFlightRef = useRef(false);
  const failureCountRef = useRef(0);
  const unmountedRef = useRef(false);
  const notificationsRef = useRef([]);
  const manualRefreshRef = useRef(async () => {});

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  useEffect(() => {
    unmountedRef.current = false;
    failureCountRef.current = 0;
    setConnectionStatus('connecting');
    setNextRetryMs(BASE_POLL_MS);

    const scheduleNextPoll = (delay) => {
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
      if (unmountedRef.current) {
        return;
      }
      setNextRetryMs(delay);
      pollTimerRef.current = setTimeout(() => {
        void refreshNotifications(false);
      }, delay);
    };

    const refreshNotifications = async (initial) => {
      if (inFlightRef.current || unmountedRef.current) {
        return;
      }

      inFlightRef.current = true;
      if (initial) {
        setLoading(true);
      }

      try {
        setError('');
        const res = await api.get('/notifications');
        setNotifications(dedupeNotifications(res.data));
        failureCountRef.current = 0;
        setConnectionStatus('online');
        scheduleNextPoll(BASE_POLL_MS);
      } catch (err) {
        failureCountRef.current += 1;
        const delay = Math.min(BASE_POLL_MS * 2 ** (failureCountRef.current - 1), MAX_BACKOFF_MS);
        setConnectionStatus(failureCountRef.current >= 3 ? 'offline' : 'reconnecting');
        if (initial && notificationsRef.current.length === 0) {
          setError('Unable to load notifications right now.');
        }
        scheduleNextPoll(delay);
      } finally {
        if (initial) {
          setLoading(false);
        }
        inFlightRef.current = false;
      }
    };

    manualRefreshRef.current = async () => {
      failureCountRef.current = 0;
      setConnectionStatus('connecting');
      await refreshNotifications(false);
    };

    void refreshNotifications(true);

    return () => {
      unmountedRef.current = true;
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
    };
  }, [api]);

  const markAsRead = async (id) => {
    const existing = notificationsRef.current.find((n) => n.id === id);
    if (!existing || existing.isRead) {
      return;
    }

    const snapshot = notificationsRef.current;
    setNotifications((current) => current.map((n) => (n.id === id ? { ...n, isRead: true } : n)));

    try {
      await api.put(`/notifications/${id}/read`);
      return true;
    } catch (err) {
      setNotifications(snapshot);
      toast.error('Could not mark notification as read. Please try again.');
      return false;
    }
  };

  const navigateFromNotification = async (notification) => {
    if (!notification?.isRead) {
      const marked = await markAsRead(notification.id);
      if (!marked) {
        return;
      }
    }

    const action = inferNotificationAction(notification);
    navigate(action.path);
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);
  const statusMeta = STATUS_META[connectionStatus] || STATUS_META.connecting;

  return (
    <div className="rb-shell max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold">Notifications</h1>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-pill border px-2.5 py-1 text-xs font-semibold ${statusMeta.className}`}>
            {statusMeta.label}
          </span>
          {(connectionStatus === 'reconnecting' || connectionStatus === 'offline') && (
            <span className="text-xs text-ink-500">Retry in {Math.ceil(nextRetryMs / 1000)}s</span>
          )}
          {(connectionStatus === 'reconnecting' || connectionStatus === 'offline') && (
            <Button size="sm" variant="ghost" onClick={() => manualRefreshRef.current()}>
              Retry now
            </Button>
          )}
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {!loading && error && (
        <Card className="border border-red-200 bg-red-50 text-red-700">{error}</Card>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Card className="space-y-2 text-center text-ink-600">
          <p className="font-semibold text-ink-800">No notifications yet.</p>
          <p className="text-sm">Updates appear when runners respond to your requests or send messages.</p>
          <p className="text-sm">Tip: create a run request to start getting activity here.</p>
        </Card>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="space-y-6">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink-700">Unread ({unreadNotifications.length})</h2>
            </div>
            {unreadNotifications.length === 0 ? (
              <Card className="text-sm text-ink-500">All caught up. New updates will appear here.</Card>
            ) : (
              <div className="space-y-3">
                {unreadNotifications.map((n) => (
                  <Card
                    key={n.id}
                    className="cursor-pointer border-l-4 border-l-coral-500 transition hover:-translate-y-px hover:shadow-glow"
                  >
                    <p className="font-semibold text-ink-800">{n.content}</p>
                    <p className="mt-2 text-xs text-ink-500">{new Date(n.timestamp).toLocaleString()}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary" onClick={() => markAsRead(n.id)}>
                        Mark as read
                      </Button>
                      <Button size="sm" onClick={() => navigateFromNotification(n)}>
                        {inferNotificationAction(n).label}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink-700">Read ({readNotifications.length})</h2>
            </div>
            {readNotifications.length === 0 ? (
              <Card className="text-sm text-ink-500">No read notifications yet.</Card>
            ) : (
              <div className="space-y-3">
                {readNotifications.map((n) => (
                  <Card
                    key={n.id}
                    className="opacity-75"
                  >
                    <p className="font-semibold text-ink-800">{n.content}</p>
                    <p className="mt-2 text-xs text-ink-500">{new Date(n.timestamp).toLocaleString()}</p>
                    <div className="mt-3">
                      <Button size="sm" variant="ghost" onClick={() => navigateFromNotification(n)}>
                        {inferNotificationAction(n).label}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default Notifications;