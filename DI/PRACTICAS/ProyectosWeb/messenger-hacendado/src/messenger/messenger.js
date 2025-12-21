/* eslint-disable no-console */
/* eslint-disable no-self-assign */

// --- UI ELEMENTS ---

// Displays
/** @type {HTMLInputElement} */
const display_input = document.getElementById('display-input');
/** @type {HTMLInputElement} */
const display_submit = document.getElementById('display-submit');

// Numpad buttons
/** @type {HTMLButtonElement} */
const numpad_btn_1 = document.getElementById('numpad-1');
/** @type {HTMLButtonElement} */
const numpad_btn_2 = document.getElementById('numpad-2');
/** @type {HTMLButtonElement} */
const numpad_btn_3 = document.getElementById('numpad-3');
/** @type {HTMLButtonElement} */
const numpad_btn_4 = document.getElementById('numpad-4');
/** @type {HTMLButtonElement} */
const numpad_btn_5 = document.getElementById('numpad-5');
/** @type {HTMLButtonElement} */
const numpad_btn_6 = document.getElementById('numpad-6');
/** @type {HTMLButtonElement} */
const numpad_btn_7 = document.getElementById('numpad-7');
/** @type {HTMLButtonElement} */
const numpad_btn_8 = document.getElementById('numpad-8');
/** @type {HTMLButtonElement} */
const numpad_btn_9 = document.getElementById('numpad-9');
/** @type {HTMLButtonElement} */
const numpad_btn_0 = document.getElementById('numpad-0');

// Action buttons
/** @type {HTMLButtonElement} */
const action_btn_c = document.getElementById('action-clear');
/** @type {HTMLButtonElement} */
const action_btn_s = document.getElementById('action-submit');

// On/Off buttons
/** @type {HTMLInputElement} */
const power_on = document.getElementById('power-on');
/** @type {HTMLInputElement} */
const power_off = document.getElementById('power-off');

// -------------------------------------------------------------------------- //

// --- LOCAL DEFINITIONS ---

// Constants
/** @enum {string} */
const STATE = {
    OFF: 'OFF',
    CLEAR: 'CLEAR',
    TYPING: 'TYPING',
    SENT: 'SENT',
};
/** @enum {string} */
const ACTION = {
    POWER_ON: 'POWER_ON',
    POWER_OFF: 'POWER_OFF',
    TYPE: 'TYPE',
    CLEAR_DISPLAY: 'CLEAR_DISPLAY',
    SEND_MESSAGE: 'SEND_MESSAGE',
};
/** @enum {string} */
const EVENT = {
    CLICK: 'click',
    CHANGE: 'change',
};
/** @type {STATE} */
const DEFAULT_STATE = STATE.OFF;
/** @type {number} */
const TRIGGER_TIMEOUT = 750;

// Variables
/** @type {STATE} */
let current_state = STATE.OFF;
/** @type {string} */
let typed_message = '';
/** @type {HTMLInputElement | HTMLButtonElement} */
let last_trigger = null;
/** @type {number} */
let char_index = 0;
/** @type {number} */
let trigger_timer = null;
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
    wrong_trigger = false;
    wrong_action = false;

    checkTrigger(trigger);
    checkAction(action);
    updateState(action);
    updateInternals(action, trigger);
    updateExternals();
}

/**
 * @param {HTMLInputElement | HTMLButtonElement} trigger - trigger to be checked
 */
function checkTrigger(trigger) {
    switch (trigger) {
        case numpad_btn_0:
        case numpad_btn_1:
        case numpad_btn_2:
        case numpad_btn_3:
        case numpad_btn_4:
        case numpad_btn_5:
        case numpad_btn_6:
        case numpad_btn_7:
        case numpad_btn_8:
        case numpad_btn_9:
        case action_btn_c:
        case action_btn_s:
        case power_on:
        case power_off:
            wrong_trigger = false;
            break;
        default:
            wrong_trigger = true;
            console.error(`ERROR || Wrong trigger || Trigger '${trigger.id}' not recognized as a valid trigger`);
            break;
    }
}

/**
 * @param {ACTION} action - action to be checked
 */
function checkAction(action) {
    switch (action) {
        case ACTION.POWER_ON:
        case ACTION.POWER_OFF:
        case ACTION.TYPE:
        case ACTION.CLEAR_DISPLAY:
        case ACTION.SEND_MESSAGE:
            wrong_action = false;
            break;
        default:
            wrong_action = true;
            console.error(`ERROR || Wrong action || Action '${action}' not recognized as a valid action`);
            break;
    }
}

/**
 * @param {ACTION} action - action to be executed
 */
