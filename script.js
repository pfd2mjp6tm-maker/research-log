// ============================
// Research Log
// Multiple Logs per Day
// Return Choice Version
// ============================


// ============================
// Variables
// ============================

let currentDate = new Date();

let selectedDate = null;

let isFormOpen = false;


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

const logList =
    document.getElementById("logList");


const addLogArea =
    document.getElementById("addLogArea");

const addLogButton =
    document.getElementById("addLogButton");

const logForm =
    document.getElementById("logForm");


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
// Return Choice Modal
// ============================

const returnModal =
    document.getElementById("returnModal");

const returnMessage =
    document.getElementById("returnMessage");

const returnToLogs =
    document.getElementById("returnToLogs");

const returnToCalendar =
    document.getElementById("returnToCalendar");

const cancelReturn =
    document.getElementById("cancelReturn");


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

function getDateKey(
    year,
    month,
    day
) {

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


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const daysInPreviousMonth =
        new Date(
            year,
            month,
            0
        ).getDate();


    const logs =
        getLogs();


    // =========================
    // Previous Month
    // =========================

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


    // =========================
    // Current Month
    // =========================

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


        if (
            logs[dateKey] &&
            logs[dateKey].length > 0
        ) {

            dayElement.classList.add(
                "has-log"
            );

        }


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


    // =========================
    // Next Month
    // =========================

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
// Create Calendar Day
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


    isFormOpen =
        false;


    selectedDateElement.textContent =
        formatDate(dateKey);


    clearForm();


    logForm.style.display =
        "none";


    addLogArea.style.display =
        "block";


    renderLogList();


    logModal.classList.add(
        "show"
    );

}


// ============================
// Close Button
// ============================

closeModal.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        event.stopPropagation();

        showReturnChoice();

    }
);


// ============================
// Show Return Choice
// ============================

function showReturnChoice() {

    if (!selectedDate) {
        return;
    }


    if (isFormOpen) {

        returnMessage.textContent =
            "入力内容は保存されていません。どこに戻りますか？";

    } else {

        returnMessage.textContent =
            "戻り先を選択してください。";

    }


    returnModal.classList.add(
        "show"
    );

}


// ============================
// Close Return Choice
// ============================

function hideReturnChoice() {

    returnModal.classList.remove(
        "show"
    );

}


// ============================
// Return to Today's Logs
// ============================

returnToLogs.addEventListener(
    "click",
    function() {

        hideReturnChoice();


        isFormOpen =
            false;


        clearForm();


        logForm.style.display =
            "none";


        addLogArea.style.display =
            "block";


        renderLogList();

    }
);


// ============================
// Return to Calendar
// ============================

returnToCalendar.addEventListener(
    "click",
    function() {

        hideReturnChoice();


        logModal.classList.remove(
            "show"
        );


        selectedDate =
            null;


        isFormOpen =
            false;


        clearForm();

    }
);


// ============================
// Cancel
// ============================

cancelReturn.addEventListener(
    "click",
    function() {

        hideReturnChoice();

    }
);


// ============================
// Clear Form
// ============================

function clearForm() {

    actionInput.value = "";

    purposeInput.value = "";

    resultInput.value = "";

    thoughtInput.value = "";

    nextInput.value = "";

    tagsInput.value = "";

}


// ============================
// Check Form Input
// ============================

function hasFormInput() {

    return (
        actionInput.value.trim() !== "" ||
        purposeInput.value.trim() !== "" ||
        resultInput.value.trim() !== "" ||
        thoughtInput.value.trim() !== "" ||
        nextInput.value.trim() !== "" ||
        tagsInput.value.trim() !== ""
    );

}


// ============================
// Render Log List
// ============================

