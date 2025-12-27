/* eslint-disable no-console */
/* eslint-disable no-self-assign */

// --- UI ELEMENTS ---

// Displays
/** @type {HTMLSpanElement} */
const display_operation = document.getElementById('display-operation');
/** @type {HTMLSpanElement} */
const display_number = document.getElementById('display-number');

// Action buttons
/** @type {HTMLButtonElement} */
const action_btn_cln = document.getElementById('action-btn-cln');
/** @type {HTMLButtonElement} */
const action_btn_rst = document.getElementById('action-btn-reset');
/** @type {HTMLButtonElement} */
const action_btn_del = document.getElementById('action-btn-delete');
/** @type {HTMLButtonElement} */
const action_btn_eql = document.getElementById('action-btn-equal');

/** @type {HTMLButtonElement} */
const action_btn_div = document.getElementById('action-btn-div');
/** @type {HTMLButtonElement} */
const action_btn_prd = document.getElementById('action-btn-prd');
/** @type {HTMLButtonElement} */
const action_btn_sub = document.getElementById('action-btn-sub');
/** @type {HTMLButtonElement} */
const action_btn_add = document.getElementById('action-btn-add');

// Typing buttons
/** @type {HTMLButtonElement} */
const typing_btn_dot = document.getElementById('typing-btn-dot');
/** @type {HTMLButtonElement} */
const typing_btn_0 = document.getElementById('typing-btn-0');
/** @type {HTMLButtonElement} */
const typing_btn_1 = document.getElementById('typing-btn-1');
/** @type {HTMLButtonElement} */
const typing_btn_2 = document.getElementById('typing-btn-2');
/** @type {HTMLButtonElement} */
const typing_btn_3 = document.getElementById('typing-btn-3');
/** @type {HTMLButtonElement} */
const typing_btn_4 = document.getElementById('typing-btn-4');
/** @type {HTMLButtonElement} */
const typing_btn_5 = document.getElementById('typing-btn-5');
/** @type {HTMLButtonElement} */
const typing_btn_6 = document.getElementById('typing-btn-6');
/** @type {HTMLButtonElement} */
const typing_btn_7 = document.getElementById('typing-btn-7');
/** @type {HTMLButtonElement} */
const typing_btn_8 = document.getElementById('typing-btn-8');
/** @type {HTMLButtonElement} */
const typing_btn_9 = document.getElementById('typing-btn-9');

// -------------------------------------------------------------------------- //

// --- LOCAL DEFINITIONS ---

// Constants
/** @enum {string} */
const STATE = {
    FIRST_CLEAR: 'FIRST_CLEAR',
    FIRST_TYPING: 'FIRST_TYPING',
    NEXT_CLEAR: 'NEXT_CLEAR',
    NEXT_TYPING: 'NEXT_TYPING',
    FINISHED: 'FINISHED',
};
/** @enum {string} */
const ACTION = {
    CLEAR_DISPLAY: 'CLEAR_DISPLAY',
    RESET_SYSTEM: 'RESET_SYSTEM',
    DELETE_CHARACTER: 'DELETE_CHARACTER',
    SELECT_OPERATION: 'SELECT_OPERATION',
    TYPE_CHARACTER: 'TYPE_CHARACTER',
    FINISH_CALCULI: 'FINISH_CALCULI',
};
/** @enum {string} */
const EVENT = {
    CLICK: 'click',
    CHANGE: 'change',
};
/** @type {STATE} */
const DEFAULT_STATE = STATE.FIRST_CLEAR;

// Variables
/** @type {STATE} */
let current_state = DEFAULT_STATE;
/** @type {ACTION} */
let current_action = null;
/** @type {HTMLInputElement | HTMLButtonElement} */
let current_trigger = null;
/** @type {string} */
let displayed_number = '';
/** @type {string} */
let displayed_operation = '';
/** @type {boolean} */
let wrong_trigger = false;
/** @type {boolean} */
let wrong_action = false;

// Functions
/**
 * @param {ACTION} action - the action to be executed by the event
 * @param {HTMLInputElement | HTMLButtonElement} trigger - the trigger that activated the event
 */
function eventsHandler(action, trigger) {
    current_action = action;
    current_trigger = trigger;

    updateState();
    updateInternals(action, trigger);
    updateExternals();

    current_action = null;
    current_trigger = null;
}

/**
 *
 */
