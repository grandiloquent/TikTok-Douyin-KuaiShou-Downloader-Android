class CustomButtons extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "wrapper");
    const style = document.createElement('style');
    style.textContent = `.wrapper{
      display:flex;align-items: center;gap:8px;
      overflow-x:scroll;
      user-select:none;
      padding:16px;
      }
      .wrapper::-webkit-scrollbar{
        display:none;
      }
      `;
    this.wrapper = wrapper;
    this.shadowRoot.append(style, wrapper);
  }
  navigate(e) {
    this.dispatchEvent(new CustomEvent('submit', {
      detail: e.currentTarget.dataset.href
    }));
  }
  set data(value) {
    this.wrapper.innerHTML = value.map(element => {
      return `<custom-button style="flex-shrink:0" title="${element.title}" data-index="${element.id}"></custom-button>`
    }).join('');
    this.wrapper.querySelectorAll('custom-button').forEach(element => {
      element.addEventListener('click', evt => {
        this.click(evt);
      });
    })
  }
  click(evt) {
    const index = parseInt(evt.currentTarget.dataset.index);
    this.selected = index;
    this.dispatchEvent(new CustomEvent('submit', {
      detail: index
    }));
  }
  set selected(value) {
    this.wrapper.querySelectorAll('custom-button').forEach(element => {
      if (element.dataset.index == value) {
        element.setAttribute('selected', 'true');
      }else{
        element.setAttribute('selected', 'false');
      }
    })
  }
  connectedCallback() {
   
    this.selected = 0;
  }
  static get observedAttributes() {
    return ['title'];
  }
  attributeChangedCallback(name, oldValue, newValue) {
  }
}
customElements.define('custom-buttons', CustomButtons);
/*
<!--
<script type="module" src="./components/custom-buttons.js"></script>
<custom-buttons></custom-buttons>
customElements.whenDefined('custom-buttons').then(() => {
  customButtons.data = [
      {
        "title": "TikTok",
        "id": 0
      },
      {
        "title": "已收藏",
        "id": 1
      },
      {
        "title": "抖音",
        "id": 2
      },
      {
        "title": "快手",
        "id": 3
      },
      {
        "title": "头条",
        "id": 4
      },
      {
        "title": "Twitter",
        "id": 5
      },
      {
        "title": "B站",
        "id": 6
      },
      {
        "title": "YouTue",
        "id": 7
      },
      {
        "title": "已删除",
        "id": 8
      },
      {
        "title": "其他",
        "id": 9
      }
    ]
})
-->
*/