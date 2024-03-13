import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import ProfileTypeAnalysis from "./ProfileTypeAnalysis";
import {
  fetchMenuItems,
  fetchDistribution,
} from "../../redux/profileCountWidgetSlice";
import "@testing-library/jest-dom";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock("../../redux/profileCountWidgetSlice", () => ({
  fetchMenuItems: jest.fn(),
  fetchDistribution: jest.fn(),
}));

describe("ProfileTypeAnalysis Component", () => {
  let store;

  beforeEach(() => {
    const initialState = {
      profileCountWidget: {
        menuItems: {
          profileTypeItems: ["All", "Type1"],
          demographicItems: ["all", "Demo1"],
        },
        distribution: {},
        status: "idle",
        error: null,
      },
    };
    store = mockStore(initialState);

    fetchMenuItems.mockImplementation(() => async (dispatch) => {
      dispatch({
        type: "profileCountWidget/fetchMenuItems/fulfilled",
        payload: initialState.profileCountWidget.menuItems,
      });
    });

    fetchDistribution.mockImplementation(() => async (dispatch) => {
      dispatch({
        type: "profileCountWidget/fetchDistribution/fulfilled",
        payload: { Type1: 10, Demo1: 5 },
      });
    });
  });

  it("renders and fetches initial data", async () => {
    render(
      <Provider store={store}>
        <ProfileTypeAnalysis />
      </Provider>,
    );

    expect(fetchMenuItems).toHaveBeenCalled();

    const profileTypeSelect = screen.getByLabelText("Profile Type");
    userEvent.click(profileTypeSelect);
    const profileTypeOption = await screen.findByText("Type1");
    userEvent.click(profileTypeOption);

    const demographicSelect = screen.getByLabelText("Demographics");
    userEvent.click(demographicSelect);
    const demographicOption = await screen.findByText("Demo1");
    userEvent.click(demographicOption);

    const fetchButton = screen.getByRole("button", { name: /fetch/i });
    fireEvent.click(fetchButton);

    await waitFor(() =>
      expect(fetchDistribution).toHaveBeenCalledWith({
        profileType: "Type1",
        demographic: "Demo1",
      }),
    );
  });

  it("fetches menu items on component mount", () => {
    render(
      <Provider store={store}>
        <ProfileTypeAnalysis />
      </Provider>,
    );
    expect(fetchMenuItems).toHaveBeenCalledTimes(1);
  });

  it("displays loader when status is loading", () => {
    const initialState = {
      profileCountWidget: {
        menuItems: {
          profileTypeItems: [],
          demographicItems: [],
        },
        distribution: {},
        status: "loading",
        error: null,
      },
    };
    store = mockStore(initialState);
    render(
      <Provider store={store}>
        <ProfileTypeAnalysis />
      </Provider>,
    );
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("displays error message when error exists", () => {
    const initialState = {
      profileCountWidget: {
        menuItems: { profileTypeItems: [], demographicItems: [] },
        distribution: {},
        status: "failed",
        error: "An error occurred",
      },
    };
    store = mockStore(initialState);
    render(
      <Provider store={store}>
        <ProfileTypeAnalysis />
      </Provider>,
    );
    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent("An error occurred");
  });

  it("fetches distribution data with selected options on fetch button click", async () => {
    render(
      <Provider store={store}>
        <ProfileTypeAnalysis />
      </Provider>,
    );
    userEvent.click(screen.getByLabelText("Profile Type"));
    userEvent.click(await screen.findByText("Type1"));

    userEvent.click(screen.getByLabelText("Demographics"));
    userEvent.click(await screen.findByText("Demo1"));

    userEvent.click(screen.getByRole("button", { name: /fetch/i }));

    await waitFor(() =>
      expect(fetchDistribution).toHaveBeenCalledWith({
        profileType: "Type1",
        demographic: "Demo1",
      }),
    );
  });

  it("disables Profile Type and Demographics dropdowns when status is loading", () => {
    const initialState = {
      profileCountWidget: {
        menuItems: {
          profileTypeItems: ["All", "Type1"],
          demographicItems: ["all", "Demo1"],
        },
        distribution: {},
        status: "loading",
        error: null,
      },
    };
    store = mockStore(initialState);
    render(
      <Provider store={store}>
        <ProfileTypeAnalysis />
      </Provider>,
    );
    const profileSelect = screen.getByLabelText("Profile Type");
    const demographicSelect = screen.getByLabelText("Demographics");
    expect(profileSelect).toBeDisabled();
    expect(demographicSelect).toBeDisabled();
  });

  it("disables fetch button when no options are selected", () => {
    render(
      <Provider store={store}>
        <ProfileTypeAnalysis />
      </Provider>,
    );
    const fetchButton = screen.getByRole("button", { name: /fetch/i });
    expect(fetchButton).toBeDisabled();
  });

  it("displays correct distribution data in the pie chart after fetching", async () => {
    const initialState = {
      profileCountWidget: {
        menuItems: {
          profileTypeItems: ["All", "Type1"],
          demographicItems: ["all", "Demo1"],
        },
        distribution: { Type1: 10, Demo1: 5 },
        status: "succeeded",
        error: null,
      },
    };
    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <ProfileTypeAnalysis />
      </Provider>,
    );

    const pieChart = await screen.findByTestId("pie-chart");
    expect(pieChart).toBeInTheDocument();
  });

  it("shows an alert with error message when fetching distribution data fails", () => {
    const initialState = {
      profileCountWidget: {
        menuItems: {
          profileTypeItems: ["All", "Type1"],
          demographicItems: ["all", "Demo1"],
        },
        distribution: {},
        status: "failed",
        error: "Failed to fetch distribution data",
      },
    };
    store = mockStore(initialState);
    render(
      <Provider store={store}>
        <ProfileTypeAnalysis />
      </Provider>,
    );
    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent("Failed to fetch distribution data");
  });
});
