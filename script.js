const TOTAL_DAYS = 31;
const HABIT_COUNT = 10;
const SLEEP_HOURS = ['9 hrs', '8 hrs', '7 hrs', '6 hrs', '5 hrs'];
const MONTHS = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initializeMonthSelector();
    generateGrid();
    loadName(); // Load Global Name
    
    // Set default month to current real-world month
    const currentMonthIndex = new Date().getMonth();
    document.getElementById('monthSelector').value = MONTHS[currentMonthIndex];
    
    // Load data for the selected month
    loadMonthData(); 
});

// --- 1. SETUP UI ---

function initializeMonthSelector() {
    const select = document.getElementById('monthSelector');
    MONTHS.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.innerText = month;
        select.appendChild(option);
    });

    // Event Listeners for switching months
    select.addEventListener('change', switchMonth);
    document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
    
    // Name listener
    document.getElementById('nameInput').addEventListener('input', (e) => {
        localStorage.setItem('tracker_GlobalName', e.target.value);
        showSaveStatus();
    });
}

function generateGrid() {
    const headerRow = document.getElementById('headerRow');
    const habitBody = document.getElementById('habitBody');
    const sleepBody = document.getElementById('sleepBody');

    // Generate Days 1-31 in Header
    for (let i = 1; i <= TOTAL_DAYS; i++) {
        const th = document.createElement('th');
        th.innerText = i;
        headerRow.appendChild(th);
    }

    // Generate 10 Habit Rows
    for (let i = 1; i <= HABIT_COUNT; i++) {
        const tr = document.createElement('tr');
        
        // Habit Name Input
        const tdName = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'habit-input';
        input.placeholder = `${i}. Write Habit Name`;
        input.dataset.id = `habit_${i}`;
        // Save on typing
        input.addEventListener('input', () => { saveCurrentState(); });
        tdName.appendChild(input);
        tr.appendChild(tdName);

        // 31 Checkboxes
        for (let d = 1; d <= TOTAL_DAYS; d++) {
            const td = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'day-check';
            checkbox.dataset.key = `h_${i}_d_${d}`; // unique key
            // Save on click
            checkbox.addEventListener('change', () => { 
                saveCurrentState(); 
                calculateProgress(); 
            });
            td.appendChild(checkbox);
            tr.appendChild(td);
        }
        habitBody.appendChild(tr);
    }

    // Generate Sleep Rows
    SLEEP_HOURS.forEach((hour, index) => {
        const tr = document.createElement('tr');
        tr.className = 'sleep-row';
        
        const tdName = document.createElement('td');
        tdName.innerText = hour;
        tr.appendChild(tdName);

        for (let d = 1; d <= TOTAL_DAYS; d++) {
            const td = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'day-check sleep-check';
            checkbox.dataset.key = `s_${index}_d_${d}`;
            checkbox.addEventListener('change', () => { saveCurrentState(); });
            td.appendChild(checkbox);
            tr.appendChild(td);
        }
        sleepBody.appendChild(tr);
    });

    // Notes Listener
    document.getElementById('notesInput').addEventListener('input', () => { saveCurrentState(); });
}

// --- 2. SWITCHING LOGIC ---

function changeMonth(direction) {
    const select = document.getElementById('monthSelector');
    let index = MONTHS.indexOf(select.value);
    index += direction;
    
    // Loop around
    if (index < 0) index = 11;
    if (index > 11) index = 0;
    
    select.value = MONTHS[index];
    switchMonth();
}

function switchMonth() {
    // 1. We clear the visible form first
    clearForm();
    // 2. We load the data for the new month
    loadMonthData();
}

// --- 3. SAVING & LOADING (The Magic) ---

function getMonthKey() {
    const year = new Date().getFullYear(); 
    const month = document.getElementById('monthSelector').value;
    return `tracker_${year}_${month}`;
}

function saveCurrentState() {
    const key = getMonthKey();
    
    const data = {
        habits: {},
        checks: {},
        notes: document.getElementById('notesInput').value
    };

    // Save Habit Names
    document.querySelectorAll('.habit-input').forEach(input => {
        data.habits[input.dataset.id] = input.value;
    });

    // Save Checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(box => {
        if (box.checked) {
            data.checks[box.dataset.key] = true;
        }
    });

    localStorage.setItem(key, JSON.stringify(data));
    showSaveStatus();
}

function loadMonthData() {
    const key = getMonthKey();
    const stored = localStorage.getItem(key);
    
    if (stored) {
        const data = JSON.parse(stored);
        
        // Restore Notes
        document.getElementById('notesInput').value = data.notes || "";

        // Restore Habit Names
        if (data.habits) {
            for (const [id, text] of Object.entries(data.habits)) {
                const input = document.querySelector(`.habit-input[data-id="${id}"]`);
                if (input) input.value = text;
            }
        }

        // Restore Checks
        if (data.checks) {
            for (const checkKey in data.checks) {
                const box = document.querySelector(`input[data-key="${checkKey}"]`);
                if (box) box.checked = true;
            }
        }
    } else {
        // If new month, maybe copy habit names from previous month? 
        // For now, we leave it blank to be clean, or you can implement copy logic here.
    }
    
    calculateProgress();
}

function loadName() {
    const name = localStorage.getItem('tracker_GlobalName');
    if(name) document.getElementById('nameInput').value = name;
}

function clearForm() {
    // Uncheck all boxes
    document.querySelectorAll('input[type="checkbox"]').forEach(box => box.checked = false);
    // Clear habit names (so they don't visually bleed into next month if empty)
    document.querySelectorAll('.habit-input').forEach(input => input.value = "");
    // Clear notes
    document.getElementById('notesInput').value = "";
    // Reset progress
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('progressText').innerText = '0%';
}

// --- 4. UTILITIES ---

function showSaveStatus() {
    const status = document.getElementById('saveStatus');
    status.style.opacity = '1';
    // Clear existing timeout if typing fast
    if(window.saveTimeout) clearTimeout(window.saveTimeout);
    window.saveTimeout = setTimeout(() => {
        status.style.opacity = '0';
    }, 1000);
}

function calculateProgress() {
    const totalHabitBoxes = document.querySelectorAll('.day-check:not(.sleep-check)').length;
    const checkedBoxes = document.querySelectorAll('.day-check:not(.sleep-check):checked').length;
    
    let percent = 0;
    if (totalHabitBoxes > 0) {
        percent = Math.round((checkedBoxes / totalHabitBoxes) * 100);
    }
    
    document.getElementById('progressBar').style.width = percent + '%';
    document.getElementById('progressText').innerText = percent + '%';
}

function resetCurrentMonth() {
    if(confirm("Are you sure? This will delete checks and names for THIS month only.")) {
        const key = getMonthKey();
        localStorage.removeItem(key);
        clearForm();
        loadMonthData(); // Reload (which will be empty)
    }
}