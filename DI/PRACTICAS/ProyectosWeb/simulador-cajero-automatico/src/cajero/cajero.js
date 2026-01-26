/* eslint-disable no-self-assign */

// --- UI ELEMENTS ---

// Display parts
/** @type {HTMLDivElement} */
const label_check = document.getElementById('dis-lbl-check');
/** @type {HTMLDivElement} */
const label_take = document.getElementById('dis-lbl-take');
/** @type {HTMLDivElement} */
const label_exit = document.getElementById('dis-lbl-exit');
/** @type {HTMLDivElement} */
const main_text = document.getElementById('dis-txt-main');

// Special buttons
/** @type {HTMLButtonElement} */
const sim_btn_card = document.getElementById('sim-btn-card');
/** @type {HTMLButtonElement} */
const sim_btn_money = document.getElementById('sim-btn-money');
/** @type {HTMLButtonElement} */
const act_btn_history = document.getElementById('act-btn-history');

// Display buttons
/** @type {HTMLButtonElement} */
const act_btn_check = document.getElementById('act-btn-check');
/** @type {HTMLButtonElement} */
const act_btn_take = document.getElementById('act-btn-take');
/** @type {HTMLButtonElement} */
const act_btn_exit = document.getElementById('act-btn-exit');

// Numpad buttons
/** @type {HTMLButtonElement} */
const act_btn_next = document.getElementById('act-btn-next');
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
    AWAIT_CARD_IN: 'AWAIT_CARD_IN',
    SELECTING_OPERATION: 'SELECT_OPERATION',
    CHECKING_BALANCE: 'CHECKING_BALANCE',
    TAKING_OUT_MONEY: 'TAKING_OUT_MONEY',
    AWAIT_MONEY_WITHDRAW: 'AWAIT_MONEY_WITHDRAW',
    AWAIT_CARD_OUT: 'AWAIT_CARD_OUT',
};
/** @enum {string} */
const ACTION = {
    OPEN_HISTORY: 'OPEN_HISTORY',
    CARD_ACTION: 'CARD_ACTION',
    CHECK_BALANCE: 'CHECK_BALANCE',
    TAKE_OUT_MONEY: 'TAKE_OUT_MONEY',
    EXIT: 'EXIT',
    TYPE_DIGIT: 'TYPE_DIGIT',
    CONFIRM_AMOUNT: 'CONFIRM_AMOUNT',
    WITHDRAW_MONEY: 'WITHDRAW_MONEY',
};
/** @enum {string} */
const EVENT = {
    CLICK: 'click',
    CHANGE: 'change',
};
/** @enum {string} */
const DIGIT = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NINE: 9,
    ZERO: 0,
};
/** @type {STATE} */
const DEFAULT_STATE = STATE.AWAIT_CARD_IN;

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

/** @type {number} */
let balance = 1000;
/** @type {number} */
let withdrawal_amount = 0;
/** @type {string} */
let displayed_text = '';

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
    updateInternals();
    updateExternals();

    current_action = null;
    current_trigger = null;
}

/**
 *
 */
function runAction() {
    switch (current_action) {
        case ACTION.OPEN_HISTORY:
            openHistoryTab();
            break;

        case ACTION.CARD_ACTION:
            break;

        case ACTION.CHECK_BALANCE:
            registerAction();
            break;

        case ACTION.TAKE_OUT_MONEY:
            break;

        case ACTION.EXIT:
            break;

        case ACTION.TYPE_DIGIT:
            getDigit();
            break;

        case ACTION.CONFIRM_AMOUNT:
            balance = balance - withdrawal_amount;
            registerAction();
            break;

        case ACTION.WITHDRAW_MONEY:
            break;
    }
}

function openHistoryTab() {
    // Window.prototype.document.open();
}

function registerAction() {
    // Window.prototype.localStorage.setItem();
}

/**
 *
 */
