var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import './utils.js';
import './string.js';
export class ProjectCard {
    constructor(name, tags, thumbnail_src, description, url, date) {
        this.name = name;
        this.tags = tags;
        this.thumbnail_src = thumbnail_src;
        this.description = description;
        this.url = url;
        this.date = date;
    }
    render() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');
            projectCard.classList.add('glass');
            projectCard.classList.add('scroll-reveal');
            projectCard.classList.add('shown');
            let projectURL = this.url;
            let disabled = '';
            if (!projectURL) {
                projectURL = '#';
                disabled = 'disabled';
            }
            let projectCardHtmlTemplate = yield fetch('../../src/views/project_card.html').then(res => res.text());
            projectCardHtmlTemplate = projectCardHtmlTemplate.replacePlaceholder('name', this.name)
                .replacePlaceholder('thumbnail_src', this.thumbnail_src)
                .replacePlaceholder('description', this.description)
                .replacePlaceholder('url', projectURL)
                .replacePlaceholder('disabled', disabled)
                .replacePlaceholder('date', this.date);
            projectCard.innerHTML = projectCardHtmlTemplate;
            if (projectURL != '#') {
                (_a = projectCard.querySelector('.project-card__link-to-project')) === null || _a === void 0 ? void 0 : _a.classList.add('interactable');
            }
            const tagsWrapper = projectCard.querySelector('.project-card__tags-wrapper');
            this.tags.map(tag => {
                const tagElement = document.createElement('span');
                tagElement.classList.add('tag');
                tagElement.innerText = tag;
                tagsWrapper.appendChild(tagElement);
            });
            return projectCard;
        });
    }
}
