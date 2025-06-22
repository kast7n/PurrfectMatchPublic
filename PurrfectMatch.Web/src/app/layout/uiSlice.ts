import { createSlice } from "@reduxjs/toolkit";

const getinitialDarkMode = () => {
    const storedDarkMode = localStorage.getItem('darkMode');
    return storedDarkMode ? JSON.parse(storedDarkMode) : true;
  }

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isLoading: false,
        darkMode: getinitialDarkMode()
    },
    reducers: {
        startLoading: (state) => {
            state.isLoading = true;
        },
        stopLoading: (state) => {
            state.isLoading = false;
        },
        toggleDarkMode: (state) => {
            //console.log(state.darkMode);
            localStorage.setItem('darkMode', JSON.stringify(!state.darkMode));
            state.darkMode = !state.darkMode;
        }  
    }
});

export const {startLoading, stopLoading, toggleDarkMode} = uiSlice.actions;