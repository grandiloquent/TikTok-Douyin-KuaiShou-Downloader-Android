class CustomDialogActions extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "wrapper");
    const style = document.createElement('style');
    style.textContent = `.item{
      background:#fff;padding:9px 12px;display:flex;align-items: center;justify-content: center;
      }.wrapper {
  color: #0f0f0f;
  -webkit-text-size-adjust: 100%;
  font-size: 12px;
  z-index: 1002;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog {
  position: relative;
  z-index: 1002;
  max-height: 180px;
  overflow-y: auto;
  color: #0f0f0f;
  min-width: 250px;
  max-width: 356px;
  margin: 40px;
  border-radius: 8px;
  background-color: #fff;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background-color: #dadce0;
overflow-y:auto;

}
.dialog::-webkit-scrollbar{
display:none;
}
.overlay {
  font-family: Roboto, Arial, sans-serif;
  word-wrap: break-word;
  color: #0f0f0f;
  -webkit-text-size-adjust: 100%;
  font-size: 1.2rem;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.3);
}`;
    this.wrapper = wrapper;
    this.shadowRoot.append(style, wrapper);
  }
  navigate(e) {
    this.dispatchEvent(new CustomEvent('submit', {
      detail: e.currentTarget.dataset.href
    }));
  }
  close() {
    this.style.display = 'none';
  }
  set data(value) {
    this.wrapper.insertAdjacentHTML('afterbegin',`
    <div class="dialog">
    ${value.map(element => {
      return `<div bind class="item" data-index="${element.id}" @click="navigate">
      
      <div class="item-title">
      ${element.title}
        </div>
        </div>`
    }).join('')}
    </div>
    <div bind class="overlay" @click="close">
  </div>`);
    this.wrapper.querySelectorAll('[bind]').forEach(element => {
      if (element.getAttribute('bind')) {
        this[element.getAttribute('bind')] = element;
      }
      [...element.attributes].filter(attr => attr.nodeName.startsWith('@')).forEach(attr => {
        if (!attr.value) return;
        element.addEventListener(attr.nodeName.slice(1), evt => {
          this[attr.value](evt);
        });
      });
    })
  }
  navigate(evt) {
    const index = evt.currentTarget.dataset.index;
    this.dispatchEvent(new CustomEvent('submit', {
      detail: index
    }));
  }
  connectedCallback() {
  }
    static get observedAttributes() {
    return ['title'];
  }
  attributeChangedCallback(name, oldValue, newValue) {
  }
}
customElements.define('custom-dialog-actions', CustomDialogActions);
/*
<!--
<script type="module" src="./components/custom-dialog-actions.js"></script>
<custom-dialog-actions></custom-dialog-actions>
customElements.whenDefined('custom-dialog-actions').then(() => {
  customDialogActions.data = []
})
-->
*/