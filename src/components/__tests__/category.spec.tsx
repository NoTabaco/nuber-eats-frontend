import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Category } from "../category";

describe("<Category />", () => {
  it("renders OK with props", () => {
    const categoryProps = {
      coverImage: "coverImage",
      name: "name",
      slug: "slug",
    };

    const { getByText, container } = render(
      <Router>
        <Category {...categoryProps} />
      </Router>
    );
    getByText(categoryProps.name);
    expect(container.firstChild).toHaveAttribute(
      "href",
      `/category/${categoryProps.slug}`
    );
  });
});
