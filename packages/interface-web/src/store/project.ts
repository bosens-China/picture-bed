import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import * as _ from 'lodash-es';

export interface ProjectItem {
  id: string;
  total: number;
  title: string;
}

export interface ProjectStore {
  projects: ProjectItem[];
  // 当前激活
  current: string | null;
  addProject: (project: ProjectItem) => void;
  // 编辑项目
  editProject: (project: ProjectItem) => void;
  removeProject: (id: string) => void;
  setCurrent: (id: string | null) => void;
}

export const useProjectStore = create(
  persist<ProjectStore>(
    (set) => ({
      projects: [],
      current: '',
      addProject: (project) =>
        set(
          produce((state: ProjectStore) => {
            state.projects = _.uniqBy([...state.projects, project], 'id');
          }),
        ),
      removeProject: (id) =>
        set(
          produce((state: ProjectStore) => {
            state.projects = state.projects.filter((item) => item.id !== id);
          }),
        ),
      editProject: (project) =>
        set(
          produce((state: ProjectStore) => {
            const index = state.projects.findIndex(
              (item) => item.id === project.id,
            );
            if (index !== -1) {
              state.projects[index] = project;
            }
          }),
        ),
      setCurrent: (id) => set({ current: id }),
    }),
    {
      name: 'project-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
