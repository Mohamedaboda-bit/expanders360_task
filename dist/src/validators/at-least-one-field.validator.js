"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtLeastOneField = AtLeastOneField;
const class_validator_1 = require("class-validator");
function AtLeastOneField(propertyNames, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'atLeastOneField',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(_, args) {
                    return propertyNames.some(field => args.object[field] !== undefined && args.object[field] !== null);
                },
                defaultMessage(args) {
                    return `At least one of the following fields must be provided: ${propertyNames.join(', ')}`;
                }
            }
        });
    };
}
//# sourceMappingURL=at-least-one-field.validator.js.map