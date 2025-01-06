import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const queryClient = useQueryClient();

  // Check initial session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id).then(profile => {
          if (profile) setUser(profile);
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (profile) setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id,
          email,
          full_name: fullName,
        },
      ]);

      if (profileError) throw profileError;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    queryClient.clear();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;
    
    // Update local user state
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const uploadAvatar = async (file: File) => {
    if (!user?.id) throw new Error('No user logged in');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    await updateProfile({ avatar_url: publicUrl });
  };

  return {
    user,
    signUp,
    signIn,
    signOut,
    updateProfile,
    uploadAvatar,
  };
};