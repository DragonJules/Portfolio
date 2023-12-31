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
import { ProjectCard } from './project_card.js';
import { toast, ToasterStatus } from './toaster.js';
// ----------------------
//    SETUP COMPONENTS
// ----------------------
// open link buttons
function bindOpenLinkButton(button) {
    let url = button.getAttribute('data-url');
    if (!url)
        return;
    button.addEventListener('click', () => {
        window.open(url, '_blank');
    });
}
const openLinkButton = document.querySelectorAll('button.open-link-button');
openLinkButton.forEach((button) => {
    bindOpenLinkButton(button);
});
// scroll to section
const sections = document.querySelectorAll('section');
function scrollToSection(sectionIndex) {
    if (0 <= sectionIndex && sectionIndex < sections.length) {
        const top = sections[sectionIndex].offsetTop -
            +getComputedStyle(document.querySelector('section')).marginBottom.match(/\d+/)[0] /
                2;
        window.scrollTo({
            top: top,
            behavior: 'smooth',
        });
    }
}
const scrollToSectionButton = document.querySelectorAll('.scroll-to-section-button');
scrollToSectionButton.forEach((button) => {
    let sectionIndex = button.getAttribute('data-section-index');
    if (!sectionIndex)
        return;
    button.addEventListener('click', () => {
        scrollToSection(+sectionIndex);
    });
});
// projects adding to dom
const SCROLL_REAVEAL_ANIMATION_DELAY = 200;
const PROJECTS_DATABASE_PATH = 'assets/data/projects.json';
const projectsWrapper = document.querySelector('.projects__wrapper');
const projectCardElementList = [];
const projectCards = [];
loadProjects();
function loadProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        const projectCardHtmlTemplate = yield fetch('views/project_card.html').then((res) => res.text());
        let rawProjectsData = yield fetch(PROJECTS_DATABASE_PATH).then((res) => res.text());
        let projectsData = JSON.parse(rawProjectsData);
        let projectsList = projectsData.projects;
        projectsList.forEach((projectData) => {
            projectCards.push(new ProjectCard(projectData.name, projectData.tags, projectData.thumbnail_src, projectData.description, projectData.url, projectData.date));
        });
        projectCards.forEach((projectCard, index) => __awaiter(this, void 0, void 0, function* () {
            const projectCardElement = yield projectCard.render(projectCardHtmlTemplate);
            projectsWrapper === null || projectsWrapper === void 0 ? void 0 : projectsWrapper.appendChild(projectCardElement);
            bindOpenLinkButton(projectCardElement.querySelector('button.project-card__link-to-project'));
            projectCardElement.style.transitionDelay = `${(index + 1) * SCROLL_REAVEAL_ANIMATION_DELAY}ms`;
            scrollAnimationObserver.observe(projectCardElement);
            projectCardElementList.push(projectCardElement);
        }));
        const projectsTagsLists = projectCards.map((projectCard) => projectCard.tags);
        const projectsTagsListWithDuplicates = [].concat(...projectsTagsLists);
        const projectsTagsList = projectsTagsListWithDuplicates.filter((elem, index, self) => index === self.indexOf(elem));
        populateTagsSelectorDialog(projectsTagsList);
    });
}
// ---------------------------
//    SETUP NICE ANIMATIONS
// ---------------------------
// mouse trailer
const MOUSE_TRAILER_ANIMATION_DURATION = 600;
const isDeviceTouch = 'ontouchstart' in document.documentElement;
const trailer = document.querySelector('.trailer');
if (isDeviceTouch)
    trailer.style.display = 'none';
