import { useCallback, useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import { messagesApi } from '../../services/endpoints.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/NotificationContext.jsx';

/**
 * Reusable conversation panel between the signed-in user and `otherUserId`,
 * optionally scoped to a `jobId` so each application has its own thread.
 */
export default function MessageThreadModal({
  open,
  onClose,
  otherUserId,
  otherUserName,
  jobId = null,
  jobTitle = null,
}) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }));
  };

  const load = useCallback(async () => {
    if (!otherUserId) return;
    setLoading(true);
    try {
      const rows = await messagesApi.conversation(otherUserId, jobId || undefined);
      setMessages(rows || []);
      scrollToBottom();
    } catch (err) {
      toast({ type: 'error', title: 'Could not load messages', message: err?.message });
    } finally {
      setLoading(false);
    }
  }, [otherUserId, jobId, toast]);

  useEffect(() => {
    if (open) {
      setBody('');
      load();
    }
  }, [open, load]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    setSending(true);
    try {
      const created = await messagesApi.send({
        recipientId: otherUserId,
        jobId: jobId || null,
        body: text,
      });
      setMessages((prev) => [...prev, created]);
      setBody('');
      scrollToBottom();
    } catch (err) {
      toast({ type: 'error', title: 'Message not sent', message: err?.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={
        <span>
          {otherUserName || 'Conversation'}
          {jobTitle && <span className="ml-2 text-xs font-normal text-ink-400">- {jobTitle}</span>}
        </span>
      }
      footer={
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <textarea
            className="input min-h-[44px] max-h-32 flex-1 resize-y"
            placeholder="Write a message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <button type="submit" className="btn-primary" disabled={sending || !body.trim()}>
            <Send size={14} /> {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      }
    >
      <div className="space-y-3">
        {loading ? (
          <p className="py-8 text-center text-sm text-ink-500">Loading conversation...</p>
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-500">
            No messages yet. Say hello to start the conversation.
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === currentUser.id;
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                    mine
                      ? 'rounded-br-sm bg-brand-600 text-white'
                      : 'rounded-bl-sm border border-sky-200 bg-sky-100 text-black'
                  }`}
                >
                  <p className={`whitespace-pre-wrap break-words ${mine ? 'text-white' : '!text-black'}`}>
                    {m.body}
                  </p>
                  <p className={`mt-1 text-[10px] ${mine ? 'text-white/70' : '!text-black/60'}`}>
                    {new Date(m.createdAt).toLocaleString('en-CA', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </Modal>
  );
}
