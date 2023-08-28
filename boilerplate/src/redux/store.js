import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import customerSlice from "./customerSlice";
import keywordSlice from "./keywordSlice";
import rolesPermissionSlice from "./rolesPermissionSlice";
import campaignManagementReducer from "./campaignManagementSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    customer: customerSlice,
    keyword: keywordSlice,
    rolePermission: rolesPermissionSlice,
    campaignManagement: campaignManagementReducer
  },
});