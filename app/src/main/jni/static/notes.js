function bindCustomElements() {
  customElements.whenDefined('custom-drawer').then(() => {
    customDrawer.data = [{
      path: `<path d="M9.984 20.016h-4.969v-8.016h-3l9.984-9 9.984 9h-3v8.016h-4.969v-6h-4.031v6z"></path>
  `,
      name: "首页",
      href: "/"
    }, {
      path: `<path d="M18.984 3h-14.016q-0.797 0-1.383 0.586t-0.586 1.43v13.969q0 0.844 0.586 1.43t1.43 0.586h9.984l6-6v-9.984q0-0.844-0.586-1.43t-1.43-0.586zM6.984 8.016h10.031v1.969h-10.031v-1.969zM12 14.016h-5.016v-2.016h5.016v2.016zM14.016 19.5v-5.484h5.484z"></path>`, name: "新建文档",
      href: "/editor",
      divider: true
    }];
  });
}
function bindElementsAndEvents() {
  document.querySelectorAll('[bind]').forEach(element => {
    if (element.getAttribute('bind')) {
      window[element.getAttribute('bind')] = element;
    }
    [...element.attributes].filter(attr => attr.nodeName.startsWith('@')).forEach(attr => {
      if (!attr.value) return;
      element.addEventListener(attr.nodeName.slice(1), evt => {
        window[attr.value](evt);
      });
    });
  })
}
async function loadLabels() {
  const res = await fetch(`${baseUri}/api/note?action=2`);
  labels = await res.json();
  customElements.whenDefined('custom-buttons').then(() => {
    customButtons.data = labels;
  })
}
async function onButtonsHandler(evt) {
  this.wrapper.innerHTML = "";
  const tag = labels.filter(x => x.id == evt.detail)[0].title;
  history.pushState(null, null, `?tag=${encodeURIComponent(tag)}`)
  render(tag);
}
function onCustomDrawer(evt) {
  location.href = evt.detail;
}
async function render(tag) {
  const res = await fetch(`${baseUri}/api/note?tag=${encodeURIComponent(tag)}`);
  (await res.json()).forEach(x => {
    const div = document.createElement('div');
    div.style = '-webkit-tap-highlight-color: transparent;border-top: 1px solid #dadce0;padding: 8px 0;min-height: 43px;box-sizing: border-box;display: flex;-webkit-box-pack: justify;justify-content: space-between;-webkit-box-align: center;align-items: center';
    const text = document.createElement('div');
    // .6875rem
    text.style = `-webkit-tap-highlight-color: transparent;display: flex;-webkit-box-align: center;align-items: center;letter-spacing: .07272727em;font-family: Roboto,Arial,sans-serif;font-size: 14px;font-weight: 500;text-transform: uppercase;color: #5f6368;line-height: .6875rem;margin-right: 8px;white-space: nowrap`;
    div.appendChild(text);
    text.textContent = x.title;
    this.wrapper.appendChild(div);
    div.addEventListener('click', evt => {
      location.href = `${baseUri}/editor?id=${x.id}`;
    })
  })
}
function showDrawer(evt) {
  evt.stopPropagation();
  customDrawer.setAttribute('expand', 'true');
}
////////////////////////////////
let baseUri = window.location.host === '127.0.0.1:5500' ? 'http://192.168.8.55:10808' : '';
let labels;
function initialize() {
  bindElementsAndEvents();
  bindCustomElements();
  loadLabels();
  window.addEventListener('popstate', evt => {
    let tag = new URL(window.location).searchParams.get('tag');
    this.wrapper.innerHTML = "";
    customButtons.selected = labels.filter(x => x.title == tag)[0].id;
    render(tag);
  })
  const tag = new URL(window.location).searchParams.get('tag');
  if (tag) {
    render(tag);
  }

}
initialize();
function onClose() {
  searchWrapper.style.display = 'none'
}
async function onInput(evt) {
  if (evt.key === "Enter") {
    evt.preventDefault();
    let q = input.value;
    let action = 3;
    if (q.startsWith("*")) {
      action = 4;
      q = q.substring(1);
    }
    const res = await fetch(`${baseUri}/api/note?action=${action}&q=${encodeURIComponent(q)}`);
    const items = await res.json();
    this.wrapper.innerHTML = '';
    console.log(items);
    items.forEach(x => {
      const div = document.createElement('div');
      div.style = '-webkit-tap-highlight-color: transparent;border-top: 1px solid #dadce0;padding: 8px 0;min-height: 43px;box-sizing: border-box;display: flex;-webkit-box-pack: justify;justify-content: space-between;-webkit-box-align: center;align-items: center';
      const text = document.createElement('div');
      // .6875rem
      text.style = `-webkit-tap-highlight-color: transparent;display: flex;-webkit-box-align: center;align-items: center;letter-spacing: .07272727em;font-family: Roboto,Arial,sans-serif;font-size: 14px;font-weight: 500;text-transform: uppercase;color: #5f6368;line-height: .6875rem;margin-right: 8px;white-space: nowrap`;
      div.appendChild(text);
      text.textContent = x.title;
      this.wrapper.appendChild(div);
      div.addEventListener('click', evt => {
        location.href = `${baseUri}/editor?id=${x.id}`;
      })
    });
    searchWrapper.style.display = 'none'

  }
}

function onSearch() {
  searchWrapper.style.display = 'block'
}