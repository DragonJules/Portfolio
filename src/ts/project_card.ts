import './utils.js'
import './string.js'

const projectCardClasses = ['project-card', 'glass', 'scroll-reveal', 'shown']

export class ProjectCard {
    name: string;
    tags: string[];
    thumbnail_src: string;
    description: string;
    url: string | null;
    date: string;

    constructor (name: string, tags: string[], thumbnail_src: string, description: string, url: string | null, date: string) {
        this.name = name;
        this.tags = tags;
        this.thumbnail_src = thumbnail_src;
        this.description = description;
        this.url = url;
        this.date = date;
    }

    async render(projectCardHtmlTemplate: string): Promise<HTMLDivElement> { 
        const projectCard = document.createElement('div')
        projectCardClasses.forEach(className => projectCard.classList.add(className))

        let projectURL = this.url
        let disabled = ''
        if (!projectURL) {
            projectURL = '#'
            disabled = 'disabled'
        }

        projectCardHtmlTemplate = projectCardHtmlTemplate.replacePlaceholder('name', this.name)
            .replacePlaceholder('thumbnail_src', this.thumbnail_src)
            .replacePlaceholder('description', this.description)
            .replacePlaceholder('url', projectURL)
            .replacePlaceholder('disabled', disabled)
            .replacePlaceholder('date', this.date)

        projectCard.innerHTML = projectCardHtmlTemplate

        if (projectURL != '#') {
            projectCard.querySelector('.project-card__link-to-project')?.classList.add('interactable')
        }

        const tagsWrapper = projectCard.querySelector('.project-card__tags-wrapper')!

        this.tags.map(tag => {
            const tagElement = document.createElement('span')
            tagElement.classList.add('tag')
            tagElement.innerText = tag
            tagElement.setAttribute('aria-label', `Tag ${tag}`)
            tagsWrapper.appendChild(tagElement)
        })

        return projectCard
    }
}