import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import App from "./App";

const mockStore = configureStore();

describe("App UI Tests", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      translate: {
        languages: [
          { name: "English", code: "en" },
          { name: "Turkish", code: "tr" },
        ],
        isLangsLoading: false,
        isTranslateLoading: false,
        translatedText: "",
      },
    });

    store.dispatch = vi.fn();

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  it("renders the initial UI components", () => {
    expect(screen.getByText("Çeviri +")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Değiş/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Çevir/i })).toBeInTheDocument();
    expect(screen.getAllByRole("combobox").length).toBe(2);
    expect(screen.getAllByRole("textbox").length).toBe(2);
  });

  it("textarea input updates on user typing", async () => {
    const user = userEvent.setup();
    const textareas = screen.getAllByRole("textbox");
    await user.type(textareas[0], "Hello");
    expect(textareas[0]).toHaveValue("Hello");
  });

  it("swap button swaps source and target languages visually", async () => {
    const user = userEvent.setup();
    const swapButton = screen.getByRole("button", { name: /Değiş/i });

    await user.click(swapButton);

    const selects = screen.getAllByRole("combobox");
    expect(selects[0].value).toBe(selects[1].value);
  });

  it("translation button is clickable", async () => {
    const user = userEvent.setup();
    const translateButton = screen.getByRole("button", { name: /Çevir/i });
    expect(translateButton).toBeEnabled();

    await user.click(translateButton);

    expect(store.dispatch).toHaveBeenCalled();
  });
});
