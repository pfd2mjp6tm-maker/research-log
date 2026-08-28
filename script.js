// ============================
// Research Log
// Ver.1.1
// ============================


// ============================
// Variables
// ============================

let currentDate = new Date();

let selectedDate = null;

let currentLogs = [];


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
// Storage
// ============================

const STORAGE_KEY =
    "researchLogs";

const TAG_STORAGE_KEY =
    "researchTags";


// ============================
// Get Logs
// ============================

function getLogs() {

    const data =
        JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );

    if (!data) {
        return {};
    }

    return data;

}


// ============================
// Save Logs
// ============================

function saveLogs(logs) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(logs)
    );

}


// ============================
// Migration
// ============================

function migrateOldData() {

    const logs =
        getLogs();

    let changed = false;


    Object.keys(logs).forEach(
        function(dateKey) {

            if (
                !Array.isArray(
                    logs[dateKey]
                )
            ) {

                const oldLog =
                    logs[dateKey];


                logs[dateKey] = [
                    {
                        action:
                            oldLog.action || "",

                        purpose:
                            oldLog.purpose || "",

                        result:
                            oldLog.result || "",

                        thought:
                            oldLog.thought || "",

                        next:
                            oldLog.next || "",

                        tags:
                            oldLog.tags || "",

                        mainTag:
                            oldLog.mainTag || "",

                        mainTagColor:
                            oldLog.mainTagColor || "",

                        createdAt:
                            oldLog.createdAt ||
                            new Date().toISOString()
                    }
                ];


                changed = true;

            }

        }
    );


    if (changed) {

        saveLogs(logs);

    }

}


// ============================
// Date Key
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


// ============================
// Format Date
// ============================

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


        // ============================
        // Colored tags
        // ============================

        if (
            logs[dateKey] &&
            logs[dateKey].length > 0
        ) {

            const colors =
                getMainTagColors(
                    logs[dateKey]
                );


            if (colors.length > 0) {

                const colorContainer =
                    document.createElement(
                        "div"
                    );


                colorContainer.className =
                    "tag-dots";


                colors.forEach(
                    function(color) {

                        const dot =
                            document.createElement(
                                "span"
                            );


                        dot.className =
                            "tag-dot";


                        dot.style.backgroundColor =
                            color;


                        colorContainer.appendChild(
                            dot
                        );

                    }
                );


                dayElement.appendChild(
                    colorContainer
                );

            }

        }


        dayElement.addEventListener(
            "click",
            function() {

                openLog(
                    dateKey
                );

            }
        );


        calendar.appendChild(
            dayElement
        );

    }


    // ============================
    // Next month
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


    const number =
        document.createElement("span");


    number.textContent =
        dayNumber;


    element.appendChild(
        number
    );


    return element;

}


// ============================
// Get Main Tag Colors
// ============================

function getMainTagColors(
    logs
) {

    const colors = [];


    logs.forEach(
        function(log) {

            if (
                log.mainTagColor &&
                !colors.includes(
                    log.mainTagColor
                )
            ) {

                colors.push(
                    log.mainTagColor
                );

            }

        }
    );


    return colors;

}


// ============================
// Open Log
// ============================

function openLog(dateKey) {

    selectedDate =
        dateKey;


    selectedDateElement.textContent =
        formatDate(
            dateKey
        );


    currentLogs = [];


    clearForm();


    const logs =
        getLogs();


    if (
        logs[dateKey] &&
        logs[dateKey].length > 0
    ) {

        currentLogs =
            logs[dateKey].map(
                function(log) {

                    return {
                        ...log
                    };

                }
            );

    }


    logModal.classList.add(
        "show"
    );

}


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
// Close Modal
// ============================

function closeLog() {

    logModal.classList.remove(
        "show"
    );

    selectedDate = null;

    currentLogs = [];

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

            mainTag:
                "",

            mainTagColor:
                "",

            createdAt:
                new Date().toISOString()

        };


        currentLogs.push(
            newLog
        );


        const logs =
            getLogs();


        logs[selectedDate] =
            currentLogs;


        saveLogs(
            logs
        );


        // ============================
        // Continue?
        // ============================

        const addMore =
            confirm(
                "ログを保存しました！\n\n" +
                "同じ日にもう1つログを追加しますか？"
            );


        if (addMore) {

            clearForm();

            return;

        }


        closeLog();

        renderCalendar();

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
// Navigation
// ============================

document
    .getElementById(
        "calendarButton"
    )
    .addEventListener(
        "click",
        function() {

            renderCalendar();

        }
    );


document
    .getElementById(
        "searchButton"
    )
    .addEventListener(
        "click",
        function() {

            alert(
                "Search機能は次のアップデートで追加します！"
            );

        }
    );


document
    .getElementById(
        "summaryButton"
    )
    .addEventListener(
        "click",
        function() {

            alert(
                "Summary機能は次のアップデートで追加します！"
            );

        }
    );


// ============================
// Start
// ============================

migrateOldData();

renderCalendar();