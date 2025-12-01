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

// Enums
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

// Variables
/** @type {string} */
let typed_message = '';
/** @type {string} */
let current_state = STATE.OFF;
/** @type {boolean} */
let wrong_trigger = true;
/** @type {boolean} */
let wrong_action = true;
/** @type {boolean} */
let wrong_state = true;
/** @type {HTMLInputElement | HTMLButtonElement} */
let last_pressed_key = undefined;

// Functions
function updateInterface() {
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

// -------------------------------------------------------------------------- //

// --- EVENT HANDLING ---

// Power switching
power_on.addEventListener(EVENT.CHANGE, () => testEventsHandler(ACTION.POWER_ON, power_on));
power_off.addEventListener(EVENT.CHANGE, () => testEventsHandler(ACTION.POWER_OFF, power_off));

// Numpad buttons
numpad_btn_1.addEventListener(EVENT.CLICK, () => testEventsHandler(ACTION.TYPE, numpad_btn_1));
numpad_btn_2.addEventListener(EVENT.CLICK, () => testEventsHandler(ACTION.TYPE, numpad_btn_2));
numpad_btn_3.addEventListener(EVENT.CLICK, () => testEventsHandler(ACTION.TYPE, numpad_btn_3));
numpad_btn_4.addEventListener(EVENT.CLICK, () => testEventsHandler(ACTION.TYPE, numpad_btn_4));
numpad_btn_5.addEventListener(EVENT.CLICK, () => testEventsHandler(ACTION.TYPE, numpad_btn_5));
numpad_btn_6.addEventListener(EVENT.CLICK, () => testEventsHandler(ACTION.TYPE, numpad_btn_6));
numpad_btn_7.addEventListener(EVENT.CLICK, () => testEventsHandler(ACTION.TYPE, numpad_btn_7));
numpad_btn_8.addEventListener(EVENT.CLICK, () => testEventsHandler(ACTION.TYPE, numpad_btn_8));
numpad_btn_9.addEventListener(EVENT.CLICK, () => testEventsHandler(ACTION.TYPE, numpad_btn_9));
numpad_btn_0.addEventListener(EVENT.CLICK, () => testEventsHandler(ACTION.TYPE, numpad_btn_0));

// Action buttons
action_btn_c.addEventListener(EVENT.CLICK, () => testEventsHandler(ACTION.CLEAR_DISPLAY, action_btn_c));
action_btn_s.addEventListener(EVENT.CLICK, () => testEventsHandler(ACTION.SEND_MESSAGE, action_btn_s));

// -------------------------------------------------------------------------- //

// --- INCIALIZE ---
power_off.checked = true;
power_on.checked = false;
updateInterface(current_state);

// --- TESTS ---
/**
 * @param {ACTION} action
 * @param {HTMLInputElement | HTMLButtonElement} trigger
 */
function testEventsHandler(action, trigger) {
    switch (action) {
        case ACTION.POWER_ON:
            testUpdateState(trigger);
            updateInterface();
            break;

        case ACTION.POWER_OFF:
            testUpdateState(trigger);
            updateInterface();
            typed_message = '';
            break;

        case ACTION.TYPE:
            testUpdateState(trigger);
            updateInterface();
            typed_message = typed_message + trigger.dataset.num;
            break;

        case ACTION.CLEAR_DISPLAY:
            testUpdateState(trigger);
            updateInterface();
            typed_message = '';
            break;

        case ACTION.SEND_MESSAGE:
            testUpdateState(trigger);
            updateInterface();
            break;

        default:
            console.log(`ERROR || Wrong action || Action '${action}' not recognized as a valid action`);
            break;
    }
}
/**
 * @param {HTMLInputElement | HTMLButtonElement} trigger
 */
function testUpdateState(trigger) {
    switch (current_state) {
        case STATE.OFF:
            switch (trigger) {
                case power_on:
                    current_state = STATE.CLEAR;
                    break;
                case power_off:
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
                    console.log(`ERROR || Wrong trigger-state relation || Trigger '${trigger.id}' should not have been activated.`);
                    break;
                default:
                    console.log(`ERROR || Wrong trigger || Trigger '${trigger.id}' not recognized as a valid trigger`);
                    break;
            }
            break;

        case STATE.CLEAR:
            switch (trigger) {
                case power_off:
                    current_state = STATE.OFF;
                    break;
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
                    current_state = STATE.TYPING;
                    break;
                case power_on:
                case action_btn_c:
                case action_btn_s:
                    console.log(`ERROR || Wrong trigger-state relation || Trigger '${trigger.id}' should not have been activated.`);
                    break;
                default:
                    console.log(`ERROR || Wrong trigger || Trigger '${trigger.id}' not recognized as a valid trigger`);
                    break;
            }
            break;

        case STATE.TYPING:
            switch (trigger) {
                case power_off:
                    current_state = STATE.OFF;
                    break;
                case action_btn_c:
                    current_state = STATE.CLEAR;
                    break;
                case action_btn_s:
                    current_state = STATE.SENT;
                    break;
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
                    current_state = STATE.TYPING;
                    break;
                case power_on:
                    console.log(`ERROR || Wrong trigger-state relation || Trigger '${trigger.id}' should not have been activated.`);
                    break;
                default:
                    console.log(`ERROR || Wrong trigger || Trigger '${trigger.id}' not recognized as a valid trigger`);
                    break;
            }
            break;

        case STATE.SENT:
            switch (trigger) {
                case power_off:
                    current_state = STATE.OFF;
                    break;
                case power_on:
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
                    console.log(`ERROR || Wrong trigger-state relation || Trigger '${trigger.id}' should not have been activated.`);
                    break;
                default:
                    console.log(`ERROR || Wrong trigger || Trigger '${trigger.id}' not recognized as a valid trigger`);
                    break;
            }
            break;
        default:
            console.log(`ERROR || Invalid state || Invalid state reached, current state value: '${current_state}'`);
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
