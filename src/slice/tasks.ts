import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SSHClientOptions } from '../ts/proxy-generator';

type State = {
  tasks: SSHClientOptions[];
};

const initialState: State = {
  tasks: [],
};

const tasks = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state: State, action: PayloadAction<SSHClientOptions>) {
      const newTask = action.payload;
      state.tasks = [newTask, ...state.tasks];
    },
    editTask(state: State, action: PayloadAction<SSHClientOptions>) {
      state.tasks.forEach((task, index) => {
        if (task.id === action.payload.id) {
          state.tasks[index] = action.payload;
        }
      });
    },
    deleteTask(state: State, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
  },
});

export const { addTask, deleteTask, editTask } = tasks.actions;

export default tasks;
