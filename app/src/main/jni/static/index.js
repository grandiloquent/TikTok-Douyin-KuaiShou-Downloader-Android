
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

customElements.whenDefined('custom-bottom-bar').then(() => {
  customBottomBar.data = [
    {
      path: `<path d="M18.984 20.016v-16.031h-1.969v3h-10.031v-3h-1.969v16.031h13.969zM12 2.016q-0.422 0-0.703 0.281t-0.281 0.703 0.281 0.703 0.703 0.281 0.703-0.281 0.281-0.703-0.281-0.703-0.703-0.281zM18.984 2.016q0.797 0 1.406 0.586t0.609 1.383v16.031q0 0.797-0.609 1.383t-1.406 0.586h-13.969q-0.797 0-1.406-0.586t-0.609-1.383v-16.031q0-0.797 0.609-1.383t1.406-0.586h4.172q0.328-0.891 1.078-1.453t1.734-0.563 1.734 0.563 1.078 1.453h4.172z"></path>    `,
      title: '粘贴',
      href: "paste"
    }, {
      path: `<path d="M12 3c0 0-6.186 5.34-9.643 8.232-0.203 0.184-0.357 0.452-0.357 0.768 0 0.553 0.447 1 1 1h2v7c0 0.553 0.447 1 1 1h3c0.553 0 1-0.448 1-1v-4h4v4c0 0.552 0.447 1 1 1h3c0.553 0 1-0.447 1-1v-7h2c0.553 0 1-0.447 1-1 0-0.316-0.154-0.584-0.383-0.768-3.433-2.892-9.617-8.232-9.617-8.232z"></path>`,
      title: '首页',
      href: "/"
    }, {
      path: `<path d="M9.984 16.5l6-4.5-6-4.5v9zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path>`,
      title: '视频',
      href: "videos"
    }, {
      path: `<path d="M12 15.516q1.453 0 2.484-1.031t1.031-2.484-1.031-2.484-2.484-1.031-2.484 1.031-1.031 2.484 1.031 2.484 2.484 1.031zM19.453 12.984l2.109 1.641q0.328 0.234 0.094 0.656l-2.016 3.469q-0.188 0.328-0.609 0.188l-2.484-0.984q-0.984 0.703-1.688 0.984l-0.375 2.625q-0.094 0.422-0.469 0.422h-4.031q-0.375 0-0.469-0.422l-0.375-2.625q-0.891-0.375-1.688-0.984l-2.484 0.984q-0.422 0.141-0.609-0.188l-2.016-3.469q-0.234-0.422 0.094-0.656l2.109-1.641q-0.047-0.328-0.047-0.984t0.047-0.984l-2.109-1.641q-0.328-0.234-0.094-0.656l2.016-3.469q0.188-0.328 0.609-0.188l2.484 0.984q0.984-0.703 1.688-0.984l0.375-2.625q0.094-0.422 0.469-0.422h4.031q0.375 0 0.469 0.422l0.375 2.625q0.891 0.375 1.688 0.984l2.484-0.984q0.422-0.141 0.609 0.188l2.016 3.469q0.234 0.422-0.094 0.656l-2.109 1.641q0.047 0.328 0.047 0.984t-0.047 0.984z"></path>`,
      title: '设置',
      href: "settings"
    }, {
      path: `<path d="M18.984 3h-14.016q-0.797 0-1.383 0.586t-0.586 1.43v13.969q0 0.844 0.586 1.43t1.43 0.586h9.984l6-6v-9.984q0-0.844-0.586-1.43t-1.43-0.586zM6.984 8.016h10.031v1.969h-10.031v-1.969zM12 14.016h-5.016v-2.016h5.016v2.016zM14.016 19.5v-5.484h5.484z"></path>
      `,
      title: '笔记',
      href: "notes"
    }]
})
customElements.whenDefined('custom-header').then(() => {
  customHeader.data = {
    title: '首页'
  }
})
customElements.whenDefined('custom-dialog-actions').then(() => {
  customDialogActions.data = [
    {
      "title": "视频",
      "id": 0
    },
    {
      "title": "背景音乐",
      "id": 1
    },
    {
      "title": "收藏",
      "id": 2
    },
    {
      "title": "删除",
      "id": 3
    },
    {
      "title": "播放",
      "id": 4
    }, {
      "title": "复制链接",
      "id": 5
    },
  ]
})

