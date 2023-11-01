var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { wait } from './utils.js';
export var ToasterStatus;
(function (ToasterStatus) {
    ToasterStatus[ToasterStatus["DEFAULT"] = 0] = "DEFAULT";
    ToasterStatus[ToasterStatus["SUCCESS"] = 1] = "SUCCESS";
    ToasterStatus[ToasterStatus["ERROR"] = 2] = "ERROR";
})(ToasterStatus || (ToasterStatus = {}));
const toaster = document.querySelector('#toaster');
export const toast = (message, status, displayTime = 5000) => __awaiter(void 0, void 0, void 0, function* () {
    toaster.style.setProperty('--toast-duration', `${displayTime}ms`);
    toaster.className = '';
    toaster.querySelector('p').innerText = message;
    switch (status) {
        case ToasterStatus.ERROR:
            toaster.classList.add('error');
        case ToasterStatus.SUCCESS:
            toaster.classList.add('success');
    }
    toaster.classList.add('visible');
    yield wait(displayTime);
    toaster.classList.remove('visible');
});
