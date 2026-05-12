import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '30px 20px', fontFamily: 'Ubuntu, sans-serif' }}>
      <Logo fixed={false} />

      <div style={{ maxWidth: '700px', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Headline */}
        <h1 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '38px', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '28px', color: '#000' }}>
          Journal Like You're Texting a Friend
        </h1>

        {/* Problem - Tighter */}
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#444', marginBottom: '16px', maxWidth: '550px' }}>
          Most athletes don't journal because it requires effort. After an exhausting session, who wants to write?
        </p>

        {/* Solution */}
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#000', fontWeight: '500', marginBottom: '40px', maxWidth: '550px' }}>
          Voice-based. No writing. No overthinking.
          Just speak naturally about your session - what you did, how you felt, what worked, what didn't.
          AI handles the rest.
        </p>

        {/* Benefits - With Emotional Benefits */}
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '36px', maxWidth: '550px' }}>
  <div style={{ paddingBottom: '12px', borderBottom: '1px solid #e0e0e0', textAlign: 'center' }}>
    <img src="/images/microphone.png" alt="Voice Recording" style={{ width: '40px', height: '40px', marginBottom: '12px' }} />
    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#000' }}>60 Seconds</div>
    <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.4' }}>Speak your mind. Record in your own words</div>
  </div>
  <div style={{ paddingBottom: '12px', borderBottom: '1px solid #e0e0e0', textAlign: 'center' }}>
    <img src="/images/lightbulb.png" alt="Insights" style={{ width: '40px', height: '40px', marginBottom: '12px' }} />
    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#000' }}>Instant Insights</div>
    <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.4' }}>Sleep better knowing you're improving</div>
  </div>
  <div style={{ paddingBottom: '12px', borderBottom: '1px solid #e0e0e0', textAlign: 'center' }}>
    <img src="/images/graph.png" alt="Progress" style={{ width: '40px', height: '40px', marginBottom: '12px' }} />
    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#000' }}>Real Progress</div>
    <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.4' }}>Confidence in your growth</div>
  </div>
</div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button onClick={() => navigate('/login')} style={{ padding: '12px 32px', fontSize: '14px', fontWeight: '600', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '2px', cursor: 'pointer', fontFamily: 'Ubuntu, sans-serif' }}>
            Get Started
          </button>
          <button onClick={() => navigate('/faq')} style={{ padding: '12px 32px', fontSize: '14px', fontWeight: '600', backgroundColor: 'transparent', color: '#000', border: '1px solid #000', borderRadius: '2px', cursor: 'pointer', fontFamily: 'Ubuntu, sans-serif' }}>
            Learn More
          </button>
        </div>

        {/* FAQ Link */}
        <div onClick={() => navigate('/faq')} style={{ fontSize: '12px', color: '#999', cursor: 'pointer', textDecoration: 'underline', width: 'fit-content' }}>
          Questions? Read our FAQ →
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#999', marginTop: '40px' }}>
        My Journal - Track. Learn. Grow.
      </footer>
    </div>
  );
};