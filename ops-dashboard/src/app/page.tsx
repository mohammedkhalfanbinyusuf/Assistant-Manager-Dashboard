"use client";

import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, CheckSquare, Calendar, CreditCard, 
  Plus, X, ChevronRight, Circle, CheckCircle2, 
  MoreHorizontal, ArrowUpRight, ArrowDownRight,
  Clock, Users, FileText, Settings, Search,
  Menu, Bell, ChevronDown, Filter, Calendar as CalendarIcon,
  Zap, Shield, Target, TrendingUp, BarChart2, Pencil,
  Folder, FolderPlus, HardDrive, ArrowLeft
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import axios from 'axios';


function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 1. MOCK DATA ARRAYS
const REVENUE_DATA = [
  { id: 1, brand: 'Team N Makeovers', adv: 120000, receivable: 45000, target: 150000, achievement: 80, trend: [40, 55, 45, 70, 65, 80] },
  { id: 2, brand: 'Brandnest', adv: 85000, receivable: 12000, target: 100000, achievement: 85, trend: [30, 40, 60, 50, 75, 85] },
  { id: 3, brand: 'Finora', adv: 210000, receivable: 65000, target: 200000, achievement: 105, trend: [80, 90, 85, 95, 100, 105] },
  { id: 4, brand: 'Glow Up', adv: 45000, receivable: 8000, target: 50000, achievement: 90, trend: [20, 30, 45, 40, 55, 90] },
  { id: 5, brand: 'Pixel Point', adv: 130000, receivable: 25000, target: 140000, achievement: 92, trend: [50, 60, 70, 65, 80, 92] },
];

const KPI_DATA = [
  { label: 'Total Revenue', value: '$590,000', change: '+12.5%', isUp: true, detail: [
    { name: 'Completed', value: 450000, color: '#3b82f6' },
    { name: 'Pending', value: 140000, color: '#1e293b' }
  ]},
  { label: 'Total Receivable', value: '$155,000', change: '-2.4%', isUp: false, detail: [
    { name: 'Overdue', value: 35000, color: '#ef4444' },
    { name: 'Current', value: 120000, color: '#3b82f6' }
  ]},
  { label: 'Avg Achievement', value: '90.4%', change: '+5.2%', isUp: true, detail: [
    { name: 'Reached', value: 90.4, color: '#10b981' },
    { name: 'Gap', value: 9.6, color: '#1e293b' }
  ]},
];

const DEPT_PERFORMANCE = [
  { name: 'Marketing', score: 85 },
  { name: 'Ops', score: 92 },
  { name: 'Finance', score: 78 },
  { name: 'Sales', score: 95 },
  { name: 'Support', score: 88 },
];

const TASK_DATA = [
  { id: 1, task: 'Finalize Q2 Marketing Plan', assignedTo: 'Midlaj', deadline: '2024-05-01', priority: 'High', status: 'In Progress' },
  { id: 2, task: 'Client Presentation for Brandnest', assignedTo: 'Nancy', deadline: '2024-04-25', priority: 'Urgent', status: 'Pending' },
  { id: 3, task: 'Update Financial Records', assignedTo: 'Shuhib', deadline: '2024-04-28', priority: 'Medium', status: 'Completed' },
  { id: 4, task: 'Onboard New Designer', assignedTo: 'Jithya', deadline: '2024-05-05', priority: 'Low', status: 'Pending' },
  { id: 5, task: 'Audit Server Infrastructure', assignedTo: 'Jobin', deadline: '2024-04-30', priority: 'High', status: 'In Progress' },
  { id: 6, task: 'Review Content Strategy', assignedTo: 'Thakudu', deadline: '2024-05-02', priority: 'Medium', status: 'Pending' },
  { id: 7, task: 'Weekly Team Sync Preparation', assignedTo: 'Shibina', deadline: '2024-04-24', priority: 'Medium', status: 'In Progress' },
];

const SCHEDULE_DATA = [
  { id: 1, time: '06:00 AM', title: 'Morning Workout', type: 'Personal', withWhom: 'Self', status: 'Completed' },
  { id: 2, time: '08:30 AM', title: 'Breakfast & News', type: 'Personal', withWhom: 'Family', status: 'Completed' },
  { id: 3, time: '09:30 AM', title: 'Office Arrival & Prep', type: 'Office', withWhom: 'Self', status: 'Completed' },
  { id: 4, time: '11:00 AM', title: 'Brand Strategy Session', type: 'Office', withWhom: 'Marketing Team', status: 'In Progress' },
  { id: 5, time: '01:00 PM', title: 'Lunch Break', type: 'Personal', withWhom: 'Self', status: 'Pending' },
  { id: 6, time: '02:30 PM', title: 'Client Call - Brandnest', type: 'Office', withWhom: 'Nancy', status: 'Pending' },
  { id: 7, time: '04:00 PM', title: 'Finance Review', type: 'Office', withWhom: 'Shuhib', status: 'Pending' },
  { id: 8, time: '07:00 PM', title: 'Gym Session', type: 'Personal', withWhom: 'Trainer', status: 'Pending' },
  { id: 9, time: '09:00 PM', title: 'Dinner & Relaxation', type: 'Personal', withWhom: 'Family', status: 'Pending' },
  { id: 10, time: '10:30 PM', title: 'Daily Review & Planning', type: 'Office', withWhom: 'Self', status: 'Pending' },
];

const OFFICIAL_MEETING_DATA = [
  { 
    id: 1, 
    date: '2024-04-20', 
    title: 'Quarterly Strategy Sync', 
    department: 'Operations', 
    host: 'Jobin', 
    agenda: 'Reviewing Q1 performance and setting targets for Q2.',
    minutes: 'Decided to increase budget for IT infrastructure. Agreed on new hiring plan for the sales team.'
  },
  { 
    id: 2, 
    date: '2024-04-22', 
    title: 'IT Infrastructure Audit', 
    department: 'IT', 
    host: 'Shuhib', 
    agenda: 'Server health check and security audit.',
    minutes: 'Allocated funds for new cloud servers. Security patches to be applied by EOD Wednesday.'
  },
  { 
    id: 3, 
    date: '2024-04-23', 
    title: 'Marketing Budget Review', 
    department: 'Marketing', 
    host: 'Nancy', 
    agenda: 'Adjusting ad spend for Brandnest and Finora.',
    minutes: 'Reallocated 15% budget from Brandnest to Finora due to higher conversion rates.'
  },
];

const IMPLEMENTATION_DATA = [
  { 
    id: 1, 
    department: 'IT', 
    decision: 'Upgrade Server Cluster', 
    decisionDate: '2024-04-10', 
    completionDate: '2024-04-13', 
    basis: 'Meeting Sync #12 - Efficiency Audit', 
    outcomes: '30% faster load times, 15% reduction in bounce rate', 
    rate: 100, 
    responsibility: 'Shuhib', 
    status: 'Finished' 
  },
  { 
    id: 2, 
    department: 'Marketing', 
    decision: 'Social Media Campaign', 
    decisionDate: '2024-04-12', 
    completionDate: '2024-04-22', 
    basis: 'Quarterly Strategy Sync - Growth Goal', 
    outcomes: '500+ new leads, 12% increase in brand mentions', 
    rate: 100, 
    responsibility: 'Nancy', 
    status: 'Finished' 
  },
  { 
    id: 3, 
    department: 'Finance', 
    decision: 'Audit External Vendors', 
    decisionDate: '2024-04-15', 
    completionDate: null, 
    basis: 'Finance Review - Cost Optimization', 
    outcomes: 'Expected 10% cost reduction in cloud spend', 
    rate: 20, 
    responsibility: 'Jobin', 
    status: 'On-going' 
  },
  { 
    id: 4, 
    department: 'Sales', 
    decision: 'New CRM Integration', 
    decisionDate: '2024-04-18', 
    completionDate: '2024-04-20', 
    basis: 'Sales Team Feedback - Pipeline Velocity', 
    outcomes: 'Centralized lead tracking, 20% faster deal closing', 
    rate: 85, 
    responsibility: 'Midlaj', 
    status: 'On-going' 
  },
];

const FINANCE_DATA = [
  { id: 1, vendor: 'AWS Services', amount: '$1,200', date: '2024-04-20', status: 'Paid', method: 'Credit Card' },
  { id: 2, vendor: 'Office Rent', amount: '$5,000', date: '2024-04-01', status: 'Scheduled', method: 'Bank Transfer' },
  { id: 3, vendor: 'Freelancer - Design', amount: '$800', date: '2024-04-15', status: 'Paid', method: 'PayPal' },
];

