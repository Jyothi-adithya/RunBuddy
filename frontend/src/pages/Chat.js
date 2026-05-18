import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button';

const BASE_POLL_MS = 3000;
const MAX_BACKOFF_MS = 30000;

const STATUS_META = {
  connecting: {
    label: 'Connecting',
    className: 'border-amber-200 bg-amber-50 text-amber-900'
  },
  online: {
    label: 'Online',
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

const dedupeAndSortMessages = (existing, incoming) => {
  const merged = [...existing, ...(incoming || [])];
  const bucket = new Map();

  merged.forEach((msg, index) => {
    const key = msg.id != null
      ? `id:${msg.id}`
      : `${msg.senderId || ''}-${msg.receiverId || ''}-${msg.timestamp || ''}-${msg.content || ''}-${index}`;
    bucket.set(key, msg);
  });

  return [...bucket.values()].sort((a, b) => {
    const left = new Date(a.timestamp || 0).getTime();
    const right = new Date(b.timestamp || 0).getTime();
    return left - right;
  });
};

const Chat = () => {
  const { partnerId } = useParams();
  const { api } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [nextRetryMs, setNextRetryMs] = useState(BASE_POLL_MS);
  const messagesEndRef = useRef(null);
  const pollTimerRef = useRef(null);
  const inFlightRef = useRef(false);
  const failureCountRef = useRef(0);
  const unmountedRef = useRef(false);
  const manualRefreshRef = useRef(async () => {});

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
        void pollMessages();
      }, delay);
    };

    const pollMessages = async () => {
      if (inFlightRef.current || unmountedRef.current) {
        return;
      }

      inFlightRef.current = true;
      try {
        const res = await api.get(`/messages/${partnerId}`);
        setMessages((prev) => dedupeAndSortMessages(prev, res.data));
        failureCountRef.current = 0;
        setConnectionStatus('online');
        scheduleNextPoll(BASE_POLL_MS);
      } catch (err) {
        failureCountRef.current += 1;
        const delay = Math.min(BASE_POLL_MS * 2 ** (failureCountRef.current - 1), MAX_BACKOFF_MS);
        setConnectionStatus(failureCountRef.current >= 3 ? 'offline' : 'reconnecting');
        scheduleNextPoll(delay);
      } finally {
        inFlightRef.current = false;
      }
    };

    manualRefreshRef.current = async () => {
      failureCountRef.current = 0;
      setConnectionStatus('connecting');
      await pollMessages();
    };

    void pollMessages();

    return () => {
      unmountedRef.current = true;
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
    };
  }, [partnerId, api]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await api.post('/messages', { receiverId: partnerId, content: newMessage });
      setNewMessage('');
      await manualRefreshRef.current();
      toast.success('Message sent');
    } catch (err) {
      toast.error('Unable to send message right now.');
    } finally {
      setSending(false);
    }
  };

  const statusMeta = STATUS_META[connectionStatus] || STATUS_META.connecting;

  return (
    <div className="rb-shell flex h-[calc(100vh-78px)] max-w-4xl flex-col">
      <div className="rb-glass-card-strong rounded-b-none px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-lg font-bold text-ink-900">Chat with Partner</p>
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
      </div>
      
      <div className="rb-glass-card flex-1 overflow-y-auto rounded-none p-4">
        <div className="space-y-4">
        {messages.length === 0 && (
          <div className="rounded-soft border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-semibold">No messages yet.</p>
            <p className="mt-1">Start the conversation with your running plan, meetup point, or preferred pace.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={msg.id ?? `${msg.timestamp || 't'}-${i}`} className={`max-w-[80%] rounded-2xl p-4 ${msg.isMine ? 'ml-auto bg-coral-600 text-white shadow-glow' : 'bg-white text-ink-800 shadow-sm'}`}>
            <p>{msg.content}</p>
            <p className="mt-1 text-xs opacity-70">{new Date(msg.timestamp).toLocaleTimeString()}</p>
          </div>
        ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="rb-glass-card-strong flex gap-3 rounded-t-none border-t border-white/60 p-4">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="rb-focus-ring flex-1 rounded-pill border border-white/70 bg-white px-5 py-3"
        />
        <Button type="submit" loading={sending} className="min-w-24">
          Send
        </Button>
      </form>
    </div>
  );
};

export default Chat;