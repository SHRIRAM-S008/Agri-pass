import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en' as const, label: 'EN', fullName: 'English' },
    { code: 'hi' as const, label: 'हिंदी', fullName: 'Hindi' },
    { code: 'ta' as const, label: 'தமிழ்', fullName: 'Tamil' },
    { code: 'fr' as const, label: 'FR', fullName: 'Français' },
    { code: 'ar' as const, label: 'AR', fullName: 'العربية' },
    { code: 'es' as const, label: 'ES', fullName: 'Español' },
    { code: 'si' as const, label: 'SI', fullName: 'සිංහල' },
    { code: 'pt' as const, label: 'PT', fullName: 'Português' },
  ];

  const currentLang = languages.find(l => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 h-9 px-3">
          <Globe className="h-4 w-4" />
          <span className="font-medium">{currentLang?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? 'bg-accent' : ''}
          >
            <span className="font-medium mr-2">{lang.label}</span>
            <span className="text-muted-foreground text-xs">{lang.fullName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
