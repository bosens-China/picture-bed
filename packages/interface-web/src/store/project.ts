import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import * as _ from 'lodash-es';

export interface ProjectItem {
  id: string;
  total?: number;
  title: string;
  // 用户标识
  userID: string;
}

export interface ProjectStore {
  projects: ProjectItem[];
  // 当前激活id
  current: string | null;
  addProject: (
    project: Omit<ProjectItem, 'id'> & Partial<Pick<ProjectItem, 'id'>>,
  ) => void;
  // 编辑项目
  editProject: (id: string, project: Omit<ProjectItem, 'id'>) => void;
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
            const obj = {
              ...project,
              id: project.id ?? project.userID,
            };
            state.projects = _.uniqBy([...state.projects, obj], 'id');
          }),
        ),
      removeProject: (id) =>
        set(
          produce((state: ProjectStore) => {
            state.projects = state.projects.filter((item) => item.id !== id);
          }),
        ),
      editProject: (id, project) =>
        set(
          produce((state: ProjectStore) => {
            const index = state.projects.findIndex((item) => item.id === id);
            Object.assign(state.projects[index], project);
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
