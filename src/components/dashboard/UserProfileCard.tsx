
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
  if (!user) {
    return null;
  }

  const {
    formData,
    setFormData,
    displayName,
    isLoadingProfile,
    fetchCompleteProfile
  } = useUserProfileData(user);

  const {
    isEditing,
    setIsEditing,
    isUpdating,
    handleEditClick,
    handleSubmit
  } = useUserProfileActions(onUpdateProfile, fetchCompleteProfile);

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
          onSubmit={(e) => handleSubmit(e, formData)}
          isUpdating={isUpdating}
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
        onSubmit={(e) => handleSubmit(e, formData)}
        isUpdating={isUpdating}
        isLoadingProfile={isLoadingProfile}
      />
    </>
  );
}
