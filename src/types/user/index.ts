
import { UserBase } from './UserBase';
import { UserTimestamps } from './UserTimestamps';
import { UserFormData } from './UserForm';
import { UserIdentification } from './UserIdentification';

// Simple User type that combines the base properties
export type User = UserBase;

export type { UserFormData, UserBase, UserTimestamps, UserIdentification };
