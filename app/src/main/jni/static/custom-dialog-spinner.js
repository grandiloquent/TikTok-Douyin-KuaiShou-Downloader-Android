class CustomDialogSpinner extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "wrapper");
    const style = document.createElement('style');
    style.textContent = `.wrapper{position:fixed;top:0;left:0;right:0;bottom:0;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;z-index:4;margin:0 40px;padding:0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);}.dialog{position:relative;z-index:2;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;max-height:100%;box-sizing:border-box;padding:16px;margin:0 auto;overflow-x:hidden;overflow-y:auto;font-size:13px;color:#0f0f0f;border:none;min-width:250px;max-width:356px;box-shadow:0 0 24px 12px rgba(0,0,0,0.25);border-radius:12px;background-color:#fff;}.dialog-header{display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;flex-shrink:0;}.h2{margin:0 0 3px;display:-webkit-box;-webkit-box-orient:vertical;max-height:2.5em;-webkit-line-clamp:2;overflow:hidden;line-height:1.25;text-overflow:ellipsis;font-weight:normal;font-size:18px;}
    .dialog-body{
   display: flex;
      align-items: center;
      justify-content: center;
    
     overflow-y:auto;overflow-x:hidden;max-height:100vh;white-space:pre-wrap;
    
    flex-direction:column;
    }.dialog-buttons{display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:end;justify-content:flex-end;margin-top:12px;}.button{display:flex;align-items:center;justify-content:center;padding:0 16px;height:36px;font-size:14px;line-height:36px;border-radius:18px;color:#0f0f0f;}.disabled{color:#909090}.overlay{position:fixed;top:0;bottom:0;left:0;right:0;z-index:1;cursor:pointer;background-color:rgba(0,0,0,0.3);}
    @keyframes spinner {
      0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg)
      }
  
      100% {
          -webkit-transform: rotate(1turn);
          transform: rotate(1turn)
      }
  }
  
  .spinner {
      display: block;
      box-sizing: border-box;
      margin: 12px auto;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #eee;
      border-top-color: #666;
      -webkit-animation: spinner .8s linear infinite;
      animation: spinner .8s linear infinite
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
    this.wrapper.insertAdjacentHTML('afterbegin',`<div class="dialog">
    <div class="dialog-body" >
    
    <div class="spinner">
      </div>
   <div> 加载中...</div></div>
  </div>
<div class="overlay" >
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
    static get observedAttributes() {
    return ['title'];
  }
  attributeChangedCallback(name, oldValue, newValue) {
  }
}
customElements.define('custom-dialog-spinner', CustomDialogSpinner);
/*
<!--
<script type="module" src="./components/custom-dialog-spinner.js"></script>
<custom-dialog-spinner></custom-dialog-spinner>
customElements.whenDefined('custom-dialog-spinner').then(() => {
  customDialogSpinner.data = []
})
-->
*/