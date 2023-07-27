import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import DashboardLayoutmap from "@/pages/Layout/DashboardLayoutmap.vue";
import DashboardLayoutGive from "@/pages/Layout/DashboardLayoutGive.vue";

import Dashboard from "@/pages/Dashboard.vue";
import Profile from "@/pages/Profile.vue";
import UserProfile from "@/pages/UserProfile.vue";
import AppUserProfile from "@/pages/AppUserProfile.vue";
import GiveEVCharger from "@/pages/GiveEVCharger.vue";
import GiveFeedback from "@/pages/GiveFeedback.vue";
import Register from "@/pages/Register.vue";

import Login from "@/pages/Login.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayoutmap,
    redirect: "dashboard",
    children: [
      {
        path: "dashboard",
        name: "Map",
        component: Dashboard,
      },
    ],
  },
  {
    path: "/",
    component: DashboardLayout,
    redirect: "dashboard",
    children: [
      {
        path: "/user",
        name: "User Profile",
        component: UserProfile,
      },
      {
        path: "/appuser",
        name: "App User Profile",
        component: AppUserProfile,
      },
      {
        path: "profile",
        name: "Profile",
        component: Profile,
      },
    ],
  },
  {
    path: "/",
    component: DashboardLayoutGive,
    redirect: "dashboard",
    children: [
      {
        path: "evcharger",
        name: "Give EV Charger",
        component: GiveEVCharger,
      },
      {
        path: "feedback",
        name: "Give Feedback",
        component: GiveFeedback,
      },
      {
        path: "register",
        name: "Register",
        component: Register,
      },
      {
        path: "login",
        name: "Login",
        component: Login,
      },
    ],
  },
  
];

export default routes;

