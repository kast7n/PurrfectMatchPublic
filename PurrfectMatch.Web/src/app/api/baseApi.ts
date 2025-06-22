import { BaseQueryApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../layout/uiSlice";
import { toast } from "react-toastify";
import { router } from "../routes/Routes";

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7087/api/';

console.log('API Base URL:', baseUrl);

const customBaseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  credentials: 'include',
});

type ErrorResponse = | string | { title: string} | {errors: string[]};

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

export async function baseQueryWithErrorHandling(args: string | FetchArgs, 
    api: BaseQueryApi, 
    extraOptions: object) {
        api.dispatch(startLoading());
        await sleep();
        const result = await customBaseQuery(args, api, extraOptions);
        api.dispatch(stopLoading());
        if(result.error) {
            const originalStatus = result.error.status ==="PARSING_ERROR" && result.error.originalStatus 
                ? result.error.originalStatus 
                : result.error.status;            const responseData = result.error.data as ErrorResponse;
            
            // Check if this is a user-info request to avoid showing unauthorized popups on page load
            const isUserInfoRequest = typeof args === 'string' && args.includes('user-info') ||
                                    (typeof args === 'object' && args.url && args.url.includes('user-info'));
            
            switch (originalStatus) {
                case 400:
                    if(typeof responseData === 'string')
                        toast.error(responseData);
                    else if(responseData && 'errors' in responseData)
                        throw Object.values(responseData.errors).flat().join(', ');
                    else if(responseData && 'title' in responseData)
                        toast.error(responseData.title);
                    break;
                case 401:
                    // Only show unauthorized toast if it's not a user-info request (to avoid popups on page load)
                    if(!isUserInfoRequest && responseData && typeof responseData === 'object' && 'title' in responseData)
                        toast.error(responseData.title);
                    break;
                case 404:
                    if(responseData && typeof responseData === 'object' && 'title' in responseData)
                        router.navigate('/not-found');
                    break;
                case 500:
                    if(responseData && typeof responseData === 'object')
                        router.navigate('/server-error',{state: {error: responseData}});
                    break;
                default:
                    break;
            }
        }

        return result;
    }