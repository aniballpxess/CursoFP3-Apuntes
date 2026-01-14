/* eslint-disable no-console */
/* eslint-disable no-self-assign */

// --- UI ELEMENTS ---

// Viewers
/** @type {HTMLDivElement} */
const history_viewer = document.getElementById('history-view');

// Displays
/** @type {HTMLSpanElement} */
const operation_display = document.getElementById('operation-display');
/** @type {HTMLSpanElement} */
const number_display = document.getElementById('number-display');

// Action buttons
/** @type {HTMLButtonElement} */
const action_btn_clr = document.getElementById('action-btn-clr');
/** @type {HTMLButtonElement} */
const action_btn_rst = document.getElementById('action-btn-rst');
/** @type {HTMLButtonElement} */
const action_btn_del = document.getElementById('action-btn-del');

/** @type {HTMLButtonElement} */
const action_btn_eql = document.getElementById('action-btn-eql');
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
const typing_btn_dot = document.getElementById('typing-btn-d');
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
    TYPE_CHARACTER: 'TYPE_CHARACTER',
    RESET_SYSTEM: 'RESET_SYSTEM',
    CLEAR_NUMBER_DISPLAY: 'CLEAR_NUMBER',
    DELETE_CHARACTER: 'DELETE_CHARACTER',
    SELECT_OPERAND: 'SELECT_OPERAND',
    FINISH_OPERATIONS: 'FINISH_OPERATIONS',
};
/** @enum {string} */
const EVENT = {
    CLICK: 'click',
    CHANGE: 'change',
};
/** @enum {string} */
const CHARACTER = {
    ONE: '1',
    TWO: '2',
    THREE: '3',
    FOUR: '4',
    FIVE: '5',
    SIX: '6',
    SEVEN: '7',
    EIGHT: '8',
    NINE: '9',
    ZERO: '0',
    DOT: '.',
};
/** @enum {string} */
const OPERAND = {
    ADDITION: '+',
    SUBTRACTION: '-',
    PRODUCT: 'x',
    DIVISION: '/',
    EQUAL: '=',
};
/** @type {STATE} */
const DEFAULT_STATE = STATE.FIRST_CLEAR;

// Variables
/** @type {STATE} */
let current_state = null;
/** @type {ACTION} */
let current_action = null;
/** @type {HTMLInputElement | HTMLButtonElement} */
let current_trigger = null;

/** @type {boolean} */
let wrong_trigger = false;
/** @type {boolean} */
let wrong_action = false;

/** @type {OPERAND} */
let current_operand = null;
/** @type {OPERAND} */
let next_operand = null;
/** @type {number} */
let first_number = 0;
/** @type {number} */
let second_number = 0;
/** @type {number} */
let result = 0;

/** @type {string} */
let displayed_number = '';
/** @type {string} */
let displayed_operation = '';

// Functions
/**
 * @param {ACTION} action - the action to be executed by the event
 * @param {HTMLInputElement | HTMLButtonElement} trigger - the trigger that activated the event
 */
function eventsHandler(action, trigger) {
    current_action = action;
    current_trigger = trigger;

    runAction();
    updateState();
    updateExternals();

    current_action = null;
    current_trigger = null;
}

/**
 *
 */
function runAction() {
    switch (current_action) {
        case ACTION.TYPE_CHARACTER:
            printCharacter();
            break;

        case ACTION.RESET_SYSTEM:
            first_number = null;
            second_number = null;
            result = null;
            current_operand = null;
            next_operand = null;
            history_viewer.replaceChildren();
            displayed_number = '';
            displayed_operation = '';
            break;

        case ACTION.CLEAR_NUMBER_DISPLAY:
            displayed_number = '';
            break;

        case ACTION.DELETE_CHARACTER:
            displayed_number = displayed_number.slice(0, -1);
            break;

        case ACTION.SELECT_OPERAND:
            getNextOperand();
            doCurrentOperation();
            recordOperation();
            displayed_operation = `${result} ${next_operand}`;
            displayed_number = '';
            break;

        case ACTION.FINISH_OPERATIONS:
            getNextOperand();
            doCurrentOperation();
            recordOperation();
            displayed_operation = `${first_number} ${current_operand} ${second_number} =`;
            displayed_number = result;
            break;
    }
}

/**
 *
 */
function printCharacter() {
    let typed_character;
    switch (current_trigger) {
        case typing_btn_0:
            typed_character = CHARACTER.ZERO;
            break;
        case typing_btn_1:
            typed_character = CHARACTER.ONE;
            break;
        case typing_btn_2:
            typed_character = CHARACTER.TWO;
            break;
        case typing_btn_3:
            typed_character = CHARACTER.THREE;
            break;
        case typing_btn_4:
            typed_character = CHARACTER.FOUR;
            break;
        case typing_btn_5:
            typed_character = CHARACTER.FIVE;
            break;
        case typing_btn_6:
            typed_character = CHARACTER.SIX;
            break;
        case typing_btn_7:
            typed_character = CHARACTER.SEVEN;
            break;
        case typing_btn_8:
            typed_character = CHARACTER.EIGHT;
            break;
        case typing_btn_9:
            typed_character = CHARACTER.NINE;
            break;
        case typing_btn_dot:
            typed_character = CHARACTER.DOT;
            break;
        default:
            typed_character = '';
            break;
    }
    displayed_number = displayed_number + typed_character;
}