function renderLogList() {

    logList.innerHTML = "";


    if (!selectedDate) {
        return;
    }


    const logs =
        getLogs();


    const dayLogs =
        logs[selectedDate] || [];


    if (dayLogs.length === 0) {

        const emptyMessage =
            document.createElement("p");


        emptyMessage.className =
            "empty-message";


        emptyMessage.textContent =
            "まだ研究ログはありません。";


        logList.appendChild(
            emptyMessage
        );


        return;

    }


    dayLogs.forEach(
        function(log, index) {

            const card =
                document.createElement("div");


            card.className =
                "log-card";


            // =========================
            // Title
            // =========================

            const title =
                document.createElement("h3");


            title.textContent =
                log.action ||
                "研究ログ";


            card.appendChild(
                title
            );


            // =========================
            // Purpose
            // =========================

            addLogItem(
                card,
                "目的",
                log.purpose
            );


            // =========================
            // Result
            // =========================

            addLogItem(
                card,
                "結果",
                log.result
            );


            // =========================
            // Thought
            // =========================

            addLogItem(
                card,
                "考察・気づき",
                log.thought
            );


            // =========================
            // Next
            // =========================

            addLogItem(
                card,
                "次に活かすこと",
                log.next
            );


            // =========================
            // Tags
            // =========================

            if (log.tags) {

                const tags =
                    document.createElement("div");


                tags.className =
                    "log-tags";


                tags.textContent =
                    log.tags;


                card.appendChild(
                    tags
                );

            }


            // =========================
            // Delete Button
            // =========================

            const deleteButton =
                document.createElement("button");


            deleteButton.className =
                "delete-button";


            deleteButton.textContent =
                "削除";


            deleteButton.type =
                "button";


            deleteButton.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    deleteLog(index);

                }
            );


            card.appendChild(
                deleteButton
            );


            logList.appendChild(
                card
            );

        }
    );

}


// ============================
// Add Log Item
// ============================

function addLogItem(
    card,
    label,
    value
) {

    if (!value) {
        return;
    }


    const item =
        document.createElement("div");


    item.className =
        "log-item";


    const labelElement =
        document.createElement("strong");


    labelElement.textContent =
        label;


    const valueElement =
        document.createElement("p");


    valueElement.textContent =
        value;


    item.appendChild(
        labelElement
    );


    item.appendChild(
        valueElement
    );


    card.appendChild(
        item
    );

}


// ============================
// Add New Log
// ============================

addLogButton.addEventListener(
    "click",
    function() {

        clearForm();


        isFormOpen =
            true;


        logList.innerHTML =
            "";


        addLogArea.style.display =
            "none";


        logForm.style.display =
            "block";


        actionInput.focus();

    }
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


        if (!logs[selectedDate]) {

            logs[selectedDate] =
                [];

        }


        const newLog = {

            action:
                action,

            purpose:
                purpose,

            result:
                result,

            thought:
                thought,

            next:
                next,

            tags:
                tags,

            createdAt:
                new Date().toISOString()

        };


        // =========================
        // Multiple Logs
        // =========================

        logs[selectedDate].push(
            newLog
        );


        saveLogs(logs);


        clearForm();


        isFormOpen =
            false;


        logForm.style.display =
            "none";


        addLogArea.style.display =
            "block";


        renderLogList();


        renderCalendar();

    }
);


// ============================
// Delete Log
// ============================

function deleteLog(index) {

    if (!selectedDate) {
        return;
    }


    const shouldDelete =
        confirm(
            "この研究ログを削除しますか？"
        );


    if (!shouldDelete) {
        return;
    }


    const logs =
        getLogs();


    if (
        !logs[selectedDate]
    ) {

        return;

    }


    logs[selectedDate].splice(
        index,
        1
    );


    if (
        logs[selectedDate].length === 0
    ) {

        delete logs[selectedDate];

    }


    saveLogs(logs);


    renderLogList();

    renderCalendar();

}


// ============================
// Month Navigation
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
// Calendar Navigation
// ============================

document
    .getElementById("calendarButton")
    .addEventListener(
        "click",
        function() {

            if (
                logModal.classList.contains("show")
            ) {

                logModal.classList.remove(
                    "show"
                );

            }


            if (
                returnModal.classList.contains("show")
            ) {

                returnModal.classList.remove(
                    "show"
                );

            }


            selectedDate =
                null;


            isFormOpen =
                false;


            clearForm();

        }
    );


// ============================
// Search
// ============================

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


// ============================
// Summary
// ============================

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
// ESC Key
// ============================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            if (
                returnModal.classList.contains("show")
            ) {

                hideReturnChoice();

                return;

            }


            if (
                logModal.classList.contains("show")
            ) {

                showReturnChoice();

            }

        }

    }
);


// ============================
// Start
// ============================

renderCalendar();