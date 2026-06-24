import React, { useState, useEffect, useRef } from 'react';
import backgroundImage from './assets/image.png'; 
import image from './assets/image_.png'; 
import jaImage from './assets/logo.png'; 

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('wedding');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [countdownTarget, setCountdownTarget] = useState('wedding');
  
  // Floating Interactive Hearts system
  const [loveHearts, setLoveHearts] = useState([]);

  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [newWish, setNewWish] = useState({ name: '', text: '' });
  
  // Initial default guest wishing entries matching family and cousins
  const [wishesList, setWishesList] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const triviaQuestions = [
    {
      question: "Where did Joseph & Aney first meet?",
      options: ["At a family gathering", "Changanacherry Church youth festival", "Kumarakom lakeside retreat", "Through mutual cousins"],
      correct: 1,
      fact: "They crossed paths at a cultural youth church festival in Changanacherry, instantly sparking an eternal connection!"
    },
    {
      question: "Which date marks the start of their Holy Matrimony?",
      options: ["July 11th, 2026", "July 16th, 2026", "October 16th, 2026", "December 25th, 2026"],
      correct: 1,
      fact: "The Holy Matrimony takes place on Thursday, July 16th, 2026, at Nava Nazareth Church, Kumarakom!"
    },
    {
      question: "What profession does Joseph belong to?",
      options: ["Doctor", "Architect", "Advocate", "Software Engineer"],
      correct: 2,
      fact: "The groom, Joseph Stephen, is an esteemed Advocate practicing in the high courts!"
    }
  ];

  const [customGenPrompt, setCustomGenPrompt] = useState('Champagne');
  const [customGenLoading, setCustomGenLoading] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    // Inject custom elegant fonts dynamically to head
    if (typeof document !== 'undefined' && !document.getElementById('invitation-fonts-v7')) {
      const link = document.createElement('link');
      link.id = 'invitation-fonts-v7';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&family=Great+Vibes&family=Pinyon+Script&display=swap';
      document.head.appendChild(link);
    }

    // Set countdown targets (July 11 and July 16, 2026)
    const targetEngagement = new Date('2026-07-11T12:00:00');
    const targetWedding = new Date('2026-07-16T15:30:00');

    const updateCountdown = () => {
      const now = new Date();
      let target = countdownTarget === 'engagement' ? targetEngagement : targetWedding;
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [countdownTarget]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    class PeachPetal {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height - 20;
        this.size = Math.random() * 8 + 6;
        this.speedX = Math.random() * 1.2 - 0.6;
        this.speedY = Math.random() * 1.0 + 0.5;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 1.5 - 0.75;
        this.opacity = Math.random() * 0.45 + 0.35;
        this.color = `rgba(${235 + Math.floor(Math.random() * 20)}, ${170 + Math.floor(Math.random() * 25)}, ${150 + Math.floor(Math.random() * 25)}, ${this.opacity})`;
      }

      update(mouseX, mouseY) {
        this.y += this.speedY;
        this.x += this.speedX;
        this.angle += this.spin;

        // Interactive mouse repellent force
        if (mouseX !== undefined && mouseY !== undefined) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            this.x += (dx / dist) * force * 3;
            this.y += (dy / dist) * force * 2;
          }
        }

        if (this.y > height || this.x < -20 || this.x > width + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.size * 1.2, -this.size / 2, this.size * 1.2, this.size, 0, this.size * 1.4);
        ctx.bezierCurveTo(-this.size, this.size, -this.size / 2, -this.size / 2, 0, 0);
        ctx.fill();
        ctx.restore();
      }
    }

    class GoldDust {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.2 + 0.4;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.4 + 0.1;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.blinkSpeed = Math.random() * 0.02 + 0.005;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity += this.blinkSpeed;
        
        if (this.opacity > 0.85 || this.opacity < 0.15) {
          this.blinkSpeed = -this.blinkSpeed;
        }

        if (this.y > height || this.x < 0 || this.x > width) {
          this.reset();
          this.y = 0;
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();
        ctx.restore();
      }
    }

    const petals = Array.from({ length: 28 }, () => new PeachPetal());
    const sparks = Array.from({ length: 60 }, () => new GoldDust());

    let mouseX = undefined;
    let mouseY = undefined;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      sparks.forEach((s) => {
        s.update();
        s.draw();
      });

      petals.forEach((p) => {
        p.update(mouseX, mouseY);
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const triggerLoveShower = () => {
    const freshHeart = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      size: Math.random() * 20 + 20,
      rotate: Math.random() * 45 - 22.5
    };
    setLoveHearts(prev => [...prev, freshHeart]);
    
    setTimeout(() => {
      setLoveHearts(prev => prev.filter(h => h.id !== freshHeart.id));
    }, 5000);
  };

  const handleOpenInvitation = () => {
    setIsOpen(true);
    for (let i = 0; i < 6; i++) {
      setTimeout(triggerLoveShower, i * 250);
    }
  };

  const handleRSVPSubmit = (e) => {
    e.preventDefault();
    if (!rsvpStatus.name.trim() || !rsvpStatus.email.trim()) return;
    setRsvpSubmitted(true);
    
    const welcomeWish = {
      name: rsvpStatus.name,
      date: 'Just now',
      text: rsvpStatus.wishes.trim() 
        ? `${rsvpStatus.wishes} (Attending: ${rsvpStatus.attending === 'both' ? 'Both Ceremonies' : rsvpStatus.attending})`
        : `Excitedly joining the celebrations! Hearty congratulations Joseph & Aney.`
    };
    setWishesList([welcomeWish, ...wishesList]);
    triggerLoveShower();
  };

  const handleWishSubmit = (e) => {
    e.preventDefault();
    if (!newWish.name.trim() || !newWish.text.trim()) return;
    const addedWish = {
      name: newWish.name,
      date: 'Just now',
      text: newWish.text
    };
    setWishesList([addedWish, ...wishesList]);
    setNewWish({ name: '', text: '' });
    triggerLoveShower();
  };

  const handleQuizAnswer = (i) => {
    setSelectedAnswer(i);
    if (i === triviaQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    if (currentQuestion < triviaQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  const handleCustomImageGeneration = (selected) => {
    setCustomGenLoading(true);
    setCustomGenPrompt(selected);
    setTimeout(() => {
      setCustomGenLoading(false);
    }, 850);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-whitet text-[#5A4540] font-montserrat select-none">
      
      {/* Absolute Global Overrides & Critical Animations */}
      <style>{`
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        .font-vibes { font-family: 'Great Vibes', cursive; }
        .font-pinyon { font-family: 'Pinyon Script', cursive; }
        
        @keyframes gentle-glow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
          50% { transform: scale(1.05); box-shadow: 0 0 35px rgba(254, 219, 196, 0.8); }
        }
        
        @keyframes drape-sway {
          0%, 100% { transform: rotate(0deg) scaleX(1); }
          50% { transform: rotate(1.2deg) scaleX(1.04); }
        }

        @keyframes heart-pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(193, 39, 45, 0.4)); }
          50% { transform: scale(1.25); filter: drop-shadow(0 0 10px rgba(193, 39, 45, 0.8)); }
        }

        @keyframes float-up {
          0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
          10% { opacity: 0.85; }
          100% { transform: translateY(-120px) rotate(360deg) scale(1.3); opacity: 0; }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .animate-gentle-glow {
          animation: gentle-glow 4s infinite ease-in-out;
        }
        
        .animate-drape-sway {
          animation: drape-sway 6s infinite ease-in-out;
        }

        .animate-heart-pulse {
          animation: heart-pulse 1.5s infinite ease-in-out;
        }

        .animate-float-up {
          animation: float-up 5s linear forwards;
        }

        .shimmer-loading {
          background: linear-gradient(90deg, #FDF5F2 25%, #FCE4DC 50%, #FDF5F2 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .premium-border {
          border: 2px solid;
          border-image: linear-gradient(to right, #E5A995, #FCD9CC, #D4AF37, #FCD9CC, #E5A995) 1;
        }
        
        .shimmer-btn {
          position: relative;
          overflow: hidden;
        }
        .shimmer-btn::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.35), transparent);
          transform: rotate(30deg);
          transition: 0.8s;
          opacity: 0;
        }
        .shimmer-btn:hover::after {
          opacity: 1;
          left: 120%;
        }
      `}</style>

      {/* Live Falling Petals Canvas */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-10" />

      {/* Love shower hearts trigger container */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {loveHearts.map((heart) => (
          <div 
            key={heart.id}
            className="absolute bottom-0 animate-float-up text-red-400 opacity-90"
            style={{ 
              left: `${heart.x}%`, 
              fontSize: `${heart.size}px`,
              transform: `rotate(${heart.rotate}deg)`
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* MONOGRAM DOOR GATEKEEPER / ENVELOPE */}
      <div 
        className={`fixed inset-0 z-50 flex transition-all duration-[1200ms] ${isOpen ? 'pointer-events-none opacity-0 scale-105' : 'opacity-100'}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)' }}
      >
        
        {/* LEFT FLAP */}
        <div 
          className={`w-1/2 h-full bg-[#EBEAE0] flex items-center justify-end relative overflow-hidden border-r border-[#C9CBB8]/30 transition-transform duration-[1200ms] ${isOpen ? '-translate-x-full' : 'translate-x-0'}`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)' }}
        >
          {/* Detailed Golden Damask Lace SVG Watermark */}
          <div className="absolute right-0 top-0 w-full h-full pointer-events-none opacity-[0.06] flex items-center justify-end pr-10">
            <svg width="400" height="400" viewBox="0 0 100 100" fill="none" stroke="#A86450" strokeWidth="0.8">
              <circle cx="100" cy="50" r="45" />
              <circle cx="100" cy="50" r="35" strokeDasharray="2,2" />
              <circle cx="100" cy="50" r="25" />
              <path d="M 55,50 Q 80,20 100,50 T 100,80 Q 80,80 55,50" />
              <path d="M 65,50 Q 85,30 100,50 T 100,70 Q 85,70 65,50" />
              <path d="M 100,50 L 50,50" />
            </svg>
          </div>

        
        </div>

        {/* GLOWING WAX SEAL BUTTON */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center">
          <button
            onClick={handleOpenInvitation}
            className={`w-32 h-32 md:w-44 md:h-44 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3E3] to-[#B89047] p-[4px] shadow-[0_20px_50px_rgba(229,169,149,0.5)] animate-gentle-glow transition-all duration-700 hover:scale-110 active:scale-95 flex items-center justify-center ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
          >
            <div className="w-full h-full rounded-full bg-[#FAF0EC] flex flex-col items-center justify-center relative overflow-hidden hover:bg-[#FBE6DE] transition-colors duration-500">
              <div className="absolute inset-2 border-2 border-[#D4AF37]/60 rounded-full" />
              <div className="absolute inset-3 border border-dashed border-[#D4AF37]/30 rounded-full" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,210,196,0.45)_0%,transparent_75%)] pointer-events-none" />

              <span className="font-pinyon text-5xl md:text-6xl text-[#8E4A37] font-bold select-none tracking-tight"><img src={jaImage}></img></span>
            </div>

          </button>
          <span className="font-cinzel text-[12px] md:text-[9px] uppercase tracking-[0.3em] text-[#8E4A37] font-bold mt-2 select-none animate-pulse">Click here to Open Invitation</span>


        </div>

        {/* RIGHT FLAP */}
        <div 
          className={`w-1/2 h-full bg-[#EBEAE0] flex items-center justify-start relative overflow-hidden border-l border-[#C9CBB8]/30 transition-transform duration-[1200ms] ${isOpen ? 'translate-x-full' : 'translate-x-0'}`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)' }}
        >
          {/* Symmetric Detailed Golden Damask Lace SVG Watermark */}
          <div className="absolute left-0 top-0 w-full h-full pointer-events-none opacity-[0.06] flex items-center justify-start pl-10">
            <svg width="400" height="400" viewBox="0 0 100 100" fill="none" stroke="#A86450" strokeWidth="0.8">
              <circle cx="0" cy="50" r="45" />
              <circle cx="0" cy="50" r="35" strokeDasharray="2,2" />
              <circle cx="0" cy="50" r="25" />
              <path d="M 45,50 Q 20,20 0,50 T 0,80 Q 20,80 45,50" />
              <path d="M 35,50 Q 15,30 0,50 T 0,70 Q 15,70 35,50" />
              <path d="M 0,50 L 50,50" />
            </svg>
          </div>

        </div>
      </div>

      {/* MAIN INVITATION CARD CONTENT */}
      <div className={`relative z-20 min-h-screen transition-all duration-[1000ms] ${isOpen ? 'opacity-100' : 'opacity-0 filter blur-lg pointer-events-none'}`}>
        
        {/* FLOAT HEART LAUNCHER */}
        <div className="fixed bottom-6 right-6 z-40">
          <button 
            onClick={triggerLoveShower}
            className="w-14 h-14 bg-white/95 rounded-full shadow-lg border border-[#E5A995]/40 text-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform hover:bg-[#FFF2EC] group"
            title="Shower the couple with love!"
          >
            <span className="group-hover:animate-bounce">❤️</span>
          </button>
        </div>

        {/* SECTION 1: COVER ILLUSTRATION & INTERACTIVE CALENDAR */}
        <section className="relative pt-4 pb-2 px-4 flex flex-col items-center justify-center text-center">
          <div className="max-w-4xl w-full bg-[transparent] rounded-[2.5rem] shadow-[0_20px_50px_rgba(229,169,149,0.25)] border border-[#E5A995]/20 p-5 md:p-4 relative overflow-hidden">           
            <div className="absolute top-0 left-0 w-32 h-32 opacity-40 pointer-events-none bg-gradient-to-br from-[#FBD2C4] to-transparent rounded-full blur-3xl" />
            <div className="absolute top-0 right-0 w-32 h-32 opacity-40 pointer-events-none bg-gradient-to-bl from-[#FBD2C4] to-transparent rounded-full blur-3xl" />

            {/* July 2026 header script */}
            <div className="relative mb-4">
              <span className="font-vibes text-5xl md:text-6xl text-[#D4AF37] block leading-tight">July</span>
              <span className="font-playfair text-xl md:text-2xl font-bold text-[#8E4A37] tracking-wider -mt-2 block">2026</span>
            </div>

            {/* Live Interactive Calendar Grid */}
            <div className="max-w-xs mx-auto mb-8 bg-[#EBEAE0]/90 rounded-3xl p-3 border border-white/30 shadow-inner">
              <div className="grid grid-cols-7 gap-1 text-xs font-bold text-[#8E4A37] border-b border-[#E5A995]/30 pb-2 mb-2">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>
              <div className="grid grid-cols-7 gap-2 text-xs font-semibold text-[#5A4540]">
                <span className="text-[#D6C2BD]"></span><span className="text-[#D6C2BD]"></span><span className="text-[#D6C2BD]"></span>
                <span className="py-1">1</span><span className="py-1">2</span><span className="py-1">3</span><span className="py-1">4</span><span className="py-1">5</span>
                <span className="py-1">6</span><span className="py-1">7</span><span className="py-1">8</span><span className="py-1">9</span><span className="py-1">10</span>
                <span className="py-1">11</span>
                
                <span className="py-1">12</span><span className="py-1">13</span><span className="py-1">14</span><span className="py-1">15</span>
                
                {/* 16th - Wedding Ceremony with Red Pulsing Heart */}
                <div 
                  className="relative flex items-center justify-center py-1 cursor-pointer transition-transform hover:scale-125"
                  onClick={() => {
                    setActiveTab('wedding');
                    setCountdownTarget('wedding');
                    const element = document.getElementById('ceremonies-section');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  title="Click to view Wedding details!"
                >
                  <span className="absolute text-[#C1272D] text-2xl animate-heart-pulse">❤️</span>
                  <span className="relative z-10 text-white font-bold text-[10px]">16</span>
                </div>
                
                <span className="py-1">17</span><span className="py-1">18</span><span className="py-1">19</span>
                <span className="py-1">20</span><span className="py-1">21</span><span className="py-1">22</span><span className="py-1">23</span><span className="py-1">24</span><span className="py-1">25</span><span className="py-1">26</span>
                <span className="py-1">27</span><span className="py-1">28</span><span className="py-1">29</span><span className="py-1">30</span><span className="py-1">31</span>
              </div>
            </div>

            {/* Custom SVG Watercolor Couple & Flower Arch Illustration */}
            <div className="w-full flex flex-col items-center -mt-15 mb-4" >
              <img 
                src= {image}
                alt="Couple" 
                className="w-full max-w-[90vw] md:max-w-lg h-auto object-contain"
              />
              <p className="font-pinyon text-4xl text-[#A86450] mt-1">Joseph & Aney</p>
            </div>
          </div>
        </section>

        {/* COUNTDOWN SECTION */}
        <section className="py-16 bg-gradient-to-b from-white via-white to-white border-t border-b border-[#E5A995]/30 shadow-md relative z-30 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-72 h-72 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,#FCD9CC_0%,transparent_70%)] blur-3xl -translate-y-1/2" />
          <div className="max-w-4xl mx-auto text-center px-4 relative">
            <span className="font-cinzel text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#A86450] font-bold block mb-2">
              THE COUNTDOWN TO OUR WEDDING
            </span>
            <h3 className="font-playfair text-3xl font-semibold text-[#5A4540] mb-3">
              Time until we say "I Do"
            </h3>
            {/* Glowing Ring-Dial Countdown Design */}
            <div className="grid grid-cols-4 gap-2 max-w-2xl mx-auto mb-12">
              
              {/* DAYS DIAL */}
              <div className="bg-white/75 backdrop-blur-md rounded-3xl p-5 border border-[#E5A995]/25 shadow-lg relative overflow-hidden group hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF7F4] to-transparent opacity-60" />
                <div className="relative flex flex-col items-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="url(#goldGradient)" strokeWidth="4" fill="transparent" />
                  </svg>
                  <div className="absolute top-[34px] left-1/2 -translate-x-1/2 text-center">
                    <span className="block font-cinzel text-2xl md:text-3xl font-extrabold text-[#8E4A37] tracking-tighter leading-none group-hover:scale-110 transition-transform">
                      {timeLeft.days}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#A86450] font-bold mt-4 block">Days</span>
                </div>
              </div>

              {/* HOURS DIAL */}
              <div className="bg-white/75 backdrop-blur-md rounded-3xl p-5 border border-[#E5A995]/25 shadow-lg relative overflow-hidden group hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF7F4] to-transparent opacity-60" />
                <div className="relative flex flex-col items-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#FFF0EB" strokeWidth="4" fill="transparent" />
                    <circle cx="48" cy="48" r="40" stroke="url(#goldGradient)" strokeWidth="6" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={(2 * Math.PI * 40) * (1 - timeLeft.hours / 24)} strokeLinecap="round" fill="transparent" className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute top-[34px] left-1/2 -translate-x-1/2 text-center">
                    <span className="block font-cinzel text-2xl md:text-3xl font-extrabold text-[#8E4A37] tracking-tighter leading-none group-hover:scale-110 transition-transform">
                      {timeLeft.hours}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#A86450] font-bold mt-4 block">Hours</span>
                </div>
              </div>

              {/* MINUTES DIAL */}
              <div className="bg-white/75 backdrop-blur-md rounded-3xl p-5 border border-[#E5A995]/25 shadow-lg relative overflow-hidden group hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF7F4] to-transparent opacity-60" />
                <div className="relative flex flex-col items-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#FFF0EB" strokeWidth="4" fill="transparent" />
                    <circle cx="48" cy="48" r="40" stroke="url(#goldGradient)" strokeWidth="6" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={(2 * Math.PI * 40) * (1 - timeLeft.minutes / 60)} strokeLinecap="round" fill="transparent" className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute top-[34px] left-1/2 -translate-x-1/2 text-center">
                    <span className="block font-cinzel text-2xl md:text-3xl font-extrabold text-[#8E4A37] tracking-tighter leading-none group-hover:scale-110 transition-transform">
                      {timeLeft.minutes}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#A86450] font-bold mt-4 block">Minutes</span>
                </div>
              </div>

              {/* SECONDS DIAL */}
              <div className="bg-white/75 backdrop-blur-md rounded-3xl p-5 border border-[#E5A995]/25 shadow-lg relative overflow-hidden group hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF7F4] to-transparent opacity-60" />
                <div className="relative flex flex-col items-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#FFF0EB" strokeWidth="4" fill="transparent" />
                    <circle cx="48" cy="48" r="40" stroke="url(#goldGradient)" strokeWidth="6" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={(2 * Math.PI * 40) * (1 - timeLeft.seconds / 60)} strokeLinecap="round" fill="transparent" />
                  </svg>
                  <div className="absolute top-[34px] left-1/2 -translate-x-1/2 text-center">
                    <span className="block font-cinzel text-2xl md:text-3xl font-extrabold text-[#D4AF37] tracking-tighter leading-none animate-pulse">
                      {timeLeft.seconds}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#A86450] font-bold mt-4 block">Seconds</span>
                </div>
              </div>

            </div>

            {/* Reusable Gradient Defs for SVG Dials */}
            <svg className="w-0 h-0 absolute pointer-events-none">
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E5A995" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#8E4A37" />
                </linearGradient>
              </defs>
            </svg>

          </div>
        </section>

        {/* CEREMONIES SECTION */}
        <section id="ceremonies-section" className="py-8 px-2 max-w-4xl mx-auto z-30 relative scroll-mt-6">
         
         <div className="shadow-[0_20px_50px_rgba(229,169,149,0.15)] p-6 md:p-12 relative overflow-hidden transition-all duration-500">
              <div className="space-y-6 transition-opacity duration-300">
                <div className="p-5 rounded-2xl max-w-2xl mx-auto text-center space-y-2">
                  <p className="text-base font-bold text-[#5A4540] font-cinzel">
                   S/O. Mr. Stephen Joseph & Mrs. Rasin Stephen
                  </p>
                  <p className="text-xs text-[#A86450] italic">
                    Thengaparambil(H), Kumarakom, Kottayam
                  </p>
                </div>

                <div className="text-center py-4 bg-gradient-to-r from-transparent via-white to-transparent rounded-xl">
              
                  <h3 className="font-cinzel text-xl md:text-2xl font-bold text-[#D4AF37] tracking-widest">
                    Adv. JOSEPH STEPHEN
                  </h3>
                  <p className="font-vibes text-3xl text-[#E5A995] my-1">&</p>
                  <h3 className="font-cinzel text-xl md:text-2xl font-bold text-[#D4AF37] tracking-widest">
                    ANEY K JOSEPH
                  </h3>
                </div>

                <div className="p-5 rounded-2xl max-w-2xl mx-auto text-center space-y-2">
                  <p className="text-base font-bold text-[#5A4540] font-cinzel">
                   D/O. Mr. K. A. Babukutty (Late) & Mrs. Luciamma Joseph
                  </p>
                  <p className="text-xs text-[#A86450] italic">
                    Kadamthodu(H), Nalukody, Changanacherry
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E5A995]/20 max-w-2xl mx-auto">
                  <div className="flex items-start gap-4 bg-[#FFFBF9] p-3 rounded-xl border border-[#E5A995]/10">
                    <div className="w-11 h-11 rounded-full bg-[#FFF5F1] flex items-center justify-center text-[#D4AF37] shrink-0 border border-[#E5A995]/20 mt-1">
                      <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p className="font-cinzel text-[9px] uppercase tracking-widest text-[#A86450] font-bold">Wedding Date & Time</p>
                      <p className="font-playfair text-base font-bold text-[#5A4540]">Thursday, July 16, 2026</p>
                      <p className="font-cinzel text-sm font-semibold text-[#D4AF37]">03:30 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-[#FFFBF9] p-3 rounded-xl border border-[#E5A995]/10">
                    <div className="w-11 h-11 rounded-full bg-[#FFF5F1] flex items-center justify-center text-[#D4AF37] shrink-0 border border-[#E5A995]/20 mt-1">
                      <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <div>
                      <p className="font-cinzel text-[9px] uppercase tracking-widest text-[#A86450] font-bold">Venue</p>
                      <p className="font-playfair text-base font-bold text-[#5A4540]">Nava Nazareth Church</p>
                      <p className="text-xs text-[#A86450] font-semibold">Kumarakom, Kottayam</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E5A995]/15 text-center space-y-4">
                  <p className="text-xs text-[#8E4A37] font-semibold italic">Followed by Reception starting from 07:00 PM onwards</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <a 
                      href="https://maps.google.com/?q=Nava+Nazareth+Church+Kumarakom" 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-cinzel text-[10px] font-bold uppercase tracking-widest text-white bg-[#E5A995] hover:bg-[#D59883] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            
          </div>
        </section>


      </div>
    </div>
  );
}