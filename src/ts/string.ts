interface String {
    replacePlaceholder(find: string, value: string): string;
}

String.prototype.replacePlaceholder = function (find: string, value: string) {
    return this.replace(new RegExp(`{{${find}}}`, 'g'), value)
}