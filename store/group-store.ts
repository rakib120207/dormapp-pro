import { create } from "zustand";
import type { Group, GroupMemberWithProfile } from "@/types";

interface GroupState {
  currentGroup: Group | null;
  currentMembers: GroupMemberWithProfile[];
  isAdmin: boolean;
  setCurrentGroup: (group: Group | null) => void;
  setCurrentMembers: (members: GroupMemberWithProfile[]) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  reset: () => void;
}

export const useGroupStore = create<GroupState>((set) => ({
  currentGroup: null,
  currentMembers: [],
  isAdmin: false,
  setCurrentGroup: (group) => set({ currentGroup: group }),
  setCurrentMembers: (members) => set({ currentMembers: members }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  reset: () => set({ currentGroup: null, currentMembers: [], isAdmin: false }),
}));