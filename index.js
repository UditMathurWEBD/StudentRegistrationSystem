const studentForm = document.getElementById("student-form");
const tableMain = document.getElementById("table-main");

let allStudents = JSON.parse(localStorage.getItem("students")) || [];

let isEditing = false;
let editIndex = null; // Index of the student being edited

function deleteRow(name) {
  allStudents = allStudents.filter(student => student.name !== name);
  localStorage.setItem("students", JSON.stringify(allStudents));
}

function addStudentToTable(student, index) {
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
    <td>${student.name}</td>
    <td>${student.id}</td>
    <td>${student.email}</td>
    <td>${student.contactNumber}</td>
    <td>
    <span class="two-button">
      <button class="reset-button">Edit</button>
      <button class="delete-button">Delete</button>
      </span>
    </td>
  `;

  // Delete Button
  newRow.querySelector(".delete-button").addEventListener("click", () => {
    deleteRow(student.name);
    newRow.remove();
  });

  // Edit Button
  newRow.querySelector(".reset-button").addEventListener("click", () => {
    // Fill form with student data
    studentForm.elements["studentName"].value = student.name;
    studentForm.elements["studentId"].value = student.id;
    studentForm.elements["emailId"].value = student.email;
    studentForm.elements["contactNo"].value = student.contactNumber;

    isEditing = true;
    editIndex = index; // Remember index to update later
  });

  tableMain.appendChild(newRow);
}

// Render existing students
function renderTable() {
  tableMain.innerHTML = ""; // Clear previous
  allStudents.forEach((student, index) => addStudentToTable(student, index));
}

renderTable();

studentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(studentForm);
  const studentName = formData.get("studentName");
  const studentId = formData.get("studentId");
  const studentEmail = formData.get("emailId");
  const contactNumber = formData.get("contactNo");

  const newStudent = {
    name: studentName,
    id: studentId,
    email: studentEmail,
    contactNumber: contactNumber,
  };

  if (isEditing) {
    // Update existing student
    allStudents[editIndex] = newStudent;
    isEditing = false;
    editIndex = null;
  } else {
    // Add new student
    allStudents.push(newStudent);
  }

  // Save to localStorage
  localStorage.setItem("students", JSON.stringify(allStudents));

  // Re-render table
  renderTable();

  studentForm.reset();
});