const DOC_LOG = [
  { id: 1, name: 'Q2_Strategy_Draft.pdf', type: 'PDF', owner: 'Midlaj', date: '2024-04-10', folder: null },
  { id: 2, name: 'Brandnest_Assets.zip', type: 'Archive', owner: 'Nancy', date: '2024-04-12', folder: 'Marketing' },
  { id: 3, name: 'Tax_Returns_2023.pdf', type: 'PDF', owner: 'Jobin', date: '2024-03-25', folder: 'Finance' },
  { id: 4, name: 'Vendor_Agreement_V2.docx', type: 'DOC', owner: 'Shuhib', date: '2024-04-15', folder: 'Operations' },
];

const FOLDERS = [
  { id: 'f1', name: 'Marketing', count: 12, size: '45MB' },
  { id: 'f2', name: 'Finance', count: 5, size: '12MB' },
  { id: 'f3', name: 'Operations', count: 8, size: '28MB' },
  { id: 'f4', name: 'Legal', count: 3, size: '15MB' },
];

const CHECKLIST_DATA = {
  morning: [
    { id: 'm1', text: 'Check emails and Slack messages', completed: true },
    { id: 'm2', text: 'Review daily schedule and meetings', completed: true },
    { id: 'm3', text: 'Set top 3 priorities for the day', completed: false },
  ],
  during: [
    { id: 'd1', text: 'Conduct standup meeting', completed: true },
    { id: 'd2', text: 'Update task progress in Task Hub', completed: false },
    { id: 'd3', text: 'Follow up on pending approvals', completed: false },
  ],
  end: [
    { id: 'e1', text: 'Summarize meeting action items', completed: false },
    { id: 'e2', text: 'Schedule tomorrow\'s priority tasks', completed: false },
    { id: 'e3', text: 'System backup and log off', completed: false },
  ]
};

// 2. REUSABLE UI PRIMITIVES
const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-2xl bg-white/5 border border-white/5", className)} />
);

const KPISkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
  </div>
);

const TableSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
  </div>
);

const NotificationToast = ({ message, type = 'success', onClose }: { message: string, type?: 'success' | 'error', onClose: () => void }) => (
  <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-right-10 fade-in duration-300">
    <div className={cn(
      "flex items-center gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl",
      type === 'success' ? "bg-[#1c1c1e]/90 border-white/10" : "bg-rose-500/10 border-rose-500/20"
    )}>
      <div className={cn("h-2 w-2 rounded-full animate-pulse", type === 'success' ? "bg-blue-500" : "bg-rose-500")} />
      <span className={cn("text-sm font-medium", type === 'error' && "text-rose-400")}>{message}</span>
      <button onClick={onClose} className="ml-4 text-white/20 hover:text-white"><X size={14} /></button>
    </div>
  </div>
);

const AdminLogin = ({ onLogin }: { onLogin: (token: string, user: any) => void }) => {
  const [username, setUsername] = useState('jobin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      onLogin(res.data.token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Login failed. Check your connection.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-2xl shadow-blue-600/40">
            <Zap size={32} fill="white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">OpsCenter</h1>
          <p className="text-white/40 text-sm">Welcome back, Assistant Manager</p>
        </div>

        <GlassCard className="p-8 space-y-6">
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-blue-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Master Key</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "w-full rounded-2xl bg-white/5 border px-4 py-3 outline-none transition-all text-center tracking-[0.5em]",
                      error ? "border-rose-500 animate-shake" : "border-white/10 focus:border-blue-500/50"
                    )}
                  />
                </div>
              </div>
              {error && <p className="text-rose-500 text-[10px] text-center font-bold uppercase">{error}</p>}
              <button 
                disabled={isLoggingIn}
                className="w-full rounded-2xl bg-blue-600 py-4 font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
              >
                {isLoggingIn ? 'Verifying...' : 'Enter Command Center'}
              </button>
           </form>
        </GlassCard>
      </div>
    </div>
  );
};


