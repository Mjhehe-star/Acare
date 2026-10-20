import { useMemo, useRef, useState } from 'react';

const medications = [
  { name: 'Vitamin D', time: '8:00 AM', dosage: '1 tablet', status: 'Taken' },
  { name: 'Blood Pressure', time: '12:30 PM', dosage: '1 capsule', status: 'Upcoming' },
  { name: 'Calcium', time: '8:00 PM', dosage: '1 tablet', status: 'Upcoming' },
];

const appointments = [
  { title: 'Primary Care Follow-up', date: 'Tue, Jun 18', time: '10:00 AM' },
  { title: 'Pharmacy Pickup', date: 'Thu, Jun 20', time: '2:15 PM' },
  { title: 'Lab Results Review', date: 'Mon, Jun 24', time: '9:30 AM' },
];

const quickTips = [
  'Drink water with your morning medication.',
  'Take a short walk after lunch for circulation.',
  'Write down any symptoms before your next appointment.',
];

const voiceResponses = {
  reminder: 'Your next medication reminder is scheduled for 12:30 PM. Please take your blood pressure medicine with water.',
  appointment: 'Your next appointment is with your primary care doctor on Tuesday at 10:00 AM.',
  health: 'Your daily health plan includes hydration, movement, and a review of symptoms before your next visit.',
  default: 'I can help track your medications, appointments, and health routine. Try asking about reminders, schedule, or how to stay organized today.',
};

function detectIntent(message = '') {
  const text = message.toLowerCase();

  if (text.includes('medicine') || text.includes('medication') || text.includes('pill')) return 'reminder';
  if (text.includes('appointment') || text.includes('doctor') || text.includes('visit')) return 'appointment';
  if (text.includes('health') || text.includes('symptom') || text.includes('care')) return 'health';

  return 'default';
}

function App() {
  const [language, setLanguage] = useState('English');
  const [message, setMessage] = useState('');
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState('Ready to help with your care plan.');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const supportedLanguages = useMemo(
    () => ['English', 'Español', 'Français', 'हिन्दी'],
    []
  );

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setAssistantReply('Voice input is not available in this browser. You can still type your request below.');
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'English' ? 'en-US' : 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setAssistantReply('Listening...');
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      setMessage(spokenText);
      const intent = detectIntent(spokenText);
      setAssistantReply(voiceResponses[intent]);
    };

    recognition.onerror = () => {
      setAssistantReply('I could not understand that request. Please type or try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = message.trim();

    if (!text) {
      setAssistantReply('Please ask a question or say a command first.');
      return;
    }

    setTranscript(text);
    const intent = detectIntent(text);
    setAssistantReply(voiceResponses[intent]);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <nav className="nav container" aria-label="Main navigation">
          <div className="brand" aria-label="CareMate AI home">
            <span className="brand-icon">✚</span>
            <div>
              <span className="brand-name">CareMate AI</span>
              <span className="brand-tagline">Your health, your companion.</span>
            </div>
          </div>

          <label className="language-picker" htmlFor="language-select">
            <span className="sr-only">Select language</span>
            <select
              id="language-select"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              {supportedLanguages.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </nav>
      </header>

      <main className="container main-content">
        <section className="hero">
          <span className="eyebrow">YOUR PERSONAL HEALTH COMPANION</span>
          <h1>Hello! How can I help you today?</h1>
          <p>
            A practical care dashboard for medication reminders, appointments, and daily wellness support.
          </p>
        </section>

        <section className="assistant-panel">
          <div className="assistant-status">
            <span className="status-dot" aria-hidden="true" />
            Your AI assistant
          </div>

          <h2>I'm here to help.</h2>
          <p>
            Speak naturally or type a question about your care plan, reminders, and daily routine.
          </p>

          <button
            type="button"
            className="voice-button"
            onClick={startVoiceRecognition}
            aria-label="Start voice assistant"
          >
            <span className="microphone" aria-hidden="true">🎙</span>
            <span>{isListening ? 'Listening...' : 'Talk to me'}</span>
          </button>

          <form className="ask-form" onSubmit={handleSubmit}>
            <label htmlFor="message" className="sr-only">
              Ask about your care
            </label>
            <input
              id="message"
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask: When is my next appointment?"
            />
            <button type="submit">Ask</button>
          </form>

          <div className="response-box" role="status" aria-live="polite">
            {assistantReply}
          </div>

          {transcript && <p className="transcript">You said: “{transcript}”</p>}
        </section>

        <section className="cards-section">
          <h3>Care overview</h3>
          <div className="card-grid">
            <article className="info-card">
              <span className="card-icon">💊</span>
              <h4>Medications</h4>
              <ul>
                {medications.map((med) => (
                  <li key={med.name}>
                    <strong>{med.name}</strong> · {med.time} · {med.dosage}
                    <span className={med.status === 'Taken' ? 'status-pill taken' : 'status-pill'}>
                      {med.status}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="info-card">
              <span className="card-icon">📅</span>
              <h4>Appointments</h4>
              <ul>
                {appointments.map((appt) => (
                  <li key={`${appt.title}-${appt.date}`}>
                    <strong>{appt.title}</strong>
                    <span>{appt.date} · {appt.time}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="info-card">
              <span className="card-icon">🩺</span>
              <h4>Daily health</h4>
              <ul>
                {quickTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
