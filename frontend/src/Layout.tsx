import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, MapPin, Users, Package, Leaf, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Dashboard", to: "/", icon: LayoutDashboard, testid: "nav-dashboard" },
    { label: "Visitas Realizadas", to: "/visitas", icon: MapPin, testid: "nav-visitas" },
    { label: "Médicos", to: "/medicos", icon: Users, testid: "nav-medicos" },
    { label: "Produtos", to: "/produtos", icon: Package, testid: "nav-produtos" },
];

const pageTitles = {
    "/": { title: "Dashboard", subtitle: "Métricas e visão geral das visitas" },
    "/visitas": { title: "Visitas Realizadas", subtitle: "Controle de visitas e prospecções" },
    "/medicos": { title: "Médicos", subtitle: "Cadastro e gestão de profissionais" },
    "/produtos": { title: "Produtos", subtitle: "Catálogo de produtos de nutrição" },
};

export default function Layout() {
    const location = useLocation();
    const meta = pageTitles[location.pathname] || { title: "", subtitle: "" };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Sidebar */}
            <aside
                data-testid="sidebar"
                className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 sticky top-0 h-screen"
            >
                <div className="px-6 py-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">
                            <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">
                                Visita Realizada
                            </h1>
                            <p className="text-xs text-slate-500">Nutrição & Vendas</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-6 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === "/"}
                                data-testid={item.testid}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-emerald-50 text-emerald-700 shadow-sm"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon
                                            className={cn(
                                                "w-4 h-4 transition-colors",
                                                isActive ? "text-emerald-600" : "text-slate-400"
                                            )}
                                        />
                                        <span>{item.label}</span>
                                        {isActive && (
                                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="px-4 py-4 border-t border-slate-100">
                    <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-4">
                        <p className="text-xs font-semibold text-emerald-800">Dica</p>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            Exporte suas visitas em CSV para análise externa.
                        </p>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                    <div className="px-6 md:px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 md:hidden">
                            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center">
                                <Leaf className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-slate-900">Visita Realizada</span>
                        </div>
                        <div className="hidden md:block">
                            <h2
                                data-testid="page-title"
                                className="text-2xl font-bold text-slate-900 tracking-tight"
                            >
                                {meta.title}
                            </h2>
                            <p className="text-sm text-slate-500">{meta.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                data-testid="notifications-btn"
                                className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <Bell className="w-4 h-4 text-slate-600" />
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                            </button>
                            <div
                                data-testid="user-avatar"
                                className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-semibold"
                            >
                                CM
                            </div>
                        </div>
                    </div>

                    {/* Mobile nav */}
                    <div className="md:hidden flex items-center gap-1 px-3 pb-3 overflow-x-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.to === "/"}
                                    className={({ isActive }) =>
                                        cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap",
                                            isActive
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "text-slate-600 hover:bg-slate-50"
                                        )
                                    }
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {item.label}
                                </NavLink>
                            );
                        })}
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}