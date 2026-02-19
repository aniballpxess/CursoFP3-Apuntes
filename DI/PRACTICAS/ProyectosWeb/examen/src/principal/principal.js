/* eslint-disable no-self-assign */
import { Record, loadRecords, saveRecords } from '../record.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- UI Elements ------------------------------------------------------ //

    const UI = {
        buttons: {
            actions: {
                /** @type {HTMLButtonElement} */
                a01: document.getElementById('act-btn-01'),
                /** @type {HTMLButtonElement} */
                a02: document.getElementById('act-btn-02'),
                /** @type {HTMLButtonElement} */
                a03: document.getElementById('act-btn-03'),
                /** @type {HTMLButtonElement} */
                a04: document.getElementById('act-btn-04'),
                /** @type {HTMLButtonElement} */
                a05: document.getElementById('act-btn-05'),
                /** @type {HTMLButtonElement} */
                a06: document.getElementById('act-btn-06'),
                /** @type {HTMLButtonElement} */
                a07: document.getElementById('act-btn-07'),
                /** @type {HTMLButtonElement} */
                a08: document.getElementById('act-btn-08'),
                /** @type {HTMLButtonElement} */
                a09: document.getElementById('act-btn-09'),
                /** @type {HTMLButtonElement} */
                a10: document.getElementById('act-btn-10'),
                /** @type {HTMLButtonElement} */
                records: document.getElementById('act-btn-records'),
            },
            typing: {
                /** @type {HTMLButtonElement} */
                _0: document.getElementById('typing-btn-0'),
                /** @type {HTMLButtonElement} */
                _1: document.getElementById('typing-btn-1'),
                /** @type {HTMLButtonElement} */
                _2: document.getElementById('typing-btn-2'),
                /** @type {HTMLButtonElement} */
                _3: document.getElementById('typing-btn-3'),
                /** @type {HTMLButtonElement} */
                _4: document.getElementById('typing-btn-4'),
                /** @type {HTMLButtonElement} */
                _5: document.getElementById('typing-btn-5'),
                /** @type {HTMLButtonElement} */
                _6: document.getElementById('typing-btn-6'),
                /** @type {HTMLButtonElement} */
                _7: document.getElementById('typing-btn-7'),
                /** @type {HTMLButtonElement} */
                _8: document.getElementById('typing-btn-8'),
                /** @type {HTMLButtonElement} */
                _9: document.getElementById('typing-btn-9'),
            },
            helpers: {
                /** @type {HTMLButtonElement} */
                tab: document.getElementById('helper-btn-tab'),
                /** @type {HTMLButtonElement} */
                enter: document.getElementById('helper-btn-enter'),
            },
        },
        displays: {
            /** @type {HTMLInputElement} */
            /** @type {HTMLDivElement} */
            primary: document.getElementById('display-01'),
            /** @type {HTMLDivElement} */
            /** @type {HTMLImageElement} */
            secondary: document.getElementById('display-02'),
        },
    };
    // ---------------------------------------------------------------------- //

    // --- LOCAL DEFINITIONS ------------------------------------------------ //

    // Constants
    /** @enum {string} */
    const STATE = Object.freeze({
        ONE: 'ONE',
        TWO: 'TWO',
        THREE: 'THREE',
        FOUR: 'FOUR',
        FIVE: 'FIVE',
        SIX: 'SIX',
        SEVEN: 'SEVEN',
        EIGHT: 'EIGHT',
        NINE: 'NIVE',
        TEN: 'TEN',
    });
    /** @enum {string} */
    const ACTION = Object.freeze({
        ONE: 'ONE',
        TWO: 'TWO',
        THREE: 'THREE',
        FOUR: 'FOUR',
        FIVE: 'FIVE',
        SIX: 'SIX',
        SEVEN: 'SEVEN',
        EIGHT: 'EIGHT',
        NINE: 'NIVE',
        TEN: 'TEN',
        OPEN_RECORDS: 'ELEVEN',
        TYPE_DIGIT: 'TWELVE',
    });
    /** @enum {string} */
    const EVENT = Object.freeze({
        CLICK: 'click',
        MOUSE_DOWN: 'mousedown',
        STORAGE: 'storage',
        CHANGE: 'change',
    });
    /** @enum {number} */
    const DIGIT = Object.freeze({
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
    });

    /** @type {STATE} */
    const DEFAULT_STATE = STATE.AWAIT_CARD_IN;

    /** @type {HTMLButtonElement[]} */
    const BUTTONS = [];
    BUTTONS.push(UI.actions.a01);
    BUTTONS.push(UI.actions.a02);
    BUTTONS.push(UI.actions.a03);
    BUTTONS.push(UI.actions.a04);
    BUTTONS.push(UI.actions.a05);
    BUTTONS.push(UI.actions.a06);
    BUTTONS.push(UI.actions.a07);
    BUTTONS.push(UI.actions.a08);
    BUTTONS.push(UI.actions.a09);
    BUTTONS.push(UI.actions.a10);
    BUTTONS.push(UI.typing.btn0);
    BUTTONS.push(UI.typing.btn1);
    BUTTONS.push(UI.typing.btn2);
    BUTTONS.push(UI.typing.btn3);
    BUTTONS.push(UI.typing.btn4);
    BUTTONS.push(UI.typing.btn5);
    BUTTONS.push(UI.typing.btn6);
    BUTTONS.push(UI.typing.btn7);
    BUTTONS.push(UI.typing.btn8);
    BUTTONS.push(UI.typing.btn9);
    BUTTONS.push(UI.helpers.enter);
    BUTTONS.push(UI.helpers.tab);

    // Variables
    /** @type {STATE} */
    let current_state = null;
    /** @type {ACTION} */
    let current_action = null;
    /** @type {HTMLInputElement | HTMLButtonElement} */
    let current_trigger = null;

    /** @type {Record[]} */
    let records = null;
    /** @type {HTMLButtonElement[]} */
    let focusable_buttons = [];

    /** @type {number} */
    let amount = 0;
    /** @type {DRINK} */
    let selected_drink_name = null;
    /** @type {IMAGE} */
    let selected_drink_image = null;
    /** @type {PRICE} */
    let selected_drink_price = null;

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
        updateFocusableButtons();

        current_action = null;
        current_trigger = null;
    }

    /**
     *
     */
    function runAction() {
        switch (current_action) {
            case ACTION.ONE:
                registerAction();
                break;

            case ACTION.TWO:
                getDigit();
                break;

            case ACTION.THREE:
                break;

            case ACTION.FOUR:
                break;

            case ACTION.FIVE:
                break;

            case ACTION.SIX:
                break;

            case ACTION.SEVEN:
                break;

            case ACTION.EIGHT:
                break;

            case ACTION.NINE:
                break;

            case ACTION.TEN:
                break;

            case ACTION.OPEN_RECORDS:
                openRecordsTab();
                break;

            case ACTION.TYPE_DIGIT:
                getDigit();
                break;
        }
    }

    /**
     *
     */
    function openRecordsTab() {
        window.open('../informe/informe.html', 'informe');
    }

    /**
     *
     */
    function getDigit() {
        let typed_digit;
        switch (current_trigger) {
            case UI.buttons.typing._0:
                typed_digit = DIGIT.ZERO;
                break;
            case UI.buttons.typing._1:
                typed_digit = DIGIT.ONE;
                break;
            case UI.buttons.typing._2:
                typed_digit = DIGIT.TWO;
                break;
            case UI.buttons.typing._3:
                typed_digit = DIGIT.THREE;
                break;
            case UI.buttons.typing._4:
                typed_digit = DIGIT.FOUR;
                break;
            case UI.buttons.typing._5:
                typed_digit = DIGIT.FIVE;
                break;
            case UI.buttons.typing._6:
                typed_digit = DIGIT.SIX;
                break;
            case UI.buttons.typing._7:
                typed_digit = DIGIT.SEVEN;
                break;
            case UI.buttons.typing._8:
                typed_digit = DIGIT.EIGHT;
                break;
            case UI.buttons.typing._9:
                typed_digit = DIGIT.NINE;
                break;
        }
        amount = amount * 10 + typed_digit;
    }

    /**
     *
     */
    function registerAction() {
        const record = Record.create(selected_drink_name, selected_drink_price, amount);
        records.push(record);
        saveRecords(records);
    }

    /**
     *
     */
    function updateState() {
        switch (current_state) {
            case STATE.ONE:
                if (current_action === ACTION.ONE) {
                    current_state = STATE.TWO;
                    break;
                }
                break;

            case STATE.TWO:
                break;

            case STATE.THREE:
                break;

            case STATE.FOUR:
                break;

            case STATE.FIVE:
                break;

            case STATE.SIX:
                break;

            case STATE.SEVEN:
                break;

            case STATE.EIGHT:
                break;

            case STATE.NINE:
                break;

            case STATE.TEN:
                break;
        }
    }

    /**
     *
     */
    function updateInternals() {
        switch (current_state) {
            case STATE.ONE:
                amount = amount;
                selected_drink_name = null;
                selected_drink_image = null;
                selected_drink_price = null;
                break;

            case STATE.TWO:
                break;

            case STATE.THREE:
                break;

            case STATE.FOUR:
                break;

            case STATE.FIVE:
                break;

            case STATE.SIX:
                break;

            case STATE.SEVEN:
                break;

            case STATE.EIGHT:
                break;

            case STATE.NINE:
                break;

            case STATE.TEN:
                break;
        }
    }

    /**
     *
     */
    function updateExternals() {
        switch (current_state) {
            case STATE.ONE:
                UI.buttons.typing._0.disabled = false;
                UI.buttons.typing._1.disabled = false;
                UI.buttons.typing._2.disabled = false;
                UI.buttons.typing._3.disabled = false;
                UI.buttons.typing._4.disabled = false;
                UI.buttons.typing._5.disabled = false;
                UI.buttons.typing._6.disabled = false;
                UI.buttons.typing._7.disabled = false;
                UI.buttons.typing._8.disabled = false;
                UI.buttons.typing._9.disabled = false;

                UI.buttons.actions.a01.disabled = true;
                UI.buttons.actions.a02.disabled = true;
                UI.buttons.actions.a03.disabled = true;
                UI.buttons.actions.a04.disabled = true;
                UI.buttons.actions.a05.disabled = true;
                UI.buttons.actions.a06.disabled = true;
                UI.buttons.actions.a07.disabled = true;
                UI.buttons.actions.a08.disabled = true;
                UI.buttons.actions.a09.disabled = true;
                UI.buttons.actions.a10.disabled = true;

                UI.buttons.actions.records.disabled = false;
                UI.buttons.helpers.enter.disabled = false;
                UI.buttons.helpers.tab.disabled = false;

                UI.displays.primary.textContent = amount.toFixed(2);
                UI.displays.secondary.src = '';
                UI.displays.secondary.style.display = 'none';
                // UI.displays.secondary = selected_drink_image;
                // UI.displays.secondary = 'block';
                break;

            case STATE.TWO:
                break;

            case STATE.THREE:
                break;

            case STATE.FOUR:
                break;

            case STATE.FIVE:
                break;

            case STATE.SIX:
                break;

            case STATE.SEVEN:
                break;

            case STATE.EIGHT:
                break;

            case STATE.NINE:
                break;

            case STATE.TEN:
                break;
        }
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

    // Typing buttons
    UI.buttons.typing._0.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.TYPE_DIGIT, ev.currentTarget));
    UI.buttons.typing._1.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.TYPE_DIGIT, ev.currentTarget));
    UI.buttons.typing._2.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.TYPE_DIGIT, ev.currentTarget));
    UI.buttons.typing._3.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.TYPE_DIGIT, ev.currentTarget));
    UI.buttons.typing._4.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.TYPE_DIGIT, ev.currentTarget));
    UI.buttons.typing._5.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.TYPE_DIGIT, ev.currentTarget));
    UI.buttons.typing._6.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.TYPE_DIGIT, ev.currentTarget));
    UI.buttons.typing._7.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.TYPE_DIGIT, ev.currentTarget));
    UI.buttons.typing._8.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.TYPE_DIGIT, ev.currentTarget));
    UI.buttons.typing._9.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.TYPE_DIGIT, ev.currentTarget));

    // Action buttons
    UI.buttons.actions.a01.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.ONE, ev.currentTarget));
    UI.buttons.actions.a02.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.TWO, ev.currentTarget));
    UI.buttons.actions.a03.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.THREE, ev.currentTarget));
    UI.buttons.actions.a04.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.FOUR, ev.currentTarget));
    UI.buttons.actions.a05.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.FIVE, ev.currentTarget));
    UI.buttons.actions.a06.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.SIX, ev.currentTarget));
    UI.buttons.actions.a07.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.SEVEN, ev.currentTarget));
    UI.buttons.actions.a08.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.EIGHT, ev.currentTarget));
    UI.buttons.actions.a09.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.NINE, ev.currentTarget));
    UI.buttons.actions.a10.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.TEN, ev.currentTarget));
    UI.buttons.actions.records.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.OPEN_RECORDS, ev.currentTarget));

    // Helper buttons
    UI.buttons.helpers.tab.addEventListener(EVENT.MOUSE_DOWN, ev => {
        ev.preventDefault();

        const active = document.activeElement;
        const index = focusable_buttons.indexOf(active);
        const next = (index + 1) % focusable_buttons.length;

        focusable_buttons[next].focus();
    });
    UI.buttons.helpers.enter.addEventListener(EVENT.MOUSE_DOWN, ev => {
        ev.preventDefault();

        if (document.activeElement) {
            document.activeElement.click();
        }
    });

    // Storage change
    window.addEventListener(EVENT.STORAGE, ev => {
        if (ev.key === 'records') {
            records = loadRecords();
        }
    });

    // -------------------------------------------------------------------------- //

    // --- INCIALIZE INTERFACE ---
    current_state = DEFAULT_STATE;
    records = loadRecords();
    updateInternals();
    updateExternals();
    updateFocusableButtons();

    // -------------------------------------------------------------------------- //

    // --- TESTING ---
});
