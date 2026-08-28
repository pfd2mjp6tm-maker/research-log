// ============================
// Research Log
// Ver.1.1 Complete
// ============================


// ============================
// Storage Keys
// ============================

const STORAGE_KEY = "researchLogs";
const TAG_STORAGE_KEY = "researchTags";


// ============================
// State
// ============================

let currentDate = new Date();

let selectedDate = null;

let currentLogs = [];

let selectedMainTag = "";

let selectedMainTagColor = "#75BFE6";

let selectedNewTagColor = "#75BFE6";


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

const mainTagSelect =
    document.getElementById("mainTag");

const addTagButton =
    document.getElementById("addTagButton");

const colorPicker =
    document.getElementById("colorPicker");

const saveButton =
    document.getElementById("saveButton");

const tagModal =
    document.getElementById("tagModal");

const closeTagModal =
    document.getElementById("closeTagModal");

const newTagName =
    document.getElementById("newTagName");

const newTagColorPicker =
    document.getElementById(
        "newTagColorPicker"
    );

const saveTagButton =
    document.getElementById(
        "saveTagButton"
    );

const tagLegend =
    document.getElementById(
        "tagLegend"
    );


// ============================
// Storage
// ============================

function getLogs() {

    const data =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (!data) {
        return {};
    }

    try {

        return JSON.parse(data);

    } catch {

        return {};

    }

}


function saveLogs(logs) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(logs)
    );

}


function getTags() {

    const data =
        localStorage.getItem(
            TAG_STORAGE_KEY
        );

    if (!data) {
        return {};
    }

    try {

        return JSON.parse(data);

    } catch {

        return {};

    }

}


function saveTags(tags) {

    localStorage.setItem(
        TAG_STORAGE_KEY,
        JSON.stringify(tags)
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

            // Old format:
            // date -> single object

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
                            oldLog.thought ||
                            oldLog.consideration ||
                            "",

                        next:
                            oldLog.next || "",

                        tags:
                            oldLog.tags || "",

                        mainTag:
                            oldLog.mainTag || "",

                        mainTagColor:
                            oldLog.mainTagColor ||
                            "#75BFE6",

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
// Date
// ============================

function getDateKey(
    year,
    month,
    day
) {

    return (
        year +
        "-" +
        String(month + 1).padStart(
            2,
            "0"
        ) +
        "-" +
        String(day).padStart(
            2,
            "0"
        )
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


    const logs =
        getLogs();


    // Previous month days

    const daysInPreviousMonth =
        new Date(
            year,
            month,
            0
        ).getDate();


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


    // Current month

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


        // Today

        const today =
            new Date();


        if (
            year ===
                today.getFullYear() &&

            month ===
                today.getMonth() &&

            day ===
                today.getDate()
        ) {

            dayElement.classList.add(
                "today"
            );

        }


        // Tag colors

        if (
            logs[dateKey] &&
            logs[dateKey].length > 0
        ) {

            const colors =
                getMainTagColors(
                    logs[dateKey]
                );


            if (
                colors.length > 0
            ) {

                const container =
                    document.createElement(
                        "div"
                    );


                container.className =
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


                        container.appendChild(
                            dot
                        );

                    }
                );


                dayElement.appendChild(
                    container
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


    // Fill remaining cells

    const remaining =
        42 -
        calendar.children.length;


    for (
        let i = 1;
        i <= remaining;
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


    renderTagLegend();

}


// ============================
// Create Day
// ============================

function createDayElement(
    dayNumber,
    className
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "day " +
        className;


    const number =
        document.createElement(
            "span"
        );


    number.textContent =
        dayNumber;


    element.appendChild(
        number
    );


    return element;

}


// ============================
// Main Tag Colors
// ============================

function getMainTagColors(
    logs
) {

    const colors = [];


    logs.forEach(
        function(log) {

            const color =
                log.mainTagColor;


            if (
                color &&
                !colors.includes(color)
            ) {

                colors.push(color);

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


    const logs =
        getLogs();


    currentLogs =
        logs[dateKey]
            ? logs[dateKey].map(
                function(log) {
                    return {
                        ...log
                    };
                }
            )
            : [];


    clearForm();

    populateMainTags();

    selectColor(
        selectedMainTagColor
    );


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

    mainTagSelect.value = "";

    selectedMainTag = "";

    selectedMainTagColor =
        "#75BFE6";


    document
        .querySelectorAll(
            ".color-option"
        )
        .forEach(
            function(button) {

                button.classList.remove(
                    "selected"
                );

            }
        );

}


// ============================
// Close Log
// ============================

function closeLog() {

    logModal.classList.remove(
        "show"
    );

    selectedDate = null;

}


// ============================
// Populate Main Tags
// ============================

function populateMainTags() {

    const tags =
        getTags();


    mainTagSelect.innerHTML = "";


    const defaultOption =
        document.createElement(
            "option"
        );


    defaultOption.value = "";

    defaultOption.textContent =
        "タグを選択";


    mainTagSelect.appendChild(
        defaultOption
    );


    Object.keys(tags).forEach(
        function(tagName) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                tagName;


            option.textContent =
                tagName;


            mainTagSelect.appendChild(
                option
            );

        }
    );

}


// ============================
// Main Tag Selection
// ============================

mainTagSelect.addEventListener(
    "change",
    function() {

        selectedMainTag =
            this.value;


        const tags =
            getTags();


        if (
            tags[selectedMainTag]
        ) {

            selectedMainTagColor =
                tags[selectedMainTag].color;


            selectColor(
                selectedMainTagColor
            );

        }

    }
);


// ============================
// Color Selection
// ============================

function selectColor(color) {

    selectedMainTagColor =
        color;


    document
        .querySelectorAll(
            ".color-option"
        )
        .forEach(
            function(button) {

                button.classList.remove(
                    "selected"
                );


                if (
                    button.dataset.color ===
                    color
                ) {

                    button.classList.add(
                        "selected"
                    );

                }

            }
        );

}


document
    .querySelectorAll(
        "#colorPicker .color-option"
    )
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    selectColor(
                        this.dataset.color
                    );

                }
            );

        }
    );


// ============================
// Add New Tag
// ============================

addTagButton.addEventListener(
    "click",
    function() {

        newTagName.value = "";

        selectedNewTagColor =
            "#75BFE6";


        document
            .querySelectorAll(
                ".new-color-option"
            )
            .forEach(
                function(button) {

                    button.classList.remove(
                        "selected"
                    );

                }
            );


        tagModal.classList.add(
            "show"
        );

    }
);


// ============================
// New Tag Color
// ============================

document
    .querySelectorAll(
        ".new-color-option"
    )
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    selectedNewTagColor =
                        this.dataset.color;


                    document
                        .querySelectorAll(
                            ".new-color-option"
                        )
                        .forEach(
                            function(other) {

                                other.classList.remove(
                                    "selected"
                                );

                            }
                        );


                    this.classList.add(
                        "selected"
                    );

                }
            );

        }
    );


