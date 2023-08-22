import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import DashboardLayoutmap from "@/pages/Layout/DashboardLayoutmap.vue";
import DashboardCharger from "@/pages/Layout/DashboardCharger.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Profile from "@/pages/Profile.vue";
import UserProfile from "@/pages/UserProfile.vue";
import AppUserProfile from "@/pages/AppUserProfile.vue";
import AppEVCharger from "@/pages/AppEVCharger.vue";
import GiveEVCharger from "@/pages/GiveEVCharger.vue";
import GiveFeedback from "@/pages/GiveFeedback.vue";
import Register from "@/pages/Register.vue";


import Login from "@/pages/Login.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayoutmap,
    redirect: "DashboardLayoutmap",
    name: "Map",
    children: [
      {
        path: "dashboard",
        name: "Map",
        component: Dashboard,
      },
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
  {
    path: "/",
    component: DashboardLayout,
    redirect: "DashboardLayout",
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
    component: DashboardCharger,
    redirect: "DashboardCharger",
    children: [
      {
        path: "/appEVCharger",
        name: "AppEVCharger",
        component: AppEVCharger,
      },
    ],
  },
  
  
];

export default routes;

