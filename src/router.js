import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import DashboardLayoutmap from "@/pages/Layout/DashboardLayoutmap.vue";
import DashboardCharger from "@/pages/Layout/DashboardCharger.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Profile from "@/pages/Profile.vue";
import UserProfile from "@/pages/UserProfile.vue";
import AddUserProfile from "@/pages/AddUserProfile.vue";
import AddEVCharger from "@/pages/AddEVCharger.vue";
import GiveEVCharger from "@/pages/GiveEVCharger.vue";
import EVCharger from "@/pages/EVCharger.vue";
import EVChargerFrom from "@/pages/EVChargerFrom.vue";
import GiveFeedback from "@/pages/GiveFeedback.vue";
import Register from "@/pages/Register.vue";
import password from "@/pages/resetpassword.vue";


import Login from "@/pages/Login.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayoutmap,
    redirect: "Dashboard",
    name: "Map",
    children: [
      {
        path: "/dashboard",
        name: "Map",
        component: Dashboard,
      },
      {
        path: "/evcharger",
        name: "Give EV Charger",
        component: GiveEVCharger,
      },
      {
        path: "/feedback",
        name: "Give Feedback",
        component: GiveFeedback,
      },
      {
        path: "/register",
        name: "Register",
        component: Register,
      },
      {
        path: "/login",
        name: "Login",
        component: Login,
      },
      {
        path: "/password",
        name: "password",
        component: password,
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
        path: "/adduser",
        name: "Add User Profile",
        component: AddUserProfile,
      },
      {
        path: "/profile",
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
        path: "/Addevcharger",
        name: "AddEVCharger",
        component: AddEVCharger,
      },
      {
        path: "/editevcharger",
        name: "EVCharger",
        component: EVCharger,
      },
      {
        path: "/evchargerFrom",
        name: "EVChargerFrom",
        component: EVChargerFrom,
      },
    ],
  },
  
  
];

export default routes;

