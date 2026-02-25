/**
 * @file record.js
 * @description Defines the Record class and persistence helpers.
 */

/**
 * @typedef {object} RecordData
 * @property {string} name - Name of the person.
 * @property {string} phone - Phone number.
 */

export class Record {
    /**
     * @param {string} name - Name of the person associated with the Record.
     * @param {string} phone - Phone number associated with the Record.
     */
    constructor(name, phone) {
        this.name = name;
        this.phone = phone;
    }

    /**
     * Factory: creates a new Record instance.
     * @param {string} new_name - Name for the new Record.
     * @param {string} new_phone - Phone number for the new Record.
     * @returns {Record} Newly created Record
     */
    static create(new_name, new_phone) {
        return new Record(new_name, new_phone);
    }

    /**
     * Restore a Record from an object previously extracted from a string with JSON format
     * @param {RecordData} obj - Object data extracted from JSON
     * @returns {Record | null} New Record instance or null if the parameter was not a valid object
     */
    static fromJSON(obj) {
        if (!obj || typeof obj !== 'object') {
            return null;
        }
        return new Record(obj.name, obj.phone);
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
