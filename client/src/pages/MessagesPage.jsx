import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Send, 
  User, 
  MessageSquare, 
  Building2, 
  CheckCheck,
  Sparkles
} from 'lucide-react';

export const MessagesPage = () => {
  const { currentUser, showToast } = useApp();
  const [activeChat, setActiveChat] = useState('chat_1');
  const [msgInput, setMsgInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Dr. K. R. Joshi (Robotics Lab Coordinator)', text: 'Hello Rahul! Your slot for the ABB Robot Arm on 08 Jun has been allocated to Workcell-2.', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'Rahul Sharma', text: 'Thank you Sir! Do I need to bring our Arduino Mega board or is it provided on-site?', time: '10:32 AM', isMe: true },
    { id: 3, sender: 'Dr. K. R. Joshi (Robotics Lab Coordinator)', text: 'All Arduino kits and ROS controllers are provided at the bench. Just bring your laptop with ROS2 Humble installed.', time: '10:35 AM', isMe: false }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: currentUser?.name || 'Rahul Sharma',
      text: msgInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages([...messages, newMsg]);
    setMsgInput('');
    showToast('Message sent to Lab Coordinator');
  };

  const chats = [
    { id: 'chat_1', name: 'Dr. K. R. Joshi', role: 'Robotics Lab Coordinator (GEC Nashik)', lastMsg: 'All Arduino kits and ROS controllers are provided...', unread: 0, avatar: '👨‍🏫' },
    { id: 'chat_2', name: 'Prof. Ananya Sen', role: 'AI & Jetson Instructor (VIT Pune)', lastMsg: 'Masterclass slides will be uploaded tonight.', unread: 2, avatar: '👩‍🔬' },
    { id: 'chat_3', name: 'TCS Talent Acquisition', role: 'Campus Hiring Coordinator', lastMsg: 'Your resume has been forwarded to technical leads.', unread: 1, avatar: '💼' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 160px)' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>Cluster Messages & Mentorship</h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
          Real-time communication with cluster lab coordinators, faculty mentors, and corporate recruiters.
        </p>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {/* Chat List Sidebar */}
        <div style={{ borderRight: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #E2E8F0', fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
            Active Conversations
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {chats.map(c => (
              <div 
                key={c.id}
                onClick={() => setActiveChat(c.id)}
                style={{
                  padding: '0.85rem 1rem',
                  borderBottom: '1px solid #F1F5F9',
                  backgroundColor: activeChat === c.id ? '#EFF6FF' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  {c.avatar}
                </div>
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                    {c.unread > 0 && <span style={{ backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '99px' }}>{c.unread}</span>}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMsg}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Messages Area */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Active Chat Header */}
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              👨‍🏫
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>Dr. K. R. Joshi</div>
              <div style={{ fontSize: '0.75rem', color: '#10B981' }}>● Online • Robotics Lab Coordinator (GEC Nashik)</div>
            </div>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map(m => (
              <div 
                key={m.id}
                style={{
                  alignSelf: m.isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.isMe ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: m.isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  backgroundColor: m.isMe ? '#2563EB' : '#F1F5F9',
                  color: m.isMe ? '#FFFFFF' : '#0F172A',
                  fontSize: '0.875rem',
                  lineHeight: '1.4'
                }}>
                  {m.text}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '3px' }}>
                  {m.time} {m.isMe && '✓✓'}
                </div>
              </div>
            ))}
          </div>

          {/* Send Input Box */}
          <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem' }}>
            <input 
              type="text"
              placeholder="Type your message to coordinator..."
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              style={{ flex: 1, padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none' }}
            />
            <button 
              type="submit"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <Send size={15} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
