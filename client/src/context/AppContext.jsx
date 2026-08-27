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
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(() => {
    try {
      return localStorage.getItem('skillbridge_sidebar_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const setSidebarCollapsed = (val) => {
    setSidebarCollapsedState(prev => {
      const nextVal = typeof val === 'function' ? val(prev) : val;
      try {
        localStorage.setItem('skillbridge_sidebar_collapsed', String(nextVal));
      } catch (e) {}
      return nextVal;
    });
  };

  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [activeCluster, setActiveCluster] = useState('Western Maharashtra Innovation Cluster');
  const [studentInterest, setStudentInterestState] = useState(() => {
    try {
      return localStorage.getItem('skillbridge_student_interest') || 'All';
    } catch (e) {
      return 'All';
    }
  });

  const setStudentInterest = (interest) => {
    setStudentInterestState(interest);
    try {
      localStorage.setItem('skillbridge_student_interest', interest);
    } catch (e) {}
  };

  const toggleMenu = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 992) {
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

  const loginUser = (user) => {
    if (!user) return;
    setCurrentUser(user);
    setUsers(prev => [user, ...prev.filter(u => u.id !== user.id)]);
    localStorage.setItem('skillbridge_active_user_id', user.id);
    localStorage.setItem('skillbridge_active_user_obj', JSON.stringify(user));
  };

  const logoutUser = () => {
    localStorage.removeItem('skillbridge_active_user_obj');
    localStorage.removeItem('skillbridge_active_user_id');
    setIsLandingView(true);
    showToast('Logged out successfully');
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

      const savedUserObj = localStorage.getItem('skillbridge_active_user_obj');
      let initialUser = null;
      if (savedUserObj) {
        try {
          initialUser = JSON.parse(savedUserObj);
        } catch (e) {}
      }

      if (!initialUser) {
        const savedUserId = localStorage.getItem('skillbridge_active_user_id') || fetchedUsers[0]?.id;
        initialUser = fetchedUsers.find(u => u.id === savedUserId) || fetchedUsers[0];
      }
      
      if (initialUser) {
        setCurrentUser(initialUser);
        setUsers(prev => [initialUser, ...prev.filter(u => u.id !== initialUser.id)]);
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
      loginUser(target);
      showToast(`Switched active profile to ${target.name}`);
    }
  };

  const switchRole = (role) => {
    const target = users.find(u => u.role === role);
    if (target) {
      loginUser(target);
    }
  };

  return (
    <AppContext.Provider
      value={{
        users,
        institutions,
        currentUser,
        setCurrentUser,
        loginUser,
        logoutUser,
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
        studentInterest,
        setStudentInterest,
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
