import { useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  avatarUrl?: string;
  avatarBg?: string;
}

const STORAGE_KEY = 'dokuy_user_profile';
const PROFILE_UPDATED_EVENT = 'dokuy_user_profile_updated';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Bims Engineer',
  email: 'engineer@gmail.com',
  role: 'Software Engineer',
  department: 'IT Department',
  phone: '+62 812-3456-7890',
  avatarBg: 'bg-zinc-950 text-white',
};

export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      return {
        ...DEFAULT_USER_PROFILE,
        ...JSON.parse(raw),
      };
    }
  } catch (e) {
    console.error('Failed to parse user profile', e);
  }

  return DEFAULT_USER_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(profile)
    );

    window.dispatchEvent(
      new Event(PROFILE_UPDATED_EVENT)
    );
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(
    () => getUserProfile()
  );

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(getUserProfile());
    };

    window.addEventListener(
      PROFILE_UPDATED_EVENT,
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        PROFILE_UPDATED_EVENT,
        handleUpdate
      );
    };
  }, []);

  const update = (newProfile: Partial<UserProfile>) => {
    const updated = {
      ...profile,
      ...newProfile,
    };

    saveUserProfile(updated);
    setProfile(updated);
  };

  return {
    profile,
    update,
  };
}
