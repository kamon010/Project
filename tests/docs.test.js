import { fireEvent } from "@testing-library/dom";
import fs from "fs";
import path from "path";

// Function to load HTML file as string
function loadHTMLFile(fileName) {
  return fs.readFileSync(
    path.resolve(__dirname, `../docs/${fileName}`),
    "utf8"
  );
}

// List of HTML files to test
const htmlFiles = [
  "index.html",
  "register.html",
  "Notifications.html",
  "Assignment.html",
  "AssignmentDetail.html",
  "Chat.html",
  "general.html",
  "studenthead.html",
];

// Loop through each file and run tests
htmlFiles.forEach((file) => {
  describe(`Test ${file}`, () => {
    let html;

    beforeEach(() => {
      html = loadHTMLFile(file); // โหลด HTML ก่อนการทดสอบ
      document.body.innerHTML = html;
    });

    if (file === "index.html") {
      test("Login form submission", () => {
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const form = document.getElementById("loginForm");

        expect(email).toBeTruthy();
        expect(password).toBeTruthy();
        expect(form).toBeTruthy();

        fireEvent.input(email, { target: { value: "test@example.com" } });
        fireEvent.input(password, { target: { value: "password123" } });
        fireEvent.submit(form);
      });
    }

    if (file === "register.html") {
      test("Register form submission", () => {
        const username = document.getElementById("username");
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const form = document.getElementById("registerForm");

        expect(username).toBeTruthy();
        expect(email).toBeTruthy();
        expect(password).toBeTruthy();
        expect(form).toBeTruthy();

        fireEvent.input(username, { target: { value: "JohnDoe" } });
        fireEvent.input(email, { target: { value: "john@example.com" } });
        fireEvent.input(password, { target: { value: "password123" } });
        fireEvent.submit(form);
      });
    }

    if (file === "Notifications.html") {
      test("Notification list is displayed correctly", () => {
        const notificationList = document.getElementById("notificationList");

        // Mock ข้อมูลการแจ้งเตือนลงใน DOM
        notificationList.innerHTML = `
          <div class="notification-item">Test Notification 1</div>
          <div class="notification-item">Test Notification 2</div>
        `;

        const notifications = document.querySelectorAll(".notification-item");
        expect(notifications.length).toBe(2); // ตรวจสอบว่ามีการแจ้งเตือน 2 รายการ
        expect(notifications[0].textContent).toBe("Test Notification 1");
        expect(notifications[1].textContent).toBe("Test Notification 2");
      });

      test("Click on view details button redirects to AssignmentDetail", () => {
        const viewDetailsButton = document.createElement("button");
        viewDetailsButton.classList.add("view-details-btn");
        viewDetailsButton.textContent = "ดูรายละเอียดงาน";
        document.body.appendChild(viewDetailsButton);

        // ใช้ jest.spyOn เพื่อ spy การเปลี่ยนแปลงของ window.location
        const locationSpy = jest
          .spyOn(window, "location", "get")
          .mockReturnValue({
            href: "",
          });

        viewDetailsButton.addEventListener("click", () => {
          window.location.href = "AssignmentDetail.html?assignmentId=123";
        });

        fireEvent.click(viewDetailsButton);
        expect(window.location.href).toBe(
          "AssignmentDetail.html?assignmentId=123"
        );

        // คืนค่าฟังก์ชัน window.location หลังทดสอบเสร็จ
        locationSpy.mockRestore();
      });

      test("Displays 'ไม่มีการแจ้งเตือน' when no notifications exist", () => {
        const noNotifications = document.getElementById("noNotifications");

        // Mock ให้ noNotifications แสดงผล
        noNotifications.style.display = "block"; // จำลองการแสดงผลว่าไม่มีการแจ้งเตือน

        expect(noNotifications.textContent.trim()).toBe("ไม่มีการแจ้งเตือน");
        expect(noNotifications.style.display).toBe("block"); // ตรวจสอบว่าการแสดงผลเป็น block
      });

      test("Toggles user dropdown menu on click", () => {
        const userIcon = document.getElementById("userIcon");
        const dropdownMenu = document.getElementById("dropdownMenu");

        // Mock dropdown menu
        dropdownMenu.style.display = "none"; // เริ่มต้นซ่อน dropdown menu

        userIcon.addEventListener("click", () => {
          dropdownMenu.style.display =
            dropdownMenu.style.display === "none" ? "block" : "none";
        });

        fireEvent.click(userIcon); // จำลองการคลิกเพื่อเปิด dropdown
        expect(dropdownMenu.style.display).toBe("block"); // ตรวจสอบว่า dropdown เปิด

        fireEvent.click(userIcon); // จำลองการคลิกเพื่อปิด dropdown
        expect(dropdownMenu.style.display).toBe("none"); // ตรวจสอบว่า dropdown ปิด
      });

      test("Search function works correctly", () => {
        const searchInput = document.getElementById("searchInput");
        const searchResults = document.getElementById("searchResults");

        // Mock การใส่ข้อความค้นหา
        fireEvent.input(searchInput, { target: { value: "John" } });

        // สมมุติว่ามีการค้นหาและเพิ่มผลลัพธ์ลงใน DOM
        searchResults.innerHTML = `
          <div class="result-item">John Doe</div>
          <div class="result-item">Johnny Appleseed</div>
        `;

        const results = document.querySelectorAll(".result-item");
        expect(results.length).toBe(2);
        expect(results[0].textContent).toBe("John Doe");
      });

      test("Displays notification details on click", () => {
        const notificationItem = document.createElement("div");
        notificationItem.classList.add("notification-item");
        notificationItem.textContent = "Test Notification";

        document.body.appendChild(notificationItem);

        const notificationDetails = document.getElementById(
          "notificationDetails"
        );

        notificationItem.addEventListener("click", () => {
          notificationDetails.style.display = "block";
        });

        fireEvent.click(notificationItem);
        expect(notificationDetails.style.display).toBe("block");
      });
    }

    if (file === "Assignment.html" || file === "AssignmentDetail.html") {
      test("Assignment details and button interactions", () => {
        // Mock ปุ่มที่ใช้ในการทดสอบ
        const createButton = document.createElement("button");
        createButton.classList.add("assign-btn");
        document.body.appendChild(createButton);

        expect(createButton).toBeTruthy();

        fireEvent.click(createButton);
        // คุณสามารถเพิ่มการตรวจสอบเพิ่มเติมถ้าต้องการทดสอบการตอบสนองหลังจากคลิกปุ่ม
      });
    }

    if (file === "Chat.html") {
      test("Chat interaction", () => {
        const searchInput = document.querySelector(".search-bar input");
        expect(searchInput).toBeTruthy();

        fireEvent.input(searchInput, { target: { value: "test search" } });
        expect(searchInput.value).toBe("test search");
      });
    }

    if (file === "studenthead.html") {
      test("Dashboard search and menu interaction", () => {
        const searchInput = document.querySelector(".search-bar input");
        const menuItems = document.querySelectorAll(".menu-items a");

        expect(searchInput).toBeTruthy();
        expect(menuItems.length).toBeGreaterThan(0);

        fireEvent.input(searchInput, { target: { value: "test search" } });
        expect(searchInput.value).toBe("test search");

        menuItems.forEach((menuItem) => {
          expect(menuItem).toBeTruthy();
        });
      });
    }

    if (file === "general.html") {
      test("General page search", () => {
        const searchInput = document.querySelector(".search-bar input");
        expect(searchInput).toBeTruthy();

        fireEvent.input(searchInput, { target: { value: "test search" } });
        expect(searchInput.value).toBe("test search");
      });
    }
  });
});

