// ==========================================
// WORKSHOP HUB - WORKSHOP MANAGEMENT SYSTEM
// ==========================================


// 1. SELECTING HTML ELEMENTS
// ==========================================

const workshopForm = document.getElementById("workshopForm");
const workshopFormSection = document.getElementById("workshopFormSection");
const workshopTableBody = document.getElementById("workshopTableBody");

const addWorkshopBtn = document.getElementById("addWorkshopBtn");
const resetFiltersBtn = document.getElementById("resetFilters");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");

const totalCount = document.getElementById("totalCount");
const upcomingCount = document.getElementById("upcomingCount");
const ongoingCount = document.getElementById("ongoingCount");
const completedCount = document.getElementById("completedCount");

const workshopDetails = document.getElementById("workshopDetails");
const deleteConfirmation = document.getElementById("deleteConfirmation");

const closeDetailsBtn = document.getElementById("closeDetailsBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");


// 2. INITIAL WORKSHOP DATA
// ==========================================

const defaultWorkshops = [
    {
        id: 101,
        title: "Introduction to Python",
        category: "Technical",
        trainer: "Rahul Sharma",
        date: "2026-11-12",
        time: "10:00",
        venue: "Computer Lab 1",
        totalSeats: 40,
        registeredSeats: 25,
        status: "Upcoming",
        description: "A beginner-friendly workshop introducing Python programming."
    },

    {
        id: 102,
        title: "HTML and CSS Fundamentals",
        category: "Technical",
        trainer: "Anjali Verma",
        date: "2026-11-08",
        time: "11:00",
        venue: "Computer Lab 2",
        totalSeats: 35,
        registeredSeats: 35,
        status: "Ongoing",
        description: "A practical workshop covering the basics of web development."
    },

    {
        id: 103,
        title: "Public Speaking Essentials",
        category: "Soft Skills",
        trainer: "Amit Kumar",
        date: "2026-10-20",
        time: "14:00",
        venue: "Seminar Hall",
        totalSeats: 50,
        registeredSeats: 42,
        status: "Completed",
        description: "A workshop focused on communication and presentation skills."
    }
];


// 3. APPLICATION STATE
// ==========================================

const STORAGE_KEY = "workshopHubData";

let workshops = loadWorkshops();

let editingWorkshopId = null;
let selectedDeleteId = null;


// 4. LOAD DATA FROM LOCAL STORAGE
// ==========================================

function loadWorkshops() {

    try {

        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData) {

            const parsedData = JSON.parse(savedData);

            if (Array.isArray(parsedData)) {
                return parsedData;
            }

        }

    } catch (error) {

        console.error("Unable to load workshop data:", error);

    }

    return [...defaultWorkshops];

}


// 5. SAVE DATA TO LOCAL STORAGE
// ==========================================

function saveWorkshops() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(workshops)
        );

    } catch (error) {

        console.error("Unable to save workshop data:", error);

        alert("Your data could not be saved in this browser.");

    }

}


// 6. GENERATE UNIQUE WORKSHOP ID
// ==========================================

function generateWorkshopId() {

    if (workshops.length === 0) {
        return 101;
    }

    const highestId = Math.max(
        ...workshops.map(workshop => Number(workshop.id) || 0)
    );

    return highestId + 1;

}


// 7. FORMAT DATE
// ==========================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "Not specified";
    }

    const date = new Date(dateValue + "T00:00:00");

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


// 8. UPDATE DASHBOARD STATISTICS
// ==========================================

function updateDashboard() {

    const total = workshops.length;

    const upcoming = workshops.filter(
        workshop => workshop.status === "Upcoming"
    ).length;

    const ongoing = workshops.filter(
        workshop => workshop.status === "Ongoing"
    ).length;

    const completed = workshops.filter(
        workshop => workshop.status === "Completed"
    ).length;


    if (totalCount) {
        totalCount.textContent = total;
    }

    if (upcomingCount) {
        upcomingCount.textContent = upcoming;
    }

    if (ongoingCount) {
        ongoingCount.textContent = ongoing;
    }

    if (completedCount) {
        completedCount.textContent = completed;
    }

}


// 9. CREATE A STATUS BADGE
// ==========================================