function getDigit() {
    let typed_digit;
    switch (current_trigger) {
        case typing_btn_0:
            typed_digit = DIGIT.ZERO;
            break;
        case typing_btn_1:
            typed_digit = DIGIT.ONE;
            break;
        case typing_btn_2:
            typed_digit = DIGIT.TWO;
            break;
        case typing_btn_3:
            typed_digit = DIGIT.THREE;
            break;
        case typing_btn_4:
            typed_digit = DIGIT.FOUR;
            break;
        case typing_btn_5:
            typed_digit = DIGIT.FIVE;
            break;
        case typing_btn_6:
            typed_digit = DIGIT.SIX;
            break;
        case typing_btn_7:
            typed_digit = DIGIT.SEVEN;
            break;
        case typing_btn_8:
            typed_digit = DIGIT.EIGHT;
            break;
        case typing_btn_9:
            typed_digit = DIGIT.NINE;
            break;
        default:
            typed_digit = null;
            break;
    }
    if (typed_digit !== null) {
        withdrawal_amount = withdrawal_amount * 10 + typed_digit;
    }
}

/**
 *
 */
function updateState() {
    switch (current_state) {
        case STATE.AWAIT_CARD_IN:
            if (current_action === ACTION.CARD_ACTION) {
                current_state = STATE.SELECTING_OPERATION;
                break;
            }
            break;

        case STATE.SELECTING_OPERATION:
            if (current_action === ACTION.CHECK_BALANCE) {
                current_state = STATE.CHECKING_BALANCE;
                break;
            }
            if (current_action === ACTION.TAKE_OUT_MONEY) {
                current_state = STATE.TAKING_OUT_MONEY;
                break;
            }
            if (current_action === ACTION.EXIT) {
                current_state = STATE.AWAIT_CARD_OUT;
                break;
            }
            break;

        case STATE.CHECKING_BALANCE:
            if (current_action === ACTION.EXIT) {
                current_state = STATE.SELECTING_OPERATION;
                break;
            }
            break;

        case STATE.TAKING_OUT_MONEY:
            if (current_action === ACTION.EXIT) {
                current_state = STATE.SELECTING_OPERATION;
                break;
            }
            if (current_action === ACTION.CONFIRM_AMOUNT) {
                current_state = STATE.AWAIT_MONEY_WITHDRAW;
                break;
            }
            break;

        case STATE.AWAIT_MONEY_WITHDRAW:
            if (current_action === ACTION.WITHDRAW_MONEY) {
                current_state = STATE.SELECTING_OPERATION;
                break;
            }
            break;
        case STATE.AWAIT_CARD_OUT:
            if (current_action === ACTION.CARD_ACTION) {
                current_state = STATE.AWAIT_CARD_IN;
            }
            break;
    }
}

/**
 *
 */
function updateInternals() {
    switch (current_state) {
        case STATE.AWAIT_CARD_IN:
            balance = balance;
            withdrawal_amount = 0;
            displayed_text = 'Introduzca tarjeta';
            break;

        case STATE.SELECTING_OPERATION:
            balance = balance;
            withdrawal_amount = 0;
            displayed_text = 'Seleccione operación';
            break;

        case STATE.CHECKING_BALANCE:
            balance = balance;
            withdrawal_amount = 0;
            displayed_text = `Saldo<br />${balance} €`;
            break;

        case STATE.TAKING_OUT_MONEY:
            balance = balance;
            withdrawal_amount = withdrawal_amount;
            displayed_text = `Introduzca importe y pulse [->]<br />${withdrawal_amount} €`;
            break;

        case STATE.AWAIT_MONEY_WITHDRAW:
            balance = balance;
            withdrawal_amount = 0;
            displayed_text = 'Retire dinero';
            break;

        case STATE.AWAIT_CARD_OUT:
            balance = balance;
            withdrawal_amount = 0;
            displayed_text = 'Extraiga tarjeta';
            break;
    }
}

/**
 *
 */