const MiniCalendar = ({ selectedDate, onDateSelect }: { selectedDate: Date, onDateSelect: (d: Date) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getDate() === d2.getDate() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getFullYear() === d2.getFullYear();

  const daysInMonth = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    
    // Padding for start of month
    const firstDay = date.getDay();
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [viewDate]);

  const stripDays = useMemo(() => {
    const arr = [];
    const centerDate = new Date(selectedDate);
    for (let i = -3; i <= 3; i++) {
      const d = new Date(centerDate);
      d.setDate(centerDate.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [selectedDate]);

  const handleMonthChange = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 group text-sm font-bold text-white hover:text-blue-400 transition-colors"
        >
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          <ChevronDown size={16} className={cn("transition-transform duration-300", isExpanded && "rotate-180")} />
        </button>
        
        {isExpanded && (
          <div className="flex items-center gap-4">
             <button onClick={() => handleMonthChange(-1)} className="p-1 hover:bg-white/10 rounded-full text-white/40 hover:text-white"><ArrowLeft size={16} /></button>
             <span className="text-xs font-bold text-white/60 w-24 text-center">{viewDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
             <button onClick={() => handleMonthChange(1)} className="p-1 hover:bg-white/10 rounded-full text-white/40 hover:text-white"><ArrowLeft size={16} className="rotate-180" /></button>
          </div>
        )}
      </div>

      {!isExpanded ? (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar animate-in fade-in slide-in-from-top-2 duration-300">
          {stripDays.map((date, i) => {
            const active = isSameDay(date, selectedDate);
            return (
              <button
                key={i}
                onClick={() => onDateSelect(date)}
                className={cn(
                  "flex min-w-[60px] flex-col items-center gap-1 rounded-2xl py-3 transition-all duration-300",
                  active 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105" 
                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="text-lg font-bold">{date.getDate()}</span>
                {isSameDay(date, new Date()) && !active && (
                  <div className="h-1 w-1 rounded-full bg-blue-500 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <GlassCard className="p-4 animate-in fade-in zoom-in-95 duration-300">
           <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={`${d}-${i}`} className="text-center text-[10px] font-bold text-white/20 py-2">{d}</div>
              ))}
           </div>
           <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((date, i) => {
                if (!date) return <div key={`empty-${i}`} />;
                const active = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, new Date());
                
                return (
                  <button
                    key={i}
                    onClick={() => {
                      onDateSelect(date);
                      setIsExpanded(false);
                    }}
                    className={cn(
                      "aspect-square flex items-center justify-center rounded-xl text-sm transition-all",
                      active ? "bg-blue-600 text-white font-bold" : "hover:bg-white/5 text-white/70",
                      isToday && !active && "text-blue-500 font-bold"
                    )}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
           </div>
        </GlassCard>
      )}
    </div>
  );
};

const GlassCard = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={cn(
      "relative overflow-hidden rounded-3xl border border-white/10 bg-[#1c1c1e]/80 backdrop-blur-xl transition-all duration-300 hover:bg-[#1c1c1e]/90",
      onClick && "cursor-pointer active:scale-[0.98]",
      className
    )}
  >
    {children}
  </div>
);

const SideDrawer = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[70] h-full w-full max-w-md border-l border-white/10 bg-[#0a0a0a] shadow-2xl p-8 overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40">
                <X size={24} />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#1c1c1e]/90 backdrop-blur-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
              <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10 transition-colors text-white/40">
                <X size={24} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const StatusDropdown = ({ value, onChange, options, label }: { value: string, onChange: (val: string) => void, options: { label: string, color: string }[], label?: string }) => {
  return (
    <div className="space-y-2">
      {label && <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{label}</label>}
      <div className="relative group">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 py-3.5 text-sm font-medium outline-none focus:border-blue-500/50 transition-all cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.label} value={opt.label} className="bg-[#1c1c1e] text-white">{opt.label}</option>
          ))}
        </select>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          <div className={cn(
            "h-2 w-2 rounded-full",
            options.find(o => o.label === value)?.color || "bg-white/20"
          )} />
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover:text-white/40 transition-colors">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
};


const IOSSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <button 
    onClick={onChange}
    className={cn(
      "relative h-6 w-11 rounded-full transition-colors duration-200",
      checked ? "bg-blue-600" : "bg-[#3a3a3c]"
    )}
  >
    <div className={cn(
      "absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-transform duration-200 shadow-sm",
      checked ? "translate-x-5" : "translate-x-0"
    )} />
  </button>
);

const IOSCheckbox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <button 
    onClick={onChange}
    className={cn(
      "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200",
      checked ? "bg-blue-600 border-blue-600" : "bg-transparent border-white/20"
    )}
  >
    {checked && <CheckCircle2 size={16} className="text-white" />}
  </button>
);

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) => {
  const styles = {
    default: "bg-white/10 text-white/70",
    success: "bg-emerald-500/10 text-emerald-500",
    warning: "bg-amber-500/10 text-amber-500",
    danger: "bg-rose-500/10 text-rose-500",
    info: "bg-blue-500/10 text-blue-500",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", styles[variant])}>
      {children}
    </span>
  );
};

const CreationDrawerContent = ({ type, onSubmit, onClose, addNotification }: { type: string, onSubmit: (data: any) => void, onClose: () => void, addNotification: any }) => {
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      addNotification('Sync failed.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {type === 'revenue' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Brand Name</label>
            <input required onChange={(e) => handleChange('brand', e.target.value)} type="text" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="e.g. Finora" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Target ($)</label>
              <input required onChange={(e) => handleChange('target', Number(e.target.value))} type="number" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="100000" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Current ADV ($)</label>
              <input required onChange={(e) => handleChange('adv', Number(e.target.value))} type="number" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="0" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Receivable ($)</label>
              <input required onChange={(e) => handleChange('receivable', Number(e.target.value))} type="number" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="0" />
            </div>
          </div>
        </div>
      )}

      {type === 'tasks' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Task Title</label>
            <input required onChange={(e) => handleChange('title', e.target.value)} type="text" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="Finalize report..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Assignee</label>
              <input required onChange={(e) => handleChange('assignedTo', e.target.value)} type="text" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="Midlaj" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Deadline</label>
              <input required onChange={(e) => handleChange('deadline', e.target.value)} type="date" className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm" />
            </div>
          </div>
          <StatusDropdown 
            label="Priority"
            value={formData.priority || 'Medium'}
            onChange={(val) => handleChange('priority', val)}
            options={[
              { label: 'Urgent', color: 'bg-rose-500' },
              { label: 'High', color: 'bg-amber-500' },
              { label: 'Medium', color: 'bg-blue-500' },
              { label: 'Low', color: 'bg-white/20' }
            ]}
          />
        </div>
      )}

      {type === 'schedule' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Entry Title</label>
            <input required onChange={(e) => handleChange('title', e.target.value)} type="text" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="Morning Gym..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Time</label>
              <input required onChange={(e) => handleChange('time', e.target.value)} type="time" className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Type</label>
              <select onChange={(e) => handleChange('type', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm">
                <option>Personal</option>
                <option>Office</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {type === 'meetings' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Meeting Title</label>
            <input required onChange={(e) => handleChange('title', e.target.value)} type="text" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="Strategy Sync" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Host</label>
              <input required onChange={(e) => handleChange('host', e.target.value)} type="text" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="Jobin" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Department</label>
              <input required onChange={(e) => handleChange('department', e.target.value)} type="text" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="Operations" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Agenda</label>
            <textarea onChange={(e) => handleChange('agenda', e.target.value)} rows={3} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50 resize-none text-sm" placeholder="Key points to discuss..." />
          </div>
        </div>
      )}

      {type === 'implementation' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Decision / Strategy</label>
            <input required onChange={(e) => handleChange('decision', e.target.value)} type="text" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="Migrate to Cloud..." />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Basis (Why?)</label>
            <textarea required onChange={(e) => handleChange('basis', e.target.value)} rows={2} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50 resize-none text-sm" placeholder="Efficiency Audit #14" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Department</label>
               <input required onChange={(e) => handleChange('department', e.target.value)} type="text" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="IT" />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Responsibility</label>
               <input required onChange={(e) => handleChange('responsibility', e.target.value)} type="text" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="Shuhib" />
             </div>
          </div>
        </div>
      )}

      {type === 'finance' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Vendor / File Name</label>
            <input required onChange={(e) => handleChange('name', e.target.value)} type="text" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="Google Workspace Invoice" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Amount ($)</label>
              <input onChange={(e) => handleChange('amount', e.target.value)} type="text" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="29.99" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Category</label>
              <select onChange={(e) => handleChange('category', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm">
                <option>Payment</option>
                <option>Document</option>
                <option>Legal</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {type === 'checklist' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Action Item</label>
            <input required onChange={(e) => handleChange('item', e.target.value)} type="text" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="Review morning logs..." />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Schedule</label>
            <select onChange={(e) => handleChange('category', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm">
              <option value="morning">Morning (Prep)</option>
              <option value="during">During (Ops)</option>
              <option value="end">End (Review)</option>
            </select>
          </div>
        </div>
      )}


      <button 
        type="submit" 
        disabled={isSaving}
        className="w-full rounded-2xl bg-blue-600 py-4 font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
      >
        {isSaving ? 'Synchronizing...' : `Save ${type.charAt(0).toUpperCase()}${type.slice(1, -1)} Entry`}
      </button>
    </form>
  );
};
const GlobalDashboard = ({ setEditTarget, stats }: { setEditTarget: any, stats: any }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Executive Overview</h1>
          <p className="text-sm text-white/40">Real-time operational intelligence across all departments</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
           <TrendingUp size={14} /> System Performance: Optimal
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-xs font-bold uppercase tracking-wider">Revenue</span>
            <CreditCard size={16} />
          </div>
          <div className="text-2xl font-bold">{stats.revenue}</div>
          <div className="flex items-center gap-2 text-[10px] text-emerald-500">
             <ArrowUpRight size={12} /> +12.5% vs last month
          </div>
        </GlassCard>
        
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-xs font-bold uppercase tracking-wider">Task Velocity</span>
            <CheckSquare size={16} />
          </div>
          <div className="text-2xl font-bold">{stats.velocity}</div>
          <div className="flex items-center gap-2 text-[10px] text-emerald-500">
             <ArrowUpRight size={12} /> +5% efficiency
          </div>
        </GlassCard>

        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-xs font-bold uppercase tracking-wider">Meeting Syncs</span>
            <Calendar size={16} />
          </div>
          <div className="text-2xl font-bold">{stats.meetings}</div>
          <div className="flex items-center gap-2 text-[10px] text-white/40">
             Official Ledger Active
          </div>
        </GlassCard>

        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-xs font-bold uppercase tracking-wider">Implementation</span>
            <Target size={16} />
          </div>
          <div className="text-2xl font-bold">{stats.implementation}</div>
          <div className="flex items-center gap-2 text-[10px] text-blue-400">
             Tracking active decisions
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Department Efficiency */}
        <GlassCard className="p-6">
          <h3 className="mb-6 text-sm font-bold text-white/60 uppercase tracking-widest">Department Efficiency</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_PERFORMANCE} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} width={70} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1c1c1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Task Distribution */}
        <GlassCard className="p-6">
          <h3 className="mb-6 text-sm font-bold text-white/60 uppercase tracking-widest">Task Workload</h3>
          <div className="space-y-4">
             {['Midlaj', 'Nancy', 'Shuhib', 'Jobin'].map((name) => (
               <div key={name} className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-[10px] font-bold text-blue-400 border border-blue-500/20">
                    {name[0]}
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center justify-between text-xs mb-1">
                        <span>{name}</span>
                        <span className="text-white/40">4 Tasks</span>
                     </div>
                     <div className="h-1 w-full rounded-full bg-white/5">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </GlassCard>

        {/* Critical Implementation */}
        <GlassCard className="p-6">
          <h3 className="mb-6 text-sm font-bold text-white/60 uppercase tracking-widest">Critical Decisions</h3>
          <div className="space-y-4">
             {IMPLEMENTATION_DATA.slice(0, 3).map((item) => (
               <div key={item.id} className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                     <Badge variant="info">{item.department}</Badge>
                     <span className="text-[10px] font-bold text-emerald-500">{item.rate}%</span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed">{item.decision}</p>
               </div>
             ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const RevenueDashboard = ({ setEditTarget, brands, setIsAdding }: { setEditTarget: any, brands: any[], setIsAdding: (v: boolean) => void }) => {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedKPI, setSelectedKPI] = useState<any>(null);

  const stats = useMemo(() => {
    const totalRev = brands.reduce((acc, b) => acc + b.adv, 0);
    const totalReceivable = brands.reduce((acc, b) => acc + b.receivable, 0);
    const avgAchievement = brands.length > 0 ? brands.reduce((acc, b) => acc + b.achievement, 0) / brands.length : 0;
    return { totalRev, totalReceivable, avgAchievement };
  }, [brands]);

  const trendData = useMemo(() => {
    if (!selectedRow) return [];
    return selectedRow.trend.map((val: number, i: number) => ({ month: `M${i+1}`, val }));
  }, [selectedRow]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revenue Hub</h1>
          <p className="text-sm text-white/40">Brand performance and financial targets</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> Add New Brand
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {KPI_DATA.map((kpi, i) => (
          <GlassCard key={i} onClick={() => setSelectedKPI(kpi)} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/60">{kpi.label}</span>
              {kpi.isUp ? <TrendingUp size={16} className="text-emerald-500" /> : <TrendingUp size={16} className="text-rose-500 rotate-180" />}
            </div>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-2xl font-bold">{kpi.value}</span>
              <span className={cn("text-xs font-semibold", kpi.isUp ? "text-emerald-500" : "text-rose-500")}>
                {kpi.change}
              </span>
            </div>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-blue-600" style={{ width: '70%' }} />
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="overflow-x-auto">
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Brand Performance Ledger</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-sm font-medium text-white/40">
                <th className="pb-4 pr-4">Brand</th>
                <th className="pb-4 pr-4">ADV</th>
                <th className="pb-4 pr-4">Receivable</th>
                <th className="pb-4 pr-4">Target</th>
                <th className="pb-4">Achievement</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {brands.map((row) => (
                <tr 
                  key={row.id} 
                  className="group border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 pr-4 font-medium cursor-pointer" onClick={() => setSelectedRow(row)}>{row.brand}</td>
                  <td className="py-4 pr-4">${(row.adv || 0).toLocaleString('en-US')}</td>
                  <td className="py-4 pr-4 text-rose-400">${(row.receivable || 0).toLocaleString('en-US')}</td>
                  <td className="py-4 pr-4 text-white/60">${(row.target || 0).toLocaleString('en-US')}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 rounded-full bg-white/10">
                        <div 
                          className={cn("h-full rounded-full", row.achievement >= 100 ? "bg-emerald-500" : "bg-blue-500")}
                          style={{ width: `${Math.min(row.achievement, 100)}%` }}
                        />
                      </div>
                      <span className="w-10 font-medium">{row.achievement}%</span>
                      <button 
                        onClick={() => setEditTarget({ type: 'brand', data: row })}
                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-full transition-all text-white/40"
                      >
                         <Pencil size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Row Click Modal (Trend Chart) */}
      <Modal isOpen={!!selectedRow} onClose={() => setSelectedRow(null)} title={`${selectedRow?.brand} Performance Trend`}>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1c1c1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              />
              <Area type="monotone" dataKey="val" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTrend)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/5 p-4 text-center">
            <div className="text-xs text-white/40">Highest</div>
            <div className="text-lg font-bold">${Math.max(...(selectedRow?.trend || [0]))}k</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 text-center">
            <div className="text-xs text-white/40">Lowest</div>
            <div className="text-lg font-bold">${Math.min(...(selectedRow?.trend || [0]))}k</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 text-center">
            <div className="text-xs text-white/40">Avg Growth</div>
            <div className="text-lg font-bold text-emerald-500">+14%</div>
          </div>
        </div>
      </Modal>

      {/* KPI Click Modal (Donut Chart) */}
      <Modal isOpen={!!selectedKPI} onClose={() => setSelectedKPI(null)} title={`${selectedKPI?.label} Breakdown`}>
        <div className="flex flex-col items-center">
          <div className="h-[250px] w-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={selectedKPI?.detail}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {selectedKPI?.detail.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1c1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid w-full grid-cols-2 gap-4">
            {selectedKPI?.detail.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-white/60">{item.name}</span>
                </div>
                <span className="text-sm font-bold">{(item.value || 0).toLocaleString('en-US')}</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

const TaskHub = ({ setEditTarget, tasks, setIsAdding }: { setEditTarget: any, tasks: any[], setIsAdding: (v: boolean) => void }) => {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const kanbanColumns = ['To Do', 'In Progress', 'Completed'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Task Hub</h1>
          <p className="text-sm text-white/40">Operation velocity: {Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100) || 0}% completion</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-full bg-white/5 p-1 border border-white/10">
            <button onClick={() => setView('list')} className={cn("px-4 py-1.5 text-xs font-bold rounded-full transition-all", view === 'list' ? "bg-white/10 text-white" : "text-white/40")}>List</button>
            <button onClick={() => setView('kanban')} className={cn("px-4 py-1.5 text-xs font-bold rounded-full transition-all", view === 'kanban' ? "bg-white/10 text-white" : "text-white/40")}>Board</button>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/10"
          >
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <GlassCard className="overflow-x-auto">
          <div className="p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-sm font-medium text-white/40">
                  <th className="pb-4 pr-4">Task</th>
                  <th className="pb-4 pr-4">Assigned To</th>
                  <th className="pb-4 pr-4">Deadline</th>
                  <th className="pb-4 pr-4">Priority</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {tasks.map((task) => (
                  <tr key={task.id} className="group border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 pr-4 font-medium">{task.task}</td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-400 border border-blue-500/30">
                          {task.assignedTo[0]}
                        </div>
                        {task.assignedTo}
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-white/60">{task.deadline}</td>
                    <td className="py-4 pr-4">
                      <Badge variant={task.priority === 'Urgent' ? 'danger' : task.priority === 'High' ? 'warning' : 'success'}>
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-2 w-2 rounded-full",
                            task.status === 'Completed' ? "bg-emerald-500" :
                            task.status === 'In Progress' ? "bg-blue-500" : "bg-white/20"
                          )} />
                          <span className="text-white/60">{task.status}</span>
                        </div>
                        <button 
                          onClick={() => setEditTarget({ type: 'task', data: task })}
                          className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-full transition-all text-white/40"
                        >
                           <Pencil size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {kanbanColumns.map((col) => (
            <div key={col} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">{col}</h3>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/40">
                  {tasks.filter(t => t.status === col).length}
                </span>
              </div>
              <div className="space-y-3">
                {tasks.filter(t => t.status === col).map((task) => (
                  <GlassCard key={task.id} className="p-4 hover:border-white/20">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-medium leading-relaxed">{task.task}</h4>
                      <button className="text-white/20 hover:text-white/60">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[8px] font-bold">
                          {task.assignedTo[0]}
                        </div>
                        <span className="text-[10px] text-white/40">{task.assignedTo}</span>
                      </div>
                      <span className="text-[10px] text-white/40">{task.deadline}</span>
                    </div>
                  </GlassCard>
                ))}
                <button 
                  onClick={() => setIsAdding(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 py-3 text-xs text-white/20 hover:border-white/20 hover:text-white/40 transition-all"
                >
                  <Plus size={14} /> New Task
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const DailySchedule = ({ setEditTarget, schedules, setIsAdding }: { setEditTarget: any, schedules: any[], setIsAdding: (v: boolean) => void }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [prevDate, setPrevDate] = useState(new Date());
  const [direction, setDirection] = useState(0);

  const handleDateSelect = (date: Date) => {
    setDirection(date > selectedDate ? 1 : -1);
    setPrevDate(selectedDate);
    setSelectedDate(date);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daily Schedule</h1>
          <p className="text-sm text-white/40">Operational Window: 6 AM - 11 PM</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> New Entry
        </button>
      </div>


      <MiniCalendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={selectedDate.toISOString()}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
        <GlassCard className="col-span-1 lg:col-span-2">
          <div className="p-6 sm:p-8">
            <div className="space-y-10 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
              {schedules.map((item) => (
                <div key={item.id} className="relative pl-10 group">
                  <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full bg-[#1c1c1e] border-2 border-blue-500 flex items-center justify-center z-10">
                    <div className={cn(
                      "h-2 w-2 rounded-full transition-all duration-300",
                      item.status === 'Completed' ? "bg-emerald-500 scale-125" : 
                      item.status === 'In Progress' ? "bg-blue-500 animate-pulse" : "bg-blue-500/30"
                    )} />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">{item.time}</span>
                        <Badge variant={item.type === 'Office' ? 'info' : 'default'}>{item.type}</Badge>
                      </div>
                      <h4 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{item.title}</h4>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 sm:text-right">
                       <div className="flex flex-col items-start sm:items-end">
                          <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">With Whom</span>
                          <span className="text-sm text-white/70">{item.withWhom}</span>
                       </div>
                       <div className="h-8 w-[1px] bg-white/10 hidden sm:block mx-2" />
                       <div className="flex items-center gap-2">
                          <Badge variant={item.status === 'Completed' ? 'success' : item.status === 'In Progress' ? 'info' : 'default'}>
                            {item.status}
                          </Badge>
                          <button 
                            onClick={() => setEditTarget({ type: 'schedule', data: item })}
                            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-full transition-all text-white/40"
                          >
                             <Pencil size={12} />
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest px-2">Operational Focus</h3>
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Daily Progress</span>
              <span className="text-sm font-bold text-emerald-500">70%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
               <div className="h-full bg-emerald-500" style={{ width: '70%' }} />
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              You have completed 7 out of 10 tasks scheduled for today. Keep it up!
            </p>
          </GlassCard>
          
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest px-2 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
               <GlassCard className="p-4 text-center">
                  <div className="text-xl font-bold">4.5h</div>
                  <div className="text-[10px] text-white/40 uppercase mt-1">Work Time</div>
               </GlassCard>
               <GlassCard className="p-4 text-center">
                  <div className="text-xl font-bold">3h</div>
                  <div className="text-[10px] text-white/40 uppercase mt-1">Personal</div>
               </GlassCard>
            </div>
          </div>
        </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const MeetingHub = ({ setEditTarget, meetings, setIsAdding }: { setEditTarget: any, meetings: any[], setIsAdding: (v: boolean) => void }) => {
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [isAddingMinutes, setIsAddingMinutes] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [direction, setDirection] = useState(0);

  const handleDateSelect = (date: Date) => {
    setDirection(date > selectedDate ? 1 : -1);
    setSelectedDate(date);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0
    })
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meeting Hub</h1>
          <p className="text-sm text-white/40">Official Ledger & Minutes Management</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <CalendarIcon size={18} /> Add Meeting
        </button>
      </div>


      <MiniCalendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={selectedDate.toISOString()}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 400, damping: 40 },
            opacity: { duration: 0.15 }
          }}
        >
          <GlassCard className="overflow-x-auto">
        <div className="p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-sm font-medium text-white/40">
                <th className="pb-4 pr-4">Date</th>
                <th className="pb-4 pr-4">Meeting Title</th>
                <th className="pb-4 pr-4">Department</th>
                <th className="pb-4">Host</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {meetings.map((meeting) => (
                <tr 
                  key={meeting.id} 
                  className="group border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 pr-4 text-white/60 cursor-pointer" onClick={() => setSelectedMeeting(meeting)}>{meeting.date}</td>
                  <td className="py-4 pr-4 font-medium cursor-pointer hover:text-blue-400 transition-colors" onClick={() => setSelectedMeeting(meeting)}>{meeting.title}</td>
                  <td className="py-4 pr-4">
                    <Badge variant="info">{meeting.department}</Badge>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-between">
                       <span className="font-medium">{meeting.host}</span>
                       <button 
                         onClick={() => setEditTarget({ type: 'meeting', data: meeting })}
                         className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-full transition-all text-white/40"
                       >
                          <Pencil size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
      </motion.div>
      </AnimatePresence>

      {/* Old Modal removed - functionality moved to global SideDrawer */}


      <Modal isOpen={!!selectedMeeting} onClose={() => setSelectedMeeting(null)} title="Meeting Details">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <div>
                <h3 className="text-lg font-bold">{selectedMeeting?.title}</h3>
                <p className="text-xs text-white/40">{selectedMeeting?.date} • {selectedMeeting?.department} • Host: {selectedMeeting?.host}</p>
             </div>
             <button 
                onClick={() => setIsAddingMinutes(true)}
                className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold hover:bg-white/10 transition-colors border border-white/10"
             >
                <Plus size={14} /> Add Minutes
             </button>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Agenda</h4>
            <p className="text-sm leading-relaxed text-white/80 bg-white/5 p-4 rounded-2xl border border-white/5">{selectedMeeting?.agenda}</p>
          </div>

          {selectedMeeting?.minutes && (
            <div>
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Minutes / Discussion</h4>
              <p className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">{selectedMeeting?.minutes}</p>
            </div>
          )}

          {isAddingMinutes && (
            <div className="mt-8 pt-6 border-t border-white/10 space-y-4 animate-in slide-in-from-bottom-4 duration-300">
               <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-blue-400">Recording Minutes</h4>
                  <button onClick={() => setIsAddingMinutes(false)} className="text-white/20 hover:text-white/60">
                     <X size={16} />
                  </button>
               </div>
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Discussion Summary</label>
                    <textarea 
                      rows={3}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50 transition-colors resize-none text-sm"
                      placeholder="What was discussed?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Decisions Made</label>
                    <textarea 
                      rows={2}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50 transition-colors resize-none text-sm"
                      placeholder="What was decided?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Assign Tasks</label>
                    <input 
                      type="text"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50 transition-colors text-sm"
                      placeholder="Assignee: Task"
                    />
                  </div>
                  <button className="w-full rounded-2xl bg-blue-600 py-3 font-semibold hover:bg-blue-700 transition-all text-sm">
                    Save Minutes to this Meeting
                  </button>
               </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

const ImplementationReport = ({ setEditTarget, implementations, handleStatusChange, setIsAdding }: { setEditTarget: any, implementations: any[], handleStatusChange: any, setIsAdding: (v: boolean) => void }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Implementation Report</h1>
          <p className="text-sm text-white/40">Real-time execution ROI and decision tracking</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> Add Decision
        </button>
      </div>


      <div className="grid grid-cols-1 gap-6">
        {implementations.map((row) => {
          const daysToComplete = row.completionDate && row.decisionDate 
            ? Math.floor((new Date(row.completionDate).getTime() - new Date(row.decisionDate).getTime()) / (1000 * 3600 * 24))
            : null;

          return (
            <GlassCard key={row.id} className="p-6 group">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Timeline Column */}
                <div className="lg:w-48 flex flex-col items-center justify-center border-r border-white/10 pr-6">
                   <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Timeline</div>
                   <div className="text-2xl font-bold text-blue-500">{daysToComplete !== null ? `${daysToComplete} Days` : '--'}</div>
                   <div className="text-[10px] text-white/40 mt-1">{row.decisionDate} → {row.completionDate || 'Active'}</div>
                   <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${row.rate}%` }} />
                   </div>
                </div>

                {/* Content Column */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Badge variant="info">{row.department}</Badge>
                        <span className="text-[10px] font-bold text-white/40 uppercase">Lead: {row.responsibility}</span>
                      </div>
                      <h3 className="text-xl font-bold">{row.decision}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusDropdown 
                        value={row.status}
                        onChange={(val) => handleStatusChange(row.id, val)}
                        options={[
                          { label: 'Finished', color: 'bg-emerald-500' },
                          { label: 'On-going', color: 'bg-blue-500' },
                          { label: 'Pending', color: 'bg-amber-500' }
                        ]}
                      />
                      <button 
                        onClick={() => setEditTarget({ type: 'implementation', data: row })}
                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-full transition-all text-white/40"
                      >
                         <Pencil size={14} />
                      </button>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                        <Target size={12} /> Decision Basis
                      </span>
                      <p className="text-sm text-white/70 leading-relaxed italic">"{row.basis}"</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp size={12} /> Efficient Changes
                      </span>
                      <p className="text-sm text-white/70 leading-relaxed font-medium">{row.outcomes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

const FinanceDocs = ({ setEditTarget, setIsAdding }: { setEditTarget: any, setIsAdding: (v: boolean) => void }) => {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [isAddingFolder, setIsAddingFolder] = useState(false);

  const filteredDocs = DOC_LOG.filter(doc => doc.folder === currentFolder);

  const paymentTrend = [
    { name: 'Jan', amount: 4000 },
    { name: 'Feb', amount: 3000 },
    { name: 'Mar', amount: 5000 },
    { name: 'Apr', amount: 7000 },
  ];

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="text-blue-500" size={20} /> Payment Analytics
          </h2>
          <Badge variant="info">Q2 Budget Status: 65% Used</Badge>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GlassCard className="p-5">
             <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Total Outflow</div>
             <div className="text-2xl font-bold">$124,500</div>
             <div className="mt-2 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '70%' }} />
             </div>
          </GlassCard>
          <GlassCard className="p-5">
             <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Pending Invoices</div>
             <div className="text-2xl font-bold text-amber-500">14</div>
             <div className="text-xs text-white/40 mt-1">Total: $12,300</div>
          </GlassCard>
          <GlassCard className="p-5">
             <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Upcoming (30d)</div>
             <div className="text-2xl font-bold">$42,000</div>
             <div className="text-xs text-emerald-500 mt-1">Scheduled: 8</div>
          </GlassCard>
          <GlassCard className="p-5 lg:col-span-1">
             <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={paymentTrend}>
                      <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
             <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-2">Spending Trend</div>
          </GlassCard>
        </div>
      </section>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Payment Ledger</h2>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold hover:bg-white/10 transition-colors border border-white/10"
          >
            <Plus size={14} /> Record Payment
          </button>
        </div>
        <GlassCard className="overflow-x-auto">
          <div className="p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-sm font-medium text-white/40">
                  <th className="pb-4 pr-4">Vendor</th>
                  <th className="pb-4 pr-4">Amount</th>
                  <th className="pb-4 pr-4">Date</th>
                  <th className="pb-4 pr-4">Method</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {FINANCE_DATA.map((row) => (
                  <tr key={row.id} className="group border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 pr-4 font-medium">{row.vendor}</td>
                    <td className="py-4 pr-4 font-bold">{row.amount}</td>
                    <td className="py-4 pr-4 text-white/60">{row.date}</td>
                    <td className="py-4 pr-4 text-white/60">{row.method}</td>
                    <td className="py-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          row.status === 'Paid' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                        )}>
                          {row.status}
                        </span>
                        <button 
                          onClick={() => setEditTarget({ type: 'payment', data: row })}
                          className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-full transition-all text-white/40"
                        >
                           <Pencil size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3">
             <h2 className="text-xl font-bold">Documentation Log</h2>
             {currentFolder && (
               <div className="flex items-center gap-2">
                  <ChevronRight size={16} className="text-white/20" />
                  <Badge variant="info">{currentFolder}</Badge>
                  <button onClick={() => setCurrentFolder(null)} className="text-white/40 hover:text-white"><ArrowLeft size={14} /></button>
               </div>
             )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsAddingFolder(true)}
              className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-medium hover:bg-white/10 transition-colors border border-white/10"
            >
              <FolderPlus size={16} /> New Folder
            </button>
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} /> Upload File
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {!currentFolder && FOLDERS.map((folder) => (
            <GlassCard 
              key={folder.id} 
              onClick={() => setCurrentFolder(folder.name)}
              className="group p-5 hover:border-blue-500/30 active:scale-[0.98]"
            >
               <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Folder size={24} fill="currentColor" fillOpacity={0.2} />
                  </div>
                  <button className="text-white/20 hover:text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                     <MoreHorizontal size={18} />
                  </button>
               </div>
               <div className="mt-4">
                  <h4 className="font-bold text-sm">{folder.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[10px] text-white/40 font-bold">{folder.count} Files</span>
                     <span className="text-white/20">•</span>
                     <span className="text-[10px] text-white/40 font-bold">{folder.size}</span>
                  </div>
               </div>
            </GlassCard>
          ))}

          {filteredDocs.map((doc) => (
            <GlassCard key={doc.id} className="group p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <FileText size={24} />
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="text-sm font-medium truncate">{doc.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-white/40 uppercase font-bold">{doc.type}</span>
                  <span className="text-white/20">•</span>
                  <span className="text-[10px] text-white/40">{doc.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditTarget({ type: 'document', data: doc })}
                  className="p-2 hover:bg-white/10 rounded-full text-white/40"
                >
                   <Pencil size={16} />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full text-white/40">
                  <ArrowDownRight size={20} className="rotate-45" />
                </button>
              </div>
            </GlassCard>
          ))}
          
          {currentFolder && filteredDocs.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-3xl">
               <HardDrive size={48} className="mb-4" />
               <p className="text-sm font-medium">This folder is empty</p>
               <button className="mt-4 text-xs font-bold text-blue-500 hover:underline">Upload your first file</button>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isAddingFolder} onClose={() => setIsAddingFolder(false)} title="Create New Folder">
         <div className="space-y-4">
            <div className="space-y-2">
               <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Folder Name</label>
               <input type="text" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" placeholder="e.g. Legal Documents" />
            </div>
            <button onClick={() => setIsAddingFolder(false)} className="w-full rounded-2xl bg-blue-600 py-4 font-semibold hover:bg-blue-700 transition-all">
               Create Folder
            </button>
         </div>
      </Modal>
    </div>
  );
};

const PAChecklist = ({ setEditTarget, setIsAdding }: { setEditTarget: any, setIsAdding: (v: boolean) => void }) => {
  const [checklist, setChecklist] = useState(CHECKLIST_DATA);

  const toggleItem = (category: keyof typeof CHECKLIST_DATA, id: string) => {
    setChecklist(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const calculateProgress = () => {
    const allItems = [...checklist.morning, ...checklist.during, ...checklist.end];
    const completed = allItems.filter(i => i.completed).length;
    return Math.round((completed / allItems.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Daily Command Center</h1>
        <p className="text-sm text-white/40">Ensure operations are running at peak efficiency</p>
      </div>

      <GlassCard className="p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-24 w-24">
            <svg className="h-full w-full" viewBox="0 0 36 36">
              <path
                className="stroke-white/10"
                strokeWidth="2"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="stroke-blue-500 transition-all duration-1000 ease-out"
                strokeWidth="2"
                strokeDasharray={`${progress}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{progress}%</span>
            </div>
          </div>
          <div className="text-sm font-medium text-white/60">Overall Readiness</div>
        </div>

        <div className="mt-10 space-y-8">
          {(['morning', 'during', 'end'] as const).map((category) => (
            <div key={category} className="space-y-4">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-blue-500" />
                {category === 'morning' ? 'Morning Routine' : category === 'during' ? 'Mid-Day Focus' : 'End of Day Wrap'}
              </h3>
              <div className="space-y-2">
                {checklist[category].map((item) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "group flex items-center gap-4 p-4 rounded-2xl transition-all",
                      item.completed ? "bg-white/[0.02] opacity-60" : "bg-white/5 hover:bg-white/[0.08]"
                    )}
                  >
                    <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleItem(category, item.id)}>
                      <IOSCheckbox checked={item.completed} onChange={() => {}} />
                      <span className={cn("text-sm transition-all", item.completed && "line-through")}>{item.text}</span>
                    </div>
                    <button 
                      onClick={() => setEditTarget({ type: 'checklist', data: item })}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-full transition-all text-white/40"
                    >
                       <Pencil size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default function DashboardLayout() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [editTarget, setEditTarget] = useState<{ type: string, data: any } | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Real Data State
  const [meetings, setMeetings] = useState<any[]>([]);
  const [implementations, setImplementations] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);


  // AUTH CHECK ON MOUNT
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAdminAuthenticated(true);
      fetchAllData();
    }
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [tasksRes, meetingsRes, schedulesRes, revenueRes, implementationsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/meetings'),
        api.get('/schedules'),
        api.get('/revenue'),
        api.get('/meetings/implementations')
      ]);


      setTasks(tasksRes.data.map((t: any) => ({ ...t, id: t._id, task: t.title, status: t.status === 'Finished' ? 'Completed' : t.status === 'Pending' ? 'To Do' : 'In Progress' })));
      setMeetings(meetingsRes.data.map((m: any) => ({ ...m, id: m._id, date: m.date.split('T')[0] })));
      setSchedules(schedulesRes.data.map((s: any) => ({ ...s, id: s._id })));
      setBrands(revenueRes.data.map((r: any) => ({ ...r, id: r._id, achievement: r.achievement || 0 })));
      setImplementations(implementationsRes.data.map((i: any) => ({ ...i, id: i._id })));


      
      // If we have meetings, we can fetch implementation for the first one or overall
      // For now, we'll keep the implementations state as is or fetch if needed
    } catch (err) {
      addNotification('Failed to sync with cloud. Offline mode active.', 'error');
      // Fallback to mock data if needed
      setTasks(TASK_DATA);
      setMeetings(OFFICIAL_MEETING_DATA);
      setBrands(REVENUE_DATA);
    } finally {
      setIsLoading(false);
    }
  };


  // AUTOMATED STATS
  const stats = useMemo(() => {
    const totalRev = brands.reduce((acc, b) => acc + b.adv, 0);
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const taskVelocity = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
    const avgImplRate = implementations.length > 0 
      ? Math.round(implementations.reduce((acc, i) => acc + i.rate, 0) / implementations.length) 
      : 0;

    return {
      revenue: `$${(totalRev / 1000).toFixed(1)}k`,
      velocity: `${taskVelocity}%`,
      meetings: meetings.length,
      implementation: `${avgImplRate}%`
    };
  }, [brands, tasks, implementations, meetings]);

  const handleUpdate = async (type: string, id: any, formData: any) => {
    addNotification(`Syncing update...`);
    
    try {
      let endpoint = `/${type}s`;
      if (type === 'brand') endpoint = '/revenue';
      
      const payload = { ...formData };
      if (type === 'task' && formData.task) payload.title = formData.task;
      if (type === 'task' && formData.status) {
        payload.status = formData.status === 'To Do' ? 'Pending' : formData.status === 'Completed' ? 'Finished' : 'On-going';
      }

      const res = await api.put(`${endpoint}/${id}`, payload);
      const updatedData = { ...res.data, id: res.data._id };
      applyUpdateToLocalState(type, id, updatedData);
      addNotification(`${type.charAt(0).toUpperCase()}${type.slice(1)} synchronized.`, 'success');
    } catch (err) {
      console.warn('Update sync failed. Applying local override.');
      const localData = { ...formData, id };
      applyUpdateToLocalState(type, id, localData);
      addNotification('Offline Mode: Update applied locally only.', 'warning');
    } finally {
      setEditTarget(null);
    }
  };

  const applyUpdateToLocalState = (type: string, id: any, updatedData: any) => {
    if (type === 'brand') {
      updatedData.adv = Number(updatedData.adv || 0);
      updatedData.target = Number(updatedData.target || 0);
      updatedData.receivable = Number(updatedData.receivable || 0);
      updatedData.achievement = updatedData.target > 0 ? Math.round((updatedData.adv / updatedData.target) * 100) : 0;
    }
    if (type === 'task') {
      updatedData.task = updatedData.title || updatedData.task;
      updatedData.status = updatedData.status === 'Finished' ? 'Completed' : (updatedData.status === 'Pending' ? 'To Do' : (updatedData.status || 'To Do'));
    }
    if (type === 'meeting' && updatedData.date) {
        updatedData.date = typeof updatedData.date === 'string' ? updatedData.date.split('T')[0] : updatedData.date;
    }

    if (type === 'brand') setBrands(prev => prev.map(b => b.id === id ? { ...b, ...updatedData } : b));
    if (type === 'task') setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
    if (type === 'meeting') setMeetings(prev => prev.map(m => m.id === id ? { ...m, ...updatedData } : m));
    if (type === 'schedule') setSchedules(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  // NOTIFICATION STATE
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // LOADING STATE
  const [isLoading, setIsLoading] = useState(false);

  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 400);
  };

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    triggerLoading();
  };

  const addNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const newNotif = { id: Date.now(), message, time: 'Just now', read: false, type };
    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast({ message, type });
    setTimeout(() => setActiveToast(null), 5000);
  };

  const handleStatusChange = (id: string | number, newStatus: string) => {
    setImplementations((prev: any) => 
      prev.map((item: any) => item.id === id ? { ...item, status: newStatus } : item)
    );
    addNotification(`Implementation status updated to ${newStatus}`);
  };

  const tabs = [
    { id: 'home', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'revenue', icon: TrendingUp, label: 'Revenue' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'schedule', icon: Clock, label: 'Schedule' },
    { id: 'meetings', icon: Calendar, label: 'Meetings' },
    { id: 'implementation', icon: BarChart2, label: 'Implementation' },
    { id: 'finance', icon: CreditCard, label: 'Ops Hub' },
    { id: 'checklist', icon: Shield, label: 'Command' },
  ];

  if (!isAdminAuthenticated) {
    return <AdminLogin onLogin={(token, user) => {
      setIsAdminAuthenticated(true);
      setUser(user);
      fetchAllData();
    }} />;
  }

  const handleCreate = async (data: any) => {
    addNotification(`Syncing ${activeTab} entry...`);
    try {
      let endpoint = `/${activeTab}`;
      if (activeTab === 'revenue') endpoint = '/revenue';
      if (activeTab === 'home') endpoint = '/tasks';
      
      const res = await api.post(endpoint, data);
      const newItem = { ...res.data, id: res.data._id };
      
      updateLocalState(newItem);
      addNotification(`${activeTab.charAt(0).toUpperCase()}${activeTab.slice(1)} synchronized.`, 'success');
    } catch (err) {
      console.warn('Backend unreachable. Falling back to local state update.');
      // MOCK FALLBACK
      const mockItem = { 
        ...data, 
        id: Date.now(), 
        _id: Date.now().toString(),
        createdAt: new Date().toISOString() 
      };
      
      updateLocalState(mockItem);
      addNotification('Offline Mode: Entry saved locally only.', 'warning');
    }
  };

  const updateLocalState = (newItem: any) => {
    if (activeTab === 'revenue' || activeTab === 'brand') {
      const brandItem = {
        ...newItem,
        adv: newItem.adv || 0,
        target: newItem.target || 0,
        receivable: newItem.receivable || 0,
        achievement: newItem.target > 0 ? Math.round((newItem.adv / newItem.target) * 100) : 0
      };
      setBrands(prev => [brandItem, ...prev]);
    }
    if (activeTab === 'tasks' || activeTab === 'home') {
      const taskItem = {
        ...newItem,
        task: newItem.title || newItem.task,
        status: newItem.status === 'Finished' ? 'Completed' : (newItem.status === 'Pending' ? 'To Do' : (newItem.status || 'To Do'))
      };
      setTasks(prev => [taskItem, ...prev]);
    }
    if (activeTab === 'meetings') setMeetings(prev => [newItem, ...prev]);
    if (activeTab === 'schedule') setSchedules(prev => [newItem, ...prev]);
    if (activeTab === 'implementation') setImplementations(prev => [newItem, ...prev]);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <SideDrawer 
        isOpen={isAdding} 
        onClose={() => setIsAdding(false)} 
        title={`Add ${activeTab.charAt(0).toUpperCase()}${activeTab.slice(1)}`}
      >
        <CreationDrawerContent 
          type={activeTab} 
          onClose={() => setIsAdding(false)} 
          onSubmit={handleCreate}
          addNotification={addNotification}
        />
      </SideDrawer>

      <Modal 
        isOpen={!!editTarget} 
        onClose={() => setEditTarget(null)} 
        title={`Edit ${editTarget?.type.charAt(0).toUpperCase()}${editTarget?.type.slice(1)}`}
      >

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            handleUpdate(editTarget?.type || '', editTarget?.data.id, data);
          }}
          className="space-y-4"
        >
           {editTarget?.type === 'brand' && (
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Brand Name</label>
                   <input name="brand" type="text" defaultValue={editTarget.data.brand} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">ADV (Current)</label>
                      <input name="adv" type="number" defaultValue={editTarget.data.adv} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Receivable</label>
                      <input name="receivable" type="number" defaultValue={editTarget.data.receivable} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Target</label>
                      <input name="target" type="number" defaultValue={editTarget.data.target} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider font-bold text-blue-400">Achievement (%) [Auto-calc]</label>
                      <input name="achievement" type="number" value={editTarget.data.achievement} readOnly className="w-full rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3 outline-none text-white/20" />
                   </div>
                </div>
             </div>
           )}

           {editTarget?.type === 'task' && (
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Task Title</label>
                   <input name="task" type="text" defaultValue={editTarget.data.task} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Assigned To</label>
                      <input name="assignedTo" type="text" defaultValue={editTarget.data.assignedTo} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Deadline</label>
                      <input name="deadline" type="date" defaultValue={editTarget.data.deadline} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Priority</label>
                      <select name="priority" defaultValue={editTarget.data.priority} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm">
                         <option>Urgent</option>
                         <option>High</option>
                         <option>Medium</option>
                         <option>Low</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Status</label>
                      <select name="status" defaultValue={editTarget.data.status} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm">
                         <option>To Do</option>
                         <option>In Progress</option>
                         <option>Completed</option>
                      </select>
                   </div>
                </div>
             </div>
           )}

           {editTarget?.type === 'schedule' && (
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Event Title</label>
                   <input name="title" type="text" defaultValue={editTarget.data.title} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Time</label>
                      <input name="time" type="text" defaultValue={editTarget.data.time} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">With Whom</label>
                      <input name="withWhom" type="text" defaultValue={editTarget.data.withWhom} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Type</label>
                      <select name="type" defaultValue={editTarget.data.type} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm">
                         <option>Office</option>
                         <option>Personal</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Status</label>
                      <select name="status" defaultValue={editTarget.data.status} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm">
                         <option>Pending</option>
                         <option>In Progress</option>
                         <option>Completed</option>
                      </select>
                   </div>
                </div>
             </div>
           )}

           {editTarget?.type === 'meeting' && (
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Meeting Title</label>
                   <input name="title" type="text" defaultValue={editTarget.data.title} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Date</label>
                      <input name="date" type="date" defaultValue={editTarget.data.date} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Host</label>
                      <input name="host" type="text" defaultValue={editTarget.data.host} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Department</label>
                      <select name="department" defaultValue={editTarget.data.department} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm">
                         <option>Operations</option>
                         <option>IT</option>
                         <option>Finance</option>
                         <option>Marketing</option>
                         <option>Sales</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Agenda</label>
                   <textarea name="agenda" defaultValue={editTarget.data.agenda} rows={3} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50 resize-none" />
                </div>
             </div>
           )}

           {editTarget?.type === 'implementation' && (
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Decision / Strategy Name</label>
                   <input name="decision" type="text" defaultValue={editTarget.data.decision} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Department</label>
                      <select name="department" defaultValue={editTarget.data.department} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm">
                         <option>Operations</option>
                         <option>IT</option>
                         <option>Finance</option>
                         <option>Marketing</option>
                         <option>Sales</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Lead Responsibility</label>
                      <input name="responsibility" type="text" defaultValue={editTarget.data.responsibility} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Decision Date</label>
                      <input name="decisionDate" type="date" defaultValue={editTarget.data.decisionDate} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Completion Date</label>
                      <input name="completionDate" type="date" defaultValue={editTarget.data.completionDate} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Execution Rate (%)</label>
                      <input name="rate" type="number" defaultValue={editTarget.data.rate} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Status</label>
                      <select name="status" defaultValue={editTarget.data.status} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm">
                         <option>Pending</option>
                         <option>On-going</option>
                         <option>Finished</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Decision Basis (Rationale)</label>
                   <textarea name="basis" defaultValue={editTarget.data.basis} rows={2} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50 resize-none text-sm italic" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Efficient Changes (Outcomes)</label>
                   <textarea name="outcomes" defaultValue={editTarget.data.outcomes} rows={2} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50 resize-none text-sm" />
                </div>
             </div>
           )}

           {editTarget?.type === 'payment' && (
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Vendor Name</label>
                   <input name="vendor" type="text" defaultValue={editTarget.data.vendor} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Amount</label>
                      <input name="amount" type="text" defaultValue={editTarget.data.amount} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Date</label>
                      <input name="date" type="date" defaultValue={editTarget.data.date} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Method</label>
                      <input name="method" type="text" defaultValue={editTarget.data.method} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Status</label>
                      <select name="status" defaultValue={editTarget.data.status} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm">
                         <option>Paid</option>
                         <option>Scheduled</option>
                         <option>Pending</option>
                      </select>
                   </div>
                </div>
             </div>
           )}

           {editTarget?.type === 'document' && (
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-xs font-medium text-white/40 uppercase tracking-wider">File Name</label>
                   <input name="name" type="text" defaultValue={editTarget.data.name} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Type</label>
                      <input name="type" type="text" defaultValue={editTarget.data.type} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Owner</label>
                      <input name="owner" type="text" defaultValue={editTarget.data.owner} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Date</label>
                      <input name="date" type="date" defaultValue={editTarget.data.date} className="w-full rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 outline-none focus:border-blue-500/50 text-sm" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wider">Folder</label>
                      <input name="folder" type="text" defaultValue={editTarget.data.folder} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500/50" />
                   </div>
                </div>
             </div>
           )}

           <button 
             type="submit"
             className="w-full rounded-2xl bg-blue-600 py-4 font-semibold hover:bg-blue-700 transition-all mt-4"
           >
             Save & Synchronize Changes
           </button>
        </form>
      </Modal>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-20 flex-col items-center border-r border-white/10 bg-[#0a0a0a] py-8 lg:flex xl:w-64 xl:items-start xl:px-6">
        <div className="flex items-center gap-3 xl:mb-12">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Zap size={24} fill="white" />
          </div>
          <span className="hidden text-xl font-bold xl:block tracking-tight">OpsCenter</span>
        </div>

        <nav className="flex w-full flex-col gap-2 mt-8 xl:mt-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "group flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 xl:h-auto xl:w-full xl:justify-start xl:gap-4 xl:px-4 xl:py-3",
                activeTab === tab.id 
                  ? "bg-blue-600/10 text-blue-500 shadow-[inset_0_0_1px_1px_rgba(59,130,246,0.3)]" 
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              <tab.icon size={22} className={cn("transition-transform group-active:scale-90", activeTab === tab.id && "stroke-[2.5px]")} />
              <span className="hidden text-sm font-semibold xl:block">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto w-full">
          <button className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-white/40 hover:bg-white/5 hover:text-white transition-all">
            <Settings size={22} />
            <span className="hidden text-sm font-semibold xl:block">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="min-h-screen pb-24 lg:pl-20 lg:pb-8 xl:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-black/80 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-4 lg:hidden">
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Zap size={18} fill="white" />
             </div>
             <span className="text-lg font-bold">OpsCenter</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-white/40">
             <span>System Status</span>
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="ml-4">April 23, 2024</span>
          </div>

            {/* Header Right */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 text-white/40 hover:text-white transition-colors"
                >
                  <Bell size={20} />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 border-2 border-black" />
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-4 w-72 origin-top-right rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-4">
                       <h4 className="text-sm font-bold">Notifications</h4>
                       <button onClick={() => setNotifications([])} className="text-[10px] text-blue-400 hover:underline">Clear all</button>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
                       {notifications.length === 0 ? (
                         <div className="text-center py-8 text-xs text-white/20 italic">No new notifications</div>
                       ) : (
                         notifications.map(notif => (
                           <div key={notif.id} className="p-2 rounded-xl bg-white/5 border border-white/5">
                              <p className="text-xs font-medium">{notif.message}</p>
                              <span className="text-[10px] text-white/20">{notif.time}</span>
                           </div>
                         ))
                       )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 rounded-full bg-white/5 border border-white/10 pl-1 pr-3 py-1">
                <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">J</div>
                <span className="text-xs font-medium">Jobin</span>
              </div>
            </div>
        </header>

        {/* Dynamic Content */}
        <div className="mx-auto max-w-7xl p-6 lg:p-10">
          {isLoading ? (
            <div className="space-y-10">
               <KPISkeleton />
               <TableSkeleton />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                {activeTab === 'home' && <GlobalDashboard setEditTarget={setEditTarget} stats={stats} />}
                {activeTab === 'revenue' && <RevenueDashboard setEditTarget={setEditTarget} brands={brands} setIsAdding={setIsAdding} />}
                {activeTab === 'tasks' && <TaskHub setEditTarget={setEditTarget} tasks={tasks} setIsAdding={setIsAdding} />}
                {activeTab === 'schedule' && <DailySchedule setEditTarget={setEditTarget} schedules={schedules} setIsAdding={setIsAdding} />}
                {activeTab === 'meetings' && <MeetingHub setEditTarget={setEditTarget} meetings={meetings} setIsAdding={setIsAdding} />}
                {activeTab === 'implementation' && <ImplementationReport setEditTarget={setEditTarget} implementations={implementations} handleStatusChange={handleStatusChange} setIsAdding={setIsAdding} />}
                {activeTab === 'finance' && <FinanceDocs setEditTarget={setEditTarget} setIsAdding={setIsAdding} />}
                {activeTab === 'checklist' && <PAChecklist setEditTarget={setEditTarget} setIsAdding={setIsAdding} />}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>

      {activeToast && <NotificationToast message={activeToast.message} type={activeToast.type} onClose={() => setActiveToast(null)} />}

      {/* Mobile Tab Bar */}
      <nav className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-white/10 bg-black/80 py-3 backdrop-blur-xl lg:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              activeTab === tab.id ? "text-blue-500" : "text-white/40"
            )}
          >
            <tab.icon size={22} className={cn(activeTab === tab.id && "stroke-[2.5px]")} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </nav>

      <style jsx global>{`
        body {
          background-color: #000;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 640px) {
          table {
            display: block;
          }
          thead {
            display: none;
          }
          tbody, tr, td {
            display: block;
            width: 100%;
          }
          tr {
            margin-bottom: 1.5rem;
            background: rgba(255,255,255,0.03);
            border-radius: 1rem;
            padding: 1rem;
            border: 1px solid rgba(255,255,255,0.05);
          }
          td {
            padding: 0.5rem 0;
            border: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          td::before {
            content: attr(data-label);
            font-weight: bold;
            color: rgba(255,255,255,0.4);
            font-size: 0.7rem;
            text-transform: uppercase;
          }
        }
      `}</style>
    </div>
  );
}
