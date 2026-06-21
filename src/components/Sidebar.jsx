import { NavLink } from 'react-router-dom';
import { Leaf, LayoutDashboard, PlusCircle, TrendingUp, Lightbulb, ShoppingBag, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/log', label: 'Log Activity', icon: PlusCircle },
  { to: '/trends', label: 'Trends', icon: TrendingUp },
  { to: '/insights', label: 'AI Insights', icon: Lightbulb },
  { to: '/offsets', label: 'Offsets', icon: ShoppingBag },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 h-screen bg-[#2D4A2D] text-[#FDFAF4] flex flex-col fixed left-0 top-0 z-40">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <Leaf className="w-7 h-7 text-[#C4956A]" />
        <span className="text-xl font-semibold tracking-tight">Verdant</span>
      </div>

      <nav className="flex-1 px-4 pt-6 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#FDFAF4]/15 text-white'
                  : 'text-[#FDFAF4]/70 hover:bg-[#FDFAF4]/8 hover:text-white'
              }`
            }
          >
            <Icon className="w-4.5 h-4.5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="px-4 pb-4 border-t border-white/10 pt-4">
        {user && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2 rounded-lg bg-white/5">
            <User className="w-4 h-4 text-[#C4956A]" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#FDFAF4]/90 truncate">{user.name}</p>
              <p className="text-xs text-[#FDFAF4]/50 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#FDFAF4]/70 hover:bg-[#FDFAF4]/8 hover:text-white transition-colors"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}