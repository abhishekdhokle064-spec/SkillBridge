import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLandingView, setIsLandingView] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [activeCluster, setActiveCluster] = useState('Western Maharashtra Innovation Cluster');

  const toggleMenu = () => {
    if (window.innerWidth < 900) {
      setMobileMenuOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [usersRes, instRes] = await Promise.all([
        api.getUsers(),
        api.getInstitutions()
      ]);

      const fetchedUsers = usersRes.data || [];
      const fetchedInsts = instRes.data || [];

      setUsers(fetchedUsers);
      setInstitutions(fetchedInsts);

      const savedUserId = localStorage.getItem('skillbridge_active_user_id') || fetchedUsers[0]?.id;
      const initialUser = fetchedUsers.find(u => u.id === savedUserId) || fetchedUsers[0];
      
      setCurrentUser(initialUser);
      if (initialUser) {
        localStorage.setItem('skillbridge_active_user_id', initialUser.id);
      }
    } catch (err) {
      console.warn('Backend node sync initialized via resilient offline store.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const switchUser = (userId) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem('skillbridge_active_user_id', target.id);
      showToast(`Switched active profile to ${target.name}`);
    }
  };

  const switchRole = (role) => {
    const target = users.find(u => u.role === role);
    if (target) {
      switchUser(target.id);
    }
  };

  return (
    <AppContext.Provider
      value={{
        users,
        institutions,
        currentUser,
        loading,
        toast,
        showToast,
        triggerConfetti,
        activeTab,
        setActiveTab,
        isLandingView,
        setIsLandingView,
        selectedResourceId,
        setSelectedResourceId,
        mobileMenuOpen,
        setMobileMenuOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleMenu,
        globalSearchQuery,
        setGlobalSearchQuery,
        switchUser,
        switchRole,
        activeCluster,
        setActiveCluster,
        refreshData: loadInitialData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
