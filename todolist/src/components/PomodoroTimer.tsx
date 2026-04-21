import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Briefcase, Volume2, VolumeX, Settings, X, Check, Music } from 'lucide-react';

type TimerMode = 'work' | 'break';
type TimerStatus = 'idle' | 'running' | 'paused';

interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  soundEnabled: boolean;
  ambientSoundEnabled: boolean;
}

interface Stats {
  completedPomodoros: number;
  totalWorkTime: number;
  currentSessionCount: number; // 当前会话周期计数（用于4个番茄后停止）
}

const STORAGE_KEY_SETTINGS = 'pomodoro_settings';
const STORAGE_KEY_STATS = 'pomodoro_stats';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  breakDuration: 5,
  soundEnabled: true,
  ambientSoundEnabled: false,
};

const DEFAULT_STATS: Stats = {
  completedPomodoros: 0,
  totalWorkTime: 0,
  currentSessionCount: 0,
};

// 外部音频文件路径
// 使用免费的在线音效资源，也可以替换为本地文件
const NOTIFICATION_SOUND_URL = '/sounds/notification.mp3';
const AMBIENT_SOUND_URL = '/sounds/ambient.mp3';

// 使用 Web Audio API 生成回退提示音
const playFallbackNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
    oscillator.type = 'sine';
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.6);
  } catch (error) {
    console.error('播放回退提示音失败:', error);
  }
};

// 播放提示音（使用外部音频文件，失败时使用回退方案）
const playNotificationSound = () => {
  try {
    const audio = new Audio(NOTIFICATION_SOUND_URL);
    audio.volume = 0.5;
    audio.play().catch(() => {
      // 外部文件播放失败，使用回退方案
      playFallbackNotificationSound();
    });
  } catch (error) {
    // 创建 Audio 失败，使用回退方案
    playFallbackNotificationSound();
  }
};

// 背景音管理器（使用外部音频文件）
class AmbientSoundManager {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;

  constructor() {
    this.audio = new Audio(AMBIENT_SOUND_URL);
    this.audio.loop = true;
    this.audio.volume = 0.3;
  }

  start() {
    if (this.isPlaying || !this.audio) return;
    
    // 淡入效果
    this.audio.volume = 0;
    this.audio.play().then(() => {
      this.isPlaying = true;
      // 渐增音量
      const fadeIn = setInterval(() => {
        if (this.audio && this.audio.volume < 0.3) {
          this.audio.volume = Math.min(0.3, this.audio.volume + 0.01);
        } else {
          clearInterval(fadeIn);
        }
      }, 100);
    }).catch(error => {
      console.error('播放背景音失败:', error);
    });
  }

  stop() {
    if (!this.isPlaying || !this.audio) return;
    
    // 淡出效果
    const fadeOut = setInterval(() => {
      if (this.audio && this.audio.volume > 0.01) {
        this.audio.volume -= 0.01;
      } else {
        clearInterval(fadeOut);
        this.audio?.pause();
        this.audio!.currentTime = 0;
        this.isPlaying = false;
      }
    }, 100);
  }

  isActive() {
    return this.isPlaying;
  }
}

