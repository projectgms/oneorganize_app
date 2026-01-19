import React, { createContext, useContext, useMemo, useState } from "react";

const AppDataContext = createContext(null);

const initialProjects = [
  { id: "p1", name: "OneOrganize SaaS", status: "In Progress", progress: 68 },
  { id: "p2", name: "Recruiter Dashboard", status: "In Review", progress: 84 },
  { id: "p3", name: "Chat Service", status: "In Progress", progress: 55 },
];

const initialLeaves = [
  { id: "l1", type: "Sick Leave", from: "2026-01-16", to: "2026-01-16", reason: "Fever", status: "Approved" },
  { id: "l2", type: "Casual Leave", from: "2026-01-20", to: "2026-01-21", reason: "Family work", status: "Pending" },
];

export function AppDataProvider({ children }) {
  const [projects] = useState(initialProjects);
  const [leaves, setLeaves] = useState(initialLeaves);

  const addLeave = ({ type, from, to, reason }) => {
    const id = `l_${Date.now()}`;
    setLeaves((prev) => [
      { id, type, from, to, reason, status: "Pending" },
      ...prev,
    ]);
  };

  const cancelLeave = (leaveId) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === leaveId && l.status === "Pending" ? { ...l, status: "Cancelled" } : l))
    );
  };

  // for demo: pretend admin action
  const setLeaveStatus = (leaveId, status) => {
    setLeaves((prev) => prev.map((l) => (l.id === leaveId ? { ...l, status } : l)));
  };

  const value = useMemo(
    () => ({ projects, leaves, addLeave, cancelLeave, setLeaveStatus }),
    [projects, leaves]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export const useAppData = () => useContext(AppDataContext);
