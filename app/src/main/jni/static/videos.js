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


customElements.whenDefined('custom-bottom-bar').then(() => {
    customBottomBar.data = [{
        path: `<path d="M12 3c0 0-6.186 5.34-9.643 8.232-0.203 0.184-0.357 0.452-0.357 0.768 0 0.553 0.447 1 1 1h2v7c0 0.553 0.447 1 1 1h3c0.553 0 1-0.448 1-1v-4h4v4c0 0.552 0.447 1 1 1h3c0.553 0 1-0.447 1-1v-7h2c0.553 0 1-0.447 1-1 0-0.316-0.154-0.584-0.383-0.768-3.433-2.892-9.617-8.232-9.617-8.232z"></path>`,
        title: '首页',
        href: "home"
    }, {
        path: `<path d="M9.984 16.5l6-4.5-6-4.5v9zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path>`,
        title: '视频',
        href: "videos"
    }, {
        path: `<path d="M17.672 6.328l2.344-2.344v7.031h-7.031l3.234-3.234q-1.781-1.781-4.219-1.781-2.484 0-4.242 1.758t-1.758 4.242 1.758 4.242 4.242 1.758q1.734 0 3.398-1.172t2.273-2.813h2.063q-0.656 2.625-2.813 4.313t-4.922 1.688q-3.281 0-5.625-2.344t-2.344-5.672 2.344-5.672 5.625-2.344q1.406 0 3.070 0.68t2.602 1.664z"></path>    `,
        title: '刷新',
        href: "refresh"
    }]
})

customElements.whenDefined('custom-dialog-actions').then(() => {
    customDialogActions.data = [
        {
            "title": "分享",
            "id": 0
        },
        {
            "title": "删除",
            "id": 1
        },
        {
            "title": "播放",
            "id": 2
        }
    ]
  })


function showDrawer(evt) {
    evt.stopPropagation();
    customDrawer.setAttribute('expand', 'true');
}

async function navigate(evt) {
    switch (evt.detail) {
        case "home":
            window.location = '/';
            break;
        case "refresh":
            if (typeof NativeAndroid !== 'undefined') {
                NativeAndroid.refreshThumbnails();
            }
            location.reload();
            break;
        default:
            break;
    }
}
//////////////////////////////////////
async function loadData(t) {

    const response = await fetch(`${baseUri}/api/videos`);
    if (response.status > 399 || response.status < 200) {
        throw new Error(`${response.status}: ${response.statusText}`)
    }
    return await response.json();

}

async function render() {
    try {
        const data = await loadData();
        customElements.whenDefined('custom-videos').then(() => {
            customVideos.data = data.sort((x, y) => {
                return y.update_at - x.update_at
            });
        })
        customVideos.host = baseUri;
    } catch (error) {
        console.log(error);
        return null;
    }
}
function onVideosHandler(evt) {
    customDialogActions.removeAttribute('style');
    customDialogActions.dataset.id = evt.detail;
}


async function onActionsHanlder(evt) {
    const id = evt.currentTarget.dataset.id;
    customDialogActions.setAttribute('style', 'display:none');
    switch (evt.detail) {
        case "0":
            console.log(id)
            if (typeof NativeAndroid !== 'undefined') {
                NativeAndroid.share(id)
            }
            break;
        case "1":
            break;
        case "2":
            window.open(`/video?q=${encodeURIComponent(`/api/videos?action=2&q=${id}`)}`)
            break;
        default:
            break;
    }
}
//////////////////////////////////////
let baseUri = window.location.host === '127.0.0.1:5500' ? 'http://192.168.0.109:10808' : '';


render();