function showDrawer(evt) {
  evt.stopPropagation();
  customDrawer.setAttribute('expand', 'true');
}
function onCustomDrawer(evt) {
  location.href = evt.detail;
}
customElements.whenDefined('custom-drawer').then(() => {
  customDrawer.data = [{
    path: `<path d="M9.984 20.016h-4.969v-8.016h-3l9.984-9 9.984 9h-3v8.016h-4.969v-6h-4.031v6z"></path>
`,
    name: "首页",
    href: "/"
  }, {
    path: `<path d="M15.047 11.25q0.938-0.938 0.938-2.25 0-1.641-1.172-2.813t-2.813-1.172-2.813 1.172-1.172 2.813h1.969q0-0.797 0.609-1.406t1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406l-1.219 1.266q-1.172 1.266-1.172 2.813v0.516h1.969q0-1.547 1.172-2.813zM12.984 18.984v-1.969h-1.969v1.969h1.969zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path>      `,
    name: "说明文档",
    href: "/editor?id=112",
    divider: true
  }, {
    path: `<path d="M12.516 12.984q0-1.078 1.5-2.391t1.5-2.578q0-1.641-1.195-2.836t-2.836-1.195-2.813 1.195-1.172 2.836h2.016q0-0.797 0.586-1.406t1.383-0.609 1.406 0.609 0.609 1.406q0 0.656-0.469 1.172t-1.031 0.844-1.031 1.102-0.469 1.852h2.016zM12.516 16.5v-2.016h-2.016v2.016h2.016zM11.484 2.016q3.516 0 6.023 2.484t2.508 6q0 3.422-2.203 6.586t-5.813 4.898v-3h-0.516q-3.516 0-6-2.484t-2.484-6 2.484-6 6-2.484z"></path>`,
    name: "联系我们",
    href: "/message"
  }];
});
async function navigate(evt) {
  switch (evt.detail) {
    case "paste":
      await addVideo();
      break;
    case "videos":
      window.location = "/videos"
      break;
    case "settings":
      if (window.localStorage.getItem('order') === "1")
        window.localStorage.setItem("order", "0");
      else
        window.localStorage.setItem("order", "1");

      break;
    case "notes":
      location.href = "/notes";
      break;
    default:
      break;
  }
}
//////////////////////////////////////

async function onButtonsHandler(evt) {
  console.log(evt.detail)
  customItems.data = [];
  o = 0;
  if (intersectionObserver)
    intersectionObserver.unobserve(bottom);
  intersectionObserver = null;
  switch (evt.detail) {
    case 0:
      await render(1, l, o);
      window.history.replaceState(null, null, "?t=1");
      break;
    case 1:
      await render(-2, l, o);
      window.history.replaceState(null, null, "?t=-2");
      break;
    case 2:
      await render(3, l, o);
      window.history.replaceState(null, null, "?t=3");
      break;
    case 3:
      await render(5, l, o);
      window.history.replaceState(null, null, "?t=5");
      break;
    case 4:
      await render(4, l, o);
      window.history.replaceState(null, null, "?t=4");
      break; 5
    case 5:
      await render(2, l, o);
      window.history.replaceState(null, null, "?t=2");
      break;
    case 9:
      await render(-1, l, o);
      window.history.replaceState(null, null, "?t=-1");
      break;
  }
}

async function onItemsHandler(evt) {
  customDialogActions.removeAttribute('style');
  customDialogActions.dataset.id = evt.detail;
}

