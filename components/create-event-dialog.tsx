'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated?: () => void;
}

export function CreateEventDialog({ open, onOpenChange, onEventCreated }: CreateEventDialogProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    onOpenChange(false);
    setName('');
    setDate('');
    setDescription('');
    setCoverFile(null);
    setCoverPreview(null);
    setSuccess(false);
    setError(null);
  };

  const handleCoverSelect = (files: FileList | null) => {
    const selected = files?.[0];
    if (!selected) return;

    setCoverFile(selected);
    setCoverPreview(URL.createObjectURL(selected));
  };

  const handleCreate = async () => {
    if (!coverFile) return;

    setLoading(true);
    setError(null);

    try {
      // Convert cover file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || result;

        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: name,
            eventDate: date,
            description: description,
            images: [base64],
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to create event');
        }

        setSuccess(true);
        setTimeout(() => {
          onEventCreated?.();
          handleClose();
        }, 1500);
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setLoading(false);
      };
      reader.readAsDataURL(coverFile);
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create new event</DialogTitle>
          <DialogDescription>
            Add event details and a cover image to launch your next photo experience.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="event-name">Event name</Label>
              <Input
                id="event-name"
                placeholder="Example: Summer Launch Party"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-date">Event date</Label>
              <Input
                id="event-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              rows={4}
              placeholder="Describe the event experience, mood, and photo highlights."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Cover photo</p>
                <p className="text-sm text-muted-foreground">Upload an image that represents your event.</p>
              </div>
              <label className="inline-flex cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-primary hover:bg-primary/5 disabled:opacity-50">
                Choose file
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={loading}
                  onChange={(event) => handleCoverSelect(event.target.files)}
                />
              </label>
            </div>
            {coverPreview ? (
              <div className=" overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 mt-4">
                <img src={coverPreview} alt="Cover preview" className="h-40 w-full object-cover" />
              </div>
            ) : (
              <div className=" rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-muted-foreground mt-4">
                Upload a cover photo to preview the event.
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <div className="rounded-3xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              Event created successfully!
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!name || !date || !coverFile || loading || success}
          >
            {loading ? 'Creating...' : success ? 'Created!' : 'Create Event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
