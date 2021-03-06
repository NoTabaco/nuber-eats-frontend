describe("Create Account", () => {
  const user = cy;

  it("should see email / password validation errors", () => {
    user.visit("/");
    user.findByText(/Create an Account/i).click();
    user.findByPlaceholderText(/email/i).type("non@good");
    user.findByRole("alert").should("have.text", "Please enter a valid email");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("real@email.com");
    user
      .findByPlaceholderText(/password/i)
      .type("a")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });

  it("should be able to create account and login", () => {
    user.intercept("http://localhost:5000/graphql", req => {
      const { operationName } = req.body;
      if (operationName && operationName === "createAccountMutation") {
        req.reply(res => {
          res.send({
            fixture: "auth/create-account.json",
          });
        });
      }
    });
    user.visit("/create-account");
    user.findByPlaceholderText(/email/i).type("hii@gmail.com");
    user.findByPlaceholderText(/password/i).type("12345");
    user.findByRole("listbox").select("Owner");
    user.findByRole("button").click();
    user.wait(1000);
    user.title().should("eq", "Login | Nuber Eats");
    user.login("hii@gmail.com", "12345");
  });
});
