
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
});
//////////////////////////////////////////////
textarea.value = localStorage.getItem('contents') || '';

document.addEventListener('visibilitychange', () => {
    localStorage.setItem('contents', textarea.value);
});
//////////////////////////////////////////////
let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://192.168.0.109:10808' : '';
const searchParams = new URL(window.location.href).searchParams;
const id = searchParams.get('id');
/////////////////////////////////////////////

if (id) {

    render();
}
document.addEventListener('keydown', async evt => {
    console.log(evt.key)
    if (evt.ctrlKey) {
        switch (evt.key.toLowerCase()) {
            case 'space':
                evt.preventDefault();
                onSave();
                break;
            case 'c':
                if (textarea.selectionStart === textarea.selectionEnd) {
                    const p = findBlock(textarea);
                    await navigator.clipboard.writeText(textarea.value.substring(p[0], p[1]))
                    evt.preventDefault();
                }
                break;
        }

    }

})

async function onSave() {
    const firstLine = textarea.value.trim().split("\n", 2)[0];
    const obj = {
        content: substringAfter(textarea.value.trim(), "\n"),
        title: firstLine.replace(/^#+ +/, ''),
    };
    if (id) {
        obj._id = parseInt(id);
    }
    if (obj.title.indexOf('|') !== -1) {
        obj.tag = substringAfter(obj.title, '|').trim();
        obj.title = substringBefore(obj.title, '|').trim();
    }
    const response = await fetch(`${baseUri}/api/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    });
    console.log(response.status);
    const results = await response.json();
    if (results.id) {
        window.history.replaceState(null, null, '?id=' + results.id);
    }

}
async function loadData() {
    const response = await fetch(`${baseUri}/api/note?action=1&id=${id}`);
    return await response.json();
}
async function render() {
    textarea.value = localStorage.getItem("content");

    if (id) {
        try {
            const obj = await loadData();
            document.title = obj.title;
            textarea.value = `# ${obj.title}|${obj.tag}
        
${obj.content.trim()}
        `
        } catch (error) {
            console.log(error)
        }
    }
}