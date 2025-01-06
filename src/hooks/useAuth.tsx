import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const queryClient = useQueryClient();

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Fetched profile:', data);
      return data;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        console.log('Initial session check:', session?.user?.id);
        
        if (session?.user && mounted) {
          const profile = await fetchProfile(session.user.id);
          if (profile && mounted) {
            console.log('Setting initial user profile:', profile);
            setUser(profile);
          }
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);
          
          if (session?.user && mounted) {
            const profile = await fetchProfile(session.user.id);
            if (profile && mounted) {
              console.log('Setting user profile after auth change:', profile);
              setUser(profile);
              queryClient.invalidateQueries({ queryKey: ['profile'] });
            }
          } else {
            console.log('No session or signed out, clearing user state');
            if (mounted) {
              setUser(null);
              queryClient.clear();
            }
          }
        });

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast.error('Error initializing authentication');
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [queryClient]);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
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
    setUser(null);
    queryClient.clear();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;
    
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
    resetPassword,
    updateProfile,
    uploadAvatar,
  };
};