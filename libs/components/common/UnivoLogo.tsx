import { Box, Container, Link, Stack } from '@mui/material';
import { ArrowRight, Briefcase, HelpCircle, Home, Info, Mail, MapPin, MessageSquare, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/router';
import React from 'react';

export const UnivoLogo: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="univoMain" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>

    {/* Main U Shape */}
    <path
      d="M25 35 Q25 80 50 80 Q75 80 75 35"
      stroke="url(#univoMain)"
      strokeWidth="10"
      strokeLinecap="round"
      fill="none"
    />

    {/* Student Dot */}
    <circle cx="50" cy="22" r="6" fill="url(#univoMain)" />
  </svg>
);

// ─── PUBLIC HEADER ────────────────────────────────────────────────
export const PublicHeader = () => {
    const router = useRouter();

    const navLinks = [
        { href: "/about", icon: <Info size={16} />, label: "About" },
        { href: "/cs", icon: <HelpCircle size={16} />, label: "Help Center" },
    ];

    return (
        <Box
            component="header"
            className="public-header"
            sx={{
                position: "sticky",
                top: 0,
                zIndex: 1200,
                bgcolor: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(0,0,0,0.07)",
            }}
        >
            <Container maxWidth="lg" className="public-header-container">
                <Stack
                    className="public-header-inner"
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ height: 66 }}
                >
                    {/* Logo */}
                    <Link href="/" style={{ textDecoration: "none" }}>
                        <Stack className="public-logo-link" direction="row" alignItems="center" gap={1.2}>
                            <UnivoLogo />
                            <Box>
                                <Box sx={{ fontWeight: 800, fontSize: 18, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                                    univo
                                </Box>
                                <Box sx={{ fontSize: 9, color: "#667eea", fontWeight: 700, letterSpacing: "0.06em" }}>
                                    부산외국어대학교
                                </Box>
                            </Box>
                        </Stack>
                    </Link>

                    {/* Nav Links */}
                    <Stack className="public-nav-links" direction="row" gap={0.5} sx={{ display: { xs: "none", md: "flex" } }}>
                        {navLinks.map((link) => {
                            const isActive = router.pathname === link.href;
                            return (
                                <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        gap={0.8}
                                        sx={{
                                            px: 2,
                                            py: 1,
                                            borderRadius: "10px",
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: isActive ? "#667eea" : "#475569",
                                            bgcolor: isActive ? "rgba(102,126,234,0.08)" : "transparent",
                                            "&:hover": {
                                                color: "#667eea",
                                                bgcolor: "rgba(102,126,234,0.08)",
                                            },
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        {link.icon}
                                        {link.label}
                                    </Stack>
                                </Link>
                            );
                        })}
                    </Stack>

                    {/* Auth Buttons */}
                    <Stack className="public-cta-wrap" direction="row" alignItems="center" gap={1.5}>
                        <Link href="/" style={{ textDecoration: "none" }}>
                            <Stack
                                className="public-cta"
                                direction="row"
                                alignItems="center"
                                gap={0.8}
                                sx={{
                                    px: 2.5,
                                    py: 1,
                                    borderRadius: "10px",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: "#fff",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    cursor: "pointer",
                                    boxShadow: "0 2px 8px rgba(102,126,234,0.3)",
                                    "&:hover": {
                                        transform: "translateY(-1px)",
                                        boxShadow: "0 4px 16px rgba(102,126,234,0.4)",
                                    },
                                    transition: "all 0.2s",
                                }}
                            >
                                Get Started
                                <ArrowRight size={14} />
                            </Stack>
                        </Link>
                    </Stack>

                    <Stack className="public-mobile-links" direction="row" gap={1}>
                        {navLinks.map((link) => {
                            const isActive = router.pathname === link.href;
                            return (
                                <Link key={`${link.href}-mobile`} href={link.href} style={{ textDecoration: 'none' }}>
                                    <Stack className={`public-mobile-link ${isActive ? 'active' : ''}`} direction="row" alignItems="center" gap={0.6}>
                                        {link.icon}
                                        <span>{link.label}</span>
                                    </Stack>
                                </Link>
                            );
                        })}
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

// ─── PUBLIC FOOTER ────────────────────────────────────────────────
export const PublicFooter = () => {
    const platformLinks = [
        { label: "Feed", href: "/" },
        { label: "Opportunities", href: "/article" },
        { label: "Marketplace", href: "/product" },
        { label: "Events", href: "/" },
    ];

    const supportLinks = [
        { label: "Help Center", href: "/cs" },
        { label: "FAQ", href: "/cs?tab=faq" },
        { label: "Contact Us", href: "/cs?tab=contact" },
        { label: "Announcements", href: "/cs?tab=notice" },
    ];

    const companyLinks = [
        { label: "About Univo", href: "/about" },
        { label: "Our Team", href: "/about#team" },
        { label: "University", href: "/about#university" },
    ];

    const features = [
        { icon: <MessageSquare size={16} />, text: "Community Forum" },
        { icon: <Briefcase size={16} />, text: "Job Board" },
        { icon: <ShoppingBag size={16} />, text: "Marketplace" },
        { icon: <Home size={16} />, text: "Campus Events" },
    ];

    return (
        <Box
            component="footer"
            className="public-footer"
            sx={{
                bgcolor: "#0f172a",
                color: "#94a3b8",
                pt: 8,
                pb: 4,
            }}
        >
            <Container maxWidth="lg" className="public-footer-container">
                {/* Top Footer */}
                <Stack
                    className="public-footer-top"
                    direction={{ xs: "column", md: "row" }}
                    gap={8}
                    sx={{ pb: 6, borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                >
                    {/* Brand Column */}
                    <Box className="public-footer-brand" sx={{ minWidth: 240, maxWidth: 280 }}>
                        {/* Logo */}
                        <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2.5 }}>
                            <UnivoLogo />
                            <Box>
                                <Box sx={{ fontWeight: 800, fontSize: 20, color: "#f1f5f9", letterSpacing: "-0.03em" }}>
                                    univo
                                </Box>
                                <Box sx={{ fontSize: 9, color: "#667eea", fontWeight: 700, letterSpacing: "0.06em" }}>
                                    부산외국어대학교
                                </Box>
                            </Box>
                        </Stack>

                        <Box sx={{ fontSize: 14, lineHeight: 1.75, color: "#64748b", mb: 4 }}>
                            The all-in-one digital platform for Busan University of Foreign Studies students — connect, grow, and thrive together.
                        </Box>

                        {/* Feature Pills */}
                        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
                            {features.map((f) => (
                                <Stack
                                    key={f.text}
                                    direction="row"
                                    alignItems="center"
                                    gap={0.6}
                                    sx={{
                                        px: 1.5,
                                        py: 0.6,
                                        borderRadius: "8px",
                                        bgcolor: "rgba(102,126,234,0.12)",
                                        color: "#818cf8",
                                        fontSize: 12,
                                        fontWeight: 600,
                                    }}
                                >
                                    {f.icon}
                                    {f.text}
                                </Stack>
                            ))}
                        </Stack>

                        {/* Contact Info */}
                        <Stack gap={1.5}>
                            <Stack direction="row" alignItems="center" gap={1.5}>
                                <Box sx={{ color: "#667eea" }}><Mail size={14} /></Box>
                                <Box sx={{ fontSize: 13, color: "#64748b" }}>inomozov@icloud.com</Box>
                            </Stack>
                            <Stack direction="row" alignItems="center" gap={1.5}>
                                <Box sx={{ color: "#667eea" }}><MapPin size={14} /></Box>
                                <Box sx={{ fontSize: 13, color: "#64748b" }}>BUFS, Geumjeong-gu, Busan</Box>
                            </Stack>
                        </Stack>
                    </Box>

                    {/* Links Grid */}
                    <Stack
                        className="public-footer-links"
                        direction={{ xs: "column", sm: "row" }}
                        gap={{ xs: 5, sm: 8 }}
                        sx={{ flex: 1 }}
                    >
                        {/* Platform */}
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e2e8f0", mb: 3 }}>
                                Platform
                            </Box>
                            <Stack gap={2}>
                                {platformLinks.map((link) => (
                                    <Link key={link.label} href={link.href} style={{ textDecoration: "none" }}>
                                        <Box sx={{ fontSize: 14, color: "#64748b", "&:hover": { color: "#818cf8" }, transition: "color 0.15s", cursor: "pointer" }}>
                                            {link.label}
                                        </Box>
                                    </Link>
                                ))}
                            </Stack>
                        </Box>

                        {/* Support */}
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e2e8f0", mb: 3 }}>
                                Support
                            </Box>
                            <Stack gap={2}>
                                {supportLinks.map((link) => (
                                    <Link key={link.label} href={link.href} style={{ textDecoration: "none" }}>
                                        <Box sx={{ fontSize: 14, color: "#64748b", "&:hover": { color: "#818cf8" }, transition: "color 0.15s", cursor: "pointer" }}>
                                            {link.label}
                                        </Box>
                                    </Link>
                                ))}
                            </Stack>
                        </Box>

                        {/* Company */}
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e2e8f0", mb: 3 }}>
                                Company
                            </Box>
                            <Stack gap={2}>
                                {companyLinks.map((link) => (
                                    <Link key={link.label} href={link.href} style={{ textDecoration: "none" }}>
                                        <Box sx={{ fontSize: 14, color: "#64748b", "&:hover": { color: "#818cf8" }, transition: "color 0.15s", cursor: "pointer" }}>
                                            {link.label}
                                        </Box>
                                    </Link>
                                ))}
                            </Stack>

                            {/* CTA Block */}
                            <Box sx={{ mt: 5, p: 2.5, borderRadius: "12px", background: "linear-gradient(135deg, rgba(102,126,234,0.15) 0%, rgba(118,75,162,0.15) 100%)", border: "1px solid rgba(102,126,234,0.2)" }}>
                                <Box sx={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", mb: 0.5 }}>Join Univo Today</Box>
                                <Box sx={{ fontSize: 12, color: "#64748b", mb: 1.5 }}>Free for all BUFS students</Box>
                                <Link href="/account/join" style={{ textDecoration: "none" }}>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="center"
                                        gap={0.8}
                                        sx={{
                                            py: 1,
                                            borderRadius: "8px",
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: "#fff",
                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                            "&:hover": { opacity: 0.9 },
                                            transition: "opacity 0.15s",
                                        }}
                                    >
                                        Get Started Free <ArrowRight size={13} />
                                    </Stack>
                                </Link>
                            </Box>
                        </Box>
                    </Stack>
                </Stack>

                {/* Bottom Footer */}
                <Stack
                    className="public-footer-bottom"
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    gap={2}
                    sx={{ pt: 4 }}
                >
                    <Box sx={{ fontSize: 13, color: "#334155" }}>
                        © {new Date().getFullYear()} Univo Community · Built by students, for students at BUFS
                    </Box>
                    <Stack direction="row" gap={3}>
                        {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((item) => (
                            <Box
                                key={item}
                                sx={{
                                    fontSize: 13,
                                    color: "#334155",
                                    "&:hover": { color: "#818cf8" },
                                    cursor: "pointer",
                                    transition: "color 0.15s",
                                }}
                            >
                                {item}
                            </Box>
                        ))}
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};