async function onActionsHanlder(evt) {
  const id = evt.currentTarget.dataset.id;
  console.log(evt.detail)
  switch (evt.detail) {
    case "0":
      await downloadVideo(id, true, false);
      break;
    case "2":
      await addFav(id);
      break;
    case "3":
      deleteVideo(id);
      break;
    case "4":
      await downloadVideo(id, true, true);
      break;
    case "5":
      copyUrl(id);
      break;
    default:
      break;
  }
}
async function addFav(id) {
  try {
    const response = await fetch(`${baseUri}/api/video?t=-2&id=${id}`);
    if (response.status > 399 || response.status < 200) {
      throw new Error(`${response.status}: ${response.statusText}`)
    }
    await response.text();
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
}
async function onDialogHandler(evt) {
  if (evt.detail !== 2) return;
  const id = evt.currentTarget.dataset.id;
  const response = await fetch(`${baseUri}/api/tiktok?action=3&id=${id}`);
  if (response.status > 399 || response.status < 200) {
    throw new Error(`${response.status}: ${response.statusText}`)
  }
  await response.text();
  window.location.reload();
}
async function deleteVideo(id) {
  customDialogActions.setAttribute('style', 'display:none');
  customDialog.removeAttribute('style');
  customDialog.title = "询问"
  customDialog.message = "您确定要删除吗？"
  customDialog.dataset.id = id;
}
async function loadVideo(id) {
  const response = await fetch(`${baseUri}/api/tiktok?action=2&id=${id}`);
  if (response.status > 399 || response.status < 200) {
    throw new Error(`${response.status}: ${response.statusText}`)
  }
  return await response.json();
}

async function downloadVideo(id, hd, isPlay) {
  let obj = await loadVideo(id);
  customDialogActions.setAttribute('style', 'display:none');
  let uri = `${obj.play}`;
  if (uri.startsWith("/")) {
    uri = "https://www.tikwm.com" + (hd ? uri : uri.replace('/hdplay', '/play'));
  }
  let fileName = substringAfterLast(uri, "/");
  if (obj.video_type === "4") {

    const response = await fetch(`${baseUri}/api/toutiao?action=1&q=${obj.url}`);
    if (response.status > 399 || response.status < 200) {
      throw new Error(`${response.status}: ${response.statusText}`)
    }
    fileName = obj.title + ".mp4";
    uri = await response.text();
    uri = decodeURIComponent(uri);
    /*
     obj = await response.json();
    fileName = obj.data.title + ".mp4";
    obj = obj.data.videoResource.normal.video_list;
     uri = Object.keys(obj).map(x => {
        return obj[x]
      }).sort((x, y) => {
        return y.size - x.size
      })[1].main_url;
    uri = atob(uri);
    */

  }
  if (obj.video_type === "-1") {
    const response = await fetch(`${baseUri}/api/xvideos?action=1&q=${substringAfterLast(obj.url, "www.xvideos.com")}`);
    if (response.status > 399 || response.status < 200) {
      throw new Error(`${response.status}: ${response.statusText}`)
    }
    fileName = obj.title + ".mp4";
    uri = await response.text();
  }
  if (isPlay) {
    window.open(`/video?q=${encodeURIComponent(uri)}`)
  } else {
    if (typeof NativeAndroid !== 'undefined') {
      NativeAndroid.downloadFile(fileName, uri);
    } else {
      await navigator.clipboard.writeText(uri)
      window.open(uri, '_blank');
    }
  }
}

async function copyUrl(id) {
  let obj = await loadVideo(id);
  customDialogActions.setAttribute('style', 'display:none');
  let uri = `${obj.url}`;
  if (obj.video_type === "-1") {
    uri = `https://www.xvideos.com${uri}`;
  }

  writeText(uri);
}
async function loadData(t, l, o) {

  const response = await fetch(`${baseUri}/api/tiktok?action=1&t=${t}&l=${l}&o=${o}` + (s ? "&s=1" : ''));
  if (response.status > 399 || response.status < 200) {
    throw new Error(`${response.status}: ${response.statusText}`)
  }
  return await response.json();

}


// customItems
let loaded = false;

async function render(t, l, o) {
  try {
    const data = await loadData(t, l, o);
    if (!loaded) {
      await customElements.whenDefined('custom-items');
      loaded = true;
    }
    customItems.data = data

    if (data.length >= 20 && !intersectionObserver) {

      intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            o += l;
            try {
              await render((new URL(window.location).searchParams.get("t") || "1"), l, o)
            } catch (error) {
              intersectionObserver.unobserve(bottom);
            }
          }
        });
      });
      intersectionObserver.observe(bottom);
    }
    //customItems.data = data;
  } catch (error) {
    console.log(error);
    return null;
  }
}


