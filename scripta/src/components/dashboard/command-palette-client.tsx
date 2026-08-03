'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  FileText,
  Mail,
  MessageSquare,
  Package,
  LayoutDashboard,
  Settings,
  CreditCard,
  Folder,
  Home,
} from 'lucide-react';
import { toast } from 'sonner';

const WRITE_MODES = [
  {
    id: 'blog',
    name: 'Blog Post',
    icon: FileText,
    description: 'Generate a structured blog post',
    href: '/dashboard/write/blog',
  },
  {
    id: 'social',
    name: 'Social Caption',
    icon: MessageSquare,
    description: '3 variations + hashtags',
    href: '/dashboard/write/social',
  },
  {
    id: 'email',
    name: 'Email Copy',
    icon: Mail,
    description: 'Subject + body for any goal',
    href: '/dashboard/write/email',
  },
  {
    id: 'product',
    name: 'Product Description',
    icon: Package,
    description: 'Short + long version',
    href: '/dashboard/write/product',
  },
] as const;

const NAV_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Documents', icon: Folder, href: '/dashboard/documents' },
  { name: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
  { name: 'Back to site', icon: Home, href: '/' },
] as const;

interface RecentDoc {
  id: string;
  title: string;
  type: string;
}

export function CommandPaletteClient({
  recentDocuments,
}: {
  recentDocuments: RecentDoc[];
}) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const run = (cb: () => void) => {
    setOpen(false);
    cb();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Write">
          {WRITE_MODES.map((mode) => (
            <CommandItem
              key={mode.id}
              value={`write ${mode.name}`}
              onSelect={() => run(() => router.push(mode.href))}
              className="cursor-pointer"
            >
              <mode.icon className="mr-2 h-4 w-4 text-primary-500" />
              <span>{mode.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {mode.description}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        {recentDocuments.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent documents">
              {recentDocuments.map((doc) => (
                <CommandItem
                  key={doc.id}
                  value={`doc ${doc.title}`}
                  onSelect={() =>
                    run(() => router.push(`/dashboard/documents/${doc.id}`))
                  }
                  className="cursor-pointer"
                >
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="truncate max-w-[280px]">{doc.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground uppercase">
                    {doc.type}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />

        <CommandGroup heading="Navigate">
          {NAV_ITEMS.map((item) => (
            <CommandItem
              key={item.name}
              value={`go ${item.name}`}
              onSelect={() => run(() => router.push(item.href))}
              className="cursor-pointer"
            >
              <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{item.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick actions">
          <CommandItem
            value="new document"
            onSelect={() =>
              run(() => {
                toast.info('Pick a write mode from the sidebar.');
                router.push('/dashboard/write/blog');
              })
            }
            className="cursor-pointer"
          >
            <FileText className="mr-2 h-4 w-4 text-primary-500" />
            <span>Start a new document</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
