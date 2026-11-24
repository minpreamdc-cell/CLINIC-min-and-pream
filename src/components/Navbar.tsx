'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Users,
  CreditCard,
  Smile,
  FlaskConical,
  Package,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Pin,
  PinOff,
  Menu,
  X,
  Tv,
  BellRing,
} from 'lucide-react';
import { SessionUser, UserRole, ROLE_NAMES_TH, MENU_PERMISSIONS } from '@/lib/auth-types';
import { formatThaiDate } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [loadingRole, setLoadingRole] = useState(false);

  // Auto-collapse sidebar state
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isExpanded = isHovered || isPinned;

  useEffect(() => {
    // Load persisted pin preference if any
    try {
      const savedPin = localStorage.getItem('sidebar_pinned');
      if (savedPin === 'true') setIsPinned(true);
    } catch {}

    // Fetch current user
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});

    // Clock ticker
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('th-TH', {
          timeZone: 'Asia/Bangkok',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const togglePin = () => {
    const next = !isPinned;
    setIsPinned(next);
    try {
      localStorage.setItem('sidebar_pinned', String(next));
    } catch {}
  };

  const switchUser = async (username: string) => {
    setLoadingRole(true);
    try {
      const res = await fetch('/api/auth/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (data?.user) {
        setCurrentUser(data.user);
        setIsRoleDropdownOpen(false);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRole(false);
    }
  };

  const navItems = [
    { key: 'queue', label: 'คิววันนี้', href: '/', icon: Clock },
    { key: 'tv-queue', label: 'จอ TV เรียกคิว', href: '/tv-queue', icon: Tv },
    { key: 'appointments', label: 'รายการนัดหมาย', href: '/appointments', icon: Calendar },
    { key: 'patients', label: 'คนไข้ & X-Ray', href: '/patients', icon: Users },
    { key: 'recall', label: 'ติดตามคนไข้ & LINE', href: '/recall', icon: BellRing },
    { key: 'billing', label: 'การเงิน & ใบเสร็จ', href: '/billing', icon: CreditCard },
    { key: 'ortho', label: 'จัดฟัน', href: '/ortho', icon: Smile },
    { key: 'lab', label: 'งานแลป', href: '/lab', icon: FlaskConical },
    { key: 'inventory', label: 'คลังเวชภัณฑ์', href: '/inventory', icon: Package },
    { key: 'reports', label: 'รายงาน & DF แพทย์', href: '/reports', icon: BarChart3 },
    { key: 'settings', label: 'ตั้งค่า', href: '/settings', icon: Settings },
  ];

  const currentRole = currentUser?.role || 'COUNTER';

  const visibleNavItems = navItems.filter((item) => {
    const allowed = MENU_PERMISSIONS[item.key];
    if (!allowed) return true;
    return allowed.includes(currentRole as UserRole);
  });

  const availableUsers = [
    { username: 'counter', label: 'คุณสมศรี (เคาน์เตอร์)', role: 'COUNTER', color: 'bg-emerald-500' },
    { username: 'doctormin', label: 'ทพ. มินตรา (หมอมิน)', role: 'DENTIST', color: 'bg-sky-500' },
    { username: 'doctorpreem', label: 'ทพญ. พรีมญา (หมอพรีม)', role: 'DENTIST', color: 'bg-teal-500' },
    { username: 'admin', label: 'ผู้จัดการระบบ (เจ้าของ)', role: 'ADMIN', color: 'bg-indigo-600' },
    { username: 'finance', label: 'คุณบัญชา (การเงิน)', role: 'FINANCE', color: 'bg-amber-500' },
    { username: 'assistant', label: 'คุณน้ำหวาน (ผู้ช่วย)', role: 'ASSISTANT', color: 'bg-purple-500' },
  ];

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between shadow-sm no-print">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="เปิดเมนู"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-800">หมอมิน หมอพรีม</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-sky-700 font-bold bg-sky-50 px-2 py-1 rounded-md border border-sky-100">
            {currentTime || '--:--:--'} น.
          </span>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 no-print"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Spacer so main content doesn't get covered by the collapsed rail */}
      <div
        className={`hidden md:block shrink-0 transition-all duration-300 ease-in-out no-print ${
          isPinned ? 'w-64' : 'w-20'
        }`}
      />

      {/* Left Sidebar (Auto-collapse on mouse leave, expand on mouse enter) */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (!isPinned) setIsRoleDropdownOpen(false);
        }}
        className={`fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 ease-in-out no-print ${
          isExpanded ? 'w-64 shadow-2xl shadow-slate-900/10' : 'w-20 shadow-sm'
        } ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Top Section: Brand & Pin Button */}
        <div>
          <div className="h-16 px-3.5 flex items-center justify-between border-b border-slate-100">
            <Link href="/" className="flex items-center gap-3 min-w-0 group">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-tr from-sky-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isExpanded || isMobileOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-800 tracking-tight whitespace-nowrap">
                    คลินิกหมอมิน หมอพรีม
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-sky-50 text-sky-700 border border-sky-200 whitespace-nowrap">
                    Min & Preem Dental
                  </span>
                </div>
              </div>
            </Link>

            {/* Pin / Auto-collapse Toggle Button (Desktop) */}
            {(isExpanded || isMobileOpen) && (
              <div className="flex items-center">
                <button
                  onClick={togglePin}
                  title={isPinned ? 'ปลดหมุด (ให้พับเก็บอัตโนมัติ)' : 'ปักหมุดแถบเมนูค้างไว้'}
                  className={`hidden md:flex p-1.5 rounded-lg border transition-colors ${
                    isPinned
                      ? 'bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-100'
                      : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {isPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Live Date & Time Pill inside Sidebar */}
          <div className="px-3 pt-3 pb-1">
            <div
              className={`bg-slate-50 border border-slate-200/80 rounded-xl transition-all duration-300 flex items-center ${
                isExpanded || isMobileOpen
                  ? 'px-3 py-2 justify-between'
                  : 'p-2 flex-col justify-center gap-0.5'
              }`}
              title={formatThaiDate(new Date(), true)}
            >
              {isExpanded || isMobileOpen ? (
                <>
                  <span className="text-[11px] text-slate-500 truncate">
                    {formatThaiDate(new Date(), true)}
                  </span>
                  <span className="font-mono text-xs text-sky-700 font-bold whitespace-nowrap">
                    {currentTime || '--:--:--'} น.
                  </span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span className="font-mono text-[10px] text-sky-700 font-bold leading-tight">
                    {currentTime ? currentTime.slice(0, 5) : '--:--'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] no-scrollbar">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  title={!isExpanded ? item.label : undefined}
                  onClick={() => {
                    // Automatically fold back on click unless pinned
                    if (!isPinned) setIsHovered(false);
                  }}
                  className={`group relative flex items-center rounded-xl transition-all duration-200 ${
                    isExpanded || isMobileOpen
                      ? 'px-3.5 py-2.5 gap-3'
                      : 'p-3 justify-center'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-600 to-teal-500 text-white font-semibold shadow-sm shadow-sky-500/20'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-sky-600'
                    }`}
                  />
                  <span
                    className={`text-xs whitespace-nowrap transition-all duration-200 ${
                      isExpanded || isMobileOpen
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-2 hidden'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Floating Tooltip when collapsed */}
                  {!isExpanded && !isMobileOpen && (
                    <div className="pointer-events-none fixed left-20 ml-2 px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Role Switcher & Active User Profile */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 relative">
          {/* Collapse hint indicator */}
          <div
            className={`mb-2 flex items-center justify-between text-[10px] text-slate-400 px-1 transition-opacity duration-200 ${
              isExpanded || isMobileOpen ? 'opacity-100' : 'opacity-0 hidden'
            }`}
          >
            <span>{isPinned ? '📌 ปักหมุดเมนูไว้' : '✨ พับเก็บอัตโนมัติเมื่อเลื่อนเมาส์ออก'}</span>
          </div>

          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            title="สลับบทบาทผู้ใช้งาน"
            className={`w-full flex items-center rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-xs text-slate-800 shadow-2xs ${
              isExpanded || isMobileOpen ? 'px-3 py-2 justify-between' : 'p-2.5 justify-center'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                  {currentUser?.fullName ? currentUser.fullName.charAt(0) : 'U'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
              </div>
              {(isExpanded || isMobileOpen) && (
                <div className="text-left truncate">
                  <div className="font-semibold text-slate-900 leading-tight truncate">
                    {currentUser?.fullName || 'กำลังโหลด...'}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {currentUser?.role ? ROLE_NAMES_TH[currentUser.role] : 'สิทธิ์ผู้ใช้งาน'}
                  </div>
                </div>
              )}
            </div>
            {(isExpanded || isMobileOpen) && (
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                  isRoleDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>

          {/* Role Switcher Popup */}
          {isRoleDropdownOpen && (
            <div className="absolute bottom-16 left-3 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  สลับบทบาทจำลองเพื่อทดสอบระบบ
                </p>
              </div>
              <div className="py-1 max-h-64 overflow-y-auto">
                {availableUsers.map((u) => {
                  const isActive = currentUser?.username === u.username;
                  return (
                    <button
                      key={u.username}
                      disabled={loadingRole}
                      onClick={() => switchUser(u.username)}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        isActive ? 'bg-sky-50/70 text-sky-900 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${u.color}`}></span>
                        <span className="truncate">{u.label}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                        {u.role}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
