String.prototype.replacePlaceholder = function (find, value) {
    return this.replace(new RegExp(`{{${find}}}`, 'g'), value);
};
