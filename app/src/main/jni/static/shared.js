
function getLine() {
    let start = textarea.selectionStart;
    const strings = textarea.value;
    if (strings[start] === '\n' && start - 1 > 0) {
        start--;
    }
    while (start > 0 && strings[start] != '\n') {
        start--;
    }
    let end = textarea.selectionEnd;
    while (end - 1 < strings.length && strings[end] != '\n') {
        end++;
    }
    return [strings.substring(start, end), start, end]
}
async function onTranslateChinese() {
    let array1 = getLine();
    textarea.setRangeText(`\n\n${await translate(array1[0], 'zh')
        }
  `, array1[1], array1[2], 'end');
}
async function onTranslateEnglish() {
    let array1 = getLine();
    textarea.setRangeText(`\n\n${await translate(array1[0], 'en')
        }
  `, array1[1], array1[2], 'end');
}
async function translate(value, to) {
    try {
        const response = await fetch(`${window.location.protocol}//kpkpkp.cn/api/trans?q=${encodeURIComponent(value.trim())}&to=${to}`);
        const obj = await response.json();
        return obj.sentences.map((element, index) => {
            return element.trans;
        }).join(' ');
    } catch (error) {
        console.log(error);
    }
}

function substringAfter(string, delimiter, missingDelimiterValue) {
    const index = string.indexOf(delimiter);
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
  function substringAfterLast(string, delimiter, missingDelimiterValue) {
    const index = string.lastIndexOf(delimiter);
    if (index === -1) {
      return missingDelimiterValue || string;
    } else {
      return string.substring(index + delimiter.length);
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
function findBlock(textarea) {
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    const strings = textarea.value;
    if (strings[start] === '\n' && start - 1 > 0) {
      start--;
    }
    let founded = false;
    while (start > 0) {
      if (strings[start] == '\n') {
        let j = start - 1;
        while (j > 0 && /\s/.test(strings[j])) {
          if (strings[j] === '\n') {
            founded = true;
            break;
          }
          j--;
        }
      }
      if (founded) {
        break
      }
      start--;
    }
    founded = false;
    while (end + 1 < strings.length) {
      if (strings[end] == '\n') {
        let j = end + 1;
        while (j + 1 < strings.length && /\s/.test(strings[j])) {
          if (strings[j] === '\n') {
            founded = true;
            break;
          }
          j++;
        }
      }
      if (founded) {
        break
      }
      end++;
    }
    return [start, end]
  
  }
  