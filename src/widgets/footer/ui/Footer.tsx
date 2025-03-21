import { Button } from "@/shared/ui/shadcn/button.tsx";
import { Separator } from "@/shared/ui/shadcn/separator.tsx";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";
import logo from "@/shared/assets/flowup.png";

const Footer = () => {
    const socialIcons = [
        { icon: Facebook, label: "Facebook" },
        { icon: Twitter, label: "Twitter" },
        { icon: Instagram, label: "Instagram" },
        { icon: Github, label: "GitHub" }
    ];

    const quickLinks = [
        { text: "Products", href: "#" },
        { text: "Features", href: "#" },
        { text: "Pricing", href: "#" },
        { text: "Support", href: "#" }
    ];

    const legalLinks = [
        { text: "Privacy", href: "#" },
        { text: "Terms", href: "#" }
    ];

    return (
        <footer className="w-full border-t bg-background/95 backdrop-blur-md">
            <div className="container py-6">
                <div className="flex flex-col items-center justify-between gap-4 py-2 md:flex-row">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Logo" className="h-6 w-6" />
                        <span className="font-medium">TEAM FLOWUP</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 text-sm">
                        {quickLinks.map((link, index) => (
                            <a key={index} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                                {link.text}
                            </a>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        {socialIcons.map((social, index) => (
                            <Button key={index} variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <social.icon className="h-4 w-4" />
                                <span className="sr-only">{social.label}</span>
                            </Button>
                        ))}
                    </div>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
                    <p>© {new Date().getFullYear()} 팀 플로우업. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        {legalLinks.map((link, index) => (
                            <a key={index} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                                {link.text}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;