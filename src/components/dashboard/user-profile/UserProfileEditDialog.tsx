
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangePasswordForm } from "@/components/users/ChangePasswordForm";
import { UserProfileForm } from "./UserProfileForm";
import { User } from "@/types/user";

interface UserProfileEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    whatsapp_number: string;
  };
  onFormDataChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isUpdating: boolean;
  isLoadingProfile: boolean;
  inSidebar?: boolean;
}

export function UserProfileEditDialog({
  isOpen,
  onOpenChange,
  user,
  formData,
  onFormDataChange,
  onSubmit,
  isUpdating,
  isLoadingProfile,
  inSidebar = false
}: UserProfileEditDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
        </DialogHeader>
        {isLoadingProfile ? (
          <div className="flex justify-center p-4">
            <span>Loading profile data...</span>
          </div>
        ) : (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <UserProfileForm
                user={user}
                formData={formData}
                onFormDataChange={onFormDataChange}
                onSubmit={onSubmit}
                onCancel={() => onOpenChange(false)}
                isUpdating={isUpdating}
                inSidebar={inSidebar}
              />
            </TabsContent>
            <TabsContent value="password">
              <div className="mt-4">
                <ChangePasswordForm />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
