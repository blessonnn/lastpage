import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getFriendSession, 
  saveFriendSession, 
  getAdminSession, 
  setAdminSession, 
  clearAdminSession,
  clearFriendSession
} from './utils/storage';

// Components
import RoleGate from './components/RoleGate';
import FriendEntryGate from './components/FriendEntryGate';
import AdminLoginModal from './components/AdminLoginModal';
import FriendPrivatePage from './components/FriendPrivatePage';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [view, setView] = useState('gate'); // 'gate', 'friend_entry', 'admin_modal', 'friend_page', 'admin_dashboard'
  const [friendSession, setFriendSession] = useState(getFriendSession());
  const [adminSession, setAdminSessionState] = useState(getAdminSession());

  useEffect(() => {
    // Keep sessions in state but don't auto-redirect away from the landing page
    // This ensures users always see the front page first, even if they have a session.
  }, []);

  const handleSelectFriend = () => {
    setView('friend_entry');
  };

  const handleEnterName = (name) => {
    const newSession = { name, submitted: false, draft_message: '', draft_photo: null };
    saveFriendSession(newSession);
    setFriendSession(newSession);
    setView('friend_page');
  };

  const handleAdminLogin = () => {
    setAdminSession(true);
    setAdminSessionState({ isAdmin: true });
    setView('admin_dashboard');
  };

  const handleLogout = () => {
    clearAdminSession();
    setAdminSessionState(null);
    setView('gate');
  };

  const handleSignOutFriend = () => {
    clearFriendSession();
    setFriendSession(null);
    setView('gate');
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {view === 'gate' && (
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RoleGate 
              onSelectFriend={handleSelectFriend} 
              onSelectAdmin={() => setView('admin_modal')} 
            />
            <AdminLoginModal 
              isOpen={view === 'admin_modal'}
              onClose={() => setView('gate')}
              onLogin={handleAdminLogin}
            />
          </motion.div>
        )}

        {view === 'admin_modal' && (
          <AdminLoginModal 
            key="admin_modal"
            isOpen={true}
            onClose={() => setView('gate')}
            onLogin={handleAdminLogin}
          />
        )}

        {view === 'friend_entry' && (
          <motion.div
            key="friend_entry"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FriendEntryGate 
              onBack={() => setView('gate')} 
              onEnter={handleEnterName} 
            />
          </motion.div>
        )}

        {view === 'friend_page' && friendSession && (
          <motion.div
            key="friend_page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FriendPrivatePage 
              session={friendSession} 
              onSignOut={handleSignOutFriend}
            />
          </motion.div>
        )}

        {view === 'admin_dashboard' && adminSession?.isAdmin && (
          <motion.div
            key="admin_dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AdminDashboard onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
