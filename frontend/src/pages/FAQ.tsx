import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

export const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What is My Journal?',
      answer: 'My Journal is a voice-based athletic journal designed for competitive athletes. Instead of writing, you simply record a 60-second voice note about your training session. AI analyzes your notes and provides instant insights about your performance, patterns, and progress.'
    },
    {
      question: 'Who is it for?',
      answer: 'My Journal is built for competitive athletes of all sports who want to understand their training patterns and improve their performance. Whether you\'re a junior tennis player, a track athlete, or a competitive swimmer, this app helps you track your journey.'
    },
    {
      question: 'How does it work?',
      answer: 'Simple: (1) Record a voice note about your session—what you did, how you felt, what worked. (2) Our AI listens and creates a summary. (3) Get instant insights about your performance. (4) Review weekly summaries to see patterns and track progress.'
    },
    {
      question: 'What are insights?',
      answer: 'Insights are AI-generated analyses of your training sessions. They identify patterns in your performance, highlight what\'s working well, and suggest areas to focus on. Weekly summaries help you understand your progress over time.'
    },
    {
      question: 'Is my data private?',
      answer: 'Yes. Your training data is private and secure. We only use your voice notes to generate insights for you. We don\'t share your data with anyone. Your privacy is our priority.'
    },
    {
      question: 'How do I get started?',
      answer: 'Sign up with your email, complete your profile (sport, level, goals), and record your first session. That\'s it. Start tracking your journey today.'
    },
    {
      question: 'What sports are supported?',
      answer: 'My Journal works for any sport. Whether it\'s tennis, track, swimming, gymnastics, basketball, or any other competitive sport, you can use the app to track your progress.'
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes. You can export your journal entries and insights anytime. Your data belongs to you, and you have full control over it.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '50px 20px', fontFamily: 'Ubuntu, sans-serif' }}>
      <Logo />

      <div style={{ maxWidth: '700px', margin: '0 auto', flex: 1, width: '100%' }}>
        {/* Header */}
        <h1 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '42px', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '12px', color: '#000' }}>
          Frequently Asked Questions
        </h1>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#666', marginBottom: '40px' }}>
          Find answers to common questions about My Journal.
        </p>

        {/* FAQ List */}
        <div style={{ marginBottom: '40px' }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                borderBottom: '1px solid #e0e0e0',
                paddingBottom: '20px',
                marginBottom: '20px',
              }}
            >
              {/* Question Button */}
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '0',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#000',
                  fontFamily: 'Ubuntu, sans-serif',
                }}
              >
                <span>{faq.question}</span>
                <span style={{ fontSize: '18px', color: '#666' }}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>

              {/* Answer - Show/Hide */}
              {openIndex === index && (
                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.7',
                    color: '#555',
                    marginTop: '12px',
                    marginBottom: '0',
                  }}
                >
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div style={{ backgroundColor: '#f5f5f5', padding: '30px', borderRadius: '4px', textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#000' }}>
            Still have questions?
          </h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
           Email us at: team@rlxed.com. 
            </p>
            <p style={{ fontSize: '14px', color: '#333', fontWeight: '600', marginBottom: '20px' }}>
            Get started with My Journal today.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '12px 32px',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              fontFamily: 'Ubuntu, sans-serif',
            }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#999', marginTop: '40px' }}>
        My Journal - Track. Learn. Grow.
      </footer>
    </div>
  );
};