function updateState(action) {
    if (wrong_trigger) {
        return;
    }
    if (wrong_action) {
        return;
    }

    switch (current_state) {
        case STATE.OFF:
            if (action === ACTION.POWER_ON) {
                current_state = STATE.CLEAR;
                break;
            }
            wrong_action = true;
            console.error(`ERROR || Wrong action-state relation || Action '${action}' should not have been activated.`);
            break;

        case STATE.CLEAR:
            if (action === ACTION.POWER_OFF) {
                current_state = STATE.OFF;
                break;
            }
            if (action === ACTION.TYPE) {
                current_state = STATE.TYPING;
                break;
            }
            wrong_action = true;
            console.error(`ERROR || Wrong action-state relation || Action '${action}' should not have been activated.`);
            break;

        case STATE.TYPING:
            if (action === ACTION.POWER_OFF) {
                current_state = STATE.OFF;
                break;
            }
            if (action === ACTION.TYPE) {
                current_state = STATE.TYPING;
                break;
            }
            if (action === ACTION.CLEAR_DISPLAY) {
                current_state = STATE.CLEAR;
                break;
            }
            if (action === ACTION.SEND_MESSAGE) {
                current_state = STATE.SENT;
                break;
            }
            wrong_action = true;
            console.error(`ERROR || Wrong action-state relation || Action '${action}' should not have been activated.`);
            break;

        case STATE.SENT:
            if (action === ACTION.POWER_OFF) {
                current_state = STATE.OFF;
                break;
            }
            wrong_action = true;
            console.error(`ERROR || Wrong action-state relation || Action '${action}' should not have been activated.`);
            break;

        default:
            console.error(`ERROR || Invalid state || Invalid state reached, current state value: '${current_state}'`);
            current_state = DEFAULT_STATE;
            console.warn(`WARNING || Reverting state || Reverting to default state: '${DEFAULT_STATE}'`);
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
        case STATE.OFF:
            typed_message = '';
            last_trigger = null;
            break;
        case STATE.CLEAR:
            typed_message = '';
            last_trigger = null;
            break;
        case STATE.TYPING:
            printChar(trigger);
            break;
        case STATE.SENT:
            typed_message = typed_message;
            last_trigger = null;
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
        case STATE.OFF:
            display_input.value = '';
            display_submit.value = '';
            numpad_btn_1.disabled = true;
            numpad_btn_2.disabled = true;
            numpad_btn_3.disabled = true;
            numpad_btn_4.disabled = true;
            numpad_btn_5.disabled = true;
            numpad_btn_6.disabled = true;
            numpad_btn_7.disabled = true;
            numpad_btn_8.disabled = true;
            numpad_btn_9.disabled = true;
            numpad_btn_0.disabled = true;
            action_btn_c.disabled = true;
            action_btn_s.disabled = true;
            break;

        case STATE.CLEAR:
            display_input.value = typed_message;
            display_submit.value = '';
            numpad_btn_1.disabled = false;
            numpad_btn_2.disabled = false;
            numpad_btn_3.disabled = false;
            numpad_btn_4.disabled = false;
            numpad_btn_5.disabled = false;
            numpad_btn_6.disabled = false;
            numpad_btn_7.disabled = false;
            numpad_btn_8.disabled = false;
            numpad_btn_9.disabled = false;
            numpad_btn_0.disabled = false;
            action_btn_c.disabled = true;
            action_btn_s.disabled = true;
            break;

        case STATE.TYPING:
            display_input.value = typed_message;
            display_submit.value = '';
            numpad_btn_1.disabled = false;
            numpad_btn_2.disabled = false;
            numpad_btn_3.disabled = false;
            numpad_btn_4.disabled = false;
            numpad_btn_5.disabled = false;
            numpad_btn_6.disabled = false;
            numpad_btn_7.disabled = false;
            numpad_btn_8.disabled = false;
            numpad_btn_9.disabled = false;
            numpad_btn_0.disabled = false;
            action_btn_c.disabled = false;
            action_btn_s.disabled = false;
            break;

        case STATE.SENT:
            display_input.value = '';
            display_submit.value = typed_message;
            numpad_btn_1.disabled = true;
            numpad_btn_2.disabled = true;
            numpad_btn_3.disabled = true;
            numpad_btn_4.disabled = true;
            numpad_btn_5.disabled = true;
            numpad_btn_6.disabled = true;
            numpad_btn_7.disabled = true;
            numpad_btn_8.disabled = true;
            numpad_btn_9.disabled = true;
            numpad_btn_0.disabled = true;
            action_btn_c.disabled = true;
            action_btn_s.disabled = true;
            break;
    }
}

/**
 *
 * @param {HTMLInputElement | HTMLButtonElement} trigger - the trigger that activated the event
 */
