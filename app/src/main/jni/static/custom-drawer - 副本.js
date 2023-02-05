import {
  LitElement,
  html,
  css
} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
export class CustomDrawer extends LitElement {
  static properties = {
    expand: {},
    data: {}
  };
  static styles = css`.name {
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

  constructor() {
    super();
    this.data = [{
      path: `<path d="M9.984 20.016h-4.969v-8.016h-3l9.984-9 9.984 9h-3v8.016h-4.969v-6h-4.031v6z"></path>
`,
      name: "首页",
      href: "/"
    }, {
      path: `<path d="M15.047 11.25q0.938-0.938 0.938-2.25 0-1.641-1.172-2.813t-2.813-1.172-2.813 1.172-1.172 2.813h1.969q0-0.797 0.609-1.406t1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406l-1.219 1.266q-1.172 1.266-1.172 2.813v0.516h1.969q0-1.547 1.172-2.813zM12.984 18.984v-1.969h-1.969v1.969h1.969zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path>      `,
      name: "说明文档",
      href: "/help",
      divider: true
    }, {
      path: `<path d="M12.516 12.984q0-1.078 1.5-2.391t1.5-2.578q0-1.641-1.195-2.836t-2.836-1.195-2.813 1.195-1.172 2.836h2.016q0-0.797 0.586-1.406t1.383-0.609 1.406 0.609 0.609 1.406q0 0.656-0.469 1.172t-1.031 0.844-1.031 1.102-0.469 1.852h2.016zM12.516 16.5v-2.016h-2.016v2.016h2.016zM11.484 2.016q3.516 0 6.023 2.484t2.508 6q0 3.422-2.203 6.586t-5.813 4.898v-3h-0.516q-3.516 0-6-2.484t-2.484-6 2.484-6 6-2.484z"></path>`,
      name: "联系我们",
      href: "/message"
    }];
  }
  show() {
    this.expand = true;
  }
  hide() {
    this.expand = null;
  }
  render() {

    return html`
    <!--
    -->
<div class="wrapper" style="${this.expand ? 'transform: translateX(0);visibility: visible;box-shadow: 0 0 16px rgba(0,0,0,.28);transition: transform .25s cubic-bezier(0.4,0.0,0.2,1),visibility 0s linear 0s;overflow-y: visible;width: 256px;' : 'transition:transform .25s cubic-bezier(0.4,0.0,0.2,1),visibility 0s linear .25s;transform:translateX(-264px)'}" @click="${this.hide}">
  <div class="top">
  </div>
  <div class="main">
    ${this.data.map((element, index) => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.innerHTML = element.path;

      return html`${element.divider ? html`<div class="divider"></div>` : ''}<a class="item" href="${element.href}">
<div
  style="width: 24px;height: 24px;fill: currentColor;color: #333;display:flex;align-items: center;justify-content: center;margin-right: 16px;">
  ${svg}
</div> 
      <div class="name">
        ${element.name}
      </div>
    </a>`;
    })}
  </div>
</div>
<div class="overlay" @click="${this.hide}" style="${this.expand ? 'display:block' : 'display:none'}"></div>`;
  }
  connectedCallback() {
    super.connectedCallback();

  }
  disconnectedCallback() { }
}
customElements.define('custom-drawer', CustomDrawer);
/*
<!--
<script type="module" src="./components/custom-drawer.js"></script>
<custom-drawer></custom-drawer>


-->
*/