class CustomButton extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "wrapper");
    const style = document.createElement('style');
    style.textContent = `.wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      white-space: nowrap;
      outline: none;
      letter-spacing: .01785714em;
      font-family: "Google Sans", Roboto, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      border-radius: 24px;
      box-sizing: border-box;
      border: 1px solid #dadce0;
      color: #3c4043;
      padding: 5px 13px;
    }
    
    .selected {
      border: 1px solid transparent;
      background: #e8f0fe;
      color: #1967d2;
    }`;
    this.wrapper = wrapper;
    this.shadowRoot.append(style, wrapper);
  }
  navigate(e) {
    this.dispatchEvent(new CustomEvent('submit', {
      detail: e.currentTarget.dataset.href
    }));
  }


  connectedCallback() {
    this.wrapper.textContent = this.getAttribute('title');
    if (this.getAttribute('selected')==='true') {
      this.wrapper.classList.add('selected');
    }
  }
  static get observedAttributes() {
    return ['title', 'selected'];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'selected') {
      if(newValue==='true') {
        this.wrapper.classList.add('selected');
      }else{
        this.wrapper.classList.remove('selected');
      }
    }
  }
}
customElements.define('custom-button', CustomButton);
/*
<!--
<script type="module" src="./components/custom-button.js"></script>
<custom-button></custom-button>
customElements.whenDefined('custom-button').then(() => {
  customButton.data = []
})
-->
*/