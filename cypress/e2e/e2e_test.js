describe("E2E Tests for the Application", () => {
  // ทดสอบหน้า index.html (ล็อกอิน)
  describe("Login Page Test", () => {
    beforeEach(() => {
      cy.visit("docs/index.html"); // แทนที่ path_to_your_html ด้วยเส้นทางที่ถูกต้อง
    });

    it("should successfully log in with valid credentials", () => {
      cy.get("#email").type("test@example.com");
      cy.get("#password").type("password123");
      cy.get("#loginForm").submit();
      // ตรวจสอบว่าถูกนำไปยังหน้า home หรือ dashboard หลังล็อกอินสำเร็จ
      cy.url().should("include", "/dashboard");
    });

    it("should show error for invalid credentials", () => {
      cy.get("#email").type("wrong@example.com");
      cy.get("#password").type("wrongpassword");
      cy.get("#loginForm").submit();
      // ตรวจสอบการแสดงผลข้อความแสดงข้อผิดพลาด
      cy.get(".error-message").should("contain", "Invalid credentials");
    });
  });

  // ทดสอบหน้า register.html (สมัครสมาชิก)
  describe("Register Page Test", () => {
    beforeEach(() => {
      cy.visit("docs/register.html");
    });

    it("should successfully register with valid input", () => {
      cy.get("#username").type("JohnDoe");
      cy.get("#email").type("john@example.com");
      cy.get("#password").type("password123");
      cy.get("#registerForm").submit();
      // ตรวจสอบว่าถูกนำไปยังหน้าหลักหรือแสดงข้อความสำเร็จหลังการสมัคร
      cy.url().should("include", "/welcome");
    });

    it("should show error for invalid input", () => {
      cy.get("#username").type("");
      cy.get("#email").type("invalid-email");
      cy.get("#password").type("short");
      cy.get("#registerForm").submit();
      // ตรวจสอบการแสดงผลข้อความแสดงข้อผิดพลาด
      cy.get(".error-message").should("contain", "Invalid input");
    });
  });

  // ทดสอบหน้า Notifications.html (การแจ้งเตือน)
  describe("Notifications Page Test", () => {
    beforeEach(() => {
      cy.visit("docs/Notifications.html");
    });

    it("should display notifications correctly", () => {
      // ตรวจสอบว่ารายการแจ้งเตือนปรากฏใน DOM
      cy.get(".notification-item").should("have.length.greaterThan", 0);
    });

    it("should display details when a notification is clicked", () => {
      // คลิกที่การแจ้งเตือนแรกและตรวจสอบว่ารายละเอียดปรากฏ
      cy.get(".notification-item").first().click();
      cy.get("#notificationDetails").should("be.visible");
      cy.get(".notification-title").should("contain", "Notification Title");
    });

    it('should show "No notifications" message when there are no notifications', () => {
      // สมมุติไม่มีการแจ้งเตือน
      cy.get("#notificationList").should("be.empty");
      cy.get("#noNotifications").should("contain", "ไม่มีการแจ้งเตือน");
    });
  });

  // ทดสอบหน้า Assignment.html (งาน)
  describe("Assignment Page Test", () => {
    beforeEach(() => {
      cy.visit("docs/Assignment.html");
    });

    it("should display assignment correctly", () => {
      cy.get(".assignment-item").should("have.length.greaterThan", 0);
    });

    it("should show assignment details when clicked", () => {
      cy.get(".assignment-item").first().click();
      cy.get("#assignmentDetails").should("be.visible");
    });
  });

  // ทดสอบหน้า AssignmentDetail.html (รายละเอียดงาน)
  describe("Assignment Detail Page Test", () => {
    beforeEach(() => {
      cy.visit("docs/AssignmentDetail.html");
    });

    it("should load assignment details", () => {
      cy.get("#assignment-title").should("contain", "Assignment Title");
    });

    it("should allow submission of assignment", () => {
      cy.get(".submit-btn").click();
      cy.get(".submit-confirmation").should("contain", "Assignment Submitted");
    });
  });

  // ทดสอบหน้า Chat.html (การสนทนา)
  describe("Chat Page Test", () => {
    beforeEach(() => {
      cy.visit("docs/Chat.html");
    });

    it("should allow sending a message", () => {
      cy.get("#messageInput").type("Hello, World!");
      cy.get("#sendMessageButton").click();
      cy.get(".chat-messages").should("contain", "Hello, World!");
    });

    it("should display chat history", () => {
      cy.get(".chat-messages").should("have.length.greaterThan", 0);
    });
  });

  // ทดสอบหน้า general.html (ทั่วไป)
  describe("General Page Test", () => {
    beforeEach(() => {
      cy.visit("docs/general.html");
    });

    it("should load general content", () => {
      cy.get(".general-section").should("be.visible");
    });

    it("should allow search functionality", () => {
      cy.get(".search-input").type("Test Search");
      cy.get(".search-results").should("contain", "Test Search Result");
    });
  });

  // ทดสอบหน้า studenthead.html (แดชบอร์ดนักเรียน)
  describe("Student Head Page Test", () => {
    beforeEach(() => {
      cy.visit("docs/studenthead.html");
    });

    it("should display classroom dashboard", () => {
      cy.get(".classroom-dashboard").should("be.visible");
    });

    it("should allow navigating to assignments", () => {
      cy.get(".menu-item-assignments").click();
      cy.url().should("include", "/Assignment.html");
    });
  });
});
