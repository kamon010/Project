import firebase from 'firebase/app';
import 'firebase/auth'; // ถ้าใช้โมดูล authentication ของ Firebase
// logout.js
function logOutUser() {
    const auth = firebase.auth();

    auth.signOut()
        .then(() => {
            // ล้าง session ที่เกี่ยวข้อง
            sessionStorage.clear();
            localStorage.clear();
            // ป้องกันการกลับไปหน้าก่อนหน้าโดยใช้ back button
            history.pushState(null, null, 'index.html');
            history.go(1);
            // เปลี่ยนเส้นทางไปที่ index.html
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Sign Out Error", error);
        });
}

// Export the function for use in other files
export default logOutUser;