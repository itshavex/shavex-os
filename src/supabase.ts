import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Retrieve Supabase credentials (prioritize environment variables, then local storage)
const getStoredCredentials = () => {
  if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
    return { url: env.SUPABASE_URL, key: env.SUPABASE_ANON_KEY };
  }
  try {
    const creds = localStorage.getItem('shavex_supabase_credentials');
    return creds ? JSON.parse(creds) : null;
  } catch (e) {
    return null;
  }
};

let supabaseClient = null;
const creds = getStoredCredentials();
if (creds && creds.url && creds.key) {
  try {
    supabaseClient = createClient(creds.url, creds.key);
    console.log("Supabase Client initialized successfully.");
  } catch (e) {
    console.error("Failed to initialize Supabase Client: ", e);
  }
}

// Simulated Local Storage Multi-User DB
const getLocalUsers = () => {
  try {
    const users = localStorage.getItem('shavex_sim_users');
    return users ? JSON.parse(users) : {};
  } catch (e) {
    return {};
  }
};

const saveLocalUsers = (users) => {
  localStorage.setItem('shavex_sim_users', JSON.stringify(users));
};

export const supabaseAdapter = {
  isCloudEnabled() {
    return supabaseClient !== null;
  },

  getClient() {
    return supabaseClient;
  },

  setCredentials(url, key) {
    if (url && key) {
      localStorage.setItem('shavex_supabase_credentials', JSON.stringify({ url, key }));
      try {
        supabaseClient = createClient(url, key);
        return true;
      } catch (e) {
        console.error("Invalid credentials format:", e);
        return false;
      }
    } else {
      localStorage.removeItem('shavex_supabase_credentials');
      supabaseClient = null;
      return true;
    }
  },

  getCredentials() {
    return getStoredCredentials() || { url: '', key: '' };
  },

  async signUp(email, password, fullName) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });
        if (error) throw error;
        
        // Seed default record if successfully registered
        if (data.user) {
          const defaultState = { onboarded: false, profile: { name: fullName, email: email, joinDate: new Date().toISOString().split('T')[0] } };
          await supabaseClient.from('shavex_os_states').upsert({ user_id: data.user.id, state: defaultState });
        }
        return { user: data.user, error: null };
      } catch (e) {
        return { user: null, error: e.message };
      }
    } else {
      // Simulated SignUp
      const users = getLocalUsers();
      if (users[email]) {
        return { user: null, error: "User already exists." };
      }
      const userId = 'sim_user_' + Math.random().toString(36).substr(2, 9);
      const newUser = {
        id: userId,
        email,
        password,
        name: fullName || "Guest User",
        joinDate: new Date().toISOString().split('T')[0],
        onboarded: false,
        state: null
      };
      users[email] = newUser;
      saveLocalUsers(users);
      return { user: { id: userId, email, user_metadata: { full_name: fullName } }, error: null };
    }
  },

  async signIn(email, password) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return { user: data.user, error: null };
      } catch (e) {
        return { user: null, error: e.message };
      }
    } else {
      // Simulated Login
      const users = getLocalUsers();
      const userRecord = users[email];
      if (!userRecord || userRecord.password !== password) {
        return { user: null, error: "Invalid email or password." };
      }
      return {
        user: {
          id: userRecord.id,
          email: userRecord.email,
          user_metadata: { full_name: userRecord.name }
        },
        error: null
      };
    }
  },

  async signInWithOAuth(provider) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
        return { success: true, error: null };
      } catch (e) {
        return { success: false, error: e.message };
      }
    } else {
      // Simulated social OAuth Login
      const mockEmail = `shashwat@${provider}.com`;
      const mockName = provider === 'google' ? "Shashwat Tiwari" : "Shashwat Tiwari (shavex)";
      const users = getLocalUsers();
      let userRecord = users[mockEmail];
      if (!userRecord) {
        const userId = 'sim_social_' + provider + '_' + Math.random().toString(36).substr(2, 5);
        userRecord = {
          id: userId,
          email: mockEmail,
          password: "",
          name: mockName,
          joinDate: new Date().toISOString().split('T')[0],
          onboarded: false,
          state: null
        };
        users[mockEmail] = userRecord;
        saveLocalUsers(users);
      }
      return {
        user: {
          id: userRecord.id,
          email: userRecord.email,
          user_metadata: { full_name: userRecord.name }
        },
        error: null
      };
    }
  },

  async signOut() {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    return { error: null };
  },

  async resetPassword(email) {
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
        if (error) throw error;
        return { success: true, error: null };
      } catch (e) {
        return { success: false, error: e.message };
      }
    } else {
      const users = getLocalUsers();
      if (!users[email]) {
        return { success: false, error: "Email not found." };
      }
      return { success: true, error: null };
    }
  },

  async syncPull(userId, email) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('shavex_os_states')
          .select('state')
          .eq('user_id', userId)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        return { state: data ? data.state : null, error: null };
      } catch (e) {
        console.error("Error pulling from Supabase:", e);
        return { state: null, error: e.message };
      }
    } else {
      // Simulated Sync Pull
      const users = getLocalUsers();
      const userRecord = Object.values(users).find(u => u.id === userId || u.email === email);
      return { state: userRecord ? userRecord.state : null, error: null };
    }
  },

  async syncPush(userId, email, state) {
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('shavex_os_states')
          .upsert({ user_id: userId, state: state });
        if (error) throw error;
        return { success: true, error: null };
      } catch (e) {
        console.error("Error pushing to Supabase:", e);
        return { success: false, error: e.message };
      }
    } else {
      // Simulated Sync Push
      const users = getLocalUsers();
      const key = Object.keys(users).find(k => users[k].id === userId || users[k].email === email);
      if (key) {
        users[key].state = state;
        users[key].onboarded = state.onboarded;
        saveLocalUsers(users);
      }
      return { success: true, error: null };
    }
  }
};
