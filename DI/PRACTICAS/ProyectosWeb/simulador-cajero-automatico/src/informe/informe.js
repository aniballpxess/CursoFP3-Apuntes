import { Record, loadRecords, saveRecords } from '../record.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- UI ELEMENTS ---

    // Table parts
    /** @type {HTMLTableSectionElement} */
    const table_body = document.getElementById('records-table-body');

    // Action buttons
    /** @type {HTMLButtonElement} */
    const act_btn_reset = document.getElementById('act-btn-reset');
    /** @type {HTMLButtonElement} */
    const act_btn_close = document.getElementById('act-btn-close');

    // Helper buttons
    /** @type {HTMLButtonElement} */
    const helper_btn_tab = document.getElementById('helper-btn-tab');
    /** @type {HTMLButtonElement} */
    const helper_btn_enter = document.getElementById('helper-btn-enter');

    // -------------------------------------------------------------------------- //

    // --- LOCAL DEFINITIONS ---

    // Constants
    /** @enum {string} */
    const EVENT = Object.freeze({
        CLICK: 'click',
        MOUSE_DOWN: 'mousedown',
        STORAGE: 'storage',
        CHANGE: 'change',
    });

    /** @type {HTMLButtonElement[]} */
    const BUTTONS = [];
    BUTTONS.push(act_btn_reset);
    BUTTONS.push(act_btn_close);

    // Variables
    /** @type {Record[]} */
    let records = null;

    /** @type {HTMLButtonElement[]} */
    let focusable_buttons = [];

    // Functions
    /**
     *
     */
    function loadTable() {
        table_body.replaceChildren();
        records.forEach(record => {
            const tr = document.createElement('tr');
            let td = null;

            td = document.createElement('td');
            td.textContent = record.date;
            td.className = 'with-text';
            tr.appendChild(td);

            td = document.createElement('td');
            td.textContent = record.time;
            td.className = 'with-text';
            tr.appendChild(td);

            td = document.createElement('td');
            td.textContent = record.action;
            td.className = 'with-text';
            tr.appendChild(td);

            td = document.createElement('td');
            if (record.withdrawal_amount !== 0) {
                td.textContent = record.withdrawal_amount;
            }
            td.className = 'with-text';
            tr.appendChild(td);

            td = document.createElement('td');
            td.textContent = record.balance;
            td.className = 'with-text';
            tr.appendChild(td);

            table_body.appendChild(tr);
        });
    }

    /**
     *
     */
    function updateFocusableButtons() {
        focusable_buttons = BUTTONS.filter(btn => {
            if (btn.disabled) {
                return false;
            }
            if (btn.tabIndex < 0) {
                return false;
            }
            return true;
        });
    }

    // -------------------------------------------------------------------------- //

    // --- EVENT HANDLING ---

    // Action buttons
    act_btn_close.addEventListener(EVENT.CLICK, () => {
        window.close();
    });
    act_btn_reset.addEventListener(EVENT.CLICK, () => {
        localStorage.removeItem('records');
        records = loadRecords();
        loadTable();
    });

    // Helper buttons
    helper_btn_tab.addEventListener(EVENT.MOUSE_DOWN, ev => {
        ev.preventDefault();

        const active = document.activeElement;
        const index = focusable_buttons.indexOf(active);
        const next = (index + 1) % focusable_buttons.length;

        focusable_buttons[next].focus();
    });
    helper_btn_enter.addEventListener(EVENT.MOUSE_DOWN, ev => {
        ev.preventDefault();

        if (document.activeElement) {
            document.activeElement.click();
        }
    });

    // Storage change
    window.addEventListener(EVENT.STORAGE, event => {
        if (event.key === 'records') {
            records = loadRecords();
            loadTable();
        }
    });

    // -------------------------------------------------------------------------- //

    // --- INCIALIZE INTERFACE ---
    records = loadRecords();
    loadTable();
    updateFocusableButtons();

    // -------------------------------------------------------------------------- //

    // --- TESTING ---
});