function createStatusBadge(status) {

    const badge = document.createElement("span");

    badge.classList.add(
        "badge",
        status.toLowerCase()
    );

    badge.textContent = status;

    return badge;

}


// 10. CREATE TABLE ACTION BUTTON
// ==========================================

function createActionButton(text, action, id) {

    const button = document.createElement("button");

    button.type = "button";

    button.textContent = text;

    button.dataset.action = action;

    button.dataset.id = id;

    button.classList.add("action-btn", action);

    return button;

}


// 11. DISPLAY WORKSHOPS IN TABLE
// ==========================================

function renderWorkshops(list = workshops) {

    if (!workshopTableBody) {
        return;
    }

    workshopTableBody.replaceChildren();


    if (list.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 10;

        cell.textContent = "No workshops found.";

        row.appendChild(cell);

        workshopTableBody.appendChild(row);

        return;

    }


    list.forEach(workshop => {

        const row = document.createElement("tr");


        // Workshop ID

        const idCell = document.createElement("td");

        idCell.textContent = workshop.id;


        // Workshop title

        const titleCell = document.createElement("td");

        titleCell.textContent = workshop.title;


        // Category

        const categoryCell = document.createElement("td");

        categoryCell.textContent = workshop.category;


        // Trainer

        const trainerCell = document.createElement("td");

        trainerCell.textContent = workshop.trainer;


        // Date

        const dateCell = document.createElement("td");

        dateCell.textContent = formatDate(workshop.date);


        // Time

        const timeCell = document.createElement("td");

        timeCell.textContent = workshop.time || "-";


        // Venue

        const venueCell = document.createElement("td");

        venueCell.textContent = workshop.venue || "-";


        // Seats

        const seatsCell = document.createElement("td");

        seatsCell.textContent =
            `${workshop.registeredSeats}/${workshop.totalSeats}`;


        // Status

        const statusCell = document.createElement("td");

        statusCell.appendChild(
            createStatusBadge(workshop.status)
        );


        // Action buttons

        const actionsCell = document.createElement("td");

        const actionsContainer = document.createElement("div");

        actionsContainer.classList.add("action-buttons");


        actionsContainer.appendChild(
            createActionButton("View", "view", workshop.id)
        );

        actionsContainer.appendChild(
            createActionButton("Edit", "edit", workshop.id)
        );


        if (workshop.status !== "Completed") {

            actionsContainer.appendChild(
                createActionButton(
                    "Mark Complete",
                    "complete",
                    workshop.id
                )
            );

        }


        actionsContainer.appendChild(
            createActionButton("Delete", "delete", workshop.id)
        );


        actionsCell.appendChild(actionsContainer);


        // Add all cells to the row

        row.append(
            idCell,
            titleCell,
            categoryCell,
            trainerCell,
            dateCell,
            timeCell,
            venueCell,
            seatsCell,
            statusCell,
            actionsCell
        );


        workshopTableBody.appendChild(row);

    });

}


// 12. SEARCH AND FILTER WORKSHOPS
// ==========================================

function filterWorkshops() {

    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const selectedCategory = categoryFilter
        ? categoryFilter.value
        : "";

    const selectedStatus = statusFilter
        ? statusFilter.value
        : "";


    const filteredWorkshops = workshops.filter(workshop => {

        const matchesSearch =
            workshop.title.toLowerCase().includes(searchTerm) ||
            workshop.trainer.toLowerCase().includes(searchTerm);

        const matchesCategory =
            !selectedCategory ||
            workshop.category === selectedCategory;

        const matchesStatus =
            !selectedStatus ||
            workshop.status === selectedStatus;


        return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
        );

    });


    renderWorkshops(filteredWorkshops);

}


// 13. RESET SEARCH AND FILTERS
// ==========================================

function resetFilters() {

    if (searchInput) {
        searchInput.value = "";
    }

    if (categoryFilter) {
        categoryFilter.value = "";
    }

    if (statusFilter) {
        statusFilter.value = "";
    }

    renderWorkshops();

}


// 14. OPEN WORKSHOP FORM
// ==========================================

