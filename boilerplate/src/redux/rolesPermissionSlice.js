import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  rolesPermissionsStatus: "idle",
  rolesPermissions: [],
  updateRolesStatus: "idle",
  createRolesStatus: "idle",
  createPermissionStatus: "idle",
  getAllRolesStatus: "idle",
  getAllPermissionsStatus: "idle",
  roles: [],
  permissions: [],
};

export const getAllRolesPermissionsMappings = createAsyncThunk(
  "rolesPermissions/getAllRolesPermissionsMappings",
  async () => {
    const { data } = await axios.get("/user-role-permission-mappings");
    return data;
  }
);

export const updateRolesIntoPermission = createAsyncThunk(
  "rolesPermissions/updateRolesIntoPermission",
  async ({ permissionId, roleIds }) => {
    const { data } = await axios.patch(`/permissions/update_roles/${permissionId}`, {
      roleIds: roleIds,
    });
    return data;
  }
);

export const createRoles = createAsyncThunk(
  "rolesPermissions/createRoles",
  async ({ name }) => {
    const { data } = await axios.post("/roles", {
      name: name,
    });
    return data;
  }
);

export const createPermission = createAsyncThunk(
  "rolesPermissions/createPermission",
  async ({ name }) => {
    const { data } = await axios.post("/permissions", {
      name: name,
    });
    return data;
  }
);

export const getAllRoles = createAsyncThunk("rolesPermissions/getAllRoles", async () => {
  const { data } = await axios.get("/roles");
  return data;
});

export const getAllPermissions = createAsyncThunk(
  "rolesPermissions/getAllPermissions",
  async () => {
    const { data } = await axios.get("/permissions");
    return data;
  }
);

export const rolesPermissionSlice = createSlice({
  name: "rolesPermission",
  initialState,
  reducers: {},
  extraReducers: {
    [getAllRolesPermissionsMappings.pending]: (state, action) => {
      state.rolesPermissionsStatus = "loading";
    },
    [getAllRolesPermissionsMappings.fulfilled]: (state, action) => {
      state.rolesPermissionsStatus = "success";
      state.rolesPermissions = action.payload;
    },
    [getAllRolesPermissionsMappings.rejected]: (state, action) => {
      state.rolesPermissionsStatus = "failed";
    },
    [updateRolesIntoPermission.pending]: (state, action) => {
      state.updateRolesStatus = "loading";
    },
    [updateRolesIntoPermission.fulfilled]: (state, action) => {
      state.updateRolesStatus = "success";
    },
    [updateRolesIntoPermission.rejected]: (state, action) => {
      state.updateRolesStatus = "failed";
    },
    [createRoles.pending]: (state, action) => {
      state.createRolesStatus = "loading";
    },
    [createRoles.fulfilled]: (state, action) => {
      state.createRolesStatus = "success";
    },
    [createRoles.rejected]: (state, action) => {
      state.createRolesStatus = "failed";
    },
    [createPermission.pending]: (state, action) => {
      state.createPermissionStatus = "loading";
    },
    [createPermission.fulfilled]: (state, action) => {
      state.createPermissionStatus = "success";
    },
    [createPermission.rejected]: (state, action) => {
      state.createPermissionStatus = "failed";
    },
    [getAllRoles.pending]: (state, action) => {
      state.getAllRolesStatus = "loading";
    },
    [getAllRoles.fulfilled]: (state, action) => {
      state.getAllRolesStatus = "success";
      state.roles = action.payload.data;
    },
    [getAllRoles.rejected]: (state, action) => {
      state.getAllRolesStatus = "failed";
    },
    [getAllPermissions.pending]: (state, action) => {
      state.getAllPermissionsStatus = "loading";
    },
    [getAllPermissions.fulfilled]: (state, action) => {
      state.getAllPermissionsStatus = "success";
      state.permissions = action.payload.data;
    },
    [getAllPermissions.rejected]: (state, action) => {
      state.getAllPermissionsStatus = "failed";
    },
  },
});

export default rolesPermissionSlice.reducer;
