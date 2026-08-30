import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Check,
  User,
  Mail,
  Phone,
  Briefcase,
  X,
  Sparkles,
  Camera,
} from 'lucide-react';
import { useUserProfile, DEFAULT_USER_PROFILE } from '../lib/userProfile';
import { useAuth } from '../context/AuthContext';

export function UserProfileMenu() {
  const { profile, update } = useUserProfile();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [logoutFeedback, setLogoutFeedback] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Edit form state
  const [formName, setFormName] = useState(profile.name);
  const [formEmail, setFormEmail] = useState(profile.email);
  const [formRole, setFormRole] = useState(profile.role);
  const [formDepartment, setFormDepartment] = useState(profile.department);
  const [formPhone, setFormPhone] = useState(profile.phone);
  const [formAvatarUrl, setFormAvatarUrl] = useState(profile.avatarUrl || '');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const syncedRef = useRef(false);

  // Sinkronkan nama & email dengan user yang benar-benar login (Sanctum),
  // hanya sekali dan hanya kalau profil lokal belum pernah dikustomisasi.
  useEffect(() => {
    if (user && !syncedRef.current && profile.email === DEFAULT_USER_PROFILE.email) {
      update({
        ...profile,
        name: user.name,
        email: user.email,
        role: typeof user.role === 'string' && user.role ? user.role : profile.role,
        department:
        typeof user.department === 'string' && user.department
          ? user.department
          : profile.department,
      });
      syncedRef.current = true;
    }
  }, [user]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync edit form with profile when modal opens
  const handleOpenEdit = () => {
    setFormName(profile.name);
    setFormEmail(profile.email);
    setFormRole(profile.role);
    setFormDepartment(profile.department);
    setFormPhone(profile.phone);
    setFormAvatarUrl(profile.avatarUrl || '');
    setDropdownOpen(false);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    update({
      name: formName.trim() || 'User',
      email: formEmail.trim() || 'user@example.com',
      role: formRole.trim() || 'Administrator',
      department: formDepartment.trim() || 'Finance',
      phone: formPhone.trim(),
      avatarUrl: formAvatarUrl.trim() || undefined,
    });
    setEditModalOpen(false);
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    setLoggingOut(true);
    setLogoutFeedback(true);

    try {
      await logout();
    } finally {
      setLoggingOut(false);
      navigate('/login', { replace: true });
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'US';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── User Avatar Pill Button in Navbar ── */}
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1 sm:pl-2 sm:pr-2.5 rounded-full sm:rounded-xl border border-zinc-200 hover:border-zinc-300 bg-zinc-50 hover:bg-zinc-100 transition-all text-left shadow-2xs group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-red-500/20"
        aria-expanded={dropdownOpen}
        aria-label="Menu Profil Pengguna"
      >
        {/* Avatar Graphic with Status Indicator */}
        <div className="relative">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover border border-zinc-300 shadow-2xs"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-950 text-white font-black text-xs flex items-center justify-center border border-zinc-800 shadow-2xs">
              <span className="tracking-tight">{getInitials(profile.name)}</span>
            </div>
          )}
          {/* Online green indicator badge with subtle red border */}
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"
            title="Sesi Aktif"
          />
        </div>

        {/* User text details for md/lg screens */}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-zinc-950 leading-tight group-hover:text-red-600 transition-colors truncate max-w-[110px]">
            {profile.name}
          </span>
          <span className="text-[10px] text-zinc-500 leading-tight truncate max-w-[110px]">
            {profile.role}
          </span>
        </div>

        <ChevronDown
          size={14}
          className={`text-zinc-400 group-hover:text-zinc-700 transition-transform duration-200 hidden sm:block ${
            dropdownOpen ? 'rotate-180 text-red-600' : ''
          }`}
        />
      </button>

      {/* ── Dropdown Popover ── */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header Card */}
          <div className="p-4 bg-zinc-950 text-white border-b-2 border-red-600">
            <div className="flex items-start gap-3">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-zinc-700 shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-zinc-800 text-white font-extrabold text-sm flex items-center justify-center border-2 border-zinc-700 shrink-0">
                  {getInitials(profile.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-white truncate">{profile.name}</h4>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-600/90 text-white uppercase tracking-wider">
                    Aktif
                  </span>
                </div>
                <p className="text-xs text-zinc-300 truncate mt-0.5 font-medium">{profile.email}</p>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-1">
                  <ShieldCheck size={11} className="text-red-500" />
                  <span>{profile.role}</span>
                  {profile.department && <span>• {profile.department}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions List */}
          <div className="p-2 space-y-1 text-xs">
            <button
              onClick={handleOpenEdit}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors text-left font-semibold cursor-pointer"
            >
              <Settings size={15} className="text-zinc-500" />
              <span>Pengaturan Profil User</span>
            </button>

            <div className="my-1 border-t border-zinc-100" />

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <LogOut size={15} />
              <span>{loggingOut ? 'Mengakhiri sesi…' : 'Keluar dari Akun'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Edit Profile Modal ── */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="bg-white border border-zinc-200 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <User size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-zinc-950">Edit Profil Pengguna</h3>
                  <p className="text-[11px] text-zinc-500">Sesuaikan informasi akun login Anda</p>
                </div>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                <X size={17} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              {/* Photo Preview / URL */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                  Foto Profil (URL Gambar)
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    {formAvatarUrl ? (
                      <img
                        src={formAvatarUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-full object-cover border border-zinc-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-zinc-950 text-white font-bold text-sm flex items-center justify-center border border-zinc-800">
                        {getInitials(formName || 'User')}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <Camera size={14} className="absolute left-2.5 top-2.5 text-zinc-400" />
                      <input
                        type="url"
                        value={formAvatarUrl}
                        onChange={(e) => setFormAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full pl-8 pr-3 py-2 border border-zinc-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden font-mono"
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-0.5 block">Biarkan kosong untuk inisial nama</span>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                  Nama Lengkap <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-2.5 top-2.5 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Nama Pengguna"
                    className="w-full pl-8 pr-3 py-2 border border-zinc-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden font-semibold"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                  Alamat Email <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-2.5 top-2.5 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="user@perusahaan.com"
                    className="w-full pl-8 pr-3 py-2 border border-zinc-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Role / Jabatan */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                    Jabatan / Role
                  </label>
                  <div className="relative">
                    <Briefcase size={14} className="absolute left-2.5 top-2.5 text-zinc-400" />
                    <input
                      type="text"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      placeholder="Administrator"
                      className="w-full pl-8 pr-3 py-2 border border-zinc-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                    Departemen
                  </label>
                  <input
                    type="text"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    placeholder="Finance"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                  Nomor Kontak / WhatsApp
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-2.5 top-2.5 text-zinc-400" />
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+62 812-xxxx-xxxx"
                    className="w-full pl-8 pr-3 py-2 border border-zinc-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Actions Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-3.5 py-2 border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50 font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Check size={14} />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Toast notification feedback on logout ── */}
      {logoutFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-950 text-white px-4 py-3 rounded-xl shadow-2xl border border-zinc-800 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles size={16} className="text-red-500 animate-spin" />
          <span>Mengakhiri sesi, mengalihkan ke halaman login…</span>
        </div>
      )}
    </div>
  );
}