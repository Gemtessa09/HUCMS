
      // Function to switch between role forms
      function switchRole(role) {
        // Remove active class from all tabs
        document.querySelectorAll(".role-tab").forEach((tab) => {
          tab.classList.remove(
            "active",
            "border-blue-500",
            "border-green-500",
            "border-purple-500",
            "scale-105"
          );
          tab.classList.add(
            "border-blue-100",
            "border-green-100",
            "border-purple-100"
          );
        });

        // Add active class to clicked tab
        const activeTab = document.getElementById(`${role}-tab`);
        activeTab.classList.add("active", "scale-105");

        // Remove border color classes and add appropriate one
        if (role === "teacher") {
          activeTab.classList.remove("border-blue-100");
          activeTab.classList.add("border-blue-500");
        } else if (role === "student") {
          activeTab.classList.remove("border-green-100");
          activeTab.classList.add("border-green-500");
        } else if (role === "admin") {
          activeTab.classList.remove("border-purple-100");
          activeTab.classList.add("border-purple-500");
        }

        // Hide all forms
        document.querySelectorAll(".login-form").forEach((form) => {
          form.classList.add("hidden");
        });

        // Show selected form
        document.getElementById(`${role}-form`).classList.remove("hidden");
      }

      // Function to toggle password visibility
      function togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const icon = input.nextElementSibling.querySelector("i");

        if (input.type === "password") {
          input.type = "text";
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        } else {
          input.type = "password";
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }
      }

      // Form submission handlers
      document.addEventListener("DOMContentLoaded", function () {
        // Teacher form
        document
          .getElementById("teacher-form")
          .addEventListener("submit", function (e) {
            e.preventDefault();
            const email = document.getElementById("teacher-email").value;
            const password = document.getElementById("teacher-password").value;

            // Basic validation
            if (email && password) {
              // For demo purposes, redirect to teacher dashboard
              window.location.href = "dashboard-teacher.html";
            } else {
              alert("Please fill in all fields");
            }
          });

        // Student form
        document
          .getElementById("student-form")
          .addEventListener("submit", function (e) {
            e.preventDefault();
            const username = document.getElementById("student-username").value;
            const password = document.getElementById("student-password").value;

            if (username && password) {
              window.location.href = "dashboard-student.html";
            } else {
              alert("Please fill in all fields");
            }
          });

        // Admin form
        document
          .getElementById("admin-form")
          .addEventListener("submit", function (e) {
            e.preventDefault();
            const email = document.getElementById("admin-email").value;
            const password = document.getElementById("admin-password").value;

            if (email && password) {
              window.location.href = "dashboard-admin.html";
            } else {
              alert("Please fill in all fields");
            }
          });
      });
