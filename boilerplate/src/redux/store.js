import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import customerSlice from "./customerSlice";
import keywordSlice from "./keywordSlice";
import rolesPermissionSlice from "./rolesPermissionSlice";
import campaignManagementReducer from "./campaignManagementSlice";
import campaignReducer from "./campaignSlice";
import profileDataCardSlice from "./profileDataCardSlice";
import customerProfileSlice from "./customerProfileSlice";
import profileAnalysisSlice from "./profileAnalysisSlice";
import profilingSlice from "./profileTypesSlice";
import campaignListSlice from "./campaignListSlice";
import elasticCustomersSlice from "./elasticCustomersSlice";
import profileCountWidgetReducer from "./profileCountWidgetSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    customer: customerSlice,
    keyword: keywordSlice,
    rolePermission: rolesPermissionSlice,
    campaignManagement: campaignManagementReducer,
    campaign: campaignReducer,
    profileDataCard: profileDataCardSlice,
    customerProfileTool: customerProfileSlice,
    profileCount: profileAnalysisSlice,
    profileTypesCustomerMapping: profilingSlice,
    campaignListSlice: campaignListSlice,
    elasticCustomers: elasticCustomersSlice,
    profileCountWidget: profileCountWidgetReducer,
  },
});
