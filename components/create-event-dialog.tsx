'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud } from 'lucide-react';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEventDialog({ open, onOpenChange }: CreateEventDialogProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    setName('');
    setDate('');
    setDescription('');
    setCoverFile(null);
    setCoverPreview(null);
    setSuccess(false);
  };

  const handleCoverSelect = (files: FileList | null) => {
    const selected = files?.[0];
    if (!selected) return;

    setCoverFile(selected);
    setCoverPreview(URL.createObjectURL(selected));
  };

  const handleCreate = () => {
    setSuccess(true);
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-date">Event date</Label>
              <Input
                id="event-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
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
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Cover photo</p>
                <p className="text-sm text-muted-foreground">Upload an image that represents your event.</p>
              </div>
              <label className="inline-flex cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-primary hover:bg-primary/5">
                Choose file
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(event) => handleCoverSelect(event.target.files)}
                />
              </label>
            </div>
            {coverPreview ? (
              <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                <img src={coverPreview} alt="Cover preview" className="h-48 w-full object-cover" />
              </div>
            ) : (
              <div className="mt-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-muted-foreground">
                Upload a cover photo to preview the event.
              </div>
            )}
          </div>

          {success && (
            <div className="rounded-3xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              Event created successfully. You can now upload photos or share the event.
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name || !date || !coverFile}>
            Create Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
