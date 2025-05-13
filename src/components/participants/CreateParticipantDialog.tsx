
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CreateParticipantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateParticipantDialog({ open, onOpenChange, onSuccess }: CreateParticipantDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          },
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");

      // Create account with type participant
      const { error: accountError } = await supabase
        .from('accounts')
        .upsert([
          {
            user_id: authData.user.id,
            email: formData.email,
            type: 'participant',
            role: 'buyer', // Default role
            status: 'active',
            display_name: `${formData.firstName} ${formData.lastName}`.trim()
          }
        ]);

      if (accountError) throw accountError;

      // Create participant profile
      const { data: accountsData } = await supabase
        .from('accounts')
        .select('id')
        .eq('user_id', authData.user.id)
        .eq('type', 'participant')
        .single();

      if (accountsData) {
        const { error: profileError } = await supabase
          .from('participants_profile')
          .upsert([
            {
              id: accountsData.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email
            }
          ]);

        if (profileError) throw profileError;
      }

      toast({
        title: 'Success',
        description: 'Participant created successfully',
      });

      // Reset form and close dialog
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      });
      
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error creating participant:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create participant',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Participant</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Participant'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