function openWorkshopForm() {

    if (!workshopFormSection) {
        return;
    }

    workshopFormSection.hidden = false;

    workshopFormSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// 15. CLEAR WORKSHOP FORM
// ==========================================

function clearWorkshopForm() {

    if (!workshopForm) {
        return;
    }

    workshopForm.reset();

    editingWorkshopId = null;

}


// 16. ADD OR UPDATE WORKSHOP
// ==========================================

function handleFormSubmit(event) {

    event.preventDefault();


    if (!workshopForm) {
        return;
    }


    const formData = new FormData(workshopForm);


    const title = formData.get("title")?.trim();

    const category = formData.get("category");

    const trainer = formData.get("trainer")?.trim();

    const date = formData.get("date");

    const time = formData.get("time");

    const venue = formData.get("venue")?.trim();

    const totalSeats = Number(formData.get("totalSeats"));

    const registeredSeats = Number(
        formData.get("registeredSeats")
    );

    const status = formData.get("status");

    const description = formData.get("description")?.trim();


    // Basic validation

    if (!title || !category || !trainer || !date) {

        alert("Please fill in all required fields.");

        return;

    }


    if (
        !Number.isInteger(totalSeats) ||
        !Number.isInteger(registeredSeats) ||
        totalSeats < 1 ||
        registeredSeats < 0 ||
        registeredSeats > totalSeats
    ) {

        alert("Please enter valid seat numbers.");

        return;

    }


    const workshopData = {

        title,
        category,
        trainer,
        date,
        time,
        venue,
        totalSeats,
        registeredSeats,
        status,
        description

    };


    // Check whether the user is editing or adding

    if (editingWorkshopId !== null) {

        workshops = workshops.map(workshop => {

            if (Number(workshop.id) === editingWorkshopId) {

                return {
                    ...workshop,
                    ...workshopData
                };

            }

            return workshop;

        });

        alert("Workshop updated successfully.");

    } else {

        const newWorkshop = {

            id: generateWorkshopId(),
            ...workshopData

        };

        workshops.push(newWorkshop);

        alert("Workshop added successfully.");

    }


    saveWorkshops();

    updateDashboard();

    filterWorkshops();

    clearWorkshopForm();

    if (workshopFormSection) {
        workshopFormSection.hidden = true;
    }

}


// 17. EDIT WORKSHOP
// ==========================================

function editWorkshop(id) {

    const workshop = workshops.find(
        item => Number(item.id) === Number(id)
    );


    if (!workshop || !workshopForm) {
        return;
    }


    editingWorkshopId = Number(id);


    // Fill the form with existing information

    Object.entries(workshop).forEach(([key, value]) => {

        const field = workshopForm.elements.namedItem(key);

        if (field) {
            field.value = value;
        }

    });


    openWorkshopForm();

}


// 18. VIEW WORKSHOP DETAILS
// ==========================================

function viewWorkshop(id) {

    const workshop = workshops.find(
        item => Number(item.id) === Number(id)
    );


    if (!workshop || !workshopDetails) {
        return;
    }


    // Create details safely

    workshopDetails.replaceChildren();


    const heading = document.createElement("h2");

    heading.textContent = workshop.title;


    const details = [

        ["Workshop ID", workshop.id],

        ["Category", workshop.category],

        ["Trainer", workshop.trainer],

        ["Date", formatDate(workshop.date)],

        ["Time", workshop.time || "Not specified"],

        ["Venue", workshop.venue || "Not specified"],

        ["Total Seats", workshop.totalSeats],

        ["Registered Seats", workshop.registeredSeats],

        [
            "Available Seats",
            workshop.totalSeats - workshop.registeredSeats
        ],

        ["Status", workshop.status],

        ["Description", workshop.description || "No description"]

    ];


    workshopDetails.appendChild(heading);


    details.forEach(([label, value]) => {

        const paragraph = document.createElement("p");

        const strong = document.createElement("strong");

        strong.textContent = `${label}: `;

        const span = document.createElement("span");

        span.textContent = value;


        paragraph.append(strong, span);

        workshopDetails.appendChild(paragraph);

    });


    const closeButton = document.createElement("button");

    closeButton.type = "button";

    closeButton.textContent = "Close Details";

    closeButton.addEventListener("click", closeWorkshopDetails);


    workshopDetails.appendChild(closeButton);

    workshopDetails.hidden = false;

    workshopDetails.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// 19. CLOSE WORKSHOP DETAILS
// ==========================================

function closeWorkshopDetails() {

    if (workshopDetails) {
        workshopDetails.hidden = true;
    }

}


// 20. MARK WORKSHOP AS COMPLETED
// ==========================================

function markWorkshopComplete(id) {

    const workshop = workshops.find(
        item => Number(item.id) === Number(id)
    );


    if (!workshop) {
        return;
    }


    workshop.status = "Completed";


    saveWorkshops();

    updateDashboard();

    filterWorkshops();


    alert("Workshop marked as completed.");

}


// 21. OPEN DELETE CONFIRMATION
// ==========================================

function openDeleteConfirmation(id) {

    selectedDeleteId = Number(id);


    if (deleteConfirmation) {

        deleteConfirmation.hidden = false;

        deleteConfirmation.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    } else {

        // Fallback if no confirmation section exists

        deleteWorkshop(selectedDeleteId);

    }

}


// 22. DELETE WORKSHOP
// ==========================================

function deleteWorkshop(id) {

    workshops = workshops.filter(
        workshop => Number(workshop.id) !== Number(id)
    );


    saveWorkshops();

    updateDashboard();

    filterWorkshops();


    selectedDeleteId = null;


    if (deleteConfirmation) {
        deleteConfirmation.hidden = true;
    }


    alert("Workshop deleted successfully.");

}


// 23. CANCEL DELETE
// ==========================================

function cancelDelete() {

    selectedDeleteId = null;


    if (deleteConfirmation) {
        deleteConfirmation.hidden = true;
    }

}


// 24. HANDLE TABLE ACTIONS
// ==========================================

function handleTableActions(event) {

    const button = event.target.closest("button[data-action]");


    if (!button) {
        return;
    }


    const action = button.dataset.action;

    const id = Number(button.dataset.id);


    switch (action) {

        case "view":

            viewWorkshop(id);

            break;


        case "edit":

            editWorkshop(id);

            break;


        case "complete":

            markWorkshopComplete(id);

            break;


        case "delete":

            openDeleteConfirmation(id);

            break;


        default:

            console.warn("Unknown action:", action);

    }

}


// 25. CONNECT EVENT LISTENERS
// ==========================================


// Add workshop button

if (addWorkshopBtn) {

    addWorkshopBtn.addEventListener(
        "click",
        openWorkshopForm
    );

}


// Form submission

if (workshopForm) {

    workshopForm.addEventListener(
        "submit",
        handleFormSubmit
    );

}


// Search input

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterWorkshops
    );

}


