import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ContactPage from "../../features/contact/ContactPage";
import AboutPage from "../../features/about/AboutPage";
import { PetBrowsePage } from "../../features/pet";
import { ShelterBrowsePage, ShelterDetailPage } from "../../features/shelter";
import BecomeShelterPage from "../../features/shelter/BecomeShelterPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import LoginForm from "../../features/account/LoginForm";
import RegisterForm from "../../features/account/RegisterForm";
import ForgotPasswordForm from "../../features/account/ForgotPasswordForm";
import ResetPasswordForm from "../../features/account/ResetPasswordForm";
import RequireAuth from "./RequireAuth";
import RequireAdminAuth from "./RequireAdminAuth";
import DonationPage from "../../features/donation/DonationPage";
import { DashboardLayout, DashboardHomePage, ComingSoonPage, ShelterApplicationsPage, AdoptionApplicationsPage, AllSheltersPage, UserManagementPage, PetAttributesOverviewPage, SpeciesManagementPage, BreedsManagementPage, ColorsManagementPage, CoatLengthsManagementPage, ActivityLevelsManagementPage, HealthStatusesManagementPage, PetsPageRouter } from "../../features/management";
import { ArticlesPage, LearningArticlesPage, CareGuidesPage, HealthWellnessPage, NewsUpdatesPage, ArticleDetailPage } from "../../features/articles";
import ArticleManagementPage from "../../features/management/pages/ArticleManagementPage";
import { NotificationsPage } from "../../features/notification/NotificationsPage";
import FavoritesPage from "../../features/favorites/FavoritesPage";
import { UserProfilePage } from "../../features/userProfile";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,        children: [            {element: <RequireAuth/>, children: [
                {path: 'checkout', element: <CheckoutPage/>},
                {path: 'notifications', element: <NotificationsPage/>},
                {path: 'favorites', element: <FavoritesPage/>},
                {path: 'profile', element: <UserProfilePage/>},
                {path: 'profile/:section', element: <UserProfilePage/>},
                {path: 'become-shelter', element: <BecomeShelterPage/>},
                {
                    path: 'dashboard',
                    element: <DashboardLayout />,                    children: [
                        { index: true, element: <DashboardHomePage /> },
                        { path: 'pets', element: <ComingSoonPage title="Pet Management" description="Manage pets, health records, and adoption status." /> },
                        { path: 'pets/all', element: <PetsPageRouter /> },{ path: 'pet-attributes', element: <PetAttributesOverviewPage /> },
                        { path: 'pet-attributes/species', element: <SpeciesManagementPage /> },
                        { path: 'pet-attributes/breeds', element: <BreedsManagementPage /> },
                        { path: 'pet-attributes/colors', element: <ColorsManagementPage /> },
                        { path: 'pet-attributes/coat-lengths', element: <CoatLengthsManagementPage /> },
                        { path: 'pet-attributes/activity-levels', element: <ActivityLevelsManagementPage /> },
                        { path: 'pet-attributes/health-statuses', element: <HealthStatusesManagementPage /> },{ path: 'shelters', element: <ComingSoonPage title="Shelter Management" description="Manage shelter registrations and applications." /> },
                        { path: 'shelters/all', element: <AllSheltersPage /> },
                        { path: 'shelters/applications', element: <ShelterApplicationsPage /> },
                        { path: 'shelters/*', element: <ComingSoonPage title="Shelter Management" description="Manage shelter registrations and applications." /> },
                        { path: 'users', element: <UserManagementPage /> },
                        { path: 'applications', element: <AdoptionApplicationsPage /> },
                        { path: 'donations', element: <ComingSoonPage title="Donations" description="Track and manage donations." /> },
                        { path: 'analytics', element: <ComingSoonPage title="Analytics" description="View system analytics and insights." /> },
                        {
                            path: 'articles',
                            element: <RequireAdminAuth />,
                            children: [
                                { index: true, element: <ArticleManagementPage /> }
                            ]
                        },
                        { path: 'reports', element: <ComingSoonPage title="Reports" description="Generate and view system reports." /> },
                        { path: 'settings', element: <ComingSoonPage title="Settings" description="Configure system settings and preferences." /> },
                        { path: 'settings/*', element: <ComingSoonPage title="Settings" description="Configure system settings and preferences." /> },
                        { path: 'my-shelter', element: <ComingSoonPage title="My Shelter" description="Manage your shelter information and pets." /> },
                        { path: 'my-shelter/*', element: <ComingSoonPage title="My Shelter" description="Manage your shelter information and pets." /> },
                    ]
                },
            ]},            {path: '', element: <HomePage />},
            {path: 'pets', element: <PetBrowsePage />},
            {path: 'shelters', element: <ShelterBrowsePage />},
            {path: 'shelters/:id', element: <ShelterDetailPage />},
            {path: 'about', element: <AboutPage/>},
            {path: 'contact', element: <ContactPage/>},
            {path: 'donate', element: <DonationPage/>},            {path: 'server-error', element: <ServerError/>},            {path: 'articles', element: <ArticlesPage/>},
            {path: 'articles/:id', element: <ArticleDetailPage/>},
            {path: 'articles/learning', element: <LearningArticlesPage/>},
            {path: 'articles/care-guides', element: <CareGuidesPage/>},
            {path: 'articles/health-wellness', element: <HealthWellnessPage/>},
            {path: 'articles/news', element: <NewsUpdatesPage/>},            {path: 'login', element: <LoginForm/>},
            {path: 'register', element: <RegisterForm/>},
            {path: 'forgot-password', element: <ForgotPasswordForm/>},
            {path: 'reset-password', element: <ResetPasswordForm/>},
            {path: 'not-found', element: <NotFound/>},
            {path: '*', element: <Navigate replace to='/not-found'/>}
        ]
    }
])