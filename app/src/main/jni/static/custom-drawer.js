class CustomDrawer extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "wrapper");
    const style = document.createElement('style');
    style.textContent = `.name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .main {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
    }
    
    .overlay {
      position: fixed;
      right: 0;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 991;
      cursor: pointer;
    }
    
    .top {
      position: relative;
      top: 2px;
      -webkit-user-select: none;
      min-height: 48px;
      display: table-cell;
      height: 48px;
      vertical-align: middle;
      padding-top: 4px;
      padding-bottom: 4px;
      padding-left: 16px;
    }
    
    .item {
      text-decoration: none;
      letter-spacing: .01785714em;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      height: 48px;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      padding-left: 24px;
      padding-right: 12px;
      margin-right: 8px;
      border-radius: 0 50px 50px 0;
      cursor: pointer;
      color: inherit;
    }
    
    .wrapper {
      background-color: #fff;
      bottom: 0;
      color: #000;
      overflow-x: hidden;
      position: fixed;
      top: 0;
      bottom: 0;
      z-index: 992;
      will-change: visibility;
      display: flex;
      flex-direction: column;
    }
    
    .divider {
      border-bottom: 1px solid #e8eaed;
      margin: 8px 8px 8px 0;
    }
    `;
    wrapper.style = 'transition:transform .25s cubic-bezier(0.4,0.0,0.2,1),visibility 0s linear .25s;transform:translateX(-264px)'
    const top = document.createElement('div');
    top.setAttribute("class", "top");
    const main = document.createElement('div');
    main.setAttribute("class", "main");
    wrapper.append(top, main);
    this.wrapper = wrapper;
    this.main = main;
    const overlay = document.createElement('div');
    overlay.setAttribute("class", "overlay");
    overlay.style.display = 'none';
    this.overlay = overlay;
    this.shadowRoot.append(style, wrapper, overlay);
    overlay.addEventListener('click', () => {
      this.wrapper.style = 'transition:transform .25s cubic-bezier(0.4,0.0,0.2,1),visibility 0s linear .25s;transform:translateX(-264px)'
      this.overlay.style.display = 'none';
    })
  }
 
  set data(value) {
    value.forEach(element => {
      const item = document.createElement('div');
      item.setAttribute("bind", "");
      item.setAttribute("class", "item");
 
      this.main.appendChild(item);
      const div = document.createElement('div');
      div.style.width = "24px";
      div.style.height = "24px";
      div.style.fill = "currentColor";
      div.style.color = "#333";
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.justifyContent = "center";
      div.style.marginRight = "16px";
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.style.width = "24px";
      svg.style.height = "24px";
      item.appendChild(div);
      div.appendChild(svg);
      svg.innerHTML = `${element.path}`;
      const name = document.createElement('div');
      name.setAttribute("class", "name");
      item.appendChild(name);
      name.textContent = `${element.name}`;
      item.addEventListener('click', evt => {
        this.dispatchEvent(new CustomEvent('submit', {
          detail:element.href
        }));
      })
    });

  }

  connectedCallback() {

  }
  static get observedAttributes() {
    return ['expand'];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "expand") {
      this.wrapper.style = 'transform: translateX(0);visibility: visible;box-shadow: 0 0 16px rgba(0,0,0,.28);transition: transform .25s cubic-bezier(0.4,0.0,0.2,1),visibility 0s linear 0s;overflow-y: visible;width: 256px;';
      this.overlay.style.display = 'block';
    }
  }
}
customElements.define('custom-drawer', CustomDrawer);
/*
<!--
<script type="module" src="./components/custom-drawer.js"></script>
<custom-drawer></custom-drawer>
customElements.whenDefined('custom-drawer').then(() => {
  customDrawer.data = []
})
-->
*/