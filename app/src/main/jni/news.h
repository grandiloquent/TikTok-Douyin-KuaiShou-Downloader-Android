#define NEWS "<!DOCTYPE html>\r\n<html lang=\"en\">\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>新闻</title>\r\n    <style>\r\n        html {\r\n            height: 100%;\r\n            overflow: hidden\r\n        }\r\n\r\n        body {\r\n            height: 100%;\r\n            overflow: hidden;\r\n            -webkit-font-smoothing: antialiased;\r\n            color: rgba(0, 0, 0, .87);\r\n            font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif;\r\n            margin: 0;\r\n            text-size-adjust: 100%\r\n        }\r\n\r\n        textarea {\r\n            font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif\r\n        }\r\n\r\n        a {\r\n            text-decoration: none;\r\n            color: #2962ff\r\n        }\r\n\r\n        img {\r\n            border: none\r\n        }\r\n\r\n        * {\r\n            -webkit-tap-highlight-color: transparent\r\n        }\r\n\r\n        .source:after {\r\n            content: \"\\0000a0\\002022\\0000a0\";\r\n            padding-right: 8px;\r\n            padding-left: 6px\r\n        }\r\n\r\n        .container {\r\n            overflow-y: scroll;\r\n            height: 100%;\r\n            padding: 8px 16px 16px 16px\r\n        }\r\n    </style>\r\n</head>\r\n\r\n<body>\r\n    <div class=\"container\">\r\n        <div style=\"-webkit-box-align: center;align-items: center;border-bottom: 1px solid #dadce0;margin: -12px -16px 0;padding: 8px 16px\">\r\n            <div style=\"display: flex;width: 100%;-webkit-box-pack: justify;justify-content: space-between\">\r\n                <div style=\"letter-spacing: .07272727em;font-family: Roboto,Arial,sans-serif;font-size: .6875rem;font-weight: 500;line-height: 1rem;text-transform: uppercase;display: flex;color: #202124;margin: 0;margin-top: 8px\">\r\n                </div>\r\n                <div style=\"display: inline-flex;-webkit-box-align: center;align-items: center;height: 32px\">\r\n                    <div class=\"next\" style=\"-webkit-font-smoothing: antialiased;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;text-size-adjust: 100%;-webkit-user-select: none;transition: background .3s;border: 0;border-radius: 50%;color: #444;cursor: pointer;display: inline-block;fill: #444;flex-shrink: 0;outline: none;overflow: hidden;position: relative;text-align: center;-webkit-tap-highlight-color: transparent;z-index: 0;margin: 0;border-width: 0;box-shadow: 0px 1px 2px 0px rgba(60,64,67,.30),0px 1px 3px 1px rgba(60,64,67,.15);height: 32px;margin-top: 4px;width: 32px\">\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"videos\"></div>\r\n        <div class=\"items\"></div>\r\n    </div>\r\n    <script>\r\n\r\n        function timeAgo(time, onlyDate) {\r\n            var stamp = new Date().getTime() - new Date(time).getTime();\r\n\r\n            //超过30天，返回具体日期\r\n            if (stamp > 1000 * 60 * 60 * 24 * 30) {\r\n                stamp = new Date(time).toLocaleString();\r\n                onlyDate && (stamp = stamp.replace(/\\s[\\S]+$/g, ''));\r\n                return stamp;\r\n            }\r\n\r\n            //30天以内，返回“多久前”\r\n            if (stamp >= 1000 * 60 * 60 * 24) {\r\n                return ((stamp / 1000 / 60 / 60 / 24) | 0) + '天前';\r\n            } else if (stamp >= 1000 * 60 * 60) {\r\n                return ((stamp / 1000 / 60 / 60) | 0) + '小时前';\r\n            } else if (stamp >= 1000 * 60 * 3) { //3分钟以内为：刚刚\r\n                return ((stamp / 1000 / 60) | 0) + '分钟前';\r\n            } else if (stamp < 0) {\r\n                return '未来';\r\n            } else {\r\n                return '刚刚';\r\n            }\r\n        }\r\n        function render(element, data) {\r\n            element.innerHTML = '';\r\n            data.forEach(value => {\r\n\r\n                const div = document.createElement('div');\r\n                div.innerHTML = `<div style=\"webkit-tap-highlight-color: transparent;border-top: 1px solid #e8eaed;display: block;padding: 12px 0\">\r\n        <div style=\"display: flex;-webkit-box-orient: horizontal;flex-direction: row\">\r\n            <div style=\"flex-grow: 1\">\r\n                <a href=\"${value.sourceUrl}\">\r\n                    <div\r\n                        style=\"-webkit-box-orient: horizontal;flex-direction: row;letter-spacing: .025em;font-family: Roboto,Arial,sans-serif;font-size: .75rem;font-weight: 400;line-height: 1rem;color: #5f6368;display: flex;flex-wrap: wrap\">\r\n                        <div class=\"source\" style=\"font-weight: 500\">\r\n                        ${value.source.name}\r\n                            </div>\r\n                        <div style=\"display: inline-flex\">\r\n                            ${timeAgo(value.publishedAt)}\r\n                        </div>\r\n                    </div>\r\n                    <div style=\"letter-spacing: .00625em;font-family: Roboto,Arial,sans-serif;font-size:\r\n                        1rem;line-height: 1.5rem;font-weight: 400;color: #202124;padding-top: 8px\">\r\n                    ${value.title}\r\n                        </div>\r\n                </a>\r\n            </div>\r\n            <a>\r\n                <img\r\n                src=\"${value.imageUrl}\"\r\n                    style=\"border: none;border-radius: 8px;object-fit: cover;align-self: end;margin-left: 16px;height: 80px;width: 120px\">\r\n            </a>\r\n        </div>\r\n    </div>`;\r\n                element.appendChild(div);\r\n            })\r\n        }\r\n        let baseUri = window.location.host === '127.0.0.1:5500' ? 'http://192.168.8.55:10808' : '';\r\n\r\n        async function loadData(from, size) {\r\n            const res = await fetch(`${baseUri}/api/news?from=${from}&size=${size}`);\r\n            const data = await res.json();\r\n            render(document.querySelector('.items'), data.articles);\r\n        }\r\n        async function writeText(strings) {\r\n            if (typeof NativeAndroid !== 'undefined')\r\n                NativeAndroid.writeText(strings);\r\n            else {\r\n                await navigator.clipboard.writeText(strings);\r\n            }\r\n        }\r\n        async function loadVideos() {\r\n            const res = await fetch(`${baseUri}/api/news-videos`);\r\n            const data = await res.json();\r\n            const element = document.querySelector('.videos');\r\n            data.subCards.forEach(value => {\r\n\r\n                const div = document.createElement('div');\r\n                div.innerHTML = `<div style=\"webkit-tap-highlight-color: transparent;border-top: 1px solid #e8eaed;display: block;padding: 12px 0\">\r\n<div style=\"display: flex;-webkit-box-orient: horizontal;flex-direction: row\">\r\n<div style=\"flex-grow: 1\">\r\n<a class=\"link\" >\r\n    <div\r\n        style=\"-webkit-box-orient: horizontal;flex-direction: row;letter-spacing: .025em;font-family: Roboto,Arial,sans-serif;font-size: .75rem;font-weight: 400;line-height: 1rem;color: #5f6368;display: flex;flex-wrap: wrap\">\r\n        <div class=\"source\" data-href=\"${value.url}\" style=\"font-weight: 500\">\r\n        ${value.provider.name}\r\n            </div>\r\n        <div style=\"display: inline-flex\">\r\n            ${timeAgo(value.publishedDateTime)}\r\n        </div>\r\n    </div>\r\n    <div class=\"item-content\" style=\"letter-spacing: .00625em;font-family: Roboto,Arial,sans-serif;font-size:\r\n        1rem;line-height: 1.5rem;font-weight: 400;color: #202124;padding-top: 8px\">\r\n    ${value.abstract}\r\n        </div>\r\n</a>\r\n</div>\r\n<a>\r\n<img\r\nsrc=\"${value.images[0].url}\" alt=\"${value.title}\"\r\n    style=\"border: none;border-radius: 8px;object-fit: cover;align-self: end;margin-left: 16px;height: 80px;width: 120px\">\r\n</a>\r\n</div>\r\n</div>`;\r\n                element.appendChild(div);\r\n            });\r\n            document.querySelectorAll('.videos .source')\r\n                .forEach(x => {\r\n                    x.addEventListener('click', async evt => {\r\n                        evt.preventDefault();\r\n                        await writeText(/(?<=\\/vi-)[a-zA-Z\\d]+/.exec(x.dataset.href)[0]);\r\n                    })\r\n                })\r\n                document.querySelectorAll('.videos .item-content')\r\n                .forEach(x => {\r\n                    x.addEventListener('click', async evt => {\r\n                        evt.preventDefault();\r\n                        await writeText(x.textContent.trim());\r\n                    })\r\n                })\r\n            document.querySelectorAll('.videos img')\r\n                .forEach(x => {\r\n                    x.addEventListener('click', async evt => {\r\n                        evt.preventDefault();\r\n                        await writeText(x.alt);\r\n                    })\r\n                })\r\n        }\r\n        loadVideos();\r\n\r\n        let start = 50;\r\n        loadData(0, 50);\r\n        document.querySelector('.next').addEventListener('click', evt => {\r\n            loadData(start, 50);\r\n            start += 50;\r\n        })\r\n    </script>\r\n</body>\r\n\r\n</html>"