import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types";

interface UsersState {
    users?: User[],
    setUsers: (users: User[]) => void
}   

export const useUsersOp = create<UsersState>()(
    persist(
        (set) => ({
            setUsers: (users: User[]) => set((state) => ({...state, users }))
        }),
        { name: 'users-state'}
    )
)