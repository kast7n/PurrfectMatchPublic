import { configureStore, legacy_createStore } from "@reduxjs/toolkit";
import counterReducer, { counterSlice } from "../../features/contact/counterReducer";
import { useDispatch, useSelector } from "react-redux";
import { uiSlice } from "../layout/uiSlice";
import { accountApi } from "../../features/account/accountApi";
import { petApi } from "../../features/pet/petApi";
import { filterOptionsApi } from "../../features/pet/filterOptionsApi";
import { favoritesApi } from "../../features/favorites/favoritesApi";
import { donationApi } from "../../features/donation/donationApi";
import { shelterApi } from "../../features/shelter/shelterApi";
import { shelterFilterOptionsApi } from "../../features/shelter/filterOptionsApi";
import { reviewsApi } from "../../features/reviews/reviewsApi";
import { articlesApi } from "../../features/articles/articlesApi";
import { notificationApi } from "../../features/notification/notificationApi";
import { userManagementApi } from "../../features/userManagement/userManagementApi";
import { petAttributesApi } from "../../features/management/api/petAttributesApi";
import { adoptionApplicationApi } from "../../features/adoptionApplication/adoptionApplicationApi";
import { statisticsApi } from "../../features/statistics/statisticsApi";
import { userProfileApi } from "../../features/userProfile/userProfileApi";

export function configureTheStore() {
    return legacy_createStore(counterReducer)
}

export const store = configureStore({
    reducer: {
        [accountApi.reducerPath]: accountApi.reducer,
        [petApi.reducerPath]: petApi.reducer,
        [filterOptionsApi.reducerPath]: filterOptionsApi.reducer,
        [favoritesApi.reducerPath]: favoritesApi.reducer,
        [donationApi.reducerPath]: donationApi.reducer,
        [shelterApi.reducerPath]: shelterApi.reducer,
        [shelterFilterOptionsApi.reducerPath]: shelterFilterOptionsApi.reducer,
        [reviewsApi.reducerPath]: reviewsApi.reducer,
        [articlesApi.reducerPath]: articlesApi.reducer,        [notificationApi.reducerPath]: notificationApi.reducer,
        [userManagementApi.reducerPath]: userManagementApi.reducer,        [petAttributesApi.reducerPath]: petAttributesApi.reducer,
        [adoptionApplicationApi.reducerPath]: adoptionApplicationApi.reducer,
        [statisticsApi.reducerPath]: statisticsApi.reducer,
        [userProfileApi.reducerPath]: userProfileApi.reducer,
        counter: counterSlice.reducer,
        ui: uiSlice.reducer,
    },    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(
            accountApi.middleware,
            petApi.middleware,
            filterOptionsApi.middleware,
            favoritesApi.middleware,
            donationApi.middleware,
            shelterApi.middleware,
            shelterFilterOptionsApi.middleware,
            reviewsApi.middleware,            articlesApi.middleware,
            notificationApi.middleware,
            userManagementApi.middleware,            petAttributesApi.middleware,
            adoptionApplicationApi.middleware,
            userManagementApi.middleware,
            adoptionApplicationApi.middleware,
            statisticsApi.middleware,
            userProfileApi.middleware
        )
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()