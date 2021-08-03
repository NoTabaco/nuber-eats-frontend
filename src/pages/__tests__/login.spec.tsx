import { ApolloProvider } from "@apollo/client";
import { render, RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMockClient } from "mock-apollo-client";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { Login } from "../login";

describe("<Login />", () => {
  let renderResult: RenderResult;

  beforeEach(async () => {
    await waitFor(() => {
      const mockClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockClient}>
          <HelmetProvider>
            <Router>
              <Login />
            </Router>
          </HelmetProvider>
        </ApolloProvider>
      );
    });
  });

  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Nuber Eats");
    });
  });

  it("displays email validation errors", async () => {
    const { getByPlaceholderText, debug, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    await waitFor(() => {
      userEvent.type(email, "this@won't");
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Please enter a valid email/i);
    await waitFor(() => {
      userEvent.clear(email);
    });
    debug();
  });
});
