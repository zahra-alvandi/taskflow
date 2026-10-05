import { useCallback, useEffect, useState } from "react";
import { createUser } from "../../core/domain/User";

export function useAuth(repository) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await repository.get();
      if (!cancelled) {
        setUser(stored);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [repository]);

  const login = useCallback(
    async (email) => {
      const newUser = createUser({ email });
      await repository.save(newUser);
      setUser(newUser);
      return newUser;
    },
    [repository],
  );

  const logout = useCallback(async () => {
    await repository.clear();
    setUser(null);
  }, [repository]);

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };
}
