import './design-tokens.css';
import React, { useState } from 'react';
import { useAuthStore } from './store/authStore';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import './App.css';

function App() {
  const user = useAuthStore((state: any) => state.user);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleOnboardingComplete = () => {
    setShowDashboard(true);
  };

  return (
    <div className="App">
      {!showDashboard || !user ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;