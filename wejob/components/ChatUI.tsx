import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { useUser } from '../context/UserContext';
import { Send, Loader2, User as UserIcon, X } from 'lucide-react';

interface Message {
  id: string;
  job_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface ChatUIProps {
  jobId: string;
  receiverId: string;
  receiverName: string;
  onClose?: () => void;
}

const ChatUI: React.FC<ChatUIProps> = ({ jobId, receiverId, receiverName, onClose }) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !jobId) return;

    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('job_id', jobId)
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        if (error) {
             console.warn('Chat messages fetch warning:', error.message);
             setMessages([]);
        } else {
             setMessages(data || []);
        }
      } catch (err) {
        console.warn('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`chat:${jobId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `job_id=eq.${jobId}`
      }, (payload) => {
        const msg = payload.new as Message;
        // Check if message belongs to this conversation
        if ((msg.sender_id === user.id && msg.receiver_id === receiverId) || 
            (msg.sender_id === receiverId && msg.receiver_id === user.id)) {
          setMessages(prev => [...prev, msg]);
        }
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn('Realtime Chat subscription failed. Live messaging will be unavailable until Realtime is enabled in Supabase.');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId, receiverId, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          job_id: jobId,
          sender_id: user.id,
          receiver_id: receiverId,
          content: messageContent
        }]);

      if (error) throw error;
    } catch (err) {
      console.error('Error sending message:', err);
      // Optional: add toast error
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="bg-[#1C357B] p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <UserIcon size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">{receiverName}</h3>
            <p className="text-[10px] text-blue-200 uppercase tracking-widest font-black">Chatting about project</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 custom-scrollbar"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-blue-200" />
            </div>
            <p className="text-gray-400 text-sm font-medium">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.sender_id === user?.id 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'
              }`}>
                {msg.content}
                <div className={`text-[10px] mt-1 ${msg.sender_id === user?.id ? 'text-blue-200' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button 
          type="submit"
          disabled={!newMessage.trim()}
          className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-100"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

// Dummy component to avoid import errors if MessageSquare is missing in first pass
const MessageSquare = ({ className, size }: any) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export default ChatUI;