function printChar(trigger) {
    if (trigger_timer !== null) {
        clearTimeout(trigger_timer);
    }

    if (last_trigger !== trigger) {
        last_trigger = trigger;
        char_index = 1;
    } else {
        char_index = (char_index + 1) % trigger.value.length;
        typed_message = typed_message.slice(0, -1);
    }
    typed_message = typed_message + trigger.value[char_index];

    trigger_timer = setTimeout(() => {
        last_trigger = null;
        trigger_timer = null;
    }, TRIGGER_TIMEOUT);
}

// -------------------------------------------------------------------------- //

// --- EVENT HANDLING ---

// Power switching
power_on.addEventListener(EVENT.CHANGE, () => eventsHandler(ACTION.POWER_ON, power_on));
power_off.addEventListener(EVENT.CHANGE, () => eventsHandler(ACTION.POWER_OFF, power_off));

// Numpad buttons
numpad_btn_1.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE, numpad_btn_1));
numpad_btn_2.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE, numpad_btn_2));
numpad_btn_3.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE, numpad_btn_3));
numpad_btn_4.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE, numpad_btn_4));
numpad_btn_5.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE, numpad_btn_5));
numpad_btn_6.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE, numpad_btn_6));
numpad_btn_7.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE, numpad_btn_7));
numpad_btn_8.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE, numpad_btn_8));
numpad_btn_9.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE, numpad_btn_9));
numpad_btn_0.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.TYPE, numpad_btn_0));

// Action buttons
action_btn_c.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.CLEAR_DISPLAY, action_btn_c));
action_btn_s.addEventListener(EVENT.CLICK, () => eventsHandler(ACTION.SEND_MESSAGE, action_btn_s));

// -------------------------------------------------------------------------- //

// --- INCIALIZE INTERFACE ---
power_off.checked = true;
power_on.checked = false;
updateExternals();

// -------------------------------------------------------------------------- //

// --- TESTS ---

/**
 *
 * @param {ACTION} action - the action to be executed by the event
 */
function switch_updateState(action) {
    if (wrong_trigger) {
        return;
    }
    if (wrong_action) {
        return;
    }

    switch (current_state) {
        case STATE.OFF:
            switch (action) {
                case ACTION.POWER_ON:
                    current_state = STATE.CLEAR;
                    break;
                default:
                    wrong_action = true;
                    console.error(`ERROR || Wrong action-state relation || Action '${action}' should not have been activated.`);
                    break;
            }
            break;

        case STATE.CLEAR:
            switch (action) {
                case ACTION.POWER_OFF:
                    current_state = STATE.OFF;
                    break;
                case ACTION.TYPE:
                    current_state = STATE.TYPING;
                    break;
                default:
                    wrong_action = true;
                    console.error(`ERROR || Wrong action-state relation || Action '${action}' should not have been activated.`);
                    break;
            }
            break;

        case STATE.TYPING:
            switch (action) {
                case ACTION.POWER_OFF:
                    current_state = STATE.OFF;
                    break;
                case ACTION.TYPE:
                    current_state = STATE.TYPING;
                    break;
                case ACTION.CLEAR_DISPLAY:
                    current_state = STATE.CLEAR;
                    break;
                case ACTION.SEND_MESSAGE:
                    current_state = STATE.SENT;
                    break;
                default:
                    wrong_action = true;
                    console.error(`ERROR || Wrong action-state relation || Action '${action}' should not have been activated.`);
                    break;
            }
            break;

        case STATE.SENT:
            switch (action) {
                case ACTION.POWER_OFF:
                    current_state = STATE.OFF;
                    break;
                default:
                    wrong_action = true;
                    console.error(`ERROR || Wrong action-state relation || Action '${action}' should not have been activated.`);
                    break;
            }
            break;

        default:
            console.error(`ERROR || Invalid state || Invalid state reached, current state value: '${current_state}'`);
            current_state = DEFAULT_STATE;
            console.warn(`WARNING || Reverting state || Reverting to default state: '${DEFAULT_STATE}'`);
            break;
    }
}

// --- EXPERIMENTAL ---

// Classes
/**
 * Class representing an action.
 * @class
 * @property {ACTION} type
 */
class Action {
    /**
     * Create an action.
     * @param {ACTION} type - The type of action.
     */
    constructor(type) {
        /**
         * The type of the action.
         * @type {ACTION}
         */
        this.type = type;
    }
    /**
     * @override
     * @returns {string} The string value of {@link Action.type} which corresponds to a key of {@link ACTION}
     */
    toString() {
        return Object.keys(ACTION).find(key => ACTION[key] === this.type);
    }
}
