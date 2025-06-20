
import { User } from "@/types/user";
import { UserProfileDisplay } from "./user-profile/UserProfileDisplay";
import { UserProfileSidebar } from "./user-profile/UserProfileSidebar";
import { UserProfileForm } from "./user-profile/UserProfileForm";
import { useUserProfileData } from "./user-profile/hooks/useUserProfileData";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface UserProfileCardProps {
  user: User;
  onUpdateProfile?: (updatedUser: Partial<User>) => Promise<void>;
  inSidebar?: boolean;
}

export function UserProfileCard({ user, onUpdateProfile, inSidebar = false }: UserProfileCardProps) {
  console.log("UserProfileCard - User data received:", user);
  console.log("UserProfileCard - User first_name:", user.first_name);
  console.log("UserProfileCard - User last_name:", user.last_name);
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  if (!user) {
    console.log("UserProfileCard - No user data, returning null");
    return null;
  }

  const {
    formData,
    setFormData,
    displayName,
    isLoadingProfile
  } = useUserProfileData(user);

  const handleEditProfile = async (e: React.FormEvent, formData: any, avatarFile?: File) => {
    e.preventDefault();
    console.log("UserProfileCard - Profile updated:", formData);
    if (onUpdateProfile) {
      await onUpdateProfile(formData);
    }
    setEditingUser(null);
  };

  console.log("UserProfileCard - Form data from hook:", formData);

  if (inSidebar) {
    return (
      <>
        <UserProfileSidebar
          user={user}
          displayName={displayName}
          onEditClick={() => setEditingUser(user)}
        />
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingUser(null)}
                >
                  ×
                </Button>
              </div>
              <UserProfileForm
                user={editingUser}
                formData={formData}
                onFormDataChange={setFormData}
                onSubmit={handleEditProfile}
                onCancel={() => setEditingUser(null)}
                isUpdating={false}
                inSidebar={true}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <UserProfileDisplay
        user={user}
        displayName={displayName}
        phone={formData.phone || user.phone}
        onEditClick={() => setEditingUser(user)}
      />
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingUser(null)}
              >
                ×
              </Button>
            </div>
            <UserProfileForm
              user={editingUser}
              formData={formData}
              onFormDataChange={setFormData}
              onSubmit={handleEditProfile}
              onCancel={() => setEditingUser(null)}
              isUpdating={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
