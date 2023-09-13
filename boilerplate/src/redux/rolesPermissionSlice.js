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
  permissionsByRoleStatus: "idle",
  createRolesPermissionMappingStatus: "idle",
  getAllRolesPermissionsMappingsByUserStatus: "idle",
  roles: [],
  permissions: [],
  userRoles: [],
  userPermissions: [],
  permissionsByRole: []
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
  async (payload) => {
    console.log(payload, "------->");
    const { data } = await axios.post("/permissions", payload);
    return data;
  }
);

export const createRolesPermissionMapping = createAsyncThunk(
  "rolesPermissions/createPermissionRolesMapping",
  async (payload) => {
    const { data } = await axios.post("/user-role-permission-mappings", payload);
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


export const getAllPermissionsByRole = createAsyncThunk(
  "permissions/byRoleId",
  async (roleid) => {
    const { data } = await axios.get("/permissions/roles/" + roleid)
    return data
  }
)

export const getAllRolesPermissionsMappingsByUser = createAsyncThunk(
  "rolesPermissions/byUserId",
  async (userId) => {
    const { data } = await axios.get("/user-role-permission-mappings/users/" + userId)
    return data
  }
)

export const rolesPermissionSlice = createSlice({
  name: "rolesPermission",
  initialState,
  reducers: {
    getUserRolesPermissionsByMapping: (state, action) => {
      state.userRoles = []
      state.userPermissions = []
      state.rolesPermissions.map(e => {
        if (e.userId === action.payload) {
          if (e.role) state.userRoles.push(e.role)
          if (e.permission) state.userPermissions.push(e.permission)
        }
      })
    }
  },
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
      state.roles = action.payload;
    },
    [getAllRoles.rejected]: (state, action) => {
      state.getAllRolesStatus = "failed";
    },
    [getAllPermissions.pending]: (state, action) => {
      state.getAllPermissionsStatus = "loading";
    },
    [getAllPermissions.fulfilled]: (state, action) => {
      state.getAllPermissionsStatus = "success";
      state.permissions = action.payload;
    },
    [getAllPermissions.rejected]: (state, action) => {
      state.getAllPermissionsStatus = "failed";
    },
    [getAllPermissionsByRole.pending]: (state, action) => {
      state.permissionsByRoleStatus = "loading";
    },
    [getAllPermissionsByRole.fulfilled]: (state, action) => {
      state.permissionsByRoleStatus = "success";
      state.permissionsByRole = action.payload;
    },
    [getAllPermissionsByRole.rejected]: (state, action) => {
      state.permissionsByRoleStatus = "failed";
    },
    [createRolesPermissionMapping.pending]: (state, action) => {
      state.createRolesPermissionMappingStatus = "loading";
    },
    [createRolesPermissionMapping.fulfilled]: (state, action) => {
      state.createPermissionStatus = "success"
      state.rolesPermissions = [...state.rolesPermissions, action.payload]

    },
    [createRolesPermissionMapping.rejected]: (state, action) => {
      state.createRolesPermissionMappingStatus = "failed";
    },
    [getAllRolesPermissionsMappingsByUser.pending]: (state, action) => {
      state.getAllRolesPermissionsMappingsByUserStatus = "loading";
    },
    [getAllRolesPermissionsMappingsByUser.fulfilled]: (state, action) => {
      state.getAllRolesPermissionsMappingsByUserStatus = "success"
      console.log(action.payload);
      action.payload.map(e => {
        if (e.role) state.userRoles.push(e.role)
        if (e.permission) state.userPermissions.push(e.permission)
      })

    },
    [getAllRolesPermissionsMappingsByUser.rejected]: (state, action) => {
      state.getAllRolesPermissionsMappingsByUserStatus = "failed";
    },
  },
});

export const { getUserRolesPermissionsByMapping } = rolesPermissionSlice.actions;


export default rolesPermissionSlice.reducer;
