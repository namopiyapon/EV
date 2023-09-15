import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import DashboardLayoutmap from "@/pages/Layout/DashboardLayoutmap.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Profile from "@/pages/Profile.vue";
import UserProfile from "@/pages/UserProfile.vue";
import AddUserProfile from "@/pages/AddUserProfile.vue";
import GiveFeedback from "@/pages/GiveFeedback.vue";
import Register from "@/pages/Register.vue";
import password from "@/pages/resetpassword.vue";
import DashboardLayoutstation from "@/pages/Layout/DashboardLayoutstation.vue";
import station from "@/pages/station.vue";
import editstation from "@/pages/editstation.vue";
import DashboardLayoutaddstation from "@/pages/Layout/DashboardLayoutaddstation.vue";
import addstation from "@/pages/addstation.vue";
import addeditstation from "@/pages/addeditstation.vue";
import uptype from "@/pages/uptype.vue";


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
  {
    path: "/uptype",
    name: "uptype",
    component: uptype,
  },
    ],
  },
  {
    path: "/",
    component: DashboardLayout,
    redirect: "DashboardLayout",
    children: [
      {
        path: "/user/:id",
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
    component: DashboardLayoutstation,
    redirect: "DashboardLayoutstation",
    children: [
      {
        path: "/station",
        name: "station",
        component: station,
      },
      {
        path: "/editstation/:id",
        name: "editstation",
        component: editstation,
      },
    ],
  },
  {
    path: "/",
    component: DashboardLayoutaddstation,
    redirect: "DashboardLayoutaddstation",
    children: [
      {
        path: "/addstation",
        name: "addstation",
        component: addstation,
      },
      {
        path: "/addeditstation/:id",
        name: "addeditstation",
        component: addeditstation,
      },
    ],
  },


];

export default routes;

