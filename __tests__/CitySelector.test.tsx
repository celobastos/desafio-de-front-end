import { render, screen } from "@testing-library/react";
import { CitySelector } from "@/components/CitySelector";
import { cities } from "@/lib/cities";

describe("CitySelector", () => {
  it("renders the required city list", () => {
    render(<CitySelector />);

    for (const city of cities) {
      expect(screen.getByRole("link", { name: city.label })).toBeInTheDocument();
    }
  });

  it("links each city to its detail page", () => {
    render(<CitySelector />);

    for (const city of cities) {
      expect(screen.getByRole("link", { name: city.label })).toHaveAttribute(
        "href",
        `/city/${city.id}`,
      );
    }
  });
});
