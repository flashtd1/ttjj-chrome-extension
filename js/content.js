chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    const { event, name, value } = request
    switch (event) {
        case 'changeFunds':
            window.localStorage.setItem('fund.web.compare', value)
            sendResponse('ok!')
            window.location.reload()
            break
        case 'addFunds':
            let funds = window.localStorage.getItem('fund.web.compare')
            let name = prompt('输入组合名称', '')
            chrome.extension.sendMessage({ event: 'saveFunds', name, value: funds  }, function (response) {
                console.log('收到来自后台的回复：' + response)
            })
            sendResponse('ok!')
            break
        default: 
            sendResponse('没找到事件')
            break
    }
})