const animateTrailer = (e, interacting) => {
    const x = e.clientX - (trailer === null || trailer === void 0 ? void 0 : trailer.offsetWidth) / 2, y = e.clientY - (trailer === null || trailer === void 0 ? void 0 : trailer.offsetHeight) / 2;
    const keyframes = {
        transform: `translate(${x}px, ${y}px) scale(${interacting ? 3 : 1})`,
    };
    trailer.animate(keyframes, {
        duration: MOUSE_TRAILER_ANIMATION_DURATION,
        fill: 'forwards',
    });
};
const getTrailerIconSrc = (interactableType) => {
    switch (interactableType) {
        case 'scroll':
            return 'assets/images/vector/scroll-cta.svg';
        case 'ext':
            return 'assets/images/vector/arrow-ext.svg';
        case 'filter':
            return 'assets/images/vector/filter.svg';
        default:
            return 'assets/images/vector/arrow-right.svg';
    }
};
window.addEventListener('mousemove', (e) => {
    if (isDeviceTouch)
        return;
    const interactable = e.target.closest('.interactable');
    let interacting = interactable !== null;
    const icon = document.querySelector('.trailer-icon');
    animateTrailer(e, interacting);
    trailer.dataset.interactableType = interacting
        ? interactable.getAttribute('data-interactable-type')
        : '';
    if (interacting) {
        icon.src = getTrailerIconSrc(interactable.getAttribute('data-interactable-type'));
    }
});
// changing text animation
const CHANGING_TEXT_ANIMATION_DURATION = 400;
const CHANGING_TEXT_ANIMATION_REPETITION_DELAY = 3000;
const changingTextElAnimObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('hidden');
        }
        else {
            entry.target.classList.add('hidden');
        }
    });
});
const changingTextElements = document.querySelectorAll('.changing-text');
changingTextElements.forEach((element) => {
    const otherTextVariations = element
        .getAttribute('data-text-variations')
        .split(';');
    const textVariations = [element.innerText].concat(otherTextVariations);
    if (otherTextVariations[0] === '' || otherTextVariations.length === 0)
        return;
    let currentTextIndex = 0;
    let intervalID = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        if (element.classList.contains('hidden'))
            return;
        currentTextIndex = (currentTextIndex + 1) % textVariations.length;
        element.classList.add('text-disappearing');
        yield wait(CHANGING_TEXT_ANIMATION_DURATION);
        element.classList.add('text-disappeared');
        element.classList.remove('text-disappearing');
        element.dataset.currentText = textVariations[currentTextIndex];
        yield wait(5);
        element.classList.remove('text-disappeared');
        yield wait(CHANGING_TEXT_ANIMATION_DURATION);
    }), CHANGING_TEXT_ANIMATION_REPETITION_DELAY);
    if (window.matchMedia('(prefers-reduced-motion').matches) {
        clearInterval(intervalID);
    }
    changingTextElAnimObserver.observe(element);
});
// scroll animations
const scrollAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
scrollRevealElements.forEach((el) => scrollAnimationObserver.observe(el));
// ---------------------------
//    SETUP FUNCTIONALITIES
// ---------------------------
// form validation
const INPUT_DEBOUNCE_TIME = 500;
const inputFieldsElements = [...document.querySelectorAll('.input-field')];
const labels = inputFieldsElements.map((element) => element.querySelector('label'));
const formInputs = inputFieldsElements.map((element) => element.querySelector('input, textarea'));
let timer;
const isInputValid = (input) => {
    const pattern = input.getAttribute('data-regexp');
    if (!pattern && input.value.length !== 0)
        return true;
    if (!pattern && input.value.length === 0)
        return false;
    if (pattern && input.value.match(new RegExp(pattern, 'g')))
        return true;
};
const handleInputChange = (input, index) => {
    let labelDefaultText = input.getAttribute('placeholder');
    if (input.value.length === 0) {
        inputFieldsElements[index].classList.add('empty');
        inputFieldsElements[index].classList.remove('invalid');
        labels[index].innerText = labelDefaultText;
    }
    else {
        inputFieldsElements[index].classList.remove('empty');
        const valid = isInputValid(input);
        clearTimeout(timer);
        inputFieldsElements[index].classList.remove('invalid');
        labels[index].innerText = labelDefaultText;
        timer = setTimeout(() => {
            if (!valid && input.value.length !== 0) {
                inputFieldsElements[index].classList.add('invalid');
                labels[index].innerText = `${labelDefaultText} - ${input.getAttribute('data-field-invalid-message')}`;
            }
        }, INPUT_DEBOUNCE_TIME);
    }
};
formInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        handleInputChange(input, index);
    });
    handleInputChange(input, index);
});
const formButton = document.querySelector('.contact__submit-button');
formButton === null || formButton === void 0 ? void 0 : formButton.addEventListener('click', (e) => {
    let allInputsValid = true;
    formInputs.forEach((input, index) => {
        if (!isInputValid(input)) {
            e.preventDefault();
            inputFieldsElements[index].classList.add('invalid');
            labels[index].innerText = `${input.getAttribute('placeholder')} - ${input.getAttribute('data-field-invalid-message')}`;
            allInputsValid = false;
        }
    });
    if (allInputsValid) {
        let formData = {};
        formInputs.forEach((input, index) => {
            formData[input.getAttribute('name')] = input.value;
            input.value = '';
            inputFieldsElements[index].classList.add('empty');
        });
        console.log(formData);
        toast('Message Sent !', ToasterStatus.SUCCESS);
    }
});
// message textarea auto-resize
const messageTextarea = document.querySelector('textarea#message');
messageTextarea.addEventListener('keyup', () => {
    messageTextarea.style.height = 'calc(3.25em - 2px)';
    messageTextarea.style.height = `${messageTextarea.scrollHeight + 2}px`;
});
// projects sorting with tags
const sortButton = document.querySelector('.projects__sort--sort-button');
const tagsSelectorDialog = document.querySelector('.projects__sort--tags-selector-dialog');
const tagsWrapper = tagsSelectorDialog.querySelector('.projects__sort--tag-list-wrapper');
let selectedTags = [];
sortButton.onclick = () => {
    var _a, _b;
    if (tagsSelectorDialog.open) {
        tagsSelectorDialog.close();
        (_a = sortButton.querySelector('.sort-icon')) === null || _a === void 0 ? void 0 : _a.classList.remove('close');
        sortButton.setAttribute('aria-expanded', 'false');
        selectedTags = [];
        updateShownProjectCards();
        tagsWrapper.childNodes.forEach((tagElement) => tagElement.classList.remove('selected'));
    }
    else {
        tagsSelectorDialog.show();
        (_b = sortButton.querySelector('.sort-icon')) === null || _b === void 0 ? void 0 : _b.classList.add('close');
        sortButton.setAttribute('aria-expanded', 'true');
    }
};
function populateTagsSelectorDialog(tagsList) {
    tagsList.map((tag) => {
        const tagElement = document.createElement('button');
        tagElement.classList.add('tag');
        tagElement.innerText = tag;
        tagsWrapper.appendChild(tagElement);
        tagElement.setAttribute('aria-label', `Select Tag: ${tag}`);
        tagElement.onclick = () => {
            tagElement.classList.toggle('selected');
            if (tagElement.classList.contains('selected')) {
                selectedTags.push(tag);
                tagElement.setAttribute('aria-label', `Unselect Tag: ${tag}`);
            }
            else {
                selectedTags.splice(selectedTags.indexOf(tag), 1);
                tagElement.setAttribute('aria-label', `Unselect Tag: ${tag}`);
            }
            updateShownProjectCards();
        };
    });
}
function updateShownProjectCards() {
    projectCardElementList.forEach((projectCardElement, index) => {
        const projectCardTags = projectCards[index].tags;
        const selectedProjectCardTags = projectCardTags.filter((tag) => selectedTags.includes(tag));
        projectCardElement.classList.toggle('shown', selectedProjectCardTags.length >= selectedTags.length);
    });
}
