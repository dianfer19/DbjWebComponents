// dbj-icon.js
const ICONS = {
    sparkle: {
        viewBox: "0 0 24 24",
        body: `<path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>`
    },
    download: {
        viewBox: "0 0 24 24",
        body: `<path d="M12 3v10m0 0l-4-4m4 4l4-4M4 17h16v2H4z"
            stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>`
    }
    // Agrega más íconos a tu “registro” cuando quieras
};
const cssURL = new URL('./style.css', import.meta.url).href;

class DbjIcon extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssURL;
        shadow.append(link);
        shadow.innerHTML += /*html*/`
        <link rel="stylesheet" href="style.css">
        <svg part="svg" aria-hidden="true"></svg>
    `;
    }

    static get observedAttributes() {
        return ["name", "size", "color", "label"];
    }

    connectedCallback() {
        this.#render();
    }

    attributeChangedCallback() {
        this.#render();
    }

    #render() {
        const name = this.getAttribute("name") || "sparkle";
        const size = this.getAttribute("size");
        const color = this.getAttribute("color");
        const label = this.getAttribute("label"); // accesibilidad opcional

        const data = ICONS[name];
        const svg = this.shadowRoot.querySelector("svg");
        if (!data) {
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.innerHTML = ""; // o un fallback
            return;
        }

        svg.setAttribute("viewBox", data.viewBox);
        svg.innerHTML = data.body;

        // A11y
        if (label) {
            svg.setAttribute("role", "img");
            svg.setAttribute("aria-label", label);
            svg.removeAttribute("aria-hidden");
        } else {
            svg.setAttribute("aria-hidden", "true");
            svg.removeAttribute("role");
            svg.removeAttribute("aria-label");
        }

        // Estilos por atributos
        if (size) this.style.setProperty("--icon-size", /^\d+$/.test(size) ? `${size}px` : size);
        if (color) this.style.setProperty("--icon-color", color);
    }
}

customElements.define("dbj-icon", DbjIcon);
