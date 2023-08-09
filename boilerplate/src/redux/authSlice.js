import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

const initialState = {
  status: "idle",
  isLoggedIn: false,
  user: {},
  profile: {},
  userStatus: "idle",
  users: [],
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData) => {
    const { data } = await axios.post("/auth/signin", userData);
    return data;
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData) => {
    const { data } = await axios.post("/auth/signup", userData);
    return data;
  }
);

export const getProfile = createAsyncThunk("auth/getProfile", async (id) => {
  const { data } = await axios.get("/api/profile/" + id);
  return data;
});

export const getUsers = createAsyncThunk("auth/getUsers", async () => {
  const { data } = await axios.get("/users/all");
  return data;
});


export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    logout: (state, action) => {
      localStorage.clear();
      state.isLoggedIn = false;
      axios.defaults.headers.common["authorization"] = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: {
    [loginUser.pending]: (state, action) => {
      state.status = "loading";
    },
    [loginUser.fulfilled]: (state, action) => {
      const { access_token } = action.payload;
      const { email, sub } = parseJwt(access_token);
      const _id = sub
      const token = access_token


      localStorage.setItem(
        "login",
        JSON.stringify({ token, email, _id, isLoggedIn: true })
      );
      state.user.email = email;
      state.user._id = _id;
      state.status = "success";
      state.isLoggedIn = true;
    },
    [loginUser.rejected]: (state, action) => {
      state.status = "failed";
      state.isLoggedIn = false;
    },

    [registerUser.pending]: (state, action) => {
      state.status = "loading";
    },
    [registerUser.fulfilled]: (state, action) => {
      state.status = "success";
      const { access_token } = action.payload;
      const { email, sub } = parseJwt(access_token);
      const _id = sub
      const token = access_token


      localStorage.setItem(
        "login",
        JSON.stringify({ token, email, _id, isLoggedIn: true })
      );
      state.user.email = email;
      state.user._id = _id;
      state.status = "success";
      state.isLoggedIn = true;
    },
    [registerUser.rejected]: (state, action) => {
      state.status = "failed";
      state.isLoggedIn = false;
    },

    [getProfile.pending]: (state, action) => {
      state.status = "loading";
    },
    [getProfile.fulfilled]: (state, action) => {
      state.status = "success";
      state.profile = action.payload.profile;
    },
    [getProfile.rejected]: (state, action) => {
      state.status = "failed";
    },

    [getUsers.pending]: (state, action) => {
      state.userStatus = "loading";
    },
    [getUsers.fulfilled]: (state, action) => {
      state.userStatus = "success";
      console.log(action.payload);
      state.users = action.payload;
    },
    [getUsers.rejected]: (state, action) => {
      state.userStatus = "failed";
    },
  },
});

export default authSlice.reducer;
export const { setAuth, logout } = authSlice.actions;
