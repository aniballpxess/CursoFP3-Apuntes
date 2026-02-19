/* eslint-disable no-self-assign */
import { Record, loadRecords, saveRecords } from '../record.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- UI Elements ---
    const UI = {
        buttons: {
            coins: {
                /** @type {HTMLButtonElement} */
                fiftyCent: document.getElementById('coin-btn-50'),
                /** @type {HTMLButtonElement} */
                oneEuro: document.getElementById('coin-btn-1E'),
                /** @type {HTMLButtonElement} */
                twoEuros: document.getElementById('coin-btn-2E'),
            },
            drinks: {
                /** @type {HTMLButtonElement} */
                cola: document.getElementById('drink-btn-cola'),
                /** @type {HTMLButtonElement} */
                lemon: document.getElementById('drink-btn-lemon'),
                /** @type {HTMLButtonElement} */
                orange: document.getElementById('drink-btn-orange'),
                /** @type {HTMLButtonElement} */
                jd: document.getElementById('drink-btn-jd'),
            },
            actions: {
                /** @type {HTMLButtonElement} */
                cancel: document.getElementById('act-btn-cancel'),
                /** @type {HTMLButtonElement} */
                takeCoins: document.getElementById('act-btn-take'),
                /** @type {HTMLButtonElement} */
                takeDrink: document.getElementById('act-btn-drink'),
                /** @type {HTMLButtonElement} */
                openRecords: document.getElementById('act-btn-records'),
            },
            helpers: {
                /** @type {HTMLButtonElement} */
                tab: document.getElementById('helper-btn-tab'),
                /** @type {HTMLButtonElement} */
                enter: document.getElementById('helper-btn-enter'),
            },
        },
        displays: {
            /** @type {HTMLDivElement} */
            currentCash: document.getElementById('display-cash'),
            /** @type {HTMLImageElement} */
            selectedDrink: document.getElementById('display-selected'),
        },
    };

    // -------------------------------------------------------------------------- //

    // --- LOCAL DEFINITIONS ---

    // Constants
    /** @enum {string} */
    const STATE = Object.freeze({
        NO_COINS: 'NO_COINS',
        HAS_COINS: 'HAS_COINS',
        DRINK_AVAILABLE: 'DRINK_AVAILABLE',
        PREMIUM_AVAILABLE: 'PREMIUM_AVAILABLE',
        DRINK_SELECTED: 'DRINK_SELECTED',
        COINS_LEFT: 'COINS_LEFT',
    });
    /** @enum {string} */
    const ACTION = Object.freeze({
        OPEN_RECORDS: 'OPEN_HISTORY',
        INPUT_COIN: 'INPUT_COIN',
        CANCEL: 'CANCEL',
        SELECT_DRINK: 'SELECT_DRINK',
        TAKE_DRINK: 'TAKE_DRINK',
        TAKE_COINS: 'TAKE_COINS',
    });
    /** @enum {string} */
    const EVENT = Object.freeze({
        CLICK: 'click',
        MOUSE_DOWN: 'mousedown',
        STORAGE: 'storage',
        CHANGE: 'change',
    });
    /** @enum {string} */
    const DRINK = Object.freeze({
        COCA_COLA: 'Coca Cola',
        FANTA_LEMON: 'Lemon Fanta',
        FANTA_ORANGE: 'Orange Fanta',
        JD_COCA_COLA: "Jack Daniel's Coca Cola",
    });
    /** @enum {string} */
    const IMAGE = Object.freeze({
        COCA_COLA: '../../res/images/Beverages_-_Enabled/Coca_Cola.jpg',
        FANTA_LEMON: '../../res/images/Beverages_-_Enabled/Fanta_Lemon.jpg',
        FANTA_ORANGE: '../../res/images/Beverages_-_Enabled/Fanta_Orange.jpg',
        JD_COCA_COLA: '../../res/images/Beverages_-_Enabled/Jack_Daniel_s_Coca_Cola.jpg',
    });
    /** @enum {number} */
    const COIN = Object.freeze({
        FIFTY_CENTS: 0.5,
        ONE_EURO: 1.0,
        TWO_EUROS: 2.0,
    });
    /** @enum {number} */
    const PRICE = Object.freeze({
        STANDARD: 1.5,
        PREMIUM: 4.0,
    });

    /** @type {STATE} */
    const DEFAULT_STATE = STATE.NO_COINS;

    /** @type {HTMLButtonElement[]} */
    const BUTTONS = [];
    BUTTONS.push(UI.buttons.coins.fiftyCent);
    BUTTONS.push(UI.buttons.coins.oneEuro);
    BUTTONS.push(UI.buttons.coins.twoEuros);
    BUTTONS.push(UI.buttons.drinks.cola);
    BUTTONS.push(UI.buttons.drinks.lemon);
    BUTTONS.push(UI.buttons.drinks.orange);
    BUTTONS.push(UI.buttons.drinks.jd);
    BUTTONS.push(UI.buttons.actions.cancel);
    BUTTONS.push(UI.buttons.actions.takeCoins);
    BUTTONS.push(UI.buttons.actions.takeDrink);
    BUTTONS.push(UI.buttons.actions.openRecords);
    BUTTONS.push(UI.buttons.helpers.enter);
    BUTTONS.push(UI.buttons.helpers.tab);

    // Variables
    /** @type {STATE} */
    let current_state = null;
    /** @type {ACTION} */
    let current_action = null;
    /** @type {HTMLInputElement | HTMLButtonElement} */
    let current_trigger = null;

    /** @type {number} */
    let current_coins = 0.0;
    /** @type {DRINK} */
    let selected_drink_name = null;
    /** @type {IMAGE} */
    let selected_drink_image = null;
    /** @type {PRICE} */
    let selected_drink_price = null;

    /** @type {Record[]} */
    let records = null;
    /** @type {HTMLButtonElement[]} */
    let focusable_buttons = [];

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
            case ACTION.OPEN_RECORDS:
                openRecordsTab();
                break;

            case ACTION.INPUT_COIN:
                getCoin();
                break;

            case ACTION.CANCEL:
                break;

            case ACTION.SELECT_DRINK:
                getDrink();
                registerAction();
                break;

            case ACTION.TAKE_DRINK:
                break;

            case ACTION.TAKE_COINS:
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
    function getCoin() {
        let inputed_coin;
        switch (current_trigger) {
            case UI.buttons.coins.fiftyCent:
                inputed_coin = COIN.FIFTY_CENTS;
                break;
            case UI.buttons.coins.oneEuro:
                inputed_coin = COIN.ONE_EURO;
                break;
            case UI.buttons.coins.twoEuros:
                inputed_coin = COIN.TWO_EUROS;
                break;
            default:
                inputed_coin = null;
                break;
        }
        if (inputed_coin !== null) {
            current_coins = current_coins + inputed_coin;
        }
    }

    /**
     *
     */
    function getDrink() {
        switch (current_trigger) {
            case UI.buttons.drinks.cola:
                selected_drink_name = DRINK.COCA_COLA;
                selected_drink_image = IMAGE.COCA_COLA;
                selected_drink_price = PRICE.STANDARD;
                break;

            case UI.buttons.drinks.lemon:
                selected_drink_name = DRINK.FANTA_LEMON;
                selected_drink_image = IMAGE.FANTA_LEMON;
                selected_drink_price = PRICE.STANDARD;
                break;

            case UI.buttons.drinks.orange:
                selected_drink_name = DRINK.FANTA_ORANGE;
                selected_drink_image = IMAGE.FANTA_ORANGE;
                selected_drink_price = PRICE.STANDARD;
                break;

            case UI.buttons.drinks.jd:
                selected_drink_name = DRINK.JD_COCA_COLA;
                selected_drink_image = IMAGE.JD_COCA_COLA;
                selected_drink_price = PRICE.PREMIUM;
                break;
        }
        current_coins = current_coins - selected_drink_price;
    }

    /**
     *
     */
    function registerAction() {
        const record = Record.create(selected_drink_name, selected_drink_price, current_coins);
        records.push(record);
        saveRecords(records);
    }

    /**
     *
     */
    function updateState() {
        switch (current_state) {
            case STATE.NO_COINS:
                if (current_action === ACTION.INPUT_COIN && current_coins >= PRICE.STANDARD) {
                    current_state = STATE.DRINK_AVAILABLE;
                    break;
                }
                if (current_action === ACTION.INPUT_COIN) {
                    current_state = STATE.HAS_COINS;
                    break;
                }
                break;

            case STATE.HAS_COINS:
                if (current_action === ACTION.INPUT_COIN && current_coins >= PRICE.STANDARD) {
                    current_state = STATE.DRINK_AVAILABLE;
                    break;
                }
                if (current_action === ACTION.CANCEL) {
                    current_state = STATE.COINS_LEFT;
                    break;
                }
                break;

            case STATE.DRINK_AVAILABLE:
                if (current_action === ACTION.INPUT_COIN && current_coins >= PRICE.PREMIUM) {
                    current_state = STATE.PREMIUM_AVAILABLE;
                    break;
                }
                if (current_action === ACTION.CANCEL) {
                    current_state = STATE.COINS_LEFT;
                    break;
                }
                if (current_action === ACTION.SELECT_DRINK) {
                    current_state = STATE.DRINK_SELECTED;
                    break;
                }
                break;

            case STATE.PREMIUM_AVAILABLE:
                if (current_action === ACTION.CANCEL) {
                    current_state = STATE.COINS_LEFT;
                    break;
                }
                if (current_action === ACTION.SELECT_DRINK) {
                    current_state = STATE.DRINK_SELECTED;
                    break;
                }
                break;

            case STATE.DRINK_SELECTED:
                if (current_action === ACTION.TAKE_DRINK && current_coins !== 0) {
                    current_state = STATE.COINS_LEFT;
                    break;
                }
                if (current_action === ACTION.TAKE_DRINK && current_coins === 0) {
                    current_state = STATE.NO_COINS;
                    break;
                }
                break;

            case STATE.COINS_LEFT:
                if (current_action === ACTION.TAKE_COINS) {
                    current_state = STATE.NO_COINS;
                    break;
                }
                break;
        }
    }

    /**
     *
     */
    function updateInternals() {
        switch (current_state) {
            case STATE.NO_COINS:
                current_coins = 0;
                selected_drink_name = null;
                selected_drink_image = null;
                selected_drink_price = null;
                break;

            case STATE.HAS_COINS:
                current_coins = current_coins;
                selected_drink_name = null;
                selected_drink_image = null;
                selected_drink_price = null;
                break;

            case STATE.DRINK_AVAILABLE:
                current_coins = current_coins;
                selected_drink_name = null;
                selected_drink_image = null;
                selected_drink_price = null;
                break;

            case STATE.PREMIUM_AVAILABLE:
                current_coins = current_coins;
                selected_drink_name = null;
                selected_drink_image = null;
                selected_drink_price = null;
                break;

            case STATE.DRINK_SELECTED:
                current_coins = current_coins;
                selected_drink_name = selected_drink_name;
                selected_drink_image = selected_drink_image;
                selected_drink_price = selected_drink_price;
                break;

            case STATE.COINS_LEFT:
                current_coins = current_coins;
                selected_drink_name = null;
                selected_drink_image = null;
                selected_drink_price = null;
                break;
        }
    }

    /**
     *
     */
    function updateExternals() {
        switch (current_state) {
            case STATE.NO_COINS:
                UI.buttons.coins.fiftyCent.disabled = false;
                UI.buttons.coins.oneEuro.disabled = false;
                UI.buttons.coins.twoEuros.disabled = false;

                UI.buttons.drinks.cola.disabled = true;
                UI.buttons.drinks.lemon.disabled = true;
                UI.buttons.drinks.orange.disabled = true;
                UI.buttons.drinks.jd.disabled = true;

                UI.buttons.actions.cancel.disabled = true;
                UI.buttons.actions.takeDrink.disabled = true;
                UI.buttons.actions.takeCoins.disabled = true;

                UI.buttons.actions.openRecords.disabled = false;
                UI.buttons.helpers.enter.disabled = false;
                UI.buttons.helpers.tab.disabled = false;

                UI.displays.currentCash.textContent = current_coins.toFixed(2);
                UI.displays.selectedDrink.src = '';
                UI.displays.selectedDrink.style.display = 'none';
                break;

            case STATE.HAS_COINS:
                UI.buttons.coins.fiftyCent.disabled = false;
                UI.buttons.coins.oneEuro.disabled = false;
                UI.buttons.coins.twoEuros.disabled = false;

                UI.buttons.drinks.cola.disabled = true;
                UI.buttons.drinks.lemon.disabled = true;
                UI.buttons.drinks.orange.disabled = true;
                UI.buttons.drinks.jd.disabled = true;

                UI.buttons.actions.cancel.disabled = false;
                UI.buttons.actions.takeDrink.disabled = true;
                UI.buttons.actions.takeCoins.disabled = true;

                UI.buttons.actions.openRecords.disabled = false;
                UI.buttons.helpers.enter.disabled = false;
                UI.buttons.helpers.tab.disabled = false;

                UI.displays.currentCash.textContent = current_coins.toFixed(2);
                UI.displays.selectedDrink.src = '';
                UI.displays.selectedDrink.style.display = 'none';
                break;

            case STATE.DRINK_AVAILABLE:
                UI.buttons.coins.fiftyCent.disabled = false;
                UI.buttons.coins.oneEuro.disabled = false;
                UI.buttons.coins.twoEuros.disabled = false;

                UI.buttons.drinks.cola.disabled = false;
                UI.buttons.drinks.lemon.disabled = false;
                UI.buttons.drinks.orange.disabled = false;
                UI.buttons.drinks.jd.disabled = true;

                UI.buttons.actions.cancel.disabled = false;
                UI.buttons.actions.takeDrink.disabled = true;
                UI.buttons.actions.takeCoins.disabled = true;

                UI.buttons.actions.openRecords.disabled = false;
                UI.buttons.helpers.enter.disabled = false;
                UI.buttons.helpers.tab.disabled = false;

                UI.displays.currentCash.textContent = current_coins.toFixed(2);
                UI.displays.selectedDrink.src = '';
                UI.displays.selectedDrink.style.display = 'none';
                break;

            case STATE.PREMIUM_AVAILABLE:
                UI.buttons.coins.fiftyCent.disabled = true;
                UI.buttons.coins.oneEuro.disabled = true;
                UI.buttons.coins.twoEuros.disabled = true;

                UI.buttons.drinks.cola.disabled = false;
                UI.buttons.drinks.lemon.disabled = false;
                UI.buttons.drinks.orange.disabled = false;
                UI.buttons.drinks.jd.disabled = false;

                UI.buttons.actions.cancel.disabled = false;
                UI.buttons.actions.takeDrink.disabled = true;
                UI.buttons.actions.takeCoins.disabled = true;

                UI.buttons.actions.openRecords.disabled = false;
                UI.buttons.helpers.enter.disabled = false;
                UI.buttons.helpers.tab.disabled = false;

                UI.displays.currentCash.textContent = current_coins.toFixed(2);
                UI.displays.selectedDrink.src = '';
                UI.displays.selectedDrink.style.display = 'none';
                break;

            case STATE.DRINK_SELECTED:
                UI.buttons.coins.fiftyCent.disabled = true;
                UI.buttons.coins.oneEuro.disabled = true;
                UI.buttons.coins.twoEuros.disabled = true;

                UI.buttons.drinks.cola.disabled = true;
                UI.buttons.drinks.lemon.disabled = true;
                UI.buttons.drinks.orange.disabled = true;
                UI.buttons.drinks.jd.disabled = true;

                UI.buttons.actions.cancel.disabled = true;
                UI.buttons.actions.takeDrink.disabled = false;
                UI.buttons.actions.takeCoins.disabled = true;

                UI.buttons.actions.openRecords.disabled = false;
                UI.buttons.helpers.enter.disabled = false;
                UI.buttons.helpers.tab.disabled = false;

                UI.displays.currentCash.textContent = current_coins.toFixed(2);
                UI.displays.selectedDrink.src = selected_drink_image;
                UI.displays.selectedDrink.style.display = 'block';
                break;

            case STATE.COINS_LEFT:
                UI.buttons.coins.fiftyCent.disabled = true;
                UI.buttons.coins.oneEuro.disabled = true;
                UI.buttons.coins.twoEuros.disabled = true;

                UI.buttons.drinks.cola.disabled = true;
                UI.buttons.drinks.lemon.disabled = true;
                UI.buttons.drinks.orange.disabled = true;
                UI.buttons.drinks.jd.disabled = true;

                UI.buttons.actions.cancel.disabled = true;
                UI.buttons.actions.takeDrink.disabled = true;
                UI.buttons.actions.takeCoins.disabled = false;

                UI.buttons.actions.openRecords.disabled = false;
                UI.buttons.helpers.enter.disabled = false;
                UI.buttons.helpers.tab.disabled = false;

                UI.displays.currentCash.textContent = current_coins.toFixed(2);
                UI.displays.selectedDrink.src = '';
                UI.displays.selectedDrink.style.display = 'none';
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

    // Coin buttons
    UI.buttons.coins.fiftyCent.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.INPUT_COIN, ev.currentTarget));
    UI.buttons.coins.oneEuro.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.INPUT_COIN, ev.currentTarget));
    UI.buttons.coins.twoEuros.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.INPUT_COIN, ev.currentTarget));

    // Drink buttons
    UI.buttons.drinks.cola.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.SELECT_DRINK, ev.currentTarget));
    UI.buttons.drinks.lemon.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.SELECT_DRINK, ev.currentTarget));
    UI.buttons.drinks.orange.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.SELECT_DRINK, ev.currentTarget));
    UI.buttons.drinks.jd.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.SELECT_DRINK, ev.currentTarget));

    // Action buttons
    UI.buttons.actions.cancel.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.CANCEL, ev.currentTarget));
    UI.buttons.actions.takeDrink.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.TAKE_DRINK, ev.currentTarget));
    UI.buttons.actions.takeCoins.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.TAKE_COINS, ev.currentTarget));
    UI.buttons.actions.openRecords.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.OPEN_RECORDS, ev.currentTarget));

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
