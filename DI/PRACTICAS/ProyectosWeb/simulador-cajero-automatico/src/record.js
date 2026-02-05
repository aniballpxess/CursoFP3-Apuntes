/**
 * @file record.js
 * @description Defines the Record type and helpers for creating, loading, and saving records.
 */

/**
 * Represents a single action record.
 */
export class Record {
    /**
     * Creates a new Record.
     * @param {string} date - Date of the action, e.g., "2/3/2026".
     * @param {string} time - Time of the action, e.g., "14:30:00".
     * @param {string} action - Name/description of the action.
     * @param {number} withdrawal_amount - Amount withdrawn in the action.
     * @param {number} balance - Account balance after the action.
     */
    constructor(date, time, action, withdrawal_amount, balance) {
        /** @type {string} */
        this.date = date;
        /** @type {string} */
        this.time = time;
        /** @type {string} */
        this.action = action;
        /** @type {number} */
        this.withdrawal_amount = withdrawal_amount;
        /** @type {number} */
        this.balance = balance;
    }

    /**
     * Factory: creates a new Record using current date/time and given data.
     * @param {string} action_name - Name of the action.
     * @param {number} withdrawal_amount - Amount withdrawn.
     * @param {number} balance - Account balance after the action.
     * @returns {Record} Newly created Record instance.
     */
    static create(action_name, withdrawal_amount, balance) {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        return new Record(date, time, action_name, withdrawal_amount, balance);
    }

    /**
     * Restore an Record from a plain object (after JSON.parse).
     * @param {object} obj Object representing an Record.
     * @returns {Record} Record instance if it is one, null otherwise.
     */
    static fromJSON(obj) {
        if (obj instanceof Record) {
            return obj;
        }
        return null;
    }
}

/**
 * Load all records from localStorage.
 * @returns {Record[]} Array of Record instances.
 */
export function loadRecords() {
    /** @type {object[]} */
    let raw = null;
    /** @type {(Record | null)[]} */
    let unfiltered = null;
    /** @type {Record[]} */
    let records = null;

    raw = JSON.parse(localStorage.getItem('records')) || [];
    unfiltered = raw.map(obj => {
        if (obj instanceof Record) {
            return obj;
        }
        return null;
    });
    records = unfiltered.filter(record => record !== null);

    return records;
}

/**
 * Save an array of Records into localStorage.
 * @param {Record[]} records - Array of Record instances to save.
 */
export function saveRecords(records) {
    localStorage.setItem('records', JSON.stringify(records));
}
