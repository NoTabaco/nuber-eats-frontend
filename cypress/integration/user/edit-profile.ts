describe("Edit Profile", () => {
  const user = cy;

  beforeEach(() => {
    user.login("hii@gmail.com", "12345");
  });

  it("can go to /edit-profile using the header", () => {
    user.get('a[href="/edit-profile"]').click();
    user.title().should("eq", "Edit Profile | Nuber Eats");
  });

  it("can change email", () => {
    user.intercept("POST", "http://localhost:5000/graphql", req => {
      if (req.body?.operationName === "editProfileMutation") {
        // @ts-ignore
        req.body?.variables?.editProfileInput?.email = "hii@gmail.com";
      }
    });
    user.visit("/edit-profile");
    user.findByPlaceholderText(/email/i).clear().type("new@gmail.com");
    user.findByRole("button").click();
  });
});