function updateState() {
    switch (current_state) {
        case STATE.FIRST_CLEAR:
            if (current_action === ACTION.TYPE_CHARACTER) {
                current_state = STATE.FIRST_TYPING;
                break;
            }
            break;

        case STATE.FIRST_TYPING:
            if (current_action === ACTION.RESET_SYSTEM) {
                current_state = STATE.FIRST_CLEAR;
                break;
            }
            if (current_action === ACTION.CLEAR_DISPLAY) {
                current_state = STATE.FIRST_CLEAR;
                break;
            }
            if (current_action === ACTION.DELETE_CHARACTER) {
                if (displayed_number === '') {
                    current_state = STATE.FIRST_CLEAR;
                }
                break;
            }
            if (current_action === ACTION.SELECT_OPERATION) {
                current_state = STATE.NEXT_CLEAR;
                break;
            }
            break;

        case STATE.NEXT_CLEAR:
            if (current_action === ACTION.RESET_SYSTEM) {
                current_state = STATE.FIRST_CLEAR;
                break;
            }
            if (current_action === ACTION.TYPE_CHARACTER) {
                current_state = STATE.NEXT_TYPING;
                break;
            }
            break;

        case STATE.NEXT_TYPING:
            if (current_action === ACTION.RESET_SYSTEM) {
                current_state = STATE.FIRST_CLEAR;
                break;
            }
            if (current_action === ACTION.CLEAR_DISPLAY) {
                current_state = STATE.NEXT_CLEAR;
                break;
            }
            if (current_action === ACTION.DELETE_CHARACTER) {
                if (displayed_number === '') {
                    current_state = STATE.NEXT_CLEAR;
                }
                break;
            }
            if (current_action === ACTION.SELECT_OPERATION) {
                current_state = STATE.NEXT_CLEAR;
                break;
            }
            if (current_action === ACTION.FINISH_CALCULI) {
                current_state = STATE.FINISHED;
                break;
            }
            break;

        case STATE.FINISHED:
            if (current_action === ACTION.RESET_SYSTEM) {
                current_state = STATE.FIRST_CLEAR;
                break;
            }
            break;
    }
}

/**
 * @param {ACTION} action - the action to be executed by the event
 * @param {HTMLInputElement | HTMLButtonElement} trigger - the trigger that activated the event
 */
function updateInternals(action, trigger) {
    if (wrong_trigger) {
        return;
    }
    if (wrong_action) {
        return;
    }

    switch (current_state) {
        case STATE.FIRST_CLEAR:
            displayed_number = '';
            displayed_operation = '';
            break;
        case STATE.FIRST_TYPING:
            displayed_number = display_number;
            displayed_operation = '';
            break;
        case STATE.NEXT_CLEAR:
            displayed_number = '';
            displayed_operation = display_operation;
            break;
        case STATE.NEXT_TYPING:
            displayed_number = display_number;
            displayed_operation = display_operation;
            break;
        case STATE.FINISHED:
            displayed_number = display_number;
            displayed_operation = display_operation;
            break;
    }
}

/**
 *
 */
