import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading:{
        projectSLoading: false,
        delayTaskLoading: false,
    },
    projectsData: null,
    delayedTaskData: null,
    error: null,
};


const projectSlice = createSlice({
    name:"projectSlice",
    initialState,
    reducers:{
        getProjectDataReq: (state, action) =>{
            state.loading.projectSLoading = true;
        },
        getProjectDataSucc: (state, action) =>{
            state.loading.projectSLoading = false;
            state.projectsData = action.payload;
        },
        getProjectDataFail: (state, action) =>{
            state.loading.projectSLoading = false;
            state.error = action.payload;
        },

        getDelayedTaskReq: (state, action) => {
            state.loading.delayTaskLoading =  true;
        },
        getDelayedTaskSucc: (state, action) => {
            state.loading.delayTaskLoading =  false;
            state.delayedTaskData = action.payload;
        },
        getDelayedTaskFail: (state, action) => {
            state.loading.delayTaskLoading = false;
            state.error = action.payload;
        },
    }
});

export const {getProjectDataFail, getProjectDataReq, getProjectDataSucc, getDelayedTaskFail, getDelayedTaskReq, getDelayedTaskSucc} = projectSlice.actions;

export default projectSlice.reducer;
