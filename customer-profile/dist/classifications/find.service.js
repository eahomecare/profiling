"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findInClassification = void 0;
const classification_object_1 = require("./classification.object");
const findInClassification = (key) => {
    const classKeys = Object.keys(classification_object_1.default);
    let keyFound = false;
    classKeys.every(classKey => {
        if (classification_object_1.default[classKey].includes(key)) {
            keyFound = classKey;
            return false;
        }
        return true;
    });
    return keyFound;
};
exports.findInClassification = findInClassification;
//# sourceMappingURL=find.service.js.map