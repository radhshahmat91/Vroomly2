"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateProfileRequest, changePasswordRequest } from "@/lib/api/auth";
import { uploadImage } from "@/lib/api/uploads";
import { apiErrorMessage } from "@/lib/apiClient";
import { profileSchema, passwordChangeSchema, type ProfileInput, type PasswordChangeInput } from "@/lib/validators";
import { Field, Input } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ProfileSettings() {
  const { user, setUser } = useAuth();
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name, phone: user?.phone, address: user?.address },
  });
  const passwordForm = useForm<PasswordChangeInput>({ resolver: zodResolver(passwordChangeSchema) });

  async function onSaveProfile(values: ProfileInput) {
    try {
      const updated = await updateProfileRequest(values);
      setUser(updated);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not save your profile"));
    }
  }

  async function onChangePassword(values: PasswordChangeInput) {
    try {
      await changePasswordRequest(values);
      passwordForm.reset();
      toast.success("Password updated");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not change your password"));
    }
  }

  async function onAvatarSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const url = await uploadImage(file, "avatars");
      const updated = await updateProfileRequest({ avatar: url });
      setUser(updated);
      toast.success("Avatar updated");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not upload that image"));
    } finally {
      setAvatarUploading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Profile</h1>
        <p className="mt-1 text-sm text-ink-soft/60">Manage your personal details and account security.</p>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group relative size-16 shrink-0 overflow-hidden rounded-full bg-line"
            disabled={avatarUploading}
          >
            {user.avatar && <Image src={user.avatar} alt={user.name} fill sizes="64px" className="object-cover" />}
            <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-white opacity-0 transition-opacity group-hover:bg-ink/50 group-hover:opacity-100">
              <Camera className="size-5" />
            </span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarSelected} />
          <div>
            <p className="font-medium text-ink">{user.name}</p>
            <p className="text-sm text-ink-soft/60">{user.email}</p>
          </div>
        </div>

        <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="mt-6 space-y-4">
          <Field label="Full name" error={profileForm.formState.errors.name?.message}>
            <Input {...profileForm.register("name")} />
          </Field>
          <Field label="Phone">
            <Input {...profileForm.register("phone")} />
          </Field>
          <Field label="Address">
            <Input {...profileForm.register("address")} />
          </Field>
          <Button type="submit" isLoading={profileForm.formState.isSubmitting}>
            Save changes
          </Button>
        </form>
      </Card>

      <Card className="p-5">
        <h2 className="font-display text-lg text-ink">Change password</h2>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="mt-4 space-y-4">
          <Field label="Current password" error={passwordForm.formState.errors.currentPassword?.message}>
            <Input type="password" {...passwordForm.register("currentPassword")} />
          </Field>
          <Field label="New password" error={passwordForm.formState.errors.newPassword?.message}>
            <Input type="password" {...passwordForm.register("newPassword")} />
          </Field>
          <Field label="Confirm new password" error={passwordForm.formState.errors.confirmPassword?.message}>
            <Input type="password" {...passwordForm.register("confirmPassword")} />
          </Field>
          <Button type="submit" variant="secondary" isLoading={passwordForm.formState.isSubmitting}>
            Update password
          </Button>
        </form>
      </Card>
    </div>
  );
}
