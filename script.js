// ============================
// Research Log
// script.js
// ============================


// ============================
// Variables
// ============================

let currentDate = new Date();

let selectedDate = null;


// ============================
// DOM
// ============================

const calendar =
    document.getElementById("calendar");

const monthTitle =
    document.getElementById("monthTitle");

const prevMonth =
    document.getElementById("prevMonth");

const nextMonth =
    document.getElementById("nextMonth");

const logModal =
    document.getElementById("logModal");

const closeModal =
    document.getElementById("closeModal");

const selectedDateElement =
    document.getElementById("selectedDate");

const actionInput =
    document.getElementById("action");

const purposeInput =
    document.getElementById("purpose");

const resultInput =
    document.getElementById("result");

const thoughtInput =
    document.getElementById("thought");

const nextInput =
    document.getElementById("next");

const tagsInput =
    document.getElementById("tags");

const saveButton =
    document.getElementById("saveButton");


// ============================
// Local Storage
// ============================

const STORAGE_KEY =
    "researchLogs";


function getLogs() {

    return JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || {};

}


function saveLogs(logs) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(logs)
    );

}


// ============================
// Date Helper
// ============================

function getDateKey(year, month, day) {

    return (
        year +
        "-" +
        String(month + 1).padStart(2, "0") +
        "-" +
        String(day).padStart(2, "0")
    );

}


function formatDate(dateKey) {

    const parts =
        dateKey.split("-");

    return (
        parts[0] +
        "/" +
        Number(parts[1]) +
        "/" +
        Number(parts[2])
    );

}


// ============================
// Calendar
// ============================

function renderCalendar() {

    calendar.innerHTML = "";


    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    monthTitle.textContent =
        year +
        "年" +
        (month + 1) +
        "月";


    // First day of month
    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    // Number of days
    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    // Previous month's days
    const daysInPreviousMonth =
        new Date(
            year,
            month,
            0
        ).getDate();


    const logs =
        getLogs();


    // ============================
    // Previous month
    // ============================

    for (
        let i = firstDay - 1;
        i >= 0;
        i--
    ) {

        const dayNumber =
            daysInPreviousMonth - i;


        const dayElement =
            createDayElement(
                dayNumber,
                "other-month"
            );


        calendar.appendChild(
            dayElement
        );

    }


    // ============================
    // Current month
    // ============================

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dateKey =
            getDateKey(
                year,
                month,
                day
            );


        const dayElement =
            createDayElement(
                day,
                ""
            );


        // Today's date
        const today =
            new Date();


        if (
            year === today.getFullYear() &&
            month === today.getMonth() &&
            day === today.getDate()
        ) {

            dayElement.classList.add(
                "today"
            );

        }


        // Has log
        if (
            logs[dateKey] &&
            logs[dateKey].length > 0
        ) {

            dayElement.classList.add(
                "has-log"
            );

        }


        // Click
        dayElement.addEventListener(
            "click",
            function() {

                openLog(dateKey);

            }
        );


        calendar.appendChild(
            dayElement
        );

    }


    // ============================
    // Next month's days
    // ============================

    const totalCells =
        calendar.children.length;


    const remainingCells =
        42 - totalCells;


    for (
        let i = 1;
        i <= remainingCells;
        i++
    ) {

        const dayElement =
            createDayElement(
                i,
                "other-month"
            );


        calendar.appendChild(
            dayElement
        );

    }

}


// ============================
// Create Day
// ============================

function createDayElement(
    dayNumber,
    className
) {

    const element =
        document.createElement("div");


    element.className =
        "day " +
        className;


    element.textContent =
        dayNumber;


    return element;

}


// ============================
// Open Log
// ============================

function openLog(dateKey) {

    selectedDate =
        dateKey;


    selectedDateElement.textContent =
        formatDate(dateKey);


    // Clear form first
    actionInput.value = "";
    purposeInput.value = "";
    resultInput.value = "";
    thoughtInput.value = "";
    nextInput.value = "";
    tagsInput.value = "";


    const logs =
        getLogs();


    // If logs exist
    if (
        logs[dateKey] &&
        logs[dateKey].length > 0
    ) {

        // For now,
        // show the first log
        const log =
            logs[dateKey][0];


        actionInput.value =
            log.action || "";

        purposeInput.value =
            log.purpose || "";

        resultInput.value =
            log.result || "";

        thoughtInput.value =
            log.thought || "";

        nextInput.value =
            log.next || "";

        tagsInput.value =
            log.tags || "";

    }


    logModal.classList.add(
        "show"
    );

}


// ============================
// Close Modal
// ============================

function closeLog() {

    logModal.classList.remove(
        "show"
    );

    selectedDate = null;

}


closeModal.addEventListener(
    "click",
    closeLog
);


// ============================
// Save Log
// ============================

saveButton.addEventListener(
    "click",
    function() {


        if (!selectedDate) {
            return;
        }


        const action =
            actionInput.value.trim();


        const purpose =
            purposeInput.value.trim();


        const result =
            resultInput.value.trim();


        const thought =
            thoughtInput.value.trim();


        const next =
            nextInput.value.trim();


        const tags =
            tagsInput.value.trim();


        // At least one field
        if (
            !action &&
            !purpose &&
            !result &&
            !thought &&
            !next &&
            !tags
        ) {

            alert(
                "何か入力してから保存してください。"
            );

            return;

        }


        const logs =
            getLogs();


        const newLog = {

            action: action,

            purpose: purpose,

            result: result,

            thought: thought,

            next: next,

            tags: tags,

            createdAt:
                new Date().toISOString()

        };


        // ============================
        // Save
        // ============================

        // For now,
        // one log per day

        logs[selectedDate] = [
            newLog
        ];


        saveLogs(logs);


        // Close
        closeLog();


        // Update calendar
        renderCalendar();


        alert(
            "研究ログを保存しました！"
        );

    }
);


// ============================
// Previous Month
// ============================

prevMonth.addEventListener(
    "click",
    function() {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        renderCalendar();

    }
);


// ============================
// Next Month
// ============================

nextMonth.addEventListener(
    "click",
    function() {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        renderCalendar();

    }
);


// ============================
// Bottom Navigation
// ============================

document
    .getElementById("calendarButton")
    .addEventListener(
        "click",
        function() {

            // Calendar is already shown

        }
    );


document
    .getElementById("searchButton")
    .addEventListener(
        "click",
        function() {

            alert(
                "Search機能は次のバージョンで追加します！"
            );

        }
    );


document
    .getElementById("summaryButton")
    .addEventListener(
        "click",
        function() {

            alert(
                "Summary機能は次のバージョンで追加します！"
            );

        }
    );


// ============================
// Start
// ============================

renderCalendar();