/**
 *
 */
function getNextOperand() {
    current_operand = next_operand;
    switch (current_trigger) {
        case action_btn_add:
            next_operand = OPERAND.ADDITION;
            break;
        case action_btn_sub:
            next_operand = OPERAND.SUBTRACTION;
            break;
        case action_btn_prd:
            next_operand = OPERAND.PRODUCT;
            break;
        case action_btn_div:
            next_operand = OPERAND.DIVISION;
            break;
        case action_btn_eql:
            next_operand = OPERAND.EQUAL;
            break;
    }
}

/**
 *
 */
function doCurrentOperation() {
    if (current_operand === null) {
        result = Number.parseFloat(displayed_number);
        return;
    }
    first_number = result;
    second_number = Number.parseFloat(displayed_number);
    switch (current_operand) {
        case OPERAND.ADDITION:
            result = first_number + second_number;
            break;
        case OPERAND.SUBTRACTION:
            result = first_number - second_number;
            break;
        case OPERAND.PRODUCT:
            result = first_number * second_number;
            break;
        case OPERAND.DIVISION:
            result = first_number / second_number;
            break;
    }
}

/**
 *
 */
function recordOperation() {
    if (current_operand === null) {
        return;
    }
    const record = document.createElement('div');
    record.classList.add('record');
    record.textContent = `${first_number} ${current_operand} ${second_number} = ${result}`;
    history_viewer.appendChild(record);
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
            if (current_action === ACTION.CLEAR_NUMBER_DISPLAY) {
                current_state = STATE.FIRST_CLEAR;
                break;
            }
            if (current_action === ACTION.DELETE_CHARACTER) {
                if (displayed_number === '') {
                    current_state = STATE.FIRST_CLEAR;
                }
                break;
            }
            if (current_action === ACTION.SELECT_OPERAND) {
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
            if (current_action === ACTION.CLEAR_NUMBER_DISPLAY) {
                current_state = STATE.NEXT_CLEAR;
                break;
            }
            if (current_action === ACTION.DELETE_CHARACTER) {
                if (displayed_number === '') {
                    current_state = STATE.NEXT_CLEAR;
                }
                break;
            }
            if (current_action === ACTION.SELECT_OPERAND) {
                current_state = STATE.NEXT_CLEAR;
                break;
            }
            if (current_action === ACTION.FINISH_OPERATIONS) {
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
 *
 */
function updateExternals() {
    switch (current_state) {
        case STATE.FIRST_CLEAR:
            operation_display.textContent = displayed_operation;
            number_display.textContent = displayed_number;
            action_btn_rst.disabled = true;
            action_btn_clr.disabled = true;
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
            operation_display.textContent = displayed_number;
            number_display.textContent = displayed_number;
            action_btn_rst.disabled = false;
            action_btn_clr.disabled = false;
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
            operation_display.textContent = displayed_operation;
            number_display.textContent = displayed_number;
            action_btn_rst.disabled = false;
            action_btn_clr.disabled = true;
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
            operation_display.textContent = displayed_operation;
            number_display.textContent = displayed_number;
            action_btn_rst.disabled = false;
            action_btn_clr.disabled = false;
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
            operation_display.textContent = displayed_operation;
            number_display.textContent = displayed_number;
            action_btn_rst.disabled = false;
            action_btn_clr.disabled = true;
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
action_btn_clr.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.CLEAR_NUMBER_DISPLAY, action_btn_clr));
action_btn_eql.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.FINISH_OPERATIONS, action_btn_eql));
action_btn_rst.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.RESET_SYSTEM, action_btn_rst));
action_btn_del.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.DELETE_CHARACTER, action_btn_del));

action_btn_div.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.SELECT_OPERAND, action_btn_div));
action_btn_prd.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.SELECT_OPERAND, action_btn_prd));
action_btn_sub.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.SELECT_OPERAND, action_btn_sub));
action_btn_add.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.SELECT_OPERAND, action_btn_add));

// -------------------------------------------------------------------------- //

// --- INCIALIZE INTERFACE ---
current_state = DEFAULT_STATE;
updateExternals();

// -------------------------------------------------------------------------- //

// --- TESTING ---

/**
 * TODO - See if needed at all
 */
function updateInternals() {
    switch (current_state) {
        case STATE.FIRST_CLEAR:
            break;
        case STATE.FIRST_TYPING:
            break;
        case STATE.NEXT_CLEAR:
            break;
        case STATE.NEXT_TYPING:
            break;
        case STATE.FINISHED:
            break;
    }
}
