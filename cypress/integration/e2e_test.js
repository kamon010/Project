describe("E2E Tests for the Application", () => {
  // General Page Tests
  describe("General Page Test", () => {
    beforeEach(() => {
      cy.visit("/general.html");
    });

    it("should load general content", () => {
      cy.get(".content-header").should("exist");
    });

    it("should allow search functionality", () => {
      cy.get("#searchInput").type("Test");
      cy.get("#searchResults").should("contain", "Test");
    });
  });

  // Login Page Tests (index.html)
  describe("Login Page Test", () => {
    beforeEach(() => {
      cy.visit("/index.html");
    });

    it("should successfully log in with valid credentials", () => {
      cy.get("#emailInput").type("test@example.com");
      cy.get("#passwordInput").type("password");
      cy.get("#loginButton").click();
      cy.url().should("include", "/studenthead.html");
    });

    it("should show error for incorrect password", () => {
      cy.get("#emailInput").type("test@example.com");
      cy.get("#passwordInput").type("wrongpassword");
      cy.get("#loginButton").click();
      cy.get(".error-message").should("contain", "Incorrect password");
    });

    it("should show error for unregistered email", () => {
      cy.get("#emailInput").type("unregistered@example.com");
      cy.get("#passwordInput").type("password");
      cy.get("#loginButton").click();
      cy.get(".error-message").should("contain", "Email not found");
    });
  });

  // Register Page Tests
  describe("Register Page Test", () => {
    beforeEach(() => {
      cy.visit("/register.html");
    });

    it("should successfully register with valid input", () => {
      cy.get("#emailInput").type("newuser@example.com");
      cy.get("#usernameInput").type("New User");
      cy.get("#passwordInput").type("password");
      cy.get("#registerButton").click();
      cy.url().should("include", "/studenthead.html");
    });

    it("should show error for already registered email", () => {
      cy.get("#emailInput").type("test@example.com");
      cy.get("#passwordInput").type("password");
      cy.get("#registerButton").click();
      cy.get(".error-message").should("contain", "Email already registered");
    });

    it("should show error for invalid input", () => {
      cy.get("#emailInput").clear();
      cy.get("#passwordInput").clear();
      cy.get("#registerButton").click();
      cy.get(".error-message").should("contain", "Invalid input");
    });
  });

  // Student Head Page Tests
  describe("Student Head Page Test", () => {
    beforeEach(() => {
      cy.visit("/studenthead.html");
    });

    it("should display classroom dashboard", () => {
      cy.get(".classroom-dashboard").should("exist");
    });

    it("should allow navigating to assignments", () => {
      cy.get(".menu-item-assignments").click();
      cy.url().should("include", "/Assignment.html");
    });
  });

  // Assignment Detail Page Tests
  describe("Assignment Detail Page Test", () => {
    beforeEach(() => {
      cy.visit("/AssignmentDetail.html");
    });

    it("should load assignment details", () => {
      cy.get("#assignment-title").should("contain", "Assignment Title");
    });

    it("should allow submission of assignment", () => {
      cy.get("#submitAssignmentButton").click();
      cy.get(".success-message").should("contain", "Assignment submitted");
    });
  });

  // Assignment Page Tests
  describe("Assignment Page Test", () => {
    beforeEach(() => {
      cy.visit("/Assignment.html");
    });

    it("should load assignments for the user", () => {
      cy.get(".assignment-card").should("exist");
    });

    it("should open the create modal when clicking the Create button", () => {
      cy.get("#createButton").click();
      cy.get(".create-modal").should("be.visible");
    });

    it("should create a new assignment", () => {
      cy.get("#createButton").click();
      cy.get("#assignmentTitleInput").type("New Assignment");
      cy.get("#assignmentSubmitButton").click();
      cy.get(".success-message").should("contain", "Assignment created");
    });
  });

  // Chat Page Tests
  describe("Chat Page Test", () => {
    beforeEach(() => {
      cy.visit("/Chat.html");
    });

    it("should allow sending a message", () => {
      cy.get("#messageInput").type("Hello, World!");
      cy.get("#sendMessageButton").click();
      cy.get("#chatMessages").should("contain", "Hello, World!");
    });

    it("should display chat history", () => {
      cy.get("#chatMessages .chat-message").should(
        "have.length.greaterThan",
        0
      );
    });
  });

  // Notifications Page Tests
  describe("Notifications Page Test", () => {
    beforeEach(() => {
      cy.visit("/Notifications.html");
    });

    it("should display notifications correctly", () => {
      cy.get(".notification-item").should("exist");
    });

    it("should display details when a notification is clicked", () => {
      cy.get(".notification-item").first().click();
      cy.get(".notification-detail").should("be.visible");
    });

    it("should show 'No notifications' message when there are no notifications", () => {
      cy.get(".notification-item").should("not.exist");
      cy.get("#noNotificationsMessage").should("be.visible");
    });
  });

  // Logout Test (index.html)
  describe("Logout Test", () => {
    beforeEach(() => {
      cy.visit("/index.html");
      cy.get("#emailInput").type("test@example.com");
      cy.get("#passwordInput").type("password");
      cy.get("#loginButton").click();
    });

    it("should allow user to log out", () => {
      cy.get("#logoutButton").click();
      cy.url().should("include", "/index.html");
    });
  });
});
