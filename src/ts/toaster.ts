import { wait } from './utils.js';

export enum ToasterStatus {
    DEFAULT, SUCCESS, ERROR
}


const toaster = document.querySelector('#toaster') as HTMLElement;

export const toast = async (message: string, status: ToasterStatus, displayTime = 5000) => {
    
    toaster!.style.setProperty('--toast-duration', `${displayTime}ms`)
    
    toaster!.className = ''
    toaster!.querySelector('p')!.innerText = message;

    switch (status) {
        case ToasterStatus.ERROR: 
            toaster!.classList.add('error');
        case ToasterStatus.SUCCESS:
            toaster!.classList.add('success');
    }

    toaster!.classList.add('visible');
    await wait(displayTime);
    toaster!.classList.remove('visible');
}

