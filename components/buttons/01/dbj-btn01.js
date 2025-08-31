// dbj-btn01.js
const cssURL = new URL('./style.css', import.meta.url).href;

class DbjBtn01 extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssURL;
        shadow.append(link);
        shadow.innerHTML += /*html*/`
          <button class="btn" part="button" type="button" aria-disabled="false">
            <slot name="icon">
              <!-- Icono por defecto -->
              <svg height="24" width="24" viewBox="0 0 24 24" class="sparkle" aria-hidden="true">
                <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
              </svg>
            </slot>
            <span class="text"></span>
          </button>
    `;
    }

    static get observedAttributes() {
        return ["label", "variant", "disabled"];
    }

    // opcional: property API (para usar btn.label = '...';)
    get label() {
        return this.getAttribute("label") ?? "";
    }

    set label(v) {
        this.setAttribute("label", v ?? "");
    }

    // método privado: emite el evento externo "dbj-click"
    #onClick = (ev) => {
        if (this.hasAttribute("disabled")) {
            ev.preventDefault();
            return;
        }
        this.dispatchEvent(new CustomEvent("dbj-click", {bubbles: true, composed: true}));
    };

    connectedCallback() {
        this.#syncLabel();
        this.#syncDisabled();
        this.shadowRoot.querySelector("button")?.addEventListener("click", this.#onClick);
    }

    disconnectedCallback() {
        this.shadowRoot.querySelector("button")?.removeEventListener("click", this.#onClick);
    }

    attributeChangedCallback(name) {
        if (name === "label") this.#syncLabel();
        if (name === "disabled") this.#syncDisabled();
        // "variant" lo manejas con CSS via :host([variant="..."])
    }

    #syncLabel() {
        const label = this.getAttribute("label") ?? "Generate"; // fallback
        const textEl = this.shadowRoot.querySelector(".text");
        if (textEl) textEl.textContent = label;

        // Accesibilidad: el botón “dice” el label
        const btn = this.shadowRoot.querySelector("button");
        if (btn) btn.setAttribute("aria-label", label);
    }

    #syncDisabled() {
        const btn = this.shadowRoot.querySelector("button");
        if (!btn) return;
        const isDisabled = this.hasAttribute("disabled");
        btn.toggleAttribute("disabled", isDisabled);
        btn.setAttribute("aria-disabled", String(isDisabled));
    }
}

customElements.define("dbj-btn01", DbjBtn01);
