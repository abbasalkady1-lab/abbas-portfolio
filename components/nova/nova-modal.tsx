"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Mic, MicOff, Volume2, VolumeX, X, Send, Sparkles, RefreshCw } from "lucide-react";
import { NovaSphere, NovaState } from "./nova-sphere";
import { VoiceVisualizer } from "./voice-visualizer";
import { useRouter } from "next/navigation";

interface NovaModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "en" | "ar";
  theme?: "light" | "dark";
}

interface ChatMessage {
  id: string;
  sender: "user" | "nova";
  text: string;
  timestamp: string;
}

export function NovaModal({ isOpen, onClose, lang, theme }: NovaModalProps) {
  const router = useRouter();
  const [novaState, setNovaState] = useState<NovaState>("IDLE");
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Initial welcome greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting =
        lang === "ar"
          ? "أهلاً بك! أنا نوفا (NOVA)، المساعد الذكي والممثل الرقمي لعباس القاضي. تفضل بسؤالي عن مشاريعه في الذكاء الاصطناعي، أنظمة الأتمتة، أو كيفية التواصل معه."
          : "Greetings! I am NOVA, Abbas El Kady's digital AI representative. Ask me anything about his AI projects, n8n automations, technical skills, or how to collaborate with him.";

      setMessages([
        {
          id: "welcome",
          sender: "nova",
          text: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      speakText(greeting, lang === "ar" ? "ar-SA" : "en-US");
    }
  }, [isOpen, lang]);

  // Setup Web Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = lang === "ar" ? "ar-SA" : "en-US";

        recognition.onstart = () => {
          setIsListening(true);
          setNovaState("LISTENING");
          setAudioLevel(0.6);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            handleSendMessage(transcript);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
          setNovaState("IDLE");
          setAudioLevel(0);
        };

        recognition.onend = () => {
          setIsListening(false);
          setAudioLevel(0);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [lang]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speech Synthesis helper
  const speakText = (text: string, langCode: string) => {
    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setNovaState("SPEAKING");
      setAudioLevel(0.8);
    };

    utterance.onend = () => {
      setNovaState("IDLE");
      setAudioLevel(0);
    };

    utterance.onerror = () => {
      setNovaState("IDLE");
      setAudioLevel(0);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. You can use the text chat below.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setNovaState("IDLE");
    } else {
      // Cancel any ongoing speech before listening
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Safe structured action dispatcher
  const executeSiteAction = (actionStr: string) => {
    if (!actionStr) return;
    const parts = actionStr.split(":");
    const actionType = parts[0];
    const target = parts[1];

    if (actionType === "NAVIGATE_SECTION") {
      onClose();
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(`/#${target}`);
      }
    } else if (actionType === "OPEN_PROJECT" && target) {
      onClose();
      router.push(`/projects/${target}`);
    } else if (actionType === "FILTER_PROJECTS") {
      onClose();
      const el = document.getElementById("projects");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (actionType === "OPEN_CV") {
      onClose();
      const el = document.getElementById("cv");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (actionType === "CONTACT_ABBAS") {
      onClose();
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setNovaState("THINKING");

    try {
      const res = await fetch("/api/nova/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, language: lang }),
      });

      if (!res.ok) throw new Error("API failed");
      const data = await res.json();

      const novaMsg: ChatMessage = {
        id: "msg-" + Date.now() + "-nova",
        sender: "nova",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, novaMsg]);

      // Speak answer
      speakText(data.reply, data.language === "ar" ? "ar-SA" : "en-US");

      // Execute safe structured site action if returned
      if (data.action) {
        setTimeout(() => {
          executeSiteAction(data.action);
        }, 1200);
      }
    } catch (err) {
      setNovaState("ERROR");
      const errorMsg: ChatMessage = {
        id: "msg-" + Date.now() + "-err",
        sender: "nova",
        text:
          lang === "ar"
            ? "عذراً، حدث خطأ في الاتصال بنظام الذكاء الاصطناعي. يرجى المحاولة ثانية."
            : "Apologies, communication with the neural core encountered an issue. Please retry.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setTimeout(() => setNovaState("IDLE"), 2500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-2xl bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-white/15 rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 dark:shadow-black/80 flex flex-col max-h-[90vh] relative"
          >
            {/* Top Bar Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-black/30">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-white/[0.04] border border-sky-100 dark:border-white/10 flex items-center justify-center text-sky-600 dark:text-cyan-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span
                    className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${
                      novaState === "LISTENING"
                        ? "bg-sky-500 dark:bg-cyan-400 animate-ping"
                        : novaState === "THINKING"
                        ? "bg-indigo-500 dark:bg-indigo-400 animate-spin"
                        : novaState === "SPEAKING"
                        ? "bg-sky-500 dark:bg-cyan-400 animate-pulse"
                        : "bg-emerald-500 dark:bg-emerald-400"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="font-sans text-sm font-semibold text-slate-900 dark:text-white tracking-wide">
                      NOVA
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-50 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-500/20 text-sky-700 dark:text-cyan-400 font-mono">
                      V3.4 CORE
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                    Status: <span className="text-sky-600 dark:text-cyan-400 font-semibold">{novaState}</span>
                  </div>
                </div>
              </div>

              {/* Controls: Mute & Close */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => {
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                    setIsMuted(!isMuted);
                  }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors"
                  title={isMuted ? "Unmute Voice" : "Mute Voice"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-500 dark:text-red-400" /> : <Volume2 className="w-4 h-4 text-sky-600 dark:text-cyan-400" />}
                </button>
                <button
                  onClick={() => {
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                    if (recognitionRef.current && isListening) recognitionRef.current.stop();
                    onClose();
                  }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-red-50 dark:hover:bg-red-500/20 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-white/10 transition-colors"
                  title="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3D Character & Waveform Display */}
            <div className="h-44 sm:h-52 w-full bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-[#090A0F] dark:to-[#0D111A] relative flex flex-col items-center justify-center border-b border-slate-100 dark:border-white/5 overflow-hidden">
              <div className="w-40 h-40 relative">
                <NovaSphere state={novaState} audioLevel={audioLevel} />
              </div>

              {/* Real-time Voice Waveform */}
              <div className="absolute bottom-2 w-full px-8">
                <VoiceVisualizer
                  isActive={novaState === "LISTENING" || novaState === "SPEAKING"}
                  audioLevel={audioLevel}
                  barsCount={28}
                />
              </div>
            </div>

            {/* Chat Transcript Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 font-sans text-xs sm:text-sm">
              {messages.map((msg) => {
                const isNova = msg.sender === "nova";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2.5 rtl:space-x-reverse ${
                      isNova ? "justify-start" : "justify-end flex-row-reverse space-x-reverse rtl:flex-row rtl:space-x-2.5"
                    }`}
                  >
                    {isNova && (
                      <div className="w-6 h-6 rounded-lg bg-sky-50 dark:bg-white/[0.04] border border-sky-100 dark:border-white/10 flex items-center justify-center text-sky-600 dark:text-cyan-400 shrink-0 mt-1">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed ${
                        isNova
                          ? "bg-slate-100 border border-slate-200/80 text-slate-800 dark:bg-white/[0.04] dark:border-white/10 dark:text-slate-200 font-sans"
                          : "bg-sky-600 text-white dark:bg-cyan-400 dark:text-slate-950 font-sans font-medium"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[9px] block mt-1 ${
                          isNova ? "text-slate-500" : "text-sky-100 dark:text-slate-800"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Bottom Interaction Controls */}
            <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-black/30 space-y-3">
              {/* Voice Action & Mic Button */}
              <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse">
                <button
                  onClick={toggleListening}
                  className={`relative flex items-center space-x-2 rtl:space-x-reverse px-6 py-2.5 rounded-full font-sans text-xs font-semibold transition-all shadow-md ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                      : "bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20 dark:bg-cyan-400 dark:hover:bg-cyan-300 dark:text-slate-950 hover:scale-[1.02]"
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>
                    {isListening
                      ? lang === "ar"
                        ? "جاري الاستماع... اضغط للإيقاف"
                        : "Listening... Press to Stop"
                      : lang === "ar"
                      ? "تحدث بالصوت مع NOVA"
                      : "Talk with Voice"}
                  </span>
                </button>
              </div>

              {/* Text Input Fallback */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2 rtl:space-x-reverse"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={
                    lang === "ar"
                      ? "أو اكتب سؤالك لـ NOVA هنا..."
                      : "Or type your inquiry to NOVA here..."
                  }
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-sky-500 text-slate-900 placeholder:text-slate-400 dark:bg-white/[0.03] dark:border-white/10 dark:focus:border-cyan-400 dark:text-white dark:placeholder:text-slate-500 font-sans text-xs sm:text-sm focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="p-2.5 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300 disabled:opacity-30 transition-all"
                  aria-label="Send query"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