function updateExternals() {
    switch (current_state) {
        case STATE.AWAIT_CARD_IN:
            label_check.hidden = true;
            label_take.hidden = true;
            label_exit.hidden = true;
            main_text.innerHTML = displayed_text;

            act_btn_check.disabled = true;
            act_btn_take.disabled = true;
            act_btn_exit.disabled = true;

            sim_btn_card.disabled = false;
            sim_btn_money.disabled = true;

            act_btn_next.disabled = true;
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

            act_btn_history.disabled = false;
            break;

        case STATE.SELECTING_OPERATION:
            label_check.hidden = false;
            label_take.hidden = false;
            label_exit.hidden = false;
            main_text.innerHTML = displayed_text;

            act_btn_check.disabled = false;
            act_btn_take.disabled = false;
            act_btn_exit.disabled = false;

            sim_btn_card.disabled = true;
            sim_btn_money.disabled = true;

            act_btn_next.disabled = true;
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

            act_btn_history.disabled = false;
            break;

        case STATE.CHECKING_BALANCE:
            label_check.hidden = true;
            label_take.hidden = true;
            label_exit.hidden = false;
            main_text.innerHTML = displayed_text;

            act_btn_check.disabled = true;
            act_btn_take.disabled = true;
            act_btn_exit.disabled = false;

            sim_btn_card.disabled = true;
            sim_btn_money.disabled = true;

            act_btn_next.disabled = true;
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

            act_btn_history.disabled = false;
            break;

        case STATE.TAKING_OUT_MONEY:
            label_check.hidden = true;
            label_take.hidden = true;
            label_exit.hidden = false;
            main_text.innerHTML = displayed_text;

            act_btn_check.disabled = true;
            act_btn_take.disabled = true;
            act_btn_exit.disabled = false;

            sim_btn_card.disabled = true;
            sim_btn_money.disabled = true;

            act_btn_next.disabled = false;
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

            act_btn_history.disabled = false;
            break;

        case STATE.AWAIT_MONEY_WITHDRAW:
            label_check.hidden = true;
            label_take.hidden = true;
            label_exit.hidden = true;
            main_text.innerHTML = displayed_text;

            act_btn_check.disabled = true;
            act_btn_take.disabled = true;
            act_btn_exit.disabled = true;

            sim_btn_card.disabled = true;
            sim_btn_money.disabled = false;

            act_btn_next.disabled = true;
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

            act_btn_history.disabled = false;
            break;

        case STATE.AWAIT_CARD_OUT:
            label_check.hidden = true;
            label_take.hidden = true;
            label_exit.hidden = true;
            main_text.innerHTML = displayed_text;

            act_btn_check.disabled = true;
            act_btn_take.disabled = true;
            act_btn_exit.disabled = true;

            sim_btn_card.disabled = false;
            sim_btn_money.disabled = true;

            act_btn_next.disabled = true;
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

            act_btn_history.disabled = false;
            break;
    }
}

// -------------------------------------------------------------------------- //

// --- EVENT HANDLING ---

// Special buttons
sim_btn_card.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.CARD_ACTION, sim_btn_card));
sim_btn_money.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.WITHDRAW_MONEY, sim_btn_money));
act_btn_history.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.OPEN_HISTORY, act_btn_history));

// Display buttons
act_btn_check.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.CHECK_BALANCE, act_btn_check));
act_btn_take.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TAKE_OUT_MONEY, act_btn_take));
act_btn_exit.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.EXIT, act_btn_exit));

// Numpad buttons
act_btn_next.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.CONFIRM_AMOUNT, act_btn_next));
typing_btn_0.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_DIGIT, typing_btn_0));
typing_btn_1.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_DIGIT, typing_btn_1));
typing_btn_2.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_DIGIT, typing_btn_2));
typing_btn_3.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_DIGIT, typing_btn_3));
typing_btn_4.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_DIGIT, typing_btn_4));
typing_btn_5.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_DIGIT, typing_btn_5));
typing_btn_6.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_DIGIT, typing_btn_6));
typing_btn_7.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_DIGIT, typing_btn_7));
typing_btn_8.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_DIGIT, typing_btn_8));
typing_btn_9.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE_DIGIT, typing_btn_9));

// -------------------------------------------------------------------------- //

// --- INCIALIZE INTERFACE ---
current_state = DEFAULT_STATE;
updateInternals();
updateExternals();

// -------------------------------------------------------------------------- //

// --- TESTING ---
