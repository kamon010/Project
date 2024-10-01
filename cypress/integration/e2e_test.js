describe("E2E Tests for the Application", () => {
  // ทดสอบหน้า index.html (ล็อกอิน)
  describe("Login Page Test", () => {
    it("should successfully log in with valid credentials", () => {
      cy.get("#email").type("test@example.com");
      cy.get("#password").type("password123");
      cy.get("#loginForm").submit();

      // ตรวจสอบว่าถูกนำไปยังหน้า studenthead.html หลังล็อกอินสำเร็จ
      cy.url().should("include", "/studenthead.html");
    });

    it("should show error for incorrect password", () => {
      cy.get("#email").type("test@example.com");
      cy.get("#password").type("wrongpassword");
      cy.get("#loginForm").submit();

      // ตรวจสอบว่ามีข้อความแจ้งข้อผิดพลาดแสดงออกมา
      cy.on("window:alert", (text) => {
        expect(text).to.contains("Your password is incorrect.");
      });
    });

    it("should show error for unregistered email", () => {
      cy.get("#email").type("notregistered@example.com");
      cy.get("#password").type("password123");
      cy.get("#loginForm").submit();

      // ตรวจสอบว่ามีข้อความแจ้งข้อผิดพลาดแสดงออกมา
      cy.on("window:alert", (text) => {
        expect(text).to.contains("This email is not registered yet.");
      });
    });
  });

  // ทดสอบหน้า register.html (สมัครสมาชิก)
  describe("Register Page Test", () => {
    beforeEach(() => {
      cy.visit("/register.html");
    });

    it("should successfully register with valid input", () => {
      cy.get("#username").type("JohnDoe");
      cy.get("#email").type("john@example.com");
      cy.get("#password").type("password123");
      cy.get("#role").select("Student");
      cy.get("#registerForm").submit();

      // ตรวจสอบว่าข้อความลงทะเบียนสำเร็จแสดงออกมา
      cy.on("window:alert", (text) => {
        expect(text).to.contains("การลงทะเบียนสำเร็จ");
      });
    });

    it("should show error for already registered email", () => {
      cy.get("#username").type("JaneDoe");
      cy.get("#email").type("existing@example.com");
      cy.get("#password").type("password123");
      cy.get("#role").select("Teacher");
      cy.get("#registerForm").submit();

      // ตรวจสอบว่ามีข้อความแจ้งเตือนว่าอีเมลถูกใช้แล้ว
      cy.on("window:alert", (text) => {
        expect(text).to.contains("อีเมลนี้ถูกใช้ลงทะเบียนแล้ว");
      });
    });

    it("should show error for invalid input", () => {
      cy.get("#username").type("");
      cy.get("#email").type("invalid-email");
      cy.get("#password").type("short");
      cy.get("#role").select("Student");
      cy.get("#registerForm").submit();

      // ตรวจสอบการแสดงผลข้อความแจ้งเตือนการกรอกข้อมูลที่ไม่ถูกต้อง
      cy.on("window:alert", (text) => {
        expect(text).to.contains("กรุณากรอกข้อมูลที่ถูกต้อง");
      });
    });
  });

  // ทดสอบหน้า Notifications.html (การแจ้งเตือน)
  describe("Notifications Page Test", () => {
    beforeEach(() => {
      cy.visit("/Notifications.html?email=test@example.com");
    });

    it("should display notifications correctly", () => {
      cy.get(".notification-item").should("have.length.greaterThan", 0);
    });

    it("should display details when a notification is clicked", () => {
      cy.get(".notification-item").first().click();
      cy.get("#notificationDetails").should("be.visible");
      cy.get(".notification-title").should("contain", "Assignment");
    });

    it('should show "No notifications" message when there are no notifications', () => {
      cy.get("#noNotifications").should("contain", "ไม่มีการแจ้งเตือน");
    });
  });

  // ทดสอบหน้า Assignment.html (งาน)
  describe("Assignment Page Test", () => {
    beforeEach(() => {
      cy.visit("/Assignment.html");
    });

    it("should load assignments for the user", () => {
      cy.get(".assignment-card").should("have.length.greaterThan", 0);
    });

    it("should open the create modal when clicking the Create button", () => {
      cy.get("#createButton").click();
      cy.get("#createModal").should("be.visible");
    });

    it("should create a new assignment", () => {
      cy.get("#createButton").click();
      cy.get("#title").type("New Test Assignment");
      cy.get("#instructions").type("Test instructions for the new assignment.");
      cy.get("#points").type("10");
      cy.get(".assign-btn").click();
      cy.get(".assignment-card").should("contain", "New Test Assignment");
    });
  });

  // ทดสอบหน้า AssignmentDetail.html (รายละเอียดงาน)
  describe("Assignment Detail Page Test", () => {
    beforeEach(() => {
      cy.visit("/AssignmentDetail.html");
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
      // เปิดหน้า Chat.html ก่อนการทดสอบแต่ละครั้ง
      cy.visit("/Chat.html");
    });

    it("should allow sending a message", () => {
      // กรอกข้อความในช่องอินพุต
      cy.get("#messageInput").type("Hello, World!");

      // คลิกปุ่มส่งข้อความ
      cy.get("#sendButton").click();

      // ตรวจสอบว่ามีข้อความที่พิมพ์อยู่ในหน้าต่างแชท
      cy.get("#chatMessages").should("contain", "Hello, World!");
    });

    it("should display chat history", () => {
      // ตรวจสอบว่ามีข้อความแชทปรากฏในหน้าต่างแชทมากกว่า 0 ข้อความ
      cy.get("#chatMessages .chat-message").should(
        "have.length.greaterThan",
        0
      );
    });
  });

  // ทดสอบหน้า general.html (ทั่วไป)
  describe("General Page Test", () => {
    beforeEach(() => {
      cy.visit("/general.html");
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
      cy.visit("/studenthead.html");
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
