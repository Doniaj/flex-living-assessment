import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [hasScrolled, setHasScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setHasScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { to: '/', label: 'Dashboard' },
        { to: '/property/2b-n1-a-29-shoreditch-heights', label: 'Property Details' }
    ];

    const linkClasses = (path) =>
        `relative font-medium transition-all pb-1 ${
            isActive(path)
                ? hasScrolled
                    ? 'text-white after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-white'
                    : 'text-[#284D4B] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#284D4B]'
                : hasScrolled
                    ? 'text-gray-200 hover:text-white'
                    : 'text-gray-700 hover:text-[#284D4B]'
        }`;

    return (
        <header className="fixed inset-x-0 top-0 z-50">
            <nav
                className={`transition-all duration-300 ${
                    hasScrolled ? 'bg-[#284D4B] shadow-2xl' : 'bg-[#FFF9E9] shadow-lg'
                }`}
                aria-label="Main navigation"
            >
                <div className="w-full max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link
                            to="/"
                            className={`text-2xl font-bold tracking-tight transition-colors ${
                                hasScrolled ? 'text-white' : 'text-[#284D4B]'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Flex Living
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-12">
                            {navLinks.map(({ to, label }) => (
                                <Link key={to} to={to} className={linkClasses(to)} aria-current={isActive(to) ? 'page' : undefined}>
                                    {label}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`md:hidden p-2 rounded-lg transition-colors ${
                                hasScrolled ? 'text-white hover:bg-white/10' : 'text-[#284D4B] hover:bg-[#284D4B]/10'
                            }`}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {mobileMenuOpen && (
                        <div className={`md:hidden mt-4 pb-4 border-t-2 ${hasScrolled ? 'border-white/20' : 'border-[#284D4B]/20'}`}>
                            <div className="flex flex-col gap-6 mt-6 text-lg">
                                {navLinks.map(({ to, label }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        className={`${linkClasses(to)} text-center py-2`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        aria-current={isActive(to) ? 'page' : undefined}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;