export default function PomodoroTimer() {
  // State
  const [mode, setMode] = useState<TimerMode>('work');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.workDuration * 60);
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ambientSoundRef = useRef<AmbientSoundManager | null>(null);

  // Load settings and stats from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
    const savedStats = localStorage.getItem(STORAGE_KEY_STATS);
    
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setTempSettings(parsed);
      setTimeLeft(parsed.workDuration * 60);
    }
    
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  }, [stats]);

  // Timer logic
  useEffect(() => {
    if (status === 'running' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      
      // 开始休息时播放背景音
      if (mode === 'break' && settings.ambientSoundEnabled) {
        if (!ambientSoundRef.current) {
          ambientSoundRef.current = new AmbientSoundManager();
        }
        ambientSoundRef.current.start();
      }
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, timeLeft, mode, settings.ambientSoundEnabled]);

  // 背景音控制（休息时播放，工作时停止）
  useEffect(() => {
    if (!ambientSoundRef.current) {
      ambientSoundRef.current = new AmbientSoundManager();
    }
    
    if (status === 'running' && mode === 'break' && settings.ambientSoundEnabled) {
      ambientSoundRef.current.start();
    } else {
      ambientSoundRef.current.stop();
    }
  }, [status, mode, settings.ambientSoundEnabled]);

  // Update document title
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `${timeString} - ${mode === 'work' ? '工作' : '休息'}`;
  }, [timeLeft, mode]);

  const handleTimerComplete = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Play sound
    if (settings.soundEnabled) {
      playNotificationSound();
    }
    
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('番茄钟', {
        body: '时间到了，该休息了！',
        icon: '/favicon.ico',
      });
    }
    
    // Update stats
    let newSessionCount = stats.currentSessionCount;
    if (mode === 'work') {
      newSessionCount = stats.currentSessionCount + 1;
      setStats((prev) => ({
        ...prev,
        completedPomodoros: prev.completedPomodoros + 1,
        totalWorkTime: prev.totalWorkTime + settings.workDuration,
        currentSessionCount: newSessionCount,
      }));
    }
    
    // Check if 4 pomodoros completed
    if (newSessionCount >= 4) {
      // Stop after 4 pomodoros
      setStatus('idle');
      // Show completion notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('番茄钟', {
          body: '🎉 已完成4个番茄钟，休息一下吧！',
          icon: '/favicon.ico',
        });
      }
      return;
    }
    
    // Switch mode and auto-start next phase
    const nextMode = mode === 'work' ? 'break' : 'work';
    setMode(nextMode);
    setTimeLeft(nextMode === 'work' ? settings.workDuration * 60 : settings.breakDuration * 60);
    // Auto-start the next phase instead of setting to idle
    setStatus('running');
  }, [mode, settings, stats.currentSessionCount]);

  const handleStart = () => setStatus('running');
  const handlePause = () => setStatus('paused');
  
  const handleReset = () => {
    setStatus('idle');
    setTimeLeft(mode === 'work' ? settings.workDuration * 60 : settings.breakDuration * 60);
    // Reset session count when manually resetting
    setStats((prev) => ({
      ...prev,
      currentSessionCount: 0,
    }));
  };

  const handleModeSwitch = (newMode: TimerMode) => {
    setMode(newMode);
    setStatus('idle');
    setTimeLeft(newMode === 'work' ? settings.workDuration * 60 : settings.breakDuration * 60);
  };

  const handleSaveSettings = () => {
    setSettings(tempSettings);
    setShowSettings(false);
    if (mode === 'work') {
      setTimeLeft(tempSettings.workDuration * 60);
    } else {
      setTimeLeft(tempSettings.breakDuration * 60);
    }
    setStatus('idle');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? ((settings.workDuration * 60 - timeLeft) / (settings.workDuration * 60)) * 100
    : ((settings.breakDuration * 60 - timeLeft) / (settings.breakDuration * 60)) * 100;

  return (
    <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-[#1a1a20] rounded-3xl p-8 shadow-2xl border border-[#2e303a]">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
              <span className="text-3xl">🍅</span>
              番茄钟
            </h1>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl bg-[#2e303a] hover:bg-[#3a3c47] transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-2 mb-8 p-1 bg-[#0f0f12] rounded-2xl">
            <button
              onClick={() => handleModeSwitch('work')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                mode === 'work'
                  ? 'bg-[#f97316] text-white shadow-lg shadow-orange-500/25'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              工作
            </button>
            <button
              onClick={() => handleModeSwitch('break')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                mode === 'break'
                  ? 'bg-[#22c55e] text-white shadow-lg shadow-green-500/25'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Coffee className="w-4 h-4" />
              休息
            </button>
          </div>

          {/* Timer Display */}
          <div className="relative mb-8">
            {/* Progress Ring */}
            <svg className="w-64 h-64 mx-auto transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="#2e303a"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="120"
                stroke={mode === 'work' ? '#f97316' : '#22c55e'}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 120}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 120 * (1 - progress / 100)}` }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            
            {/* Time Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div 
                key={timeLeft}
                initial={{ scale: 0.95, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl font-bold text-gray-100 tracking-tight"
              >
                {formatTime(timeLeft)}
              </motion.div>
              <p className="text-gray-500 mt-2 font-medium">
                {status === 'idle' && '准备开始'}
                {status === 'running' && (mode === 'work' ? '专注中...' : '休息中...')}
                {status === 'paused' && '已暂停'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="p-4 rounded-2xl bg-[#2e303a] hover:bg-[#3a3c47] transition-colors"
            >
              <RotateCcw className="w-6 h-6 text-gray-400" />
            </motion.button>

            {status === 'running' ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePause}
                className="px-8 py-4 rounded-2xl bg-[#2e303a] hover:bg-[#3a3c47] transition-colors flex items-center gap-2"
              >
                <Pause className="w-6 h-6 text-gray-200" />
                <span className="text-gray-200 font-medium">暂停</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className={`px-8 py-4 rounded-2xl transition-colors flex items-center gap-2 shadow-lg ${
                  mode === 'work'
                    ? 'bg-[#f97316] hover:bg-[#ea580c] shadow-orange-500/25'
                    : 'bg-[#22c55e] hover:bg-[#16a34a] shadow-green-500/25'
                }`}
              >
                <Play className="w-6 h-6 text-white" />
                <span className="text-white font-medium">
                  {status === 'paused' ? '继续' : '开始'}
                </span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
              className="p-4 rounded-2xl bg-[#2e303a] hover:bg-[#3a3c47] transition-colors"
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-6 h-6 text-gray-400" />
              ) : (
                <VolumeX className="w-6 h-6 text-gray-500" />
              )}
            </motion.button>
          </div>

          {/* Ambient Sound Toggle - Only show in break mode */}
          {mode === 'break' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center"
            >
              <button
                onClick={() => setSettings(s => ({ ...s, ambientSoundEnabled: !s.ambientSoundEnabled }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  settings.ambientSoundEnabled
                    ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30'
                    : 'bg-[#2e303a] text-gray-400 border border-transparent'
                }`}
              >
                <Music className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {settings.ambientSoundEnabled ? '休息音乐开启' : '休息音乐关闭'}
                </span>
              </button>
            </motion.div>
          )}
        </div>

        {/* Stats Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 bg-[#1a1a20] rounded-2xl p-6 border border-[#2e303a]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">今日完成</p>
              <p className="text-2xl font-bold text-gray-100">
                {stats.completedPomodoros} <span className="text-sm font-normal text-gray-500">个番茄</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm">当前周期</p>
              <p className="text-2xl font-bold text-gray-100">
                {stats.currentSessionCount} <span className="text-sm font-normal text-gray-500">/ 4</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">专注时长</p>
              <p className="text-2xl font-bold text-gray-100">
                {stats.totalWorkTime} <span className="text-sm font-normal text-gray-500">分钟</span>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a20] rounded-2xl p-6 w-full max-w-sm border border-[#2e303a]"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-100">设置</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 rounded-lg hover:bg-[#2e303a] transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">工作时长（分钟）</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={tempSettings.workDuration}
                    onChange={(e) => setTempSettings(s => ({ ...s, workDuration: parseInt(e.target.value) || 25 }))}
                    className="w-full bg-[#0f0f12] border border-[#2e303a] rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-[#f97316] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">休息时长（分钟）</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={tempSettings.breakDuration}
                    onChange={(e) => setTempSettings(s => ({ ...s, breakDuration: parseInt(e.target.value) || 5 }))}
                    className="w-full bg-[#0f0f12] border border-[#2e303a] rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-[#22c55e] transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">提示音</span>
                  <button
                    onClick={() => setTempSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      tempSettings.soundEnabled ? 'bg-[#22c55e]' : 'bg-[#2e303a]'
                    }`}
                  >
                    <motion.div
                      animate={{ x: tempSettings.soundEnabled ? 24 : 2 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">休息音乐</span>
                  </div>
                  <button
                    onClick={() => setTempSettings(s => ({ ...s, ambientSoundEnabled: !s.ambientSoundEnabled }))}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      tempSettings.ambientSoundEnabled ? 'bg-[#22c55e]' : 'bg-[#2e303a]'
                    }`}
                  >
                    <motion.div
                      animate={{ x: tempSettings.ambientSoundEnabled ? 24 : 2 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                    />
                  </button>
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full mt-6 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                保存设置
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
