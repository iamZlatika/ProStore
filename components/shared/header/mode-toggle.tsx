'use client';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuContent,
    DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon, SunMoon } from 'lucide-react';

const icons = {
    system: <SunMoon />,
    dark: <MoonIcon />,
    light: <SunIcon />,
};

const ModeToggle = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='focus-visible:ring-0 focus-visible:ring-offset-0'>
                    {icons[resolvedTheme as keyof typeof icons] || <SunIcon />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['system', 'dark', 'light'].map((mode) => (
                    <DropdownMenuCheckboxItem
                        key={mode}
                        checked={theme === mode}
                        onClick={() => setTheme(mode)}
                    >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ModeToggle;