function updateExternals() {
    if (wrong_trigger) {
        return;
    }
    if (wrong_action) {
        return;
    }

    switch (current_state) {
        case STATE.FIRST_CLEAR:
            display_number.textContent = '';
            display_operation.textContent = '';
            action_btn_rst.disabled = true;
            action_btn_cln.disabled = true;
            action_btn_del.disabled = true;
            action_btn_eql.disabled = true;
            typing_btn_dot.disabled = false;
            typing_btn_0.disabled = false;
            typing_btn_1.disabled = false;
            typing_btn_2.disabled = false;
            typing_btn_3.disabled = false;
            typing_btn_4.disabled = false;
            typing_btn_5.disabled = false;
            typing_btn_6.disabled = false;
            typing_btn_7.disabled = false;
            typing_btn_8.disabled = false;
            typing_btn_9.disabled = false;
            action_btn_add.disabled = true;
            action_btn_sub.disabled = true;
            action_btn_prd.disabled = true;
            action_btn_div.disabled = true;
            break;

        case STATE.FIRST_TYPING:
            display_number.textContent = displayed_number;
            display_operation.textContent = '';
            action_btn_rst.disabled = false;
            action_btn_cln.disabled = false;
            action_btn_del.disabled = false;
            action_btn_eql.disabled = true;
            typing_btn_dot.disabled = false;
            typing_btn_0.disabled = false;
            typing_btn_1.disabled = false;
            typing_btn_2.disabled = false;
            typing_btn_3.disabled = false;
            typing_btn_4.disabled = false;
            typing_btn_5.disabled = false;
            typing_btn_6.disabled = false;
            typing_btn_7.disabled = false;
            typing_btn_8.disabled = false;
            typing_btn_9.disabled = false;
            action_btn_add.disabled = false;
            action_btn_sub.disabled = false;
            action_btn_prd.disabled = false;
            action_btn_div.disabled = false;
            break;

        case STATE.NEXT_CLEAR:
            display_number.textContent = '';
            display_operation.textContent = displayed_operation;
            action_btn_rst.disabled = false;
            action_btn_cln.disabled = true;
            action_btn_del.disabled = true;
            action_btn_eql.disabled = true;
            typing_btn_dot.disabled = false;
            typing_btn_0.disabled = false;
            typing_btn_1.disabled = false;
            typing_btn_2.disabled = false;
            typing_btn_3.disabled = false;
            typing_btn_4.disabled = false;
            typing_btn_5.disabled = false;
            typing_btn_6.disabled = false;
            typing_btn_7.disabled = false;
            typing_btn_8.disabled = false;
            typing_btn_9.disabled = false;
            action_btn_add.disabled = true;
            action_btn_sub.disabled = true;
            action_btn_prd.disabled = true;
            action_btn_div.disabled = true;
            break;

        case STATE.NEXT_TYPING:
            display_number.textContent = displayed_number;
            display_operation.textContent = displayed_operation;
            action_btn_rst.disabled = false;
            action_btn_cln.disabled = false;
            action_btn_del.disabled = false;
            action_btn_eql.disabled = false;
            typing_btn_dot.disabled = false;
            typing_btn_0.disabled = false;
            typing_btn_1.disabled = false;
            typing_btn_2.disabled = false;
            typing_btn_3.disabled = false;
            typing_btn_4.disabled = false;
            typing_btn_5.disabled = false;
            typing_btn_6.disabled = false;
            typing_btn_7.disabled = false;
            typing_btn_8.disabled = false;
            typing_btn_9.disabled = false;
            action_btn_add.disabled = false;
            action_btn_sub.disabled = false;
            action_btn_prd.disabled = false;
            action_btn_div.disabled = false;
            break;

        case STATE.FINISHED:
            display_number.textContent = displayed_number;
            display_operation.textContent = displayed_operation;
            action_btn_rst.disabled = false;
            action_btn_cln.disabled = true;
            action_btn_del.disabled = true;
            action_btn_eql.disabled = true;
            typing_btn_dot.disabled = true;
            typing_btn_0.disabled = true;
            typing_btn_1.disabled = true;
            typing_btn_2.disabled = true;
            typing_btn_3.disabled = true;
            typing_btn_4.disabled = true;
            typing_btn_5.disabled = true;
            typing_btn_6.disabled = true;
            typing_btn_7.disabled = true;
            typing_btn_8.disabled = true;
            typing_btn_9.disabled = true;
            action_btn_add.disabled = true;
            action_btn_sub.disabled = true;
            action_btn_prd.disabled = true;
            action_btn_div.disabled = true;
            break;
    }
}

/**
 *
 * @param {HTMLInputElement | HTMLButtonElement} trigger - the trigger that activated the event
 */
function printChar(trigger) {}

// -------------------------------------------------------------------------- //

// --- EVENT HANDLING ---

// Typing buttons
typing_btn_0.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_CHARACTER, typing_btn_0));
typing_btn_1.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_CHARACTER, typing_btn_1));
typing_btn_2.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_CHARACTER, typing_btn_2));
typing_btn_3.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_CHARACTER, typing_btn_3));
typing_btn_4.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_CHARACTER, typing_btn_4));
typing_btn_5.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_CHARACTER, typing_btn_5));
typing_btn_6.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_CHARACTER, typing_btn_6));
typing_btn_7.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_CHARACTER, typing_btn_7));
typing_btn_8.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_CHARACTER, typing_btn_8));
typing_btn_9.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_CHARACTER, typing_btn_9));
typing_btn_dot.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_CHARACTER, typing_btn_dot));

// Action buttons
action_btn_cln.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.CLEAR_DISPLAY, action_btn_cln));
action_btn_eql.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.RESET_SYSTEM, action_btn_eql));
action_btn_rst.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.RESET_SYSTEM, action_btn_rst));
action_btn_del.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.DELETE_CHARACTER, action_btn_del));

action_btn_div.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.SELECT_OPERATION, action_btn_div));
action_btn_prd.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.SELECT_OPERATION, action_btn_prd));
action_btn_sub.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.SELECT_OPERATION, action_btn_sub));
action_btn_add.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.SELECT_OPERATION, action_btn_add));

// -------------------------------------------------------------------------- //

// --- INCIALIZE INTERFACE ---
updateExternals();

// -------------------------------------------------------------------------- //
