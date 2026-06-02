'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/ui/avatar';

interface Profile {
  id: string; // UUID
  user_id: string; // UUID
  name: string;
  email: string;
  phone?: string;
  photo?: string | null; // photo UUID
  image_data?: string; // base64 image data for preview
}

const STORAGE_KEY = 'yena_profile_cache';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const cached = window.localStorage.getItem(STORAGE_KEY);
        if (!cached) return false;

        const parsed = JSON.parse(cached) as Profile;
        setProfile(parsed);
        setName(parsed.name || '');
        setEmail(parsed.email || '');
        setPhone(parsed.phone || '');
        if (parsed.image_data) {
          setPhotoPreview(`data:image/jpeg;base64,${parsed.image_data}`);
        }
        return true;
      } catch (error) {
        console.warn('Failed to parse cached profile', error);
        window.localStorage.removeItem(STORAGE_KEY);
        return false;
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.success && data.profile) {
          const profileWithImage = {
            ...data.profile,
            image_data: data.profile.photo_data || data.profile.image_data || null,
          } as Profile;

          setProfile(profileWithImage);
          setName(profileWithImage.name || '');
          setEmail(profileWithImage.email || '');
          setPhone(profileWithImage.phone || '');
          if (profileWithImage.image_data) {
            setPhotoPreview(`data:image/jpeg;base64,${profileWithImage.image_data}`);
          }
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profileWithImage));
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };

    const hasCache = loadFromStorage();
    if (!hasCache) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || result;
      setPhotoBase64(base64);
      setPhotoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setSaving(true);
    setError(null);

    try {
      const payload: any = { name, email, phone };
      if (photoBase64) payload.photo = photoBase64;

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save');

      const profileWithImage = {
        ...data.profile,
        image_data: data.profile.photo_data || data.profile.image_data || null,
      } as Profile;

      setProfile(profileWithImage);
      setEditing(false);
      if (profileWithImage.image_data) {
        setPhotoPreview(`data:image/jpeg;base64,${profileWithImage.image_data}`);
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profileWithImage));
    } catch (err: any) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your profile information.</p>
        </div>

        <Card className="p-8 border-0 bg-background card-shadow max-w-3xl">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-start">
              <div className="flex flex-col items-center md:items-start md:col-span-1">
                <div className="w-32 h-32 mb-4">
                  {photoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoPreview} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-xl">👤</div>
                  )}
                </div>

                {editing && (
                  <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-primary">
                    Change photo
                    <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                  </label>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} disabled={!editing} />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editing} />
                  </div>

                  <div>
                    <Label>Phone</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editing} />
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <div className="flex gap-3 mt-4">
                    {editing ? (
                      <>
                        <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
                          Cancel
                        </Button>
                        <Button onClick={save} disabled={saving}>
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