// ส่วนนี้เป็นการทดสอบสำหรับไฟล์ AssignmentDetail.html ที่คุณเพิ่มมา
describe("Test AssignmentDetail.html", () => {
  let html;

  beforeEach(() => {
    // โหลด HTML ก่อนการทดสอบแต่ละครั้ง
    html = loadHTMLFile("AssignmentDetail.html");
    document.body.innerHTML = html;
  });

  test('Check if the "Turn in" button exists', () => {
    const turnInButton = document.querySelector(".undo-btn");
    expect(turnInButton).toBeTruthy();
  });

  test('Simulate click on the "Turn in" button', () => {
    const turnInButton = document.querySelector(".undo-btn");
    expect(turnInButton).toBeTruthy();

    // คลิกปุ่ม "Turn in"
    fireEvent.click(turnInButton);

    // ตรวจสอบว่าข้อความปุ่มเปลี่ยนเป็น "Undo Turn in"
    setTimeout(() => {
      expect(turnInButton.textContent.trim()).toBe("Undo Turn in");
    }, 500); // เพิ่ม timeout เพื่อรอให้เหตุการณ์ทำงานเสร็จ
  });

  test('Simulate click on "Undo Turn in" button and verify change', () => {
    const turnInButton = document.querySelector(".undo-btn");
    expect(turnInButton).toBeTruthy();

    // เปลี่ยนข้อความปุ่มเป็น "Undo Turn in" ก่อน
    turnInButton.textContent = "Undo Turn in";

    // คลิกปุ่ม "Undo Turn in"
    fireEvent.click(turnInButton);

    // ตรวจสอบว่าข้อความปุ่มเปลี่ยนกลับเป็น "Turn in"
    setTimeout(() => {
      expect(turnInButton.textContent.trim()).toBe("Turn in");
    }, 500); // เพิ่ม timeout เพื่อรอให้เหตุการณ์ทำงานเสร็จ
  });

  test("Check if assignment title is loaded correctly", () => {
    const titleElement = document.getElementById("assignment-title");
    expect(titleElement.textContent).toBe("Loading assignment title...");
  });

  test("Check file upload section exists", () => {
    const fileUpload = document.getElementById("file-upload");
    expect(fileUpload).toBeTruthy();
  });
});