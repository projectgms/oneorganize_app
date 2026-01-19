const norm = (s) => String(s || "").trim().toLowerCase();

export const hasPermission = (permissions = [], perm) => {
  const set = new Set((permissions || []).map(norm));
  return set.has(norm(perm));
};

export const hasAnyPermission = (permissions = [], perms = []) => {
  const set = new Set((permissions || []).map(norm));
  return (perms || []).some((p) => set.has(norm(p)));
};