// Category filter

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterWorkshops
    );

}


// Status filter

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        filterWorkshops
    );

}


// Reset filters

if (resetFiltersBtn) {

    resetFiltersBtn.addEventListener(
        "click",
        resetFilters
    );

}


// Workshop table actions

if (workshopTableBody) {

    workshopTableBody.addEventListener(
        "click",
        handleTableActions
    );

}


// Close details button

if (closeDetailsBtn) {

    closeDetailsBtn.addEventListener(
        "click",
        closeWorkshopDetails
    );

}


// Confirm delete button

if (confirmDeleteBtn) {

    confirmDeleteBtn.addEventListener(
        "click",
        () => {

            if (selectedDeleteId !== null) {

                deleteWorkshop(selectedDeleteId);

            }

        }
    );

}


// Cancel delete button

if (cancelDeleteBtn) {

    cancelDeleteBtn.addEventListener(
        "click",
        cancelDelete
    );

}


// Clear form button

const clearFormBtn = document.getElementById("clearFormBtn");

if (clearFormBtn) {

    clearFormBtn.addEventListener(
        "click",
        clearWorkshopForm
    );

}


// 26. INITIALIZE APPLICATION
// ==========================================

function initializeApp() {

    // Hide extra sections initially

    if (workshopFormSection) {
        workshopFormSection.hidden = true;
    }

    if (workshopDetails) {
        workshopDetails.hidden = true;
    }

    if (deleteConfirmation) {
        deleteConfirmation.hidden = true;
    }


    // Display saved workshops

    updateDashboard();

    renderWorkshops();

}


// Start the application

initializeApp();