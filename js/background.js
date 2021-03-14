chrome.contextMenus.create({
    type: 'normal',         // 类型，可选：["normal", "checkbox", "radio", "separator"]，默认 normal
    title: '保存本组比对',  // 显示的文字，除非为“separator”类型否则此参数必需，如果类型为“selection”，可以使用%s显示选定的文本
    contexts: ['page'],     // 上下文环境，可选：["all", "page", "frame", "selection", "link", "editable", "image", "video", "audio"]，默认page
    onclick: function () { 
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                event: 'addFunds'
            }, function (response) {
                console.log(response)
            })
        })
    }, // 单击时触发的方法
    documentUrlPatterns: ['http://fund.eastmoney.com/Compare/'] // 只在某些页面显示此右键菜单
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { event, name, value } = request
    switch (event) {
        case 'saveFunds':
            chrome.storage.local.get(['funds'], (res) => {
                if (res.funds) {
                    let funds = res.funds
                    let fund = funds.find(f => f.name == name)
                    if (fund) {
                        fund.codes = value.split(',')
                    } else {
                        funds.push({
                            name,
                            codes: value.split(',')
                        })
                    }
                    chrome.storage.local.set({ funds }, (res) => {
                        console.log('OK！')
                    })
                } else {
                    let values = [{
                        name,
                        codes: value
                    }]
                    chrome.storage.local.set({ funds: values }, (res) => {
                        console.log('OK！')
                    })
                }
            })
        break
    }
    sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request))
});