import supabase from "./supabase";

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

// utils/auth.ts
export async function signUpWithProfile(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  birthday: string
): Promise<{ success: boolean; error?: string }> {
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    return { success: false, error: signUpError.message };
  }

  if (data?.user) {
    const { error: profileError } = await supabase.from("user_profile").insert({
      id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      birthday,
    });

    if (profileError) {
      return { success: false, error: "Account created but failed to save profile details." };
    }
  }

  return { success: true };
}