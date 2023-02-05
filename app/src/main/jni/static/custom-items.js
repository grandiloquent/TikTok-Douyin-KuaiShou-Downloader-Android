class CustomItems extends HTMLElement {

  constructor() {
    super();
    this.host = "https://www.tikwm.com";
    this.attachShadow({
      mode: 'open'
    });
    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "wrapper");
    const style = document.createElement('style');
    style.textContent = `.wrapper {
        padding: 0 16px;
      box-sizing:border-box;
      }
      
      .item {
        border-top: 1px solid #e8eaed;
        display: block;
        padding: 12px 0;
        display: flex;
      }
      
      .left {
        flex-grow: 1;
        overflow:hidden;
      }
      
      .image {
        flex-shrink:0;
        border: none;
        border-radius: 8px;
        object-fit: cover;
        align-self: end;
        margin-left: 16px;
        height: 92px;
        width: 92px;
      }
      
      .top {
        -webkit-box-orient: horizontal;
        flex-direction: row;
        color: #5f6368;
        display: flex;
        flex-wrap: wrap;
        letter-spacing: .01428571em;
        font-family: Roboto, Arial, sans-serif;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
      }
      
      .top-left {
        font-weight: 500;
      display:none;
      }
      
      .top-left:after {
        content: "\\0000a0\\002022\\0000a0";
        padding-right: 8px;
        padding-left: 6px;
      }
      
      .top-right {
        display: inline-flex;
      }
      
      .bottom {
        letter-spacing: .00625em;
        font-family: "Google Sans", Roboto, Arial, sans-serif;
        color: #202124;
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
        padding-top: 8px;
        display: -webkit-box;
          -webkit-box-orient: vertical;
          max-height: 3.75em;
          -webkit-line-clamp: 3;
          overflow: hidden;
          line-height: 1.25;
          text-overflow: ellipsis;
          font-weight: normal
      }`;
    this.wrapper = wrapper;
    this.shadowRoot.append(style, wrapper);
  }
  navigate(e) {
    this.dispatchEvent(new CustomEvent('submit', {
      detail: e.currentTarget.dataset.index
    }));
  }
  _copyTitle(e) {
    
    e.stopPropagation();
    writeText(e.currentTarget.textContent.trim())
  }
  set data(value) {
    if (value.length === 0) {
      this.wrapper.innerHTML = '';
      return;
    }
    const div = document.createElement('div');
    div.innerHTML = value.map(element => {
      let image;
      if (!element.cover.startsWith("https://") && !element.cover.startsWith("http://")) {
        image = `${this.host}/${element.cover}`
      } else {
        image = element.cover;
      }

      return `<div bind class="item" data-index="${element._id}" @click="navigate">
        <div class="left">
          <div class="top">
            <div class="top-left">
      
            </div>
            <div class="top-right">
      ${timeAgo(element.update_at * 1000)}
            </div>
          </div>
          <div class="bottom" bind @click="_copyTitle">
      ${element.title}
          </div>
        </div>
        <img class="image" src=${image}>
      </div>`
    }).join('');
    div.querySelectorAll('[bind]').forEach(element => {
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
    this.wrapper.appendChild(div);
  }

  connectedCallback() {
  }
}
customElements.define('custom-items', CustomItems);
/*
<!--
<script type="module" src="./components/custom-items.js"></script>
<custom-items></custom-items>
customElements.whenDefined('custom-items').then(() => {
  customItems.data = []
})
-->
*/
function timeSpan(atime, btime) {
  var milliseconds = +(btime || new Date()) - +atime;
  var seconds = ~~(milliseconds / 1000);
  var minutes = ~~(milliseconds / (1 * 60 * 1000));
  var hours = ~~(milliseconds / (1 * 60 * 60 * 1000));
  var days = ~~(milliseconds / (1 * 24 * 60 * 60 * 1000));
  var years = ~~(days / 365.5);
  return {
    years,
    days,
    hours,
    minutes,
    seconds,
    milliseconds
  };
}

function timeAgo(time, locales = 'zh') {
  const ts = timeSpan(time);
  if (!i18n[locales]) locales = 'zh';
  if (ts.seconds < 60) return i18n[locales].justNow;
  if (ts.minutes < 60) return ts.minutes + ' ' + i18n[locales].minutesAgo;
  if (ts.hours < 24) return ts.hours + ' ' + i18n[locales].hoursAgo;
  if (ts.days < 7) return ts.days + ' ' + i18n[locales].daysAgo;
  if (ts.days < 30) return ~~(ts.days / 7) + ' ' + i18n[locales].weeksAgo;
  if (ts.years < 1) return ~~(ts.days / 30) + ' ' + i18n[locales].monthsAgo;
  return ts.years + ' ' + i18n[locales].yearsAgo;
}

const i18n = {
  zh: {
    justNow: '刚刚',
    minutesAgo: '分钟前',
    hoursAgo: '小时前',
    daysAgo: '天前',
    weeksAgo: '周前',
    monthsAgo: '个月前',
    yearsAgo: '年前',
  },
  en: {
    justNow: 'just now',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    weeksAgo: 'weeks ago',
    monthsAgo: 'months ago',
    yearsAgo: 'years ago',
  },
};
async function writeText(strings) {
  if (typeof NativeAndroid !== 'undefined')
    NativeAndroid.writeText(strings);
  else {
    await navigator.clipboard.writeText(strings);
  }
}