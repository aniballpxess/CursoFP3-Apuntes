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
     * @param {string} name - Name of the drink.
     * @param {string} phone - price of the drink.
     */
    constructor(name, phone) {
        /** @type {string} */
        this.name = name;
        /** @type {string} */
        this.phone = phone;
    }

    /**
     * Factory: creates a new Record using current date/time and given data.
     * @param {string} new_name - Name of the drink.
     * @param {string} new_phone - price of the drink.
     * @returns {Record} Newly created Record instance.
     */
    static create(new_name, new_phone) {
        return new Record(new_name, new_phone);
    }

    /**
     * Restore an Record from a plain object (after JSON.parse).
     * @param {Partial<Record>} obj Object representing an Record.
     * @returns {Record | null} Record instance if it is one, null otherwise.
     */
    static fromJSON(obj) {
        if (!obj || typeof obj !== 'object') {
            return null;
        }
        const record = new Record();
        Object.assign(record, obj);
        return record;
    }
}

/**
 * Load all records from localStorage.
 * @returns {Record[]} Array of Record instances.
 */
export function loadRecords() {
    /** @type {unknown[]} */
    let raw;
    /** @type {(Record | null)[]} */
    let unfiltered;
    /** @type {Record[]} */
    let records;

    raw = JSON.parse(localStorage.getItem('records')) || [];
    unfiltered = raw.map(obj => Record.fromJSON(obj));
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
