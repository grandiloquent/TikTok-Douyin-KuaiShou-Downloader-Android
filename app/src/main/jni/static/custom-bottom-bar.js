class CustomBottomBar extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "wrapper");
    const style = document.createElement('style');
    style.textContent = ` .item-title {
      max-width: 100%;
      padding: 0 4px;
      box-sizing: border-box;
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    
    .item {
    
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1 1 0%;
      min-width: 0;
      flex-direction: column;
    
    }
    
    .wrapper {
      display: flex;
      justify-content: space-around;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
      z-index: 3;
      height: 48px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      color: #0f0f0f;
      font-size: 12px;
      background: #fff;
    user-select:none;
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
    this.wrapper.insertAdjacentHTML('afterbegin',value.map(element => {
      return `<div bind class="item"  data-href="${element.href}" @click="navigate">
      <svg viewBox="0 0 24 24" style="width:24px;height:24px;">
      ${element.path}
      </svg>
      <div class="item-title">
      ${element.title}
        </div>
        </div>`
    }).join(''));
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
 
  connectedCallback() {
  }
}
customElements.define('custom-bottom-bar', CustomBottomBar);
/*
<!--
<script type="module" src="./components/custom-bottom-bar.js"></script>
<custom-bottom-bar></custom-bottom-bar>
customElements.whenDefined('custom-bottom-bar').then(() => {
  customBottomBar.data = []
})
-->
*/
