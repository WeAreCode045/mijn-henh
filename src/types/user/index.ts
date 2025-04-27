
import { UserBase } from './UserBase';
import { UserContact } from './UserContact';
import { UserTimestamps } from './UserTimestamps';
import { UserFormData } from './UserForm';

export type User = UserBase & UserContact & UserTimestamps;

export type { UserFormData, UserBase, UserContact, UserTimestamps };
