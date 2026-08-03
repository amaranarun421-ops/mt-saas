'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import {
  User,
  Lock,
  Trash2,
  Loader2,
  Save,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authValidation } from '@/lib/zod/auth.schema';

interface SettingsClientProps {
  user: {
    email: string;
    firstName: string;
    lastName: string;
    name: string;
    image: string | null;
    hasPassword: boolean;
  };
}

const profileSchema = authValidation.update;
type ProfileInputs = z.infer<typeof profileSchema>;

const passwordSchema = authValidation.updatePasswordRoute;
type PasswordInputs = z.infer<typeof passwordSchema>;

export function SettingsClient({ user }: SettingsClientProps) {
  const router = useRouter();
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [savingPassword, setSavingPassword] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [showOld, setShowOld] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);

  const profileForm = useForm<ProfileInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  const passwordForm = useForm<PasswordInputs>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: '', newPassword: '' },
  });

  const onProfile = async (data: ProfileInputs) => {
    setSavingProfile(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-profile',
          payload: data,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to save.');
        return;
      }
      toast.success('Profile updated.');
      router.refresh();
    } catch {
      toast.error('Network error.');
    } finally {
      setSavingProfile(false);
    }
  };

  const onPassword = async (data: PasswordInputs) => {
    setSavingPassword(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-password',
          payload: data,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to update password.');
        return;
      }
      toast.success('Password updated. Sign in again with your new password.');
      passwordForm.reset({ oldPassword: '', newPassword: '' });
      // Sign out so the new session reflects the change
      setTimeout(() => signOut({ callbackUrl: '/signin' }), 800);
    } catch {
      toast.error('Network error.');
    } finally {
      setSavingPassword(false);
    }
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete-account' }),
      });
      if (!res.ok) {
        toast.error('Failed to delete account.');
        return;
      }
      toast.success('Account deleted.');
      signOut({ callbackUrl: '/' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, password, and account.
        </p>
      </div>

      {/* Profile */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary-500" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={profileForm.handleSubmit(onProfile)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  disabled={savingProfile}
                  {...profileForm.register('firstName')}
                />
                {profileForm.formState.errors.firstName && (
                  <p className="text-xs text-red-500">
                    {profileForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  disabled={savingProfile}
                  {...profileForm.register('lastName')}
                />
                {profileForm.formState.errors.lastName && (
                  <p className="text-xs text-red-500">
                    {profileForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-muted/40"
              />
              <p className="text-xs text-muted-foreground">
                Email changes require support — contact{' '}
                <a
                  href="mailto:hello@scripta.app"
                  className="text-primary-600 underline"
                >
                  hello@scripta.app
                </a>
                .
              </p>
            </div>
            <Button
              type="submit"
              disabled={savingProfile}
              className="btn-elevated btn-press h-10"
            >
              {savingProfile ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password */}
      {user.hasPassword && (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary-500" />
              Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={passwordForm.handleSubmit(onPassword)}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="oldPassword">Current password</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOld ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pr-9"
                    disabled={savingPassword}
                    {...passwordForm.register('oldPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld((o) => !o)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showOld ? 'Hide' : 'Show'}
                  >
                    {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.oldPassword && (
                  <p className="text-xs text-red-500">
                    {passwordForm.formState.errors.oldPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNew ? 'text' : 'password'}
                    placeholder="At least 8 chars + 1 number"
                    className="pr-9"
                    disabled={savingPassword}
                    {...passwordForm.register('newPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((o) => !o)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showNew ? 'Hide' : 'Show'}
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-xs text-red-500">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={savingPassword}
                className="btn-elevated btn-press h-10"
              >
                {savingPassword ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                Update password
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Danger zone */}
      <Card className="border-red-200 dark:border-red-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            Danger zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Delete account</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account, all documents, and billing history.
                This action cannot be undone.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account and all{' '}
                    documents, folders, and saved content. This action cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={deleteAccount}
                    disabled={deleting}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    {deleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete forever
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
