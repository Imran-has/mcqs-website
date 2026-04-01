import { Github, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/imran-hassan-723b841b9/',
    icon: Linkedin,
    color: 'hover:text-blue-400',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/Imran-has',
    icon: Github,
    color: 'hover:text-white',
  },
  {
    name: 'X / Twitter',
    href: 'https://x.com/ImranHassa21848',
    icon: Twitter,
    color: 'hover:text-sky-400',
  },
  {
    name: 'YouTube',
    href: 'https://youtu.be/7XumuQJmjP0?si=GPbMoxiPNFyd8RA0',
    icon: Youtube,
    color: 'hover:text-red-500',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/reel/DWREYMmTb6C/?igsh=ejg1emRwN25wZTgw',
    icon: Instagram,
    color: 'hover:text-pink-400',
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-green-500/10 bg-black mt-16 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
        <div className="flex items-center gap-5">
          {socialLinks.map(({ name, href, icon: Icon, color }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className={`text-gray-500 transition-colors ${color}`}
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
        <p className="text-gray-600 text-xs">
          Built by <span className="text-green-400">Imran Hassan</span>
        </p>
      </div>
    </footer>
  );
}