async function addVideo() {
  customDialogSpinner.removeAttribute('style');
  let strings = await readText();
  try {
    if (strings.indexOf("tiktok.com") != -1) {
      await saveVideo('tiktok', strings);
    }
    // https://twitter.com/i/status/1613267285279383566
    if (strings.indexOf("twitter.com") != -1) {
      await saveVideo("twitter", /(?<=\/)[0-9]+/.exec(strings)[0]);
    }
    if (strings.indexOf("v.douyin.com") != -1) {
      await saveVideo("douyin", substring(strings, "https://v.douyin.com", " "));
    }
    if (strings.indexOf("m.toutiao.com") != -1) {
      await saveVideo("toutiao", substring(strings, "https://m.toutiao.com", " "));
    }
    if (strings.indexOf("v.kuaishou.com") != -1) {
      await saveVideo("kuaishou", substring(strings, "https://v.kuaishou.com", " "));
    }
    if (strings.indexOf("www.xvideos.com") != -1) {
      await saveVideo("xvideos", substringAfterLast(strings, "https://www.xvideos.com"));
    }
    location.reload();
  } catch (error) {
    customToast.setAttribute('message', '发生错误')
  }
  customDialogSpinner.setAttribute('style', 'display:none');
}

async function saveVideo(uri, q) {
  const response = await fetch(`${baseUri}/api/${uri}?q=${encodeURIComponent(q)}`);
  if (response.status > 399 || response.status < 200) {
    throw new Error(`${response.status}: ${response.statusText}`)
  }
  return await response.text();
}

function substringAfterLast(string, delimiter, missingDelimiterValue) {
  const index = string.lastIndexOf(delimiter);
  if (index === -1) {
    return missingDelimiterValue || string;
  } else {
    return string.substring(index + delimiter.length);
  }
}
function substringBefore(string, delimiter, missingDelimiterValue) {
  const index = string.indexOf(delimiter);
  if (index === -1) {
    return missingDelimiterValue || string;
  } else {
    return string.substring(0, index);
  }
}
function substring(strings, prefix, suffix) {
  let start = strings.indexOf(prefix);
  if (start === -1) {
    return strings;
  }
  start += prefix.length;
  let end = strings.indexOf(suffix, start);
  if (end === -1) {
    return strings;
  }
  return strings.substring(start, end);
}

async function readText() {
  let strings;
  if (typeof NativeAndroid !== 'undefined')
    strings = NativeAndroid.readText();
  else {
    strings = await navigator.clipboard.readText();
  }
  return strings;
}
async function writeText(strings) {
  if (typeof NativeAndroid !== 'undefined')
    NativeAndroid.writeText(strings);
  else {
    await navigator.clipboard.writeText(strings);
  }
}
//////////////////////////////////////
let baseUri = window.location.host === '127.0.0.1:5500' ? 'http://192.168.0.109:10808' : '';

const t = new URL(window.location).searchParams.get("t") || "1";
let l = 20, o = 0, intersectionObserver, s = parseInt(window.localStorage.getItem("order") || "0");
customElements.whenDefined('custom-buttons').then(() => {
  if (t === "1") {
    customButtons.selected = 0;
  }
  if (t === "-2") {
    customButtons.selected = 1;
  }
  if (t === "3") {
    customButtons.selected = 2;
  }
  if (t === "5") {
    customButtons.selected = 3;
  }
  if (t === "4") {
    customButtons.selected = 4;
  }
  if (t === "2") {
    customButtons.selected = 5;
  }
  if (t === "-1") {
    customButtons.selected = 9;
  }
})

render(t, l, o);


var dropZone = document.querySelector('body');
dropZone.addEventListener('dragover', function (e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'
});
dropZone.addEventListener('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();
    uploadFiles(e.dataTransfer.files)
});

async function uploadFiles(files) {
    document.querySelector('.dialog').className = 'dialog dialog-show';
    const dialogContext = document.querySelector('.dialog-content span');
    const length = files.length;
    let i = 1;
    for (let file of files) {
        dialogContext.textContent = `正在上传 (${i++}/${length}) ${file.name} ...`;
        const formData = new FormData;
        formData.append('file', file, file.name);
        try {
            await fetch(`${baseUri}/post`, {
                method: "POST",
                body: formData
            }).then(res => console.log(res))
        } catch (e) {
        }
    }
    document.querySelector('.dialog').className = 'dialog'
}
