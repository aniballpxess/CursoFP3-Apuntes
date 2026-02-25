/* eslint-disable no-self-assign */
/* @ts-check */
import { Record } from '../record.js';

document.addEventListener('DOMContentLoaded', () => {
    // UI ELEMENTS ---------------------------------------------------------- //

    const UI = {
        buttons: {
            actions: {
                /** @type {HTMLButtonElement} */
                signup: document.getElementById('act-btn-01'),
                /** @type {HTMLButtonElement} */
                modif: document.getElementById('act-btn-02'),
                /** @type {HTMLButtonElement} */
                delete: document.getElementById('act-btn-03'),
                /** @type {HTMLButtonElement} */
                next: document.getElementById('act-btn-04'),
                /** @type {HTMLButtonElement} */
                prev: document.getElementById('act-btn-05'),
                /** @type {HTMLButtonElement} */
                accept: document.getElementById('act-btn-06'),
                /** @type {HTMLButtonElement} */
                cancel: document.getElementById('act-btn-07'),
            },
        },
        displays: {
            /** @type {HTMLInputElement} */
            name: document.getElementById('display-01'),
            /** @type {HTMLInputElement} */
            phone: document.getElementById('display-02'),
            /** @type {HTMLDivElement} */
            info: document.getElementById('display-03'),
        },
    };

    // ---------------------------------------------------------------------- //

    // LOCAL DEFINITIONS ---------------------------------------------------- //

    // --- Constants --- //

    /** @enum {string} */
    const STATE = Object.freeze({
        RECORRIDO: 'RECORRIDO',
        ALTA: 'ALTA',
        MODIFICACION: 'MODIFICACION',
        BAJA: 'BAJA',
        ERROR: 'ERROR',
    });
    /** @enum {string} */
    const ACTION = Object.freeze({
        ACEPTAR: 'ACEPTAR',
        CANCELAR: 'CANCELAR',
        DAR_ALTA: 'DAR_ALTA',
        MODIFICAR: 'MODIFICAR',
        DAR_BAJA: 'DAR_BAJA',
        NEXT: 'NEXT',
        PREV: 'PREV',
        OPEN_RECORDS: 'ELEVEN',
    });
    /** @enum {string} */
    const EVENT = Object.freeze({
        CLICK: 'click',
        MOUSE_DOWN: 'mousedown',
        STORAGE: 'storage',
        CHANGE: 'change',
    });
    /** @enum {string} */
    const INFO = Object.freeze({
        RECORRIDO: `${STATE.RECORRIDO}: Revise los registros o elija una opción`,
        ALTA: `${STATE.ALTA}: Introduzca los datos y pulse [Aceptar]`,
        MODIFICACION: `${STATE.MODIFICACION}: Modifique los datos y pulse [Aceptar]`,
        BAJA: `${STATE.BAJA}: Si está seguro pulse [Aceptar]`,
        ERROR_VACIO: `${STATE.ERROR}: Alguno de los campos está vacío, pulse [Aceptar] y vuelva a intentarlo`,
        ERROR_INVALIDO: `${STATE.ERROR}: En el campo del teléfono solo se permiten números, pulse [Aceptar] y vuelva a intentarlo`,
    });

    /** @type {STATE} */
    const DEFAULT_STATE = STATE.RECORRIDO;
    /** @type {RegExp} */
    const NUMBER_REGEX = /^\d+$/;

    // --- Variables --- //

    /** @type {STATE} */
    let current_state = null;
    /** @type {ACTION} */
    let current_action = null;
    /** @type {HTMLInputElement | HTMLButtonElement} */
    let current_trigger = null;

    /** @type {boolean} */
    let input_error_occurred = false;

    /** @type {number} */
    let current_index = 0;

    /** @type {string} */
    let error_info = '';

    /** @type {STATE} */
    let last_state = null;

    /** @type {Record[]} */
    let records = [];
    /** @type {Record} */
    let current_register = null;

    // --- Functions --- //

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
            case ACTION.ACEPTAR:
                if (current_state === STATE.ALTA) {
                    getData();
                    checkData();
                    if (input_error_occurred) {
                        break;
                    }
                    registerData();
                }
                if (current_state === STATE.MODIFICACION) {
                    getData();
                    checkData();
                    if (input_error_occurred) {
                        break;
                    }
                    modifyData();
                }
                if (current_state === STATE.BAJA) {
                    removeData();
                }
                break;

            case ACTION.CANCELAR:
                break;

            case ACTION.DAR_ALTA:
                break;

            case ACTION.MODIFICAR:
                break;

            case ACTION.DAR_BAJA:
                break;

            case ACTION.NEXT:
                current_index = (current_index + 1) % records.length;
                break;

            case ACTION.PREV:
                if (current_index === 0) {
                    current_index = records.length - 1;
                    break;
                }
                current_index = current_index - 1;
                break;

            case ACTION.OPEN_RECORDS:
                openRecordsTab();
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
     * @returns {string[]} New data in a string array
     */
    function getData() {
        const new_name = UI.displays.name.value;
        const new_phone = UI.displays.phone.value;
        return [new_name, new_phone];
    }

    /**
     * @param {string[]} new_data - New data to be checked
     */
    function checkData(new_data) {
        const new_name = new_data[0];
        const new_phone = new_data[1];
        if (new_name.length === 0 || new_phone.length === 0) {
            input_error_occurred = true;
            error_info = INFO.ERROR_VACIO;
            return;
        }
        const invalid_phone = !NUMBER_REGEX.test(new_phone);
        if (invalid_phone) {
            input_error_occurred = true;
            error_info = INFO.ERROR_INVALIDO;
            return;
        }
    }

    /**
     * @param {string[]} new_data - New data to be registered
     */
    function registerData(new_data) {
        const new_name = new_data[0];
        const new_phone = new_data[1];
        const record = Record.create(new_name, new_phone);
        records.push(record);
    }

    /**
     * @param {string[]} new_data - New data to modify the current record
     */
    function modifyData(new_data) {
        const new_name = new_data[0];
        const new_phone = new_data[1];
        const record = Record.create(new_name, new_phone);
        records[current_index] = record;
    }

    /**
     *
     */
    function removeData() {
        records = records.filter(rec => rec !== current_register);
    }

    /**
     *
     */
    function updateState() {
        if (input_error_occurred) {
            last_state = current_state;
            current_state = STATE.ERROR;
            return;
        }
        switch (current_state) {
            case STATE.RECORRIDO:
                if (current_action === ACTION.DAR_ALTA) {
                    current_state = STATE.ALTA;
                    break;
                }
                if (current_action === ACTION.MODIFICAR) {
                    current_state = STATE.MODIFICACION;
                    break;
                }
                if (current_action === ACTION.DAR_BAJA) {
                    current_state = STATE.BAJA;
                    break;
                }
                break;

            case STATE.ALTA:
                if (current_action === ACTION.ACEPTAR) {
                    current_state = STATE.RECORRIDO;
                    break;
                }
                if (current_action === ACTION.CANCELAR) {
                    current_state = STATE.RECORRIDO;
                    break;
                }
                break;

            case STATE.MODIFICACION:
                if (current_action === ACTION.ACEPTAR) {
                    current_state = STATE.RECORRIDO;
                    break;
                }
                if (current_action === ACTION.CANCELAR) {
                    current_state = STATE.RECORRIDO;
                    break;
                }
                break;

            case STATE.BAJA:
                if (current_action === ACTION.ACEPTAR) {
                    current_state = STATE.RECORRIDO;
                    break;
                }
                if (current_action === ACTION.CANCELAR) {
                    current_state = STATE.RECORRIDO;
                    break;
                }
                break;

            case STATE.ERROR:
                if (current_action === ACTION.ACEPTAR) {
                    current_state = last_state;
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
            case STATE.RECORRIDO:
                input_error_occurred = false;
                current_index = current_index;
                error_info = '';
                last_state = null;
                current_register = records[current_index];
                break;

            case STATE.ALTA:
                input_error_occurred = false;
                current_index = current_index;
                error_info = '';
                last_state = null;
                current_register = records[current_index];
                break;

            case STATE.MODIFICACION:
                input_error_occurred = false;
                current_index = current_index;
                error_info = '';
                last_state = null;
                current_register = records[current_index];
                break;

            case STATE.BAJA:
                input_error_occurred = false;
                current_index = current_index;
                error_info = '';
                last_state = null;
                current_register = records[current_index];
                break;

            case STATE.ERROR:
                input_error_occurred = false;
                current_index = current_index;
                error_info = error_info;
                last_state = last_state;
                current_register = records[current_index];
                break;
        }
    }

    /**
     *
     */
    function updateExternals() {
        switch (current_state) {
            case STATE.RECORRIDO:
                UI.displays.name.disabled = true;
                UI.displays.phone.disabled = true;

                UI.buttons.actions.signup.disabled = false;
                UI.buttons.actions.modif.disabled = false;
                UI.buttons.actions.delete.disabled = false;
                UI.buttons.actions.next.disabled = false;
                UI.buttons.actions.prev.disabled = false;
                UI.buttons.actions.accept.disabled = true;
                UI.buttons.actions.cancel.disabled = true;

                UI.displays.name.value = current_register.name;
                UI.displays.phone.value = current_register.phone;
                UI.displays.info.textContent = INFO.RECORRIDO;
                break;

            case STATE.ALTA:
                UI.displays.name.disabled = false;
                UI.displays.phone.disabled = false;

                UI.buttons.actions.signup.disabled = true;
                UI.buttons.actions.modif.disabled = true;
                UI.buttons.actions.delete.disabled = true;
                UI.buttons.actions.next.disabled = true;
                UI.buttons.actions.prev.disabled = true;
                UI.buttons.actions.accept.disabled = false;
                UI.buttons.actions.cancel.disabled = false;

                UI.displays.name.value = '';
                UI.displays.phone.value = '';
                UI.displays.info.textContent = INFO.ALTA;
                break;

            case STATE.MODIFICACION:
                UI.displays.name.disabled = false;
                UI.displays.phone.disabled = false;

                UI.buttons.actions.signup.disabled = true;
                UI.buttons.actions.modif.disabled = true;
                UI.buttons.actions.delete.disabled = true;
                UI.buttons.actions.next.disabled = true;
                UI.buttons.actions.prev.disabled = true;
                UI.buttons.actions.accept.disabled = false;
                UI.buttons.actions.cancel.disabled = false;

                UI.displays.name.value = '';
                UI.displays.phone.value = '';
                UI.displays.info.textContent = INFO.MODIFICACION;
                break;

            case STATE.BAJA:
                UI.displays.name.disabled = true;
                UI.displays.phone.disabled = true;

                UI.buttons.actions.signup.disabled = true;
                UI.buttons.actions.modif.disabled = true;
                UI.buttons.actions.delete.disabled = true;
                UI.buttons.actions.next.disabled = true;
                UI.buttons.actions.prev.disabled = true;
                UI.buttons.actions.accept.disabled = false;
                UI.buttons.actions.cancel.disabled = false;

                UI.displays.name.value = current_register.name;
                UI.displays.phone.value = current_register.phone;
                UI.displays.info.textContent = INFO.BAJA;
                break;

            case STATE.ERROR:
                UI.displays.name.disabled = true;
                UI.displays.phone.disabled = true;

                UI.buttons.actions.signup.disabled = true;
                UI.buttons.actions.modif.disabled = true;
                UI.buttons.actions.delete.disabled = true;
                UI.buttons.actions.next.disabled = true;
                UI.buttons.actions.prev.disabled = true;
                UI.buttons.actions.accept.disabled = false;
                UI.buttons.actions.cancel.disabled = true;

                UI.displays.name.value = '';
                UI.displays.phone.value = '';
                UI.displays.info.textContent = error_info;
        }
    }

    // ---------------------------------------------------------------------- //

    // EVENT HANDLING ------------------------------------------------------- //

    // --- Action buttons --- //

    UI.buttons.actions.signup.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.DAR_ALTA, ev.currentTarget));
    UI.buttons.actions.modif.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.MODIFICAR, ev.currentTarget));
    UI.buttons.actions.delete.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.DAR_BAJA, ev.currentTarget));

    UI.buttons.actions.next.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.NEXT, ev.currentTarget));
    UI.buttons.actions.prev.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.PREV, ev.currentTarget));

    UI.buttons.actions.accept.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.ACEPTAR, ev.currentTarget));
    UI.buttons.actions.cancel.addEventListener(EVENT.CLICK, ev => eventsHandler(ACTION.CANCELAR, ev.currentTarget));

    // --- Storage change --- //

    // window.addEventListener(EVENT.STORAGE, ev => {
    //     if (ev.key === 'records') {
    //         records = loadRecords();
    //     }
    // });

    // ---------------------------------------------------------------------- //

    // INCIALIZE INTERFACE -------------------------------------------------- //

    current_state = DEFAULT_STATE;
    current_index = 0;
    records.push(Record.create('PEPE', '987436'));
    records.push(Record.create('MARIA', '192301'));
    records.push(Record.create('RAMON', '123489'));
    records.push(Record.create('SOFIA', '122523'));
    records.push(Record.create('MIGUEL', '578612'));
    updateInternals();
    updateExternals();

    // ---------------------------------------------------------------------- //

    // TESTING -------------------------------------------------------------- //

    // ---------------------------------------------------------------------- //
});