// ============================
// Save New Tag
// ============================

saveTagButton.addEventListener(
    "click",
    function() {

        let name =
            newTagName.value.trim();


        if (!name) {

            alert(
                "タグ名を入力してください。"
            );

            return;

        }


        // Add # automatically

        if (
            !name.startsWith("#")
        ) {

            name =
                "#" + name;

        }


        const tags =
            getTags();


        tags[name] = {

            color:
                selectedNewTagColor

        };


        saveTags(
            tags
        );


        populateMainTags();


        mainTagSelect.value =
            name;


        selectedMainTag =
            name;


        selectedMainTagColor =
            selectedNewTagColor;


        selectColor(
            selectedNewTagColor
        );


        tagModal.classList.remove(
            "show"
        );


        renderTagLegend();

    }
);


// ============================
// Close Tag Modal
// ============================

closeTagModal.addEventListener(
    "click",
    function() {

        tagModal.classList.remove(
            "show"
        );

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


        // Main tag is optional for now

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
                selectedMainTag,

            mainTagColor:
                selectedMainTag
                    ? selectedMainTagColor
                    : "",

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


        renderCalendar();


        const addMore =
            confirm(
                "ログを保存しました！\n\n" +
                "同じ日にもう1つログを追加しますか？"
            );


        if (addMore) {

            clearForm();

            populateMainTags();

            return;

        }


        closeLog();

    }
);


// ============================
// Tag Legend
// ============================

function renderTagLegend() {

    tagLegend.innerHTML = "";


    const tags =
        getTags();


    Object.keys(tags).forEach(
        function(tagName) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "legend-item";


            const dot =
                document.createElement(
                    "span"
                );


            dot.className =
                "legend-dot";


            dot.style.backgroundColor =
                tags[tagName].color;


            const text =
                document.createElement(
                    "span"
                );


            text.textContent =
                tagName;


            item.appendChild(
                dot
            );


            item.appendChild(
                text
            );


            tagLegend.appendChild(
                item
            );

        }
    );

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
// Bottom Navigation
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

populateMainTags();

renderTagLegend();