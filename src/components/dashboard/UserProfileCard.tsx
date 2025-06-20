
import { User } from "@/types/user";
import { UserProfileDisplay } from "./user-profile/UserProfileDisplay";
import { UserProfileSidebar } from "./user-profile/UserProfileSidebar";
import { UserProfileEditDialog } from "./user-profile/UserProfileEditDialog";
import { useUserProfileData } from "./user-profile/hooks/useUserProfileData";
import { useUserProfileActions } from "./user-profile/hooks/useUserProfileActions";

interface UserProfileCardProps {
  user: User;
  onUpdateProfile?: (updatedUser: Partial<User>) => Promise<void>;
  inSidebar?: boolean;
}

export function UserProfileCard({ user, onUpdateProfile, inSidebar = false }: UserProfileCardProps) {
  console.log("UserProfileCard - User data received:", user);
  console.log("UserProfileCard - User first_name:", user.first_name);
  console.log("UserProfileCard - User last_name:", user.last_name);
  
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

  const {
    isEditing,
    setIsEditing,
    isUpdating,
    isUploadingAvatar,
    handleEditClick,
    handleSubmit
  } = useUserProfileActions(onUpdateProfile);

  console.log("UserProfileCard - Form data from hook:", formData);

  if (inSidebar) {
    return (
      <>
        <UserProfileSidebar
          user={user}
          displayName={displayName}
          onEditClick={handleEditClick}
        />
        <UserProfileEditDialog
          isOpen={isEditing}
          onOpenChange={setIsEditing}
          user={user}
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          isUpdating={isUpdating}
          isUploadingAvatar={isUploadingAvatar}
          isLoadingProfile={isLoadingProfile}
          inSidebar={true}
        />
      </>
    );
  }

  return (
    <>
      <UserProfileDisplay
        user={user}
        displayName={displayName}
        phone={formData.phone || user.phone}
        onEditClick={handleEditClick}
      />
      <UserProfileEditDialog
        isOpen={isEditing}
        onOpenChange={setIsEditing}
        user={user}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        isUpdating={isUpdating}
        isUploadingAvatar={isUploadingAvatar}
        isLoadingProfile={isLoadingProfile}
      />
    </>
  );
}
