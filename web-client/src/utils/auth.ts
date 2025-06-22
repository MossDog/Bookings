import supabase from "./supabase";

export const signInWithOAuth = async (provider: "google" | "apple") => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
  });
    
  if (error) console.error('Error logging in:', error.message);
};

export const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting user:", error.message);
    return null;
  }

  return user;
};

export const isAuthenticated = async () => {
  const user = await getUser();

  return user != null;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error.message);
    return;
  }
};
