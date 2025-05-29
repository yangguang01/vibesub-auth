import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  getIdToken
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  // 获取并打印当前用户的ID令牌
  const getIdToken = async (forceRefresh = false) => {
    if (!user) {
      console.log('没有用户登录，无法获取ID令牌');
      return null;
    }
    
    try {
      const token = await user.getIdToken(forceRefresh);
      console.log('当前用户ID令牌:', token);
      return token;
    } catch (error) {
      console.error('获取ID令牌失败:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    login,
    loginWithGoogle,
    logout,
    getIdToken
  };
} 