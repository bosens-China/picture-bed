import { create } from 'zustand';
import { produce } from 'immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import { useMemo } from 'react';

// 分组
export interface Grouping {
  id: string;
  uid: string;
  title: string;
}

// state
export interface GroupingState {
  groups: Grouping[];
  // 激活id
  activeId?: string;
  // 根据id删除分组
  removeGroup: (id: string) => void;
  // 添加分组
  addGroup: (group: Grouping) => void;
  // 编辑分组
  editGroup: (id: string, group: Omit<Grouping, 'id'>) => void;
  // 设置激活id
  setActiveId: (id: string) => void;
}

export const useGroupingStore = create<GroupingState>()(
  persist<GroupingState>(
    (set) => {
      return {
        groups: [],
        activeId: undefined,
        removeGroup: (id) => {
          set(
            produce((draft: GroupingState) => {
              draft.groups = draft.groups.filter((group) => group.id !== id);
              if (draft.activeId === id) {
                draft.activeId = undefined;
              }
            }),
          );
        },
        addGroup: (group) => {
          set(
            produce((draft: GroupingState) => {
              // 检索id是否存在
              const index = draft.groups.findIndex((g) => g.id === group.id);
              if (index !== -1) {
                return;
              }
              draft.groups.push(group);
            }),
          );
        },
        setActiveId: (id) => {
          set(
            produce((draft: GroupingState) => {
              draft.activeId = id;
            }),
          );
        },
        editGroup: (id, group) => {
          set(
            produce((draft: GroupingState) => {
              const index = draft.groups.findIndex((g) => g.id === id);
              if (index !== -1) {
                draft.groups[index] = { ...draft.groups[index], ...group };
              }
            }),
          );
        },
      };
    },
    {
      name: 'grouping-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useActiveGroup = () => {
  const { activeId, groups } = useGroupingStore(
    useShallow((state) => {
      return {
        activeId: state.activeId,
        groups: state.groups,
      };
    }),
  );
  return useMemo(() => {
    if (!activeId) {
      return undefined;
    }
    return groups.find((group) => group.id === activeId);
  }, [activeId, groups]);
};
