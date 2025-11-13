"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlugId = generateSlugId;
function generateSlugId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let slugId = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        slugId += characters[randomIndex];
    }
    return slugId;
}
