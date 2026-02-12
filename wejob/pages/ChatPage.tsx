import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useUser } from '../context/UserContext';
import { Send, Loader2, User as UserIcon, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

const ChatPage: React.FC = () => {
  const { chatPartnerId } = useParams<{ chatPartnerId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [receiverName, setReceiverName] = useState('User');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !chatPartnerId) return;

    // Fetch receiver profile (optional, purely for display)
    const fetchProfile = async () => {
        const { data } = await supabase.from('profiles').select('full_name, first_name, last_name').eq('id', chatPartnerId).single();
        if (data) {
            setReceiverName(data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'User');
        }
    };
    fetchProfile();

    // 1. Load old messages
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${chatPartnerId}),and(sender_id.eq.${chatPartnerId},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        console.error("Error loading messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // 2. Real-time Subscription
    const channel = supabase
      .channel(`chat_room:${chatPartnerId}`)
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        (payload) => {
          const newMsg = payload.new as Message;
          // Only add message if it belongs to this conversation
          if (
            (newMsg.sender_id === user.id && newMsg.receiver_id === chatPartnerId) || 
            (newMsg.sender_id === chatPartnerId && newMsg.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatPartnerId, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !user || !chatPartnerId) return;

    const text = newMessage.trim();
    setNewMessage("");

    // Optimistic update (optional, but good UX)
    // setMessages(prev => [...prev, { 
    //   id: 'temp-' + Date.now(), 
    //   sender_id: user.id, 
    //   receiver_id: chatPartnerId, 
    //   content: text, 
    //   created_at: new Date().toISOString() 
    // }]);

    const { error } = await supabase.from('messages').insert([
      { content: text, sender_id: user.id, receiver_id: chatPartnerId }
    ]);

    if (error) {
        console.error("Error sending message:", error.message);
        // Remove optimistic update if needed or show error toast
    }
  };

  if (!user) return <div className="p-10 text-center">Please log in to view messages.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
       {/* Header */}
       <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
            <ArrowLeft size={20} />
        </button>
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <UserIcon size={20} />
        </div>
        <div>
            <h2 className="font-bold text-gray-900">{receiverName}</h2>
            <p className="text-xs text-green-600 font-medium">Online</p>
        </div>
       </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
        {loading ? (
             <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
             </div>
        ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Send className="w-6 h-6 text-gray-300" />
                </div>
                <p>No messages yet. Start the conversation!</p>
            </div>
        ) : (
            messages.map((m) => {
                const isMe = m.sender_id === user.id;
                return (
                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            isMe 
                            ? "bg-blue-600 text-white rounded-tr-none" 
                            : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                        }`}>
                            {m.content}
                            <div className={`text-[10px] mt-1 text-right ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                );
            })
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
            <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                placeholder="Type your message..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
            <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-100"
            >
                <Send size={18} />
                <span className="hidden sm:inline">Send</span>
            </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
