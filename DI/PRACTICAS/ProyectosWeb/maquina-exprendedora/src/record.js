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
     * @param {string} drink_name - Name of the drink.
     * @param {number} drink_price - price of the drink.
     * @param {number} coins_left - Coins left after purchase.
     */
    constructor(date, time, drink_name, drink_price, coins_left) {
        /** @type {string} */
        this.date = date;
        /** @type {string} */
        this.time = time;
        /** @type {string} */
        this.drink_name = drink_name;
        /** @type {number} */
        this.drink_price = drink_price;
        /** @type {number} */
        this.coins_left = coins_left;
    }

    /**
     * Factory: creates a new Record using current date/time and given data.
     * @param {string} drink_name - Name of the drink.
     * @param {number} drink_price - price of the drink.
     * @param {number} coins_left - Coins left after purchase.
     * @returns {Record} Newly created Record instance.
     */
    static create(drink_name, drink_price, coins_left) {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        return new Record(date, time, drink_name, drink_price, coins_left);
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
