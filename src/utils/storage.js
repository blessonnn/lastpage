// Helper module for localStorage data layer

export const getFriendSession = () => {
  const session = localStorage.getItem("lastpage_friend");
  return session ? JSON.parse(session) : null;
};

export const saveFriendSession = (data) => {
  localStorage.setItem("lastpage_friend", JSON.stringify(data));
};

export const clearFriendSession = () => {
  localStorage.removeItem("lastpage_friend");
};

export const saveDraft = (message, photo) => {
  const session = getFriendSession();
  if (session) {
    saveFriendSession({ ...session, draft_message: message, draft_photo: photo });
  }
};

export const getAllEntries = () => {
  const entries = localStorage.getItem("lastpage_entries");
  return entries ? JSON.parse(entries) : [];
};

export const submitEntry = (entry) => {
  const entries = getAllEntries();
  const newEntry = {
    ...entry,
    id: Date.now().toString(),
    submittedAt: new Date().toISOString()
  };
  
  localStorage.setItem("lastpage_entries", JSON.stringify([newEntry, ...entries]));
  
  const session = getFriendSession();
  if (session) {
    saveFriendSession({ ...session, submitted: true, submittedEntry: newEntry });
  }
  return newEntry;
};

export const updateEntry = (id, updatedData) => {
  const entries = getAllEntries();
  const index = entries.findIndex(e => e.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updatedData };
    localStorage.setItem("lastpage_entries", JSON.stringify(entries));
  }
};

export const deleteEntry = (id) => {
  const entries = getAllEntries();
  const filtered = entries.filter(e => e.id !== id);
  localStorage.setItem("lastpage_entries", JSON.stringify(filtered));
};

export const getAdminSession = () => {
  const session = localStorage.getItem("lastpage_admin");
  return session ? JSON.parse(session) : null;
};

export const setAdminSession = (isAdmin) => {
  localStorage.setItem("lastpage_admin", JSON.stringify({ isAdmin }));
};

export const clearAdminSession = () => {
  localStorage.removeItem("lastpage_admin");
};
