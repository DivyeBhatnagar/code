import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 px-6 lg:px-8 border-t">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <span className="font-semibold text-lg tracking-tight">CodePilot AI</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors text-sm"
            >
              Twitter
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors text-sm"
            >
              GitHub
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors text-sm"
            >
              Discord
            </a>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          © 2026 CodePilot AI. Empowering builders.
        </div>
      </div>
    </footer>
  );
}
